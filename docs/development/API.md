# 📖 ExePay API Reference

Complete API documentation for the ExePay SDK.

---

## Table of Contents

- [Core SDK](#core-sdk)
  - [ExePayClient](#exepayclient)
  - [Types](#types)
  - [Transactions](#transactions)
  - [Recurring Payments](#recurring-payments)
- [React Hooks](#react-hooks)
- [Privacy Module](#privacy-module)
- [Utilities](#utilities)

---

## Core SDK

### ExePayClient

Main client for interacting with ExePay.

#### Constructor

```typescript
new ExePayClient(config: ExePayConfig)
```

**Parameters:**
- `config.clusterUrl` (string) - Solana RPC endpoint
- `config.defaultCommitment` (Commitment, optional) - Default commitment level
- `config.rpcHeaders` (Record<string, string>, optional) - Custom RPC headers
- `config.relayerUrl` (string, optional) - Relayer endpoint for gasless transactions

**Example:**
```typescript
const client = new ExePayClient({
  clusterUrl: 'https://api.mainnet-beta.solana.com',
  defaultCommitment: 'confirmed'
});
```

---

#### Methods

##### `createIntent(params): PaymentIntent`

Create a payment intent.

**Parameters:**
- `params.amount` (number) - Amount in lamports
- `params.merchant` (PublicKey) - Recipient address
- `params.tokenMint` (PublicKey, optional) - SPL token mint
- `params.memo` (string, optional) - Payment memo

**Returns:** `PaymentIntent`

**Example:**
```typescript
const intent = client.createIntent({
  amount: 1000000,
  merchant: new PublicKey('...'),
  memo: 'Payment for services'
});
```

---

##### `build(intent, opts?): Promise<BuiltPayment>`

Build transaction instructions for a payment.

**Parameters:**
- `intent` (PaymentIntent) - Payment intent to build
- `opts.feePayer` (PublicKey, optional) - Transaction fee payer

**Returns:** `Promise<BuiltPayment>`

**Example:**
```typescript
const payment = await client.build(intent, {
  feePayer: payerPublicKey
});
```

---

##### `settle(payment, signer): Promise<SettlementResult>`

Execute a payment on-chain.

**Parameters:**
- `payment` (BuiltPayment) - Built payment to execute
- `signer` (Signer) - Transaction signer

**Returns:** `Promise<SettlementResult>`

**Example:**
```typescript
const result = await client.settle(payment, signer);
console.log('Transaction:', result.signature);
```

---

##### `createBatchIntent(params): BatchPaymentIntent`

Create a batch payment intent.

**Parameters:**
- `params.recipients` (BatchPaymentRecipient[]) - Array of recipients
- `params.tokenMint` (PublicKey, optional) - SPL token mint

**Returns:** `BatchPaymentIntent`

**Example:**
```typescript
const batchIntent = client.createBatchIntent({
  recipients: [
    { address: recipient1, amount: 1000000, memo: 'Payment 1' },
    { address: recipient2, amount: 2000000, memo: 'Payment 2' }
  ]
});
```

---

##### `buildBatch(intent, opts?): Promise<BuiltPayment>`

Build a batch payment transaction.

**Parameters:**
- `intent` (BatchPaymentIntent) - Batch payment intent
- `opts.feePayer` (PublicKey, optional) - Transaction fee payer

**Returns:** `Promise<BuiltPayment>`

---

##### `settleBatch(payment, signer): Promise<SettlementResult>`

Execute a batch payment.

**Parameters:**
- `payment` (BuiltPayment) - Built batch payment
- `signer` (Signer) - Transaction signer

**Returns:** `Promise<SettlementResult>`

---

### Types

#### `PaymentIntent`

```typescript
interface PaymentIntent {
  readonly amountLamports: bigint;
  readonly merchant: PublicKey;
  readonly tokenMint?: PublicKey;
  readonly nonce: Uint8Array;
  readonly memo?: string;
}
```

---

#### `BatchPaymentRecipient`

```typescript
interface BatchPaymentRecipient {
  readonly address: PublicKey;
  readonly amount: number;
  readonly memo?: string;
}
```

---

#### `BatchPaymentIntent`

```typescript
interface BatchPaymentIntent {
  readonly recipients: readonly BatchPaymentRecipient[];
  readonly tokenMint?: PublicKey;
  readonly nonce: Uint8Array;
}
```

---

#### `RecurringPaymentSchedule`

```typescript
interface RecurringPaymentSchedule {
  readonly merchant: PublicKey;
  readonly amount: number;
  readonly interval: "daily" | "weekly" | "monthly";
  readonly startTime: number; // Unix timestamp
  readonly endTime?: number;
  readonly maxPayments?: number;
  readonly tokenMint?: PublicKey;
}
```

---

#### `RecurringPaymentState`

```typescript
interface RecurringPaymentState {
  readonly schedule: RecurringPaymentSchedule;
  readonly paymentsExecuted: number;
  readonly lastPaymentTime: number;
  readonly isActive: boolean;
}
```

---

#### `BuiltPayment`

```typescript
interface BuiltPayment {
  readonly instructions: readonly TransactionInstruction[];
  readonly signers: readonly Signer[];
  readonly note: ShieldedNote;
}
```

---

#### `SettlementResult`

```typescript
interface SettlementResult {
  readonly signature: string;
  readonly slot: number;
  readonly finalized: boolean;
}
```

---

### Transactions

#### `createPaymentIntent(params): PaymentIntent`

Create a payment intent (standalone function).

**Parameters:** Same as `ExePayClient.createIntent`

---

#### `buildPaymentInstructions(intent, opts?): BuiltPayment`

Build payment instructions (standalone function).

**Parameters:**
- `intent` (PaymentIntent) - Payment intent
- `opts` (BuildTransactionOptions) - Build options

---

#### `createBatchPaymentIntent(params): BatchPaymentIntent`

Create a batch payment intent (standalone function).

**Parameters:** Same as `ExePayClient.createBatchIntent`

---

#### `buildBatchPaymentInstructions(intent, opts?): BuiltPayment`

Build batch payment instructions (standalone function).

**Parameters:**
- `intent` (BatchPaymentIntent) - Batch payment intent
- `opts` (BuildTransactionOptions) - Build options

---

### Recurring Payments

#### `createRecurringSchedule(params): RecurringPaymentSchedule`

Create a recurring payment schedule.

**Parameters:**
- `params.merchant` (PublicKey) - Recipient address
- `params.amount` (number) - Payment amount in lamports
- `params.interval` ("daily" | "weekly" | "monthly") - Payment frequency
- `params.startTime` (number, optional) - Start timestamp (default: now)
- `params.endTime` (number, optional) - End timestamp
- `params.maxPayments` (number, optional) - Maximum number of payments
- `params.tokenMint` (PublicKey, optional) - SPL token mint

**Returns:** `RecurringPaymentSchedule`

**Example:**
```typescript
const schedule = createRecurringSchedule({
  merchant: merchantPublicKey,
  amount: 5000000,
  interval: 'monthly',
  maxPayments: 12
});
```

---

#### `initializeRecurringState(schedule): RecurringPaymentState`

Initialize state for a recurring schedule.

**Parameters:**
- `schedule` (RecurringPaymentSchedule) - Payment schedule

**Returns:** `RecurringPaymentState`

---

#### `isPaymentDue(state, currentTime?): boolean`

Check if a recurring payment is due.

**Parameters:**
- `state` (RecurringPaymentState) - Current state
- `currentTime` (number, optional) - Current timestamp (default: Date.now())

**Returns:** `boolean`

---

#### `getNextPaymentIntent(state): PaymentIntent | null`

Get the next payment intent if due.

**Parameters:**
- `state` (RecurringPaymentState) - Current state

**Returns:** `PaymentIntent | null`

---

#### `recordPaymentExecution(state, currentTime?): RecurringPaymentState`

Update state after payment execution.

**Parameters:**
- `state` (RecurringPaymentState) - Current state
- `currentTime` (number, optional) - Execution timestamp

**Returns:** `RecurringPaymentState` - Updated state

---

#### `cancelRecurringSchedule(state): RecurringPaymentState`

Cancel a recurring payment schedule.

**Parameters:**
- `state` (RecurringPaymentState) - Current state

**Returns:** `RecurringPaymentState` - Updated state with `isActive: false`

---

#### `getTimeUntilNextPayment(state, currentTime?): number`

Get milliseconds until next payment.

**Parameters:**
- `state` (RecurringPaymentState) - Current state
- `currentTime` (number, optional) - Current timestamp

**Returns:** `number` - Milliseconds until next payment (-1 if inactive)

---

## React Hooks

### `useExePay(config): ExePayClient`

Initialize ExePay client.

**Parameters:**
- `config` (ExePayConfig) - Client configuration

**Returns:** `ExePayClient`

---

### `usePaymentIntent(client)`

Manage payment intents.

**Parameters:**
- `client` (ExePayClient) - ExePay client instance

**Returns:**
```typescript
{
  intent: PaymentIntent | null;
  payment: BuiltPayment | null;
  isBuilding: boolean;
  error: Error | null;
  create: (params, signer) => Promise<BuiltPayment>;
}
```

---

### `useBatchPayment(client)`

Manage batch payments.

**Parameters:**
- `client` (ExePayClient) - ExePay client instance

**Returns:**
```typescript
{
  intent: BatchPaymentIntent | null;
  payment: BuiltPayment | null;
  isBuilding: boolean;
  error: Error | null;
  create: (recipients, signer, tokenMint?) => Promise<BuiltPayment>;
}
```

---

### `useRecurringPayment(schedule)`

Manage recurring payments.

**Parameters:**
- `schedule` (RecurringPaymentSchedule | null) - Payment schedule

**Returns:**
```typescript
{
  state: RecurringPaymentState | null;
  isDue: boolean;
  nextIntent: PaymentIntent | null;
  timeUntilNext: number;
  recordExecution: () => void;
  cancel: () => void;
}
```

---

## Privacy Module

### `proveSpend(note, rpc?): Promise<ProveSpendResult>`

Generate a zero-knowledge proof for spending.

**Parameters:**
- `note` (ShieldedNote) - Shielded note to spend
- `rpc` (Rpc, optional) - Light Protocol RPC client

**Returns:** `Promise<ProveSpendResult>`

---

### `poseidon(input): Uint8Array`

Poseidon hash function for commitments.

**Parameters:**
- `input` (Uint8Array) - Input data

**Returns:** `Uint8Array` - Hash output

---

## Utilities

### `commitmentToSolana(commitment): Commitment`

Convert ExePay commitment to Solana commitment.

**Parameters:**
- `commitment` ("processed" | "confirmed" | "finalized")

**Returns:** Solana `Commitment`

---

### `withTimeout<T>(promise, ms): Promise<T>`

Add timeout to a promise.

**Parameters:**
- `promise` (Promise<T>) - Promise to wrap
- `ms` (number) - Timeout in milliseconds

**Returns:** `Promise<T>`

**Throws:** Error if timeout is reached

---

## Error Handling

All methods may throw errors. Always wrap in try-catch:

```typescript
try {
  const payment = await client.build(intent);
  const result = await client.settle(payment, signer);
} catch (error) {
  console.error('Payment failed:', error);
  // Handle error
}
```

---

## Constants

### Program IDs

```typescript
const EXE_PAY_PROGRAM_ID = "ExEPaY1111111111111111111111111111111111";
const LIGHT_PROGRAM_ID = "compr6CUsB5m2jS4Y3831ztGSTnDpnKJTKS95d64XVq";
```

---

## Best Practices

1. **Always validate inputs** before creating intents
2. **Use appropriate commitment levels** for your use case
3. **Handle errors gracefully** with try-catch
4. **Store recurring payment state** persistently
5. **Test on devnet** before mainnet deployment
6. **Monitor transaction confirmations** for critical payments

---

## Examples

See the [FEATURES.md](./FEATURES.md) document for complete examples and use cases.

---

**Need help?** Join our [Discord](https://discord.gg/exepay) or check the [GitHub Issues](https://github.com/ExePayInfra/exe-pay/issues).

