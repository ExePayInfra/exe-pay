'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { CreateWalletModal } from '@/components/CreateWalletModal';
import { ImportWalletModal } from '@/components/ImportWalletModal';
import { UnlockWalletModal } from '@/components/UnlockWalletModal';
import { TwitterLoginButton } from '@/components/TwitterLoginButton';
import { 
  hasStoredWallet, 
  hasActiveSession, 
  getPublicKey, 
  getWalletName,
  clearWalletSession,
  deleteWallet,
  exportWalletBackup,
} from '@/lib/wallet-storage';

export default function WalletPage() {
  const router = useRouter();
  const { connection } = useConnection();
  const { select, connect, disconnect, publicKey: walletPublicKey, connected } = useWallet();
  
  const [hasWallet, setHasWallet] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [walletName, setWalletName] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportPassword, setExportPassword] = useState('');
  const [exportData, setExportData] = useState<string>('');
  const [exportError, setExportError] = useState('');

  useEffect(() => {
    checkWalletStatus();
  }, []);

  // Auto-connect ExePay wallet if unlocked
  useEffect(() => {
    if (hasWallet && isUnlocked && !connected) {
      console.log('[Wallet Page] Auto-connecting ExePay wallet...');
      select('ExePay');
      setTimeout(() => {
        connect().catch(err => {
          console.error('[Wallet Page] Auto-connect failed:', err);
        });
      }, 500);
    }
  }, [hasWallet, isUnlocked, connected, select, connect]);

  // Fetch balance when connected
  useEffect(() => {
    if (walletPublicKey && connection) {
      fetchBalance();
    }
  }, [walletPublicKey, connection]);

  const checkWalletStatus = () => {
    const stored = hasStoredWallet();
    const unlocked = hasActiveSession();
    
    setHasWallet(stored);
    setIsUnlocked(unlocked);
    
    if (stored) {
      setPublicKey(getPublicKey());
      setWalletName(getWalletName());
    }
  };

  const fetchBalance = async () => {
    if (!walletPublicKey) return;
    
    setLoadingBalance(true);
    try {
      const bal = await connection.getBalance(walletPublicKey);
      setBalance(bal / LAMPORTS_PER_SOL);
    } catch (err) {
      console.error('[Wallet Page] Failed to fetch balance:', err);
      setBalance(null);
    } finally {
      setLoadingBalance(false);
    }
  };

  const handleWalletCreated = () => {
    checkWalletStatus();
    setShowUnlockModal(true);
  };

  const handleWalletUnlocked = () => {
    checkWalletStatus();
  };

  const handleLockWallet = async () => {
    await disconnect();
    clearWalletSession();
    checkWalletStatus();
    setBalance(null);
  };

  const handleDeleteWallet = () => {
    if (window.confirm('⚠️ Are you ABSOLUTELY sure? This action cannot be undone. Make sure you have backed up your recovery phrase!')) {
      if (window.confirm('This will PERMANENTLY delete your wallet from this browser. Type "DELETE" to confirm.')) {
        const confirmation = window.prompt('Type DELETE to confirm:');
        if (confirmation === 'DELETE') {
          disconnect();
          deleteWallet();
          checkWalletStatus();
          alert('Wallet deleted successfully');
        }
      }
    }
  };

  const handleExportBackup = async () => {
    setExportError('');
    try {
      const backup = await exportWalletBackup(exportPassword);
      setExportData(JSON.stringify(backup, null, 2));
    } catch (err) {
      setExportError('Failed to export wallet. Incorrect password?');
    }
  };

  const copyBackup = async () => {
    try {
      await navigator.clipboard.writeText(exportData);
      alert('Backup copied to clipboard!');
    } catch (err) {
      alert('Failed to copy to clipboard');
    }
  };

  const copyPublicKey = async () => {
    if (publicKey) {
      try {
        await navigator.clipboard.writeText(publicKey);
        alert('Public key copied!');
      } catch (err) {
        alert('Failed to copy');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push('/')}
            className="p-2 rounded-lg hover:bg-white/50 transition-colors"
          >
            ← Back
          </button>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900">
              Built-in Wallet
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              No extension needed - Full control
            </p>
          </div>
        </div>

        {/* No Wallet - Show Options */}
        {!hasWallet && (
          <div className="space-y-8">
            {/* Social Login Option - Featured */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-purple-200">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">⚡</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Instant Sign In
                </h2>
                <p className="text-gray-600">
                  Create a wallet instantly with your Twitter account
                </p>
                <p className="text-sm text-purple-600 font-medium mt-2">
                  ✨ Recommended for new users
                </p>
              </div>

              <div className="max-w-md mx-auto">
                <TwitterLoginButton 
                  variant="create" 
                  onSuccess={() => {
                    checkWalletStatus();
                    setShowUnlockModal(true);
                  }} 
                />
                
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    No seed phrase needed • Secure • Instant setup
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-sm text-gray-500 font-medium">OR</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Traditional Options */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✨</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                  Create New Wallet
                </h2>
                <p className="text-gray-600 mb-6 text-center">
                  Generate a new Solana wallet with a 12-word recovery phrase
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                >
                  Create Wallet
                </button>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📥</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                  Import Wallet
                </h2>
                <p className="text-gray-600 mb-6 text-center">
                  Restore your wallet using an existing recovery phrase
                </p>
                <button
                  onClick={() => setShowImportModal(true)}
                  className="w-full py-3 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
                >
                  Import Wallet
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Has Wallet - Show Dashboard */}
        {hasWallet && (
          <div className="space-y-6">
            {/* Main Wallet Card */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isUnlocked ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <span className="text-2xl">{isUnlocked ? '🔓' : '🔒'}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{walletName}</h2>
                    <p className="text-sm text-gray-600">
                      {isUnlocked ? (connected ? 'Connected & Unlocked' : 'Unlocked') : 'Locked'}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {isUnlocked && (
                    <button
                      onClick={handleLockWallet}
                      className="py-2 px-4 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      🔒 Lock
                    </button>
                  )}
                  {!isUnlocked && (
                    <button
                      onClick={() => setShowUnlockModal(true)}
                      className="py-2 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                    >
                      🔓 Unlock
                    </button>
                  )}
                </div>
              </div>

              {/* Balance Display */}
              {isUnlocked && publicKey && (
                <>
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 mb-6">
                    <p className="text-sm text-gray-600 mb-1">Balance</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-gray-900">
                        {loadingBalance ? '...' : balance?.toFixed(4) || '0.0000'}
                      </span>
                      <span className="text-xl text-gray-600">SOL</span>
                      <button
                        onClick={fetchBalance}
                        className="ml-4 text-sm text-purple-600 hover:text-purple-700"
                        disabled={loadingBalance}
                      >
                        🔄 Refresh
                      </button>
                    </div>
                  </div>

                  {/* Public Key */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700 mb-1">Public Key</p>
                        <p className="text-sm font-mono text-gray-900 break-all">{publicKey}</p>
                      </div>
                      <button
                        onClick={copyPublicKey}
                        className="ml-4 text-purple-600 hover:text-purple-700"
                      >
                        📋
                      </button>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid md:grid-cols-3 gap-3 mb-6">
                    <button
                      onClick={() => router.push('/privacy')}
                      className="py-3 px-4 bg-blue-50 text-blue-700 font-medium rounded-lg hover:bg-blue-100 transition-colors text-center"
                    >
                      🔒 Privacy Features
                    </button>
                    <button
                      onClick={() => router.push('/batch')}
                      className="py-3 px-4 bg-purple-50 text-purple-700 font-medium rounded-lg hover:bg-purple-100 transition-colors text-center"
                    >
                      📦 Batch Payments
                    </button>
                    <button
                      onClick={() => router.push('/history')}
                      className="py-3 px-4 bg-indigo-50 text-indigo-700 font-medium rounded-lg hover:bg-indigo-100 transition-colors text-center"
                    >
                      📜 History
                    </button>
                  </div>
                </>
              )}

              {/* Wallet Management */}
              <div className="grid md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowExportModal(true)}
                  className="py-3 px-4 bg-yellow-50 text-yellow-700 font-medium rounded-lg hover:bg-yellow-100 transition-colors"
                >
                  📥 Export Backup
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="py-3 px-4 bg-gray-50 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                >
                  🏠 Home
                </button>
                <button
                  onClick={handleDeleteWallet}
                  className="py-3 px-4 bg-red-50 text-red-700 font-medium rounded-lg hover:bg-red-100 transition-colors"
                >
                  🗑️ Delete Wallet
                </button>
              </div>
            </div>

            {/* Security Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <span>💡</span>
                <span>Security Tips</span>
              </h4>
              <ul className="text-xs text-blue-800 space-y-2">
                <li>✅ Your wallet is encrypted and stored locally in your browser</li>
                <li>✅ Always keep your recovery phrase in a safe place offline</li>
                <li>✅ Never share your password or recovery phrase with anyone</li>
                <li>✅ Sessions expire after 30 minutes of inactivity</li>
                <li>✅ Use privacy features for enhanced transaction privacy</li>
              </ul>
            </div>
          </div>
        )}

        {/* Modals */}
        <CreateWalletModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleWalletCreated}
        />

        <ImportWalletModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onSuccess={handleWalletCreated}
        />

        <UnlockWalletModal
          isOpen={showUnlockModal}
          onClose={() => setShowUnlockModal(false)}
          onSuccess={handleWalletUnlocked}
        />

        {/* Export Backup Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Export Backup</h2>
                  <button
                    onClick={() => {
                      setShowExportModal(false);
                      setExportPassword('');
                      setExportData('');
                      setExportError('');
                    }}
                    className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-900">
                    ⚠️ <strong>Warning:</strong> This will export your recovery phrase and private key.
                    Keep this backup extremely secure!
                  </p>
                </div>

                {!exportData && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter Password
                      </label>
                      <input
                        type="password"
                        value={exportPassword}
                        onChange={(e) => setExportPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter your password"
                        onKeyPress={(e) => e.key === 'Enter' && handleExportBackup()}
                      />
                    </div>

                    {exportError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {exportError}
                      </div>
                    )}

                    <button
                      onClick={handleExportBackup}
                      disabled={!exportPassword}
                      className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Export Backup
                    </button>
                  </>
                )}

                {exportData && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Backup Data (Keep Secure!)
                      </label>
                      <textarea
                        value={exportData}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono text-xs"
                        rows={12}
                      />
                    </div>

                    <button
                      onClick={copyBackup}
                      className="w-full py-3 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                    >
                      📋 Copy to Clipboard
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
