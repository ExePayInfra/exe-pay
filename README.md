# ExePay

**Privacy-First Payment Infrastructure for Solana**

Production-ready payment SDK with Monero-level recipient privacy, cryptographic payment proofs, and enterprise-grade transaction management.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://exepay.app)
[![Documentation](https://img.shields.io/badge/docs-online-blue)](https://docs.exepay.app)
[![License](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Mainnet](https://img.shields.io/badge/network-mainnet-success)](https://solana.com)

---

## 🔐 Privacy Infrastructure

**Production-ready cryptographic privacy on Solana mainnet:**

| Feature | Technology | Status |
|---------|------------|--------|
| 🔐 Stealth Addresses | X25519 ECDH + Keccak-256 | ✅ Mainnet |
| 📝 Payment Proofs | Cryptographic verification | ✅ Mainnet |
| 🔗 Integrated Addresses | Payment ID embedding | ✅ Mainnet |
| 🔢 Subaddresses | BIP32-derived identities | ✅ Mainnet |
| 🌐 RPC Privacy | Multi-endpoint rotation | ✅ Mainnet |

**Technical Achievement:** Monero-level recipient privacy with Solana's sub-second finality.

---

## ✨ Features

### **Privacy Features (Mainnet Ready)**

- 🔐 **Stealth Addresses** - Monero-inspired one-time addresses with X25519 ECDH encryption
- 📝 **Payment Proofs** - Cryptographic proofs for disputes, audits, and tax reporting
- 🔗 **Integrated Addresses** - Payment ID tracking for invoices and orders
- 🔢 **Subaddresses** - Multiple stealth identities from one wallet (BIP32-like derivation)
- ⚡ **Enhanced Scanning** - 99% faster payment detection with view tags
- 🌐 **RPC Privacy** - IP hiding via automatic endpoint rotation

### **Payment Infrastructure**

- 💸 **Multi-Token Support** - SOL, USDC, USDT, BONK, JUP, RAY, ORCA
- 📦 **Batch Transfers** - Send to multiple recipients efficiently
- 🔄 **Recurring Payments** - Automated subscriptions with flexible schedules
- 🔗 **Payment Links** - Shareable payment URLs with QR codes
- 📜 **Transaction History** - Complete payment tracking and analytics

### **Developer Experience**

- 🎣 **React Hooks** - Simple integration with `useExePay()`, `useBatchPayment()`, `useRecurringPayment()`
- 📦 **TypeScript First** - Full type safety with comprehensive interfaces
- 🏗️ **Monorepo Architecture** - Turborepo + pnpm for optimal builds
- 📚 **Complete Documentation** - API reference, guides, and examples
- 🧪 **Production Tested** - Battle-tested on Solana mainnet

### **User Experience**

- 🎨 **Modern UI** - Clean, responsive design with smooth transitions
- 📱 **Mobile Optimized** - Works perfectly on all devices
- 🔔 **Real-time Updates** - Transaction status and notifications
- 🌐 **Multi-Wallet** - Phantom, Solflare, Coinbase, Trust, Torus, Ledger

---

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run the web app
pnpm --filter @exe-pay/web dev
```

Visit [http://localhost:3000](http://localhost:3000) to see it in action!

---

## 📦 Project Structure

Monorepo powered by **pnpm workspaces** and **Turborepo** for fast, efficient builds.

```
├── apps/                    # Applications
│   ├── web/                # Next.js web app (main UI)
│   ├── docs/               # Documentation site
│   ├── api/                # REST API server
│   └── demo/               # CLI demo
├── packages/               # Reusable packages
│   ├── core/               # Payment SDK
│   ├── privacy/            # Privacy features
│   ├── react-hooks/        # React integration
│   └── utils/              # Shared utilities
└── docs/                   # Documentation markdown
```

### Core Packages

| Package                | Description                                                                             |
| ---------------------- | --------------------------------------------------------------------------------------- |
| `@exe-pay/core`        | Core payment SDK with batch transfers, recurring payments, and transaction management |
| `@exe-pay/privacy`     | Privacy features: stealth addresses, payment proofs, subaddresses, scanning, RPC privacy |
| `@exe-pay/utils`       | Utility functions for address validation, formatting, and helpers                      |
| `@exe-pay/react-hooks` | React hooks for payments, batch transfers, and subscriptions                            |

### Applications

| App             | Description            | Status                                                                           |
| --------------- | ---------------------- | -------------------------------------------------------------------------------- |
| `@exe-pay/web`  | Next.js web interface  | ✅ [Live](https://exe-payments-dgfolqpcm-exechainlink-5881s-projects.vercel.app) |
| `@exe-pay/api`  | REST API server (Hono) | ✅ Ready                                                                         |
| `@exe-pay/demo` | CLI demo application   | ✅ Ready                                                                         |

---

## 📚 Documentation

**📖 [Official Documentation](https://docs.exepay.app)** - Complete guides, API reference, and examples

### Quick Links:

- **[Installation Guide](https://docs.exepay.app/guide/installation)** - Get started in 5 minutes
- **[Quick Start](https://docs.exepay.app/guide/quick-start)** - Send your first payment
- **[Privacy Modes](https://docs.exepay.app/guide/privacy-modes)** - Public, Shielded, Private explained
- **[Code Examples](https://docs.exepay.app/examples)** - Real-world code snippets
- **[API Reference](https://docs.exepay.app/api)** - Full SDK documentation

### Local Documentation:

- **[Features Guide](./docs/FEATURES.md)** - Complete feature overview
- **[Deployment Guide](./docs/guides/DEPLOY_TO_VERCEL.md)** - Deploy to Vercel
- **[Mainnet Guide](./docs/guides/MAINNET_DEPLOY.md)** - Production deployment

---

## 💡 Usage Examples

### Stealth Address Payment

```typescript
import { generateStealthMetaAddress, generateStealthAddress, encodeStealthMetaAddress } from "@exe-pay/privacy";

// Recipient generates meta-address (one-time setup)
const metaAddress = await generateStealthMetaAddress(recipientKeypair);
const encoded = encodeStealthMetaAddress(metaAddress);
// Share: stealth:SPENDING_KEY:VIEWING_KEY

// Sender generates one-time payment address
const { stealthAddress, ephemeralPubkey, viewTag } = generateStealthAddress(metaAddress);
// Send SOL to stealthAddress - recipient can scan and claim!
```

### Generate Payment Proof

```typescript
import { generatePaymentProof, encodePaymentProof } from "@exe-pay/privacy";

// Generate cryptographic proof of payment
const proof = await generatePaymentProof({
  txSignature: "...",
  ephemeralPrivkey: ephemeralPrivateKey,
  amount: 1000000,
  recipientMetaAddress: metaAddress,
});

// Share proof for disputes or audits
const encoded = encodePaymentProof(proof);
```

### Integrated Address (Invoice Tracking)

```typescript
import { generateIntegratedAddress, encodeIntegratedAddress } from "@exe-pay/privacy";

// Generate address with payment ID
const integrated = generateIntegratedAddress(metaAddress, "invoice-12345");
const encoded = encodeIntegratedAddress(integrated);
// Share with customer - payment will include invoice ID
```

### Subaddresses (Multiple Identities)

```typescript
import { generateSubaddress } from "@exe-pay/privacy";

// Generate different identities from one wallet
const businessAddress = await generateSubaddress(masterKeypair, 0, "Business");
const personalAddress = await generateSubaddress(masterKeypair, 1, "Personal");
// Each subaddress is cryptographically independent
```

See [documentation](https://docs.exepay.app) for complete guides!

---

## 🔒 Privacy & Security

### Cryptographic Primitives

- ✅ **X25519 ECDH** - Elliptic curve Diffie-Hellman for secure key exchange
- ✅ **Keccak-256** - Industry-standard cryptographic hashing for key derivation
- ✅ **Ed25519** - Solana-native signatures and keypairs
- ✅ **View Tags** - One-byte tags for 99% faster payment scanning
- ✅ **BIP32-like Derivation** - Hierarchical deterministic key generation

### Privacy Capabilities

**Recipient Privacy:** Stealth addresses hide payment recipients using ECDH key exchange
- ✅ **Protected**: Recipient identity, transaction linkability, IP addresses
- ⚠️ **On-Chain**: Transaction amounts, sender addresses
- **Future**: Zero-knowledge proofs for amount privacy, ring signatures for sender mixing

### Security Best Practices

> **Mainnet Ready**: All cryptographic operations use battle-tested libraries (@noble/curves, @noble/hashes). Stealth address implementation follows Monero's proven design patterns.

> **Testing**: Verify your integration on devnet before mainnet deployment. See our [Development Guide](./DEVELOPMENT.md) for best practices.

## 🛠️ Development

### Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/) 9.x
- Solana RPC endpoint (devnet or mainnet)

### Setup

```bash
# Enable pnpm
corepack enable pnpm

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint
```

### Run Applications

```bash
# Web app (Next.js)
pnpm --filter @exe-pay/web dev

# API server
pnpm --filter @exe-pay/api dev

# CLI demo
pnpm --filter @exe-pay/demo start
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT © ExePay Contributors

See [LICENSE](./LICENSE) for details.

---

## 🌟 Acknowledgments

- [Light Protocol](https://lightprotocol.com) - ZK compression infrastructure
- [Solana](https://solana.com) - High-performance blockchain
- [Turborepo](https://turbo.build) - Monorepo build system

---

## 📞 Support

- **Documentation**: [docs.exepay.app](https://docs.exepay.app)
- **GitHub Issues**: [Report a bug](https://github.com/ExePayInfra/exe-pay/issues)
- **Twitter/X**: [@exeinfra](https://x.com/exeinfra)
- **Email**: contact@exepay.app

---

## 🎯 Roadmap

### ✅ Production Features

**Advanced Privacy:**
- ✅ Payment Proofs - Cryptographic proof generation
- ✅ Integrated Addresses - Payment ID tracking
- ✅ Subaddresses - Multiple stealth identities
- ✅ Enhanced Scanning - View tag optimization
- ✅ RPC Privacy - IP address hiding

**Core Infrastructure:**
- ✅ Stealth Addresses - Mainnet ready
- ✅ Batch Payments - Multi-recipient transfers
- ✅ Recurring Payments - Subscription management
- ✅ Payment Links & QR codes
- ✅ Multi-wallet support (6 wallets)
- ✅ Professional UI/UX

### 🚀 Planned Enhancements

- 🔒 **Amount Privacy** - Zero-knowledge proofs for hidden amounts
- 🌀 **Sender Mixing** - Pool-based sender anonymity
- 📊 **Analytics Dashboard** - Transaction insights and reporting
- 📱 **Mobile PWA** - Progressive web app with offline support
- 🏢 **Enterprise API** - White-label solutions

**See [ROADMAP.md](./ROADMAP.md) for the complete development plan.**

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

---

**Built for the Solana ecosystem** • [exepay.app](https://exepay.app)
