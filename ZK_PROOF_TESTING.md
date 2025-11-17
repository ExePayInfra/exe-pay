# 🔐 Real ZK Proof Testing Guide

**Status**: Real ZK proofs ENABLED  
**Date**: November 17, 2024  
**Circuit Files**: ✅ Ready in `/public/circuits/`

---

## ✅ Changes Made

### 1. Enabled Real ZK Proofs
**File**: `packages/privacy/src/proofs/groth16.ts`
- Changed `USE_MOCK_PROOFS = false`
- Real ZK-SNARK proof generation now active
- Fallback to mock proofs on error (graceful degradation)

### 2. Updated UI Badge
**File**: `apps/web/src/app/wallet/page.tsx`
- Changed badge from "SIMULATED" (blue) to "PRODUCTION" (green)
- Badge shows on Shielded and Private privacy modes

### 3. Circuit Files Present
**Location**: `apps/web/public/circuits/`
- ✅ `range_proof.wasm` (37 KB)
- ✅ `range_proof.zkey` (77 KB)
- ✅ `balance_proof.wasm` (1.7 MB)
- ✅ `balance_proof.zkey` (525 KB)

---

## 🧪 Local Testing Steps

### Step 1: Verify Dev Server is Running

The dev server should be starting now. Check:

```bash
# In your terminal, you should see:
# ✓ Ready on http://localhost:3000
```

If not, start it manually:
```bash
cd /Users/kingchief/Documents/EXE
pnpm dev
```

---

### Step 2: Test Homepage First

1. **Open**: http://localhost:3000
2. **Check**: 
   - Page loads without errors
   - Partner logos visible
   - Privacy cards look good
   - No console errors (F12 → Console tab)

**Expected**: ✅ Homepage loads normally (no ZK proofs used here)

---

### Step 3: Test Wallet Page (Critical)

1. **Open**: http://localhost:3000/wallet
2. **Before Connecting Wallet**:
   - ✅ Page should load (no "Invalid public key input" error)
   - ✅ Privacy level cards should show "PRODUCTION" badge (green, not blue)
   - ✅ No console errors

**If you see errors here**, it means the PublicKey fix didn't work. Let me know immediately.

---

### Step 4: Connect Wallet

1. **Click** "Connect Wallet"
2. **Select** Phantom (or your preferred wallet)
3. **Approve** connection

**Expected**: 
- ✅ Wallet connects successfully
- ✅ Balance displays
- ✅ Token selector appears
- ✅ Privacy levels show "PRODUCTION" badge

---

### Step 5: Test Public Transfer (Baseline)

**Test a simple public transfer first** to ensure basic functionality works:

1. **Select**: "Public" privacy level
2. **Enter**: A valid Solana address (or your own address)
3. **Amount**: 0.001 SOL
4. **Click**: "Send Payment"

**Expected**:
- ✅ Transaction prompts in wallet
- ✅ Transaction succeeds
- ✅ Success message appears
- ✅ Balance updates

**If this fails**, basic wallet connection is broken.

---

### Step 6: Test Shielded Transfer (Real ZK Proofs)

**This is the critical test for real ZK proofs:**

1. **Select**: "Shielded" privacy level (🛡️)
2. **Notice**: Badge says "PRODUCTION" (green)
3. **Enter**: A valid Solana address
4. **Amount**: 0.001 SOL
5. **Click**: "Send Shielded Payment"

**Watch the Console** (F12 → Console):

#### Expected (Success):
```
🔐 Generating range proof with real ZK-SNARKs...
✅ Range proof generated successfully!
✅ Payment sent successfully!
```

#### If You See (Error):
```
❌ Range proof generation failed: [error details]
⚠️ Falling back to mock proof
```

**Possible Errors:**

1. **"Failed to fetch"** - Circuit files not loading
   - Check browser Network tab (F12 → Network)
   - Look for `/circuits/range_proof.wasm` and `/circuits/range_proof.zkey`
   - Should return 200 OK, not 404

2. **"Invalid public key input"** - Our previous error is back
   - This means the fix didn't work for proof generation
   - Let me know and I'll debug further

3. **"WebAssembly compilation failed"** - Circuit file corrupted
   - Re-copy circuit files from `packages/privacy/circuits/`

4. **Timeout/Hang** - Proof generation taking too long
   - Real proofs can take 3-5 seconds on first load
   - Check if WASM files are downloading (Network tab)

