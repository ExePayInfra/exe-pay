# Mainnet RPC Setup (Required for Payment Proofs)

The public Solana mainnet RPC (`https://api.mainnet-beta.solana.com`) is heavily rate-limited and will return 403 errors. To verify mainnet transactions and payment proofs, you need a custom RPC endpoint.

## Quick Setup (2 minutes)

### Step 1: Get Free Helius RPC
1. Go to **https://helius.dev**
2. Sign up (free)
3. Create a new project
4. Copy your API key

### Step 2: Create Environment File
In the project root (`/Users/kingchief/Documents/EXE/`), create a file named `.env.local`:

```bash
# Create the file
touch .env.local
```

### Step 3: Add RPC Configuration
Add this content to `.env.local`:

```bash
# Solana Network
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta

# Your Helius RPC (replace YOUR_API_KEY)
NEXT_PUBLIC_SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY

# Light Protocol (optional, for ZK features)
NEXT_PUBLIC_LIGHT_RPC_URL=https://devnet.helius-rpc.com
```

**Replace `YOUR_API_KEY` with your actual Helius API key!**

### Step 4: Restart Dev Server
```bash
pkill -9 -f "next-server"
cd apps/web && pnpm dev
```

## Alternative RPC Providers

### QuickNode (300k requests/day free)
```bash
NEXT_PUBLIC_SOLANA_RPC_URL=https://YOUR_ENDPOINT.quiknode.pro/YOUR_KEY/
```
Get it: https://quicknode.com

### Alchemy (Generous free tier)
```bash
NEXT_PUBLIC_SOLANA_RPC_URL=https://solana-mainnet.g.alchemy.com/v2/YOUR_KEY
```
Get it: https://alchemy.com

## Verify Setup

1. Start dev server
2. Go to `http://localhost:3000/payment-proofs`
3. Select **Mainnet**
4. You should see: **"✅ Custom mainnet RPC configured"**
5. Try your transaction: `4rJTygQovMZQi1GGwLavTMgqeSXzaZZbhyBVbsV9kGZsCZLX8hbxKRTdA2BkZ8ECPj3d474K6DcDsFEv5ZeHwM8P`

## Troubleshooting

**Still getting 403 errors?**
- Check API key is correct (no typos)
- Verify `.env.local` is in the project root
- Restart dev server completely
- Check console for RPC URL being used

**Transaction still not found?**
- Verify signature is correct
- Try on Solscan: https://solscan.io/tx/YOUR_SIGNATURE
- Check if transaction is actually on mainnet (not devnet)

## For Production/Deployment

Add the same environment variables to your Vercel/hosting platform:
- Go to Project Settings → Environment Variables
- Add `NEXT_PUBLIC_SOLANA_RPC_URL` with your Helius/QuickNode URL
- Redeploy

