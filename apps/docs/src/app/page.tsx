export default function Home() {
  return (
    <div className="prose max-w-none">
      <div className="mb-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
          ExePay Documentation
        </h1>
        
        <p className="text-xl text-gray-600">
          Privacy-first payments SDK for Solana with stealth addresses, zero-knowledge compression, and production-ready confidential transfers.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 my-8 not-prose">
        <div className="border border-gray-200 rounded-xl p-6 hover:border-purple-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-purple-50">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Start</h3>
          <p className="text-gray-600 text-sm mb-4">Get up and running in minutes with our quick start guide.</p>
          <a href="/guide/quick-start" className="text-purple-600 hover:text-purple-700 text-sm font-semibold">
            Get Started →
          </a>
        </div>

        <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-blue-50">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">SDK Integration</h3>
          <p className="text-gray-600 text-sm mb-4">Complete guide for integrating ExePay SDK.</p>
          <a href="https://github.com/ExePayInfra/exe-pay/blob/main/docs/SDK_INTEGRATION_GUIDE.md" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
            Read Guide →
          </a>
        </div>

        <div className="border border-gray-200 rounded-xl p-6 hover:border-indigo-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-indigo-50">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">API Reference</h3>
          <p className="text-gray-600 text-sm mb-4">Explore the complete API documentation.</p>
          <a href="/api" className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold">
            View API →
          </a>
        </div>
      </div>

      <h2>What is ExePay?</h2>
      
      <p>
        ExePay is a privacy-first payments SDK built on Solana that enables developers to integrate confidential 
        transactions into their applications. Using stealth addresses (Monero-inspired), Light Protocol's ZK compression, 
        and production-grade cryptography, ExePay ensures that transaction details remain private while maintaining 
        the security and verifiability of the blockchain.
      </p>

      <h2>Key Features</h2>

      <div className="grid md:grid-cols-2 gap-4 my-6 not-prose">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
          <h4 className="font-semibold text-purple-900 mb-2">🔐 Privacy Features (Mainnet)</h4>
          <ul className="text-sm text-purple-800 space-y-1">
            <li><strong>✅ Stealth Addresses:</strong> Monero-inspired one-time addresses</li>
            <li><strong>✅ Payment Proofs:</strong> Cryptographic proof of payment for disputes</li>
            <li><strong>✅ Integrated Addresses:</strong> Track invoices with payment IDs</li>
            <li><strong>✅ Subaddresses:</strong> Multiple identities from one wallet</li>
            <li><strong>✅ Enhanced Scanning:</strong> 99% faster with view tags</li>
            <li><strong>✅ RPC Privacy:</strong> IP address hiding via rotation</li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">💰 Payment Features</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li><strong>Batch Payments:</strong> Multi-recipient transfers</li>
            <li><strong>Recurring Payments:</strong> Automated subscriptions</li>
            <li><strong>Payment Links & QR:</strong> Shareable payment requests</li>
            <li><strong>Multi-Token:</strong> SOL, USDC, USDT, BONK, JUP, RAY, ORCA</li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-lg p-4">
          <h4 className="font-semibold text-indigo-900 mb-2">🔬 Cryptography</h4>
          <ul className="text-sm text-indigo-800 space-y-1">
            <li><strong>X25519 ECDH:</strong> Secure key exchange</li>
            <li><strong>Keccak-256:</strong> Cryptographic hashing</li>
            <li><strong>Ed25519:</strong> Solana-native signatures</li>
            <li><strong>View Tags:</strong> Efficient payment detection</li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 mb-2">⚡ Developer Experience</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li><strong>React Hooks:</strong> useExePay(), useBatchPayment()</li>
            <li><strong>TypeScript First:</strong> Fully typed SDK</li>
            <li><strong>Multi-Wallet:</strong> Phantom, Solflare, Coinbase, +3</li>
            <li><strong>Production Ready:</strong> Battle-tested on mainnet</li>
          </ul>
        </div>
      </div>

      <h2>Why Privacy Matters</h2>

      <p>
        On public blockchains, all transaction data is visible to everyone. This means:
      </p>

      <ul>
        <li>Your wallet balance is public</li>
        <li>Your transaction history is traceable</li>
        <li>Your spending patterns can be analyzed</li>
        <li>Competitors can see your business transactions</li>
      </ul>

      <p>
        ExePay solves these problems by using cryptographic techniques that hide sensitive information while 
        still allowing the network to verify that transactions are valid. This gives you the benefits of 
        blockchain (security, immutability, decentralization) without sacrificing your financial privacy.
      </p>

      <h2>How It Works</h2>

      <p>
        ExePay uses production-grade cryptographic primitives to achieve privacy:
      </p>

      <ol>
        <li>
          <strong>Stealth Addresses (Mainnet Ready):</strong> Each payment generates a unique one-time Solana address 
          using X25519 ECDH. The recipient can detect and claim payments without revealing their main wallet address. 
          View tag optimization enables efficient scanning with 99%+ reduction in computation.
        </li>
        <li>
          <strong>X25519 ECDH Key Exchange:</strong> Secure elliptic curve Diffie-Hellman for deriving shared secrets 
          between sender and recipient. Combined with Keccak-256 hashing for cryptographically secure key derivation.
        </li>
        <li>
          <strong>Light Protocol ZK Compression (Beta):</strong> Zero-knowledge proofs for complete on-chain privacy. 
          Hides sender, recipient, and amount while reducing transaction costs by 90%. Currently in beta on devnet, 
          awaiting mainnet launch.
        </li>
        <li>
          <strong>Pedersen Commitments:</strong> Cryptographic commitments that hide transaction amounts while allowing 
          verification of relationships between them.
        </li>
        <li>
          <strong>Nullifiers:</strong> Prevent double-spending without revealing which transaction output is being spent.
        </li>
      </ol>

      <h2>Current Status</h2>

      <div className="grid md:grid-cols-2 gap-4 my-6 not-prose">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-semibold text-green-900 mb-1">✅ Stealth Addresses (Mainnet Ready)</h4>
              <p className="text-sm text-green-800">
                <strong>Stealth addresses</strong> are live on Solana mainnet! Monero-inspired one-time addresses with X25519 ECDH encryption, 
                view tag optimization, and full claiming functionality. Maximum recipient privacy for production use.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">✅ Batch & Recurring Payments</h4>
              <p className="text-sm text-blue-800">
                <strong>Batch payments</strong> (optimized for SOL and SPL tokens) and <strong>recurring payments</strong> (flexible schedules) 
                are production-ready on mainnet. Perfect for payroll, subscriptions, and multi-recipient transfers.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <div>
              <h4 className="font-semibold text-purple-900 mb-1">🔬 Light Protocol (Beta on Devnet)</h4>
              <p className="text-sm text-purple-800">
                <strong>Light Protocol ZK compression</strong> is fully integrated and live on devnet. Provides complete on-chain privacy 
                (hidden sender, recipient, and amount) with 90% cost reduction. Awaiting Light Protocol mainnet launch.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <div>
              <h4 className="font-semibold text-indigo-900 mb-1">✅ Multi-Wallet Support</h4>
              <p className="text-sm text-indigo-800">
                Seamless integration with <strong>6 major wallets</strong>: Phantom, Solflare, Coinbase Wallet, Trust Wallet, Torus, and Ledger. 
                Modern, responsive UI optimized for desktop and mobile.
              </p>
            </div>
          </div>
        </div>
      </div>

      <h2>Advanced Privacy Features ✨</h2>

      <p className="text-lg text-gray-700 mb-4">
        Production-ready privacy features bringing Monero-level confidentiality to Solana payments.
      </p>

      <div className="grid md:grid-cols-2 gap-4 my-6 not-prose">
        <div className="bg-white border-2 border-purple-300 rounded-xl p-5 hover:shadow-lg transition-all">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🔐</span>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Payment Proofs</h4>
              <p className="text-sm text-gray-600 mb-2">
                Generate cryptographic proofs of payment for disputes, audits, and tax reporting. Prove you paid without revealing recipient identity.
              </p>
              <div className="flex gap-2 text-xs">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded">Mainnet</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">Enterprise</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-blue-300 rounded-xl p-5 hover:shadow-lg transition-all">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🔗</span>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Integrated Addresses</h4>
              <p className="text-sm text-gray-600 mb-2">
                Combine stealth addresses with payment IDs to track invoices, orders, and payments. Perfect for e-commerce and accounting.
              </p>
              <div className="flex gap-2 text-xs">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded">Mainnet</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">Business</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-indigo-300 rounded-xl p-5 hover:shadow-lg transition-all">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🔢</span>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Subaddresses</h4>
              <p className="text-sm text-gray-600 mb-2">
                Generate infinite stealth identities from one wallet. Organize payments by client, purpose, or business unit. Monero-style derivation.
              </p>
              <div className="flex gap-2 text-xs">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded">Mainnet</span>
                <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded">Privacy</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-pink-300 rounded-xl p-5 hover:shadow-lg transition-all">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">⚡</span>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Enhanced Scanning</h4>
              <p className="text-sm text-gray-600 mb-2">
                99% faster payment detection with view tags. Real-time progress tracking, payment history, and instant notifications.
              </p>
              <div className="flex gap-2 text-xs">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded">Mainnet</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">Performance</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-emerald-300 rounded-xl p-5 hover:shadow-lg transition-all md:col-span-2">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🌐</span>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-1">RPC Privacy (Network-Level)</h4>
              <p className="text-sm text-gray-600 mb-2">
                Hide your IP address when broadcasting transactions. Automatic rotation between multiple RPC providers prevents tracking and correlation attacks.
              </p>
              <div className="flex gap-2 text-xs">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded">Mainnet</span>
                <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded">Network Privacy</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded">Tor-like</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6 my-8">
        <h3 className="text-xl font-bold text-gray-900 mb-2">🔒 Enterprise-Grade Privacy Architecture</h3>
        <p className="text-gray-700 mb-4">
          ExePay delivers <strong>Monero-level recipient privacy</strong> on Solana with X25519 ECDH encryption, 
          cryptographic payment proofs, and hierarchical identity management. Built on audited cryptographic primitives.
        </p>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="font-semibold text-purple-900 mb-1">🔐 Cryptographic Protection</div>
            <ul className="text-gray-700 space-y-0.5">
              <li>• Recipient identity (ECDH)</li>
              <li>• Transaction unlinkability</li>
              <li>• Network privacy (RPC rotation)</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-blue-900 mb-1">📊 On-Chain Data</div>
            <ul className="text-gray-700 space-y-0.5">
              <li>• Transaction amounts</li>
              <li>• Sender addresses</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-green-900 mb-1">🚀 Planned Enhancements</div>
            <ul className="text-gray-700 space-y-0.5">
              <li>• Zero-knowledge amount proofs</li>
              <li>• Ring signature mixing</li>
            </ul>
          </div>
        </div>
      </div>

      <h2>Getting Started</h2>

      <p>
        Ready to integrate private payments into your application? Check out our <a href="/guide/installation">Installation Guide</a> 
        to get started, or jump straight to the <a href="/guide/quick-start">Quick Start</a> for a hands-on tutorial.
      </p>

      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 my-8">
        <h3 className="text-lg font-semibold text-indigo-900 mb-2">Need Help?</h3>
        <p className="text-indigo-800 mb-4">
          Join our community or check out the examples to see ExePay in action.
        </p>
        <div className="flex gap-4">
          <a 
            href="https://github.com/ExePayInfra/exe-pay" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            View on GitHub
          </a>
          <a 
            href="/examples" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            View Examples
          </a>
        </div>
      </div>
    </div>
  );
}

