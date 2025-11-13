# exe-pay API

Reference server that exposes an HTTP interface for building shielded payment payloads.

```bash
pnpm install
pnpm --filter @exe-pay/api dev
```

Endpoints:

- `GET /health` – service status.
- `POST /payments` – builds payment instructions for a provided merchant/amount payload.

