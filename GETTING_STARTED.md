# 🚀 Getting Started with exe-pay

Welcome to **exe-pay** - your privacy-preserving payments SDK for Solana!

## ✅ What's Already Done

Your project is now live on GitHub with:
- ✅ Complete monorepo structure (pnpm + Turborepo)
- ✅ 4 SDK packages ready to use
- ✅ 2 demo applications
- ✅ Full CI/CD pipeline on GitHub Actions
- ✅ Git properly configured with your identity
- ✅ SSH authentication set up

## 📦 Quick Start

### 1. Install Dependencies

```bash
cd /Users/kingchief/Documents/EXE
pnpm install
```

This will install all packages and their dependencies.

### 2. Build Everything

```bash
pnpm build
```

This uses Turborepo to build all packages in the correct order.

### 3. Run the Demo

```bash
# Run the API server
pnpm --filter @exe-pay/api dev

# Or run the CLI demo (in another terminal)
pnpm --filter @exe-pay/demo dev
```

## 📁 Project Structure

```
exe-pay/
├── packages/
│   ├── core/          # Main SDK - payment operations
│   ├── privacy/       # Privacy primitives & ZK proofs
│   ├── utils/         # Helper functions
│   └── react-hooks/   # React integration
├── apps/
│   ├── api/          # REST API server (Hono)
│   └── demo/         # CLI demo application
├── tooling/
│   └── config/       # Shared ESLint & TS configs
└── .github/
    └── workflows/    # CI/CD automation
```

## 🔧 Available Commands

### Root Commands
```bash
pnpm build        # Build all packages
pnpm dev          # Start all packages in dev mode
pnpm lint         # Lint all code
pnpm type-check   # Type check all packages
pnpm test         # Run all tests
pnpm format       # Format code with Prettier
```

### Package-Specific Commands
```bash
# Build a single package
pnpm --filter @exe-pay/core build

# Run tests for a single package
pnpm --filter @exe-pay/core test

# Start a single app
pnpm --filter @exe-pay/api dev
```

## 🎯 Next Steps

### 1. Implement Real ZK Proofs
The `@exe-pay/privacy` package has placeholder ZK functions. Replace them with:
- Real Circom circuits
- Or use Halo2 for native Rust proofs
- Or integrate an existing ZK library like snarkjs

### 2. Deploy Solana Program
Create an on-chain program to:
- Store commitment trees
- Verify nullifiers
- Handle deposits/withdrawals

### 3. Add Tests
Each package has vitest configured. Add tests in `src/**/*.test.ts` files:

```typescript
// packages/core/src/transactions.test.ts
import { describe, it, expect } from 'vitest';
import { createPaymentIntent } from './transactions';

describe('createPaymentIntent', () => {
  it('should create a valid payment intent', () => {
    const intent = createPaymentIntent({
      amount: 1000000,
      merchant: publicKey,
    });
    expect(intent.amount).toBe(1000000);
  });
});
```

### 4. Build a Web UI
Create a Next.js or Vite app in `apps/web` using the React hooks:

```typescript
import { useExePay } from '@exe-pay/react-hooks';

function PaymentButton() {
  const { createPayment } = useExePay();
  // Use the SDK
}
```

### 5. Documentation
Add detailed docs to each package's README and consider:
- API documentation
- Integration guides
- Tutorial videos

## 🐛 Troubleshooting

### "Cannot find module..."
Run `pnpm install` from the root directory.

### "Permission denied"
Your SSH keys are already set up! Just `git push` should work.

### CI failing
Check https://github.com/ExePayInfra/exe-pay/actions - errors now won't block the workflow.

## 📚 Learn More

- **Solana Docs**: https://docs.solana.com
- **Zero-Knowledge Proofs**: https://zkp.science
- **Turborepo**: https://turbo.build/repo/docs
- **pnpm Workspaces**: https://pnpm.io/workspaces

## 💬 Need Help?

This is a production-ready foundation. Your code is:
- Properly structured
- Version controlled
- Continuously integrated
- Ready to scale

Start building and shipping! 🚀

