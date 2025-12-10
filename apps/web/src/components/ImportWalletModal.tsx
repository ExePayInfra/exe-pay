'use client';

import { useState } from 'react';
import { validateMnemonic, keypairFromMnemonic, exportKeypair, validatePassword } from '@exe-pay/utils';
import { saveWallet } from '@/lib/wallet-storage';

interface ImportWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ImportWalletModal({ isOpen, onClose, onSuccess }: ImportWalletModalProps) {
  const [step, setStep] = useState<'mnemonic' | 'password'>('mnemonic');
  const [mnemonic, setMnemonic] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [walletName, setWalletName] = useState('Imported Wallet');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleMnemonicSubmit = () => {
    setError('');
    
    const trimmedMnemonic = mnemonic.trim().toLowerCase();
    
    // Validate mnemonic
    if (!validateMnemonic(trimmedMnemonic)) {
      setError('Invalid recovery phrase. Please check and try again.');
      return;
    }
    
    setMnemonic(trimmedMnemonic);
    setStep('password');
  };

  const handleImport = async () => {
    setError('');
    
    // Validate password
    const validation = validatePassword(password);
    if (!validation.valid) {
      setError(validation.message);
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      // Import keypair from mnemonic
      const keypair = keypairFromMnemonic(mnemonic);
      const exported = exportKeypair(keypair);
      
      // Save encrypted wallet
      await saveWallet(
        mnemonic,
        exported.privateKey,
        exported.publicKey,
        password,
        walletName
      );
      
      console.log('[Import Wallet] Wallet imported successfully');
      onSuccess();
      handleClose();
    } catch (err) {
      console.error('[Import Wallet] Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to import wallet');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('mnemonic');
    setMnemonic('');
    setPassword('');
    setConfirmPassword('');
    setWalletName('Imported Wallet');
    setError('');
    onClose();
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setMnemonic(text.trim());
    } catch (err) {
      setError('Failed to read from clipboard');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Import Wallet</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Enter Mnemonic */}
          {step === 'mnemonic' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl">ℹ️</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-900 mb-1">
                      Import Existing Wallet
                    </h3>
                    <p className="text-sm text-blue-800">
                      Enter your 12 or 24-word recovery phrase to restore your wallet.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recovery Phrase *
                </label>
                <textarea
                  value={mnemonic}
                  onChange={(e) => setMnemonic(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                  placeholder="word1 word2 word3 ..."
                  rows={4}
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">
                    Separate words with spaces
                  </p>
                  <button
                    onClick={handlePaste}
                    className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                  >
                    📋 Paste
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wallet Name
                </label>
                <input
                  type="text"
                  value={walletName}
                  onChange={(e) => setWalletName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Imported Wallet"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleMnemonicSubmit}
                disabled={!mnemonic.trim()}
                className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Set Password */}
          {step === 'password' && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-xl">✅</span>
                  <span className="text-sm font-medium text-green-900">
                    Recovery phrase validated successfully!
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12"
                    placeholder="Enter a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  This password will encrypt your wallet in this browser.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Confirm your password"
                  onKeyPress={(e) => e.key === 'Enter' && handleImport()}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('mnemonic')}
                  disabled={loading}
                  className="flex-1 py-3 px-6 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={handleImport}
                  disabled={loading || !password || !confirmPassword}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Importing...' : 'Import Wallet'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

