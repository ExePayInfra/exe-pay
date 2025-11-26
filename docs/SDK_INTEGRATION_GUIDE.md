# ExePay SDK Integration Guide

**Version:** 0.3.0  
**Last Updated:** November 25, 2025  
**Difficulty:** Beginner to Advanced

---

## 📚 Table of Contents

1. [Quick Start (5 Minutes)](#quick-start-5-minutes)
2. [Installation](#installation)
3. [Basic Payment](#basic-payment)
4. [Privacy Levels](#privacy-levels)
5. [React Integration](#react-integration)
6. [Token Payments](#token-payments)
7. [Batch Payments](#batch-payments)
8. [Light Protocol (Beta)](#light-protocol-beta)
9. [Error Handling](#error-handling)
10. [Advanced Features](#advanced-features)
11. [TypeScript Support](#typescript-support)
12. [Examples Repository](#examples-repository)

---

## 🚀 Quick Start (5 Minutes)

Get started with ExePay in under 5 minutes!

### Step 1: Install Packages

```bash
npm install @exe-pay/core @solana/wallet-adapter-react @solana/wallet-adapter-wallets
```

### Step 2: Setup Wallet Provider

```typescript
// App.tsx
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo } from 'react';

// Import styles
import '@solana/wallet-adapter-react-ui/styles.css';

export default function App() {
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <YourApp />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
```

### Step 3: Send Your First Payment

```typescript
// PaymentButton.tsx
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey } from '@solana/web3.js';
import { createPayment } from '@exe-pay/core';

export function PaymentButton() {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();

  const handlePayment = async () => {
    if (!publicKey || !signTransaction) {
      alert('Please connect your wallet');
      return;
    }

    try {
      const result = await createPayment({
        connection,
        sender: publicKey,
        recipient: new PublicKey('RECIPIENT_ADDRESS_HERE'),
        amount: 0.1, // 0.1 SOL
        signTransaction,
      });

      alert(`Payment sent! ${result.signature}`);
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    }
  };

  return (
    <div>
      <WalletMultiButton />
      {publicKey && (
        <button onClick={handlePayment}>
          Send 0.1 SOL
        </button>
      )}
    </div>
  );
}
```

**🎉 That's it! You've integrated ExePay!**

---

## 📦 Installation

### Core Package (Required)

```bash
npm install @exe-pay/core
```

The core package includes:
- Standard SOL payments
- SPL token payments
- Transaction history
- Balance queries

### Privacy Package (Optional)

```bash
npm install @exe-pay/privacy
```

The privacy package includes:
- Shielded transfers (hidden amounts)
- Private transfers (encrypted recipients)
- Light Protocol integration (TRUE privacy)
- ZK-SNARK proof generation

### React Hooks (Optional)

```bash
npm install @exe-pay/react-hooks
```

React hooks for easier integration:
- `useExePay()` - Main payment hook
- `useBalance()` - Balance tracking
- `useTransactionHistory()` - Transaction history

### Solana Wallet Adapter (Required)

```bash
npm install @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets
```

Wallet integration packages:
- Phantom, Solflare, Coinbase, Trust, Backpack, etc.
- Standard wallet UI components
- Connection management

---

## 💰 Basic Payment

### Simple SOL Transfer

```typescript
import { createPayment } from '@exe-pay/core';
import { Connection, PublicKey } from '@solana/web3.js';

const connection = new Connection('https://api.mainnet-beta.solana.com');

async function sendSOL() {
  const result = await createPayment({
    connection,
    sender: senderPublicKey,
    recipient: new PublicKey('7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU'),
    amount: 1.0, // 1 SOL
    signTransaction,
  });

  console.log('Transaction signature:', result.signature);
  console.log('Confirmed:', result.confirmed);
  console.log('View on Solscan:', `https://solscan.io/tx/${result.signature}`);
}
```

### SPL Token Transfer (USDC, USDT, etc.)

```typescript
import { createTokenPayment } from '@exe-pay/core';
import { USDC_MINT, USDT_MINT } from '@exe-pay/utils';

async function sendUSDC() {
  const result = await createTokenPayment({
    connection,
    sender: senderPublicKey,
    recipient: recipientPublicKey,
    amount: 10, // 10 USDC
    tokenMint: USDC_MINT,
    signTransaction,
  });

  console.log('USDC sent!', result.signature);
}
```

### Check Balance

```typescript
import { getBalance } from '@exe-pay/core';

// Get SOL balance
const solBalance = await getBalance(connection, publicKey);
console.log(`Balance: ${solBalance} SOL`);

// Get USDC balance
const usdcBalance = await getBalance(connection, publicKey, USDC_MINT);
console.log(`Balance: ${usdcBalance} USDC`);
```

---

## 🔐 Privacy Levels

ExePay supports 4 privacy levels:

### 1. Public (Default)

**What's Visible:**
- ✅ Sender address
- ✅ Recipient address
- ✅ Amount

**Use Case:** Standard payments, no privacy needed

```typescript
const result = await createPayment({
  connection,
  sender: publicKey,
  recipient: recipientPublicKey,
  amount: 1.0,
  signTransaction,
  privacyLevel: 'public', // Default
});
```

---

### 2. Shielded

**What's Visible:**
- ✅ Sender address
- ✅ Recipient address
- ❌ Amount (hidden with ZK proof)

**Use Case:** Hide transaction amount, keep addresses visible

```typescript
import { createShieldedTransfer } from '@exe-pay/privacy';

const result = await createShieldedTransfer({
  connection,
  sender: publicKey,
  recipient: recipientPublicKey,
  amount: 5.0, // Amount hidden on-chain
  signTransaction,
});

// On Solscan: Amount shows as "[HIDDEN]"
```

---

### 3. Private

**What's Visible:**
- ✅ Sender address
- ❌ Recipient (encrypted)
- ❌ Amount (hidden with ZK proof)

**Use Case:** Maximum privacy while keeping sender visible

```typescript
import { createPrivateTransfer } from '@exe-pay/privacy';

const result = await createPrivateTransfer({
  connection,
  sender: publicKey,
  recipient: recipientPublicKey,
  amount: 10.0, // Amount + recipient hidden
  signTransaction,
});

// On Solscan: Recipient and amount hidden
```

---

### 4. Light Protocol (Beta - TRUE Privacy)

**What's Visible:**
- ❌ Sender (hidden)
- ❌ Recipient (hidden)
- ❌ Amount (hidden)
- ✅ Only shows "Light Protocol interaction"

**Use Case:** Complete on-chain privacy

```typescript
import { createLightShieldedTransfer } from '@exe-pay/privacy';

const result = await createLightShieldedTransfer({
  connection,
  sender: publicKey,
  recipient: recipientPublicKey,
  amount: 2.5, // Completely invisible
  signTransaction,
});

// On Solscan: No sender, recipient, or amount visible
```

**Note:** Light Protocol is currently in Beta. First deposit to shielded pool:

```typescript
import { depositToShieldedPool } from '@exe-pay/privacy';

// Deposit to shielded pool
const depositSig = await depositToShieldedPool(
  connection,
  publicKey,
  5.0, // Deposit 5 SOL
  signTransaction
);

// Now you can make private transfers
```

---

## ⚛️ React Integration

### Using Solana Wallet Adapter

```typescript
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { createPayment } from '@exe-pay/core';
import { PublicKey } from '@solana/web3.js';
import { useState } from 'react';

export function PaymentForm() {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey || !signTransaction) return;

    setLoading(true);
    try {
      const result = await createPayment({
        connection,
        sender: publicKey,
        recipient: new PublicKey(recipient),
        amount: parseFloat(amount),
        signTransaction,
      });

      alert(`Payment sent! ${result.signature}`);
      setRecipient('');
      setAmount('');
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <WalletMultiButton />
      
      {publicKey && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Recipient address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            required
          />
          
          <input
            type="number"
            placeholder="Amount (SOL)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"
            min="0"
            required
          />
          
          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Payment'}
          </button>
        </form>
      )}
    </div>
  );
}
```

### Using ExePay React Hooks

```typescript
import { useExePay } from '@exe-pay/react-hooks';

export function QuickPay() {
  const { sendPayment, connected, publicKey } = useExePay();

  const handlePay = async () => {
    try {
      const result = await sendPayment({
        recipient: 'RECIPIENT_ADDRESS',
        amount: 0.5,
        privacyLevel: 'private',
      });

      console.log('Payment sent!', result);
    } catch (error) {
      console.error('Failed:', error);
    }
  };

  if (!connected) {
    return <button>Connect Wallet</button>;
  }

  return <button onClick={handlePay}>Pay 0.5 SOL</button>;
}
```

### Balance Hook

```typescript
import { useBalance } from '@exe-pay/react-hooks';

export function BalanceDisplay() {
  const { balance, loading, refresh } = useBalance();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <p>Balance: {balance?.toFixed(4)} SOL</p>
      <button onClick={refresh}>Refresh</button>
    </div>
  );
}
```

### Transaction History Hook

```typescript
import { useTransactionHistory } from '@exe-pay/react-hooks';

export function TransactionList() {
  const { history, loading, refresh } = useTransactionHistory(10);

  if (loading) return <div>Loading transactions...</div>;

  return (
    <div>
      <button onClick={refresh}>Refresh</button>
      {history.map((tx) => (
        <div key={tx.signature}>
          <span>{tx.type === 'sent' ? '📤' : '📥'}</span>
          <span>{tx.amount} SOL</span>
          <a href={`https://solscan.io/tx/${tx.signature}`}>
            View on Solscan
          </a>
        </div>
      ))}
    </div>
  );
}
```

---

## 🪙 Token Payments

### Supported Tokens

```typescript
import {
  SOL_MINT,
  USDC_MINT,
  USDT_MINT,
  RAY_MINT,
  SRM_MINT,
} from '@exe-pay/utils';
```

### Send Any SPL Token

```typescript
import { createTokenPayment } from '@exe-pay/core';
import { PublicKey } from '@solana/web3.js';

async function sendCustomToken() {
  const TOKEN_MINT = new PublicKey('YOUR_TOKEN_MINT_ADDRESS');

  const result = await createTokenPayment({
    connection,
    sender: publicKey,
    recipient: recipientPublicKey,
    amount: 100, // Amount in token units
    tokenMint: TOKEN_MINT,
    decimals: 6, // Optional, auto-detected if omitted
    signTransaction,
  });

  console.log('Token sent!', result.signature);
}
```

### Token Selector Component

```typescript
interface Token {
  name: string;
  symbol: string;
  mint: PublicKey;
  decimals: number;
  logo: string;
}

const SUPPORTED_TOKENS: Token[] = [
  {
    name: 'Solana',
    symbol: 'SOL',
    mint: SOL_MINT,
    decimals: 9,
    logo: '/logos/solana.svg',
  },
  {
    name: 'USD Coin',
    symbol: 'USDC',
    mint: USDC_MINT,
    decimals: 6,
    logo: '/logos/usdc.svg',
  },
  // ... more tokens
];

export function TokenSelector({ onSelect }: { onSelect: (token: Token) => void }) {
  return (
    <div>
      {SUPPORTED_TOKENS.map((token) => (
        <button key={token.symbol} onClick={() => onSelect(token)}>
          <img src={token.logo} alt={token.name} />
          <span>{token.symbol}</span>
        </button>
      ))}
    </div>
  );
}
```

---

## 📦 Batch Payments

Send payments to multiple recipients in a single transaction.

### Basic Batch Payment

```typescript
import { createBatchPayment } from '@exe-pay/core';

async function sendBatch() {
  const recipients = [
    { address: 'ADDRESS_1', amount: 0.5 },
    { address: 'ADDRESS_2', amount: 1.0 },
    { address: 'ADDRESS_3', amount: 0.25 },
  ];

  const result = await createBatchPayment({
    connection,
    sender: publicKey,
    recipients: recipients.map(r => ({
      recipient: new PublicKey(r.address),
      amount: r.amount,
    })),
    signTransaction,
  });

  console.log('Batch payment sent!', result.signature);
  console.log('Total sent:', result.totalAmount);
}
```

### Batch Payment with CSV Import

```typescript
import { parseCSV } from '@exe-pay/utils';

async function sendFromCSV(csvFile: File) {
  const csvText = await csvFile.text();
  const recipients = parseCSV(csvText); // { address, amount }[]

  const result = await createBatchPayment({
    connection,
    sender: publicKey,
    recipients: recipients.map(r => ({
      recipient: new PublicKey(r.address),
      amount: parseFloat(r.amount),
    })),
    signTransaction,
  });

  console.log(`Sent to ${recipients.length} recipients`);
}
```

---

## 🌟 Light Protocol (Beta)

### Setup: Deposit to Shielded Pool

```typescript
import { depositToShieldedPool, getShieldedBalance } from '@exe-pay/privacy';

async function setupPrivacy() {
  // 1. Deposit to shielded pool
  const depositSig = await depositToShieldedPool(
    connection,
    publicKey,
    5.0, // Deposit 5 SOL
    signTransaction
  );

  console.log('Deposited to shielded pool:', depositSig);

  // 2. Check shielded balance
  const shieldedBalance = await getShieldedBalance(connection, publicKey);
  console.log('Shielded balance:', shieldedBalance, 'SOL');
}
```

### Send Private Payment

```typescript
import { createLightShieldedTransfer } from '@exe-pay/privacy';

async function sendPrivatePayment() {
  const result = await createLightShieldedTransfer({
    connection,
    sender: publicKey,
    recipient: recipientPublicKey,
    amount: 1.0, // Completely invisible
    signTransaction,
  });

  console.log('Private payment sent!', result.signature);
  console.log('View on Solscan:', `https://solscan.io/tx/${result.signature}`);
  // On Solscan: No sender, recipient, or amount visible!
}
```

### Withdraw from Shielded Pool

```typescript
import { withdrawFromShieldedPool } from '@exe-pay/privacy';

async function withdraw() {
  const withdrawSig = await withdrawFromShieldedPool(
    connection,
    publicKey,
    2.0, // Withdraw 2 SOL
    signTransaction
  );

  console.log('Withdrawn from shielded pool:', withdrawSig);
}
```

---

## ❌ Error Handling

### Common Errors

```typescript
import { createPayment, ExePayError } from '@exe-pay/core';

async function sendWithErrorHandling() {
  try {
    const result = await createPayment({
      connection,
      sender: publicKey,
      recipient: recipientPublicKey,
      amount: 1.0,
      signTransaction,
    });

    console.log('Success!', result.signature);
  } catch (error) {
    if (error instanceof ExePayError) {
      switch (error.code) {
        case 'INSUFFICIENT_BALANCE':
          console.error('Not enough funds in wallet');
          break;
        case 'INVALID_ADDRESS':
          console.error('Invalid recipient address');
          break;
        case 'USER_REJECTED':
          console.error('User cancelled transaction');
          break;
        case 'NETWORK_ERROR':
          console.error('RPC connection failed');
          break;
        case 'TRANSACTION_FAILED':
          console.error('Transaction execution failed');
          break;
        case 'WALLET_NOT_CONNECTED':
          console.error('Please connect your wallet');
          break;
        default:
          console.error('Unknown error:', error.message);
      }
    } else {
      console.error('Unexpected error:', error);
    }
  }
}
```

### React Error Boundary

```typescript
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class PaymentErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Payment error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Payment failed</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## 🚀 Advanced Features

### Custom RPC Endpoint

```typescript
import { Connection } from '@solana/web3.js';

// Use custom Helius RPC
const connection = new Connection(
  'https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY',
  {
    commitment: 'confirmed',
    confirmTransactionInitialTimeout: 60000,
  }
);
```

### Transaction Priority Fees

```typescript
import { createPayment } from '@exe-pay/core';

const result = await createPayment({
  connection,
  sender: publicKey,
  recipient: recipientPublicKey,
  amount: 1.0,
  signTransaction,
  priorityFee: 0.001, // Add priority fee for faster confirmation
});
```

### Transaction Confirmation

```typescript
import { confirmTransaction } from '@exe-pay/core';

const result = await createPayment({ /* ... */ });

// Wait for confirmation
const confirmed = await confirmTransaction(
  connection,
  result.signature,
  'confirmed' // or 'finalized'
);

console.log('Transaction confirmed:', confirmed);
```

### QR Code Generation

```typescript
import { generatePaymentQR } from '@exe-pay/utils';
import QRCode from 'qrcode';

async function generateQR() {
  const paymentData = {
    recipient: 'RECIPIENT_ADDRESS',
    amount: 1.0,
    token: 'SOL',
    memo: 'Payment for services',
  };

  const qrDataURL = await QRCode.toDataURL(JSON.stringify(paymentData));
  
  return <img src={qrDataURL} alt="Payment QR Code" />;
}
```

---

## 📘 TypeScript Support

Full TypeScript support with type definitions included.

### Type Imports

```typescript
import type {
  PaymentOptions,
  PaymentResult,
  PrivacyLevel,
  TokenPaymentOptions,
  TransactionHistory,
  ExePayError,
} from '@exe-pay/core';

import type {
  ElGamalKeypair,
  ElGamalCiphertext,
  RangeProofInputs,
  BalanceProofInputs,
} from '@exe-pay/privacy';
```

### Type-Safe Payment Function

```typescript
import { PublicKey, Connection } from '@solana/web3.js';
import { createPayment, PaymentOptions, PaymentResult } from '@exe-pay/core';

async function typeSafePayment(
  connection: Connection,
  sender: PublicKey,
  recipient: PublicKey,
  amount: number
): Promise<PaymentResult> {
  const options: PaymentOptions = {
    connection,
    sender,
    recipient,
    amount,
    signTransaction,
    privacyLevel: 'public',
  };

  return await createPayment(options);
}
```

---

## 📂 Examples Repository

Check out our examples repository for more code samples:

**GitHub:** [ExePayInfra/exe-pay-examples](https://github.com/ExePayInfra/exe-pay-examples)

### Example Projects

1. **Next.js Payment App** - Full-featured payment application
2. **React Payment Form** - Simple payment form component
3. **Batch Payment Tool** - CSV batch payment processor
4. **Privacy Payment Demo** - All privacy levels demonstrated
5. **Token Swap Integration** - Combine with Jupiter for swaps

---

## 🔗 Additional Resources

- **[API Reference](./API_REFERENCE.md)** - Complete API documentation
- **[Privacy Guide](./PRIVACY_GUIDE.md)** - Privacy features explained
- **[Deployment Guide](./guides/DEPLOY_TO_VERCEL.md)** - Deploy your app
- **[GitHub Repository](https://github.com/ExePayInfra/exe-pay)** - Source code

---

## 💬 Need Help?

- **GitHub Issues:** [Report a bug](https://github.com/ExePayInfra/exe-pay/issues)
- **Email:** exechainlink@outlook.com
- **Twitter:** [@ExePay](https://twitter.com/ExePay) (coming soon)

---

**Happy building with ExePay!** 🚀

