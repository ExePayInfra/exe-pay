'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { clearWalletSession } from '@/lib/wallet-storage';
import { useState } from 'react';

export function WalletDisconnectButton() {
  const { disconnect, connected, publicKey, wallet } = useWallet();
  const router = useRouter();
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  if (!connected || !publicKey) {
    return null;
  }

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      // Clear ExePay wallet session
      clearWalletSession();
      
      // Disconnect from wallet adapter
      await disconnect();
      
      console.log('[Disconnect] Wallet disconnected successfully');
      
      // Redirect to home
      router.push('/');
    } catch (err) {
      console.error('[Disconnect] Error:', err);
    } finally {
      setIsDisconnecting(false);
    }
  };

  const walletName = wallet?.adapter.name || 'Wallet';
  const shortAddress = `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`;

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100 p-3 animate-slideDown">
      {/* Wallet Info */}
      <div className="flex items-center gap-3">
        {wallet?.adapter.icon && (
          <img 
            src={wallet.adapter.icon} 
            alt={walletName}
            className="w-8 h-8 rounded-full"
          />
        )}
        <div className="flex flex-col">
          <span className="text-xs font-medium text-purple-600">{walletName}</span>
          <span className="text-sm font-mono text-gray-700">{shortAddress}</span>
        </div>
      </div>

      {/* Disconnect Button */}
      <button
        onClick={handleDisconnect}
        disabled={isDisconnecting}
        className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:scale-105"
      >
        {isDisconnecting ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Disconnecting...
          </span>
        ) : (
          'Disconnect'
        )}
      </button>
    </div>
  );
}

