# Week 1: Production Privacy - Action Plan

**Goal**: Move from demo mode to production-ready ZK proofs  
**Status**: Setup infrastructure ready, awaiting manual circom installation  
**Time Required**: 2-4 hours

---

## 🎯 What We're Doing

Currently, ExePay uses **mock ZK proofs** for testing. We need to:
1. Install the circom compiler
2. Compile our ZK circuits
3. Generate cryptographic keys
4. Enable real proofs in the code
5. Remove "Demo Mode" labels
6. Test everything

---

## ✅ What's Already Done

- ✅ ZK circuits written (`range_proof.circom`, `balance_proof.circom`)
- ✅ Proof generation code ready (`packages/privacy/src/proofs/groth16.ts`)
- ✅ Setup script created (`packages/privacy/circuits/setup-circuits.sh`)
- ✅ Complete documentation written
- ✅ All committed to GitHub

---

## 🚀 Step-by-Step Instructions

### Step 1: Install circom (5-10 minutes)

**Option A: Via Homebrew (Easiest)**
```bash
brew install circom
circom --version
```

**Option B: Via Rust (If Homebrew fails)**
```bash
# Install Rust first
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Install circom
git clone https://github.com/iden3/circom.git
cd circom
cargo build --release
cargo install --path circom
circom --version
```

**See full instructions**: `docs/guides/INSTALL_CIRCOM.md`

---

### Step 2: Install snarkjs (1 minute)

```bash
cd /Users/kingchief/Documents/EXE
pnpm add -D snarkjs
```

---

### Step 3: Run Setup Script (30-60 minutes)

```bash
cd /Users/kingchief/Documents/EXE/packages/privacy/circuits
./setup-circuits.sh
```

**What this does:**
- Downloads Powers of Tau file (~200MB)
- Compiles both circuits
- Generates proving keys
- Generates verification keys
- Verifies everything worked

**Expected output**: "🎉 Setup complete! All circuits compiled and keys generated."

---

### Step 4: Enable Real Proofs (1 minute)

```bash
# Open the file
code packages/privacy/src/proofs/groth16.ts

# Change line 21 from:
const USE_MOCK_PROOFS = true;

# To:
const USE_MOCK_PROOFS = false;

# Save the file
```

---

### Step 5: Test Real Proofs (5 minutes)

```bash
cd /Users/kingchief/Documents/EXE

# Run tests
pnpm --filter @exe-pay/privacy test

# Expected: All tests pass ✅
```

---

### Step 6: Remove Demo Mode Labels (10 minutes)

#### 6.1 Update Wallet Page

```bash
code apps/web/src/app/wallet/page.tsx
```

**Find (around line 145):**
```typescript
{level === 'shielded' && 'Hidden amount (Demo)'}
{level === 'private' && 'Fully private (Demo)'}
```

**Replace with:**
```typescript
{level === 'shielded' && 'Hidden amount'}
{level === 'private' && 'Fully private'}
```

**Find (around line 160):**
```typescript
<span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full border border-amber-300">
  DEMO MODE
</span>
```

**Replace with:**
```typescript
<span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full border border-green-300">
  PRODUCTION
</span>
```

#### 6.2 Update Documentation

```bash
code apps/docs/src/app/guide/privacy-modes/page.tsx
```

**Remove all "(Demo)" text from:**
- Shielded mode description
- Private mode description
- Code examples

---

### Step 7: Test in Web App (15 minutes)

```bash
# Start dev server
cd /Users/kingchief/Documents/EXE
pnpm --filter @exe-pay/web dev

# Open browser
open http://localhost:3000/wallet
```

**Test each mode:**
1. ✅ Public transfer (should work as before)
2. ✅ Shielded transfer (now with real ZK proofs - will take 1-3 seconds)
3. ✅ Private transfer (now with real ZK proofs - will take 1-3 seconds)

**Look for in console:**
- "Generating proof..." (not "Using mock proof")
- No errors
- Transaction succeeds

---

### Step 8: Commit and Deploy (5 minutes)

