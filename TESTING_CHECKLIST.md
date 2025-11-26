# 🧪 Privacy Features Testing Checklist

## Pre-Testing Setup

- [x] Dev server running on port 3000
- [ ] Browser open at `localhost:3000/privacy`
- [ ] Wallet connected (Phantom/Solflare)
- [ ] Browser console open (for debugging)
- [ ] Have test SOL (at least 0.1 SOL)

---

## Test 1: Generate Stealth Meta-Address ✅

**Steps:**
1. Go to `localhost:3000/privacy`
2. Click **"📬 Receive (Stealth)"** tab
3. Connect wallet if not already connected
4. Click **"Generate My Stealth Address"**

**Expected Results:**
- [ ] Stealth meta-address displayed (format: `stealth:XXXXX:XXXXX`)
- [ ] QR code appears
- [ ] Copy button visible
- [ ] Can copy address to clipboard
- [ ] Address starts with "stealth:"

**Status:** ⏳ PENDING

**Notes:**
_____________________

---

## Test 2: Send Private Payment (Already Tested) ✅

**Steps:**
1. Click **"💸 Send (Private)"** tab
2. Paste stealth meta-address from Test 1
3. Click **"Generate One-Time Address"**
4. Enter amount: `0.01` SOL
5. Select **Maximum Privacy** mode
6. Click **"Send Private Payment"**

**Expected Results:**
- [x] One-time address generated
- [x] Ephemeral key displayed
- [x] View tag shown
- [x] Copy button works
- [x] Transaction sent successfully
- [x] Transaction signature displayed
- [x] "View on Explorer" link works
- [x] Transaction confirmed (FINALIZED)

**Status:** ✅ PASS (0.1 SOL tested successfully!)

**Transaction:** `2baiqK8JuYyg1ehio14qtoQhHkB7s9wdyv2K3973iFdkLeGKkFAaqdSrBoUpUBYBoGufoPzrnDTPYzpjH1JNKve`

---

## Test 3: Scan for Incoming Payments 🔍

**Steps:**
1. Click **"🔍 Scan (Detect)"** tab
2. Ensure wallet is connected (same wallet that received payment)
3. Click **"Scan for Payments"**
4. Wait for scanning to complete

**Expected Results:**
- [ ] Scanner starts (shows "Scanning Blockchain...")
- [ ] Fetches recent transactions
- [ ] Displays detected payments
- [ ] Shows payment details:
  - [ ] Amount (0.1 SOL from Test 2)
  - [ ] Timestamp
  - [ ] One-time address
  - [ ] Ephemeral key
  - [ ] Transaction signature
  - [ ] "Claim" button visible
- [ ] Payment not marked as "Claimed"

**Status:** ⏳ PENDING

**Notes:**
_____________________

---

## Test 4: Claim Payment 💰

**Steps:**
1. In **"🔍 Scan (Detect)"** tab
2. Find the detected payment from Test 2
3. Click **"Claim"** button
4. Wait for transaction to complete

**Expected Results:**
- [ ] Shows "Claiming..." state
- [ ] Transaction created and sent
- [ ] Success alert appears with:
  - [ ] Amount claimed
  - [ ] Transaction signature
  - [ ] Explorer link
- [ ] Payment marked as "Claimed"
- [ ] Funds appear in main wallet
- [ ] Can verify on Solana Explorer

**Status:** ⏳ PENDING

**Notes:**
_____________________

---

## Test 5: Privacy Mode Selector 🎭

**Steps:**
1. Click **"🎭 Privacy Modes"** tab
2. Review all 5 modes
3. Check auto-mode logic

**Expected Results:**
- [ ] 5 modes displayed:
  - [ ] Public (🔓)
  - [ ] Stealth (🔒)
  - [ ] Relayer (🔐)
  - [ ] Maximum (🔒🔐)
  - [ ] Auto (✨)
- [ ] Each mode has clear description
- [ ] Auto mode shows logic:
  - [ ] < 0.1 SOL → Stealth
  - [ ] 0.1-1 SOL → Relayer
  - [ ] > 1 SOL → Maximum
- [ ] Visual indicators work
- [ ] Recommended badge on Auto mode

**Status:** ⏳ PENDING

**Notes:**
_____________________

---

## Test 6: Copy to Clipboard 📋

**Test in multiple places:**

**6a. Stealth Meta-Address:**
- [ ] Click copy button on stealth address
- [ ] Shows "✓ Copied!" feedback
- [ ] Can paste into another app
- [ ] Pasted value matches displayed value

**6b. One-Time Address:**
- [ ] Click copy button on generated address
- [ ] Shows "✓ Copied!" feedback
- [ ] Can paste into another app
- [ ] Pasted value is valid Solana address

**Status:** ⏳ PENDING

**Notes:**
_____________________

---

## Test 7: QR Code Generation 📱

**Steps:**
1. Go to **"📬 Receive (Stealth)"** tab
2. Generate stealth address
3. Check QR code

**Expected Results:**
- [ ] QR code appears
- [ ] QR code is scannable
- [ ] Scanning QR gives stealth address
- [ ] QR code updates if regenerated

**Status:** ⏳ PENDING

**Notes:**
_____________________

---

## Test 8: Error Handling ⚠️

**8a. Invalid Stealth Address:**
1. Go to **"💸 Send (Private)"** tab
2. Enter invalid address (e.g., "invalid")
3. Click "Generate One-Time Address"

**Expected:**
- [ ] Error message displayed
- [ ] Clear error description
- [ ] No crash

