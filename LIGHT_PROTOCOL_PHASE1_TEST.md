# Light Protocol Phase 1 - Local Testing Guide

**Phase:** 1 - Configuration & Initialization  
**Status:** ✅ Complete - Ready for Testing  
**Time Required:** 10 minutes

---

## What Was Implemented

### Files Created/Modified:

1. **`.env.local`** ✅
   - Devnet configuration
   - Solana RPC endpoint
   - Light Protocol RPC endpoint

2. **`apps/web/src/lib/lightProtocol.ts`** ✅
   - RPC client initialization
   - Connection testing
   - Configuration management
   - Network helpers

3. **`apps/web/src/app/wallet/page.tsx`** ✅
   - Light Protocol initialization on load
   - Connection verification
   - Detailed logging

---

## Local Testing Checklist

### Step 1: Restart Dev Server

**⚠️ CRITICAL: Must restart to load new environment variables**

```bash
# Stop current server (Ctrl+C or Cmd+C)
# Then restart:
cd /Users/kingchief/Documents/EXE
pnpm dev
```

**Expected Output:**
```
> @exe-pay/web@1.0.0 dev
> next dev

   ▲ Next.js 14.x.x
   - Local:        http://localhost:3000
```

---

### Step 2: Open Wallet Page

**Navigate to:**
```
http://localhost:3000/wallet
```

---

### Step 3: Check Browser Console

**Open DevTools (F12) and look for these logs:**

#### ✅ Expected Logs:

```
[Light Protocol] Configuration loaded:
[Light Protocol]   Network: devnet
[Light Protocol]   Solana RPC: https://api.devnet.solana.com
[Light Protocol]   Light RPC: https://devnet.helius-rpc.com

[ExePay] Light Protocol Configuration:
[ExePay]   Network: devnet
[ExePay]   Devnet: Yes
[ExePay]   Explorer: https://solscan.io/?cluster=devnet

[Light Protocol] Testing connection...
[Light Protocol] Solana RPC version: 1.x.x
[Light Protocol] ✅ Connection test successful

[ExePay] ✅ Light Protocol ready for use
[Light Protocol] Initializing RPC client...
[Light Protocol] ✅ RPC client initialized successfully
[Light Protocol] Ready for compressed accounts and shielded pool operations
[ExePay] ✅ Light Protocol RPC client initialized

[ExePay] ✅ Privacy functions loaded
```

#### ❌ If You See Errors:

**Error: "Failed to initialize Light Protocol"**
- Check `.env.local` file exists
- Verify file syntax (no typos)
- Restart dev server
- Check RPC endpoints are accessible

**Error: "Connection test failed"**
- RPC endpoint might be down
- Check internet connection
- Try alternative RPC endpoint

---

### Step 4: Verify Configuration

**Check these in console:**

1. **Network is Devnet:**
   - Look for: `Network: devnet`
   - Should NOT say `mainnet-beta`

2. **RPC Endpoints Loaded:**
   - Solana RPC: `https://api.devnet.solana.com`
   - Light RPC: `https://devnet.helius-rpc.com`

3. **Connection Successful:**
   - Look for: `✅ Connection test successful`
   - Look for: `✅ Light Protocol ready for use`

4. **RPC Client Initialized:**
   - Look for: `✅ RPC client initialized successfully`
   - Look for: `Ready for compressed accounts`

---

### Step 5: Test Wallet Connection

**Test that existing features still work:**

1. **Connect Wallet:**
   - Click wallet selector
   - Select Phantom (or any wallet)
   - Unlock if needed
   - Sign verification message

2. **Expected:**
   - [ ] Wallet connects successfully
   - [ ] Signature verification works
   - [ ] No errors in console
   - [ ] Light Protocol logs still visible

3. **Verify:**
   - [ ] Can see wallet balance
   - [ ] Can select tokens
   - [ ] Privacy modes visible
   - [ ] Form works correctly

---

### Step 6: Check Network Indicator

**On the wallet page:**

1. Look for network indicator (if visible)
2. Should show "Devnet" or devnet badge
3. Transactions will be on devnet

**Note:** Devnet SOL is free! Get from:
- https://faucet.solana.com
- https://solfaucet.com

---

## Testing Results

