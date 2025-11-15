export default function APIPage() {
  return (
    <div className="prose max-w-none">
      <h1>API Reference</h1>
      
      <p className="text-xl text-gray-600">
        Complete API documentation for ExePay packages.
      </p>

      <h2>Packages</h2>

      <div className="grid md:grid-cols-2 gap-6 my-8 not-prose">
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">@exe-pay/core</h3>
          <p className="text-gray-600 text-sm mb-4">
            Core SDK for private payments on Solana. Includes ElGamal encryption, ZK proofs, and transaction building.
          </p>
          <a href="/api/core" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            View Documentation →
          </a>
        </div>

        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">@exe-pay/privacy</h3>
          <p className="text-gray-600 text-sm mb-4">
            Privacy primitives including ZK-SNARKs, Pedersen commitments, and nullifier generation.
          </p>
          <a href="/api/privacy" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            View Documentation →
          </a>
        </div>

        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">@exe-pay/react-hooks</h3>
          <p className="text-gray-600 text-sm mb-4">
            React hooks for easy integration into React applications. Includes wallet management and payment hooks.
          </p>
          <a href="/api/react-hooks" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            View Documentation →
          </a>
        </div>

        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">@exe-pay/utils</h3>
          <p className="text-gray-600 text-sm mb-4">
            Utility functions for address validation, amount formatting, and transaction helpers.
          </p>
          <a href="/api/utils" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            View Documentation →
          </a>
        </div>
      </div>

      <h2>Quick Example</h2>

      <pre><code>{`import { ExePayClient } from '@exe-pay/core';
import { useExePay } from '@exe-pay/react-hooks';
import { Connection } from '@solana/web3.js';

// Initialize client
const connection = new Connection('https://api.mainnet-beta.solana.com');
const client = new ExePayClient(connection);

// Send a payment
const result = await client.sendPayment({
  recipient: 'RECIPIENT_WALLET_ADDRESS',
  amount: 1000000, // lamports
  privacyLevel: 'public',
  token: undefined // SOL
});

// In React components
function PaymentButton() {
  const { sendPayment, loading } = useExePay();
  
  const handlePay = async () => {
    await sendPayment({
      recipient: 'ADDRESS',
      amount: 1000000
    });
  };
  
  return <button onClick={handlePay} disabled={loading}>Send Payment</button>;
}`}</code></pre>

      <h2>Core Concepts</h2>

      <h3>ExePayClient</h3>
      <p>
        The main client for interacting with ExePay. Handles connection management, transaction building, 
        and privacy features.
      </p>

      <h3>Privacy Levels</h3>
      <ul>
        <li><code>public</code> - Standard Solana transfers</li>
        <li><code>shielded</code> - Hidden amounts (demo)</li>
        <li><code>private</code> - Fully private (demo)</li>
      </ul>

      <h3>Token Support</h3>
      <p>
        ExePay supports SOL and SPL tokens including USDC, USDT, BONK, and JUP. Pass the token mint address 
        to send tokens instead of SOL.
      </p>

      <h2>TypeScript Support</h2>

      <p>
        All ExePay packages are written in TypeScript and include full type definitions. Your IDE will 
        provide autocomplete and type checking out of the box.
      </p>

      <pre><code>{`import type { PaymentParams, PaymentResult } from '@exe-pay/core';

const params: PaymentParams = {
  recipient: 'ADDRESS',
  amount: 1000000,
  privacyLevel: 'public'
};

const result: PaymentResult = await client.sendPayment(params);`}</code></pre>

      <h2>Error Handling</h2>

      <p>
        ExePay throws descriptive errors that you can catch and handle:
      </p>

      <pre><code>{`try {
  await client.sendPayment(params);
} catch (error) {
  if (error.message.includes('Insufficient funds')) {
    // Handle insufficient funds
  } else if (error.message.includes('Invalid address')) {
    // Handle invalid address
  } else {
    // Handle other errors
  }
}`}</code></pre>

      <h2>Need More Help?</h2>

      <p>
        Check out our <a href="/examples">examples</a> for more code samples, or visit our 
        <a href="https://github.com/ExePayInfra/exe-pay"> GitHub repository</a> for the full source code.
      </p>
    </div>
  );
}

