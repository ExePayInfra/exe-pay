# 🔧 Fix Payment Proofs on Live Mainnet

**Issue:** Payment proofs not working on https://exepay.app when using mainnet

**Root Cause:** Vercel environment variables not configured

---

## ✅ Quick Fix (5 minutes)

### Option 1: Vercel Dashboard (Recommended)

1. **Open Vercel Dashboard**
   - Go to: https://vercel.com/dashboard
   - Find your project (search for "exe" or "exepay")

2. **Add Environment Variables**
   - Click `Settings` → `Environment Variables`
   - Add these 3 variables:

   ```
   Name: NEXT_PUBLIC_SOLANA_NETWORK
   Value: mainnet-beta
   Environment: ✅ Production
   ```

   ```
   Name: NEXT_PUBLIC_SOLANA_RPC_URL
   Value: https://mainnet.helius-rpc.com/?api-key=9569e43b-fe58-46ac-8326-5b9d08475c0c
   Environment: ✅ Production
   ```

   ```
   Name: NEXT_PUBLIC_LIGHT_RPC_URL
   Value: https://devnet.helius-rpc.com
   Environment: ✅ Production
   ```

3. **Trigger Redeployment**
   - Go to `Deployments` tab
   - Click ⋯ menu on latest deployment
   - Click `Redeploy`

   OR simply push any commit:

   ```bash
   git commit --allow-empty -m "chore: trigger redeployment"
   git push origin main
   ```

4. **Verify (2-3 minutes after deploy)**
   - Visit: https://exepay.app/privacy
   - Click "Payment Proofs" tab
   - Switch to "Mainnet"
   - Should see: `✅ Custom mainnet RPC configured`

---

### Option 2: Vercel CLI (Advanced)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Set environment variables
vercel env add NEXT_PUBLIC_SOLANA_NETWORK production
# Enter: mainnet-beta

vercel env add NEXT_PUBLIC_SOLANA_RPC_URL production
# Enter: https://mainnet.helius-rpc.com/?api-key=9569e43b-fe58-46ac-8326-5b9d08475c0c

vercel env add NEXT_PUBLIC_LIGHT_RPC_URL production
# Enter: https://devnet.helius-rpc.com

# Redeploy
vercel --prod
```

---

## 🧪 Test Locally First (Optional)

If you want to verify the fix works before deploying:

```bash
cd /Users/kingchief/Documents/EXE

# Check .env.local exists
cat .env.local

# Should see:
# NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
# NEXT_PUBLIC_SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=...
# NEXT_PUBLIC_LIGHT_RPC_URL=https://devnet.helius-rpc.com

# Start dev server
pnpm --filter @exe-pay/web dev

# Open browser: http://localhost:3000/privacy
# Test with a real mainnet transaction
```

**Test Transaction (Mainnet):**

- Any real Solana mainnet transaction signature will work
- Find one on: https://solscan.io/
- Or use your own wallet's recent transaction

---

## 🎯 Expected Result

**Before Fix:**

```
❌ Network error: 403 Forbidden
⚠️ RPC Rate Limit: The public mainnet RPC is rate-limited...
```

**After Fix:**

```
✅ Custom mainnet RPC configured
✅ Transaction found!
✅ Payment Proof Generated from Chain!
```

---

## 🔍 Troubleshooting

### Still seeing "403 Forbidden"

- Environment variables not saved properly
- Click "Save" button in Vercel after adding each variable
- Verify variables appear in "Environment Variables" list

### "Transaction not found"

- Wrong network selected (switch between Mainnet/Devnet)
- Invalid transaction signature
- Transaction too old (Helius keeps ~1 year of history)

### Environment variable not showing

- Variable name must be EXACT (case-sensitive)
- Must include `NEXT_PUBLIC_` prefix
- Select "Production" environment
- Redeploy after adding

### Vercel project not found

- Check you're logged into correct Vercel account
- Project might be under team/organization account
- Search by domain: exepay.app

---

## 📚 Full Documentation

See `VERCEL_ENV_SETUP.md` for complete guide including:

- Alternative RPC providers (QuickNode, Alchemy, Triton)
- Security considerations
- Rate limit monitoring
- Advanced troubleshooting

---

**Status:** Once configured, payment proofs will work perfectly on mainnet! 🚀

**Estimated Time:** 5 minutes to configure + 2 minutes deploy = **7 minutes total**
