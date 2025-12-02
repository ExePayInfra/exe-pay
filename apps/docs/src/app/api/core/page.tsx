export default function CoreAPIPage() {
  return (
    <div className="prose max-w-none">
      <h1>@exe-pay/core</h1>
      
      <p className="text-xl text-gray-600">
        Core SDK for building payment applications on Solana. Handles transaction building, wallet management, and payment processing.
      </p>

      <h2>Installation</h2>

      <pre><code>{`npm install @exe-pay/core @solana/web3.js`}</code></pre>

      <h2>Quick Start</h2>

      <pre><code>{`import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';

export function SimplePayment() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const sendSOL = async (recipientAddress: string, amount: number) => {
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
    <button onClick={() => sendSOL('RECIPIENT_ADDRESS', 0.1)}>
      Send 0.1 SOL
    </button>
  );
}`}</code></pre>

      <h2>Features</h2>

      <h3>1. Simple Payments</h3>
      <p>Send SOL or SPL tokens with automatic transaction building.</p>

      <pre><code>{`import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

// Send SOL
await sendSOL(recipientAddress, 0.5);

// Send with memo
const memo = 'Payment for invoice #123';
await sendSOL(recipientAddress, 1.0, memo);`}</code></pre>

      <h3>2. SPL Token Transfers</h3>
      <p>Support for USDC, USDT, and all SPL tokens with automatic ATA creation.</p>

      <pre><code>{`import { 
  getAssociatedTokenAddress,
  createTransferInstruction 
} from '@solana/spl-token';

const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

// Get token accounts
const senderATA = await getAssociatedTokenAddress(USDC_MINT, publicKey);
const recipientATA = await getAssociatedTokenAddress(USDC_MINT, recipient);

// Transfer USDC (6 decimals)
const amount = 10 * 1_000_000; // 10 USDC
await transferToken(senderATA, recipientATA, amount);`}</code></pre>

      <h3>3. Batch Payments</h3>
      <p>Send to multiple recipients in a single transaction.</p>

      <pre><code>{`const recipients = [
  { address: 'ADDRESS_1', amount: 0.1 },
  { address: 'ADDRESS_2', amount: 0.2 },
  { address: 'ADDRESS_3', amount: 0.3 },
];

const transaction = new Transaction();

recipients.forEach(recipient => {
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: new PublicKey(recipient.address),
      lamports: recipient.amount * LAMPORTS_PER_SOL,
    })
  );
});

const signature = await sendTransaction(transaction, connection);`}</code></pre>

      <h3>4. Transaction History</h3>
      <p>Fetch and display transaction history for any wallet.</p>

      <pre><code>{`// Get recent transactions
const signatures = await connection.getSignaturesForAddress(
  publicKey, 
  { limit: 20 }
);

// Get transaction details
for (const sig of signatures) {
  const tx = await connection.getParsedTransaction(sig.signature);
  console.log('Transaction:', tx);
}`}</code></pre>

      <h3>5. Payment Links</h3>
      <p>Generate shareable payment links and QR codes.</p>

      <pre><code>{`// Create payment link
const paymentLink = createPaymentLink({
  recipient: publicKey.toBase58(),
  amount: 0.1,
  memo: 'Coffee payment',
  network: 'mainnet-beta'
});

// Share link: https://exepay.app/pay?recipient=...&amount=0.1

// Or generate QR code
const qrData = JSON.stringify({
  recipient: publicKey.toBase58(),
  amount: 0.1,
  network: 'mainnet-beta'
});`}</code></pre>

      <h2>Configuration</h2>

      <h3>Connection Setup</h3>

      <pre><code>{`import { Connection, clusterApiUrl } from '@solana/web3.js';

// Devnet (for testing)
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

// Mainnet (production)
const connection = new Connection('https://api.mainnet-beta.solana.com', {
  commitment: 'confirmed',
  confirmTransactionInitialTimeout: 60000
});`}</code></pre>

      <h3>Wallet Integration</h3>

      <pre><code>{`import { WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';

const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
];

function App() {
  return (
    <ConnectionProvider endpoint="https://api.mainnet-beta.solana.com">
      <WalletProvider wallets={wallets} autoConnect>
        <YourApp />
      </WalletProvider>
    </ConnectionProvider>
  );
}`}</code></pre>

      <h2>Error Handling</h2>

      <pre><code>{`try {
  const signature = await sendPayment(recipient, amount);
  console.log('Success:', signature);
} catch (error: any) {
  if (error.message.includes('User rejected')) {
    console.log('Transaction cancelled by user');
  } else if (error.message.includes('Insufficient funds')) {
    console.log('Not enough SOL for transaction');
  } else if (error.message.includes('Blockhash not found')) {
    console.log('Transaction expired, please retry');
  } else {
    console.error('Transaction failed:', error);
  }
}`}</code></pre>

      <h2>Type Definitions</h2>

      <pre><code>{`interface PaymentRequest {
  recipient: string;
  amount: number;
  token?: string;
  memo?: string;
}

interface TransactionResult {
  signature: string;
  confirmed: boolean;
  timestamp: number;
}

interface BatchRecipient {
  address: string;
  amount: number;
}`}</code></pre>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8 not-prose">
        <h3 className="font-bold text-blue-900 mb-2">💡 Next Steps</h3>
        <p className="text-blue-800">
          For privacy features like stealth addresses and view keys, see the 
          <a href="/api/privacy" className="underline font-semibold ml-1">@exe-pay/privacy package</a>.
        </p>
      </div>
    </div>
  );
}

