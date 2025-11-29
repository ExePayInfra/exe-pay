# ExePay Builder Integration Guide

**Version:** 1.0.0  
**Last Updated:** November 28, 2025  
**Target Audience:** Developers integrating ExePay into their applications

---

## 🎯 Overview

This guide will help you integrate ExePay's privacy-first payment infrastructure into your Solana application. Whether you're building a DeFi protocol, marketplace, or any dApp that needs payments, ExePay provides production-ready solutions.

---

## 📦 What You Get

### **Production-Ready on Mainnet**
- ✅ **Stealth Addresses** - Monero-inspired one-time addresses
- ✅ **Batch Payments** - Multi-recipient transfers
- ✅ **Recurring Payments** - Automated subscriptions
- ✅ **Payment Links** - Shareable payment requests with QR codes
- ✅ **Multi-Token Support** - SOL, USDC, USDT, BONK, JUP, RAY, ORCA
- ✅ **Multi-Wallet** - Phantom, Solflare, Coinbase, Trust, Torus, Ledger

### **Beta on Devnet**
- 🔬 **Light Protocol** - ZK compression for complete on-chain privacy

---

## 🚀 Quick Start (5 Minutes)

### 1. Install Packages

```bash
npm install @exe-pay/core @exe-pay/privacy @exe-pay/react-hooks @solana/web3.js @solana/wallet-adapter-react
```

### 2. Basic Payment Integration

```typescript
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';

export function SendPayment() {
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
}
```

---

## 🔐 Stealth Addresses Integration (Mainnet Ready)

### What Are Stealth Addresses?

Stealth addresses provide **recipient privacy** by generating unique one-time addresses for each payment. Inspired by Monero, this prevents anyone from linking payments to your main wallet address.

### How It Works

1. **Recipient** generates a stealth meta-address (one-time setup)
2. **Sender** uses the stealth meta-address to create a unique Solana address
3. **Payment** is sent to the one-time address
4. **Recipient** scans the blockchain to detect payments
5. **Recipient** claims the funds to their main wallet

### Step 1: Generate Stealth Meta-Address (Recipient)

```typescript
import { generateStealthMetaAddress } from '@exe-pay/privacy';
import { useWallet } from '@solana/wallet-adapter-react';

export function GenerateStealthAddress() {
  const { publicKey, signMessage } = useWallet();
  const [stealthAddress, setStealthAddress] = useState<string>('');

  const generate = async () => {
    if (!publicKey || !signMessage) return;

    // Derive viewing key via message signing (no secret key exposure)
    const stealthMeta = await generateStealthMetaAddress({
      publicKey,
      signMessage,
    });

    setStealthAddress(stealthMeta.toString());
    // Format: stealth:PEEDycQmBuF1WTwENQGEaKmvbAdpnLT9iTQFS3TxhvY:...
  };

  return (
    <div>
      <button onClick={generate}>Generate Stealth Address</button>
      {stealthAddress && (
        <div>
          <p>Your Stealth Meta-Address:</p>
          <code>{stealthAddress}</code>
          <p>Share this publicly - it's safe!</p>
        </div>
      )}
    </div>
  );
}
```

### Step 2: Send to Stealth Address (Sender)

```typescript
import { generateStealthAddress, StealthMetaAddress } from '@exe-pay/privacy';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';

export function SendStealthPayment() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const sendPrivate = async (
    recipientStealthMeta: string,
    amount: number
  ) => {
    if (!publicKey) throw new Error('Wallet not connected');

    // Parse stealth meta-address
    const stealthMeta = StealthMetaAddress.fromString(recipientStealthMeta);

    // Generate one-time address
    const { stealthAddress, ephemeralPublicKey } = 
      await generateStealthAddress(stealthMeta);

    // Create transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: stealthAddress,
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );

    // Add ephemeral public key as memo (for recipient to detect)
    transaction.add(
      new TransactionInstruction({
        keys: [],
        programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
        data: Buffer.from(`stealth:${ephemeralPublicKey.toBase58()}`),
      })
    );

    const signature = await sendTransaction(transaction, connection);
    await connection.confirmTransaction(signature, 'confirmed');

    return { signature, stealthAddress: stealthAddress.toBase58() };
  };

  return (
    <button onClick={() => sendPrivate('stealth:PEED...', 0.1)}>
      Send Private Payment
    </button>
  );
}
```

### Step 3: Scan for Payments (Recipient)

