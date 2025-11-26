# ExePay API Reference

Complete API documentation for the ExePay SDK.

**Version:** 0.3.0  
**Last Updated:** November 25, 2025

---

## 📦 Packages

ExePay is organized into modular packages:

- **`@exe-pay/core`** - Core payment functionality
- **`@exe-pay/privacy`** - Privacy features and ZK proofs
- **`@exe-pay/react-hooks`** - React hooks for easy integration
- **`@exe-pay/utils`** - Utility functions

---

## 🔑 Core Package (`@exe-pay/core`)

### `createPayment()`

Send a standard SOL or SPL token payment.

**Signature:**
```typescript
async function createPayment(
  options: PaymentOptions
): Promise<PaymentResult>
```

**Parameters:**
```typescript
interface PaymentOptions {
  connection: Connection;        // Solana connection
  sender: PublicKey;            // Sender's public key
  recipient: PublicKey;         // Recipient's public key
  amount: number;               // Amount in SOL or tokens
  signTransaction: SignTransaction; // Wallet sign function
  token?: PublicKey;            // Optional: SPL token mint (defaults to SOL)
  privacyLevel?: PrivacyLevel;  // Optional: 'public' | 'shielded' | 'private' | 'lightprotocol'
}
```

**Returns:**
```typescript
interface PaymentResult {
  signature: string;            // Transaction signature
  confirmed: boolean;           // Confirmation status
  amount: number;              // Amount sent
  recipient: PublicKey;        // Recipient address
  timestamp: number;           // Transaction timestamp
}
```

**Example:**
```typescript
import { createPayment } from '@exe-pay/core';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

const { publicKey, signTransaction } = useWallet();
const { connection } = useConnection();

const result = await createPayment({
  connection,
  sender: publicKey,
  recipient: new PublicKey('RECIPIENT_ADDRESS'),
  amount: 0.1,
  signTransaction,
});

console.log('Payment sent!', result.signature);
```

**Error Handling:**
```typescript
try {
  const result = await createPayment({ ... });
} catch (error) {
  if (error.code === 'INSUFFICIENT_BALANCE') {
    console.error('Not enough funds');
  } else if (error.code === 'USER_REJECTED') {
    console.error('User cancelled transaction');
  } else {
    console.error('Payment failed:', error.message);
  }
}
```

---

### `createTokenPayment()`

Send SPL tokens (USDC, USDT, etc.).

**Signature:**
```typescript
async function createTokenPayment(
  options: TokenPaymentOptions
): Promise<PaymentResult>
```

**Parameters:**
```typescript
interface TokenPaymentOptions {
  connection: Connection;
  sender: PublicKey;
  recipient: PublicKey;
  amount: number;              // Amount in token units
  tokenMint: PublicKey;        // Token mint address
  signTransaction: SignTransaction;
  decimals?: number;           // Token decimals (auto-detected if omitted)
}
```

**Example:**
```typescript
import { createTokenPayment } from '@exe-pay/core';
import { USDC_MINT } from '@exe-pay/utils';

const result = await createTokenPayment({
  connection,
  sender: publicKey,
  recipient: new PublicKey('RECIPIENT_ADDRESS'),
  amount: 10, // 10 USDC
  tokenMint: USDC_MINT,
  signTransaction,
});
```

---

### `getBalance()`

Get SOL or token balance for an address.

**Signature:**
```typescript
async function getBalance(
  connection: Connection,
  publicKey: PublicKey,
  token?: PublicKey
): Promise<number>
```

**Parameters:**
- `connection` - Solana connection
- `publicKey` - Address to check
- `token` - Optional token mint (defaults to SOL)

**Returns:** Balance in SOL or token units

**Example:**
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

### `fetchTransactionHistory()`

Fetch transaction history for an address.

**Signature:**
```typescript
async function fetchTransactionHistory(
  connection: Connection,
  address: string,
  limit?: number
): Promise<TransactionHistory[]>
```

**Parameters:**
- `connection` - Solana connection
- `address` - Wallet address
- `limit` - Max number of transactions (default: 20)

**Returns:**
```typescript
interface TransactionHistory {
  signature: string;
  timestamp: number;
  type: 'sent' | 'received';
  amount: number;
  otherParty: string;
  status: 'confirmed' | 'finalized';
}
```

