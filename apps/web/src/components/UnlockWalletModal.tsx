'use client';

import { useState } from 'react';
import { loadWallet, getWalletName, setWalletSession } from '@/lib/wallet-storage';
import { keypairFromMnemonic } from '@exe-pay/utils';

interface UnlockWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function UnlockWalletModal({ isOpen, onClose, onSuccess }: UnlockWalletModalProps) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const walletName = getWalletName() || 'ExePay Wallet';

  const handleUnlock = async () => {
    setError('');
    setLoading(true);

    try {
      // Load and decrypt wallet
      const wallet = await loadWallet(password);
      
      // Create keypair from mnemonic
      const keypair = keypairFromMnemonic(wallet.mnemonic);
      
      // Set session
      setWalletSession(keypair);
      
      console.log('[Unlock Wallet] Wallet unlocked successfully');
      onSuccess();
      handleClose();
    } catch (err) {
      console.error('[Unlock Wallet] Error:', err);
      setError('Incorrect password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Unlock Wallet</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔒</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {walletName}
            </h3>
            <p className="text-sm text-gray-600">
              Enter your password to unlock
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12"
                  placeholder="Enter your password"
                  onKeyPress={(e) => e.key === 'Enter' && handleUnlock()}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleUnlock}
              disabled={loading || !password}
              className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Unlocking...' : 'Unlock Wallet'}
            </button>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Session expires after 30 minutes of inactivity
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

