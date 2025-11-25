'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';

interface CompressedAccountManagerProps {
  onAccountReady?: (account: PublicKey) => void;
}

export function CompressedAccountManager({ onAccountReady }: CompressedAccountManagerProps) {
  const { publicKey, signTransaction, connected } = useWallet();
  const [hasAccount, setHasAccount] = useState<boolean | null>(null);
  const [compressedAccount, setCompressedAccount] = useState<PublicKey | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing compressed account
  useEffect(() => {
    if (!publicKey || !connected) {
      setHasAccount(null);
      setCompressedAccount(null);
      return;
    }

    checkForCompressedAccount();
  }, [publicKey, connected]);

  const checkForCompressedAccount = async () => {
    if (!publicKey) return;

    try {
      console.log('[Compressed Account] Checking for existing account...');
      
      // Import Light Protocol utilities
      const { hasCompressedAccount, getLightProtocolClient } = await import('@/lib/lightProtocol');
      
      // Get Light Protocol client
      const lightRpc = getLightProtocolClient();
      
      // Check if account exists
      const exists = await hasCompressedAccount(lightRpc, publicKey);
      
      setHasAccount(exists);
      
      if (exists) {
        console.log('[Compressed Account] ✅ Account exists');
        setCompressedAccount(publicKey); // In demo mode, uses wallet pubkey
        onAccountReady?.(publicKey);
      } else {
        console.log('[Compressed Account] ℹ️  No account found');
      }
      
    } catch (err: any) {
      console.error('[Compressed Account] Error checking account:', err);
      setError(err.message);
    }
  };

  const createAccount = async () => {
    if (!publicKey || !signTransaction) {
      setError('Wallet not connected');
      return;
    }

    setCreating(true);
    setError(null);

    try {
      console.log('[Compressed Account] 🚀 Creating compressed account...');
      
      // Import Light Protocol functions
      const { createCompressedAccount, getLightProtocolClient } = await import('@/lib/lightProtocol');
      
      // Get RPC clients
      const lightRpc = getLightProtocolClient();
      const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
      const connection = new Connection(rpcUrl, 'confirmed');
      
      // Create compressed account
      const result = await createCompressedAccount(
        lightRpc,
        connection,
        publicKey,
        signTransaction
      );
      
      console.log('[Compressed Account] ✅ Account created!');
      console.log('[Compressed Account] Address:', result.account.toString());
      console.log('[Compressed Account] Signature:', result.signature);
      
      setCompressedAccount(result.account);
      setHasAccount(true);
      onAccountReady?.(result.account);
      
    } catch (err: any) {
      console.error('[Compressed Account] ❌ Failed to create account:', err);
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  // Don't show anything if wallet not connected
  if (!connected || !publicKey) {
    return null;
  }

  // Loading state
  if (hasAccount === null) {
    return (
      <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
          <span className="text-sm text-purple-700">Checking for compressed account...</span>
        </div>
      </div>
    );
  }

  // Account exists
  if (hasAccount && compressedAccount) {
    return (
      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-green-900">Compressed Account Active</h3>
              <p className="text-xs text-green-700 mt-1">
                Ready for Light Protocol privacy features
              </p>
            </div>
          </div>
          <div className="text-xs text-green-600 font-mono bg-green-100 px-2 py-1 rounded">
            {compressedAccount.toString().slice(0, 8)}...{compressedAccount.toString().slice(-6)}
          </div>
        </div>
      </div>
    );
  }

  // Need to create account
  return (
    <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h3 className="text-sm font-semibold text-purple-900">Enable Light Protocol Privacy</h3>
          </div>
          <p className="text-xs text-purple-700 mb-3">
            Create a compressed account to use Light Protocol's true on-chain privacy features. 
            This is a one-time setup that enables shielded balances and private transfers.
          </p>
          
          {error && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
              {error}
            </div>
          )}
          
          <button
            onClick={createAccount}
            disabled={creating}
            className="w-full px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {creating ? (
              <span className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Creating Compressed Account...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center space-x-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Create Compressed Account</span>
              </span>
            )}
          </button>
          
          <p className="text-xs text-purple-600 mt-2 text-center">
            💡 This enables true privacy - sender, receiver, and amounts hidden on-chain
          </p>
        </div>
      </div>
    </div>
  );
}

