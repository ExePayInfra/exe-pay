'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useRef } from 'react';

/**
 * SecureWalletButton - Wraps WalletMultiButton with enhanced security
 * Forces FULL disconnect including Phantom's internal state
 */
export function SecureWalletButton({ className }: { className?: string }) {
  const { disconnect, wallet, connected } = useWallet();
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!buttonRef.current) return;

    // Find the actual wallet button
    const walletButton = buttonRef.current.querySelector('button');
    if (!walletButton) return;

    // Intercept clicks on the button
    const handleClick = async (e: MouseEvent) => {
      // Check if this is a disconnect action
      // The dropdown will be open if user is connected
      const isDisconnectAction = connected && walletButton.getAttribute('aria-expanded') === 'true';
      
      if (isDisconnectAction) {
        console.log('[ExePay Security] Intercepting disconnect click');
        
        // Small delay to let the dropdown appear
        setTimeout(async () => {
          // Force full disconnect
          console.log('[ExePay Security] Starting forced disconnect...');
          
          try {
            // Disconnect from wallet adapter
            await disconnect();
            console.log('[ExePay Security] Wallet adapter disconnected');
          } catch (err) {
            console.error('[ExePay Security] Adapter disconnect error:', err);
          }

          // Force disconnect Phantom
          if (typeof window !== 'undefined' && window.solana) {
            try {
              await window.solana.disconnect();
              console.log('[ExePay Security] Phantom force disconnected');
            } catch (err) {
              console.error('[ExePay Security] Phantom disconnect error:', err);
            }
          }

          // Force disconnect Solflare
          if (typeof window !== 'undefined' && window.solflare) {
            try {
              await window.solflare.disconnect();
              console.log('[ExePay Security] Solflare force disconnected');
            } catch (err) {
              console.error('[ExePay Security] Solflare disconnect error:', err);
            }
          }

          // Clear all storage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('walletName');
            localStorage.removeItem('exepay-wallet-session');
            localStorage.removeItem('phantom_permission');
            localStorage.removeItem('solflare_permission');
            
            if (wallet?.adapter?.name) {
              const name = wallet.adapter.name.toLowerCase();
              localStorage.removeItem(`${name}_permission`);
            }
            
            console.log('[ExePay Security] All wallet storage cleared');
          }
        }, 100);
      }
    };

    // Add click listener
    walletButton.addEventListener('click', handleClick);

    return () => {
      walletButton.removeEventListener('click', handleClick);
    };
  }, [disconnect, wallet, connected]);

  // Also listen for disconnect from the dropdown menu
  useEffect(() => {
    if (!connected) return;

    const handleDocumentClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if user clicked "Disconnect" in the dropdown
      if (target.textContent?.includes('Disconnect') || target.closest('[class*="wallet-adapter-dropdown-list-item"]')) {
        console.log('[ExePay Security] Disconnect menu item clicked');
        
        setTimeout(async () => {
          // Force full cleanup
          if (typeof window !== 'undefined') {
            if (window.solana) {
              try {
                await window.solana.disconnect();
                console.log('[ExePay Security] Phantom fully disconnected via menu');
              } catch (e) {
                console.error('[ExePay Security] Phantom menu disconnect error:', e);
              }
            }
            
            if (window.solflare) {
              try {
                await window.solflare.disconnect();
                console.log('[ExePay Security] Solflare fully disconnected via menu');
              } catch (e) {
                console.error('[ExePay Security] Solflare menu disconnect error:', e);
              }
            }

            // Clear storage
            localStorage.removeItem('walletName');
            localStorage.removeItem('exepay-wallet-session');
            localStorage.removeItem('phantom_permission');
            localStorage.removeItem('solflare_permission');
            
            console.log('[ExePay Security] Full disconnect via menu complete');
          }
        }, 500); // Longer delay for menu action
      }
    };

    document.addEventListener('click', handleDocumentClick);
    
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [connected, wallet]);

  return (
    <div ref={buttonRef}>
      <WalletMultiButton className={className} />
    </div>
  );
}

