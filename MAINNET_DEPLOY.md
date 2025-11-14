# 🚀 Deploy ExePay to Mainnet

## Overview

This guide will help you switch from **Devnet (test)** to **Mainnet (real SOL)** for production use.

---

## ⚠️ IMPORTANT WARNINGS

1. **Mainnet uses REAL money** - transactions cost real SOL
2. **Test thoroughly on devnet first** - make sure everything works
3. **Start with small amounts** - don't risk large sums initially
4. **Keep your private keys safe** - never share them
5. **Audit your code** - consider a security audit before handling large volumes

---

## 📋 Step-by-Step Instructions

### Step 1: Update Environment Variables

Edit your `apps/web/.env.local` file:

```bash
# Change from devnet to mainnet-beta
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta

# Use Helius Mainnet RPC (recommended for production)
# Get your API key from: https://www.helius.dev/
NEXT_PUBLIC_SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_HELIUS_API_KEY

# Alternative: Use public mainnet RPC (may have rate limits)
# NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

### Step 2: Get a Mainnet RPC Endpoint

**Option A: Helius (Recommended)**
1. Go to https://www.helius.dev/
2. Sign up for a free account
3. Create a new project
4. Copy your **Mainnet** API key
5. Use: `https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY`

**Option B: QuickNode**
1. Go to https://www.quicknode.com/
2. Sign up and create a Solana Mainnet endpoint
3. Copy the HTTPS URL

**Option C: Public RPC (Not recommended for production)**
- `https://api.mainnet-beta.solana.com` (rate limited)

### Step 3: Update Vercel Environment Variables

If deploying to Vercel:

1. Go to https://vercel.com/dashboard
2. Select your `exe-pay` project
3. Go to **Settings** → **Environment Variables**
4. Add/Update:
   - `NEXT_PUBLIC_SOLANA_NETWORK` = `mainnet-beta`
   - `NEXT_PUBLIC_SOLANA_RPC_URL` = `https://mainnet.helius-rpc.com/?api-key=YOUR_KEY`
5. Click **Save**
6. Redeploy: `vercel --prod`

### Step 4: Test Locally First

```bash
# Restart your dev server
cd /Users/kingchief/Documents/EXE
pnpm --filter @exe-pay/web dev
```

Open http://localhost:3000 and verify:
- ✅ Wallet connects to mainnet
- ✅ Your mainnet balance shows correctly
- ✅ Transaction history loads (if you have mainnet transactions)

### Step 5: Test with a Small Transaction

1. **Connect your wallet** with a small amount of SOL (e.g., 0.01 SOL)
2. **Send a test payment** to yourself or a test address
3. **Verify on Solana Explorer**: https://explorer.solana.com/
4. **Check transaction history** in your app

### Step 6: Deploy to Production

```bash
# Deploy to Vercel
cd /Users/kingchief/Documents/EXE
vercel --prod
```

Or push to GitHub (if auto-deploy is enabled):
```bash
git add .
git commit -m "feat: switch to mainnet for production"
git push
```

---

## 🔍 Verification Checklist

After deploying to mainnet, verify:

- [ ] App loads without errors
- [ ] Wallet connects to mainnet (check network in Phantom)
- [ ] Correct RPC endpoint is being used (check browser console)
- [ ] Transaction history works (if you have mainnet txs)
- [ ] Can send a small test payment successfully
- [ ] Transaction appears on Solana Explorer
- [ ] No console errors or warnings

---

## 💰 Cost Considerations

### Transaction Fees on Mainnet
- **Basic transfer**: ~0.000005 SOL (~$0.0005)
- **Private transfer (Light Protocol)**: ~0.00001 SOL (~$0.001)
- **Batch transfer (10 recipients)**: ~0.00005 SOL (~$0.005)

### RPC Costs
- **Helius Free Tier**: 100,000 requests/month (plenty for starting out)
- **QuickNode**: $9/month for 40M credits
- **Public RPC**: Free but heavily rate-limited

---

## 🛡️ Security Best Practices

1. **Never commit `.env.local`** - it's in `.gitignore` for a reason
2. **Use environment variables** - never hardcode API keys
3. **Rotate API keys regularly** - especially if exposed
4. **Monitor RPC usage** - set up alerts for unusual activity
5. **Test with small amounts first** - don't risk large sums
6. **Keep dependencies updated** - `pnpm update` regularly
7. **Consider a security audit** - before handling large volumes

---

## 🐛 Troubleshooting

### "Failed to fetch" errors
- Check your RPC URL is correct
- Verify your Helius API key is valid
- Try a different RPC provider

### "Insufficient funds" errors
- Make sure your wallet has SOL for transaction fees
- Mainnet requires real SOL (not devnet SOL)

### Transactions not appearing
- Wait 30-60 seconds for finalization
- Check Solana Explorer: https://explorer.solana.com/
- Verify you're on the correct network (mainnet vs devnet)

### Rate limit errors
- Upgrade your Helius plan
- Switch to a paid RPC provider
- Implement request caching

---

## 📊 Monitoring (Optional)

Consider adding:
1. **Vercel Analytics** - track page views and performance
2. **Sentry** - error tracking and monitoring
3. **Custom logging** - track transaction success rates
4. **RPC monitoring** - track API usage and costs

---

## 🎯 Next Steps After Mainnet

1. ✅ Deploy to mainnet
2. 📹 Create demo video showing real transactions
3. 🐦 Launch on Twitter/Reddit
4. 💰 Apply for grants (with mainnet proof)
5. 👥 Get first users
6. 📈 Iterate based on feedback

---

## 🆘 Need Help?

- **Helius Docs**: https://docs.helius.dev/
- **Solana Docs**: https://docs.solana.com/
- **Light Protocol**: https://docs.lightprotocol.com/
- **ExePay GitHub**: https://github.com/ExePayInfra/exe-pay

---

**Ready to go live? Let's do this! 🚀**

