# Privacy Implementation Plan - Real ZK Proofs

## 🎯 Goal
Replace demo privacy modes with **production-ready zero-knowledge proofs** using SPL Token 2022 Confidential Transfers and Light Protocol.

---

## 📋 Current State

### What We Have (Demo Mode):
- ✅ 3-level privacy toggle (Public, Shielded, Private)
- ✅ UI for privacy selection
- ✅ Basic transaction flow
- ❌ Privacy is **simulated** (not real ZK proofs)
- ❌ Amounts are visible on-chain
- ❌ No real anonymity

### What We Need:
- ✅ Real ZK proofs (Groth16)
- ✅ Encrypted amounts on-chain
- ✅ Merkle tree for note commitments
- ✅ Nullifier set to prevent double-spending
- ✅ View keys for selective disclosure

---

## 🏗️ Architecture

### **1. SPL Token 2022 Confidential Transfers**
The official Solana solution for private token transfers.

**Features:**
- ✅ Built-in ZK proofs (Groth16)
- ✅ Encrypted amounts using ElGamal
- ✅ Audited by Solana Labs
- ✅ Works with all SPL tokens

**How it works:**
```
1. User creates confidential account
2. Deposits tokens → encrypted balance
3. Transfer → ZK proof that balance is sufficient
4. Recipient decrypts with their private key
```

**Limitations:**
- Only hides **amounts** (not sender/receiver)
- Requires Token-2022 program
- Slightly higher transaction fees

---

### **2. Light Protocol Integration**
For full anonymity (sender + receiver + amount).

**Features:**
- ✅ Compressed accounts (lower cost)
- ✅ Merkle tree for note commitments
- ✅ Nullifier set for double-spend prevention
- ✅ Full transaction graph privacy

**How it works:**
```
1. User deposits into shielded pool
2. Creates note commitment → added to Merkle tree
3. Transfer → ZK proof of note ownership + nullifier
4. Recipient can spend note with their key
```

**Advantages:**
- Full anonymity (sender, receiver, amount)
- Lower on-chain footprint
- Better privacy guarantees

---

## 📦 Implementation Phases

### **Phase 1: SPL Token 2022 Confidential Transfers** (Week 1)
Implement "Shielded" mode with encrypted amounts.

#### Tasks:
1. **Install Dependencies**
   ```bash
   pnpm add @solana/spl-token@0.4.x
   ```

2. **Create Confidential Account**
   ```typescript
   // packages/core/src/confidential.ts
   import { createAccount, createMint } from '@solana/spl-token';
   
   export async function createConfidentialAccount(
     connection: Connection,
     payer: Keypair,
     owner: PublicKey,
     mint: PublicKey
   ) {
     // Create Token-2022 account with confidential transfers enabled
     const account = await createAccount(
       connection,
       payer,
       mint,
       owner,
       undefined,
       { commitment: 'confirmed' },
       TOKEN_2022_PROGRAM_ID
     );
     
     // Enable confidential transfers
     await enableConfidentialTransfers(connection, account, owner);
     
     return account;
   }
   ```

3. **Implement Confidential Transfer**
   ```typescript
   export async function sendConfidentialTransfer(
     connection: Connection,
     sender: Keypair,
     recipient: PublicKey,
     amount: number,
     mint: PublicKey
   ) {
     // 1. Get sender's confidential account
     const senderAccount = await getConfidentialAccount(sender.publicKey, mint);
     
     // 2. Encrypt amount with recipient's public key
     const encryptedAmount = await encryptAmount(amount, recipient);
     
     // 3. Generate ZK proof that balance is sufficient
     const proof = await generateBalanceProof(senderAccount, amount);
     
     // 4. Create transfer instruction
     const ix = createConfidentialTransferInstruction(
       senderAccount,
       recipient,
       encryptedAmount,
       proof
     );
     
     // 5. Send transaction
     const tx = new Transaction().add(ix);
     return await sendAndConfirmTransaction(connection, tx, [sender]);
   }
   ```

4. **Add Decryption for Recipients**
   ```typescript
   export async function decryptBalance(
     connection: Connection,
     account: PublicKey,
     privateKey: Keypair
   ): Promise<number> {
     const accountInfo = await getAccount(connection, account);
     const encryptedBalance = accountInfo.confidentialTransferState.encryptedBalance;
     
     // Decrypt using ElGamal private key
     return await decryptElGamal(encryptedBalance, privateKey);
   }
   ```

**Outcome:** Users can send tokens with **hidden amounts** ✅

---

### **Phase 2: Light Protocol Full Privacy** (Week 2)
Implement "Private" mode with full anonymity.

#### Tasks:
1. **Install Light Protocol SDK**
   ```bash
   pnpm add @lightprotocol/stateless.js@latest
   pnpm add @lightprotocol/compressed-token@latest
   ```

