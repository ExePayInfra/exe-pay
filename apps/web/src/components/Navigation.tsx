'use client';

import { LogoText } from './Logo';
import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { publicKey } = useWallet();

  return (
    <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <a href="/" className="hover-scale">
            <LogoText />
          </a>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Home
            </a>
            <a href="/wallet" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Wallet
            </a>
            <a href="/privacy" className="text-gray-600 hover:text-gray-900 font-medium transition-colors flex items-center gap-1">
              <span>🔒</span>
              <span>Privacy</span>
            </a>
            <a href="/batch" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Batch
            </a>
            <a href="/recurring" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Recurring
            </a>
            <a href="/links" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Links
            </a>
            <a href="/payment-proofs" className="text-gray-600 hover:text-gray-900 font-medium transition-colors flex items-center gap-1">
              <span>🔐</span>
              <span>Proofs</span>
            </a>
            <a href="/history" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              History
            </a>
            <a
              href="https://docs.exepay.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Docs
            </a>
            <div className="flex items-center gap-3">
              {!publicKey ? (
                <a
                  href="/wallet"
                  className="btn-primary px-6 py-2.5 rounded-lg font-semibold hover-lift"
                >
                  Launch App
                </a>
              ) : (
                <>
                  <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-700 !rounded-lg !font-semibold !px-6 !py-2.5 !transition-all" />
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col gap-4">
              <a href="/" className="text-gray-600 hover:text-gray-900 font-medium transition-colors py-2">
                Home
              </a>
              <a href="/wallet" className="text-gray-600 hover:text-gray-900 font-medium transition-colors py-2">
                Wallet
              </a>
              <a href="/privacy" className="text-gray-600 hover:text-gray-900 font-medium transition-colors py-2 flex items-center gap-2">
                <span>🔒</span>
                <span>Privacy</span>
              </a>
              <a href="/batch" className="text-gray-600 hover:text-gray-900 font-medium transition-colors py-2">
                Batch
              </a>
              <a href="/recurring" className="text-gray-600 hover:text-gray-900 font-medium transition-colors py-2">
                Recurring
              </a>
              <a href="/links" className="text-gray-600 hover:text-gray-900 font-medium transition-colors py-2">
                Links
              </a>
              <a href="/payment-proofs" className="text-gray-600 hover:text-gray-900 font-medium transition-colors py-2 flex items-center gap-2">
                <span>🔐</span>
                <span>Proofs</span>
              </a>
              <a href="/history" className="text-gray-600 hover:text-gray-900 font-medium transition-colors py-2">
                History
              </a>
              <a
                href="https://docs.exepay.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors py-2"
              >
                Docs
              </a>
              {!publicKey ? (
                <a
                  href="/wallet"
                  className="btn-primary px-6 py-2.5 rounded-lg font-semibold text-center"
                >
                  Launch App
                </a>
              ) : (
                <div className="w-full">
                  <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-700 !rounded-lg !font-semibold !px-6 !py-2.5 !w-full !transition-all" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-gray-100 py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <LogoText />
          <div className="flex items-center gap-6">
            <a href="https://github.com/ExePayInfra/exe-pay" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
              Github
            </a>
            <a href="https://x.com/exeinfra" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
              Twitter
            </a>
            <a href="https://docs.exepay.app" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
              Docs
            </a>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          © 2025 ExePay. Privacy-preserving payments infrastructure powered by Solana & Light Protocol
        </div>
      </div>
    </footer>
  );
}