```typescript
import { scanForStealthPayments } from '@exe-pay/privacy';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

export function ScanPayments() {
  const { publicKey, signMessage } = useWallet();
  const { connection } = useConnection();
  const [payments, setPayments] = useState([]);

  const scan = async () => {
    if (!publicKey || !signMessage) return;

    // Scan blockchain for stealth payments
    const detected = await scanForStealthPayments(
      connection,
      { publicKey, signMessage },
      stealthMetaAddress // Your stealth meta-address
    );

    setPayments(detected);
  };

  return (
    <div>
      <button onClick={scan}>Scan for Payments</button>
      {payments.map((payment) => (
        <div key={payment.signature}>
          <p>Amount: {payment.amount / LAMPORTS_PER_SOL} SOL</p>
          <p>From: {payment.stealthAddress}</p>
          <button onClick={() => claimPayment(payment)}>Claim</button>
        </div>
      ))}
    </div>
  );
}
```

### Step 4: Claim Payments (Recipient)

```typescript
import { claimPayment } from '@exe-pay/privacy';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

export function ClaimPayment({ payment }) {
  const { publicKey, signMessage, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const claim = async () => {
    if (!publicKey || !signMessage) return;

    // Claim funds from stealth address to your main wallet
    const signature = await claimPayment(
      connection,
      payment,
      { publicKey, signMessage, sendTransaction }
    );

    console.log('Claimed!', signature);
  };

  return (
    <button onClick={claim}>
      Claim {payment.amount / LAMPORTS_PER_SOL} SOL
    </button>
  );
}
```

### Stealth Address Features

#### **Cryptographic Primitives**
- **X25519 ECDH**: Secure elliptic curve key exchange
- **Keccak-256**: Cryptographic hashing for key derivation
- **View Tags**: 1-byte optimization for 99%+ faster scanning
- **Message Signing**: No wallet secret key exposure

#### **Privacy Benefits**
- ✅ Each payment uses a unique address
- ✅ No on-chain link between payments
- ✅ Only sender and recipient can identify payments
- ✅ Prevents transaction graph analysis

#### **Performance**
- ⚡ Instant generation (< 10ms)
- ⚡ Efficient scanning with view tags
- 💰 Low cost (~$0.0002 per transaction)

---

## 📦 Batch Payments Integration

Send payments to multiple recipients efficiently.

### For SOL (Single Transaction)

```typescript
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { SystemProgram, Transaction, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

export function BatchPayment() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const sendBatch = async (
    recipients: Array<{ address: string; amount: number }>
  ) => {
    if (!publicKey) throw new Error('Wallet not connected');

    const transaction = new Transaction();

    // Add all transfers to a single transaction
    recipients.forEach(({ address, amount }) => {
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(address),
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );
    });

    const signature = await sendTransaction(transaction, connection);
    await connection.confirmTransaction(signature, 'confirmed');

    return signature;
  };

  const recipients = [
    { address: 'RECIPIENT_1', amount: 0.1 },
    { address: 'RECIPIENT_2', amount: 0.2 },
    { address: 'RECIPIENT_3', amount: 0.15 },
  ];

  return (
    <button onClick={() => sendBatch(recipients)}>
      Send Batch Payment
    </button>
  );
}
```

### For SPL Tokens (Sequential)

```typescript
import { getAssociatedTokenAddress, createTransferInstruction } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';

export async function batchTokenPayment(
  connection: Connection,
  publicKey: PublicKey,
  sendTransaction: Function,
  tokenMint: PublicKey,
  recipients: Array<{ address: string; amount: number }>
) {
  const signatures = [];

  for (const { address, amount } of recipients) {
    const recipientPubkey = new PublicKey(address);

    // Get token accounts
    const fromTokenAccount = await getAssociatedTokenAddress(tokenMint, publicKey);
    const toTokenAccount = await getAssociatedTokenAddress(tokenMint, recipientPubkey);

    const transaction = new Transaction().add(
      createTransferInstruction(
        fromTokenAccount,
        toTokenAccount,
        publicKey,
        amount
      )
    );

    const signature = await sendTransaction(transaction, connection);
    await connection.confirmTransaction(signature, 'confirmed');
    
    signatures.push(signature);
  }

  return signatures;
}
```

---

## 🔄 Recurring Payments Integration

Automate subscriptions and recurring transfers.

```typescript
import { useState, useEffect } from 'react';

export function RecurringPayment() {
  const [schedule, setSchedule] = useState({
    recipient: '',
    amount: 0,
    interval: 'monthly', // 'daily', 'weekly', 'monthly'
    maxPayments: 12,
    startTime: Date.now(),
  });

  const [paymentsExecuted, setPaymentsExecuted] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const intervalMs = {
      daily: 24 * 60 * 60 * 1000,
      weekly: 7 * 24 * 60 * 60 * 1000,
      monthly: 30 * 24 * 60 * 60 * 1000,
    }[schedule.interval];

    const timer = setInterval(async () => {
      if (paymentsExecuted >= schedule.maxPayments) {
        setIsActive(false);
        return;
      }

      // Execute payment
      await sendSOL(schedule.recipient, schedule.amount);
      setPaymentsExecuted((prev) => prev + 1);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isActive, paymentsExecuted, schedule]);

  return (
    <div>
      <button onClick={() => setIsActive(true)}>Start Subscription</button>
      <button onClick={() => setIsActive(false)}>Pause</button>
      <p>Payments: {paymentsExecuted}/{schedule.maxPayments}</p>
    </div>
  );
}
```

