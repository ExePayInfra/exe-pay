import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'ExePay Documentation',
  description: 'Privacy-first payments SDK for Solana',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-white">
          {/* Header */}
          <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center gap-8">
                  <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative w-10 h-10 transition-all duration-300 group-hover:scale-110" style={{
                      filter: 'drop-shadow(0 2px 4px rgba(79, 70, 229, 0.3)) drop-shadow(0 4px 8px rgba(79, 70, 229, 0.15))',
                    }}>
                      <Image
                        src="/exepay-logo.png"
                        alt="ExePay"
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 bg-clip-text text-transparent">
                      ExePay Docs
                    </span>
                  </Link>
                  <nav className="hidden md:flex items-center gap-6">
                    <Link href="/guide" className="text-gray-600 hover:text-gray-900">Guide</Link>
                    <Link href="/api" className="text-gray-600 hover:text-gray-900">API</Link>
                    <Link href="/examples" className="text-gray-600 hover:text-gray-900">Examples</Link>
                    <Link href="/whitepaper" className="text-gray-600 hover:text-gray-900">Whitepaper</Link>
                  </nav>
                </div>
                <div className="flex items-center gap-4">
                  <a
                    href="https://exepay.app"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    App
                  </a>
                  <a
                    href="https://github.com/ExePayInfra/exe-pay"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex gap-8">
              {/* Sidebar */}
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <nav className="sticky top-24 space-y-1">
                  <div className="mb-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Getting Started
                    </h3>
                    <Link href="/" className="sidebar-link">Introduction</Link>
                    <Link href="/guide/installation" className="sidebar-link">Installation</Link>
                    <Link href="/guide/quick-start" className="sidebar-link">Quick Start</Link>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      User Guide
                    </h3>
                    <Link href="/guide/sending-payments" className="sidebar-link">Sending Payments</Link>
                    <Link href="/guide/privacy-modes" className="sidebar-link">Privacy Modes</Link>
                    <Link href="/guide/batch-payments" className="sidebar-link">Batch Payments</Link>
                    <Link href="/guide/recurring-payments" className="sidebar-link">Recurring Payments</Link>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Developer Guide
                    </h3>
                    <Link href="/api" className="sidebar-link">API Reference</Link>
                    <Link href="/api/core" className="sidebar-link">Core Package</Link>
                    <Link href="/api/privacy" className="sidebar-link">Privacy Package</Link>
                    <Link href="/api/react-hooks" className="sidebar-link">React Hooks</Link>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Examples
                    </h3>
                    <Link href="/examples" className="sidebar-link">Code Examples</Link>
                    <Link href="/examples/integration" className="sidebar-link">Integration Guide</Link>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Resources
                    </h3>
                    <Link href="/whitepaper" className="sidebar-link">📄 Whitepaper</Link>
                  </div>
                </nav>
              </aside>

              {/* Content */}
              <main className="flex-1 min-w-0">
                {children}
              </main>
            </div>
          </div>

          {/* Footer */}
          <footer className="border-t border-gray-200 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center text-gray-600 text-sm">
                <p>© 2025 ExePay. Built with privacy in mind.</p>
                <div className="mt-2 flex justify-center gap-4">
                  <a href="https://exepay.app" className="hover:text-gray-900">App</a>
                  <Link href="/whitepaper" className="hover:text-gray-900">Whitepaper</Link>
                  <a href="https://github.com/ExePayInfra/exe-pay" className="hover:text-gray-900">GitHub</a>
                  <a href="https://twitter.com/exepay" className="hover:text-gray-900">Twitter</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

