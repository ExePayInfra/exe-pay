'use client';

import { useState } from 'react';

export default function Home() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState('');

  const handleDemo = () => {
    try {
      const demoAddress = 'DemoAddress123';
      const demoAmount = parseFloat(amount || '0.001');
      
      setResult(`✅ Demo: Would send ${demoAmount} SOL to ${recipient || demoAddress}`);
    } catch (error: any) {
      setResult(`❌ Error: ${error.message}`);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <nav className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <a href="/" className="text-2xl font-bold text-white hover:text-purple-300 transition-colors">ExePay</a>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/create-link"
                className="px-4 py-2 text-white hover:text-purple-300 font-medium transition-colors"
              >
                Payment Links
              </a>
              <a
                href="/scan"
                className="px-4 py-2 text-white hover:text-purple-300 font-medium transition-colors"
              >
                Scan QR
              </a>
              <a
                href="/history"
                className="px-4 py-2 text-white hover:text-purple-300 font-medium transition-colors"
              >
                History
              </a>
              <div className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold">
                Demo Mode
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">
            Private Payments on{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Solana
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Send and receive payments with zero-knowledge privacy. 
            Fast, secure, and completely confidential.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
            <p className="text-4xl font-bold text-white mb-2">12,847</p>
            <p className="text-gray-400">Private Transactions</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
            <p className="text-4xl font-bold text-white mb-2">2,453 SOL</p>
            <p className="text-gray-400">Total Volume</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
            <p className="text-4xl font-bold text-white mb-2">891</p>
            <p className="text-gray-400">Active Users</p>
          </div>
        </div>

        {/* Demo Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">SDK Demo</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Recipient Address (Optional)
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Enter Solana wallet address"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount (SOL)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.001"
                  step="0.000000001"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              {result && (
                <div className="bg-purple-500/20 border border-purple-500/50 rounded-lg p-4">
                  <p className="text-purple-200 text-sm">{result}</p>
                </div>
              )}

              <button
                onClick={handleDemo}
                className="w-full py-4 px-6 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                🔒 Test SDK (Demo)
              </button>
            </div>

            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-sm text-blue-200">
                <span className="font-semibold">📘 Demo Mode:</span> Testing transaction history with Helius RPC. Visit <a href="/history" className="underline">/history</a> to test!
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Private by Default</h3>
            <p className="text-gray-400">
              Zero-knowledge proofs ensure your payment details remain confidential
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
            <p className="text-gray-400">
              Powered by Solana's high-performance blockchain
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Low Fees</h3>
            <p className="text-gray-400">
              Pay fractions of a cent per transaction
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <p>Built with ❤️ on Solana • Powered by Light Protocol</p>
            <p className="mt-2 text-sm">
              <a href="https://github.com/ExePayInfra/exe-pay" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                View on GitHub
              </a>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
