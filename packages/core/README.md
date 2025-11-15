# @exe-pay/core

Privacy-first payments SDK for Solana with zero-knowledge proofs, ElGamal encryption, and confidential transfers.

[![npm version](https://img.shields.io/npm/v/@exe-pay/core.svg)](https://www.npmjs.com/package/@exe-pay/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🔐 **ElGamal Encryption** - Homomorphic encryption for amounts
- 🔒 **Zero-Knowledge Proofs** - Groth16 ZK-SNARKs for balance verification
- 💸 **Multi-Token Support** - SOL, USDC, USDT, and all SPL tokens
- 📦 **Batch Payments** - Send to multiple recipients in one transaction
- 🔄 **Recurring Payments** - Automated subscriptions
- 🔗 **Payment Links** - Shareable payment requests
- 📱 **QR Codes** - Scan-to-pay functionality
- 🌐 **Mainnet Ready** - Production-tested on Solana mainnet

## Installation

```bash
npm install @exe-pay/core @solana/web3.js
```

or

```bash
yarn add @exe-pay/core @solana/web3.js
```

or

```bash
pnpm add @exe-pay/core @solana/web3.js
```

## Quick Start

### Basic Payment

```typescript
import { Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { sendPayment } from '@exe-pay/core';

const connection = new Connection('https://api.mainnet-beta.solana.com');
const sender = Keypair.generate(); // Your wallet keypair

const signature = await sendPayment(connection, {
  sender,
  recipient: 'RECIPIENT_ADDRESS',
  amount: 1.5 * LAMPORTS_PER_SOL, // 1.5 SOL
  memo: 'Payment for services',
});

console.log('Transaction:', signature);
```

### Private Payment (Shielded)

```typescript
import { sendConfidentialTransfer } from '@exe-pay/core';

const signature = await sendConfidentialTransfer(connection, {
  sender,
  recipient: 'RECIPIENT_ADDRESS',
  amount: 1000000, // 1 USDC (6 decimals)
  mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC mint
});

console.log('Private transaction:', signature);
```

### Batch Payment

```typescript
import { sendBatchPayment } from '@exe-pay/core';

const recipients = [
  { address: 'ADDR1', amount: 0.5 * LAMPORTS_PER_SOL },
  { address: 'ADDR2', amount: 1.0 * LAMPORTS_PER_SOL },
  { address: 'ADDR3', amount: 0.3 * LAMPORTS_PER_SOL },
];

const signature = await sendBatchPayment(connection, {
  sender,
  recipients,
});

console.log('Batch payment:', signature);
```

### Recurring Payment

```typescript
import { createRecurringPayment, executeRecurringPayment } from '@exe-pay/core';

// Create subscription
const subscription = await createRecurringPayment({
  recipient: 'RECIPIENT_ADDRESS',
  amount: 100 * LAMPORTS_PER_SOL, // 100 SOL
  frequency: 'monthly',
  startDate: new Date(),
});

// Execute payment when due
const signature = await executeRecurringPayment(connection, {
  sender,
  subscription,
});
```

## API Reference

### Core Functions

#### `sendPayment(connection, params)`

Send a standard Solana payment.

**Parameters:**
- `connection`: Solana Connection object
- `params.sender`: Keypair of the sender
- `params.recipient`: PublicKey or string address
- `params.amount`: Amount in lamports (for SOL) or token base units
- `params.memo?`: Optional memo string

**Returns:** Transaction signature (string)

---

#### `sendConfidentialTransfer(connection, params)`

Send a private payment with encrypted amount.

**Parameters:**
- `connection`: Solana Connection object
- `params.sender`: Keypair of the sender
- `params.recipient`: PublicKey or string address
- `params.amount`: Amount in token base units
- `params.mint`: Token mint address (PublicKey or string)
- `params.memo?`: Optional memo string

**Returns:** Transaction signature (string)

**Privacy:** Amount is encrypted using ElGamal encryption. ZK proofs verify balance without revealing it.

---

#### `sendBatchPayment(connection, params)`

Send payments to multiple recipients in one transaction.

**Parameters:**
- `connection`: Solana Connection object
- `params.sender`: Keypair of the sender
- `params.recipients`: Array of `{ address: string, amount: number }`
- `params.token?`: Optional token mint (defaults to SOL)

**Returns:** Transaction signature (string)

**Limits:** Up to 10 recipients per batch

---

#### `createRecurringPayment(params)`

Create a recurring payment subscription.

**Parameters:**
- `params.recipient`: Recipient address (string)
- `params.amount`: Amount per payment
- `params.frequency`: 'daily' | 'weekly' | 'monthly'
- `params.startDate`: Start date (Date object)
- `params.token?`: Optional token mint

**Returns:** Subscription object

---

#### `executeRecurringPayment(connection, params)`

Execute a due recurring payment.

**Parameters:**
- `connection`: Solana Connection object
- `params.sender`: Keypair of the sender
- `params.subscription`: Subscription object

**Returns:** Transaction signature (string)

---

### Encryption Functions

#### `encryptAmount(amount, publicKey)`

Encrypt an amount using ElGamal encryption.

**Parameters:**
- `amount`: Amount to encrypt (bigint)
- `publicKey`: Recipient's ElGamal public key (Uint8Array)

**Returns:** ElGamalCiphertext object

---

#### `decryptAmount(ciphertext, privateKey)`

Decrypt an encrypted amount.

**Parameters:**
- `ciphertext`: ElGamalCiphertext object
- `privateKey`: Recipient's ElGamal private key (Uint8Array)

**Returns:** Decrypted amount (bigint)

---

### Utility Functions

#### `generateElGamalKeypair()`

Generate a new ElGamal keypair for encryption.

**Returns:** `{ publicKey: Uint8Array, privateKey: Uint8Array }`

---

#### `deriveElGamalKeypair(solanaKeypair)`

Derive ElGamal keypair from Solana keypair.

**Parameters:**
- `solanaKeypair`: Solana Keypair object

**Returns:** `{ publicKey: Uint8Array, privateKey: Uint8Array }`

---

## Privacy Levels

### Public (Standard)
- Amount: Visible
- Recipient: Visible
- Sender: Visible
- Speed: Fast (~1-2s)
- Fees: Low (~$0.00025)

### Shielded (Private Amount)
- Amount: **Encrypted**
- Recipient: Visible
- Sender: Visible
- Speed: Fast (~2-3s)
- Fees: Low (~$0.00025)

### Private (Fully Private)
- Amount: **Encrypted**
- Recipient: **Encrypted**
- Sender: **Encrypted**
- Speed: Fast (~2-3s)
- Fees: Low (~$0.00025)

## Advanced Usage

### Custom RPC Endpoint

```typescript
const connection = new Connection('https://your-rpc-endpoint.com', {
  commitment: 'confirmed',
  confirmTransactionInitialTimeout: 60000,
});
```

### Error Handling

```typescript
try {
  const signature = await sendPayment(connection, params);
  console.log('Success:', signature);
} catch (error) {
  if (error.message.includes('insufficient funds')) {
    console.error('Not enough balance');
  } else if (error.message.includes('invalid address')) {
    console.error('Invalid recipient address');
  } else {
    console.error('Transaction failed:', error);
  }
}
```

### Transaction Confirmation

```typescript
const signature = await sendPayment(connection, params);

// Wait for confirmation
const confirmation = await connection.confirmTransaction(signature, 'confirmed');

if (confirmation.value.err) {
  console.error('Transaction failed:', confirmation.value.err);
} else {
  console.log('Transaction confirmed!');
}
```

## Examples

Check out the [examples directory](../../apps/web/src/app) for complete working examples:

- [Basic Payment](../../apps/web/src/app/wallet/page.tsx)
- [Batch Payments](../../apps/web/src/app/batch/page.tsx)
- [Recurring Payments](../../apps/web/src/app/recurring/page.tsx)
- [Payment Links](../../apps/web/src/app/create-link/page.tsx)

## TypeScript Support

This package is written in TypeScript and includes full type definitions.

```typescript
import type {
  PaymentParams,
  ConfidentialTransferParams,
  BatchPaymentParams,
  RecurringPaymentParams,
  ElGamalKeypair,
  ElGamalCiphertext,
} from '@exe-pay/core';
```

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
