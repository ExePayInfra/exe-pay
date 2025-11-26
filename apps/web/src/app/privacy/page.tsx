'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { PrivacyModeSelector, type PrivacyMode } from '@/components/PrivacyModeSelector';
import { SecureWalletConnect } from '@/components/SecureWalletConnect';

// Lazy load StealthAddressGenerator for better performance
const StealthAddressGenerator = dynamic(
  () => import('@/components/StealthAddressGenerator').then(mod => ({ default: mod.StealthAddressGenerator })),
  { 
    ssr: false,
    loading: () => (
      <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
        <div className="text-center">
          <div className="text-4xl mb-4">🔒</div>
          <p className="text-gray-600">Loading stealth address generator...</p>
        </div>
      </div>
    )
  }
);

export default function PrivacyPage() {
  const [privacyMode, setPrivacyMode] = useState<PrivacyMode>('auto');
  const [amount, setAmount] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'selector' | 'stealth'>('selector');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Privacy Features
            <span className="text-gradient-brand"> Test Page</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Test the new privacy features: Privacy Mode Selector and Stealth Addresses
          </p>
        </div>

        {/* Wallet Connection */}
        <div className="mb-8">
          <SecureWalletConnect showHeader={false} />
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 justify-center">
          <button
            onClick={() => setActiveTab('selector')}
            className={`
              px-6 py-3 rounded-xl font-semibold transition-all
              ${activeTab === 'selector'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            🎯 Privacy Mode Selector
          </button>
          <button
            onClick={() => setActiveTab('stealth')}
            className={`
              px-6 py-3 rounded-xl font-semibold transition-all
              ${activeTab === 'stealth'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            🔒 Stealth Address
          </button>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'selector' && (
            <div className="space-y-8">
              {/* Test Amount Input */}
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Test Amount (for Auto Mode)
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount (SOL)
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                      step="0.1"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter amount"
                    />
                  </div>

                  {/* Quick Amount Buttons */}
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setAmount(0.05)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
                    >
                      0.05 SOL (Small)
                    </button>
                    <button
                      onClick={() => setAmount(1)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
                    >
                      1 SOL (Medium)
                    </button>
                    <button
                      onClick={() => setAmount(15)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
                    >
                      15 SOL (Large)
                    </button>
                  </div>
                </div>
              </div>

              {/* Privacy Mode Selector */}
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
                <PrivacyModeSelector
                  value={privacyMode}
                  onChange={setPrivacyMode}
                  amount={amount}
                  showExplanation={true}
                />
              </div>

              {/* Current Selection Summary */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Current Selection
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>Mode:</strong> {privacyMode}
                  </p>
                  <p>
                    <strong>Amount:</strong> {amount} SOL
                  </p>
                  {privacyMode === 'auto' && (
                    <p className="text-sm text-green-700 bg-green-100 rounded-lg p-3 mt-2">
                      ✨ Auto mode will use:{' '}
                      <strong>
                        {amount < 0.1 ? 'Public' : amount < 10 ? 'Stealth' : 'Maximum Privacy'}
                      </strong>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stealth' && (
            <StealthAddressGenerator />
          )}
        </div>

        {/* Feature Comparison */}
        <div className="mt-16 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Privacy Features Comparison
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Privacy Mode Selector */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Privacy Mode Selector
              </h3>
              <p className="text-gray-600 mb-4">
                Choose your privacy level for each transaction. Inspired by Zcash's optional privacy.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>5 privacy modes to choose from</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Auto mode for convenience</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Clear explanations for each mode</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>User-friendly interface</span>
                </li>
              </ul>
            </div>

            {/* Stealth Address */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Stealth Addresses
              </h3>
              <p className="text-gray-600 mb-4">
                Generate one-time addresses for each payment. Inspired by Monero's battle-tested privacy.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Unique address per payment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>QR code for easy sharing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Detailed explanations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Production-ready cryptography</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-12 max-w-4xl mx-auto bg-gray-900 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">🔐 Technical Details</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2 text-indigo-300">Cryptography</h4>
              <ul className="space-y-1 text-gray-300">
                <li>• X25519 ECDH (Signal, WireGuard)</li>
                <li>• ChaCha20-Poly1305 (RFC 8439)</li>
                <li>• Keccak-256 hashing</li>
                <li>• Pedersen commitments</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-indigo-300">Security</h4>
              <ul className="space-y-1 text-gray-300">
                <li>• Constant-time operations</li>
                <li>• Side-channel resistant</li>
                <li>• Audited libraries (@noble)</li>
                <li>• Battle-tested (Monero since 2014)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