```bash
cd /Users/kingchief/Documents/EXE

# Commit all changes
git add -A
git commit -m "feat: 🔐 Enable production ZK proofs

- Compiled range_proof and balance_proof circuits
- Generated proving and verification keys  
- Disabled mock proofs (USE_MOCK_PROOFS = false)
- Removed 'Demo Mode' labels from UI
- Updated documentation to reflect production status
- Tested on devnet successfully

Privacy is now REAL, not simulated! 🎉"

# Push to GitHub (triggers Vercel deployment)
git push origin main
```

---

### Step 9: Verify Production Deployment (5 minutes)

```bash
# Wait 2-3 minutes for Vercel to deploy
# Then visit:
open https://exepay.app/wallet

# Test a shielded transfer on mainnet
# Verify it works!
```

---

## 📊 Expected Results

### Before (Demo Mode)
- ⚠️ Mock proofs (instant, not real cryptography)
- ⚠️ "Demo Mode" labels everywhere
- ⚠️ Not production-ready

### After (Production Mode)
- ✅ Real Groth16 ZK-SNARKs
- ✅ Cryptographically secure
- ✅ "Production" badges
- ✅ Ready to launch!

---

## 🐛 Troubleshooting

### "circom: command not found"
- Run: `brew install circom`
- Or follow: `docs/guides/INSTALL_CIRCOM.md`

### "powersOfTau download fails"
- Download manually:
```bash
cd packages/privacy/circuits
curl -o powersOfTau28_hez_final_12.ptau https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_12.ptau
```

### "Circuit compilation fails"
- Check circom version: `circom --version` (should be 2.1.x)
- Check circuit syntax: `circom range_proof.circom --r1cs`

### "Proof generation is slow"
- **This is normal!** Real ZK proofs take 1-5 seconds
- Mock proofs were instant, real proofs are slower
- This is expected cryptographic overhead

### "Tests fail"
- Make sure circuits compiled successfully
- Check that all `.wasm` and `.zkey` files exist
- Run: `ls packages/privacy/circuits/*.wasm`

---

## ⏱️ Time Breakdown

- ✅ **Step 1** (circom install): 5-10 minutes
- ✅ **Step 2** (snarkjs install): 1 minute
- ⏳ **Step 3** (compile circuits): 30-60 minutes (automated)
- ✅ **Step 4** (enable proofs): 1 minute
- ✅ **Step 5** (test): 5 minutes
- ✅ **Step 6** (remove labels): 10 minutes
- ✅ **Step 7** (test web app): 15 minutes
- ✅ **Step 8** (commit): 5 minutes
- ✅ **Step 9** (verify): 5 minutes

**Total**: 2-4 hours (most time is automated compilation)

---

## 🎉 Success Criteria

You'll know it's working when:
- ✅ `circom --version` shows 2.1.x
- ✅ Setup script completes without errors
- ✅ All tests pass
- ✅ Console shows "Generating proof..." (not "mock proof")
- ✅ Shielded transfers work (take 1-3 seconds)
- ✅ Private transfers work (take 1-3 seconds)
- ✅ No "Demo Mode" labels in UI
- ✅ "PRODUCTION" badge shows instead
- ✅ Works on live site (exepay.app)

---

## 📚 Reference Documents

- **Complete Guide**: `docs/guides/PRODUCTION_PRIVACY_SETUP.md`
- **Install Instructions**: `docs/guides/INSTALL_CIRCOM.md`
- **Setup Script**: `packages/privacy/circuits/setup-circuits.sh`
- **Circuits**: `packages/privacy/circuits/*.circom`
- **Proof Code**: `packages/privacy/src/proofs/groth16.ts`

---

## 🚀 After Week 1

Once privacy is production-ready, move to:
- **Week 2**: Metrics dashboard, enhanced docs
- **Week 3**: NPM publishing, developer tools
- **Week 4**: Marketing, community, launch

See: `docs/LAUNCH_ROADMAP.md`

---

## 💡 Pro Tips

1. **Run Step 3 overnight** if your machine is slow (circuit compilation is CPU-intensive)
2. **Keep terminal open** during compilation to see progress
3. **Don't worry about slow proofs** - 1-5 seconds is normal for real cryptography
4. **Test on devnet first** before mainnet
5. **Commit frequently** to save progress

---

**Ready to make privacy REAL? Let's do this! 🔐**

**Start with Step 1**: Install circom
```bash
brew install circom
```

