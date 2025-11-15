# 📦 NPM Publishing Guide

## **Complete Guide to Publishing ExePay Packages**

---

## 🎯 **Current Status:**

✅ **All packages configured and ready!**

- @exe-pay/core v1.0.0
- @exe-pay/privacy v1.0.0
- @exe-pay/react-hooks v1.0.0
- @exe-pay/utils v1.0.0

✅ **All tests passing:** 35/35 (100%)  
✅ **All builds successful**  
✅ **READMEs complete:** ~1,650 lines  
✅ **Metadata configured**  

---

## 📋 **Pre-Publishing Checklist:**

### **1. Verify Everything Works:**
```bash
cd /Users/kingchief/Documents/EXE

# Build all packages
pnpm build

# Run all tests
pnpm test

# Check for linter errors
pnpm lint
```

**Expected Results:**
- ✅ All packages build successfully
- ✅ 35/35 tests passing
- ✅ No linter errors

---

### **2. Create NPM Account:**

If you don't have an NPM account:

1. Go to [npmjs.com](https://www.npmjs.com/)
2. Click "Sign Up"
3. Fill in details:
   - Username: `exepay` (or your choice)
   - Email: `exechainlink@outlook.com`
   - Password: (secure password)
4. Verify email

---

### **3. Login to NPM:**

```bash
cd /Users/kingchief/Documents/EXE

# Login to NPM
npm login

# Enter your credentials:
# Username: exepay
# Password: ********
# Email: exechainlink@outlook.com
```

**Verify login:**
```bash
npm whoami
# Should output: exepay (or your username)
```

---

## 🚀 **Publishing Steps:**

### **Method 1: Publish All Packages (Recommended)**

```bash
cd /Users/kingchief/Documents/EXE

# Publish all packages
pnpm --filter @exe-pay/utils publish --access public
pnpm --filter @exe-pay/privacy publish --access public
pnpm --filter @exe-pay/core publish --access public
pnpm --filter @exe-pay/react-hooks publish --access public
```

**Note:** Publish in this order because:
- `utils` has no dependencies
- `privacy` depends on nothing
- `core` depends on `privacy` and `utils`
- `react-hooks` depends on `core`

---

### **Method 2: Publish Individual Package**

```bash
# Navigate to package
cd /Users/kingchief/Documents/EXE/packages/core

# Build
pnpm build

# Publish
npm publish --access public
```

---

## ✅ **Verify Publication:**

### **1. Check on NPM:**

Visit:
- https://www.npmjs.com/package/@exe-pay/core
- https://www.npmjs.com/package/@exe-pay/privacy
- https://www.npmjs.com/package/@exe-pay/react-hooks
- https://www.npmjs.com/package/@exe-pay/utils

You should see:
- ✅ Package name and version
- ✅ README displayed
- ✅ Keywords visible
- ✅ Repository link
- ✅ Download count (starts at 0)

---

### **2. Test Installation:**

```bash
# Create test directory
mkdir /tmp/test-exe-pay
cd /tmp/test-exe-pay

# Initialize package
npm init -y

# Install your packages
npm install @exe-pay/core @exe-pay/privacy @exe-pay/react-hooks @exe-pay/utils

# Verify installation
ls node_modules/@exe-pay/
# Should show: core  privacy  react-hooks  utils
```

---

### **3. Test Usage:**

Create `test.js`:
```javascript
const { generateElGamalKeypair, encryptAmount, decryptAmount } = require('@exe-pay/privacy');

// Test ElGamal
const keypair = generateElGamalKeypair();
const amount = 1000n;
const ciphertext = encryptAmount(amount, keypair.publicKey);
const decrypted = decryptAmount(ciphertext, keypair.privateKey);

console.log('Original:', amount);
console.log('Decrypted:', decrypted);
console.log('Match:', amount === decrypted ? '✅' : '❌');
```

Run:
```bash
node test.js
# Should output:
# Original: 1000n
# Decrypted: 1000n
# Match: ✅
```

---

## 📊 **Post-Publishing Tasks:**

### **1. Update README.md (Root)**

Add NPM badges:
```markdown
# ExePay

[![npm core](https://img.shields.io/npm/v/@exe-pay/core.svg)](https://www.npmjs.com/package/@exe-pay/core)
[![npm privacy](https://img.shields.io/npm/v/@exe-pay/privacy.svg)](https://www.npmjs.com/package/@exe-pay/privacy)
[![npm react-hooks](https://img.shields.io/npm/v/@exe-pay/react-hooks.svg)](https://www.npmjs.com/package/@exe-pay/react-hooks)
[![npm utils](https://img.shields.io/npm/v/@exe-pay/utils.svg)](https://www.npmjs.com/package/@exe-pay/utils)
```

---

### **2. Create Announcement:**

**Twitter/X Post:**
```
🎉 ExePay is now on NPM! 🚀

Privacy-first payments SDK for Solana with:
🔐 Zero-knowledge proofs
🔒 ElGamal encryption
💸 Multi-token support
📦 Batch payments
🔄 Recurring subscriptions

Install:
npm install @exe-pay/core

Docs: github.com/ExePayInfra/exe-pay

#Solana #Privacy #Web3 #ZKProofs
```

**GitHub Release:**
```markdown
# ExePay v1.0.0 - NPM Release 🎉

## What's New

ExePay packages are now available on NPM!

### Packages Published

- **@exe-pay/core** - Privacy-first payments SDK
- **@exe-pay/privacy** - ZK proofs & ElGamal encryption
- **@exe-pay/react-hooks** - React integration
- **@exe-pay/utils** - Utility functions

### Installation

\`\`\`bash
npm install @exe-pay/core
\`\`\`

### Features

- 🔐 Zero-knowledge proofs (Groth16)
- 🔒 ElGamal encryption
- 💸 Multi-token support (SOL, USDC, USDT, BONK, JUP)
- 📦 Batch payments
- 🔄 Recurring payments
- 🔗 Payment links
- 📱 QR codes
- 🌐 Mainnet ready

### Documentation

- [User Guide](docs/USER_GUIDE.md)
- [API Reference](packages/core/README.md)
- [Privacy Guide](packages/privacy/README.md)
- [React Hooks](packages/react-hooks/README.md)

### Links

- [NPM](https://www.npmjs.com/package/@exe-pay/core)
- [GitHub](https://github.com/ExePayInfra/exe-pay)
- [Live Demo](https://exe-payments-re46xgprs-exechainlink-5881s-projects.vercel.app)

### Support

- [Issues](https://github.com/ExePayInfra/exe-pay/issues)
- [Discussions](https://github.com/ExePayInfra/exe-pay/discussions)

**Full Changelog**: https://github.com/ExePayInfra/exe-pay/commits/main
\`\`\`

---

### **3. Update Documentation:**

Add to `README.md`:
```markdown
## Installation

\`\`\`bash
npm install @exe-pay/core
\`\`\`

## Quick Start

\`\`\`typescript
import { sendPayment } from '@exe-pay/core';
import { Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';

const connection = new Connection('https://api.mainnet-beta.solana.com');
const sender = Keypair.generate();

const signature = await sendPayment(connection, {
  sender,
  recipient: 'RECIPIENT_ADDRESS',
  amount: 1.5 * LAMPORTS_PER_SOL,
});

console.log('Transaction:', signature);
\`\`\`
```

---

### **4. Monitor Downloads:**

Check NPM stats:
- https://www.npmjs.com/package/@exe-pay/core
- Click "Stats" tab
- Monitor weekly downloads

Track with:
- [npm-stat.com](https://npm-stat.com/)
- [npmtrends.com](https://npmtrends.com/)

---

## 🔄 **Updating Packages:**

### **1. Update Version:**

```bash
cd /Users/kingchief/Documents/EXE/packages/core

# Update version in package.json
# 1.0.0 → 1.0.1 (patch)
# 1.0.0 → 1.1.0 (minor)
# 1.0.0 → 2.0.0 (major)

# Or use npm version
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0
```

---

### **2. Build & Test:**

```bash
pnpm build
pnpm test
```

---

### **3. Publish Update:**

```bash
npm publish --access public
```

---

### **4. Tag Release:**

```bash
git tag v1.0.1
git push --tags
```

---

## 📈 **Growth Strategy:**

### **Week 1: Launch**
- ✅ Publish to NPM
- ✅ Announce on Twitter
- ✅ Create GitHub release
- ✅ Post on Reddit (r/solana, r/crypto)
- ✅ Share on Discord (Solana, Web3)

### **Week 2: Content**
- 📝 Write blog post
- 🎥 Create tutorial video
- 📚 Write integration guides
- 💬 Engage with users

### **Week 3-4: Outreach**
- 📧 Email Solana projects
- 🤝 Reach out to wallets (Phantom, Solflare)
- 💼 Contact DeFi protocols
- 🎯 Apply for grants

### **Month 2-3: Scale**
- 📊 Track adoption metrics
- 🐛 Fix reported issues
- ✨ Add requested features
- 💰 Apply for grants

---

## 🎯 **Success Metrics:**

### **Week 1:**
- ⏳ 100+ downloads
- ⏳ 10+ GitHub stars
- ⏳ 5+ Twitter mentions

### **Month 1:**
- ⏳ 1,000+ downloads
- ⏳ 50+ GitHub stars
- ⏳ 10+ projects using ExePay

### **Month 3:**
- ⏳ 10,000+ downloads
- ⏳ 200+ GitHub stars
- ⏳ 50+ projects using ExePay
- ⏳ Grant funding secured

---

## 🐛 **Troubleshooting:**

### **"You must be logged in to publish"**
```bash
npm login
# Enter credentials
npm whoami  # Verify
```

---

### **"Package name already exists"**
- Package names are unique on NPM
- @exe-pay/core should be available
- If not, try: @exepay/core or @exe-payments/core

---

### **"403 Forbidden"**
```bash
# Make sure publishConfig is set
# In package.json:
"publishConfig": {
  "access": "public"
}

# Or publish with flag:
npm publish --access public
```

---

### **"ENOENT: no such file or directory"**
```bash
# Build first
pnpm build

# Verify dist/ folder exists
ls packages/core/dist/
```

---

## 📞 **Support:**

### **NPM Issues:**
- [NPM Support](https://www.npmjs.com/support)
- [NPM Docs](https://docs.npmjs.com/)

### **Package Issues:**
- [GitHub Issues](https://github.com/ExePayInfra/exe-pay/issues)

---

## 🎊 **Summary:**

### **You're Ready to Publish!**

**Steps:**
1. ✅ Create NPM account
2. ✅ Login: `npm login`
3. ✅ Publish: `pnpm --filter @exe-pay/* publish --access public`
4. ✅ Verify on npmjs.com
5. ✅ Announce on social media
6. ✅ Monitor downloads

**Impact:**
- 🚀 Easy developer adoption
- 💼 Professional SDK
- 💰 Grant application boost
- 📈 Community growth
- 🌟 Open-source credibility

---

**Status: 🔥 READY TO PUBLISH! 🔥**

**Next Command:**
```bash
npm login
```

**Then:**
```bash
pnpm --filter @exe-pay/utils publish --access public
pnpm --filter @exe-pay/privacy publish --access public
pnpm --filter @exe-pay/core publish --access public
pnpm --filter @exe-pay/react-hooks publish --access public
```

**Let's make ExePay the standard for private payments on Solana!** 🚀