**Fill this out:**

### Configuration Test:
- [ ] ✅ `.env.local` file exists
- [ ] ✅ Dev server restarted
- [ ] ✅ Environment variables loaded
- [ ] ❌ Issues: _________________

### Connection Test:
- [ ] ✅ Light Protocol logs appear
- [ ] ✅ Configuration shows devnet
- [ ] ✅ RPC connection successful
- [ ] ✅ RPC client initialized
- [ ] ❌ Issues: _________________

### Integration Test:
- [ ] ✅ Wallet connection works
- [ ] ✅ No errors in console
- [ ] ✅ Existing features work
- [ ] ❌ Issues: _________________

---

## Troubleshooting

### Issue: No Light Protocol logs

**Solution:**
1. Verify `.env.local` exists in root directory
2. Restart dev server
3. Hard refresh browser (Ctrl+Shift+R)
4. Check console for any errors

### Issue: "Network: mainnet-beta" instead of "devnet"

**Solution:**
1. Check `.env.local` has: `NEXT_PUBLIC_SOLANA_NETWORK=devnet`
2. No typos in variable name
3. Restart dev server
4. Clear browser cache

### Issue: Connection test fails

**Solution:**
1. Check internet connection
2. Try pinging RPC endpoint:
   ```bash
   curl https://api.devnet.solana.com -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":1,"method":"getHealth"}'
   ```
3. If down, wait and try again
4. Consider alternative RPC endpoint

### Issue: Wallet features broken

**Solution:**
1. Check console for errors
2. Verify no syntax errors in code
3. Test in incognito mode
4. Try different wallet
5. Report specific error messages

---

## Success Criteria

**Phase 1 is successful if:**

- [x] `.env.local` file created
- [x] Environment variables load correctly
- [x] Light Protocol configuration logs appear
- [x] RPC connection test passes
- [x] RPC client initializes successfully
- [x] Network shows as "devnet"
- [x] Existing wallet features still work
- [x] No errors in console

**If ALL criteria met:** ✅ Ready for Phase 2

**If ANY criteria failed:** ⚠️ Fix issues before proceeding

---

## Next Steps

**After successful Phase 1 testing:**

### Phase 2: Compressed Account Creation
- Implement compressed account creation
- Add UI for account setup
- Test account creation locally
- Verify on devnet explorer

**Estimated Time:** 2-3 hours

---

## Important Notes

### About Devnet:

- **Free to use** - No real money
- **Safe for testing** - Can't lose funds
- **Full features** - All Light Protocol features work
- **Visible on explorer** - Can verify on Solscan devnet

### About RPC Endpoints:

- **Devnet RPC** - Free, no API key needed
- **Rate limits** - May be slower than paid endpoints
- **Helius Free** - Can upgrade for better performance
- **Production** - Will need paid RPC for mainnet

### Security:

- **Devnet only** - Don't use real funds yet
- **Test thoroughly** - Verify all features work
- **Mainnet later** - After full testing on devnet

---

## Console Log Reference

**What each log means:**

| Log | Meaning |
|-----|---------|
| `Configuration loaded` | Environment variables read successfully |
| `Testing connection` | Checking if RPC endpoints are accessible |
| `Solana RPC version` | Successfully connected to Solana RPC |
| `Connection test successful` | RPC endpoints working |
| `Light Protocol ready` | System ready for privacy features |
| `RPC client initialized` | Light Protocol client created |
| `Privacy functions loaded` | ZK proof functions available |

---

## Support

**If you encounter issues:**

1. Review troubleshooting section
2. Check all success criteria
3. Verify `.env.local` syntax
4. Ensure dev server restarted
5. Check console for specific errors

**Common mistakes:**
- Forgot to restart dev server
- Typo in environment variable names
- `.env.local` in wrong directory
- Browser cache not cleared

---

## Ready for Phase 2?

**Before proceeding, ensure:**

- [ ] All testing checklist items complete
- [ ] All success criteria met
- [ ] No errors in console
- [ ] Wallet features working
- [ ] Comfortable with current setup

**If ready:** Proceed to Phase 2 - Compressed Account Creation

**If not ready:** Review this guide and fix any issues

---

**Test Phase 1 now and report results!** ✅

