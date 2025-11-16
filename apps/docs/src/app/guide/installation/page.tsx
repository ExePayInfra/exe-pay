export default function InstallationPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Installation</h1>
      <p className="text-lg text-gray-700 mb-8">
        Get started with ExePay in minutes. This guide will walk you through installing the SDK and setting up your first project.
      </p>

      <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-12">Prerequisites</h2>
      <p className="text-lg text-gray-700 mb-4">
        Before you begin, make sure you have:
      </p>
      <ul className="list-disc list-inside text-lg text-gray-700 space-y-2 mb-8 ml-4">
        <li>Node.js 18+ installed</li>
        <li>A Solana wallet (Phantom, Backpack, or Solflare)</li>
        <li>Basic knowledge of React and TypeScript</li>
        <li>Some SOL for transaction fees (devnet SOL is free)</li>
      </ul>

      <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-12">Install Packages</h2>
      <p className="text-lg text-gray-700 mb-4">
        Install ExePay SDK packages using your preferred package manager:
      </p>

      <div className="bg-gray-900 text-white p-6 rounded-lg mb-6">
        <div className="mb-4">
          <div className="text-gray-400 text-sm mb-2"># Using pnpm (recommended)</div>
          <code className="text-green-400">pnpm add @exe-pay/core @exe-pay/react-hooks @solana/web3.js</code>
        </div>
        <div className="mb-4">
          <div className="text-gray-400 text-sm mb-2"># Using npm</div>
          <code className="text-green-400">npm install @exe-pay/core @exe-pay/react-hooks @solana/web3.js</code>
        </div>
        <div>
          <div className="text-gray-400 text-sm mb-2"># Using yarn</div>
          <code className="text-green-400">yarn add @exe-pay/core @exe-pay/react-hooks @solana/web3.js</code>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-12">Install Wallet Adapters</h2>
      <p className="text-lg text-gray-700 mb-4">
        For wallet integration, you'll also need Solana wallet adapters:
      </p>

      <div className="bg-gray-900 text-white p-6 rounded-lg mb-6">
        <code className="text-green-400">
          pnpm add @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets
        </code>
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-12">Set Up Environment Variables</h2>
      <p className="text-lg text-gray-700 mb-4">
        Create a <code className="bg-gray-100 px-2 py-1 rounded text-sm">.env.local</code> file in your project root:
      </p>

      <div className="bg-gray-900 text-white p-6 rounded-lg mb-6">
        <div className="mb-2">
          <code className="text-blue-400">NEXT_PUBLIC_SOLANA_NETWORK</code>
          <code className="text-white">=</code>
          <code className="text-yellow-400">devnet</code>
        </div>
        <div>
          <code className="text-blue-400">NEXT_PUBLIC_SOLANA_RPC_URL</code>
          <code className="text-white">=</code>
          <code className="text-yellow-400">https://api.devnet.solana.com</code>
        </div>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-6 mb-8">
        <div className="flex items-start">
          <svg className="w-6 h-6 text-amber-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h3 className="font-bold text-amber-900 mb-2">Production RPC</h3>
            <p className="text-amber-800">
              For production, use a dedicated RPC provider like <a href="https://helius.dev" className="underline">Helius</a> or <a href="https://quicknode.com" className="underline">QuickNode</a> to avoid rate limiting.
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-12">Verify Installation</h2>
      <p className="text-lg text-gray-700 mb-4">
        Test your installation by importing the SDK:
      </p>

      <div className="bg-gray-900 text-white p-6 rounded-lg mb-6">
        <pre className="text-sm">
{`import { Connection, PublicKey } from '@solana/web3.js';
import { useWallet } from '@exe-pay/react-hooks';

// Your code here...`}
        </pre>
      </div>

      <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-8">
        <div className="flex items-start">
          <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-bold text-green-900 mb-2">Next Step</h3>
            <p className="text-green-800">
              Now that you've installed ExePay, head over to the <a href="/guide/quick-start" className="underline font-semibold">Quick Start Guide</a> to send your first private payment!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

