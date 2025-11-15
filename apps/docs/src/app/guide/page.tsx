export default function GuidePage() {
  return (
    <div className="prose max-w-none">
      <h1>User Guide</h1>
      
      <p className="text-xl text-gray-600">
        Learn how to use ExePay for private, secure payments on Solana.
      </p>

      <h2>Getting Started</h2>
      
      <p>
        ExePay makes it easy to send private payments on Solana. Whether you're sending SOL or SPL tokens, 
        you can choose the level of privacy that fits your needs.
      </p>

      <h3>Installation</h3>

      <p>Install the ExePay packages using pnpm, npm, or yarn:</p>

      <pre><code>pnpm add @exe-pay/core @exe-pay/react-hooks</code></pre>

      <h3>Basic Usage</h3>

      <p>Here's a simple example of sending a payment:</p>

      <pre><code>{`import { ExePayClient } from '@exe-pay/core';
import { Connection, clusterApiUrl } from '@solana/web3.js';

// Create a connection
const connection = new Connection(clusterApiUrl('mainnet-beta'));

// Initialize the client
const client = new ExePayClient(connection);

// Send a payment
const result = await client.sendPayment({
  recipient: 'RECIPIENT_ADDRESS',
  amount: 1000000, // 0.001 SOL in lamports
  privacyLevel: 'public' // or 'shielded' or 'private'
});`}</code></pre>

      <h2>Privacy Levels</h2>

      <h3>Public</h3>
      <p>
        Standard Solana transfers. Transaction details are visible on-chain. Use this when privacy isn't a concern.
      </p>

      <h3>Shielded (Demo)</h3>
      <p>
        Hides transaction amounts using Pedersen commitments. Sender and recipient addresses are visible, 
        but the amount is encrypted. Currently in demo mode.
      </p>

      <h3>Private (Demo)</h3>
      <p>
        Fully private transfers where sender, recipient, and amount are all hidden using zero-knowledge proofs. 
        Currently in demo mode.
      </p>

      <h2>Next Steps</h2>

      <ul>
        <li><a href="/guide/sending-payments">Learn about sending payments</a></li>
        <li><a href="/guide/batch-payments">Explore batch payments</a></li>
        <li><a href="/guide/recurring-payments">Set up recurring payments</a></li>
        <li><a href="/api">Check out the API reference</a></li>
      </ul>
    </div>
  );
}

