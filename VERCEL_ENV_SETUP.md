# Vercel Environment Variables Setup

## Required Configuration for Production

To enable payment proof verification on mainnet (exepay.app), you must configure environment variables in Vercel.

### Steps:

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project: `exe-pay` or `exepay-app`

2. **Navigate to Settings**
   - Click on `Settings` tab
   - Click on `Environment Variables` in the sidebar

3. **Add Required Variables**

   Add these three environment variables:

   | Name                         | Value                                                                          | Environment |
   | ---------------------------- | ------------------------------------------------------------------------------ | ----------- |
   | `NEXT_PUBLIC_SOLANA_NETWORK` | `mainnet-beta`                                                                 | Production  |
   | `NEXT_PUBLIC_SOLANA_RPC_URL` | `https://mainnet.helius-rpc.com/?api-key=9569e43b-fe58-46ac-8326-5b9d08475c0c` | Production  |
   | `NEXT_PUBLIC_LIGHT_RPC_URL`  | `https://devnet.helius-rpc.com`                                                | Production  |

   **Important Notes:**
   - Select `Production` for Environment
   - You can also add them to `Preview` and `Development` if needed
   - These are NEXT*PUBLIC* variables so they're exposed to the browser (this is expected)

4. **Redeploy**
   - After adding variables, trigger a new deployment:

   ```bash
   git commit --allow-empty -m "chore: trigger redeployment"
   git push origin main
   ```

   Or click "Redeploy" in Vercel dashboard

5. **Verify**
   - Visit https://exepay.app/privacy
   - Go to "Payment Proofs" tab
   - Select "Mainnet"
   - You should see green "✅ Custom mainnet RPC configured" banner

---

## Why This Is Needed

- **Public Mainnet RPC:** The default Solana mainnet RPC (`https://api.mainnet-beta.solana.com`) is heavily rate-limited (1 request/second)
- **Payment Proofs:** Require fetching transaction data from chain to verify authenticity
- **Helius RPC:** Provides 500k requests/day on free tier, sufficient for production use

---

## Alternative RPC Providers

If you prefer a different provider:

### QuickNode

1. Sign up: https://quicknode.com
2. Create Solana Mainnet endpoint
3. Use URL: `https://your-endpoint.quiknode.pro/YOUR_API_KEY/`

### Alchemy

1. Sign up: https://alchemy.com
2. Create Solana Mainnet app
3. Use URL: `https://solana-mainnet.g.alchemy.com/v2/YOUR_API_KEY`

### Triton (RPC Pool)

1. Sign up: https://triton.one
2. Get API key
3. Use URL: `https://your-region.rpcpool.com/YOUR_API_KEY`

---

## Security

- ✅ **Safe to expose:** NEXT*PUBLIC* variables are client-side and meant to be public
- ✅ **Rate limits:** Helius free tier has IP-based rate limiting
- ✅ **API key rotation:** If needed, generate new key and update in Vercel
- ⚠️ **Monitor usage:** Check Helius dashboard for usage stats

---

## Troubleshooting

### "Transaction not found"

- Ensure correct network is selected (Mainnet vs Devnet)
- Verify transaction signature is correct
- Check transaction exists on Solscan

### "403 Forbidden" or "Rate limit"

- Environment variable not set in Vercel
- Using public RPC instead of custom endpoint
- API key expired or invalid

### "Custom RPC not configured" warning

- Variables not saved in Vercel
- Redeployment not triggered after adding variables
- Variable name typo (must be exact: `NEXT_PUBLIC_SOLANA_RPC_URL`)

---

**Status:** Once configured, payment proofs will work seamlessly on mainnet! 🚀
