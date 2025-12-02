export default function UtilsAPIPage() {
  return (
    <div className="prose max-w-none">
      <h1>@exe-pay/utils</h1>
      
      <p className="text-xl text-gray-600">
        Utility functions for address validation, amount formatting, transaction helpers, and common operations.
      </p>

      <h2>Installation</h2>

      <pre><code>{`npm install @exe-pay/utils @solana/web3.js`}</code></pre>

      <h2>Features</h2>

      <h3>1. Address Validation</h3>
      <p>Validate Solana addresses and check their format.</p>

      <pre><code>{`import { PublicKey } from '@solana/web3.js';

export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

// Usage
const address = 'BqH7jFr3e45jN2dZ8vYvz9Pq7GqJ5rT8xLmN4kP6wQvU';
if (isValidSolanaAddress(address)) {
  console.log('Valid Solana address');
}`}</code></pre>

      <h3>2. Amount Formatting</h3>
      <p>Format lamports to SOL and handle decimal conversions.</p>

      <pre><code>{`import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export function formatSOL(lamports: number, decimals: number = 4): string {
  return (lamports / LAMPORTS_PER_SOL).toFixed(decimals);
}

export function parseSOL(sol: string): number {
  return parseFloat(sol) * LAMPORTS_PER_SOL;
}

// Usage
const lamports = 1500000;
console.log(formatSOL(lamports));        // "0.0015"
console.log(formatSOL(lamports, 6));     // "0.001500"

const sol = "0.5";
console.log(parseSOL(sol));              // 500000000`}</code></pre>

      <h3>3. Transaction Helpers</h3>
      <p>Common utilities for transaction building and confirmation.</p>

      <pre><code>{`import { Connection, Transaction, PublicKey } from '@solana/web3.js';

export async function confirmTransaction(
  connection: Connection,
  signature: string,
  commitment: 'processed' | 'confirmed' | 'finalized' = 'confirmed'
) {
  const result = await connection.confirmTransaction(signature, commitment);
  
  if (result.value.err) {
    throw new Error('Transaction failed: ' + JSON.stringify(result.value.err));
  }
  
  return result;
}

export async function getTransactionFee(
  connection: Connection,
  transaction: Transaction
): Promise<number> {
  const { feeCalculator } = await connection.getRecentBlockhash();
  return feeCalculator.lamportsPerSignature * transaction.signatures.length;
}`}</code></pre>

      <h3>4. Token Utilities</h3>
      <p>Helper functions for working with SPL tokens.</p>

      <pre><code>{`import { PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';

export async function getTokenBalance(
  connection: Connection,
  wallet: PublicKey,
  mint: PublicKey
): Promise<number> {
  const tokenAccount = await getAssociatedTokenAddress(mint, wallet);
  const balance = await connection.getTokenAccountBalance(tokenAccount);
  return parseFloat(balance.value.amount) / Math.pow(10, balance.value.decimals);
}

// Common token mints
export const TOKENS = {
  USDC: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
  USDT: new PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'),
  BONK: new PublicKey('DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'),
};`}</code></pre>

      <h3>5. QR Code Generation</h3>
      <p>Generate QR codes for payment requests.</p>

      <pre><code>{`import QRCode from 'qrcode';

export async function generatePaymentQR(
  recipient: string,
  amount: number,
  memo?: string
): Promise<string> {
  const data = {
    recipient,
    amount,
    memo,
    network: 'mainnet-beta'
  };
  
  const qrDataUrl = await QRCode.toDataURL(JSON.stringify(data), {
    width: 256,
    margin: 2,
    color: {
      dark: '#6366f1',
      light: '#ffffff'
    }
  });
  
  return qrDataUrl;
}

// Usage in React
export function PaymentQR({ recipient, amount }: Props) {
  const [qr, setQr] = useState<string>('');

  useEffect(() => {
    generatePaymentQR(recipient, amount).then(setQr);
  }, [recipient, amount]);

  return qr ? <img src={qr} alt="Payment QR Code" /> : <p>Loading...</p>;
}`}</code></pre>

      <h3>6. Shortening Addresses</h3>
      <p>Display-friendly wallet address formatting.</p>

      <pre><code>{`export function shortenAddress(
  address: string,
  chars: number = 4
): string {
  return \`\${address.slice(0, chars)}...\${address.slice(-chars)}\`;
}

// Usage
const wallet = 'BqH7jFr3e45jN2dZ8vYvz9Pq7GqJ5rT8xLmN4kP6wQvU';
console.log(shortenAddress(wallet));        // "BqH7...wQvU"
console.log(shortenAddress(wallet, 6));     // "BqH7jF...P6wQvU"`}</code></pre>

      <h3>7. Error Handling Utilities</h3>
      <p>Parse and handle common Solana errors.</p>

      <pre><code>{`export function parseTransactionError(error: any): string {
  const message = error.message || error.toString();
  
  if (message.includes('User rejected')) {
    return 'Transaction cancelled by user';
  }
  if (message.includes('Insufficient funds')) {
    return 'Insufficient SOL for transaction and fees';
  }
  if (message.includes('Blockhash not found')) {
    return 'Transaction expired. Please try again.';
  }
  if (message.includes('0x1')) {
    return 'Insufficient funds for rent exemption';
  }
  if (message.includes('0x0')) {
    return 'Transaction failed. Account may not exist.';
  }
  
  return 'Transaction failed: ' + message;
}

// Usage
try {
  await sendTransaction(tx, connection);
} catch (error) {
  const friendlyMessage = parseTransactionError(error);
  alert(friendlyMessage);
}`}</code></pre>

      <h2>Complete Example Component</h2>

      <pre><code>{`import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { 
  isValidSolanaAddress, 
  formatSOL, 
  parseSOL, 
  shortenAddress,
  parseTransactionError 
} from '@exe-pay/utils';

export function PaymentForm() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    // Validation
    if (!isValidSolanaAddress(recipient)) {
      setError('Invalid recipient address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey!,
          toPubkey: new PublicKey(recipient),
          lamports: parseSOL(amount),
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      
      alert(\`Success! Sent \${amount} SOL\\nSignature: \${shortenAddress(signature)}\`);
    } catch (err) {
      setError(parseTransactionError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        placeholder="Recipient address"
      />
      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount in SOL"
        type="number"
      />
      <button onClick={handleSend} disabled={loading}>
        {loading ? 'Sending...' : 'Send Payment'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}`}</code></pre>

      <div className="bg-purple-50 border-l-4 border-purple-500 p-6 my-8 not-prose">
        <h3 className="font-bold text-purple-900 mb-2">🎯 Pro Tip</h3>
        <p className="text-purple-800">
          Combine these utilities with hooks from <a href="/api/react-hooks" className="underline font-semibold">@exe-pay/react-hooks</a> 
          and privacy features from <a href="/api/privacy" className="underline font-semibold">@exe-pay/privacy</a> 
          for a complete payment solution.
        </p>
      </div>
    </div>
  );
}

