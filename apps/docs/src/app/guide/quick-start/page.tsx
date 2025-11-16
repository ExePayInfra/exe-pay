export default function QuickStartPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Quick Start</h1>
      <p className="text-lg text-gray-700 mb-8">
        Send your first private payment in under 5 minutes. This guide assumes you've already <a href="/guide/installation" className="text-indigo-600 underline">installed ExePay</a>.
      </p>

      <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-12">Step 1: Set Up Wallet Provider</h2>
      <p className="text-lg text-gray-700 mb-4">
        Wrap your app with the Solana wallet provider:
      </p>

      <div className="bg-gray-900 text-white p-6 rounded-lg mb-6 overflow-x-auto">
        <pre className="text-sm">
{`// app/layout.tsx or _app.tsx
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { useMemo } from 'react';

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

export default function App({ children }) {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}`}
        </pre>
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-12">Step 2: Connect Wallet</h2>
      <p className="text-lg text-gray-700 mb-4">
        Add a wallet connect button to your page:
      </p>

      <div className="bg-gray-900 text-white p-6 rounded-lg mb-6 overflow-x-auto">
        <pre className="text-sm">
{`'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function WalletPage() {
  const { publicKey, connected } = useWallet();

  return (
    <div>
      <WalletMultiButton />
      
      {connected && (
        <p>Connected: {publicKey?.toBase58()}</p>
      )}
    </div>
  );
}`}
        </pre>
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-12">Step 3: Send Your First Payment</h2>
      <p className="text-lg text-gray-700 mb-4">
        Send a public SOL payment:
      </p>

      <div className="bg-gray-900 text-white p-6 rounded-lg mb-6 overflow-x-auto">
        <pre className="text-sm">
{`'use client';

import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useState } from 'react';

export default function SendPayment() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');

  const handleSend = async () => {
    if (!publicKey) return;
    
    try {
      setStatus('Sending...');
      
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(recipient),
          lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      
      setStatus(\`Success! Signature: \${signature}\`);
    } catch (error) {
      setStatus(\`Error: \${error.message}\`);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Recipient address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount (SOL)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleSend}>Send SOL</button>
      {status && <p>{status}</p>}
    </div>
  );
}`}
        </pre>
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-12">Step 4: Enable Privacy</h2>
      <p className="text-lg text-gray-700 mb-4">
        Switch to a shielded transfer to hide the amount:
      </p>

      <div className="bg-gray-900 text-white p-6 rounded-lg mb-6 overflow-x-auto">
        <pre className="text-sm">
{`import { createShieldedTransfer } from '@exe-pay/core';

// Instead of SystemProgram.transfer, use:
const { transaction, proof } = await createShieldedTransfer({
  sender: publicKey,
  recipient: new PublicKey(recipient),
  amount: parseFloat(amount) * LAMPORTS_PER_SOL,
  connection,
});

const signature = await sendTransaction(transaction, connection);`}
        </pre>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-6 mb-8">
        <div className="flex items-start">
          <svg className="w-6 h-6 text-amber-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h3 className="font-bold text-green-900 mb-2">Production Ready</h3>
            <p className="text-green-800">
              Shielded and Private transfers are now in <strong>PRODUCTION</strong>! They use real Groth16 ZK-SNARKs to provide cryptographic privacy. Your transactions are truly private.
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-12">Get Devnet SOL</h2>
      <p className="text-lg text-gray-700 mb-4">
        You'll need devnet SOL for testing. Get free devnet SOL from:
      </p>
      <ul className="list-disc list-inside text-lg text-gray-700 space-y-2 mb-8 ml-4">
        <li><a href="https://faucet.solana.com" className="text-indigo-600 underline">Solana Faucet</a> - Official faucet</li>
        <li><a href="https://solfaucet.com" className="text-indigo-600 underline">SolFaucet</a> - Community faucet</li>
        <li>Use <code className="bg-gray-100 px-2 py-1 rounded text-sm">solana airdrop 2</code> via Solana CLI</li>
      </ul>

      <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-8">
        <div className="flex items-start">
          <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-bold text-green-900 mb-2">Next Steps</h3>
            <p className="text-green-800 mb-2">
              You've sent your first payment! Now explore:
            </p>
            <ul className="list-disc list-inside text-green-800 space-y-1 ml-4">
              <li><a href="/guide/privacy-modes" className="underline font-semibold">Privacy Modes</a> - Learn about Public, Shielded, and Private transfers</li>
              <li><a href="/guide/batch-payments" className="underline font-semibold">Batch Payments</a> - Send to multiple recipients at once</li>
              <li><a href="/examples" className="underline font-semibold">Code Examples</a> - More real-world examples</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

