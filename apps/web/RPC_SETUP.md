# 🚀 RPC Setup Guide

This guide will help you set up a dedicated Solana RPC endpoint for better performance and reliability.

## Why Use a Dedicated RPC?

The public Solana RPC endpoints (`api.devnet.solana.com` and `api.mainnet-beta.solana.com`) have strict rate limits and can be slow or unreliable. A dedicated RPC provider gives you:

- ✅ **Higher rate limits** - 100k+ requests per month on free tiers
- ✅ **Better reliability** - 99.9% uptime SLA
- ✅ **Faster responses** - Optimized infrastructure
- ✅ **No rate limiting errors** - Transaction history works smoothly

---

## Option 1: Helius (Recommended) 🌟

**Best for**: Most users, great free tier, excellent docs

### Steps:

1. **Sign up** at https://helius.dev
2. **Create a project** (takes 30 seconds)
3. **Copy your API key** from the dashboard
4. **Create `.env.local`** in `apps/web/`:

```bash
# For devnet (testing)
NEXT_PUBLIC_SOLANA_RPC_URL=https://devnet.helius-rpc.com/?api-key=YOUR_API_KEY
NEXT_PUBLIC_SOLANA_NETWORK=devnet

# For mainnet (production)
# NEXT_PUBLIC_SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY
# NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
```

### Free Tier:
- 100,000 credits per month
- Rate limit: 10 requests/second
- Perfect for development and small apps

---

## Option 2: QuickNode

**Best for**: Enterprise features, great dashboard

### Steps:

1. **Sign up** at https://quicknode.com
2. **Create an endpoint** (select Solana + network)
3. **Copy your endpoint URL**
4. **Create `.env.local`** in `apps/web/`:

```bash
# For devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://your-endpoint.solana-devnet.quiknode.pro/YOUR_TOKEN/
NEXT_PUBLIC_SOLANA_NETWORK=devnet

# For mainnet
# NEXT_PUBLIC_SOLANA_RPC_URL=https://your-endpoint.solana-mainnet.quiknode.pro/YOUR_TOKEN/
# NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
```

### Free Tier:
- 50 million credits per month
- Advanced analytics dashboard
- WebSocket support

---

## Option 3: Alchemy

**Best for**: Multi-chain projects, great support

### Steps:

1. **Sign up** at https://alchemy.com
2. **Create an app** (select Solana + network)
3. **Copy your API key**
4. **Create `.env.local`** in `apps/web/`:

```bash
# For devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://solana-devnet.g.alchemy.com/v2/YOUR_API_KEY
NEXT_PUBLIC_SOLANA_NETWORK=devnet

# For mainnet
# NEXT_PUBLIC_SOLANA_RPC_URL=https://solana-mainnet.g.alchemy.com/v2/YOUR_API_KEY
# NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
```

### Free Tier:
- 300 million compute units per month
- Enhanced APIs
- Multi-chain support

---

## Quick Setup (5 Minutes)

### 1. Choose a Provider
We recommend **Helius** for beginners - it's the easiest to set up.

### 2. Get Your API Key
Sign up and copy your API key or endpoint URL.

### 3. Create Environment File

```bash
# Navigate to web app directory
cd apps/web

# Copy the example file
cp .env.local.example .env.local

# Edit with your favorite editor
nano .env.local
# or
code .env.local
```

### 4. Add Your Configuration

Paste your RPC URL:

```bash
NEXT_PUBLIC_SOLANA_RPC_URL=https://devnet.helius-rpc.com/?api-key=YOUR_API_KEY
NEXT_PUBLIC_SOLANA_NETWORK=devnet
```

### 5. Restart Your Dev Server

```bash
# Stop the current server (Ctrl+C)
# Then restart
pnpm dev
```

### 6. Test It!

1. Go to http://localhost:3000/history
2. Enter a Solana wallet address
3. Click "Fetch Transaction History"
4. It should work without rate limit errors! ✅

---

## Testing Your Setup

### Test Wallet Addresses (Devnet)

Try these addresses to see if it works:

```
# Solana Devnet Faucet Address
9B5XszUGdMaxCZ7uSQhPzdks5ZQSmWxrmzCSvtJ6Ns6g

# Your own wallet (after getting devnet SOL)
# Get free devnet SOL at: https://faucet.solana.com
```

### Test Wallet Addresses (Mainnet)

```
# Solana Foundation Treasury
3FFaheyqtyAXZSYxDzsr5CVKvJuvZD1WE1VEsBtDbRqB

# Any active wallet address
```

---

## Troubleshooting

### Error: "Rate limit exceeded"
- **Cause**: Still using public RPC or API key not working
- **Fix**: Double-check your `.env.local` file, make sure API key is correct
- **Verify**: Restart dev server after changing `.env.local`

### Error: "Request timed out"
- **Cause**: Network issues or RPC endpoint down
- **Fix**: Try a different RPC provider
- **Check**: Provider status page

### Error: "Invalid API key"
- **Cause**: API key copied incorrectly
- **Fix**: Copy the full key including any dashes or special characters
- **Verify**: Check for extra spaces at the beginning/end

### Environment variables not loading
- **Cause**: File name wrong or not in correct directory
- **Fix**: Must be named `.env.local` (note the dot at start)
- **Location**: Must be in `apps/web/` directory
- **Restart**: Always restart dev server after changes

---

## Security Best Practices

### ✅ DO:
- Keep your API keys in `.env.local` (already in `.gitignore`)
- Use different keys for development and production
- Rotate keys periodically
- Monitor your usage on provider dashboard

### ❌ DON'T:
- Commit `.env.local` to Git (it's ignored by default)
- Share your API keys publicly
- Use production keys in development
- Hardcode API keys in your code

---

## Cost Comparison

All providers have generous free tiers perfect for development:

| Provider | Free Tier | Best For |
|----------|-----------|----------|
| **Helius** | 100k credits/mo | Beginners, quick setup |
| **QuickNode** | 50M credits/mo | Analytics, dashboard |
| **Alchemy** | 300M compute units/mo | Multi-chain projects |

**Recommendation**: Start with Helius free tier. Upgrade only if you need more.

---

## Next Steps

After setting up your RPC:

1. ✅ Test transaction history feature
2. ✅ Test on devnet first
3. ✅ Switch to mainnet when ready
4. ✅ Monitor your usage on provider dashboard
5. ✅ Consider upgrading if you hit limits

---

## Need Help?

- **Helius Docs**: https://docs.helius.dev
- **QuickNode Docs**: https://quicknode.com/docs
- **Alchemy Docs**: https://docs.alchemy.com
- **Solana RPC Docs**: https://docs.solana.com/api/http

---

## Example: Complete Setup

Here's what your `.env.local` should look like:

```bash
# Helius RPC (Devnet)
NEXT_PUBLIC_SOLANA_RPC_URL=https://devnet.helius-rpc.com/?api-key=abc123-your-key-here
NEXT_PUBLIC_SOLANA_NETWORK=devnet

# Optional: Add other environment variables as needed
# NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

That's it! Your ExePay app will now use the dedicated RPC endpoint for all Solana interactions. 🚀

---

**Pro Tip**: Set up both devnet and mainnet keys, then switch between them by commenting/uncommenting lines in `.env.local`.

