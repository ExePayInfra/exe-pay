# Pre-Deployment Testing Checklist

**Before deploying to production, test these critical flows to ensure everything works perfectly.**

---

## 🎯 Priority 1: Core Payment Features (CRITICAL)

### 1. Public Payments (Standard Solana)

**Location:** `http://localhost:3000/wallet`

**Test Steps:**

1. Connect wallet
2. Select "⚡ Public" privacy level
3. Send 0.001 SOL to another address
4. Verify transaction succeeds
5. Check on Solscan/Explorer

**Expected:**

- ✅ Transaction completes in <5 seconds
- ✅ Correct amount transferred
- ✅ Success notification displays
- ✅ Balance updates correctly

---

### 2. Stealth Address Full Flow (CRITICAL)

**Location:** `http://localhost:3000/privacy`

#### Test A: Generate & Share

1. Go to "📥 Receive" tab
2. Click "Sign to Generate Address"
3. Sign the message
4. Copy stealth meta-address
5. Verify QR code displays

**Expected:**

- ✅ Address format: `stealth:XXX:YYY`
- ✅ QR code visible
- ✅ Copy button works
- ✅ Same address on wallet sidebar

#### Test B: Send Private Payment

1. Go to "💸 Send" tab
2. Paste your stealth meta-address
3. Enter amount: 0.001 SOL
4. Add memo: "Test payment"
5. Click "Generate One-Time Address"
6. Verify unique address generated
7. Copy one-time address
8. Click "Send Private Payment"
9. Approve transaction

**Expected:**

- ✅ One-time address is DIFFERENT each time
- ✅ Transaction succeeds
- ✅ Green notification appears
- ✅ Explorer link works
- ✅ Console shows: `[Stealth Address] View tag: XXX`

#### Test C: Scan & Detect

1. Go to "🔍 Scan & Claim" tab
2. Click "Enable Privacy Scanning"
3. Sign the message
4. Click "Scan for Payments"
5. Wait for scan to complete

**Expected:**

- ✅ Payment detected
- ✅ Correct amount shown
- ✅ Timestamp displayed
- ✅ "Claim" button visible
- ✅ Console shows: `[Scanner] Detected X stealth payments`

#### Test D: Claim Payment

1. Click "💰 Claim" on detected payment
2. Wait for transaction

**Expected:**

- ✅ Green notification: "Payment Claimed!"
- ✅ Amount shown (minus fees)
- ✅ Explorer link works
- ✅ Payment marked as "✓ Claimed"
- ✅ **SOL appears in your wallet balance**
- ✅ Console shows: `[Claim] ✓ Transaction confirmed!`

---

### 3. Light Protocol (When Mainnet Launches)

**Location:** `http://localhost:3000/wallet`

**Test Steps:**

1. Select "🌟 Light Protocol" privacy level
2. Send 0.001 SOL
3. Verify transaction

**Expected:**

- ✅ Transaction succeeds
- ✅ Shows "TRUE PRIVATE payment sent!"
- ✅ Powered by Light Protocol message

**Note:** Currently on devnet, will be fully functional on mainnet Q1 2025

---

## 🎯 Priority 2: Batch & Recurring Features

### 4. Batch Payments

**Location:** `http://localhost:3000/batch`

**Test Steps:**

1. Add 3 recipients with different amounts
2. Select token (SOL)
3. Click "Send Batch Payment"
4. Verify all transfers

**Expected:**

- ✅ All recipients receive correct amounts
- ✅ Single transaction for SOL
- ✅ Success notification
- ✅ Transaction history updated

---

### 5. Recurring Payments

**Location:** `http://localhost:3000/recurring`

**Test Steps:**

1. Create recurring payment (daily, 0.001 SOL)
2. Verify schedule created
3. Test pause/resume
4. Test cancel
5. Execute payment manually

**Expected:**

- ✅ Schedule saves to localStorage
- ✅ Pause/resume works
- ✅ Cancel removes schedule
- ✅ Manual execution succeeds

---

## 🎯 Priority 3: User Experience

### 6. Navigation & Links

