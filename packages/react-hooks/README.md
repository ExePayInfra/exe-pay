# @exe-pay/react-hooks

React hooks for building privacy-first payment dApps on Solana. Easy integration with wallet adapters, batch payments, and recurring subscriptions.

[![npm version](https://img.shields.io/npm/v/@exe-pay/react-hooks.svg)](https://www.npmjs.com/package/@exe-pay/react-hooks)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🪝 **React Hooks** - Easy integration with React applications
- 💸 **Payment Hooks** - Send payments with one hook
- 📦 **Batch Payments** - Send to multiple recipients
- 🔄 **Recurring Payments** - Manage subscriptions
- 🔗 **Payment Links** - Create and manage payment requests
- 📊 **Transaction History** - Fetch and display past transactions
- 🔐 **Privacy Support** - Full support for confidential transfers
- ⚡ **TypeScript** - Full type safety

## Installation

```bash
npm install @exe-pay/react-hooks @exe-pay/core @solana/web3.js react
```

## Quick Start

### Basic Payment Hook

```typescript
import { usePayment } from '@exe-pay/react-hooks';
import { useWallet } from '@solana/wallet-adapter-react';

function SendPayment() {
  const { publicKey } = useWallet();
  const { sendPayment, loading, error } = usePayment();

  const handleSend = async () => {
    const signature = await sendPayment({
      recipient: 'RECIPIENT_ADDRESS',
      amount: 1.5, // SOL
    });
    console.log('Transaction:', signature);
  };

  return (
    <button onClick={handleSend} disabled={loading}>
      {loading ? 'Sending...' : 'Send Payment'}
    </button>
  );
}
```

### Batch Payment Hook

```typescript
import { useBatchPayment } from '@exe-pay/react-hooks';

function BatchPayment() {
  const { sendBatch, loading, error } = useBatchPayment();

  const recipients = [
    { address: 'ADDR1', amount: 0.5 },
    { address: 'ADDR2', amount: 1.0 },
    { address: 'ADDR3', amount: 0.3 },
  ];

  const handleSend = async () => {
    const signature = await sendBatch(recipients);
    console.log('Batch sent:', signature);
  };

  return (
    <button onClick={handleSend} disabled={loading}>
      {loading ? 'Sending...' : 'Send Batch'}
    </button>
  );
}
```

### Recurring Payment Hook

```typescript
import { useRecurringPayment } from '@exe-pay/react-hooks';

function Subscription() {
  const {
    subscriptions,
    createSubscription,
    executePayment,
    pauseSubscription,
    loading,
  } = useRecurringPayment();

  const handleCreate = async () => {
    await createSubscription({
      recipient: 'RECIPIENT_ADDRESS',
      amount: 100,
      frequency: 'monthly',
      startDate: new Date(),
    });
  };

  return (
    <div>
      <button onClick={handleCreate} disabled={loading}>
        Create Subscription
      </button>
      {subscriptions.map((sub) => (
        <div key={sub.id}>
          <p>{sub.recipient}</p>
          <button onClick={() => executePayment(sub.id)}>
            Pay Now
          </button>
          <button onClick={() => pauseSubscription(sub.id)}>
            Pause
          </button>
        </div>
      ))}
    </div>
  );
}
```

## API Reference

### `usePayment()`

Hook for sending payments.

**Returns:**
```typescript
{
  sendPayment: (params: PaymentParams) => Promise<string>;
  loading: boolean;
  error: Error | null;
}
```

**Example:**
```typescript
const { sendPayment, loading, error } = usePayment();

await sendPayment({
  recipient: 'ADDRESS',
  amount: 1.5,
  token: 'SOL', // optional
  memo: 'Payment', // optional
});
```

---

### `useBatchPayment()`

Hook for sending batch payments.

**Returns:**
```typescript
{
  sendBatch: (recipients: Recipient[]) => Promise<string>;
  loading: boolean;
  error: Error | null;
}
```

**Example:**
```typescript
const { sendBatch, loading, error } = useBatchPayment();

await sendBatch([
  { address: 'ADDR1', amount: 0.5 },
  { address: 'ADDR2', amount: 1.0 },
]);
```

---

### `useRecurringPayment()`

Hook for managing recurring payments.

**Returns:**
```typescript
{
  subscriptions: Subscription[];
  createSubscription: (params: SubscriptionParams) => Promise<void>;
  executePayment: (id: string) => Promise<string>;
  pauseSubscription: (id: string) => void;
  resumeSubscription: (id: string) => void;
  cancelSubscription: (id: string) => void;
  loading: boolean;
  error: Error | null;
}
```

**Example:**
```typescript
const {
  subscriptions,
  createSubscription,
  executePayment,
} = useRecurringPayment();

await createSubscription({
  recipient: 'ADDRESS',
  amount: 100,
  frequency: 'monthly',
  startDate: new Date(),
});
```

---

### `usePaymentLink()`

Hook for creating and managing payment links.

**Returns:**
```typescript
{
  createLink: (params: LinkParams) => string;
  parseLink: (url: string) => LinkData;
  loading: boolean;
  error: Error | null;
}
```

**Example:**
```typescript
const { createLink, parseLink } = usePaymentLink();

const link = createLink({
  amount: 10,
  token: 'USDC',
  description: 'Payment for services',
});

const data = parseLink(link);
```

---

### `useTransactionHistory()`

Hook for fetching transaction history.

**Returns:**
```typescript
{
  transactions: Transaction[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}
```

**Example:**
```typescript
const { transactions, loading, refresh } = useTransactionHistory();

useEffect(() => {
  refresh();
}, []);
```

---

### `useBalance()`

Hook for fetching wallet balance.

**Returns:**
```typescript
{
  balance: number;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}
```

**Example:**
```typescript
const { balance, loading, refresh } = useBalance();

return <div>Balance: {balance} SOL</div>;
```

---

## Complete Example

```typescript
import { useState } from 'react';
import { usePayment, useBatchPayment, useRecurringPayment } from '@exe-pay/react-hooks';
import { useWallet } from '@solana/wallet-adapter-react';

function PaymentApp() {
  const { publicKey, connected } = useWallet();
  const { sendPayment, loading: paymentLoading } = usePayment();
  const { sendBatch, loading: batchLoading } = useBatchPayment();
  const {
    subscriptions,
    createSubscription,
    executePayment,
    loading: subLoading,
  } = useRecurringPayment();

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const handleSinglePayment = async () => {
    try {
      const signature = await sendPayment({
        recipient,
        amount: parseFloat(amount),
      });
      alert(`Payment sent! ${signature}`);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleBatchPayment = async () => {
    try {
      const recipients = [
        { address: 'ADDR1', amount: 0.5 },
        { address: 'ADDR2', amount: 1.0 },
      ];
      const signature = await sendBatch(recipients);
      alert(`Batch sent! ${signature}`);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleCreateSubscription = async () => {
    try {
      await createSubscription({
        recipient,
        amount: parseFloat(amount),
        frequency: 'monthly',
        startDate: new Date(),
      });
      alert('Subscription created!');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  if (!connected) {
    return <div>Please connect your wallet</div>;
  }

  return (
    <div>
      <h1>ExePay Demo</h1>
      
      {/* Single Payment */}
      <div>
        <h2>Send Payment</h2>
        <input
          placeholder="Recipient"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <input
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={handleSinglePayment} disabled={paymentLoading}>
          {paymentLoading ? 'Sending...' : 'Send'}
        </button>
      </div>

      {/* Batch Payment */}
      <div>
        <h2>Batch Payment</h2>
        <button onClick={handleBatchPayment} disabled={batchLoading}>
          {batchLoading ? 'Sending...' : 'Send Batch'}
        </button>
      </div>

      {/* Recurring Payment */}
      <div>
        <h2>Subscriptions</h2>
        <button onClick={handleCreateSubscription} disabled={subLoading}>
          {subLoading ? 'Creating...' : 'Create Subscription'}
        </button>
        {subscriptions.map((sub) => (
          <div key={sub.id}>
            <p>{sub.recipient} - {sub.amount} SOL</p>
            <button onClick={() => executePayment(sub.id)}>
              Pay Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PaymentApp;
```

## TypeScript Support

Full TypeScript support with type definitions.

```typescript
import type {
  PaymentParams,
  Recipient,
  SubscriptionParams,
  Subscription,
  LinkParams,
  LinkData,
  Transaction,
} from '@exe-pay/react-hooks';
```

## Requirements

- React 18+
- @solana/wallet-adapter-react (for wallet connection)
- @exe-pay/core (peer dependency)

## Testing

```bash
npm test
```

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](../../CONTRIBUTING.md) for details.

## License

MIT © ExePay Team

## Links

- [GitHub](https://github.com/ExePayInfra/exe-pay)
- [Documentation](https://github.com/ExePayInfra/exe-pay/tree/main/docs)
- [Issues](https://github.com/ExePayInfra/exe-pay/issues)
- [Live Demo](https://exe-payments-re46xgprs-exechainlink-5881s-projects.vercel.app)

## Support

- GitHub Issues: [Report a bug](https://github.com/ExePayInfra/exe-pay/issues)
- Twitter: [@ExePay](https://twitter.com/ExePay) (coming soon)
- Discord: [Join our community](https://discord.gg/exepay) (coming soon)
