'use client';

import { Navigation, Footer } from '@/components/Navigation';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />

      {/* PayAI-style Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Solana-first, privacy-preserving
            <br className="hidden sm:block" />
            <span className="text-gradient-brand"> payments platform.</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Send private payments with zero-knowledge proofs. Fast, secure, and completely confidential on Solana.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/wallet"
              className="btn-primary px-8 py-4 rounded-lg font-semibold text-lg inline-flex items-center gap-2 w-full sm:w-auto justify-center hover-lift"
            >
              <span>Try ExePay</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            
            <a
              href="https://github.com/ExePayInfra/exe-pay"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline px-8 py-4 rounded-lg font-semibold text-lg inline-flex items-center gap-2 w-full sm:w-auto justify-center hover-scale"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>Github</span>
            </a>
          </div>
        </div>
      </div>

      {/* Features Grid - PayAI style */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="glass-card p-8 rounded-2xl animate-slide-up hover-lift">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Private Transfers</h3>
            <p className="text-gray-600 leading-relaxed">
              Zero-knowledge proofs ensure complete transaction privacy. Your payments are your business.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-card p-8 rounded-2xl animate-slide-up hover-lift" style={{animationDelay: '0.1s'}}>
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
            <p className="text-gray-600 leading-relaxed">
              Built on Solana for instant finality. Send payments in seconds, not minutes.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-card p-8 rounded-2xl animate-slide-up hover-lift" style={{animationDelay: '0.2s'}}>
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Multi-Token</h3>
            <p className="text-gray-600 leading-relaxed">
              Support for SOL, USDC, USDT, and more. One platform for all your crypto payments.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section - Educational */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            ExePay uses cutting-edge cryptography to protect your financial privacy
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Step 1 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Choose Privacy Level</h3>
            <p className="text-gray-600 leading-relaxed">
              Select between Public, Shielded (hidden amounts), or Private (fully anonymous) transfers based on your needs.
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Zero-Knowledge Proofs</h3>
            <p className="text-gray-600 leading-relaxed">
              Our system generates cryptographic proofs that validate your transaction without revealing sensitive details.
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Settlement</h3>
            <p className="text-gray-600 leading-relaxed">
              Transactions settle on Solana in under a second with minimal fees, while maintaining complete privacy.
            </p>
          </div>
        </div>

        {/* Privacy Explanation */}
        <div className="glass-card p-8 rounded-2xl">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">What is Zero-Knowledge Privacy?</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Zero-knowledge proofs allow you to prove that a transaction is valid (you have sufficient funds, the recipient is correct) 
              without revealing any actual transaction details like amounts, sender, or recipient addresses.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Think of it like proving you're old enough to enter a venue without showing your ID - you prove the fact without revealing the data. 
              ExePay brings this same principle to blockchain payments, ensuring your financial privacy while maintaining network security.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">100%</div>
              <div className="text-gray-600">Private</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">&lt;1s</div>
              <div className="text-gray-600">Transaction Time</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">5+</div>
              <div className="text-gray-600">Tokens Supported</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">$0.0001</div>
              <div className="text-gray-600">Average Fee</div>
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Built For Everyone</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From individuals to enterprises, ExePay protects your financial privacy
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Personal Use */}
          <div className="glass-card p-8 rounded-2xl hover-lift">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Personal Payments</h3>
                <p className="text-gray-600 leading-relaxed">
                  Send money to friends, family, or pay for services without exposing your transaction history or wallet balance.
                </p>
              </div>
            </div>
          </div>

          {/* Business Use */}
          <div className="glass-card p-8 rounded-2xl hover-lift">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Business Payments</h3>
                <p className="text-gray-600 leading-relaxed">
                  Pay vendors, contractors, or employees while keeping sensitive financial information confidential from competitors.
                </p>
              </div>
            </div>
          </div>

          {/* DeFi Use */}
          <div className="glass-card p-8 rounded-2xl hover-lift">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">DeFi & Trading</h3>
                <p className="text-gray-600 leading-relaxed">
                  Execute trades and DeFi transactions without revealing your strategy or portfolio size to front-runners.
                </p>
              </div>
            </div>
          </div>

          {/* Payroll Use */}
          <div className="glass-card p-8 rounded-2xl hover-lift">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Payroll & Subscriptions</h3>
                <p className="text-gray-600 leading-relaxed">
                  Automate recurring payments for salaries or subscriptions with built-in privacy and scheduling features.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="glass-card rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ready to send private payments?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join the future of private, secure payments on Solana.
          </p>
          <a
            href="/wallet"
            className="btn-primary px-10 py-4 rounded-lg font-semibold text-lg inline-flex items-center gap-2"
          >
            <span>Get Started</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>

      <Footer />
    </main>
  );
}