**Test All Pages:**

- ✅ Home (`/`)
- ✅ Wallet (`/wallet`)
- ✅ Privacy (`/privacy`) ← NEW!
- ✅ Batch (`/batch`)
- ✅ Recurring (`/recurring`)
- ✅ Links (`/links`)
- ✅ History (`/history`)

**Expected:**

- ✅ All pages load without errors
- ✅ Navigation links work
- ✅ Privacy link visible in menu
- ✅ Mobile menu works

---

### 7. Wallet Integration

**Location:** `http://localhost:3000/wallet`

**Test Steps:**

1. Test wallet connection (Phantom, Solflare, etc.)
2. Check sidebar shows stealth address card
3. Generate stealth address from sidebar
4. Verify copy button works
5. Test "View Details" link to privacy page

**Expected:**

- ✅ All wallets connect successfully
- ✅ Stealth card displays in sidebar
- ✅ Generate button works
- ✅ Links to privacy page work

---

### 8. Mobile Responsiveness

**Test on Mobile (or resize browser):**

**Pages to Test:**

1. Homepage
2. Wallet page
3. Privacy page (all 3 tabs)
4. Batch page
5. Recurring page

**Expected:**

- ✅ All pages responsive
- ✅ Buttons accessible
- ✅ Forms usable
- ✅ Navigation menu works
- ✅ No horizontal scroll

---

## 🎯 Priority 4: Edge Cases & Error Handling

### 9. Error Scenarios

#### Test A: Insufficient Balance

1. Try to send more SOL than you have
2. Verify error message

**Expected:**

- ✅ Clear error message
- ✅ Transaction doesn't proceed
- ✅ No console errors

#### Test B: Invalid Address

1. Enter invalid recipient address
2. Try to send payment

**Expected:**

- ✅ Validation error
- ✅ Clear error message
- ✅ Form doesn't submit

#### Test C: Claim Already Claimed Payment

1. Try to claim a payment that's already claimed

**Expected:**

- ✅ Button disabled or error message
- ✅ No duplicate transaction
- ✅ Clear feedback to user

#### Test D: Network Issues

1. Disconnect internet briefly
2. Try to send payment

**Expected:**

- ✅ Clear error message
- ✅ Retry option
- ✅ No stuck loading states

---

### 10. Multiple Stealth Payments

**Test Steps:**

1. Generate stealth address
2. Send 5 different payments to yourself:
   - 0.001 SOL
   - 0.002 SOL
   - 0.005 SOL
   - 0.01 SOL
   - 0.001 SOL (with memo)
3. Scan for payments
4. Claim all payments one by one

**Expected:**

- ✅ All 5 payments detected
- ✅ Correct amounts shown
- ✅ All claims succeed
- ✅ Each generates unique one-time address
- ✅ Memos preserved (if added)

---

## 🎯 Priority 5: Performance & UX

### 11. Loading States

**Test:**

1. Watch for loading indicators during:
   - Wallet connection
   - Payment sending
   - Scanning
   - Claiming

**Expected:**

- ✅ Loading spinners display
- ✅ Buttons disabled during processing
- ✅ Clear feedback at each step
- ✅ No stuck states

---

### 12. Notification System

**Test:**

1. Send successful payment → Check notification
2. Claim payment → Check notification
3. Trigger error → Check notification

**Expected:**

- ✅ Beautiful slide-in notifications (not ugly alerts!)
- ✅ Auto-dismiss after 10 seconds
- ✅ Close button works
- ✅ Green for success, red for errors
- ✅ Explorer links work

---

### 13. Console Cleanliness

**Check Console:**

1. Open DevTools console
2. Navigate through all pages
3. Perform all actions

**Expected:**

- ✅ No red errors (except expected Light Protocol connection warnings)
- ✅ Informative logs for debugging
- ✅ No broken images
- ✅ No 404s for resources

**Acceptable Warnings:**

- Light Protocol connection (devnet, expected)
- Wallet adapter warnings (normal)

---

## 🎯 Priority 6: Cross-Browser Testing

### 14. Browser Compatibility

**Test on:**

