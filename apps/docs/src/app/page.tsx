export default function Home() {
  return (
    <div className="prose max-w-none">
      <h1>ExePay Documentation</h1>
      
      <p className="text-xl text-gray-600">
        Privacy-first payments SDK for Solana with zero-knowledge proofs, ElGamal encryption, and confidential transfers.
      </p>

      <div className="grid md:grid-cols-3 gap-6 my-8 not-prose">
        <div className="border border-gray-200 rounded-lg p-6 hover:border-indigo-500 transition-colors">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Start</h3>
          <p className="text-gray-600 text-sm mb-4">Get up and running in minutes with our quick start guide.</p>
          <a href="/guide/quick-start" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            Get Started →
          </a>
        </div>

        <div className="border border-gray-200 rounded-lg p-6 hover:border-indigo-500 transition-colors">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">User Guide</h3>
          <p className="text-gray-600 text-sm mb-4">Learn how to use ExePay for private payments.</p>
          <a href="/guide/sending-payments" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            Read Guide →
          </a>
        </div>

        <div className="border border-gray-200 rounded-lg p-6 hover:border-indigo-500 transition-colors">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">API Reference</h3>
          <p className="text-gray-600 text-sm mb-4">Explore the complete API documentation.</p>
          <a href="/api" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            View API →
          </a>
        </div>
      </div>

      <h2>What is ExePay?</h2>
      
      <p>
        ExePay is a privacy-first payments SDK built on Solana that enables developers to integrate confidential 
        transactions into their applications. Using zero-knowledge proofs and ElGamal encryption, ExePay ensures 
        that transaction details remain private while maintaining the security and verifiability of the blockchain.
      </p>

      <h2>Key Features</h2>

      <ul>
        <li><strong>Zero-Knowledge Proofs:</strong> Prove transaction validity without revealing sensitive information</li>
        <li><strong>ElGamal Encryption:</strong> Homomorphic encryption for confidential amounts</li>
        <li><strong>Multiple Privacy Levels:</strong> Choose between Public, Shielded, and Private transfers</li>
        <li><strong>Token Support:</strong> Works with SOL, USDC, USDT, and other SPL tokens</li>
        <li><strong>Batch Payments:</strong> Send to multiple recipients in a single transaction</li>
        <li><strong>Recurring Payments:</strong> Automate subscriptions and payroll</li>
        <li><strong>React Hooks:</strong> Easy integration for React applications</li>
        <li><strong>TypeScript First:</strong> Fully typed for better developer experience</li>
      </ul>

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
        ExePay uses a combination of cryptographic primitives to achieve privacy:
      </p>

      <ol>
        <li>
          <strong>ElGamal Encryption:</strong> Encrypts transaction amounts so only the sender and recipient 
          can see them. The encryption is homomorphic, meaning the network can still verify the math works 
          out without seeing the actual numbers.
        </li>
        <li>
          <strong>Zero-Knowledge Proofs (ZK-SNARKs):</strong> Proves that you have sufficient funds and that 
          the transaction is valid without revealing your balance or transaction details.
        </li>
        <li>
          <strong>Pedersen Commitments:</strong> Cryptographic commitments that hide values while allowing 
          verification of relationships between them.
        </li>
        <li>
          <strong>Nullifiers:</strong> Prevent double-spending without revealing which transaction output 
          is being spent.
        </li>
      </ol>

      <h2>Current Status</h2>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-6">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h4 className="font-semibold text-amber-900 mb-1">Demo Mode</h4>
            <p className="text-sm text-amber-800">
              Privacy features (Shielded and Private modes) are currently in demo mode. They use simulated 
              zero-knowledge proofs for UI demonstration. Public transfers work fully on mainnet. Real privacy 
              features with Light Protocol integration are coming soon.
            </p>
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

