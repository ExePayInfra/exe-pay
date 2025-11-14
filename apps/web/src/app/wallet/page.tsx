'use client';

import { PaymentForm } from '@/components/PaymentForm';
import { WalletButton } from '@/components/WalletButton';
import { useWallet } from '@solana/wallet-adapter-react';

export default function WalletPage() {
  const { publicKey, connected } = useWallet();

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
                href="/"
                className="px-4 py-2 text-white hover:text-purple-300 font-medium transition-colors"
              >
                Home
              </a>
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
              <WalletButton />
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
            Connect your Solana wallet and send privacy-preserving payments powered by Light Protocol.
          </p>
        </div>

        {/* Wallet Status */}
        {!connected ? (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h3>
              <p className="text-blue-200 mb-6">
                To send payments, please connect your Solana wallet (Phantom, Solflare, etc.)
              </p>
              <div className="flex justify-center">
                <WalletButton />
              </div>
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
                  <p className="text-sm text-green-200 font-medium">Wallet Connected</p>
                  <p className="text-xs text-green-300 font-mono">{publicKey?.toBase58().slice(0, 8)}...{publicKey?.toBase58().slice(-8)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Form */}
        {connected && (
          <div className="mt-8">
            <PaymentForm />
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
                  <h4 className="text-lg font-semibold text-white mb-2">Connect Your Wallet</h4>
                  <p className="text-gray-400">Click "Select Wallet" and choose Phantom, Solflare, or another Solana wallet.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 font-bold">
                  2
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Get Devnet SOL (For Testing)</h4>
                  <p className="text-gray-400 mb-2">Visit the Solana faucet to get free test SOL:</p>
                  <a 
                    href="https://faucet.solana.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium"
                  >
                    https://faucet.solana.com
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 font-bold">
                  3
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Send a Private Payment</h4>
                  <p className="text-gray-400">Enter a recipient address, amount, and optional memo. Your payment will be private!</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 font-bold">
                  4
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Approve & Confirm</h4>
                  <p className="text-gray-400">Your wallet will ask you to approve the transaction. Click approve and wait for confirmation!</p>
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
                  All payments use zero-knowledge proofs powered by Light Protocol. Your transaction details are completely private - only you and the recipient can see them. The blockchain only sees encrypted data.
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

