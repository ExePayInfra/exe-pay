'use client';

import { useMemo, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
import type { Adapter } from '@solana/wallet-adapter-base';

// Dynamically import WalletModalProvider to avoid SSR issues
const WalletModalProvider = dynamic(
  async () => {
    const { WalletModalProvider } = await import('@solana/wallet-adapter-react-ui');
    // Import styles
    await import('@solana/wallet-adapter-react-ui/styles.css');
    return WalletModalProvider;
  },
  { ssr: false }
);

/**
 * ClientWalletProvider - Client-side only wallet provider
 * This component is guaranteed to only run in the browser, avoiding SSR issues
 */
export function ClientWalletProvider({ children }: { children: ReactNode }) {
  // Use environment variable for network selection
  const networkEnv = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
  const network = networkEnv === 'mainnet-beta' 
    ? WalletAdapterNetwork.Mainnet 
    : WalletAdapterNetwork.Devnet;
  
  // Use custom RPC URL if provided, otherwise use default cluster URL
  const endpoint = useMemo(() => {
    const customRpc = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
    return customRpc || clusterApiUrl(network);
  }, [network]);

  // State to track if we're mounted (client-side)
  const [mounted, setMounted] = useState(false);
  
  // Lazy-load wallet adapters only on client side
  const [wallets, setWallets] = useState<Adapter[]>([]);
  
  // Custom onError handler to force full disconnect
  const handleError = useCallback((error: any) => {
    console.error('[ExePay Security] Wallet error:', error);
    // Force full disconnect on error
    if (typeof window !== 'undefined') {
      window.solana?.disconnect?.();
      window.solflare?.disconnect?.();
    }
  }, []);

  // Force disconnect from Phantom/Solflare on page load (DESKTOP ONLY)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if we're on mobile - DON'T force disconnect on mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        window.navigator.userAgent
      );
      
      if (isMobile) {
        console.log('[ExePay Security] Mobile detected - skipping force disconnect for better UX');
        return;
      }
      
      // Desktop only: Disconnect Phantom if connected
      if (window.solana?.isPhantom && window.solana.isConnected) {
        try {
          window.solana.disconnect();
          console.log('[ExePay Security] Disconnected Phantom on page load (Desktop)');
        } catch (e) {
          console.error('[ExePay Security] Failed to disconnect Phantom:', e);
        }
      }
      
      // Desktop only: Disconnect Solflare if connected
      if (window.solflare?.isConnected) {
        try {
          window.solflare.disconnect();
          console.log('[ExePay Security] Disconnected Solflare on page load (Desktop)');
        } catch (e) {
          console.error('[ExePay Security] Failed to disconnect Solflare:', e);
        }
      }
    }
  }, []);
  
  useEffect(() => {
    setMounted(true);
    
    // Only load wallets in the browser
    console.log('[ExePay] Loading wallet adapters...');
    import('@solana/wallet-adapter-wallets').then((walletModule) => {
      console.log('[ExePay] Wallet module loaded');
      
      // Detect if we're on mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        typeof window !== 'undefined' ? window.navigator.userAgent : ''
      );
      
      console.log('[ExePay] Is mobile:', isMobile);
      
      // Safely instantiate wallets - only add ones that exist
      const walletList: Adapter[] = [];
      
      // Try each wallet adapter individually
      const adapters = [
        { name: 'Phantom', Adapter: walletModule.PhantomWalletAdapter },
        { name: 'Solflare', Adapter: walletModule.SolflareWalletAdapter },
        { name: 'Coinbase', Adapter: walletModule.CoinbaseWalletAdapter },
        { name: 'Trust', Adapter: walletModule.TrustWalletAdapter },
        { name: 'Backpack', Adapter: walletModule.BackpackWalletAdapter },
        { name: 'Glow', Adapter: walletModule.GlowWalletAdapter },
        { name: 'Brave', Adapter: walletModule.BraveWalletAdapter },
        { name: 'Slope', Adapter: walletModule.SlopeWalletAdapter },
        { name: 'Torus', Adapter: walletModule.TorusWalletAdapter },
        { name: 'Ledger', Adapter: walletModule.LedgerWalletAdapter },
      ];
      
      for (const { name, Adapter: WalletAdapter } of adapters) {
        try {
          if (WalletAdapter && typeof WalletAdapter === 'function') {
            walletList.push(new WalletAdapter());
            console.log(`[ExePay] ✅ ${name} adapter loaded`);
          } else {
            console.log(`[ExePay] ⚠️ ${name} adapter not available`);
          }
        } catch (err) {
          console.error(`[ExePay] ❌ Failed to load ${name}:`, err);
        }
      }
      
      console.log('[ExePay] Total wallets configured:', walletList.length);
      setWallets(walletList);
    }).catch(err => {
      console.error('[ExePay] Failed to load wallet adapters:', err);
      console.error('[ExePay] Error details:', err.message, err.stack);
    });

    // Clear ALL wallet-related cache on mount to force fresh connections (DESKTOP ONLY)
    if (typeof window !== 'undefined') {
      // Check if we're on mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        window.navigator.userAgent
      );
      
      if (isMobile) {
        console.log('[ExePay Security] Mobile detected - preserving wallet cache for better UX');
        return;
      }
      
      // Desktop only: Clear our app's wallet session
      localStorage.removeItem('exepay-wallet-session');
      localStorage.removeItem('walletName');
      
      // Desktop only: Clear Phantom's cached permission
      localStorage.removeItem('phantom_permission');
      
      // Desktop only: Clear Solflare's cached permission
      localStorage.removeItem('solflare_permission');
      
      // Desktop only: Clear any other wallet adapter cache
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.toLowerCase().includes('wallet') && key.includes('permission')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      console.log('[ExePay Security] Cleared cached wallet permissions for fresh session (Desktop)');
    }

    // Clear wallet connection on tab/window close (session-based)
    const handleBeforeUnload = () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('exepay-wallet-session');
        localStorage.removeItem('walletName');
        localStorage.removeItem('phantom_permission');
        localStorage.removeItem('solflare_permission');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Don't render wallet provider until we're mounted on the client
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider 
        wallets={wallets} 
        autoConnect={false}
        localStorageKey={null} // Don't use localStorage at all - forces fresh connection
        onError={handleError}
      >
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}

