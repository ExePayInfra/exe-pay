'use client';

export const dynamic = 'force-dynamic';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamicImport from 'next/dynamic';
import { PrivacyModeSelector, type PrivacyMode } from '@/components/PrivacyModeSelector';
import { SecureWalletConnect } from '@/components/SecureWalletConnect';
import { BackButton } from '@/components/BackButton';
import { ShieldedPoolManager } from '@/components/ShieldedPoolManager';

// Lazy load components for better performance
const StealthAddressGenerator = dynamicImport(
  () => import('@/components/StealthAddressGenerator').then(mod => ({ default: mod.StealthAddressGenerator })),
  { 
    ssr: false,
    loading: () => (
      <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
        <div className="text-center">
          <div className="text-4xl mb-4">🔒</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }
);

const StealthPaymentForm = dynamicImport(
  () => import('@/components/StealthPaymentForm').then(mod => ({ default: mod.StealthPaymentForm })),
  { 
    ssr: false,
    loading: () => (
      <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
        <div className="text-center">
          <div className="text-4xl mb-4">💸</div>
          <p className="text-gray-600">Loading payment form...</p>
        </div>
      </div>
    )
  }
);

const StealthPaymentScanner = dynamicImport(
  () => import('@/components/StealthPaymentScanner').then(mod => ({ default: mod.StealthPaymentScanner })),
  { 
    ssr: false,
    loading: () => (
      <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
        <div className="text-center">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-gray-600">Loading scanner...</p>
        </div>
      </div>
    )
  }
);

export default function PrivacyPage() {
  const searchParams = useSearchParams();
  const [privacyMode, setPrivacyMode] = useState<PrivacyMode>('auto');
  const [amount, setAmount] = useState<number>(1);
  const [mainTab, setMainTab] = useState<'stealth' | 'light'>('stealth');
  const [stealthTab, setStealthTab] = useState<'receive' | 'send' | 'scan'>('receive');

  // Check URL parameter to set initial tab
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'light') {
      setMainTab('light');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back Button */}
        <div className="mb-6">
          <BackButton />
        </div>
        
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-lg mb-6">
            <span className="text-2xl">🔐</span>
            <span className="text-sm font-semibold text-indigo-600">PRIVACY FEATURES</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4">
            Private Payments
            <span className="block sm:inline text-indigo-600"> on Solana</span>
          </h1>
          <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your privacy method: Stealth Addresses or Light Protocol ZK Compression
          </p>
        </div>

        {/* Wallet Connection */}
        <div className="mb-8 max-w-4xl mx-auto">
          <SecureWalletConnect showHeader={false} />
        </div>

        {/* Main Tabs: Stealth vs Light Protocol */}
        <div className="flex gap-3 sm:gap-4 mb-6 justify-center max-w-4xl mx-auto">
          <button
            onClick={() => setMainTab('stealth')}
            className={`
              flex-1 max-w-xs flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105
              ${mainTab === 'stealth'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-lg border-2 border-gray-200'
              }
            `}
          >
            <span className="text-2xl">🔒</span>
            <div className="text-left">
              <div>Stealth System</div>
              <div className="text-xs font-normal opacity-90">Off-chain Privacy</div>
            </div>
          </button>
          <button
            onClick={() => setMainTab('light')}
            className={`
              flex-1 max-w-xs flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105
              ${mainTab === 'light'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-lg border-2 border-gray-200'
              }
            `}
          >
            <span className="text-2xl">🌟</span>
            <div className="text-left">
              <div>Light Protocol</div>
              <div className="text-xs font-normal opacity-90">ZK Compression</div>
            </div>
          </button>
        </div>

        {/* Sub-tabs for Stealth */}
        {mainTab === 'stealth' && (
          <div className="flex gap-2 sm:gap-4 mb-8 justify-center flex-wrap max-w-4xl mx-auto">
            <button
              onClick={() => setStealthTab('receive')}
              className={`
                flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105
                ${stealthTab === 'receive'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
                }
              `}
            >
              <span className="text-xl">📥</span>
              <span className="hidden sm:inline">Receive</span>
            </button>
            <button
              onClick={() => setStealthTab('send')}
              className={`
                flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105
                ${stealthTab === 'send'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
                }
              `}
            >
              <span className="text-xl">💸</span>
              <span className="hidden sm:inline">Send</span>
            </button>
            <button
              onClick={() => setStealthTab('scan')}
              className={`
                flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105
                ${stealthTab === 'scan'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
                }
              `}
            >
              <span className="text-xl">🔍</span>
              <span className="hidden sm:inline">Scan & Claim</span>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <div className="transition-all duration-300">
            {mainTab === 'stealth' && (
              <>
                {stealthTab === 'receive' && (
                  <div className="animate-fade-in">
                    <StealthAddressGenerator />
                  </div>
                )}

                {stealthTab === 'send' && (
                  <div className="animate-fade-in">
                    <StealthPaymentForm />
                  </div>
                )}

                {stealthTab === 'scan' && (
                  <div className="animate-fade-in">
                    <StealthPaymentScanner />
                  </div>
                )}
              </>
            )}

            {mainTab === 'light' && (
              <div className="animate-fade-in">
                <ShieldedPoolManager />
              </div>
            )}
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-12 sm:mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8">
            How Stealth Addresses Work
          </h2>

          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-indigo-200 hover:border-indigo-400 transition-all">
              <div className="text-4xl mb-3">📥</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                1. Receive
              </h3>
              <p className="text-sm text-gray-600">
                Generate your stealth meta-address and share it with senders. It stays the same for all payments.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200 hover:border-purple-400 transition-all">
              <div className="text-4xl mb-3">💸</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                2. Send
              </h3>
              <p className="text-sm text-gray-600">
                Paste recipient's meta-address. We generate a unique one-time address for this payment only.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-pink-200 hover:border-pink-400 transition-all">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                3. Scan & Claim
              </h3>
              <p className="text-sm text-gray-600">
                Scan the blockchain to detect your payments, then claim them to your wallet with one click.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-12 max-w-4xl mx-auto bg-gradient-to-br from-gray-900 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">🔐</span>
            <h3 className="text-xl sm:text-2xl font-bold">Battle-Tested Cryptography</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-3 text-indigo-300 flex items-center gap-2">
                <span>🔬</span> Cryptographic Primitives
              </h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400">•</span>
                  <span><strong>X25519 ECDH</strong> - Used by Signal, WireGuard, TLS 1.3</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400">•</span>
                  <span><strong>Keccak-256</strong> - Ethereum's hash function</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400">•</span>
                  <span><strong>Ed25519</strong> - Solana's native signature scheme</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-indigo-300 flex items-center gap-2">
                <span>🛡️</span> Security Guarantees
              </h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400">•</span>
                  <span><strong>Unlinkability</strong> - Payments can't be linked together</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400">•</span>
                  <span><strong>Forward Secrecy</strong> - Past payments stay private</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400">•</span>
                  <span><strong>No Secret Exposure</strong> - Uses message signing only</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-indigo-700">
            <p className="text-xs text-indigo-200 text-center">
              Inspired by Monero (stealth addresses since 2014) • Implemented with @noble/curves & @noble/ciphers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

