'use client';

import { useState } from 'react';
import { generateWallet, exportKeypair, validatePassword } from '@exe-pay/utils';
import { saveWallet } from '@/lib/wallet-storage';

interface CreateWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateWalletModal({ isOpen, onClose, onSuccess }: CreateWalletModalProps) {
  const [step, setStep] = useState<'password' | 'backup' | 'confirm'>('password');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [walletName, setWalletName] = useState('My ExePay Wallet');
  const [mnemonic, setMnemonic] = useState('');
  const [confirmedBackup, setConfirmedBackup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const handlePasswordSubmit = () => {
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
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    // Generate wallet
    const { mnemonic: newMnemonic } = generateWallet();
    setMnemonic(newMnemonic);
    setStep('backup');
  };

  const handleCopyMnemonic = async () => {
    try {
      await navigator.clipboard.writeText(mnemonic);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  const handleConfirmBackup = () => {
    if (!confirmedBackup) {
      setError('Please confirm you have saved your recovery phrase');
      return;
    }
    setStep('confirm');
  };

  const handleFinalCreate = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Import keypair from mnemonic
      const { keypairFromMnemonic } = await import('@exe-pay/utils');
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
      
      console.log('[Create Wallet] Wallet created successfully');
      onSuccess();
      handleClose();
    } catch (err) {
      console.error('[Create Wallet] Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create wallet');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset state
    setStep('password');
    setPassword('');
    setConfirmPassword('');
    setWalletName('My ExePay Wallet');
    setMnemonic('');
    setConfirmedBackup(false);
    setError('');
    setCopied(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Create New Wallet</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className={`flex items-center ${step === 'password' ? 'text-purple-600' : 'text-green-600'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'password' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'}`}>
                {step === 'password' ? '1' : '✓'}
              </div>
              <span className="ml-2 text-sm font-medium">Password</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300 mx-4"></div>
            <div className={`flex items-center ${step === 'backup' ? 'text-purple-600' : step === 'confirm' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'backup' ? 'bg-purple-100 text-purple-600' : step === 'confirm' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                {step === 'confirm' ? '✓' : '2'}
              </div>
              <span className="ml-2 text-sm font-medium">Backup</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300 mx-4"></div>
            <div className={`flex items-center ${step === 'confirm' ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'confirm' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'}`}>
                3
              </div>
              <span className="ml-2 text-sm font-medium">Confirm</span>
            </div>
          </div>

          {/* Step 1: Password */}
          {step === 'password' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wallet Name
                </label>
                <input
                  type="text"
                  value={walletName}
                  onChange={(e) => setWalletName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="My ExePay Wallet"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
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
                  At least 8 characters. Used to encrypt your wallet.
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
                  onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handlePasswordSubmit}
                disabled={!password || !confirmPassword}
                className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Backup Recovery Phrase */}
          {step === 'backup' && (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-yellow-900 mb-1">
                      Save Your Recovery Phrase
                    </h3>
                    <p className="text-sm text-yellow-800">
                      Write down these 12 words in order. Store them securely offline. 
                      <strong className="block mt-1">Never share them with anyone!</strong>
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6">
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {mnemonic.split(' ').map((word, index) => (
                    <div key={index} className="flex items-center gap-2 bg-white p-3 rounded border border-gray-200">
                      <span className="text-xs text-gray-500 font-medium">{index + 1}.</span>
                      <span className="font-mono text-sm">{word}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleCopyMnemonic}
                  className="w-full py-2 px-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  {copied ? '✓ Copied!' : '📋 Copy to Clipboard'}
                </button>
              </div>

              <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <input
                  type="checkbox"
                  checked={confirmedBackup}
                  onChange={(e) => setConfirmedBackup(e.target.checked)}
                  className="mt-1"
                  id="confirm-backup"
                />
                <label htmlFor="confirm-backup" className="text-sm text-blue-900 flex-1 cursor-pointer">
                  I have saved my recovery phrase securely. I understand that if I lose it, 
                  I will lose access to my wallet and funds forever.
                </label>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('password')}
                  className="flex-1 py-3 px-6 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirmBackup}
                  disabled={!confirmedBackup}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Final Confirmation */}
          {step === 'confirm' && (
            <div className="space-y-4">
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎉</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  You're All Set!
                </h3>
                <p className="text-gray-600">
                  Your wallet is ready to be created. Click the button below to finalize.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Wallet Name:</span>
                  <span className="font-medium">{walletName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Encryption:</span>
                  <span className="font-medium text-green-600">AES-256</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Storage:</span>
                  <span className="font-medium">Local (Browser)</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('backup')}
                  disabled={loading}
                  className="flex-1 py-3 px-6 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={handleFinalCreate}
                  disabled={loading}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create Wallet'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

