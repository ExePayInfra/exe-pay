# Light Protocol Setup Guide

**Objective:** Configure Light Protocol for true on-chain privacy  
**Phase:** 1 - Setup & Configuration  
**Estimated Time:** 30 minutes  
**Prerequisites:** Node.js 18+, pnpm installed, dev server running

---

## ⚠️ Important: Local Testing Required

**All Light Protocol features must be tested locally before deployment to production.**

This guide will help you:
1. Configure Light Protocol RPC endpoints
2. Set up environment variables
3. Test the configuration locally
4. Verify privacy features work correctly

---

## 📋 **STEP 1: CREATE ENVIRONMENT FILE**

Create a file named `.env.local` in the root directory:

```bash
cd /Users/kingchief/Documents/EXE
touch .env.local
```

---

## 📝 **STEP 2: ADD CONFIGURATION**

Add this to `.env.local`:

```env
# Solana Network
NEXT_PUBLIC_SOLANA_NETWORK=devnet

# Solana RPC Endpoint
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com

# Light Protocol RPC Endpoint (ZK Compression RPC)
# For devnet testing (FREE):
NEXT_PUBLIC_LIGHT_RPC_URL=https://devnet.helius-rpc.com

# Optional: Helius API Key (for better rate limits)
# Get from: https://www.helius.dev/
NEXT_PUBLIC_HELIUS_API_KEY=
```

---

## 🔑 **STEP 3: GET HELIUS API KEY (OPTIONAL)**

**For better rate limits and mainnet support:**

1. Go to https://www.helius.dev/
2. Sign up for free account
3. Create a new project
4. Copy your API key
5. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_HELIUS_API_KEY=your-api-key-here
   NEXT_PUBLIC_LIGHT_RPC_URL=https://devnet.helius-rpc.com?api-key=your-api-key-here
   ```

---

## 🧪 **STEP 4: TEST CONFIGURATION**

**For now, we'll use devnet (FREE) for testing:**

```env
# Devnet Configuration (FREE)
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_LIGHT_RPC_URL=https://devnet.helius-rpc.com
```

**Benefits of devnet:**
- ✅ Free to use
- ✅ No API key needed
- ✅ Test Light Protocol features
- ✅ Verify privacy on Solscan
- ✅ No real money at risk

---

## 🚀 **STEP 5: RESTART DEV SERVER**

After creating `.env.local`:

```bash
# Stop current dev server (Ctrl+C)
# Then restart:
pnpm dev
```

---

## ✅ **VERIFICATION**

**Check if configuration loaded:**

1. Go to http://localhost:3000/wallet
2. Open browser console (F12)
3. Look for: `[ExePay] Light Protocol RPC: ...`
4. Should show your configured endpoint

---

## 📊 **CONFIGURATION OPTIONS**

### **Option 1: Devnet (Recommended for Testing)**

```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_LIGHT_RPC_URL=https://devnet.helius-rpc.com
```

**Pros:**
- ✅ Free
- ✅ No API key needed
- ✅ Perfect for testing
- ✅ Supports Light Protocol

**Cons:**
- ⚠️ Devnet only (not real money)
- ⚠️ Lower rate limits

---

### **Option 2: Helius Free Tier**

```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_HELIUS_API_KEY=your-key-here
NEXT_PUBLIC_SOLANA_RPC_URL=https://devnet.helius-rpc.com?api-key=your-key-here
NEXT_PUBLIC_LIGHT_RPC_URL=https://devnet.helius-rpc.com?api-key=your-key-here
```

**Pros:**
- ✅ Higher rate limits
- ✅ Better performance
- ✅ Free tier available
- ✅ Supports Light Protocol

**Cons:**
- ⚠️ Requires signup
- ⚠️ API key management

---

### **Option 3: Helius Pro (Mainnet)**

```env
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_HELIUS_API_KEY=your-key-here
NEXT_PUBLIC_SOLANA_RPC_URL=https://mainnet.helius-rpc.com?api-key=your-key-here
NEXT_PUBLIC_LIGHT_RPC_URL=https://mainnet.helius-rpc.com?api-key=your-key-here
```

**Pros:**
- ✅ Production ready
- ✅ Real transactions
- ✅ Best performance
- ✅ Full Light Protocol support

**Cons:**
- ⚠️ Requires paid plan
- ⚠️ Real money transactions

---

## 🎯 **RECOMMENDED APPROACH**

**Start with Devnet (Option 1):**

1. ✅ Create `.env.local` with devnet config
2. ✅ Test Light Protocol features
3. ✅ Verify privacy on Solscan
4. ✅ Make sure everything works
5. ✅ Then upgrade to Helius/Mainnet

---

## 🔧 **TROUBLESHOOTING**

### **Issue: Environment variables not loading**

**Solution:**
```bash
# Make sure file is named exactly:
.env.local

# Not:
.env
env.local
.env.txt
```

### **Issue: RPC connection failed**

**Solution:**
```bash
# Test RPC endpoint:
curl https://api.devnet.solana.com -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":1,"method":"getHealth"}'

# Should return: {"jsonrpc":"2.0","result":"ok","id":1}
```

### **Issue: Light Protocol not working**

**Solution:**
- Check RPC endpoint supports Light Protocol
- Verify network is correct (devnet/mainnet)
- Check console for error messages

---

## 📝 **NEXT STEPS**

**After configuration:**

1. ✅ Restart dev server
2. ✅ Test wallet connection
3. ✅ Check console for Light Protocol logs
4. ✅ Move to Phase 2: Compressed Accounts

---

## 💡 **QUICK START**

**Create `.env.local` with this:**

```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_LIGHT_RPC_URL=https://devnet.helius-rpc.com
```

**Then:**
```bash
pnpm dev
```

**That's it!** ✅

---

---

## Testing Checklist

**After configuration, verify locally:**

- [ ] `.env.local` file created with correct values
- [ ] Dev server restarted (`pnpm dev`)
- [ ] Can access http://localhost:3000
- [ ] Wallet connection works
- [ ] No console errors related to RPC
- [ ] Environment variables loaded correctly

**Check console for:**
```
[ExePay] Solana RPC: https://api.devnet.solana.com
[ExePay] Light Protocol RPC: https://devnet.helius-rpc.com
```

---

## Next Steps

**After successful local testing:**

1. ✅ Configuration verified locally
2. ✅ Move to Phase 2: Initialize Light Protocol client
3. ✅ Implement compressed accounts
4. ✅ Test shielded pool functionality
5. ✅ Verify privacy on Solscan devnet

**Do not proceed to Phase 2 until local testing is complete.**

---

## Support

**If you encounter issues:**

1. Review the troubleshooting section
2. Check console for error messages
3. Verify `.env.local` file syntax
4. Ensure dev server restarted
5. Test RPC endpoint connectivity

**Common mistakes:**
- File named incorrectly (must be `.env.local`)
- Forgot to restart dev server
- Typos in environment variable names
- Missing `NEXT_PUBLIC_` prefix

---

**Ready to proceed?** Ensure all testing checklist items are complete.

