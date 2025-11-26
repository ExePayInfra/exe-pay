# ExePay Quick Start Guide

Get started with ExePay in 5 minutes! This guide will help you integrate privacy-first payments into your application.

---

## 🚀 Installation

### Using npm
```bash
npm install @exe-pay/core @exe-pay/privacy @solana/wallet-adapter-react
```

### Using pnpm
```bash
pnpm add @exe-pay/core @exe-pay/privacy @solana/wallet-adapter-react
```

### Using yarn
```bash
yarn add @exe-pay/core @exe-pay/privacy @solana/wallet-adapter-react
```

---

## 📦 Basic Setup

### 1. Import ExePay SDK

```typescript
import { createPayment, PaymentOptions } from '@exe-pay/core';
import { useWallet } from '@solana/wallet-adapter-react';
```

### 2. Connect Wallet

```typescript
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

function MyApp() {
  return (
    <div>
      <h1>My Payment App</h1>
      <WalletMultiButton />
    </div>
  );
}
```

### 3. Send Your First Payment

```typescript
import { createPayment } from '@exe-pay/core';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

function SendPayment() {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();

  const handlePayment = async () => {
    if (!publicKey || !signTransaction) {
      alert('Please connect your wallet!');
      return;
    }

    try {
      const result = await createPayment({
        connection,
        sender: publicKey,
        recipient: 'RECIPIENT_ADDRESS_HERE',
        amount: 0.1, // 0.1 SOL
        signTransaction,
      });

      console.log('Payment successful!', result.signature);
      alert(`Payment sent! Signature: ${result.signature}`);
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    }
  };

  return (
    <button onClick={handlePayment}>
      Send 0.1 SOL
    </button>
  );
}
```

---

## 🔐 Enable Privacy Features

### Public Payment (Standard)

```typescript
const result = await createPayment({
  connection,
  sender: publicKey,
  recipient: 'RECIPIENT_ADDRESS',
  amount: 0.1,
  signTransaction,
  privacyLevel: 'public', // Default
});
```

**Privacy Level:** None  
**Visible on Solscan:** ✅ Sender, Receiver, Amount  
**Speed:** Fastest (~0.5s)  
**Cost:** Lowest (~0.000005 SOL)

---

### Shielded Payment (ZK Proofs)

```typescript
import { createShieldedTransfer } from '@exe-pay/privacy';

const result = await createShieldedTransfer({
  connection,
  sender: publicKey,
  recipient: 'RECIPIENT_ADDRESS',
  amount: 0.1,
  signTransaction,
});
```

**Privacy Level:** Medium  
**Visible on Solscan:** ✅ Sender, Receiver, ❌ Amount (hidden via ZK proof)  
**Speed:** Fast (~1-2s)  
**Cost:** Low (~0.00001 SOL)

---

### Private Payment (Full Privacy)

```typescript
import { createPrivateTransfer } from '@exe-pay/privacy';

const result = await createPrivateTransfer({
  connection,
  sender: publicKey,
  recipient: 'RECIPIENT_ADDRESS',
  amount: 0.1,
  signTransaction,
});
```

**Privacy Level:** High  
**Visible on Solscan:** ✅ Sender, ❌ Receiver (encrypted), ❌ Amount (hidden via ZK proof)  
**Speed:** Fast (~1-2s)  
**Cost:** Low (~0.00001 SOL)

---

### Light Protocol Payment (TRUE Privacy) 🔥

```typescript
import { createLightShieldedTransfer } from '@exe-pay/privacy';

const result = await createLightShieldedTransfer({
  connection,
  sender: publicKey,
  recipient: 'RECIPIENT_ADDRESS',
  amount: 0.1,
  signTransaction,
});
```

**Privacy Level:** MAXIMUM  
**Visible on Solscan:** ❌ Sender (hidden), ❌ Receiver (hidden), ❌ Amount (hidden)  
**Shows:** Only "Light Protocol interaction"  
**Speed:** Fast (~2-3s)  
**Cost:** Low (~0.00002 SOL)  
**Status:** 🔬 Beta (Light Protocol mainnet coming soon)

---

## 🎨 Complete React Example

