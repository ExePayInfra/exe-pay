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

- 🔐 **Multi-Level Privacy** - Public, Light Protocol (ZK compression), Stealth Addresses (Monero-style)
- 🎭 **Stealth Addresses** - Unique one-time addresses for maximum privacy (LIVE!)
- 💸 **Multi-Token Support** - SOL, USDC, USDT, BONK, JUP
- 📦 **Batch Transfers** - Send to multiple recipients in one transaction
- 🔄 **Recurring Payments** - Subscriptions with pause/resume/cancel
- 📜 **Transaction History** - View and track all payments
- 🔗 **Payment Links** - Shareable URLs for payment requests
- 📱 **QR Codes** - Generate and scan for easy payments

### **Developer Experience:**

- ⚡ **Light Protocol Integration** - ZK compression for on-chain privacy
- 🔒 **Stealth Address SDK** - Complete implementation with scanning and claiming
- 🎣 **React Hooks** - One-line integration (`usePrivatePayment()`)
- 📦 **TypeScript SDK** - Full type safety
- 🏗️ **Monorepo Architecture** - Turborepo + pnpm workspaces
- 📚 **Comprehensive Docs** - API reference, guides, examples

### **User Experience:**

- 🎨 **Professional UI** - Modern, clean design with smooth animations
- 📖 **Educational Content** - Clear explanations of privacy features
- 🛡️ **Trust Indicators** - Built on audited protocols
- 📱 **Mobile Optimized** - Responsive on all devices
- ⚡ **Fast & Smooth** - Optimized performance and UX

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

- ✅ **Light Protocol Integration** - Audited ZK compression infrastructure
- ✅ **Zero-Knowledge Proofs** - Mathematically proven transaction privacy
- ✅ **Compressed Accounts** - 90% cost reduction with maintained privacy
- ✅ **Nullifier Protection** - Cryptographic double-spend prevention
- ✅ **Multi-Wallet Support** - Phantom, Solflare, Coinbase, Trust Wallet

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

- ✅ **Stealth Addresses** - Live on mainnet
- ✅ **Batch Payments** - Fully functional
- ✅ **Recurring Payments** - Production ready
- ✅ **Payment Links** - With QR codes
- ✅ **Multi-wallet support** - 6 wallets integrated
- ✅ **Professional UI/UX** - Modern, responsive design

### Q1 2026

- 🚀 Light Protocol mainnet integration
- 📱 Mobile PWA optimization
- 📊 Advanced analytics dashboard

### Beyond

- 📱 Native mobile apps (iOS/Android)
- 🔐 Hardware wallet support (Ledger, Trezor)
- 🌐 Multi-chain expansion (Ethereum, Polygon)
- 🏢 Enterprise features

**See [ROADMAP_2026.md](./ROADMAP_2026.md) for complete plan.**

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

---

**Built for the Solana ecosystem** • [exepay.app](https://exepay.app)
