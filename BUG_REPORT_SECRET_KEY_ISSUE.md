# Critical Issue: Secret Key Access for Privacy Features

## 🔴 **CRITICAL BLOCKER**

**Status:** BLOCKED  
**Priority:** P0  
**Impact:** Cannot claim stealth payments

---

## 📋 **Problem Summary**

The stealth address system requires the recipient's **secret key** to:
1. Verify payment ownership (view tag matching)
2. Derive private key for claiming funds

However, **Solana wallets do not expose secret keys** for security reasons.

---

## 🔍 **Current Behavior**

### **What Works:**
✅ Generating stealth meta-addresses  
✅ Sending payments to stealth addresses  
✅ Storing ephemeral keys in memos  
✅ Detecting payments with memos  

### **What Doesn't Work:**
❌ Verifying payment ownership (view tag mismatch)  
❌ Claiming payments (keypair derivation fails)  
❌ Real privacy (using placeholder keys)

---

## 🐛 **Technical Details**

### **The Flow:**

**Sender (Working):**
```typescript
1. Get recipient's stealth meta-address
2. Generate ephemeral keypair
3. Derive shared secret: ECDH(ephemeral_secret, recipient_public)
4. Derive stealth address: recipient_public + hash(shared_secret)
5. Calculate view tag: shared_secret[0]
6. Send payment to stealth address
7. Store ephemeral_public + view_tag in memo
```

**Receiver (Broken):**
```typescript
1. Scan blockchain for memos
2. Parse ephemeral_public + view_tag
3. ❌ Need recipient_secret to derive shared secret
4. ❌ Derive shared secret: ECDH(recipient_secret, ephemeral_public)
5. ❌ Verify view tag matches
6. ❌ Derive private key for claiming
```

### **The Problem:**
```typescript
// We need this:
const recipientSecret = wallet.getSecretKey(); // ❌ Doesn't exist!

// We're using this:
const recipientSecret = new Uint8Array(64); // ❌ Placeholder (all zeros)
```

---

## 💡 **Possible Solutions**

### **Option 1: Message Signing Approach** ⭐ **RECOMMENDED**

**Concept:** Use wallet's `signMessage` to derive deterministic keys

```typescript
// Derive viewing key from signature
const message = "ExePay Stealth Viewing Key";
const signature = await wallet.signMessage(message);
const viewingKey = keccak_256(signature);

// Use this for ECDH
const sharedSecret = ECDH(viewingKey, ephemeralPublic);
```

**Pros:**
- ✅ Works with all wallets
- ✅ Deterministic (same signature each time)
- ✅ No secret key exposure
- ✅ Can implement today

**Cons:**
- ⚠️ Requires user to sign message for scanning
- ⚠️ Different from standard stealth address spec

**Effort:** 2-3 hours

---

### **Option 2: Custodial Viewing Keys**

**Concept:** Generate separate viewing keypair, store encrypted

```typescript
// One-time setup
const viewingKeypair = Keypair.generate();
const encrypted = encryptWithWallet(viewingKeypair.secretKey);
localStorage.setItem('viewing_key', encrypted);

// For scanning
const viewingKey = decryptWithWallet(encrypted);
```

**Pros:**
- ✅ Standard stealth address implementation
- ✅ No signature required for each scan
- ✅ Better UX

**Cons:**
- ⚠️ Viewing key stored locally (security risk)
- ⚠️ Lose localStorage = lose ability to detect payments
- ⚠️ More complex implementation

**Effort:** 4-5 hours

---

### **Option 3: On-Chain Encrypted Keys**

**Concept:** Store encrypted viewing key on-chain

```typescript
// One-time setup
const viewingKeypair = Keypair.generate();
const encrypted = encryptWithPublicKey(viewingKeypair.secretKey, wallet.publicKey);
await storeOnChain(encrypted);

// For scanning
const encrypted = await fetchFromChain();
const viewingKey = decryptWithWallet(encrypted);
```

**Pros:**
- ✅ Can recover from any device
- ✅ Standard implementation
- ✅ Better security than localStorage

**Cons:**
- ⚠️ Requires on-chain program
- ⚠️ Transaction fees for setup
- ⚠️ Complex implementation

**Effort:** 10-15 hours

---

