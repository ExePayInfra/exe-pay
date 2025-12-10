'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect } from 'react';
import { WalletDisconnectButton } from '@/components/WalletDisconnectButton';

/**
 * WalletConnectionGuard
 * Monitors wallet connections and ensures proper disconnection
 * Forces Phantom/Solflare to clear their internal connection cache
 */
export function WalletConnectionGuard({ children }: { children: React.ReactNode }) {
  const { disconnect, connected, wallet } = useWallet();

  useEffect(() => {
    // Listen for manual disconnect events
    const handleDisconnect = async () => {
      console.log('[ExePay Security] Disconnect requested - clearing all permissions');
      
      // Force disconnect from wallet adapter
      try {
        await disconnect();
      } catch (e) {
        console.error('[ExePay Security] Wallet adapter disconnect failed:', e);
      }

      // Force disconnect from Phantom directly
      if (typeof window !== 'undefined' && window.solana) {
        try {
          await window.solana.disconnect();
          console.log('[ExePay Security] Forced Phantom disconnect');
        } catch (e) {
          console.error('[ExePay Security] Phantom disconnect failed:', e);
        }
      }

      // Force disconnect from Solflare directly
      if (typeof window !== 'undefined' && window.solflare) {
        try {
          await window.solflare.disconnect();
          console.log('[ExePay Security] Forced Solflare disconnect');
        } catch (e) {
          console.error('[ExePay Security] Solflare disconnect failed:', e);
        }
      }

      // Clear all wallet-related storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('walletName');
        localStorage.removeItem('exepay-wallet-session');
        localStorage.removeItem('phantom_permission');
        localStorage.removeItem('solflare_permission');
        
        // Clear wallet adapter's internal state
        if (wallet?.adapter?.name) {
          const adapterName = wallet.adapter.name.toLowerCase();
          localStorage.removeItem(`${adapterName}_permission`);
        }
        
        console.log('[ExePay Security] Cleared all wallet permissions after disconnect');
      }
    };

    // Attach to window for easy access
    if (typeof window !== 'undefined') {
      (window as any).__exepayDisconnect = handleDisconnect;
    }

    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).__exepayDisconnect;
      }
    };
  }, [disconnect, wallet]);

  // Monitor connection changes
  useEffect(() => {
    if (!connected) {
      console.log('[ExePay Security] Wallet disconnected - state cleared');
    } else {
      console.log('[ExePay Security] Wallet connected:', wallet?.adapter?.name);
    }
  }, [connected, wallet]);

  return (
    <>
      <WalletDisconnectButton />
      {children}
    </>
  );
}

