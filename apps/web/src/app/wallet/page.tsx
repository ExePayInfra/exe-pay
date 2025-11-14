'use client';

import { useState, useEffect } from 'react';

export default function WalletWorkingPage() {
  const [mounted, setMounted] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const connectWallet = async () => {
    setConnecting(true);
    try {
      // Check if Phantom is installed
      const { solana } = window as any;
      
      if (!solana?.isPhantom) {
        alert('Please install Phantom wallet from https://phantom.app/');
        setConnecting(false);
        return;
      }

      // Connect to Phantom
      const response = await solana.connect();
      setWalletAddress(response.publicKey.toString());
      console.log('Connected to wallet:', response.publicKey.toString());
    } catch (err) {
      console.error('Failed to connect wallet:', err);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      const { solana } = window as any;
      if (solana) {
        await solana.disconnect();
        setWalletAddress(null);
      }
    } catch (err) {
      console.error('Failed to disconnect:', err);
    }
  };

  if (!mounted) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </main>
    );
  }

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
              <a href="/" className="px-4 py-2 text-white hover:text-purple-300 font-medium transition-colors">
                Home
              </a>
              <a href="/batch" className="px-4 py-2 text-white hover:text-purple-300 font-medium transition-colors">
                Batch
              </a>
              <a href="/recurring" className="px-4 py-2 text-white hover:text-purple-300 font-medium transition-colors">
                Recurring
              </a>
              <a href="/history" className="px-4 py-2 text-white hover:text-purple-300 font-medium transition-colors">
                History
              </a>
              
              {walletAddress ? (
                <button
                  onClick={disconnectWallet}
                  className="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 hover:bg-red-500/30 font-medium transition-all"
                >
                  {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
                </button>
              ) : (
                <button
                  onClick={connectWallet}
                  disabled={connecting}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
                >
                  {connecting ? 'Connecting...' : 'Connect Wallet'}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">
            Send Private Payments with{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Your Wallet
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Connect your Phantom wallet and send privacy-preserving payments powered by Light Protocol.
          </p>
        </div>

        {/* Wallet Status */}
        {!walletAddress ? (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h3>
              <p className="text-blue-200 mb-6">
                To send payments, please connect your Phantom wallet
              </p>
              <button
                onClick={connectWallet}
                disabled={connecting}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 shadow-lg"
              >
                {connecting ? 'Connecting...' : 'Connect Phantom Wallet'}
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-green-200 font-medium">Wallet Connected ✅</p>
                  <p className="text-xs text-green-300 font-mono">{walletAddress}</p>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 hover:bg-red-500/30 text-sm font-medium transition-all"
                >
                  Disconnect
                </button>
              </div>
            </div>

            {/* Payment Form */}
            <div className="mt-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Send Payment</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Recipient Address
                  </label>
                  <input
                    type="text"
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
                    placeholder="0.001"
                    step="0.000000001"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Memo (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Payment for..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                <button
                  className="w-full py-4 px-6 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  🔒 Send Private Payment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">🚀 How to Use</h3>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 font-bold">
                  1
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Install Phantom Wallet</h4>
                  <p className="text-gray-400">
                    Download from{' '}
                    <a href="https://phantom.app/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">
                      phantom.app
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 font-bold">
                  2
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Get Devnet SOL (For Testing)</h4>
                  <p className="text-gray-400 mb-2">Visit the Solana faucet:</p>
                  <a 
                    href="https://faucet.solana.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium"
                  >
                    https://faucet.solana.com
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 font-bold">
                  3
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Send a Private Payment</h4>
                  <p className="text-gray-400">Connect your wallet, enter details, and send!</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mt-8 max-w-4xl mx-auto">
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-purple-200 mb-2">🔐 Privacy Guaranteed</h4>
                <p className="text-sm text-purple-300">
                  All payments use zero-knowledge proofs powered by Light Protocol. Your transaction details are completely private.
                </p>
              </div>
            </div>
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

