'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function AppLandingPage() {
  const router = useRouter();
  const { connected, publicKey } = useWallet();

  // If already connected, redirect to privacy features
  useEffect(() => {
    if (connected && publicKey) {
      router.push('/privacy');
    }
  }, [connected, publicKey, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              ExePay
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose how you'd like to get started with privacy-preserving payments on Solana
          </p>
        </div>

        {/* Main Options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Option 1: Create Built-in Wallet */}
          <div className="group bg-white rounded-3xl p-8 shadow-xl border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-2xl hover:scale-105 animate-fade-in-up stagger-1">
            <div className="flex flex-col h-full">
              {/* Icon */}
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 animate-pulse-glow">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>

              {/* Content */}
              <div className="text-center flex-grow mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Create New Wallet
                </h2>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Generate a secure Solana wallet directly in your browser. No extension needed!
                </p>
                
                {/* Features */}
                <div className="space-y-2 text-left mt-6">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">No browser extension required</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">12-word recovery phrase</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Password-protected encryption</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Fully non-custodial</span>
                  </div>
                </div>
              </div>

              {/* Button */}
              <button
                onClick={() => router.push('/wallet')}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
              >
                Create Wallet
              </button>

              {/* Best for */}
              <p className="text-sm text-center text-purple-600 font-medium mt-4">
                ✨ Best for new users
              </p>
            </div>
          </div>

          {/* Option 2: Connect External Wallet */}
          <div className="group bg-white rounded-3xl p-8 shadow-xl border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-2xl hover:scale-105 animate-fade-in-up stagger-2">
            <div className="flex flex-col h-full">
              {/* Icon */}
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 animate-pulse-glow animation-delay-2000">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>

              {/* Content */}
              <div className="text-center flex-grow mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Connect Wallet
                </h2>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Use your existing Solana wallet like Phantom, Solflare, or any other wallet
                </p>
                
                {/* Features */}
                <div className="space-y-2 text-left mt-6">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Use your existing wallet</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Phantom, Solflare, Ledger & more</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Secure wallet adapter</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Quick & familiar</span>
                  </div>
                </div>
              </div>

              {/* Wallet Connect Button */}
              <div className="wallet-connect-custom">
                <WalletMultiButton className="!w-full !py-4 !bg-gradient-to-r !from-blue-600 !to-cyan-600 hover:!from-blue-700 hover:!to-cyan-700 !text-white !font-bold !rounded-xl !transition-all !duration-200 !shadow-lg hover:!shadow-xl !transform hover:!scale-105 !text-lg" />
              </div>

              {/* Best for */}
              <p className="text-sm text-center text-blue-600 font-medium mt-4">
                🔗 Best for existing users
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-12 text-center animate-fade-in-up stagger-3">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 max-w-3xl mx-auto border border-gray-100">
            <div className="flex items-center justify-center gap-3 mb-3">
              <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900">Your Security Matters</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              All wallets work with ExePay's privacy features including stealth addresses, payment proofs, and view keys. 
              Your keys are always under your control - ExePay never stores or accesses your private keys.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

