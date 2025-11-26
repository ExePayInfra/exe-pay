# Production Privacy Setup Guide

**Goal**: Move ExePay from demo mode to production-ready privacy with real ZK-SNARKs

**Estimated Time**: 2-4 hours (depending on your machine speed)

---

## 📋 Overview

Currently, ExePay uses **mock ZK proofs** for development and testing. To launch with real privacy, we need to:

1. Install ZK circuit compiler (circom)
2. Compile the circuits
3. Generate proving and verification keys
4. Update the code to use real proofs
5. Test everything end-to-end

---

## 🛠️ Step 1: Install circom Compiler

### Option A: Install via Rust (Recommended)

```bash
# Install Rust if you don't have it
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Clone and install circom
git clone https://github.com/iden3/circom.git
cd circom
cargo build --release
cargo install --path circom

# Verify installation
circom --version
```

### Option B: Use Pre-built Binary (Faster)

**For macOS (ARM64 - M1/M2/M3)**:
```bash
# Download latest release
curl -L https://github.com/iden3/circom/releases/download/v2.1.6/circom-macos-arm64 -o circom
chmod +x circom
sudo mv circom /usr/local/bin/

# Verify
circom --version
```

**For macOS (Intel)**:
```bash
curl -L https://github.com/iden3/circom/releases/download/v2.1.6/circom-macos-amd64 -o circom
chmod +x circom
sudo mv circom /usr/local/bin/
circom --version
```

---

## 🔧 Step 2: Install snarkjs

```bash
# Navigate to project root
cd /Users/kingchief/Documents/EXE

# Install snarkjs as dev dependency
pnpm add -D snarkjs

# Verify installation
npx snarkjs --version
```

---

## 🚀 Step 3: Run Setup Script

```bash
# Navigate to circuits directory
cd packages/privacy/circuits

# Run the setup script
./setup-circuits.sh
```

**What this script does:**
1. ✅ Checks for circom and snarkjs
2. ✅ Downloads Powers of Tau file (if needed)
3. ✅ Compiles `range_proof.circom`
4. ✅ Compiles `balance_proof.circom`
5. ✅ Generates proving keys
6. ✅ Generates verification keys
7. ✅ Verifies all files were created

**Expected output:**
```
🚀 ExePay ZK Circuits Setup
==============================

📦 Checking dependencies...
✅ Dependencies OK

📥 Checking Powers of Tau file...
✅ Powers of Tau file exists

🔨 Compiling range_proof.circom...
✅ Range proof circuit compiled

🔨 Compiling balance_proof.circom...
✅ Balance proof circuit compiled

🔑 Generating range proof keys...
✅ Range proof keys generated

🔑 Generating balance proof keys...
✅ Balance proof keys generated

🧹 Cleaning up...
✅ Cleanup complete

📋 Verifying generated files...
✅ range_proof.r1cs
✅ range_proof.wasm
✅ range_proof.zkey
✅ range_proof_verification_key.json
✅ range_proof_js/range_proof.wasm
✅ balance_proof.r1cs
✅ balance_proof.wasm
✅ balance_proof.zkey
✅ balance_proof_verification_key.json
✅ balance_proof_js/balance_proof.wasm

🎉 Setup complete! All circuits compiled and keys generated.
```

---

## 📝 Step 4: Enable Real Proofs

Update the code to use real proofs instead of mocks:

```bash
# Open the groth16.ts file
code packages/privacy/src/proofs/groth16.ts
```

**Change line 21 from:**
```typescript
const USE_MOCK_PROOFS = true;
```

**To:**
```typescript
const USE_MOCK_PROOFS = false;
```

---

## 🧪 Step 5: Test Real Proofs

```bash
# Navigate to project root
cd /Users/kingchief/Documents/EXE

# Run privacy module tests
pnpm --filter @exe-pay/privacy test

# Expected output:
# ✅ Range proof generation
# ✅ Range proof verification
# ✅ Balance proof generation
# ✅ Balance proof verification
```

---

## 🎨 Step 6: Remove Demo Mode Labels

Update UI components to remove "Demo Mode" warnings:

### 6.1 Update Wallet Page

```bash
# Open wallet page
code apps/web/src/app/wallet/page.tsx
```

