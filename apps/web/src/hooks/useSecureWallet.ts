'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useCallback } from 'react';

/**
 * Custom hook to enforce secure wallet connections
 * - Ensures wallet always asks for approval
 * - Disconnects wallet on page load/refresh
 * - Clears cached permissions
 */
export function useSecureWallet() {
  const wallet = useWallet();

  // Force disconnect on mount to ensure fresh connection every time
  useEffect(() => {
    const forceDisconnect = async () => {
      if (wallet.connected) {
        try {
          await wallet.disconnect();
          console.log('[Security] Forced disconnect on page load');
        } catch (error) {
          console.error('[Security] Failed to disconnect:', error);
        }
      }
      
      // Clear all wallet-related localStorage items
      if (typeof window !== 'undefined') {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (
            key.includes('wallet') || 
            key.includes('phantom') || 
            key.includes('solflare') ||
            key.includes('solana')
          )) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => {
          localStorage.removeItem(key);
          console.log(`[Security] Cleared cached permission: ${key}`);
        });
      }
    };

    forceDisconnect();
  }, []); // Only run once on mount

  // Secure connect function that ensures wallet popup appears
  const secureConnect = useCallback(async () => {
    try {
      // First, ensure we're fully disconnected
      if (wallet.connected) {
        await wallet.disconnect();
        // Wait a bit for disconnect to complete
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // Clear any cached wallet permissions
      if (typeof window !== 'undefined' && wallet.wallet?.adapter) {
        const walletName = wallet.wallet.adapter.name.toLowerCase();
        localStorage.removeItem(`${walletName}_permission`);
        localStorage.removeItem('walletName');
        localStorage.removeItem('exepay-wallet-session');
      }

      // Now connect - this should trigger wallet popup
      console.log('[Security] Initiating secure connection...');
      await wallet.connect();
      console.log('[Security] Connection approved by user');
      
      return true;
    } catch (error: any) {
      if (error.name === 'WalletNotReadyError') {
        console.error('[Security] Wallet not installed');
      } else if (error.name === 'WalletConnectionError') {
        console.error('[Security] User rejected connection');
      } else {
        console.error('[Security] Connection failed:', error);
      }
      return false;
    }
  }, [wallet]);

  // Secure disconnect that clears everything
  const secureDisconnect = useCallback(async () => {
    try {
      await wallet.disconnect();
      
      // Clear all related storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('walletName');
        localStorage.removeItem('exepay-wallet-session');
        if (wallet.wallet?.adapter) {
          const walletName = wallet.wallet.adapter.name.toLowerCase();
          localStorage.removeItem(`${walletName}_permission`);
        }
      }
      
      console.log('[Security] Secure disconnect complete');
      return true;
    } catch (error) {
      console.error('[Security] Disconnect failed:', error);
      return false;
    }
  }, [wallet]);

  return {
    ...wallet,
    secureConnect,
    secureDisconnect,
  };
}