### **Option 4: Simplified Detection (Current Demo)**

**Concept:** Detect all stealth payments, let user manually verify

```typescript
// Detect ANY payment with ExePay:Stealth memo
const allStealthPayments = scanForMemos();

// User manually checks if payment is theirs
// (by checking if they can spend from the address)
```

**Pros:**
- ✅ Works now
- ✅ No secret key needed
- ✅ Simple implementation

**Cons:**
- ❌ Not real privacy (detects all payments)
- ❌ Poor UX
- ❌ Can't auto-verify ownership

**Effort:** 0 hours (already implemented)

---

## 🎯 **Recommended Approach**

**Phase 1: Message Signing (Immediate - 2-3 hours)**
- Implement Option 1
- Use `signMessage` for key derivation
- Document the approach
- Test end-to-end

**Phase 2: Custodial Keys (Later - 4-5 hours)**
- Implement Option 2
- Better UX (no signature per scan)
- Encrypted localStorage storage
- Backup/recovery flow

**Phase 3: On-Chain (Future - 10-15 hours)**
- Implement Option 3
- Full decentralization
- Multi-device support
- Production-ready

---

## 📝 **Implementation Plan (Option 1)**

### **Step 1: Add Message Signing**
```typescript
// In StealthPaymentScanner.tsx
const deriveViewingKey = async (wallet) => {
  const message = new TextEncoder().encode("ExePay Stealth Viewing Key v1");
  const signature = await wallet.signMessage(message);
  return keccak_256(signature);
};
```

### **Step 2: Update Scanner**
```typescript
// Use derived key for ECDH
const viewingKey = await deriveViewingKey(wallet);
const sharedSecret = ECDH(viewingKey, ephemeralPublic);
const expectedViewTag = sharedSecret[0];
```

### **Step 3: Update Sender**
```typescript
// Sender also needs to use derived key
const recipientViewingKey = derivePublicKeyFromSignature(metaAddress);
const sharedSecret = ECDH(ephemeralSecret, recipientViewingKey);
```

### **Step 4: Update Claim**
```typescript
// Derive spending key from signature
const spendingKey = await deriveSpendingKey(wallet);
const claimKeypair = deriveFromSharedSecret(spendingKey, sharedSecret);
```

---

## ⚠️ **Security Considerations**

### **Option 1 (Message Signing):**
- ✅ No secret key exposure
- ✅ Wallet controls signing
- ⚠️ Signature is deterministic (same each time)
- ⚠️ If signature leaks, viewing privacy compromised

### **Best Practices:**
1. Use unique message per application
2. Include version number in message
3. Document signature purpose clearly
4. Consider adding timestamp/nonce for rotation

---

## 🧪 **Testing Plan**

1. **Test message signing** with Phantom, Solflare
2. **Verify deterministic** signatures (same each time)
3. **Test ECDH** with derived keys
4. **Verify view tag** matching
5. **Test claiming** with derived keys
6. **End-to-end flow** with real transactions

---

## 📊 **Current Status**

**Completed:**
- ✅ Stealth address generation
- ✅ Payment sending with memos
- ✅ Memo parsing
- ✅ Basic detection logic

**Blocked:**
- ❌ Payment ownership verification
- ❌ Claiming functionality
- ❌ Real privacy

**Next Steps:**
1. Implement Option 1 (message signing)
2. Test with real wallet
3. Document approach
4. Update UI with signing flow

---

## 💬 **User Communication**

**What to tell users:**
> "To detect and claim private payments, ExePay needs to derive a viewing key from your wallet. You'll be asked to sign a message once - this doesn't give us access to your funds, only the ability to detect payments sent to you."

---

## 🔗 **References**

- [Monero Stealth Addresses](https://www.getmonero.org/resources/moneropedia/stealthaddress.html)
- [Zcash Viewing Keys](https://z.cash/technology/viewing-keys/)
- [Solana Wallet Adapter - signMessage](https://github.com/solana-labs/wallet-adapter)

---

**Estimated Time to Fix:** 2-3 hours (Option 1)  
**Estimated Time to Production:** 4-5 hours (Option 2)  
**Estimated Time to Perfect:** 10-15 hours (Option 3)

---

**Decision Required:** Which option should we implement?