- ✅ Chrome/Brave
- ✅ Safari
- ✅ Firefox
- ✅ Mobile Safari (iOS)
- ✅ Mobile Chrome (Android)

**Test Actions:**

1. Connect wallet
2. Send payment
3. Generate stealth address
4. Claim payment

**Expected:**

- ✅ Works on all browsers
- ✅ Wallet adapters load correctly
- ✅ No browser-specific bugs

---

## 🎯 Priority 7: Security Testing

### 15. Security Checks

#### Test A: Message Signing

1. Generate stealth address
2. Verify signature request is clear
3. Check no secret key exposure

**Expected:**

- ✅ Clear message shown to user
- ✅ User can read what they're signing
- ✅ No secret key in console logs

#### Test B: Transaction Verification

1. Send payment
2. Check transaction on explorer
3. Verify memo format

**Expected:**

- ✅ Memo format: `ExePay:Stealth:EPHEMERAL:VIEWTAG`
- ✅ No sensitive data exposed
- ✅ Transaction structure correct

#### Test C: Key Derivation

1. Generate stealth address twice
2. Verify same address generated

**Expected:**

- ✅ Deterministic (same address each time)
- ✅ Derived from signature consistently
- ✅ No randomness in key derivation

---

## 🎯 Priority 8: Integration Testing

### 16. Wallet Sidebar Integration

**Test Steps:**

1. Go to `/wallet` page
2. Check right sidebar (desktop)
3. Generate stealth address from sidebar
4. Verify it matches privacy page address

**Expected:**

- ✅ Sidebar displays correctly
- ✅ Generate button works
- ✅ Same address as privacy page
- ✅ "View Details" link works

---

### 17. Privacy Level Selector

**Test Steps:**

1. Go to `/wallet` page
2. Try each privacy level:
   - Public
   - Stealth
   - Light Protocol

**Expected:**

- ✅ Each option selectable
- ✅ Clear descriptions
- ✅ Visual indicators
- ✅ "WORKING NOW" badge on Stealth

---

## 📊 Testing Matrix

| Feature             | Test Status | Notes                            |
| ------------------- | ----------- | -------------------------------- |
| Public Payments     | ⏳ To Test  | Standard Solana transfers        |
| Stealth Generate    | ⏳ To Test  | Message signing                  |
| Stealth Send        | ⏳ To Test  | One-time addresses               |
| Stealth Scan        | ⏳ To Test  | View tag verification            |
| Stealth Claim       | ✅ TESTED   | **Working with real transfers!** |
| Light Protocol      | ⏳ To Test  | Devnet ready                     |
| Batch Payments      | ⏳ To Test  | Multiple recipients              |
| Recurring Payments  | ⏳ To Test  | Subscriptions                    |
| Payment Links       | ⏳ To Test  | Shareable URLs                   |
| Transaction History | ⏳ To Test  | View past payments               |
| Mobile Responsive   | ⏳ To Test  | All screen sizes                 |
| Cross-Browser       | ⏳ To Test  | Chrome, Safari, Firefox          |

---

## 🚨 Critical Tests (Must Pass Before Deployment)

### Must-Pass Tests:

1. ✅ **Stealth claim works** (PASSED!)
2. ⏳ **Public payments work**
3. ⏳ **Multiple stealth payments detected correctly**
4. ⏳ **Mobile responsive on real devices**
5. ⏳ **No console errors on critical paths**
6. ⏳ **Wallet connection stable**
7. ⏳ **All navigation links work**

### Nice-to-Have Tests:

- ⏳ Batch payments with 10+ recipients
- ⏳ Recurring payments over 24 hours
- ⏳ Payment links with QR codes
- ⏳ Transaction history with 100+ transactions

---

## 🐛 What to Look For

### Red Flags (Don't Deploy If You See):

- ❌ Transactions failing consistently
- ❌ Wallet disconnecting randomly
- ❌ Claims failing (we fixed this!)
- ❌ Pages not loading
- ❌ Critical console errors

### Yellow Flags (Fix Before Deploy):

