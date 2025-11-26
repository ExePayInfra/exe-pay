# 🔴 CRITICAL FIX - Testing Guide

## ⚠️ **IMPORTANT: Old Stealth Addresses Won't Work!**

### **Why:**
- Old addresses were generated with wallet's public key
- New system uses derived keys from signatures
- They are incompatible!

### **Solution:**
Generate a **NEW** stealth address and test with that!

---

## 🧪 **Complete Test Flow (Step-by-Step)**

### **Step 1: Clear Old Data**
1. Open browser DevTools (F12 or Cmd+Option+I)
2. Go to "Application" tab
3. Click "Local Storage" → `localhost:3000`
4. Delete `exepay_stealth_payments` (if exists)
5. Close DevTools

### **Step 2: Generate NEW Stealth Address**
1. Refresh browser (`Cmd + Shift + R`)
2. Go to `localhost:3000/privacy`
3. Click **"📬 Receive (Stealth)"** tab
4. Click **"🔐 Sign to Generate Address"** button
5. **Sign the message** in wallet popup
6. **Wait for address to generate**
7. **Copy the NEW address** (should start with `stealth:`)

**Expected Console:**
```
[Stealth Generator] Requesting signature for viewing key...
[Stealth Generator] ✓ Signature received
[Stealth Generator] ✓ Viewing key derived
[Stealth Generator] Derived public key: XXXXX
[Stealth Generator] ✓ Stealth meta-address generated
```

---

### **Step 3: Send Payment to NEW Address**
1. Click **"💸 Send (Private)"** tab
2. **Paste the NEW stealth address** from Step 2
3. Click **"Generate One-Time Address"**
4. Enter amount: `0.01` SOL
5. Click **"Send Private Payment"**
6. Confirm transaction in wallet
7. **Wait for confirmation**
8. Note the transaction signature

**Expected Console:**
```
[Stealth Address] Generated one-time address
[Stealth Address] View tag: XX
[Stealth Payment] Transaction successful: XXXXX
```

**IMPORTANT:** Note the view tag number!

---

### **Step 4: Scan for Payment**
1. Click **"🔍 Scan (Detect)"** tab
2. If needed, click **"Enable Privacy Scanning"**
3. **Sign the message** (same as Step 2)
4. Click **"Scan for Payments"**
5. **Watch console closely!**

**Expected Console:**
```
[Scanner] Found memo instruction: ...
[Scanner] Memo content: ExePay:Stealth:...
[Scanner] View tag: XX  ← Should match Step 3!
[isPaymentForUser] Expected view tag: XX  ← Should match!
[isPaymentForUser] Actual view tag: XX
[isPaymentForUser] Match? true  ← Should be TRUE!
[Scanner] ✓ Found payment for us!
[Scanner] Detected 1 stealth payments
```

**Expected UI:**
- ✅ **1 payment detected**
- ✅ Amount: 0.01 SOL
- ✅ Timestamp
- ✅ Transaction signature
- ✅ "Claim" button

---

## 🔍 **What to Check:**

### **View Tag Matching:**

**When you send (Step 3):**
```
[Stealth Address] View tag: 68
```

**When you scan (Step 4):**
```
[isPaymentForUser] Expected view tag: 68  ← Must match!
[isPaymentForUser] Actual view tag: 68
[isPaymentForUser] Match? true
```

**If they DON'T match:**
- ❌ Still using different keys
- ❌ Need more debugging

**If they DO match:**
- ✅ Keys are consistent!
- ✅ Privacy working!
- ✅ Payment detected!

---

## ⚠️ **Common Issues:**

### **Issue 1: Browser Cache**
**Symptom:** Still seeing old behavior
**Fix:** Hard refresh (`Cmd + Shift + R`)

### **Issue 2: Old Stealth Address**
**Symptom:** Using old address from before the fix
**Fix:** Generate NEW address (Step 2)

### **Issue 3: Not Signing Message**
**Symptom:** Scanner doesn't request signature
**Fix:** Refresh page, try again

---

## 📊 **Success Criteria:**

**Test is successful when:**
- ✅ Can generate NEW stealth address
- ✅ Can send payment to NEW address
- ✅ View tags match between send and scan
- ✅ Scanner detects the payment
- ✅ Payment shows in UI with "Claim" button

---

## 🐛 **If It Still Doesn't Work:**

**Tell me:**
1. What view tag was shown when sending? (Step 3)
2. What expected view tag was shown when scanning? (Step 4)
3. Do they match?
4. Any errors in console?

**This will help me debug further!**

---

## 💡 **Why This is Complex:**

**The Challenge:**
- Sender generates ephemeral key → calculates view tag
- Receiver derives viewing key from signature → calculates expected view tag
- Both must use SAME recipient key for view tags to match

**The Fix:**
- Stealth meta-address now contains DERIVED public key
- Both sender and receiver use derived keys
- View tags should match!

---

**Ready to test! Follow the steps carefully and let me know what happens!** 🚀

**Most important: Use a NEW stealth address, not an old one!**

