# Week 3: Real Privacy with Light Protocol

## 🎯 Goal
Make the "Shielded" and "Private" privacy modes actually work using Light Protocol.

## 📋 What We'll Build

### **Phase 1: Shielded Mode (Amount Hidden)** ⏱️ 1-1.5 hours
**What it does:** Hides transaction amounts, addresses still visible

**Implementation:**
1. Create shielded transfer function in `@exe-pay/privacy`
2. Use Pedersen commitments to hide amounts
3. Generate ZK proof for amount validity
4. Update wallet page to use shielded transfers
5. Show "amount hidden" in transaction results

**Technical:**
- Light Protocol's compressed tokens
- Pedersen commitments for amount hiding
- On-chain proof verification

---

### **Phase 2: Private Mode (Everything Hidden)** ⏱️ 1-1.5 hours
**What it does:** Hides amounts, sender, receiver - full privacy

**Implementation:**
1. Create private transfer function
2. Use nullifiers to prevent double-spending
3. Generate full ZK-SNARK proofs
4. Merkle tree for note commitments
5. Update UI to show "fully private" status

**Technical:**
- zk-SNARKs (Groth16)
- Nullifier generation
- Merkle tree commitments
- Light Protocol's stateless.js

---

## 🚀 Implementation Steps

### **Step 1: Create Shielded Transfer Module** (30 min)
File: `packages/privacy/src/shielded.ts`

```typescript
export async function createShieldedTransfer(params: {
  sender: PublicKey;
  recipient: PublicKey;
  amount: number;
  token: PublicKey;
  rpc: Connection;
}): Promise<Transaction>
```

### **Step 2: Create Private Transfer Module** (30 min)
File: `packages/privacy/src/private.ts`

```typescript
export async function createPrivateTransfer(params: {
  senderNote: ShieldedNote;
  recipientAddress: Uint8Array; // Encrypted
  amount: number;
  rpc: Connection;
}): Promise<Transaction>
```

### **Step 3: Update Wallet Page** (45 min)
File: `apps/web/src/app/wallet/page.tsx`

- Connect privacy level to transfer functions
- Handle shielded/private modes
- Show appropriate UI feedback
- Display transaction results

### **Step 4: Testing & Polish** (15 min)
- Test on devnet
- Error handling
- Loading states
- Success messages

---

## ⚠️ Important Notes

### **Light Protocol Status:**
- Light Protocol is in **beta** on mainnet
- Devnet support is **full**
- We'll use devnet for testing

### **Limitations:**
- **Shielded mode:** Amount hidden, addresses visible
- **Private mode:** Full privacy, but slower (ZK proof generation)
- **Fees:** Slightly higher than public transfers

### **Fallback Strategy:**
If Light Protocol integration is complex, we'll:
1. Implement UI/UX fully
2. Create "demo mode" with simulated privacy
3. Add real ZK proofs in next iteration

---

## 🎯 Success Criteria

**Shielded Mode Working:**
- ✅ User selects "Shielded"
- ✅ Transaction amount is hidden on-chain
- ✅ Addresses still visible
- ✅ Transaction succeeds
- ✅ UI shows "Amount Hidden" badge

**Private Mode Working:**
- ✅ User selects "Private"
- ✅ Everything hidden on-chain
- ✅ ZK proof generated & verified
- ✅ Transaction succeeds
- ✅ UI shows "Fully Private" badge

---

## 📊 Expected Timeline

**Total: 2-3 hours**

- Phase 1 (Shielded): 1-1.5 hours
- Phase 2 (Private): 1-1.5 hours
- Testing & Polish: 15-30 min

---

## 🔧 Technical Stack

**Already Installed:**
- `@lightprotocol/stateless.js@^0.9.0`
- `@lightprotocol/compressed-token@^0.9.0`
- `@noble/hashes@^1.5.0`

**What We'll Use:**
- Pedersen commitments (amount hiding)
- zk-SNARKs (full privacy)
- Nullifiers (prevent double-spend)
- Merkle trees (note commitments)

---

## 🚀 Let's Start!

Ready to build real privacy? This will be the **killer feature** of ExePay! 🔒