**Find and remove these lines:**
```typescript
{level === 'shielded' && 'Hidden amount (Demo)'}
{level === 'private' && 'Fully private (Demo)'}
```

**Replace with:**
```typescript
{level === 'shielded' && 'Hidden amount'}
{level === 'private' && 'Fully private'}
```

**Also remove the "DEMO MODE" badge:**
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

### 6.2 Update Documentation

```bash
# Update privacy modes guide
code apps/docs/src/app/guide/privacy-modes/page.tsx
```

**Remove all "(Demo)" references and update descriptions to reflect production status.**

---

## 🌐 Step 7: Test on Devnet

```bash
# Start the web app
pnpm --filter @exe-pay/web dev

# Open browser
open http://localhost:3000/wallet
```

**Test each privacy mode:**
1. ✅ Public transfer (should work as before)
2. ✅ Shielded transfer (now with real ZK proofs!)
3. ✅ Private transfer (now with real ZK proofs!)

**What to check:**
- Proof generation takes 1-3 seconds (real proofs are slower than mocks)
- No errors in console
- Transaction succeeds on devnet
- Privacy level is respected

---

## 🚀 Step 8: Deploy to Production

Once everything works on devnet:

```bash
# Commit changes
git add -A
git commit -m "feat: 🔐 Enable production ZK proofs

- Compiled range_proof and balance_proof circuits
- Generated proving and verification keys
- Disabled mock proofs (USE_MOCK_PROOFS = false)
- Removed 'Demo Mode' labels from UI
- Updated documentation to reflect production status
- Tested on devnet successfully"

# Push to GitHub (triggers Vercel deployment)
git push origin main
```

---

## 🐛 Troubleshooting

### Issue: "circom: command not found"
**Solution**: Install circom using Option A or B above

### Issue: "powersOfTau file download fails"
**Solution**: Download manually:
```bash
cd packages/privacy/circuits
curl -o powersOfTau28_hez_final_12.ptau https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_12.ptau
```

### Issue: "Circuit compilation fails"
**Solution**: Check circom syntax:
```bash
cd packages/privacy/circuits
circom range_proof.circom --r1cs --wasm --sym -o ./
# Check for syntax errors in the output
```

### Issue: "Proof generation is very slow"
**Expected behavior**: Real ZK proofs take 1-5 seconds to generate (much slower than mocks)
**Solution**: This is normal! You can optimize by:
- Using smaller circuits (fewer constraints)
- Running on a faster machine
- Using GPU acceleration (advanced)

### Issue: "Proof verification fails"
**Solution**: Check that:
1. Circuit was compiled correctly
2. Keys were generated correctly
3. Input values are valid (e.g., amount < max_amount)

---

## 📊 Performance Expectations

### Mock Proofs (Current)
- Generation time: <1ms
- Verification time: <1ms
- File size: ~100 bytes

### Real Proofs (Production)
- Generation time: 1-5 seconds
- Verification time: 10-50ms
- File size: ~256 bytes

**This is normal!** Real cryptography takes time. Users will see a "Generating proof..." loading state.

---

## ✅ Success Criteria

You'll know it's working when:
- ✅ Setup script completes without errors
- ✅ All test files exist in `circuits/` directory
- ✅ Tests pass with `USE_MOCK_PROOFS = false`
- ✅ Shielded transfers work on devnet
- ✅ Private transfers work on devnet
- ✅ No "Demo Mode" labels in UI
- ✅ Console logs show "Generating proof..." (not "Using mock proof")

---

## 🎯 Next Steps After Production Privacy

Once privacy is production-ready:
1. ✅ **Phase 2**: Add metrics dashboard
2. ✅ **Phase 3**: Publish to NPM
3. ✅ **Phase 4**: Launch marketing

See `docs/LAUNCH_ROADMAP.md` for the full plan.

---

## 📞 Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Review circom docs: https://docs.circom.io/
3. Review snarkjs docs: https://github.com/iden3/snarkjs
4. Check the test files for examples

---

**Estimated Total Time**: 2-4 hours
- circom installation: 15-30 minutes
- Circuit compilation: 30-60 minutes
- Key generation: 30-60 minutes
- Testing: 30-60 minutes

**Let's make privacy real! 🔐**

