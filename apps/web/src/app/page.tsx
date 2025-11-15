'use client';

import { LogoText } from '@/components/Logo';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* PayAI-style Header */}
      <nav className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <LogoText />
            
            <div className="flex items-center gap-8">
              <a href="/features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Features
              </a>
              <a href="/wallet" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Wallet
              </a>
              <a href="/history" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                History
              </a>
              <a
                href="/wallet"
                className="btn-primary px-6 py-2.5 rounded-lg font-semibold"
              >
                Launch App
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* PayAI-style Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Solana-first, privacy-preserving
            <br />
            <span className="text-gradient-brand">payments platform.</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Send private payments with zero-knowledge proofs. Fast, secure, and completely confidential on Solana.
          </p>

          <div className="flex items-center justify-center gap-4">
            <a
              href="/wallet"
              className="btn-primary px-8 py-4 rounded-lg font-semibold text-lg inline-flex items-center gap-2"
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
              className="btn-outline px-8 py-4 rounded-lg font-semibold text-lg inline-flex items-center gap-2"
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
          <div className="glass-card p-8 rounded-2xl animate-slide-up">
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
          <div className="glass-card p-8 rounded-2xl animate-slide-up" style={{animationDelay: '0.1s'}}>
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
          <div className="glass-card p-8 rounded-2xl animate-slide-up" style={{animationDelay: '0.2s'}}>
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

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <LogoText />
            <div className="flex items-center gap-6">
              <a href="https://github.com/ExePayInfra/exe-pay" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                Github
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                Twitter
              </a>
              <a href="/docs" className="text-gray-600 hover:text-gray-900">
                Docs
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500 text-sm">
            © 2025 ExePay. Built with ❤️ on Solana.
          </div>
        </div>
      </footer>
    </main>
  );
}