```typescript
import { FC, useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { createPayment } from '@exe-pay/core';
import { PublicKey } from '@solana/web3.js';

export const PaymentForm: FC = () => {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!publicKey || !signTransaction) {
      alert('Please connect your wallet!');
      return;
    }

    setLoading(true);

    try {
      const result = await createPayment({
        connection,
        sender: publicKey,
        recipient: new PublicKey(recipient),
        amount: parseFloat(amount),
        signTransaction,
      });

      alert(`✅ Payment successful! Signature: ${result.signature}`);
      setRecipient('');
      setAmount('');
    } catch (error) {
      console.error('Payment error:', error);
      alert('❌ Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-form">
      <h2>Send Payment</h2>
      
      {!publicKey ? (
        <div>
          <p>Connect your wallet to send payments</p>
          <WalletMultiButton />
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Recipient Address:</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Solana address..."
              required
            />
          </div>

          <div>
            <label>Amount (SOL):</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.1"
              step="0.01"
              min="0.000001"
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Payment'}
          </button>
        </form>
      )}
    </div>
  );
};
```

---

## 🔑 Environment Setup

Create a `.env.local` file in your project root:

```bash
# Solana Network (mainnet-beta or devnet)
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta

# Solana RPC URL
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Optional: Custom RPC (Helius, QuickNode, etc.)
# NEXT_PUBLIC_SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_KEY

# Light Protocol RPC (for true privacy)
NEXT_PUBLIC_LIGHT_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_KEY
```

---

## 🌐 Provider Setup (Next.js)

Wrap your app with wallet providers:

```typescript
// app/layout.tsx or pages/_app.tsx
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { useMemo } from 'react';
import '@solana/wallet-adapter-react-ui/styles.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => 
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
    []
  );

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  return (
    <html lang="en">
      <body>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect={false}>
            <WalletModalProvider>
              {children}
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </body>
    </html>
  );
}
```

---

## 📱 Mobile Support

ExePay works seamlessly on mobile browsers with Phantom, Solflare, and other mobile wallets:

```typescript
// Automatically handles deep linking for mobile wallets
const result = await createPayment({
  connection,
  sender: publicKey,
  recipient: 'RECIPIENT_ADDRESS',
  amount: 0.1,
  signTransaction,
});
```

**Mobile wallets supported:**
- Phantom Mobile
- Solflare Mobile
- Trust Wallet
- Coinbase Wallet
- Backpack Mobile

---

## 🎯 Next Steps

Congratulations! You've integrated ExePay! 🎉

**Explore more:**
- [API Reference](./API_REFERENCE.md) - Complete SDK documentation
- [Privacy Guide](./PRIVACY_GUIDE.md) - Understanding privacy levels
- [Integration Examples](./examples/) - More code examples
- [Payment Links](./guides/payment-links.md) - Generate shareable payment links

**Need help?**
- [GitHub Issues](https://github.com/ExePayInfra/exe-pay/issues)
- [Discord Community](https://discord.gg/exepay)
- [Documentation](https://exepay.app)

---

## 💡 Common Use Cases

### E-commerce Payment
```typescript
const checkout = async (cartTotal: number) => {
  const result = await createPayment({
    connection,
    sender: publicKey,
    recipient: MERCHANT_ADDRESS,
    amount: cartTotal,
    signTransaction,
  });
  
  // Record order in database
  await recordOrder({ signature: result.signature, total: cartTotal });
};
```

### Subscription Payment
```typescript
const paySubscription = async () => {
  const result = await createPayment({
    connection,
    sender: publicKey,
    recipient: SUBSCRIPTION_ADDRESS,
    amount: 9.99, // Monthly subscription
    signTransaction,
    privacyLevel: 'private', // Hide subscription details
  });
  
  // Activate subscription
  await activateSubscription({ userId, signature: result.signature });
};
```

### Donation
```typescript
const donate = async (amount: number) => {
  const result = await createPayment({
    connection,
    sender: publicKey,
    recipient: CHARITY_ADDRESS,
    amount,
    signTransaction,
    privacyLevel: 'shielded', // Hide donation amount
  });
  
  alert(`Thank you for your donation! 🙏`);
};
```

---

## 🔧 Troubleshooting

### "Wallet not connected"
```typescript
if (!publicKey) {
  console.error('Wallet not connected');
  return;
}
```

### "Insufficient balance"
```typescript
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

const balance = await connection.getBalance(publicKey);
const balanceInSOL = balance / LAMPORTS_PER_SOL;

if (balanceInSOL < amount) {
  alert(`Insufficient balance. You have ${balanceInSOL} SOL`);
  return;
}
```

### "Transaction failed"
```typescript
try {
  const result = await createPayment({ ... });
} catch (error) {
  if (error.message.includes('User rejected')) {
    alert('Transaction cancelled by user');
  } else if (error.message.includes('insufficient funds')) {
    alert('Insufficient balance');
  } else {
    alert('Transaction failed. Please try again.');
  }
}
```

---

**Ready to build? Let's go! 🚀**

For complete documentation, visit [https://exepay.app](https://exepay.app)

