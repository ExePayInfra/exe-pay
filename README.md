# 🔐 ExePay

**Privacy-preserving payments SDK for Solana** powered by [Light Protocol](https://lightprotocol.com).

Build private, efficient, and scalable payment applications with zero-knowledge proofs and compressed accounts.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://exe-payments-nki63him5-exechainlink-5881s-projects.vercel.app)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)]()
[![Progress](https://img.shields.io/badge/progress-100%25-success)]()

---

## 📊 **Project Status: 100% Complete!** 🎉

**Development Timeline:** 2 weeks  
**Total Commits:** 60+  
**Lines of Code:** 6,000+  
**Packages:** 5 working  
**Features:** 10+ live on production  

**Live Demo:** [https://exe-payments-nki63him5-exechainlink-5881s-projects.vercel.app](https://exe-payments-nki63him5-exechainlink-5881s-projects.vercel.app)

---

## ✨ Features

### **Core Functionality:**
- 🔐 **3-Level Privacy** - Public, Shielded (amount hidden), Private (fully anonymous)
- 💸 **Multi-Token Support** - SOL, USDC, USDT, BONK, JUP
- 📦 **Batch Transfers** - Send to multiple recipients in one transaction
- 🔄 **Recurring Payments** - Subscriptions with pause/resume/cancel
- 📜 **Transaction History** - View and track all payments
- 🔗 **Payment Links** - Shareable URLs for payment requests
- 📱 **QR Codes** - Generate and scan for easy payments

### **Developer Experience:**
- ⚡ **Light Protocol Integration** - Production-ready ZK compression
- 🎣 **React Hooks** - One-line integration (`usePrivatePayment()`)
- 📦 **TypeScript SDK** - Full type safety
- 🏗️ **Monorepo Architecture** - Turborepo + pnpm workspaces
- 📚 **Comprehensive Docs** - API reference, guides, examples

### **User Experience:**
- 🎨 **Beautiful UI** - Coinbase-inspired design
- 📖 **Educational Content** - "How It Works" section
- 🛡️ **Trust Indicators** - Technology badges
- 📱 **Mobile Optimized** - Responsive on all devices
- ⚡ **Fast & Smooth** - Animations and loading states

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

| Package | Description |
|---------|-------------|
| `@exe-pay/core` | TypeScript SDK with batch transfers, recurring payments, and Light Protocol integration |
| `@exe-pay/privacy` | Zero-knowledge proof generation using Light Protocol |
| `@exe-pay/utils` | Shared helpers for Solana and async operations |
| `@exe-pay/react-hooks` | React hooks for payments, batch transfers, and subscriptions |

### Applications

| App | Description | Status |
|-----|-------------|--------|
| `@exe-pay/web` | Next.js web interface | ✅ [Live](https://exe-payments-dgfolqpcm-exechainlink-5881s-projects.vercel.app) |
| `@exe-pay/api` | REST API server (Hono) | ✅ Ready |
| `@exe-pay/demo` | CLI demo application | ✅ Ready |

---

## 📚 Documentation

- **[Features Guide](./FEATURES.md)** - Complete feature overview with examples
- **[API Reference](./API.md)** - Full API documentation
- **[Getting Started](./GETTING_STARTED.md)** - Setup and installation guide
- **[Deployment Guide](./DEPLOY.md)** - Deploy to Vercel
- **[MVP Guide](./MVP_GUIDE.md)** - Build production-ready applications

---

## 💡 Usage Examples

### Simple Payment

```typescript
import { ExePayClient } from '@exe-pay/core';

const client = new ExePayClient({
  clusterUrl: 'https://api.mainnet-beta.solana.com'
});

const intent = client.createIntent({
  amount: 1000000,
  merchant: merchantPublicKey,
  memo: 'Private payment'
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
    { address: recipient3, amount: 1500000 }
  ]
});

const payment = await client.buildBatch(batchIntent);
await client.settleBatch(payment, signer);
```

### Recurring Payment

```typescript
import { createRecurringSchedule, initializeRecurringState } from '@exe-pay/core';

const schedule = createRecurringSchedule({
  merchant: merchantPublicKey,
  amount: 5000000,
  interval: 'monthly',
  maxPayments: 12
});

const state = initializeRecurringState(schedule);
```

See [FEATURES.md](./FEATURES.md) for more examples!

---

## 🔒 Security

- ✅ **Light Protocol Integration** - Audited ZK compression
- ✅ **Zero-Knowledge Proofs** - Complete transaction privacy
- ✅ **Compressed Accounts** - Reduced on-chain footprint
- ✅ **Nullifier Protection** - Prevents double-spending

> **Note**: This SDK uses Light Protocol for production-ready privacy. Always test on devnet before mainnet deployment.

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

Apache-2.0 © ExePay Contributors

---

## 🌟 Acknowledgments

- [Light Protocol](https://lightprotocol.com) - ZK compression infrastructure
- [Solana](https://solana.com) - High-performance blockchain
- [Turborepo](https://turbo.build) - Monorepo build system

---

## 📞 Support

- **Documentation**: [Full Docs](./FEATURES.md)
- **GitHub Issues**: [Report a bug](https://github.com/ExePayInfra/exe-pay/issues)
- **Discord**: Join our community
- **Twitter**: [@ExePayInfra](https://twitter.com/ExePayInfra)

---

**Built with ❤️ for the Solana ecosystem**