- ⚠️ Slow loading times (>5 seconds)
- ⚠️ Confusing error messages
- ⚠️ Broken links
- ⚠️ Mobile layout issues

### Green Flags (Good to Go):

- ✅ All transactions succeed
- ✅ Fast, smooth UX
- ✅ Clear feedback messages
- ✅ No critical errors
- ✅ Mobile works well

---

## 📝 Testing Notes Template

Use this to track your testing:

```
Date: ___________
Tester: ___________

[ ] Public payments work
[ ] Stealth generate works
[ ] Stealth send works
[ ] Stealth scan works
[ ] Stealth claim works (with real transfer)
[ ] Light Protocol ready
[ ] Batch payments work
[ ] Recurring payments work
[ ] Mobile responsive
[ ] No critical errors

Issues Found:
1. ___________
2. ___________

Overall Status: [ ] Ready [ ] Needs Work
```

---

## 🎯 Recommended Testing Order

### Session 1 (Current - 15 mins):

1. ✅ Test stealth claim (DONE!)
2. ⏳ Test public payment
3. ⏳ Test 2-3 more stealth payments
4. ⏳ Verify all claims work

### Session 2 (Next - 20 mins):

1. ⏳ Test batch payments
2. ⏳ Test recurring payments
3. ⏳ Test payment links
4. ⏳ Test transaction history

### Session 3 (Final - 15 mins):

1. ⏳ Test on mobile device
2. ⏳ Test on different browser
3. ⏳ Final verification
4. ⏳ Deploy!

---

## 🚀 Quick Test (5 minutes)

**If you're short on time, test these essentials:**

1. **Send public payment** (1 min)
   - Wallet → Public → Send 0.001 SOL → Verify

2. **Send stealth payment** (2 mins)
   - Privacy → Send → Generate & send → Verify

3. **Scan & claim** (2 mins)
   - Privacy → Scan → Claim → Verify SOL transferred

**If all 3 pass:** You're good to deploy! 🚀

---

## 💡 Pro Testing Tips

### 1. Use Small Amounts

- Test with 0.001 - 0.01 SOL
- Saves money on fees
- Faster transactions

### 2. Check Console Logs

- Open DevTools
- Watch for errors
- Verify cryptographic steps

### 3. Test Edge Cases

- Empty forms
- Invalid addresses
- Insufficient balance
- Network interruptions

### 4. Mobile Testing

- Use real device (not just browser resize)
- Test touch interactions
- Verify keyboard behavior
- Check notification display

### 5. Multiple Wallets

- Test with Phantom
- Test with Solflare
- Verify all work consistently

---

## 🎊 When You're Ready to Deploy

### Deployment Command:

```bash
# Make sure you're on latest code
git pull origin main

# Deploy to Vercel
vercel --prod

# Or use Vercel dashboard
# Push to main branch → Auto-deploy
```

### Post-Deployment Checks:

1. Visit production URL
2. Test wallet connection
3. Send test payment
4. Verify everything works

### If Issues Arise:

1. Check Vercel logs
2. Verify environment variables
3. Test on staging first
4. Rollback if needed

---

## 📞 Need Help?

### Common Issues:

**"Payment not detected"**

- Generate NEW stealth address
- Old addresses won't work with latest code

**"Claim failed"**

- Check console for specific error
- Verify payment has balance
- Try hard refresh

**"Wallet won't connect"**

- Try different wallet
- Check wallet is unlocked
- Clear browser cache

**"Slow scanning"**

- Expected with many transactions
- RPC rate limiting (use custom RPC)
- Wait and retry

---

## ✅ Final Checklist Before Deploy

- [ ] All critical tests passed
- [ ] Mobile tested on real device
- [ ] No console errors on critical paths
- [ ] Documentation updated
- [ ] Environment variables configured
- [ ] Backup plan ready (rollback)
- [ ] Monitoring set up (optional)

**When all checked:** Deploy with confidence! 🚀

---

**Current Status:** Server running at `localhost:3000`  
**Ready for:** Your testing in next session  
**Then:** Deploy to production!

---

**Good luck with testing! 🎉**
