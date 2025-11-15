# 🚀 ExePay Features

## Overview

ExePay is a privacy-preserving payments SDK for Solana, powered by Light Protocol's zero-knowledge compression technology. Build private, efficient, and scalable payment applications with ease.

---

## 🔐 Core Features

### 1. **Privacy-Preserving Payments**

Send and receive payments with complete privacy using zero-knowledge proofs.

```typescript
import { ExePayClient } from '@exe-pay/core';

const client = new ExePayClient({
  clusterUrl: 'https://api.mainnet-beta.solana.com',
  defaultCommitment: 'confirmed'
});

// Create a private payment
const intent = client.createIntent({
  amount: 1000000, // lamports
  merchant: merchantPublicKey,
  memo: 'Private payment'
});

// Build and settle
const payment = await client.build(intent, { feePayer: payerPublicKey });
const result = await client.settle(payment, signer);
```

**Key Benefits:**
- ✅ Zero-knowledge proofs hide transaction details
- ✅ Compressed accounts reduce costs
- ✅ Light Protocol integration for production-ready privacy

---

### 2. **Batch Payments**

Send payments to multiple recipients in a single transaction.

```typescript
import { ExePayClient } from '@exe-pay/core';

const client = new ExePayClient({ /* config */ });

// Create batch payment
const batchIntent = client.createBatchIntent({
  recipients: [
    { address: recipient1, amount: 1000000, memo: 'Payment 1' },
    { address: recipient2, amount: 2000000, memo: 'Payment 2' },
    { address: recipient3, amount: 1500000, memo: 'Payment 3' }
  ]
});

// Build and execute
const payment = await client.buildBatch(batchIntent, { feePayer: payerPublicKey });
const result = await client.settleBatch(payment, signer);
```

**Features:**
- ✅ Up to 100 recipients per batch
- ✅ Privacy-preserving for all transfers
- ✅ Efficient on-chain execution
- ✅ Individual memos per recipient

---

### 3. **Recurring Payments**

Set up automated recurring payments with flexible schedules.

```typescript
import { createRecurringSchedule, initializeRecurringState } from '@exe-pay/core';

// Create a monthly subscription
const schedule = createRecurringSchedule({
  merchant: merchantPublicKey,
  amount: 5000000, // 0.005 SOL per month
  interval: 'monthly',
  startTime: Date.now(),
  maxPayments: 12 // 1 year subscription
});

// Initialize state
const state = initializeRecurringState(schedule);

// Check if payment is due
if (isPaymentDue(state)) {
  const intent = getNextPaymentIntent(state);
  // Execute payment...
  const newState = recordPaymentExecution(state);
}
```

**Intervals:**
- 📅 **Daily** - Every 24 hours
- 📅 **Weekly** - Every 7 days
- 📅 **Monthly** - Every 30 days

**Options:**
- Set start and end times
- Limit maximum number of payments
- Cancel anytime
- Track execution history

---

## 🎣 React Hooks

### `useExePay`

Initialize the ExePay client.

```typescript
import { useExePay } from '@exe-pay/react-hooks';

function MyComponent() {
  const client = useExePay({
    clusterUrl: 'https://api.mainnet-beta.solana.com',
    defaultCommitment: 'confirmed'
  });

  return <div>Client ready!</div>;
}
```

---

### `usePaymentIntent`

Manage single payment intents.

```typescript
import { usePaymentIntent } from '@exe-pay/react-hooks';

function PaymentForm() {
  const client = useExePay({ /* config */ });
  const { intent, payment, isBuilding, error, create } = usePaymentIntent(client);

  const handlePay = async () => {
    await create({
      amount: 1000000,
      merchant: merchantPublicKey,
      memo: 'Payment'
    }, payerPublicKey);
  };

  return (
    <button onClick={handlePay} disabled={isBuilding}>
      {isBuilding ? 'Processing...' : 'Pay Now'}
    </button>
  );
}
```

