# exe-pay

`exe-pay` is a privacy-preserving payments SDK for Solana. This monorepo is powered by pnpm workspaces and Turborepo for fast builds, isolated packages, and reproducible developer environments.

## Repository layout

- `apps/` – executable applications and integration demos (API worker, demo web app).
- `packages/` – reusable libraries for interacting with Solana and privacy layers.
- `tooling/` – shared developer tooling, configuration, and scripts.

### Key packages

- `@exe-pay/core` – canonical TypeScript SDK that constructs shielded transfers.
- `@exe-pay/privacy` – pluggable primitives for Poseidon hashing and proof scaffolding (stubbed for now).
- `@exe-pay/utils` – shared helpers for Solana commitment mapping and async ergonomics.
- `@exe-pay/react-hooks` – ergonomic hooks for React dApps.

> **Security note**
>
> The zero-knowledge primitives in `@exe-pay/privacy` use deterministic stand-ins to preserve developer ergonomics in this offline demo environment. Swap them for audited circuits before mainnet deployment.

## Getting started

> **Prerequisites**
>
> - Node.js 20
> - [pnpm](https://pnpm.io/) (managed via `corepack enable`)
> - Access to a Solana RPC endpoint (local validator, devnet, or mainnet).

```bash
corepack enable pnpm
pnpm install
pnpm run dev
```

Individual packages expose their own README files with detailed usage and API documentation.

## License

Apache-2.0 © exe-pay contributors