2. **Create Shielded Pool**
   ```typescript
   // packages/privacy/src/light-pool.ts
   import { createRpc, Rpc } from '@lightprotocol/stateless.js';
   
   export class ShieldedPool {
     private rpc: Rpc;
     private merkleTree: MerkleTree;
     
     constructor(rpcUrl: string) {
       this.rpc = createRpc(rpcUrl);
       this.merkleTree = new MerkleTree(32); // 32 levels
     }
     
     async deposit(
       amount: number,
       owner: Keypair
     ): Promise<Note> {
       // 1. Create note commitment
       const note = await this.createNote(amount, owner.publicKey);
       
       // 2. Add to Merkle tree
       await this.merkleTree.insert(note.commitment);
       
       // 3. Deposit on-chain
       const tx = await this.rpc.compressToken({
         owner: owner.publicKey,
         amount,
         mint: NATIVE_MINT
       });
       
       return note;
     }
   }
   ```

3. **Implement Private Transfer**
   ```typescript
   export async function sendPrivateTransfer(
     pool: ShieldedPool,
     sender: Keypair,
     recipient: PublicKey,
     amount: number
   ) {
     // 1. Get sender's notes
     const notes = await pool.getNotes(sender.publicKey);
     
     // 2. Select notes that cover amount
     const inputNotes = selectNotes(notes, amount);
     
     // 3. Generate ZK proof
     const proof = await generateTransferProof({
       inputs: inputNotes,
       outputs: [{ recipient, amount }],
       merkleRoot: await pool.getMerkleRoot()
     });
     
     // 4. Create nullifiers (prevent double-spend)
     const nullifiers = inputNotes.map(note => 
       createNullifier(note, sender)
     );
     
     // 5. Send transaction
     return await pool.transfer({
       proof,
       nullifiers,
       outputCommitments: [createCommitment(recipient, amount)]
     });
   }
   ```

4. **Implement ZK Proof Generation**
   ```typescript
   // packages/privacy/src/circuits/transfer.circom
   pragma circom 2.0.0;
   
   include "poseidon.circom";
   include "merkletree.circom";
   
   template PrivateTransfer() {
     // Public inputs
     signal input merkleRoot;
     signal input nullifier;
     signal input outputCommitment;
     
     // Private inputs
     signal input amount;
     signal input secret;
     signal input merkleProof[32];
     
     // 1. Verify note ownership
     component hasher = Poseidon(2);
     hasher.inputs[0] <== amount;
     hasher.inputs[1] <== secret;
     signal commitment <== hasher.out;
     
     // 2. Verify Merkle proof
     component merkle = MerkleTreeChecker(32);
     merkle.leaf <== commitment;
     merkle.root <== merkleRoot;
     for (var i = 0; i < 32; i++) {
       merkle.pathElements[i] <== merkleProof[i];
     }
     merkle.out === 1;
     
     // 3. Compute nullifier
     component nullifierHasher = Poseidon(2);
     nullifierHasher.inputs[0] <== commitment;
     nullifierHasher.inputs[1] <== secret;
     nullifier === nullifierHasher.out;
   }
   
   component main = PrivateTransfer();
   ```

5. **Build & Export Circuits**
   ```bash
   # Install circom
   npm install -g circom
   npm install -g snarkjs
   
   # Compile circuit
   circom transfer.circom --r1cs --wasm --sym
   
   # Generate proving key
   snarkjs groth16 setup transfer.r1cs pot12_final.ptau transfer_0000.zkey
   
   # Export verification key
   snarkjs zkey export verificationkey transfer_0000.zkey verification_key.json
   ```

**Outcome:** Users can send tokens with **full anonymity** ✅

---

### **Phase 3: Integration & Testing** (Week 3)
Connect everything and test on devnet.

#### Tasks:
1. **Update Core Package**
   ```typescript
   // packages/core/src/client.ts
   export class ExePayClient {
     async sendPayment(params: {
       recipient: PublicKey;
       amount: number;
       privacyLevel: 'public' | 'shielded' | 'private';
     }) {
       switch (params.privacyLevel) {
         case 'public':
           return this.sendPublicTransfer(params);
         
         case 'shielded':
           // Real SPL Token 2022 Confidential Transfer
           return this.sendConfidentialTransfer(params);
         
         case 'private':
           // Real Light Protocol private transfer
           return this.sendPrivateTransfer(params);
       }
     }
   }
   ```

2. **Update React Hooks**
   ```typescript
   // packages/react-hooks/src/usePrivatePayment.ts
   export function usePrivatePayment() {
     const [loading, setLoading] = useState(false);
     const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>('public');
     
     const sendPayment = async (params: PaymentParams) => {
       setLoading(true);
       try {
         if (privacyLevel === 'shielded') {
           // Show proof generation progress
           setStatus('Generating ZK proof...');
           await client.sendConfidentialTransfer(params);
         } else if (privacyLevel === 'private') {
           setStatus('Creating shielded transaction...');
           await client.sendPrivateTransfer(params);
         }
       } finally {
         setLoading(false);
       }
     };
     
     return { sendPayment, loading, privacyLevel, setPrivacyLevel };
   }
   ```