**Example:**
```typescript
import { fetchTransactionHistory } from '@exe-pay/core';

const history = await fetchTransactionHistory(
  connection,
  publicKey.toString(),
  10 // Last 10 transactions
);

history.forEach(tx => {
  console.log(`${tx.type}: ${tx.amount} SOL - ${tx.signature}`);
});
```

---

## 🔐 Privacy Package (`@exe-pay/privacy`)

### `createShieldedTransfer()`

Send payment with ZK proof to hide amount.

**Signature:**
```typescript
async function createShieldedTransfer(
  options: ShieldedTransferOptions
): Promise<PaymentResult>
```

**Parameters:**
```typescript
interface ShieldedTransferOptions {
  connection: Connection;
  sender: PublicKey;
  recipient: PublicKey;
  amount: number;
  signTransaction: SignTransaction;
}
```

**Privacy Level:**
- ✅ Sender visible
- ✅ Recipient visible
- ❌ Amount hidden (ZK proof)

**Example:**
```typescript
import { createShieldedTransfer } from '@exe-pay/privacy';

const result = await createShieldedTransfer({
  connection,
  sender: publicKey,
  recipient: new PublicKey('RECIPIENT_ADDRESS'),
  amount: 0.5,
  signTransaction,
});

// On Solscan: Amount will show as "[HIDDEN]"
```

---

### `createPrivateTransfer()`

Send payment with encrypted recipient and hidden amount.

**Signature:**
```typescript
async function createPrivateTransfer(
  options: PrivateTransferOptions
): Promise<PaymentResult>
```

**Parameters:**
```typescript
interface PrivateTransferOptions {
  connection: Connection;
  sender: PublicKey;
  recipient: PublicKey;
  amount: number;
  signTransaction: SignTransaction;
}
```

**Privacy Level:**
- ✅ Sender visible
- ❌ Recipient encrypted
- ❌ Amount hidden (ZK proof)

**Example:**
```typescript
import { createPrivateTransfer } from '@exe-pay/privacy';

const result = await createPrivateTransfer({
  connection,
  sender: publicKey,
  recipient: new PublicKey('RECIPIENT_ADDRESS'),
  amount: 1.0,
  signTransaction,
});

// On Solscan: Recipient and amount hidden
```

---

### `createLightShieldedTransfer()`

Send payment with TRUE privacy using Light Protocol.

**Signature:**
```typescript
async function createLightShieldedTransfer(
  options: LightShieldedTransferOptions
): Promise<PaymentResult>
```

**Parameters:**
```typescript
interface LightShieldedTransferOptions {
  connection: Connection;
  sender: PublicKey;
  recipient: PublicKey;
  amount: number;
  signTransaction: SignTransaction;
}
```

**Privacy Level:**
- ❌ Sender hidden
- ❌ Recipient hidden
- ❌ Amount hidden
- ✅ Only shows "Light Protocol interaction"

**Example:**
```typescript
import { createLightShieldedTransfer } from '@exe-pay/privacy';

const result = await createLightShieldedTransfer({
  connection,
  sender: publicKey,
  recipient: new PublicKey('RECIPIENT_ADDRESS'),
  amount: 0.25,
  signTransaction,
});

// On Solscan: Completely invisible transaction
```

---

### `generateCommitment()`

Generate Pedersen commitment for privacy proofs.

**Signature:**
```typescript
function generateCommitment(
  value: bigint,
  salt: bigint
): bigint
```

**Parameters:**
- `value` - Value to commit (amount in lamports)
- `salt` - Random salt (blinding factor)

**Returns:** Commitment value

**Example:**
```typescript
import { generateCommitment, generateSalt } from '@exe-pay/privacy';

const amount = 1000000000n; // 1 SOL in lamports
const salt = generateSalt();
const commitment = generateCommitment(amount, salt);

console.log('Commitment:', commitment.toString());
```

---

### `generateSalt()`

Generate random salt for commitments.

**Signature:**
```typescript
function generateSalt(): bigint
```

**Returns:** Random bigint salt

**Example:**
```typescript
import { generateSalt } from '@exe-pay/privacy';

const salt = generateSalt();
console.log('Salt:', salt.toString());
```