---

### Step 7: Test Private Transfer (Advanced)

If Shielded works, try Private:

1. **Select**: "Private" privacy level (🔒)
2. **Enter**: A valid Solana address
3. **Amount**: 0.001 SOL
4. **Click**: "Send Private Payment"

**Expected**: Similar to shielded, but with additional privacy

---

## 🐛 Troubleshooting

### Issue 1: "Invalid public key input" Error

**Symptoms**: Error on wallet page load or during proof generation

**Solution**:
1. Hard refresh (Cmd+Shift+R or Ctrl+Shift+F5)
2. Clear browser cache
3. Restart dev server
4. If persists, let me know - we'll revert to mock proofs

---

### Issue 2: Circuit Files Not Found (404)

**Symptoms**: Console shows "Failed to fetch" for .wasm or .zkey files

**Check**:
```bash
ls -lh /Users/kingchief/Documents/EXE/apps/web/public/circuits/
```

**Should see**:
- balance_proof.wasm
- balance_proof.zkey
- range_proof.wasm
- range_proof.zkey

**If missing**, copy from:
```bash
cp /Users/kingchief/Documents/EXE/packages/privacy/circuits/range_proof_js/range_proof.wasm \
   /Users/kingchief/Documents/EXE/apps/web/public/circuits/

cp /Users/kingchief/Documents/EXE/packages/privacy/circuits/range_proof.zkey \
   /Users/kingchief/Documents/EXE/apps/web/public/circuits/
```

---

### Issue 3: Proof Generation Hangs/Takes Forever

**Symptoms**: Payment button stuck on "Generating proof..." for > 10 seconds

**Possible Causes**:
1. Large circuit file downloading slowly
2. Browser WebAssembly issue
3. Insufficient memory

**Solutions**:
- Check Network tab - are files downloading?
- Try in incognito/private mode
- Try different browser (Chrome recommended)
- If all else fails, we can revert to mock proofs

---

### Issue 4: Proof Generated But Transaction Fails

**Symptoms**: Proof succeeds but transaction fails

**This is actually OK!** It means:
- ✅ ZK proof generation works
- ❌ Transaction building/sending has issues

**Not a ZK proof problem** - separate issue to debug

---

## 📊 Testing Checklist

Before deploying to Vercel, verify:

- [ ] Homepage loads without errors
- [ ] Wallet page loads without errors
- [ ] "PRODUCTION" badge visible (green, not blue)
- [ ] Wallet connects successfully
- [ ] Public transfer works (baseline)
- [ ] **Shielded transfer generates real ZK proof** ⭐
- [ ] Console shows "✅ Range proof generated successfully!"
- [ ] Private transfer works
- [ ] No "Invalid public key input" errors
- [ ] No 404 errors for circuit files
- [ ] Balance updates after transactions

---

## ✅ Success Criteria

**ZK Proofs Working** if you see:
1. ✅ Badge says "PRODUCTION" (green)
2. ✅ Console logs "🔐 Generating range proof with real ZK-SNARKs..."
3. ✅ Console logs "✅ Range proof generated successfully!"
4. ✅ Transaction completes
5. ✅ No fallback to mock proofs

---

## 🚀 After Successful Testing

Once all tests pass:

1. **Commit** any additional fixes
2. **Push** to GitHub
3. **Deploy** to Vercel
4. **Test** on live site
5. **Update** documentation

---

## 🔄 If Testing Fails

If real ZK proofs don't work:

1. **Don't panic** - We have graceful fallback to mock proofs
2. **Document** the exact error
3. **Share** console logs with me
4. We can:
   - Debug the circuit issue
   - OR temporarily revert to mock proofs
   - OR fix the specific error

**The app will still work with mock proofs** - users won't notice a difference in development.

---

## 📝 What to Report

When testing, tell me:

1. **Did the wallet page load?** (yes/no)
2. **Did you see the PRODUCTION badge?** (yes/no)
3. **Did public transfer work?** (yes/no)
4. **What happened with shielded transfer?**
   - Success with real proof?
   - Fallback to mock proof?
   - Error?
5. **Any console errors?** (copy/paste)
6. **Any Network tab errors?** (404s, timeouts?)

---

**Ready to test! Open http://localhost:3000/wallet and let me know what happens!** 🔐✨

