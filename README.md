# ExePay

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://exepay.app)
[![Documentation](https://img.shields.io/badge/docs-online-blue)](https://docs.exepay.app)
[![License](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)
[![Mainnet](https://img.shields.io/badge/network-mainnet-success)](https://solana.com)

**Privacy-preserving payment infrastructure for Solana**

ExePay enables private payments on Solana using stealth addresses, cryptographic payment proofs, and zero-knowledge compression. Built with the same cryptographic primitives as Monero, adapted for Solana's architecture.

Documentation is available at [docs.exepay.app](https://docs.exepay.app).

## Examples

### Stealth Address Payment

```typescript
import { generateStealthMetaAddress, generateStealthAddress } from "@exe-pay/privacy";

// Recipient: Generate meta-address (one-time setup)
const metaAddress = await generateStealthMetaAddress(recipientKeypair);
const encoded = encodeStealthMetaAddress(metaAddress);
// Share: stealth:SPENDING_KEY:VIEWING_KEY

// Sender: Generate one-time payment address
const { address, ephemeralPubkey, viewTag } = generateStealthAddress(metaAddress);
// Send SOL to `address` - only recipient can detect and claim
```

### Payment Proof Generation

```typescript
import { generatePaymentProof, verifyPaymentProof } from "@exe-pay/privacy";

// Sender: Generate cryptographic proof
const proof = generatePaymentProof(
  stealthAddress,
  ephemeralPrivateKey,
  txSignature,
  amount,
);

// Anyone: Verify proof on-chain
const isValid = await verifyPaymentProof(proof, connection);
```

### Integrated Address (Invoice Tracking)

```typescript
import { generateIntegratedAddress } from "@exe-pay/privacy";

// Generate address with embedded payment ID
const integrated = generateIntegratedAddress(metaAddress, "invoice-12345");
// Payment automatically includes invoice ID in memo
```

### Subaddresses (Multiple Identities)

```typescript
import { generateSubaddress } from "@exe-pay/privacy";

// Generate independent identities from one wallet
const businessAddr = await generateSubaddress(masterKeypair, 0, "Business");
const personalAddr = await generateSubaddress(masterKeypair, 1, "Personal");
// Each subaddress is cryptographically unlinkable
```

## Features

| Feature              | Technology                 | Status     |
| -------------------- | -------------------------- | ---------- |
| Stealth Addresses    | X25519 ECDH + Keccak-256   | ✅ Mainnet |
| Payment Proofs       | Cryptographic verification | ✅ Mainnet |
| Integrated Addresses | Payment ID embedding       | ✅ Mainnet |
| Subaddresses         | BIP32-derived identities   | ✅ Mainnet |
| View Keys            | SHA-256 derived            | ✅ Mainnet |
| Enhanced Scanning    | View tag optimization      | ✅ Mainnet |
| RPC Privacy          | Multi-endpoint rotation    | ✅ Mainnet |
| Batch Transfers      | Multi-recipient payments   | ✅ Mainnet |
| Recurring Payments   | Automated subscriptions    | ✅ Mainnet |
| Payment Links        | Shareable URLs + QR        | ✅ Mainnet |

## Quick Start

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Development
pnpm --filter @exe-pay/web dev

# Tests
pnpm test
```

## Project Structure

```
├── apps/
│   ├── web/         # Next.js web interface
│   ├── docs/        # Documentation site
│   └── api/         # REST API server
├── packages/
│   ├── core/        # Core payment SDK
│   ├── privacy/     # Privacy features (stealth, proofs, view keys)
│   ├── react-hooks/ # React integration hooks
│   └── utils/       # Shared utilities
└── docs/            # Documentation
```

### Packages

| Package                | Description                                                                  |
| ---------------------- | ---------------------------------------------------------------------------- |
| `@exe-pay/core`        | Payment SDK with batch transfers, recurring payments, transaction management |
| `@exe-pay/privacy`     | Stealth addresses, payment proofs, subaddresses, view keys, scanning         |
| `@exe-pay/react-hooks` | React hooks: `useExePay()`, `useBatchPayment()`, `useRecurringPayment()`     |
| `@exe-pay/utils`       | Address validation, formatting, error handling                               |

### Cryptographic Primitives

- **X25519 ECDH** - Key exchange for stealth address generation
- **Keccak-256** - Key derivation and hashing
- **Ed25519** - Solana-native signatures
- **View Tags** - One-byte optimization for payment scanning
- **SHA-256** - View key derivation

### Privacy Model

**Protected:**

- Recipient identity (stealth addresses)
- Transaction linkability (subaddresses)
- IP addresses (RPC rotation)

**On-Chain:**

- Transaction amounts
- Sender addresses

**Future Enhancements:**

- Zero-knowledge proofs for amount privacy
- Ring signatures for sender mixing

### Security

All cryptographic operations use audited libraries:

- `@noble/curves` - Elliptic curve cryptography
- `@noble/hashes` - Cryptographic hashing
- `@solana/web3.js` - Solana integration

Stealth address implementation follows established cryptographic patterns from Monero, adapted for Solana's architecture.

## Development

### Prerequisites

- Node.js 20+
- pnpm 9.x
- Solana RPC endpoint

### Setup

```bash
# Install dependencies
pnpm install

# Build packages
pnpm build

# Run tests
pnpm test

# Start development
pnpm --filter @exe-pay/web dev
```

### Environment Configuration

Create `.env.local`:

```bash
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_KEY
NEXT_PUBLIC_LIGHT_RPC_URL=https://devnet.helius-rpc.com
```

See [RPC_SETUP.md](./RPC_SETUP.md) for detailed configuration.

## Contributing

Contributions are welcome. Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for planned features and development stages.

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Resources

- **Documentation:** [docs.exepay.app](https://docs.exepay.app)
- **Twitter:** [@exeinfra](https://x.com/exeinfra)
- **Issues:** [GitHub Issues](https://github.com/ExePayInfra/exe-pay/issues)

---

**Built for the Solana ecosystem** • [exepay.app](https://exepay.app)
