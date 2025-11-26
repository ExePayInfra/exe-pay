# Full Claiming Testing Guide

## 🎯 What We're Testing

The complete stealth address system with **REAL fund transfers**:
1. Generate stealth meta-address
2. Send private payment to stealth address
3. Scan for incoming payments
4. **Claim payment (transfer SOL to your wallet)** ← NEW!

---

## 🚀 Testing Steps

### Step 1: Start the Dev Server

```bash
cd /Users/kingchief/Documents/EXE
ulimit -n 65536  # Increase file descriptor limit
cd apps/web && pnpm dev
```

Wait for server to start on `http://localhost:3000`

---

### Step 2: Generate Your Stealth Address

#### Option A: From Wallet Page
1. Go to `http://localhost:3000/wallet`
2. Connect your wallet (Solflare, Phantom, etc.)
3. Look at the **right sidebar** (desktop) or scroll down (mobile)
4. Click **"🔐 Generate Address"** in the Stealth Address Card
5. Sign the message when prompted
6. Copy your stealth meta-address

#### Option B: From Privacy Page
1. Go to `http://localhost:3000/privacy`
2. Connect your wallet
3. Click **"📥 Receive"** tab
4. Click **"Sign to Generate Address"**
5. Sign the message when prompted
6. Copy your stealth meta-address

**Expected Result:**
- Address format: `stealth:XXXXXX:YYYYYY`
- QR code displayed
- Copy button works
- No errors in console

---

### Step 3: Send a Private Payment

1. Go to **"💸 Send"** tab on privacy page
2. Paste your stealth meta-address (from Step 2)
3. Enter amount: `0.001` SOL (or any small amount)
4. Optional: Add a memo
5. Click **"Generate One-Time Address"**
6. Click **"📋 Copy"** to copy the one-time address
7. Click **"Send Private Payment"**
8. Approve the transaction in your wallet

**Expected Result:**
- One-time address generated (different each time!)
- Transaction succeeds
- Success message with explorer link
- Console shows:
  - `[Stealth Address] Generated one-time address`
  - `[Stealth Address] View tag: XXX`
  - `[Stealth Payment] Transaction successful: SIGNATURE`

**Check on Explorer:**
- Go to the transaction link
- You should see a memo with format: `ExePay:Stealth:EPHEMERAL_KEY:VIEW_TAG`
- Transfer to the one-time address

---

### Step 4: Scan for Payments

1. Go to **"🔍 Scan & Claim"** tab
2. If not already signed, click **"Enable Privacy Scanning"**
3. Sign the message when prompted
4. Click **"🔍 Scan for Payments"**
5. Wait for scan to complete (may take 10-30 seconds)

**Expected Result:**
- Console shows:
  - `[Scanner] Starting scan for stealth payments...`
  - `[Scanner] Found X transactions to check`
  - `[Scanner] ✓ Found payment for us! SIGNATURE`
  - `[Scanner] Detected X stealth payments`
- UI shows detected payment(s) with:
  - Amount
  - Timestamp
  - Signature
  - **"Claim" button**

---

### Step 5: Claim the Payment (REAL TRANSFER!)

1. Click **"💰 Claim"** button on a detected payment
2. Wait for transaction to process (5-10 seconds)

**Expected Result:**
- Console shows:
  - `[Scanner UI] Claiming payment: SIGNATURE`
  - `[Claim] Starting claim process...`
  - `[Claim] ✓ Keypair derived successfully`
  - `[Claim] Transferring: X SOL`
  - `[Claim] Transaction signed, sending...`
  - `[Claim] ✓ Transaction confirmed!`
  - `[Scanner UI] ✓ Claim successful!`
- Alert popup shows:
  - "✅ Payment claimed successfully!"
  - Amount transferred
  - Transaction signature
  - Explorer link
- Payment marked as **"✓ Claimed"** in UI
- **SOL transferred to your wallet!**

**Verify on Explorer:**
- Click the explorer link in the alert
- You should see a transfer FROM the one-time stealth address TO your main wallet
- Amount should match (minus ~0.000005 SOL for fees)

---

## 🎉 Success Criteria

### ✅ All Tests Pass If:

1. **Generation:**
   - Stealth meta-address generated successfully
   - Same address on both wallet and privacy pages
   - QR code displays correctly