---

### `useBatchPayment`

Manage batch payments.

```typescript
import { useBatchPayment } from '@exe-pay/react-hooks';

function BatchPaymentForm() {
  const client = useExePay({ /* config */ });
  const { intent, payment, isBuilding, error, create } = useBatchPayment(client);

  const handleBatchPay = async () => {
    await create(
      [
        { address: recipient1, amount: 1000000 },
        { address: recipient2, amount: 2000000 }
      ],
      payerPublicKey
    );
  };

  return (
    <button onClick={handleBatchPay} disabled={isBuilding}>
      {isBuilding ? 'Sending...' : 'Send Batch Payment'}
    </button>
  );
}
```

---

### `useRecurringPayment`

Manage recurring payment schedules.

```typescript
import { useRecurringPayment } from '@exe-pay/react-hooks';

function SubscriptionManager() {
  const schedule = createRecurringSchedule({ /* config */ });
  const { state, isDue, nextIntent, timeUntilNext, recordExecution, cancel } = 
    useRecurringPayment(schedule);

  return (
    <div>
      <p>Status: {state?.isActive ? 'Active' : 'Inactive'}</p>
      <p>Payments executed: {state?.paymentsExecuted}</p>
      <p>Next payment in: {Math.floor(timeUntilNext / 1000)}s</p>
      {isDue && <button>Execute Payment</button>}
      <button onClick={cancel}>Cancel Subscription</button>
    </div>
  );
}
```

---

## 🔧 Advanced Features

### Compressed Accounts

All payments use Light Protocol's compressed accounts for:
- **Lower Costs** - Reduced on-chain storage
- **Better Privacy** - ZK compression hides details
- **Scalability** - Handle more transactions

### Zero-Knowledge Proofs

Every payment includes a ZK proof that:
- Verifies the spend without revealing details
- Uses Poseidon hash for commitments
- Validates on-chain via Light Protocol

### Shielded Notes

Payments generate shielded notes with:
- **Commitment** - Cryptographic commitment to payment
- **Nullifier** - Prevents double-spending
- **Encrypted Payload** - Private payment data

---

## 📊 Use Cases

### 1. **E-Commerce**
- Private checkout flows
- Batch payouts to vendors
- Subscription services

### 2. **Payroll**
- Batch payments to employees
- Recurring salary payments
- Privacy for sensitive transactions

### 3. **DeFi**
- Private swaps and trades
- Recurring DCA (Dollar Cost Averaging)
- Batch reward distributions

### 4. **DAOs**
- Private governance votes with payments
- Batch contributor payments
- Recurring treasury distributions

---

## 🎯 Performance

- **Batch Payments**: Up to 100 recipients per transaction
- **Privacy**: Zero-knowledge proofs for all transfers
- **Cost**: ~50% reduction with compressed accounts
- **Speed**: Confirmed in 400-600ms on mainnet

---

## 🔒 Security

- ✅ Audited Light Protocol integration
- ✅ Zero-knowledge proof verification
- ✅ Deterministic commitment schemes
- ✅ Nullifier-based double-spend prevention
- ✅ Encrypted payment metadata

---

## 📚 Next Steps

1. **Read the [Getting Started Guide](./GETTING_STARTED.md)**
2. **Check out [Example Code](./apps/demo/)**
3. **Deploy with [Vercel Guide](./DEPLOY.md)**
4. **Integrate [Light Protocol](./MVP_GUIDE.md)**

---

## 🤝 Support

- **Documentation**: [docs.exepay.io](https://exe-payments-dgfolqpcm-exechainlink-5881s-projects.vercel.app)
- **GitHub**: [github.com/ExePayInfra/exe-pay](https://github.com/ExePayInfra/exe-pay)
- **Discord**: Join our community
- **Twitter**: [@ExePayInfra](https://twitter.com/ExePayInfra)

---

Built with ❤️ using [Light Protocol](https://lightprotocol.com) for Solana