---

### `generateNullifier()`

Generate nullifier to prevent double-spending.

**Signature:**
```typescript
function generateNullifier(
  commitment: bigint,
  secret: bigint
): bigint
```

**Parameters:**
- `commitment` - Commitment value
- `secret` - Secret key

**Returns:** Nullifier hash

**Example:**
```typescript
import { generateNullifier, generateCommitment } from '@exe-pay/privacy';

const commitment = generateCommitment(amount, salt);
const nullifier = generateNullifier(commitment, secret);

console.log('Nullifier:', nullifier.toString());
```

---

### `depositToShieldedPool()`

Deposit SOL into Light Protocol shielded pool.

**Signature:**
```typescript
async function depositToShieldedPool(
  connection: Connection,
  wallet: PublicKey,
  amount: number,
  signTransaction: SignTransaction
): Promise<string>
```

**Parameters:**
- `connection` - Solana connection
- `wallet` - Wallet public key
- `amount` - Amount in SOL
- `signTransaction` - Sign function

**Returns:** Transaction signature

**Example:**
```typescript
import { depositToShieldedPool } from '@exe-pay/privacy';

const signature = await depositToShieldedPool(
  connection,
  publicKey,
  0.5, // Deposit 0.5 SOL
  signTransaction
);

console.log('Deposited to shielded pool:', signature);
```

---

### `withdrawFromShieldedPool()`

Withdraw SOL from Light Protocol shielded pool.

**Signature:**
```typescript
async function withdrawFromShieldedPool(
  connection: Connection,
  wallet: PublicKey,
  amount: number,
  signTransaction: SignTransaction
): Promise<string>
```

**Parameters:**
- `connection` - Solana connection
- `wallet` - Wallet public key
- `amount` - Amount in SOL
- `signTransaction` - Sign function

**Returns:** Transaction signature

**Example:**
```typescript
import { withdrawFromShieldedPool } from '@exe-pay/privacy';

const signature = await withdrawFromShieldedPool(
  connection,
  publicKey,
  0.3, // Withdraw 0.3 SOL
  signTransaction
);

console.log('Withdrawn from shielded pool:', signature);
```

---

### `getShieldedBalance()`

Get balance in Light Protocol shielded pool.

**Signature:**
```typescript
async function getShieldedBalance(
  connection: Connection,
  wallet: PublicKey
): Promise<number>
```

**Parameters:**
- `connection` - Solana connection
- `wallet` - Wallet public key

**Returns:** Shielded balance in SOL

**Example:**
```typescript
import { getShieldedBalance } from '@exe-pay/privacy';

const shieldedBalance = await getShieldedBalance(connection, publicKey);
console.log(`Shielded balance: ${shieldedBalance} SOL`);
```

---

## ⚛️ React Hooks (`@exe-pay/react-hooks`)

### `useExePay()`

Main hook for ExePay integration.

**Signature:**
```typescript
function useExePay(): ExePayHook
```

**Returns:**
```typescript
interface ExePayHook {
  sendPayment: (options: PaymentOptions) => Promise<PaymentResult>;
  getBalance: (token?: PublicKey) => Promise<number>;
  connected: boolean;
  publicKey: PublicKey | null;
  connecting: boolean;
}
```

**Example:**
```typescript
import { useExePay } from '@exe-pay/react-hooks';

function PaymentButton() {
  const { sendPayment, connected, publicKey } = useExePay();

  const handleClick = async () => {
    if (!connected) {
      alert('Please connect wallet');
      return;
    }

    const result = await sendPayment({
      recipient: 'RECIPIENT_ADDRESS',
      amount: 0.1,
    });

    alert(`Payment sent! ${result.signature}`);
  };

  return (
    <button onClick={handleClick}>
      {connected ? 'Send Payment' : 'Connect Wallet'}
    </button>
  );
}
```

---

### `useBalance()`

Hook for tracking wallet balance.

**Signature:**
```typescript
function useBalance(token?: PublicKey): {
  balance: number | null;
  loading: boolean;
  refresh: () => Promise<void>;
}
```

**Parameters:**
- `token` - Optional token mint (defaults to SOL)

