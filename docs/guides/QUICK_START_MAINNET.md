# ⚡ Quick Start: Deploy to Mainnet

**Want to go live with real SOL in 5 minutes? Follow these steps:**

---

## 🚀 Option 1: Automated Script (Easiest)

```bash
# Run the network switcher
./scripts/switch-network.sh

# Select option 2 (Mainnet)
# Enter your Helius mainnet RPC URL when prompted

# Restart dev server
pnpm --filter @exe-pay/web dev

# Test locally, then deploy
vercel --prod
```

---

## 🛠️ Option 2: Manual Setup

### Step 1: Get a Mainnet RPC

Go to **https://www.helius.dev/** and:
1. Sign up (free)
2. Create a new project
3. Copy your **Mainnet** API key

### Step 2: Update `.env.local`

```bash
# Edit apps/web/.env.local
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY
```

### Step 3: Test Locally

```bash
# Restart dev server
pnpm --filter @exe-pay/web dev

# Open http://localhost:3000
# Connect your wallet (make sure it's on mainnet!)
# Send a small test transaction (0.01 SOL)
```

### Step 4: Deploy to Vercel

```bash
# Update Vercel environment variables
vercel env add NEXT_PUBLIC_SOLANA_NETWORK
# Enter: mainnet-beta

vercel env add NEXT_PUBLIC_SOLANA_RPC_URL
# Enter: https://mainnet.helius-rpc.com/?api-key=YOUR_KEY

# Deploy
vercel --prod
```

---

## ✅ Verification

After deploying, check:

1. **Open your live URL** (from Vercel)
2. **Connect wallet** - should show mainnet
3. **Check balance** - should show real SOL
4. **Send 0.001 SOL** to yourself
5. **Verify on Explorer**: https://explorer.solana.com/

---

## ⚠️ Important Notes

- **Start with small amounts** (0.001 - 0.01 SOL)
- **Test thoroughly** before handling large sums
- **Keep your Helius API key secret** - never commit it
- **Monitor your RPC usage** on Helius dashboard

---

## 🆘 Troubleshooting

**"Insufficient funds"**
- Make sure you have SOL in your mainnet wallet
- Transaction fees are ~0.000005 SOL

**"Rate limit exceeded"**
- Check your Helius dashboard
- Free tier: 100,000 requests/month
- Upgrade if needed

**"Wrong network"**
- Make sure Phantom is on mainnet (not devnet)
- Check the network indicator in your wallet

---

## 📚 Full Guide

For detailed instructions, see: **MAINNET_DEPLOY.md**

---

**Ready to go live? You got this! 🚀**