---

## 🔗 Payment Links Integration

Create shareable payment requests.

```typescript
export function CreatePaymentLink() {
  const createLink = (
    recipient: string,
    amount: number,
    token: string = 'SOL',
    memo?: string
  ) => {
    const params = new URLSearchParams({
      recipient,
      amount: amount.toString(),
      token,
      ...(memo && { memo }),
    });

    return `https://exepay.app/pay?${params.toString()}`;
  };

  const link = createLink('RECIPIENT_ADDRESS', 0.5, 'SOL', 'Invoice #1234');

  return (
    <div>
      <p>Payment Link:</p>
      <a href={link}>{link}</a>
    </div>
  );
}
```

---

## 🔬 Light Protocol Integration (Beta - Devnet Only)

### ⚠️ Current Status

Light Protocol provides complete on-chain privacy (hidden sender, recipient, and amount) but is currently:
- ✅ Fully integrated in ExePay
- 🔬 **Beta on Solana Devnet**
- ⏳ Awaiting Light Protocol mainnet launch

### How It Works

1. **Deposit** funds into Light Protocol's shielded pool
2. **Transfer** privately within the pool (zero-knowledge proofs)
3. **Withdraw** to regular accounts when needed

### Example Integration (Devnet)

```typescript
import { depositToShieldedPool, createLightShieldedTransfer } from '@exe-pay/privacy';

export function LightProtocolPayment() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  // Step 1: Deposit to shielded pool
  const deposit = async (amount: number) => {
    const signature = await depositToShieldedPool(
      connection,
      publicKey,
      amount,
      sendTransaction
    );
    return signature;
  };

  // Step 2: Send private payment
  const sendPrivate = async (recipientAddress: string, amount: number) => {
    const result = await createLightShieldedTransfer({
      connection,
      sender: publicKey,
      recipient: new PublicKey(recipientAddress),
      amount,
      sendTransaction,
    });
    return result.signature;
  };

  return (
    <div>
      <button onClick={() => deposit(1.0)}>Deposit 1 SOL</button>
      <button onClick={() => sendPrivate('RECIPIENT', 0.5)}>
        Send Private Payment
      </button>
    </div>
  );
}
```

### Light Protocol Benefits

- 🔒 **Complete Privacy**: Sender, recipient, and amount all hidden
- 💰 **90% Cost Reduction**: Compressed accounts vs standard accounts
- 🔐 **ZK Proofs**: Cryptographically proven privacy
- 🛡️ **Audited**: Light Protocol infrastructure is professionally audited

### When to Use Light Protocol

✅ **Use Light Protocol when:**
- Maximum on-chain privacy is required
- Sender AND recipient need to be hidden
- Amount needs to be confidential
- Enterprise privacy compliance

❌ **Don't use Light Protocol if:**
- You only need recipient privacy (use Stealth Addresses instead)
- You're on mainnet (not yet available)
- You need instant transactions (takes 2-3 seconds)

---

## 🎯 Choosing the Right Privacy Mode

| Need | Solution | Status |
|------|----------|--------|
| **Recipient Privacy** | Stealth Addresses | ✅ Mainnet |
| **Complete Privacy** | Light Protocol | 🔬 Beta (Devnet) |
| **Batch Payments** | Multi-recipient transfers | ✅ Mainnet |
| **Recurring** | Automated subscriptions | ✅ Mainnet |
| **Lowest Cost** | Public transfers | ✅ Mainnet |

---

## 📚 Complete Example: E-Commerce Integration

```typescript
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { generateStealthAddress, StealthMetaAddress } from '@exe-pay/privacy';

