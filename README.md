# ExePay

**Privacy-First Payment Infrastructure for Solana**

A production-ready SDK enabling private, efficient, and scalable payment applications using zero-knowledge proofs and Light Protocol's compressed accounts.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://exepay.app)
[![Documentation](https://img.shields.io/badge/docs-online-blue)](https://docs.exepay.app)
[![License](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Mainnet](https://img.shields.io/badge/network-mainnet-success)](https://solana.com)

---

## ✨ Features

### **Core Functionality:**

- 🔐 **Multi-Level Privacy** - Public, Light Protocol (ZK compression), Stealth Addresses (Monero-inspired)
- 🎭 **Stealth Addresses** - One-time payment addresses with X25519 ECDH encryption (MAINNET READY)
- 💸 **Multi-Token Support** - SOL, USDC, USDT, BONK, JUP, RAY, ORCA
- 📦 **Batch Transfers** - Send to multiple recipients efficiently
- 🔄 **Recurring Payments** - Automated subscriptions with full control
- 📜 **Transaction History** - Complete payment tracking and analytics
- 🔗 **Payment Links** - Shareable payment URLs with QR codes
- 📱 **QR Code Scanner** - Instant payment processing

### **Developer Experience:**

- ⚡ **Light Protocol Integration** - Production-ready ZK compression (Beta on devnet)
- 🔒 **Stealth Address SDK** - Complete privacy implementation with payment scanning and claiming
- 🎣 **React Hooks** - Simple integration with `useExePay()`, `useBatchPayment()`, `useRecurringPayment()`
- 📦 **TypeScript SDK** - Full type safety with comprehensive interfaces
- 🏗️ **Monorepo Architecture** - Turborepo + pnpm for optimal developer experience
- 📚 **Comprehensive Docs** - API reference, integration guides, and real-world examples

### **User Experience:**

- 🎨 **Professional UI** - Modern, responsive design with smooth page transitions
- 📖 **Educational Content** - Clear explanations of privacy modes and features
- 🛡️ **Trust Indicators** - Built on Light Protocol's audited infrastructure
- 📱 **Mobile Optimized** - Fully responsive across all devices
- ⚡ **Fast & Smooth** - Dynamic rendering for optimal performance
- 🔔 **Smart Notifications** - Non-intrusive transaction status updates

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

## 📦 Packages

This monorepo is powered by pnpm workspaces and Turborepo for fast builds, isolated packages, and reproducible developer environments.

## Repository layout

- `apps/` – executable applications and integration demos
  - `api/` – REST API server (Hono)
  - `demo/` – CLI demo application
  - `web/` – 🆕 Next.js web interface with Solana wallet integration
- `packages/` – reusable libraries for interacting with Solana and privacy layers
- `tooling/` – shared developer tooling, configuration, and scripts

### Core Packages

| Package                | Description                                                                             |
| ---------------------- | --------------------------------------------------------------------------------------- |
| `@exe-pay/core`        | TypeScript SDK with batch transfers, recurring payments, and Light Protocol integration |
| `@exe-pay/privacy`     | Zero-knowledge proof generation using Light Protocol                                    |
| `@exe-pay/utils`       | Shared helpers for Solana and async operations                                          |
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

### Simple Payment

```typescript
import { ExePayClient } from "@exe-pay/core";

const client = new ExePayClient({
  clusterUrl: "https://api.mainnet-beta.solana.com",
});

const intent = client.createIntent({
  amount: 1000000,
  merchant: merchantPublicKey,
  memo: "Private payment",
});

const payment = await client.build(intent, { feePayer: payerPublicKey });
const result = await client.settle(payment, signer);
```

### Batch Payment

```typescript
const batchIntent = client.createBatchIntent({
  recipients: [
    { address: recipient1, amount: 1000000 },
    { address: recipient2, amount: 2000000 },
    { address: recipient3, amount: 1500000 },
  ],
});

const payment = await client.buildBatch(batchIntent);
await client.settleBatch(payment, signer);
```

### Recurring Payment

```typescript
import { createRecurringSchedule, initializeRecurringState } from "@exe-pay/core";

const schedule = createRecurringSchedule({
  merchant: merchantPublicKey,
  amount: 5000000,
  interval: "monthly",
  maxPayments: 12,
});

const state = initializeRecurringState(schedule);
```

See [FEATURES.md](./docs/FEATURES.md) for more examples!

---

## 🔒 Security & Privacy

### Production-Ready Privacy

- ✅ **Stealth Addresses** - Monero-inspired one-time addresses (LIVE on mainnet)
- ✅ **Light Protocol Integration** - Audited ZK compression infrastructure (Beta on devnet)
- ✅ **Zero-Knowledge Proofs** - Cryptographically proven transaction privacy
- ✅ **X25519 ECDH** - Elliptic curve Diffie-Hellman for secure key exchange
- ✅ **Keccak-256 Hashing** - Industry-standard cryptographic hashing
- ✅ **Multi-Wallet Support** - Phantom, Solflare, Coinbase, Trust, Torus, Ledger

### Best Practices

> **Production Ready**: This SDK integrates Light Protocol's audited privacy infrastructure for mainnet deployment. All cryptographic operations are battle-tested and production-grade.

> **Testing**: Always verify your integration on devnet before deploying to mainnet. See our [Mainnet Deployment Guide](./docs/guides/MAINNET_DEPLOY.md) for best practices.

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

View our [complete 2026 roadmap](./ROADMAP_2026.md) for upcoming features and strategic development plan.

### Current (Q4 2025)

- ✅ **Stealth Addresses** - Mainnet ready with full claiming functionality
- ✅ **Batch Payments** - Optimized for SOL and SPL tokens
- ✅ **Recurring Payments** - Production ready with flexible schedules
- ✅ **Payment Links** - Shareable URLs with QR code generation
- ✅ **Multi-wallet support** - 6 major wallets integrated
- ✅ **Professional UI/UX** - Modern, responsive, mobile-optimized design
- ✅ **Dynamic Rendering** - Optimized for wallet-dependent pages

### Q1 2026 (Next 90 Days)

- 🚀 **Light Protocol Mainnet** - Full ZK compression on mainnet
- 🔐 **On-Chain Encrypted Keys** - Multi-device stealth payment access
- 📱 **Mobile PWA** - Progressive Web App with offline support
- 📊 **Analytics Dashboard** - Transaction insights and reporting

### Q2-Q4 2026

- 📱 **Native Mobile Apps** - iOS and Android applications
- 🔐 **Hardware Wallets** - Ledger and Trezor integration
- 🌐 **Multi-Chain** - Ethereum, Polygon, and Layer 2 support
- 🏢 **Enterprise Features** - White-label solutions and compliance tools

**See [ROADMAP.md](./ROADMAP.md) for the complete 2026 development plan.**

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

---

**Built for the Solana ecosystem** • [exepay.app](https://exepay.app)