**Returns:**
- `balance` - Current balance
- `loading` - Loading state
- `refresh` - Function to refresh balance

**Example:**
```typescript
import { useBalance } from '@exe-pay/react-hooks';

function BalanceDisplay() {
  const { balance, loading, refresh } = useBalance();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <p>Balance: {balance} SOL</p>
      <button onClick={refresh}>Refresh</button>
    </div>
  );
}
```

---

### `useTransactionHistory()`

Hook for transaction history.

**Signature:**
```typescript
function useTransactionHistory(limit?: number): {
  history: TransactionHistory[];
  loading: boolean;
  refresh: () => Promise<void>;
}
```

**Parameters:**
- `limit` - Max transactions to fetch (default: 20)

**Returns:**
- `history` - Array of transactions
- `loading` - Loading state
- `refresh` - Function to refresh history

**Example:**
```typescript
import { useTransactionHistory } from '@exe-pay/react-hooks';

function TransactionList() {
  const { history, loading, refresh } = useTransactionHistory(10);

  if (loading) return <div>Loading transactions...</div>;

  return (
    <div>
      <button onClick={refresh}>Refresh</button>
      {history.map(tx => (
        <div key={tx.signature}>
          {tx.type}: {tx.amount} SOL
        </div>
      ))}
    </div>
  );
}
```

---

## 🛠️ Utils Package (`@exe-pay/utils`)

### `formatAmount()`

Format amount for display.

**Signature:**
```typescript
function formatAmount(
  amount: number,
  decimals?: number,
  symbol?: string
): string
```

**Example:**
```typescript
import { formatAmount } from '@exe-pay/utils';

formatAmount(1.5, 2, 'SOL');      // "1.50 SOL"
formatAmount(1000.123, 6, 'USDC'); // "1,000.123000 USDC"
```

---

### `validateAddress()`

Validate Solana address.

**Signature:**
```typescript
function validateAddress(address: string): boolean
```

**Example:**
```typescript
import { validateAddress } from '@exe-pay/utils';

validateAddress('VALID_SOLANA_ADDRESS'); // true
validateAddress('invalid');               // false
```

---

### `shortenAddress()`

Shorten address for display.

**Signature:**
```typescript
function shortenAddress(address: string, chars?: number): string
```

**Example:**
```typescript
import { shortenAddress } from '@exe-pay/utils';

shortenAddress('7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU');
// "7xKX...gAsU"
```

---

### Token Constants

Common token mint addresses.

```typescript
import {
  SOL_MINT,
  USDC_MINT,
  USDT_MINT,
  RAY_MINT,
  SRM_MINT,
} from '@exe-pay/utils';
```

---

## 🔍 Types

### `PrivacyLevel`

```typescript
type PrivacyLevel = 'public' | 'shielded' | 'private' | 'lightprotocol';
```

### `PaymentStatus`

```typescript
type PaymentStatus = 'pending' | 'confirmed' | 'finalized' | 'failed';
```

### `TransactionType`

```typescript
type TransactionType = 'sent' | 'received';
```

---

## 🚨 Error Codes

| Code | Description |
|------|-------------|
| `INSUFFICIENT_BALANCE` | Not enough funds |
| `INVALID_ADDRESS` | Invalid recipient address |
| `USER_REJECTED` | User cancelled transaction |
| `NETWORK_ERROR` | RPC connection failed |
| `TRANSACTION_FAILED` | Transaction execution failed |
| `WALLET_NOT_CONNECTED` | Wallet not connected |

**Example:**
```typescript
try {
  await createPayment({ ... });
} catch (error) {
  switch (error.code) {
    case 'INSUFFICIENT_BALANCE':
      alert('Not enough funds');
      break;
    case 'USER_REJECTED':
      alert('Transaction cancelled');
      break;
    default:
      alert('Transaction failed');
  }
}
```

---

## 📚 Additional Resources

- [Quick Start Guide](./QUICK_START.md)
- [Privacy Guide](./PRIVACY_GUIDE.md)
- [Integration Examples](./examples/)
- [GitHub Repository](https://github.com/ExePayInfra/exe-pay)

---

**Need help?** Join our [Discord](https://discord.gg/exepay) or open an issue on [GitHub](https://github.com/ExePayInfra/exe-pay/issues).