**8b. Zero Amount:**
1. Generate valid one-time address
2. Enter amount: `0`
3. Click "Send Private Payment"

**Expected:**
- [ ] Error message: "Amount must be greater than 0"
- [ ] Transaction not sent

**8c. Insufficient Balance:**
1. Enter amount greater than wallet balance
2. Try to send

**Expected:**
- [ ] Error from wallet or RPC
- [ ] Clear error message

**Status:** ⏳ PENDING

**Notes:**
_____________________

---

## Test 9: Multiple Payments 🔄

**Steps:**
1. Send 3 separate payments to same stealth address:
   - Payment 1: 0.01 SOL (Public mode)
   - Payment 2: 0.02 SOL (Stealth mode)
   - Payment 3: 0.03 SOL (Maximum mode)
2. Scan for payments
3. Verify all 3 detected

**Expected Results:**
- [ ] Each payment generates unique one-time address
- [ ] All 3 payments detected by scanner
- [ ] Each payment shows correct amount
- [ ] Each payment has unique signature
- [ ] Can claim each payment individually

**Status:** ⏳ PENDING

**Notes:**
_____________________

---

## Test 10: Browser Console Check 🔍

**Throughout all tests, monitor console for:**

**Should See:**
- [ ] `[Stealth Payment] Generated one-time address: ...`
- [ ] `[Scanner] Starting scan for stealth payments...`
- [ ] `[Scanner] Found X transactions to check`
- [ ] `[Scanner] Detected X stealth payments`
- [ ] `[Claim] Starting claim process...`

**Should NOT See:**
- [ ] Uncaught errors
- [ ] Failed API calls (except expected RPC limits)
- [ ] React warnings
- [ ] TypeScript errors

**Status:** ⏳ PENDING

**Notes:**
_____________________

---

## Test 11: Page Performance ⚡

**Check:**
- [ ] Privacy page loads in < 3 seconds
- [ ] Tabs switch instantly
- [ ] QR code loads smoothly (lazy loaded)
- [ ] Scanner component loads smoothly (lazy loaded)
- [ ] No lag when typing
- [ ] No lag when clicking buttons

**Status:** ⏳ PENDING

**Notes:**
_____________________

---

## Test 12: Mobile Responsiveness 📱

**If possible, test on mobile or resize browser:**
- [ ] All tabs visible and clickable
- [ ] Stealth address readable
- [ ] QR code displays properly
- [ ] Forms are usable
- [ ] Buttons are tappable
- [ ] No horizontal scrolling

**Status:** ⏳ PENDING

**Notes:**
_____________________

---

## Known Issues to Watch For 🐛

### Issue 1: Secret Key Access
**Symptom:** Scanner detects all incoming transfers, not just stealth payments
**Cause:** Using placeholder secret key instead of real wallet key
**Impact:** Can't verify payment ownership correctly
**Workaround:** Scanner will show all incoming transfers for now
**Expected:** ⚠️ This is a known limitation

### Issue 2: Memo Parsing
**Symptom:** Scanner doesn't detect payments with ephemeral keys
**Cause:** Memo parsing may need refinement
**Impact:** Payments not detected
**Action:** Report if this happens

### Issue 3: Claim Transaction Fees
**Symptom:** Claim fails with "Insufficient balance"
**Cause:** Balance too low after fees
**Impact:** Can't claim small payments
**Workaround:** Only claim payments > 0.01 SOL

---

## Bug Report Template 🐛

**If you find a bug, note:**

```
Bug #: ___
Test: ___
Severity: [ ] Critical  [ ] High  [ ] Medium  [ ] Low

Description:
_____________________

Steps to Reproduce:
1. _____________________
2. _____________________
3. _____________________

Expected:
_____________________

Actual:
_____________________

Console Errors:
_____________________

Screenshot/Video:
_____________________
```

---

## Testing Progress Tracker

**Overall Progress:**
- [ ] Test 1: Generate Stealth Address
- [x] Test 2: Send Private Payment (PASS)
- [ ] Test 3: Scan for Payments
- [ ] Test 4: Claim Payment
- [ ] Test 5: Privacy Mode Selector
- [ ] Test 6: Copy to Clipboard
- [ ] Test 7: QR Code Generation
- [ ] Test 8: Error Handling
- [ ] Test 9: Multiple Payments
- [ ] Test 10: Console Check
- [ ] Test 11: Performance
- [ ] Test 12: Mobile Responsive

**Tests Passed:** 1/12
**Tests Failed:** 0/12
**Tests Pending:** 11/12

---

## Success Criteria ✅

**Privacy system is ready for production when:**
- [ ] All 12 tests pass
- [ ] No critical bugs
- [ ] No console errors
- [ ] Good performance (< 3s load)
- [ ] Clear error messages
- [ ] Smooth user experience

**Current Status:** 🧪 TESTING IN PROGRESS

---

## Next Steps After Testing

1. **Document all bugs found**
2. **Prioritize fixes** (Critical → High → Medium → Low)
3. **Fix bugs** (estimated 1-2 hours)
4. **Re-test** (30 minutes)
5. **Deploy to production** (30 minutes)

---

## Quick Commands

**Restart server if needed:**
```bash
cd /Users/kingchief/Documents/EXE/apps/web && pnpm dev
```

**Check console for errors:**
```bash
# Open browser DevTools: Cmd+Option+I (Mac) or F12 (Windows)
```

**Hard refresh browser:**
```bash
# Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
```

---

**Ready to test! Start with Test 1 and work through the checklist.** 🚀

**Report any issues you find and we'll fix them together!** 💪

