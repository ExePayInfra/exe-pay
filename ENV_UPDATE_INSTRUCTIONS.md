# Environment Configuration Update for Production

## CRITICAL: Update .env.local Before Deployment

### Current Configuration (Devnet):
```
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_LIGHT_RPC_URL=https://api.devnet.solana.com
```

### Required Configuration (Mainnet):
```
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_LIGHT_RPC_URL=https://api.mainnet-beta.solana.com
```

## Steps:

1. Open `.env.local` in your editor
2. Change `devnet` to `mainnet-beta`
3. Change all URLs from `api.devnet.solana.com` to `api.mainnet-beta.solana.com`
4. Save the file
5. Restart the dev server: `pnpm dev`
6. Test locally with real mainnet SOL (small amounts!)

## Also Update:
`apps/web/.env.local` with the same changes

