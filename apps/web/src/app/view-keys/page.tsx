'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Keypair, Connection, PublicKey } from '@solana/web3.js';
import {
  generateViewKeys,
  encodeViewKeys,
  decodeViewKeys,
  validateViewKey,
  generateShareableViewCredential,
  createViewKeyExport,
  isPaymentForUserViewKey,
  type EncodedViewKey,
  type ViewKeyExport,
} from '@exe-pay/privacy';

export default function ViewKeysPage() {
  const { publicKey, signMessage } = useWallet();
  const [viewKeys, setViewKeys] = useState<EncodedViewKey | null>(null);
  const [importedViewKey, setImportedViewKey] = useState('');
  const [importedSpendKey, setImportedSpendKey] = useState('');
  const [activeTab, setActiveTab] = useState<'generate' | 'import'>('generate');
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Generate view keys from connected wallet
  const handleGenerateViewKeys = async () => {
    if (!publicKey || !signMessage) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Sign message to derive deterministic keypair
      const message = new TextEncoder().encode(
        'Generate ExePay View Keys\n\nThis signature will be used to derive your view keys.'
      );
      
      const signature = await signMessage(message);
      
      // Derive keypair from signature (deterministic)
      const keypair = Keypair.fromSeed(signature.slice(0, 32));
      
      // Generate view keys
      const viewKeyPair = generateViewKeys(keypair);
      
      // Encode for display
      const encoded = encodeViewKeys(viewKeyPair, publicKey);
      
      setViewKeys(encoded);
      setError(null);
    } catch (err: any) {
      console.error('[View Keys] Generation error:', err);
      setError(err.message || 'Failed to generate view keys');
    } finally {
      setLoading(false);
    }
  };

  // Copy to clipboard
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  // Export view key
  const handleExport = () => {
    if (!viewKeys) return;

    const exportData = createViewKeyExport(viewKeys, 'mainnet');
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exepay-view-key-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import view key
  const handleImport = () => {
    try {
      if (!importedViewKey || !importedSpendKey) {
        setError('Please enter both view key and spend public key');
        return;
      }

      const encoded: EncodedViewKey = {
        privateViewKey: importedViewKey,
        publicViewKey: '', // Not needed for import
        spendPublicKey: importedSpendKey,
      };

      if (!validateViewKey(encoded)) {
        setError('Invalid view key format');
        return;
      }

      setViewKeys(encoded);
      setError(null);
      setActiveTab('generate'); // Switch to display tab
    } catch (err: any) {
      setError(err.message || 'Failed to import view key');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            🔑 View Keys
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Read-only access to your payment history. Share with accountants and auditors safely.
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <span>ℹ️</span>
            <span>What Are View Keys?</span>
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p><strong>View Key:</strong> Allows viewing payment history WITHOUT spending ability</p>
            <p><strong>Use Cases:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Share with tax accountants (they see income, can't steal funds)</li>
              <li>Business audits (complete transaction history, read-only)</li>
              <li>Multi-device viewing (check balance on phone safely)</li>
              <li>Automated accounting services (TaxBit, CoinTracker integration)</li>
            </ul>
          </div>
        </div>

        {/* Wallet Connection */}
        {!publicKey ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🔐</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Connect Your Wallet
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Connect your Solana wallet to generate or import view keys
            </p>
            <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-700 !rounded-lg !font-semibold !px-8 !py-3" />
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab('generate')}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                  activeTab === 'generate'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                🔑 My View Keys
              </button>
              <button
                onClick={() => setActiveTab('import')}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                  activeTab === 'import'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                📥 Import View Key
              </button>
            </div>

            {/* Generate Tab */}
            {activeTab === 'generate' && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                {!viewKeys ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-3xl">🔑</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Generate Your View Keys
                    </h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      Sign a message to derive your view keys. No transaction fee required.
                    </p>
                    <button
                      onClick={handleGenerateViewKeys}
                      disabled={loading}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {loading ? 'Generating...' : 'Generate View Keys'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Your View Keys
                      </h3>
                      <button
                        onClick={handleExport}
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-2"
                      >
                        <span>📥</span>
                        <span>Export JSON</span>
                      </button>
                    </div>

                    {/* Private View Key */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        🔒 Private View Key (Keep Secret!)
                      </label>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-red-700 font-medium">
                            ⚠️ DO NOT SHARE - For your use only
                          </p>
                          <button
                            onClick={() => handleCopy(viewKeys.privateViewKey, 'private')}
                            className="text-xs text-red-600 hover:text-red-700 font-medium"
                          >
                            {copied === 'private' ? '✓ Copied!' : 'Copy'}
                          </button>
                        </div>
                        <p className="text-sm font-mono text-gray-800 break-all bg-white p-3 rounded">
                          {viewKeys.privateViewKey}
                        </p>
                      </div>
                    </div>

                    {/* Public View Key */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        👁️ Public View Key
                      </label>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-gray-600">Can be shared with auditors</p>
                          <button
                            onClick={() => handleCopy(viewKeys.publicViewKey, 'public')}
                            className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                          >
                            {copied === 'public' ? '✓ Copied!' : 'Copy'}
                          </button>
                        </div>
                        <p className="text-sm font-mono text-gray-800 break-all bg-white p-3 rounded">
                          {viewKeys.publicViewKey}
                        </p>
                      </div>
                    </div>

                    {/* Spend Public Key */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        🔑 Spend Public Key
                      </label>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-gray-600">Your wallet address (public)</p>
                          <button
                            onClick={() => handleCopy(viewKeys.spendPublicKey, 'spend')}
                            className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                          >
                            {copied === 'spend' ? '✓ Copied!' : 'Copy'}
                          </button>
                        </div>
                        <p className="text-sm font-mono text-gray-800 break-all bg-white p-3 rounded">
                          {viewKeys.spendPublicKey}
                        </p>
                      </div>
                    </div>

                    {/* Shareable Credential */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                        <span>✅</span>
                        <span>Shareable View Credential</span>
                      </h4>
                      <p className="text-sm text-green-800 mb-4">
                        Share this with accountants/auditors. They can view payments but NOT spend funds.
                      </p>
                      <div className="bg-white rounded p-3 space-y-2">
                        <div className="text-xs">
                          <span className="font-medium text-gray-600">Public View Key:</span>
                          <p className="font-mono text-gray-800 break-all">{viewKeys.publicViewKey}</p>
                        </div>
                        <div className="text-xs">
                          <span className="font-medium text-gray-600">Spend Public Key:</span>
                          <p className="font-mono text-gray-800 break-all">{viewKeys.spendPublicKey}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const credential = generateShareableViewCredential(viewKeys);
                          handleCopy(
                            JSON.stringify(credential, null, 2),
                            'shareable'
                          );
                        }}
                        className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition-all"
                      >
                        {copied === 'shareable' ? '✓ Copied to Clipboard!' : 'Copy Shareable Credential'}
                      </button>
                    </div>

                    {/* Regenerate */}
                    <div className="pt-4 border-t">
                      <button
                        onClick={() => {
                          setViewKeys(null);
                          setError(null);
                        }}
                        className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                      >
                        ← Generate New View Keys
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Import Tab */}
            {activeTab === 'import' && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">📥</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Import View Key
                  </h3>
                  <p className="text-gray-600">
                    Import a view key to scan payments for another wallet
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Private View Key Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Private View Key
                    </label>
                    <input
                      type="text"
                      value={importedViewKey}
                      onChange={(e) => setImportedViewKey(e.target.value)}
                      placeholder="Enter private view key..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
                    />
                  </div>

                  {/* Spend Public Key Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Spend Public Key (Wallet Address)
                    </label>
                    <input
                      type="text"
                      value={importedSpendKey}
                      onChange={(e) => setImportedSpendKey(e.target.value)}
                      placeholder="Enter spend public key..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
                    />
                  </div>

                  {/* Import Button */}
                  <button
                    onClick={handleImport}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-all"
                  >
                    Import View Key
                  </button>

                  {/* Warning */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>⚠️ Important:</strong> Only import view keys from trusted sources. 
                      View keys allow viewing payment history but cannot spend funds.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}

        {/* Documentation */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            📚 How to Use View Keys
          </h3>
          <div className="space-y-4 text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">For Tax Accountants:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm ml-4">
                <li>Generate your view keys above</li>
                <li>Copy the "Shareable View Credential"</li>
                <li>Send to your accountant (email, encrypted message)</li>
                <li>They import it and can see all your transactions</li>
                <li>They CANNOT spend your funds (read-only access)</li>
              </ol>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">For Multi-Device:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm ml-4">
                <li>Generate view keys on your main device</li>
                <li>Export as JSON file</li>
                <li>Import on your phone/tablet</li>
                <li>Check balance safely (if device stolen, funds are safe)</li>
              </ol>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Security:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                <li><strong>Private View Key:</strong> Keep secret, for your use only</li>
                <li><strong>Public View Key + Spend Public Key:</strong> Safe to share with auditors</li>
                <li><strong>View keys CANNOT spend funds</strong> - cryptographically impossible</li>
                <li><strong>Based on Monero's proven cryptography</strong> (10 years battle-tested)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