2. **Sending:**
   - One-time address generated (unique each time)
   - Transaction succeeds
   - Memo includes ephemeral key and view tag

3. **Scanning:**
   - Payments detected correctly
   - View tags match
   - No false positives
   - No missed payments

4. **Claiming (NEW!):**
   - Keypair derived successfully
   - Transaction created and signed
   - **SOL transferred to your wallet**
   - Payment marked as claimed
   - No errors

5. **UI/UX:**
   - No console errors
   - Smooth animations
   - Clear feedback messages
   - Mobile responsive

---

## 🐛 Common Issues & Fixes

### Issue 1: "No payments found" after sending
**Cause:** Using old stealth address from before fixes
**Fix:** Generate a NEW stealth address after latest code changes

### Issue 2: "View tag mismatch"
**Cause:** Sender and scanner using different ECDH conversions
**Fix:** Already fixed! Make sure you're on latest commit

### Issue 3: "Failed to claim payment"
**Cause:** Private key derivation mismatch
**Fix:** Already fixed! Make sure privacy package is rebuilt

### Issue 4: RPC 429 errors
**Cause:** Too many requests to Solana devnet RPC
**Fix:** Wait a few seconds and try again, or use a custom RPC

### Issue 5: Claim button does nothing
**Cause:** Missing private key in detected payment
**Fix:** Rescan for payments (should derive private key automatically)

---

## 🔍 What to Look For

### Console Logs (Should See):
```
[Stealth Generator] ✓ Stealth meta-address generated
[Stealth Address] Generated one-time address
[Stealth Address] View tag: XXX
[Stealth Payment] Transaction successful: SIGNATURE
[Scanner] ✓ Found payment for us! SIGNATURE
[Scanner] Detected X stealth payments
[Claim] ✓ Keypair derived successfully
[Claim] ✓ Transaction confirmed!
[Scanner UI] ✓ Claim successful!
```

### Console Logs (Should NOT See):
```
❌ Error: ...
❌ Failed: ...
Expected view tag: X, Actual view tag: Y (DIFFERENT!)
Module not found: ...
```

---

## 📊 Test Matrix

| Feature | Status | Notes |
|---------|--------|-------|
| Generate stealth address | ✅ | Working with message signing |
| Send to stealth address | ✅ | Generates unique one-time addresses |
| Scan for payments | ✅ | Detects payments correctly |
| View tag verification | ✅ | Fixed ECDH conversion |
| Claim payment (UI) | ✅ | Marks as claimed |
| **Claim payment (Transfer)** | **🆕 TESTING** | **Transfers SOL to wallet** |
| Private key derivation | ✅ | Uses correct ECDH |
| Multiple payments | ✅ | Can detect and claim multiple |
| Mobile responsive | ✅ | Works on all screen sizes |

---

## 🎯 Next Steps After Testing

If all tests pass:
1. ✅ Mark claiming feature as complete
2. 🚀 Deploy to production
3. 📝 Update documentation
4. 🎉 Announce stealth addresses are LIVE!

If any tests fail:
1. 🐛 Debug the specific issue
2. 🔧 Fix and rebuild
3. 🔄 Retest
4. ✅ Verify fix works

---

## 💡 Pro Tips

1. **Use small amounts** for testing (0.001 SOL is enough)
2. **Check console logs** for detailed debugging info
3. **Use devnet** for testing (free SOL from faucet)
4. **Test multiple payments** to ensure consistency
5. **Verify on explorer** to confirm real transfers

---

## 🎊 What's New in This Version

### Full Claiming Implementation:
- ✅ Derives stealth private key from ephemeral public key
- ✅ Creates transfer transaction from stealth address to wallet
- ✅ Signs transaction with derived keypair
- ✅ Sends transaction and waits for confirmation
- ✅ Shows success message with explorer link
- ✅ Marks payment as claimed in UI
- ✅ **Actually transfers SOL to your wallet!**

### Cryptography Fixes:
- ✅ Uses `ed25519.utils.toMontgomery` for public key conversion
- ✅ Hashes shared secret with `keccak_256`
- ✅ Derives stealth key using `spendingKey + sharedSecret`
- ✅ Matches sender's key derivation exactly

---

**Ready to test? Let's go! 🚀**