3. **Update Web UI**
   ```typescript
   // apps/web/src/app/wallet/page.tsx
   const { sendPayment, loading } = usePrivatePayment();
   
   // Show real privacy indicators
   {privacyLevel === 'shielded' && (
     <div className="text-sm text-blue-600">
       ✅ Amount encrypted on-chain (SPL Token 2022)
     </div>
   )}
   
   {privacyLevel === 'private' && (
     <div className="text-sm text-green-600">
       ✅ Fully anonymous (Light Protocol)
       <div className="text-xs mt-1">
         Sender, receiver, and amount are all private
       </div>
     </div>
   )}
   ```

4. **Devnet Testing**
   ```bash
   # 1. Deploy to devnet
   solana config set --url devnet
   
   # 2. Create test accounts
   solana-keygen new -o test-wallet.json
   solana airdrop 2 test-wallet.json
   
   # 3. Test confidential transfer
   pnpm --filter @exe-pay/demo test:confidential
   
   # 4. Test private transfer
   pnpm --filter @exe-pay/demo test:private
   
   # 5. Verify on Solscan
   # - Check that amounts are encrypted
   # - Verify ZK proofs are valid
   # - Confirm no transaction graph leakage
   ```

**Outcome:** Fully functional privacy on devnet ✅

---

## 📊 Success Criteria

### **Shielded Mode (SPL Token 2022):**
- [ ] Amounts are encrypted on-chain
- [ ] Recipients can decrypt their balance
- [ ] ZK proofs verify correctly
- [ ] Works with USDC, USDT, SOL
- [ ] Transaction fees < $0.01

### **Private Mode (Light Protocol):**
- [ ] Sender is anonymous
- [ ] Receiver is anonymous
- [ ] Amount is hidden
- [ ] No transaction graph leakage
- [ ] Nullifiers prevent double-spending
- [ ] Merkle tree updates correctly

### **User Experience:**
- [ ] Privacy level clearly indicated
- [ ] Proof generation < 5 seconds
- [ ] Mobile-friendly
- [ ] Error messages are helpful
- [ ] Transaction status updates in real-time

---

## 🔒 Security Considerations

### **1. Trusted Setup**
- Use existing trusted setups (Powers of Tau)
- Document ceremony participants
- Publish verification keys

### **2. Nullifier Management**
- Store nullifiers in on-chain set
- Check for duplicates before accepting
- Implement efficient lookup (Bloom filter)

### **3. Key Management**
- Never expose private keys
- Use secure key derivation (BIP39)
- Implement view keys for auditing

### **4. Circuit Audits**
- Review circom code carefully
- Test with edge cases
- Consider external audit (Trail of Bits)

---

## 📈 Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| Proof generation time | < 5s | N/A (demo) |
| Transaction confirmation | < 2s | ~1s |
| Circuit size | < 1M constraints | TBD |
| Gas cost (shielded) | < $0.01 | ~$0.0001 |
| Gas cost (private) | < $0.05 | ~$0.0001 |

---

## 🛠️ Development Setup

### **Prerequisites:**
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Install circom
npm install -g circom snarkjs

# Install Light Protocol CLI
npm install -g @lightprotocol/cli
```

### **Environment Variables:**
```bash
# .env.local
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_LIGHT_RPC_URL=https://devnet.lightprotocol.com
NEXT_PUBLIC_ENABLE_REAL_PRIVACY=true
```

---

## 📚 Resources

### **SPL Token 2022:**
- [Confidential Transfers Guide](https://spl.solana.com/confidential-token)
- [Example Code](https://github.com/solana-labs/solana-program-library/tree/master/token/program-2022)

### **Light Protocol:**
- [Documentation](https://docs.lightprotocol.com)
- [SDK Reference](https://github.com/Lightprotocol/light-protocol)
- [Example dApps](https://github.com/Lightprotocol/example-token-escrow)

### **ZK Proofs:**
- [circom Tutorial](https://docs.circom.io)
- [snarkjs Guide](https://github.com/iden3/snarkjs)
- [Groth16 Paper](https://eprint.iacr.org/2016/260.pdf)

---

## 🚀 Let's Build!

**Ready to start?** Let me know and I'll begin implementing Phase 1! 🎯

**Estimated Timeline:**
- **Week 1:** SPL Token 2022 Confidential Transfers (Shielded mode)
- **Week 2:** Light Protocol Integration (Private mode)
- **Week 3:** Testing, optimization, documentation

**Let's make ExePay the most private payment SDK on Solana!** 🔒✨

