'use client';

import { Navigation, Footer } from '@/components/Navigation';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />

      {/* Enhanced Hero Section with Animations */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <div className="text-center max-w-5xl mx-auto">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full mb-8">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-semibold text-indigo-900">Powered by Light Protocol & Solana</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
              Privacy-first payments
              <br className="hidden sm:block" />
              <span className="text-gradient-brand animate-gradient"> with zero-knowledge proofs</span>
            </h1>
          </div>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-10 sm:mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up stagger-1">
            Send completely private payments on Solana. Hide amounts, shield identities, and protect your financial privacy with cutting-edge cryptography.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up stagger-2">
            <a
              href="/wallet"
              className="btn-primary px-8 sm:px-10 py-4 sm:py-5 rounded-xl font-semibold text-base sm:text-lg inline-flex items-center gap-3 w-full sm:w-auto justify-center hover-lift group"
            >
              <span>Launch App</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            
            <a
              href="https://docs.exepay.app"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline px-8 sm:px-10 py-4 sm:py-5 rounded-xl font-semibold text-base sm:text-lg inline-flex items-center gap-3 w-full sm:w-auto justify-center hover-scale group"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Documentation</span>
            </a>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 sm:mt-16 flex flex-wrap items-center justify-center gap-4 sm:gap-8 opacity-70 animate-fade-in-up stagger-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs sm:text-sm font-medium text-gray-700">Light Protocol</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs sm:text-sm font-medium text-gray-700">Solana Network</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs sm:text-sm font-medium text-gray-700">ZK-SNARKs</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs sm:text-sm font-medium text-gray-700">ElGamal Encryption</span>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Features - Core Focus */}
      <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Privacy-First Architecture</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Built with cutting-edge cryptography to ensure your financial privacy is never compromised
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* ZK-SNARKs */}
            <div className="glass-card p-6 sm:p-8 rounded-2xl hover-lift animate-fade-in-up stagger-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 animate-float">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">ZK-SNARKs</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                Prove transaction validity without revealing any sensitive data. Groth16 proofs ensure mathematical certainty with zero knowledge leakage.
              </p>
              <div className="flex items-center gap-2 text-purple-600 text-sm font-semibold">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Cryptographically Secure</span>
              </div>
            </div>

            {/* ElGamal Encryption */}
            <div className="glass-card p-6 sm:p-8 rounded-2xl hover-lift animate-fade-in-up stagger-2">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 animate-float" style={{animationDelay: '0.2s'}}>
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">ElGamal Encryption</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                Hide transaction amounts with homomorphic encryption. Only you and the recipient can decrypt the actual values.
              </p>
              <div className="flex items-center gap-2 text-blue-600 text-sm font-semibold">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Amount Shielding</span>
              </div>
            </div>

            {/* Stealth Addresses */}
            <div className="glass-card p-6 sm:p-8 rounded-2xl hover-lift animate-fade-in-up stagger-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 animate-float" style={{animationDelay: '0.4s'}}>
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Stealth Addresses</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                Generate one-time addresses for each transaction. Break the link between your identity and payment history.
              </p>
              <div className="flex items-center gap-2 text-indigo-600 text-sm font-semibold">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Identity Protection</span>
              </div>
            </div>

            {/* Nullifiers */}
            <div className="glass-card p-6 sm:p-8 rounded-2xl hover-lift animate-fade-in-up stagger-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 animate-float" style={{animationDelay: '0.6s'}}>
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Nullifiers</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                Prevent double-spending without revealing transaction history. Cryptographic nullifiers ensure security without surveillance.
              </p>
              <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Double-Spend Protection</span>
              </div>
            </div>

            {/* Compressed Accounts */}
            <div className="glass-card p-6 sm:p-8 rounded-2xl hover-lift animate-fade-in-up stagger-5">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 animate-float" style={{animationDelay: '0.8s'}}>
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Compressed Accounts</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                Light Protocol compression reduces costs by 1000x. Private payments at a fraction of traditional blockchain fees.
              </p>
              <div className="flex items-center gap-2 text-orange-600 text-sm font-semibold">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>1000x Cost Reduction</span>
              </div>
            </div>

            {/* Merkle Trees */}
            <div className="glass-card p-6 sm:p-8 rounded-2xl hover-lift animate-fade-in-up stagger-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 animate-float" style={{animationDelay: '1s'}}>
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Merkle Trees</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                Efficient inclusion proofs for private state. Verify membership in anonymity sets without revealing your position.
              </p>
              <div className="flex items-center gap-2 text-pink-600 text-sm font-semibold">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Efficient Verification</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Payment Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Complete Payment Solution</h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need for private, efficient, and scalable payments on Solana
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Private Transfers */}
          <div className="glass-card p-6 sm:p-8 rounded-2xl hover-lift animate-fade-in-up stagger-1">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 animate-float">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Private Transfers</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
              Send SOL and SPL tokens with 3 privacy levels: Public, Shielded (hidden amounts), or Private (fully anonymous).
            </p>
            <a href="/wallet" className="text-indigo-600 font-semibold inline-flex items-center gap-2 group text-sm sm:text-base">
              <span>Send payment</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Batch Payments */}
          <div className="glass-card p-6 sm:p-8 rounded-2xl hover-lift animate-fade-in-up stagger-2">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 animate-float" style={{animationDelay: '0.2s'}}>
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Batch Payments</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
              Pay multiple recipients in one transaction. Perfect for payroll, airdrops, and bulk distributions with privacy.
            </p>
            <a href="/batch" className="text-indigo-600 font-semibold inline-flex items-center gap-2 group text-sm sm:text-base">
              <span>Create batch</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Recurring Payments */}
          <div className="glass-card p-6 sm:p-8 rounded-2xl hover-lift animate-fade-in-up stagger-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 animate-float" style={{animationDelay: '0.4s'}}>
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Recurring Payments</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
              Automate subscriptions with daily, weekly, or monthly schedules. Pause, resume, or cancel anytime.
            </p>
            <a href="/recurring" className="text-indigo-600 font-semibold inline-flex items-center gap-2 group text-sm sm:text-base">
              <span>Set up subscription</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Multi-Token Support */}
          <div className="glass-card p-6 sm:p-8 rounded-2xl hover-lift animate-fade-in-up stagger-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 animate-float" style={{animationDelay: '0.6s'}}>
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Multi-Token Support</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
              Support for SOL, USDC, USDT, BONK, JUP, and all SPL tokens. One platform for all your crypto.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold">SOL</span>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">USDC</span>
              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold">USDT</span>
              <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold">+More</span>
            </div>
          </div>

          {/* Transaction History */}
          <div className="glass-card p-6 sm:p-8 rounded-2xl hover-lift animate-fade-in-up stagger-5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 animate-float" style={{animationDelay: '0.8s'}}>
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Transaction History</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
              Track all payments in one place. Export, filter, and analyze your transaction history with privacy intact.
            </p>
            <a href="/history" className="text-indigo-600 font-semibold inline-flex items-center gap-2 group text-sm sm:text-base">
              <span>View history</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Developer SDK */}
          <div className="glass-card p-6 sm:p-8 rounded-2xl hover-lift animate-fade-in-up stagger-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 animate-float" style={{animationDelay: '1s'}}>
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Developer SDK</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
              TypeScript SDK with React hooks. Integrate private payments into your dApp in minutes.
            </p>
            <a href="https://docs.exepay.app" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-semibold inline-flex items-center gap-2 group text-sm sm:text-base">
              <span>Read docs</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-blue-600 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div className="animate-fade-in-up stagger-1">
              <div className="text-4xl sm:text-5xl font-bold text-white mb-2">100%</div>
              <div className="text-indigo-100 text-sm sm:text-lg">Private</div>
            </div>
            <div className="animate-fade-in-up stagger-2">
              <div className="text-4xl sm:text-5xl font-bold text-white mb-2">&lt;1s</div>
              <div className="text-indigo-100 text-sm sm:text-lg">Transaction Time</div>
            </div>
            <div className="animate-fade-in-up stagger-3">
              <div className="text-4xl sm:text-5xl font-bold text-white mb-2">5+</div>
              <div className="text-indigo-100 text-sm sm:text-lg">Tokens Supported</div>
            </div>
            <div className="animate-fade-in-up stagger-4">
              <div className="text-4xl sm:text-5xl font-bold text-white mb-2">$0.0001</div>
              <div className="text-indigo-100 text-sm sm:text-lg">Average Fee</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="glass-card rounded-3xl p-8 sm:p-12 lg:p-16 text-center animate-scale-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Ready to send private payments?
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto">
            Join the future of private, secure payments on Solana. No signup required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/wallet"
              className="btn-primary px-10 sm:px-12 py-4 sm:py-5 rounded-xl font-semibold text-base sm:text-lg inline-flex items-center gap-3 hover-lift group w-full sm:w-auto justify-center"
            >
              <span>Get Started</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="https://docs.exepay.app"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline px-10 sm:px-12 py-4 sm:py-5 rounded-xl font-semibold text-base sm:text-lg inline-flex items-center gap-3 hover-scale w-full sm:w-auto justify-center"
            >
              <span>Read Docs</span>
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
