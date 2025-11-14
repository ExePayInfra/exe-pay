'use client';

import { useMemo, useEffect, useState } from 'react';
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
  
  useEffect(() => {
    setMounted(true);
    
    // Only load wallets in the browser
    import('@solana/wallet-adapter-wallets').then(({ PhantomWalletAdapter, SolflareWalletAdapter }) => {
      setWallets([
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter(),
      ]);
    }).catch(err => {
      console.error('Failed to load wallet adapters:', err);
    });
  }, []);

  // Don't render wallet provider until we're mounted on the client
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}