export function CheckoutPage() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [privacyMode, setPrivacyMode] = useState<'public' | 'stealth'>('public');

  const checkout = async (
    merchantAddress: string,
    amount: number,
    orderId: string
  ) => {
    if (!publicKey) throw new Error('Connect wallet first');

    let recipientAddress: PublicKey;
    let memo = `Order #${orderId}`;

    if (privacyMode === 'stealth') {
      // Merchant provides their stealth meta-address
      const stealthMeta = StealthMetaAddress.fromString(merchantAddress);
      const { stealthAddress, ephemeralPublicKey } = 
        await generateStealthAddress(stealthMeta);
      
      recipientAddress = stealthAddress;
      memo = `stealth:${ephemeralPublicKey.toBase58()}|${memo}`;
    } else {
      recipientAddress = new PublicKey(merchantAddress);
    }

    // Create and send transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: recipientAddress,
        lamports: amount * LAMPORTS_PER_SOL,
      }),
      // Add memo
      new TransactionInstruction({
        keys: [],
        programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
        data: Buffer.from(memo),
      })
    );

    const signature = await sendTransaction(transaction, connection);
    await connection.confirmTransaction(signature, 'confirmed');

    return { signature, mode: privacyMode };
  };

  return (
    <div>
      <h2>Checkout</h2>
      <select value={privacyMode} onChange={(e) => setPrivacyMode(e.target.value)}>
        <option value="public">Public Payment</option>
        <option value="stealth">Private Payment (Stealth)</option>
      </select>
      <button onClick={() => checkout('MERCHANT_ADDRESS', 0.5, '12345')}>
        Pay 0.5 SOL
      </button>
    </div>
  );
}
```

---

## 🔧 Best Practices

### Security
1. ✅ **Never expose secret keys** - Use message signing for key derivation
2. ✅ **Validate all addresses** - Use `PublicKey.isOnCurve()`
3. ✅ **Confirm transactions** - Wait for 'confirmed' commitment
4. ✅ **Handle errors gracefully** - Wallet rejections, network issues

### Performance
1. ⚡ **Use view tags** - 99%+ faster scanning for stealth addresses
2. ⚡ **Batch SOL transfers** - Single transaction for multiple recipients
3. ⚡ **Cache meta-addresses** - Generate once, reuse forever
4. ⚡ **Optimize RPC calls** - Use dedicated endpoints for production

### User Experience
1. 🎨 **Clear privacy labels** - Explain what each mode does
2. 🎨 **Show transaction status** - Pending, confirmed, failed
3. 🎨 **Display costs** - Show estimated fees before sending
4. 🎨 **Error messages** - User-friendly explanations

---

## 🐛 Common Issues & Solutions

### Issue: "Wallet not connected"
**Solution:** Ensure WalletProvider is wrapping your component
```typescript
<WalletProvider wallets={wallets}>
  <YourApp />
</WalletProvider>
```

### Issue: "Insufficient funds"
**Solution:** Check balance before sending
```typescript
const balance = await connection.getBalance(publicKey);
if (balance < amount * LAMPORTS_PER_SOL) {
  throw new Error('Insufficient SOL');
}
```

### Issue: "Transaction failed"
**Solution:** Add proper error handling
```typescript
try {
  await sendTransaction(tx, connection);
} catch (error) {
  if (error.message.includes('User rejected')) {
    console.log('User cancelled');
  } else {
    console.error('Transaction failed:', error);
  }
}
```

### Issue: "Stealth payments not detected"
**Solution:** Ensure you're using the SAME stealth meta-address for both sending and scanning
```typescript
// Generate once, save to database
const stealthMeta = await generateStealthMetaAddress(wallet);
localStorage.setItem('stealthMeta', stealthMeta.toString());

// Use the saved address for scanning
const saved = localStorage.getItem('stealthMeta');
const payments = await scanForStealthPayments(connection, wallet, saved);
```

---

## 📞 Support & Resources

### Documentation
- 🌐 **Live App**: [exepay.app](https://exepay.app)
- 📖 **Docs Site**: [docs.exepay.app](https://docs.exepay.app)
- 📚 **GitHub**: [github.com/ExePayInfra/exe-pay](https://github.com/ExePayInfra/exe-pay)

### Guides
- 📝 **Privacy Guide**: [docs/PRIVACY_GUIDE.md](./docs/PRIVACY_GUIDE.md)
- 📝 **SDK Integration**: [docs/SDK_INTEGRATION_GUIDE.md](./docs/SDK_INTEGRATION_GUIDE.md)
- 📝 **Features**: [docs/FEATURES.md](./docs/FEATURES.md)

### Community
- 🐦 **Twitter/X**: [@exeinfra](https://x.com/exeinfra)
- 📧 **Email**: contact@exepay.app
- 💬 **Issues**: [GitHub Issues](https://github.com/ExePayInfra/exe-pay/issues)

---

## 🎯 Next Steps

1. ✅ **Try the Live App** - [exepay.app](https://exepay.app)
2. ✅ **Clone the Repo** - `git clone https://github.com/ExePayInfra/exe-pay.git`
3. ✅ **Run Examples** - `pnpm install && pnpm dev`
4. ✅ **Build Your Integration** - Use this guide as reference
5. ✅ **Deploy to Mainnet** - Stealth addresses are production-ready!

---

**Built for the Solana ecosystem** • **Privacy by design** • **Open source** • **Production ready**

**Last Updated:** November 28, 2025

