# @exe-pay/utils

Utility functions and helpers for Solana payments. Includes address validation, amount formatting, and transaction utilities.

[![npm version](https://img.shields.io/npm/v/@exe-pay/utils.svg)](https://www.npmjs.com/package/@exe-pay/utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- ✅ **Address Validation** - Validate Solana addresses
- 💰 **Amount Formatting** - Format SOL and token amounts
- 🔗 **URL Helpers** - Parse and create payment URLs
- 📊 **Transaction Utilities** - Transaction status and confirmation
- 🎯 **Type Guards** - TypeScript type checking utilities
- ⚡ **Lightweight** - Minimal dependencies

## Installation

```bash
npm install @exe-pay/utils
```

## Quick Start

```typescript
import { isValidAddress, formatAmount, parseAmount } from '@exe-pay/utils';

// Validate address
const valid = isValidAddress('DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK');
console.log(valid); // true

// Format amount
const formatted = formatAmount(1500000000, 9); // SOL has 9 decimals
console.log(formatted); // "1.5"

// Parse amount
const lamports = parseAmount('1.5', 9);
console.log(lamports); // 1500000000
```

## API Reference

### Address Utilities

#### `isValidAddress(address)`

Check if a string is a valid Solana address.

**Parameters:**
- `address`: String to validate

**Returns:** `boolean`

```typescript
isValidAddress('DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK'); // true
isValidAddress('invalid'); // false
```

---

#### `shortenAddress(address, chars?)`

Shorten a Solana address for display.

**Parameters:**
- `address`: Full address string
- `chars`: Number of characters to show (default: 4)

**Returns:** Shortened address string

```typescript
shortenAddress('DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK');
// "DYw8...CNSKK"

shortenAddress('DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK', 6);
// "DYw8jC...G5CNSKK"
```

---

### Amount Utilities

#### `formatAmount(amount, decimals)`

Format an amount with decimals for display.

**Parameters:**
- `amount`: Amount in base units (number or bigint)
- `decimals`: Number of decimal places

**Returns:** Formatted string

```typescript
formatAmount(1500000000, 9); // "1.5" (SOL)
formatAmount(1000000, 6); // "1" (USDC)
formatAmount(100, 2); // "1" (cents)
```

---

#### `parseAmount(amount, decimals)`

Parse a formatted amount to base units.

**Parameters:**
- `amount`: Formatted amount string
- `decimals`: Number of decimal places

**Returns:** Amount in base units (number)

```typescript
parseAmount('1.5', 9); // 1500000000 (SOL)
parseAmount('1', 6); // 1000000 (USDC)
parseAmount('1.23', 2); // 123 (cents)
```

---

#### `formatCurrency(amount, currency)`

Format amount with currency symbol.

**Parameters:**
- `amount`: Amount to format
- `currency`: Currency code ('SOL', 'USDC', etc.)

**Returns:** Formatted string with symbol

```typescript
formatCurrency(1.5, 'SOL'); // "◎1.5"
formatCurrency(100, 'USDC'); // "$100"
```

---

### URL Utilities

#### `createPaymentURL(params)`

Create a payment URL for sharing.

**Parameters:**
- `params.recipient`: Recipient address
- `params.amount?`: Optional amount
- `params.token?`: Optional token mint
- `params.memo?`: Optional memo

**Returns:** Payment URL string

```typescript
const url = createPaymentURL({
  recipient: 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK',
  amount: 1.5,
  token: 'SOL',
  memo: 'Payment for services',
});
// "https://exepay.app/pay?recipient=...&amount=1.5&token=SOL&memo=..."
```

---

#### `parsePaymentURL(url)`

Parse a payment URL.

**Parameters:**
- `url`: Payment URL string

**Returns:** Payment parameters object

```typescript
const params = parsePaymentURL('https://exepay.app/pay?recipient=...&amount=1.5');
// { recipient: '...', amount: 1.5, token: 'SOL', memo: undefined }
```

---

### Transaction Utilities

#### `getTransactionStatus(signature, connection)`

Get the status of a transaction.

**Parameters:**
- `signature`: Transaction signature
- `connection`: Solana Connection object

**Returns:** Promise<TransactionStatus>

```typescript
import { Connection } from '@solana/web3.js';

const connection = new Connection('https://api.mainnet-beta.solana.com');
const status = await getTransactionStatus(signature, connection);

console.log(status.confirmed); // true/false
console.log(status.finalized); // true/false
console.log(status.error); // null or error message
```

---

#### `waitForConfirmation(signature, connection, commitment?)`

Wait for transaction confirmation.

**Parameters:**
- `signature`: Transaction signature
- `connection`: Solana Connection object
- `commitment`: Commitment level (default: 'confirmed')

**Returns:** Promise<void>

```typescript
await waitForConfirmation(signature, connection, 'confirmed');
console.log('Transaction confirmed!');
```

---

### Type Guards

#### `isPublicKey(value)`

Check if value is a PublicKey.

**Parameters:**
- `value`: Value to check

**Returns:** `boolean`

```typescript
import { PublicKey } from '@solana/web3.js';

isPublicKey(new PublicKey('...')); // true
isPublicKey('string'); // false
```

---

#### `isKeypair(value)`

Check if value is a Keypair.

**Parameters:**
- `value`: Value to check

**Returns:** `boolean`

```typescript
import { Keypair } from '@solana/web3.js';

isKeypair(Keypair.generate()); // true
isKeypair({}); // false
```

---

## Complete Example

```typescript
import {
  isValidAddress,
  formatAmount,
  parseAmount,
  shortenAddress,
  createPaymentURL,
  parsePaymentURL,
  getTransactionStatus,
  waitForConfirmation,
} from '@exe-pay/utils';
import { Connection } from '@solana/web3.js';

// Validate address
const recipient = 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK';
if (!isValidAddress(recipient)) {
  throw new Error('Invalid address');
}

// Format for display
const displayAddress = shortenAddress(recipient);
console.log(`Sending to: ${displayAddress}`);

// Parse user input
const userInput = '1.5'; // User enters "1.5 SOL"
const lamports = parseAmount(userInput, 9);
console.log(`Amount in lamports: ${lamports}`);

// Create payment link
const paymentURL = createPaymentURL({
  recipient,
  amount: parseFloat(userInput),
  token: 'SOL',
  memo: 'Payment for services',
});
console.log(`Share this link: ${paymentURL}`);

// Parse payment link
const params = parsePaymentURL(paymentURL);
console.log('Payment details:', params);

// Check transaction status
const connection = new Connection('https://api.mainnet-beta.solana.com');
const signature = 'YOUR_TRANSACTION_SIGNATURE';

const status = await getTransactionStatus(signature, connection);
if (status.confirmed) {
  console.log('✅ Transaction confirmed!');
} else if (status.error) {
  console.error('❌ Transaction failed:', status.error);
}

// Wait for confirmation
await waitForConfirmation(signature, connection);
console.log('Transaction finalized!');
```

## TypeScript Support

Full TypeScript support with type definitions.

```typescript
import type {
  TransactionStatus,
  PaymentURLParams,
  PaymentParams,
} from '@exe-pay/utils';
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

## Support

- GitHub Issues: [Report a bug](https://github.com/ExePayInfra/exe-pay/issues)
- Twitter: [@ExePay](https://twitter.com/ExePay) (coming soon)
- Discord: [Join our community](https://discord.gg/exepay) (coming soon)
