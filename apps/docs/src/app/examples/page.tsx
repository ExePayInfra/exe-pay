export default function ExamplesPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Code Examples</h1>
      <p className="text-lg text-gray-700 mb-8">
        Real-world code examples to help you integrate ExePay into your application.
      </p>

      {/* Example 1: Simple Payment */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Simple SOL Payment</h2>
        <p className="text-gray-700 mb-4">
          Send SOL from one wallet to another with transaction confirmation.
        </p>
        <div className="bg-gray-900 text-white p-6 rounded-lg overflow-x-auto">
          <pre className="text-sm">
{`import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';

export function SendSOL() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const sendPayment = async (recipientAddress: string, amount: number) => {
    if (!publicKey) throw new Error('Wallet not connected');

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey(recipientAddress),
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );

    const signature = await sendTransaction(transaction, connection);
    await connection.confirmTransaction(signature, 'confirmed');
    
    return signature;
  };

  return (
    <button onClick={() => sendPayment('RECIPIENT_ADDRESS', 0.1)}>
      Send 0.1 SOL
    </button>
  );
}`}
          </pre>
        </div>
      </div>

      {/* Example 2: SPL Token Transfer */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. SPL Token Transfer (USDC)</h2>
        <p className="text-gray-700 mb-4">
          Send USDC or other SPL tokens with automatic ATA creation.
        </p>
        <div className="bg-gray-900 text-white p-6 rounded-lg overflow-x-auto">
          <pre className="text-sm">
{`import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction } from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
} from '@solana/spl-token';

const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'); // Mainnet USDC

export function SendUSDC() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const sendUSDC = async (recipientAddress: string, amount: number) => {
    if (!publicKey) throw new Error('Wallet not connected');

    const recipient = new PublicKey(recipientAddress);
    
    // Get token accounts
    const senderATA = await getAssociatedTokenAddress(USDC_MINT, publicKey);
    const recipientATA = await getAssociatedTokenAddress(USDC_MINT, recipient);

    const transaction = new Transaction();

    // Check if recipient ATA exists, if not create it
    const recipientAccount = await connection.getAccountInfo(recipientATA);
    if (!recipientAccount) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          publicKey,
          recipientATA,
          recipient,
          USDC_MINT
        )
      );
    }

    // Add transfer instruction (USDC has 6 decimals)
    transaction.add(
      createTransferInstruction(
        senderATA,
        recipientATA,
        publicKey,
        amount * 1_000_000 // Convert to smallest unit
      )
    );

    const signature = await sendTransaction(transaction, connection);
    await connection.confirmTransaction(signature, 'confirmed');
    
    return signature;
  };

  return (
    <button onClick={() => sendUSDC('RECIPIENT_ADDRESS', 10)}>
      Send 10 USDC
    </button>
  );
}`}
          </pre>
        </div>
      </div>

      {/* Example 3: Batch Payments */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Batch Payments</h2>
        <p className="text-gray-700 mb-4">
          Send payments to multiple recipients in a single transaction.
        </p>
        <div className="bg-gray-900 text-white p-6 rounded-lg overflow-x-auto">
          <pre className="text-sm">
{`import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';

interface Recipient {
  address: string;
  amount: number;
}

export function BatchPayment() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const sendBatch = async (recipients: Recipient[]) => {
    if (!publicKey) throw new Error('Wallet not connected');

    const transaction = new Transaction();

    // Add transfer instruction for each recipient
    for (const recipient of recipients) {
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(recipient.address),
          lamports: recipient.amount * LAMPORTS_PER_SOL,
        })
      );
    }

    const signature = await sendTransaction(transaction, connection);
    await connection.confirmTransaction(signature, 'confirmed');
    
    return signature;
  };

  const recipients: Recipient[] = [
    { address: 'ADDRESS_1', amount: 0.1 },
    { address: 'ADDRESS_2', amount: 0.2 },
    { address: 'ADDRESS_3', amount: 0.3 },
  ];

  return (
    <button onClick={() => sendBatch(recipients)}>
      Send Batch Payment
    </button>
  );
}`}
          </pre>
        </div>
      </div>

      {/* Example 4: Recurring Payments */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Recurring Payments Setup</h2>
        <p className="text-gray-700 mb-4">
          Create a subscription that automatically executes payments on a schedule.
        </p>
        <div className="bg-gray-900 text-white p-6 rounded-lg overflow-x-auto">
          <pre className="text-sm">
{`import { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';

interface Subscription {
  id: string;
  recipient: string;
  amount: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  nextPayment: Date;
  active: boolean;
}

export function RecurringPayment() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  const createSubscription = (
    recipient: string,
    amount: number,
    frequency: 'daily' | 'weekly' | 'monthly'
  ) => {
    const subscription: Subscription = {
      id: Date.now().toString(),
      recipient,
      amount,
      frequency,
      nextPayment: getNextPaymentDate(frequency),
      active: true,
    };

    setSubscriptions([...subscriptions, subscription]);
    localStorage.setItem('subscriptions', JSON.stringify([...subscriptions, subscription]));
  };

  const executePayment = async (subscription: Subscription) => {
    if (!publicKey) return;

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey(subscription.recipient),
        lamports: subscription.amount * LAMPORTS_PER_SOL,
      })
    );

    const signature = await sendTransaction(transaction, connection);
    await connection.confirmTransaction(signature, 'confirmed');

    // Update next payment date
    const updated = subscriptions.map(sub =>
      sub.id === subscription.id
        ? { ...sub, nextPayment: getNextPaymentDate(sub.frequency) }
        : sub
    );
    setSubscriptions(updated);
    localStorage.setItem('subscriptions', JSON.stringify(updated));

    return signature;
  };

  const getNextPaymentDate = (frequency: string) => {
    const now = new Date();
    switch (frequency) {
      case 'daily':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      case 'monthly':
        return new Date(now.setMonth(now.getMonth() + 1));
      default:
        return now;
    }
  };

  // Check for due payments
  useEffect(() => {
    const interval = setInterval(() => {
      subscriptions.forEach(sub => {
        if (sub.active && new Date() >= sub.nextPayment) {
          executePayment(sub);
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [subscriptions]);

  return (
    <div>
      <button
        onClick={() => createSubscription('RECIPIENT_ADDRESS', 0.1, 'monthly')}
      >
        Subscribe (0.1 SOL/month)
      </button>

      <div>
        {subscriptions.map(sub => (
          <div key={sub.id}>
            <p>To: {sub.recipient}</p>
            <p>Amount: {sub.amount} SOL</p>
            <p>Frequency: {sub.frequency}</p>
            <p>Next: {sub.nextPayment.toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}`}
          </pre>
        </div>
      </div>

      {/* Example 5: Transaction History */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Fetch Transaction History</h2>
        <p className="text-gray-700 mb-4">
          Display a user's transaction history with details.
        </p>
        <div className="bg-gray-900 text-white p-6 rounded-lg overflow-x-auto">
          <pre className="text-sm">
{`import { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

interface Transaction {
  signature: string;
  timestamp: number;
  amount: number;
  type: 'sent' | 'received';
  counterparty: string;
}

export function TransactionHistory() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    if (!publicKey) return;
    
    setLoading(true);
    try {
      const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 10 });
      const txs: Transaction[] = [];

      for (const sig of signatures) {
        const tx = await connection.getParsedTransaction(sig.signature);
        if (!tx) continue;

        const instruction = tx.transaction.message.instructions[0];
        if ('parsed' in instruction && instruction.parsed.type === 'transfer') {
          const info = instruction.parsed.info;
          const isSent = info.source === publicKey.toBase58();

          txs.push({
            signature: sig.signature,
            timestamp: tx.blockTime || 0,
            amount: info.lamports / LAMPORTS_PER_SOL,
            type: isSent ? 'sent' : 'received',
            counterparty: isSent ? info.destination : info.source,
          });
        }
      }

      setTransactions(txs);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [publicKey]);

  return (
    <div>
      <h2>Transaction History</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {transactions.map(tx => (
            <div key={tx.signature}>
              <p>
                {tx.type === 'sent' ? '↗️ Sent' : '↙️ Received'} {tx.amount} SOL
              </p>
              <p>
                {tx.type === 'sent' ? 'To' : 'From'}: {tx.counterparty.slice(0, 8)}...
              </p>
              <p>{new Date(tx.timestamp * 1000).toLocaleString()}</p>
              <a
                href={\`https://solscan.io/tx/\${tx.signature}\`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Solscan
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}`}
          </pre>
        </div>
      </div>

      {/* Example 6: Stealth Address Payment */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Private Payment with Stealth Addresses</h2>
        <p className="text-gray-700 mb-4">
          Send a private payment using stealth addresses for recipient privacy.
        </p>
        <div className="bg-gray-900 text-white p-6 rounded-lg overflow-x-auto">
          <pre className="text-sm">
{`import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { generateStealthAddress, sendStealthPayment } from '@exe-pay/privacy';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export function StealthPayment() {
  const { publicKey, signMessage } = useWallet();
  const { connection } = useConnection();

  const sendPrivatePayment = async (
    recipientMetaAddress: string,
    amount: number
  ) => {
    if (!publicKey || !signMessage) throw new Error('Wallet not connected');

    // Generate stealth address for this payment
    const { stealthAddress, ephemeralPubkey, viewTag } = 
      await generateStealthAddress(recipientMetaAddress);

    console.log('Generated stealth address:', stealthAddress);
    console.log('View tag (for scanning):', viewTag);

    // Send payment to stealth address with metadata
    const signature = await sendStealthPayment({
      connection,
      senderPublicKey: publicKey,
      recipientStealthAddress: stealthAddress,
      amount: amount * LAMPORTS_PER_SOL,
      ephemeralPubkey,
      viewTag,
      signTransaction: async (tx) => {
        // Use wallet adapter to sign
        return tx;
      },
    });

    return { signature, stealthAddress };
  };

  return (
    <button onClick={() => sendPrivatePayment('META_ADDRESS', 0.1)}>
      Send 0.1 SOL Privately
    </button>
  );
}`}
          </pre>
        </div>
      </div>

      {/* Example 7: View Keys for Auditing */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Generate View Keys for Compliance</h2>
        <p className="text-gray-700 mb-4">
          Generate read-only view keys for accountants and auditors.
        </p>
        <div className="bg-gray-900 text-white p-6 rounded-lg overflow-x-auto">
          <pre className="text-sm">
{`import { useWallet } from '@solana/wallet-adapter-react';
import { generateViewKeys, encodeViewKeys } from '@exe-pay/privacy';

export function ViewKeysGenerator() {
  const { publicKey, signMessage } = useWallet();

  const createViewKeys = async () => {
    if (!publicKey || !signMessage) throw new Error('Wallet not connected');

    // Generate message to sign
    const message = new TextEncoder().encode(
      \`Generate View Keys for \${publicKey.toBase58()}\n\nTimestamp: \${Date.now()}\`
    );

    // Request signature from wallet
    const signature = await signMessage(message);

    // Generate view keys from signature
    const viewKeys = await generateViewKeys(publicKey, signature);
    const encoded = encodeViewKeys(viewKeys);

    console.log('Private View Key:', encoded.privateViewKey);
    console.log('Public View Key:', encoded.publicViewKey);
    console.log('Spend Public Key:', encoded.spendPublicKey);

    // Can be exported as JSON for accounting software
    return {
      privateViewKey: encoded.privateViewKey,  // For your records only
      publicViewKey: encoded.publicViewKey,    // Safe to share with auditors
      spendPublicKey: encoded.spendPublicKey,  // Your wallet address
    };
  };

  return (
    <button onClick={createViewKeys}>
      Generate View Keys
    </button>
  );
}`}
          </pre>
        </div>
      </div>

      <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-8">
        <div className="flex items-start">
          <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-bold text-green-900 mb-2">More Examples</h3>
            <p className="text-green-800 mb-2">
              Check out our <a href="https://github.com/ExePayInfra/exe-pay/tree/main/apps/web" className="underline font-semibold">GitHub repository</a> for more examples, including:
            </p>
            <ul className="list-disc list-inside text-green-800 space-y-1 ml-4">
              <li>Payment links and QR codes</li>
              <li>Integrated addresses for invoice tracking</li>
              <li>Subaddresses for multiple identities</li>
              <li>Payment proofs for disputes</li>
              <li>Error handling and retries</li>
              <li>Mobile wallet integration</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

