'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import Image from 'next/image';

interface SecureWalletConnectProps {
  onConnected?: () => void;
  showHeader?: boolean;
  children?: React.ReactNode;
}

/**
 * SecureWalletConnect - Secure wallet connection component with signature verification
 * 
 * This component ensures:
 * 1. Wallet must be UNLOCKED before connection completes
 * 2. User must sign a test message to verify wallet is unlocked
 * 3. Cannot bypass security by keeping wallet locked
 * 4. Matches production deployment security standards
 * 
 * Use this component for ALL wallet connections across the app.
 */
export function SecureWalletConnect({ onConnected, showHeader = true, children }: SecureWalletConnectProps) {
  const { publicKey, connected, disconnect, select, wallets, wallet } = useWallet();
  const [showWalletSelector, setShowWalletSelector] = useState(false);
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);
  const [verifiedConnection, setVerifiedConnection] = useState(false);
  const [error, setError] = useState('');

  // Check if wallet is already connected and verified on mount
  useEffect(() => {
    if (connected && publicKey) {
      // Check sessionStorage for verified connection
      const verifiedKey = sessionStorage.getItem('exepay_verified_wallet');
      if (verifiedKey === publicKey.toString()) {
        console.log('[ExePay Security] Wallet already verified in this session');
        setVerifiedConnection(true);
      }
    } else {
      setVerifiedConnection(false);
      sessionStorage.removeItem('exepay_verified_wallet');
    }
  }, [connected, publicKey]);

  // Call onConnected callback when wallet is verified
  useEffect(() => {
    if (connected && verifiedConnection && onConnected) {
      onConnected();
    }
  }, [connected, verifiedConnection, onConnected]);

  const handleWalletSelect = async (walletName: string) => {
    try {
      setError('');
      setConnectingWallet(walletName);
      const selectedWallet = wallets.find(w => w.adapter.name === walletName);
      if (!selectedWallet) {
        throw new Error('Wallet not found');
      }

      // Check if wallet is already connected
      if (selectedWallet.adapter.connected) {
        console.warn(`[ExePay Security] ${walletName} already connected - disconnecting first`);
        try {
          await selectedWallet.adapter.disconnect();
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (disconnectErr) {
          console.error('Failed to disconnect:', disconnectErr);
        }
      }

      // Select and connect
      select(selectedWallet.adapter.name);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log(`[ExePay] Attempting to connect to ${walletName}...`);
      await selectedWallet.adapter.connect();
      
      if (!selectedWallet.adapter.publicKey) {
        throw new Error('Connection failed - no public key received. Please try again.');
      }
      
      // CRITICAL SECURITY CHECK: Verify wallet is unlocked via signature
      try {
        console.log(`[ExePay Security] Verifying ${walletName} is unlocked by requesting test signature...`);
        
        const testMessage = new TextEncoder().encode(
          `ExePay Security Check - ${Date.now()}\n\nThis signature verifies your wallet is unlocked.\nNo transaction will be made.`
        );
        
        const signature = await selectedWallet.adapter.signMessage!(testMessage);
        
        if (!signature || signature.length === 0) {
          throw new Error('Signature verification failed');
        }
        
        console.log(`[ExePay Security] ${walletName} wallet verified as unlocked ✅`);
        console.log(`[ExePay Security] Signature received (${signature.length} bytes)`);
        
        // Store verified connection in sessionStorage
        if (selectedWallet.adapter.publicKey) {
          sessionStorage.setItem('exepay_verified_wallet', selectedWallet.adapter.publicKey.toString());
        }
        
        setVerifiedConnection(true);
      } catch (verifyErr: any) {
        console.error(`[ExePay Security] ${walletName} verification failed:`, verifyErr);
        
        try {
          await selectedWallet.adapter.disconnect();
        } catch (disconnectErr) {
          console.error('Failed to disconnect:', disconnectErr);
        }
        
        setVerifiedConnection(false);
        
        if (verifyErr.message?.includes('User rejected') || verifyErr.code === 4001) {
          throw new Error('Signature request rejected. Connection cancelled for security.');
        } else {
          throw new Error(`Could not verify ${walletName} is unlocked. Please make sure your wallet is unlocked and try again.`);
        }
      }

      console.log(`[ExePay] Successfully connected to ${walletName}`);
      setShowWalletSelector(false);
    } catch (err: any) {
      console.error('Failed to connect wallet:', err);
      
      let errorMessage = `Failed to connect to ${walletName}.`;
      
      if (err.message?.includes('User rejected') || err.message?.includes('User cancelled') || err.code === 4001) {
        errorMessage = 'Connection rejected. Please approve the connection in your wallet.';
      } else if (err.message?.includes('locked')) {
        errorMessage = `${walletName} wallet is locked. Please unlock your wallet and try again.`;
      } else {
        errorMessage += ` ${err.message || 'Please make sure it\'s installed and try again.'}`;
      }
      
      setError(errorMessage);
    } finally {
      setConnectingWallet(null);
    }
  };

  const handleChangeWallet = async () => {
    try {
      setVerifiedConnection(false);
      sessionStorage.removeItem('exepay_verified_wallet');
      await disconnect();
      setShowWalletSelector(true);
      setError('');
    } catch (err) {
      console.error('Failed to disconnect:', err);
    }
  };

  const handleDisconnect = async () => {
    try {
      setVerifiedConnection(false);
      sessionStorage.removeItem('exepay_verified_wallet');
      await disconnect();
    } catch (err) {
      console.error('Failed to disconnect:', err);
    }
  };

  // Show wallet selector if not connected or not verified
  if ((!connected || !verifiedConnection) || showWalletSelector) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-2xl text-center border border-gray-200">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {showWalletSelector ? 'Choose a Different Wallet' : 'Connect Your Wallet'}
        </h3>
        <p className="text-gray-600 mb-6">
          {showWalletSelector ? 'Select a wallet to connect' : 'Choose your preferred Solana wallet'}
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Wallet List */}
        <div className="space-y-3 mb-6">
          {wallets
            .filter(w => w.readyState === 'Installed' || w.readyState === 'Loadable')
            .filter((w, index, self) =>
              index === self.findIndex(wallet => wallet.adapter.name === w.adapter.name)
            )
            .sort((a, b) => {
              const priority = ['Phantom', 'Solflare', 'Coinbase', 'Trust'];
              const aIndex = priority.indexOf(a.adapter.name);
              const bIndex = priority.indexOf(b.adapter.name);
              if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
              if (aIndex !== -1) return -1;
              if (bIndex !== -1) return 1;
              return 0;
            })
            .map((w) => (
            <button
              key={w.adapter.name}
              onClick={() => handleWalletSelect(w.adapter.name)}
              disabled={connectingWallet !== null}
              className="w-full p-4 bg-white hover:bg-indigo-50 border-2 border-gray-200 hover:border-indigo-500 rounded-xl transition-all duration-200 flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {w.adapter.icon && (
                <div className="w-10 h-10 flex-shrink-0">
                  <Image
                    src={w.adapter.icon}
                    alt={w.adapter.name}
                    width={40}
                    height={40}
                    className="rounded-lg"
                  />
                </div>
              )}
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {w.adapter.name}
                </p>
                <p className="text-xs text-gray-500">
                  {w.readyState === 'Installed' ? '✅ Detected' : '📲 Available'}
                </p>
              </div>
              {connectingWallet === w.adapter.name ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-600 border-t-transparent"></div>
              ) : (
                <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
          ))}
        </div>

        {/* Cancel Button */}
        {showWalletSelector && (
          <button
            onClick={() => setShowWalletSelector(false)}
            className="w-full py-3 px-6 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200"
          >
            Cancel
          </button>
        )}

        {/* Help Text */}
        <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
          <p className="text-xs text-indigo-900 font-semibold mb-2">💡 Don't see your wallet?</p>
          <p className="text-xs text-gray-600">
            Make sure your wallet app is installed. On mobile, you may be redirected to install it.
          </p>
        </div>
      </div>
    );
  }

  // Wallet is connected and verified
  return (
    <>
      {showHeader && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            {wallet?.adapter.icon && (
              <div className="w-10 h-10 flex-shrink-0">
                <Image
                  src={wallet.adapter.icon}
                  alt={wallet.adapter.name}
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500">Connected: {wallet?.adapter.name}</p>
              <p className="text-sm text-gray-900 font-mono font-semibold">
                {publicKey?.toString().slice(0, 6)}...{publicKey?.toString().slice(-6)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleChangeWallet}
              className="py-2 px-4 rounded-lg font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-all duration-200 text-sm whitespace-nowrap"
            >
              Change Wallet
            </button>
            <button
              onClick={handleDisconnect}
              className="py-2 px-4 rounded-lg font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-all duration-200 text-sm whitespace-nowrap"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}
      {children}
    </>
  );
}

