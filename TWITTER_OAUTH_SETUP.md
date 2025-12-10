# Twitter OAuth Setup Guide

Complete guide to enable Twitter login for instant wallet creation.

---

## 🎯 Overview

Users can sign in with Twitter to instantly create a Solana wallet - no seed phrase needed!

**How it works:**
1. User clicks "Continue with Twitter"
2. Twitter OAuth authentication
3. Deterministic wallet generated from Twitter ID
4. Wallet encrypted and stored locally
5. User can immediately use all ExePay features!

---

## 📋 Prerequisites

- Twitter Developer Account
- Vercel account (for deployment)
- 10 minutes setup time

---

## 🔧 Step 1: Create Twitter App

### 1. Go to Twitter Developer Portal
Visit: https://developer.twitter.com/en/portal/dashboard

### 2. Create New App
- Click "Create App" or "Add App"
- Choose a name: `ExePay Wallet` (or any name)
- App type: `Web App, Automated App or Bot`

### 3. Configure App Settings
In your app settings:

**User authentication settings:**
- Click "Set up"
- App permissions: `Read`
- Type of App: `Web App`
- Callback URLs:
  ```
  http://localhost:3000/api/auth/callback/twitter
  https://exepay.app/api/auth/callback/twitter
  ```
- Website URL: `https://exepay.app`

### 4. Get API Keys
Under "Keys and tokens":
- Copy `Client ID` (starts with "c2...")
- Copy `Client Secret` (long string)

---

## 🔐 Step 2: Configure Environment Variables

### Local Development (.env.local)

Add to `/Users/kingchief/Documents/EXE/.env.local`:

```bash
# Twitter OAuth
TWITTER_CLIENT_ID=your_client_id_here
TWITTER_CLIENT_SECRET=your_client_secret_here

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_here_generate_with_openssl

# Social Wallet Secret (for deterministic generation)
NEXT_PUBLIC_APP_SECRET=your_app_secret_here_generate_random

# Existing variables (keep these)
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=9569e43b-fe58-46ac-8326-5b9d08475c0c
NEXT_PUBLIC_LIGHT_RPC_URL=https://devnet.helius-rpc.com
```

### Generate Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate NEXT_PUBLIC_APP_SECRET
openssl rand -base64 32
```

---

## ☁️ Step 3: Configure Vercel

### Add Environment Variables to Vercel

1. Go to: https://vercel.com/dashboard
2. Select your `exe-payments` project
3. Click `Settings` → `Environment Variables`
4. Add these 5 new variables (select "Production"):

```
Name: TWITTER_CLIENT_ID
Value: (your Twitter client ID)
Environment: ✅ Production

Name: TWITTER_CLIENT_SECRET
Value: (your Twitter client secret)
Environment: ✅ Production

Name: NEXTAUTH_URL
Value: https://exepay.app
Environment: ✅ Production

Name: NEXTAUTH_SECRET
Value: (generated secret from openssl)
Environment: ✅ Production

Name: NEXT_PUBLIC_APP_SECRET
Value: (generated secret from openssl)
Environment: ✅ Production
```

5. Click "Save" for each
6. Trigger redeployment (or push new commit)

---

## 🧪 Step 4: Test Locally

```bash
cd /Users/kingchief/Documents/EXE

# Check environment variables
cat .env.local

# Build and start dev server
pnpm build --filter @exe-pay/web
pnpm --filter @exe-pay/web dev

# Open browser
open http://localhost:3000/wallet
```

### Test Flow:
1. Click "Continue with Twitter"
2. Authorize app on Twitter
3. Redirected back to ExePay
4. Wallet created automatically
5. Click "Unlock" and use default password (auto-generated)
6. Use all privacy features!

---

## 🎨 Features

**User Experience:**
- ✨ **Instant onboarding** - No seed phrase to write down
- 🔒 **Secure** - Wallet derived deterministically from Twitter ID
- 🔑 **Recoverable** - Can recreate wallet by signing in again
- 💾 **Local storage** - Encrypted with password
- 🚀 **Fast** - One click to get started

**Security:**
- Deterministic wallet generation (same Twitter ID = same wallet)
- Encrypted storage in browser
- No server-side key storage
- Twitter ID never leaves your servers
- App secret ensures uniqueness

**Technical:**
- OAuth 2.0 (modern, secure)
- NextAuth.js integration
- Deterministic derivation (SHA-256 + BIP39)
- HD wallet standards (m/44'/501'/0'/0')

---

## 🔒 Security Model

### How It Works:

```
Twitter ID + App Secret 
  → SHA-256 Hash
  → BIP39 Entropy
  → 12-word Mnemonic
  → HD Derivation (m/44'/501'/0'/0')
  → Solana Keypair
```

**Key Points:**
- Same Twitter ID always generates same wallet
- App secret prevents other apps from deriving same wallet
- User can export mnemonic for backup
- No server stores private keys
- Fully non-custodial

### Password Management:
- Auto-generated from Twitter ID + App Secret
- User should export backup and set custom password
- Password required to unlock wallet

---

## 🚀 Production Deployment

### Checklist:

- [ ] Twitter app created
- [ ] Callback URLs configured
- [ ] API keys obtained
- [ ] Local .env.local configured
- [ ] Vercel environment variables added
- [ ] Tested locally
- [ ] Committed and pushed
- [ ] Vercel redeployed
- [ ] Tested on live site

---

## 📊 Expected Flow

### New User Journey:

```
1. Visit exepay.app/wallet
2. Click "Continue with Twitter" (big button at top)
3. Twitter authorization popup
4. Redirected back → Wallet created
5. Click "Unlock" → Enter auto-generated password (shown once)
6. Start using ExePay privacy features!
```

### Returning User:

```
1. Visit exepay.app/wallet
2. Click "Continue with Twitter"
3. Twitter authorization
4. Wallet recreated (same keys!)
5. Unlock and use
```

---

## ⚠️ Important Notes

### For Users:
- **Export backup immediately** after Twitter login
- Save the mnemonic offline
- Set a custom password you remember
- Don't rely only on Twitter login for recovery

### For Developers:
- Keep `NEXT_PUBLIC_APP_SECRET` secure (it's public but should be unique)
- Rotate Twitter API keys regularly
- Monitor OAuth usage in Twitter dashboard
- Test callback URLs thoroughly

---

## 🐛 Troubleshooting

### "Invalid OAuth callback"
- Check callback URLs in Twitter app settings
- Must match exactly: `https://exepay.app/api/auth/callback/twitter`
- Try both http and https for local

### "Sign in failed"
- Check Twitter API keys are correct
- Verify NEXTAUTH_SECRET is set
- Check Twitter app is not suspended
- Look at server logs in Vercel

### "Wallet not created"
- Check NEXT_PUBLIC_APP_SECRET is set
- Verify NextAuth session is working
- Check browser console for errors
- Ensure crypto functions are available

### "Can't unlock wallet"
- Twitter-generated password is complex
- Check export backup for recovery phrase
- Can re-import with seed phrase and new password

---

## 📚 Documentation Links

- NextAuth.js: https://next-auth.js.org/
- Twitter OAuth 2.0: https://developer.twitter.com/en/docs/authentication/oauth-2-0
- Solana HD Wallets: https://docs.solana.com/cli/wallets/paper

---

## 🎉 Benefits

**Compared to traditional wallet creation:**

| Traditional | Twitter Login |
|-------------|---------------|
| Install extension | ❌ No extension needed |
| Write 12 words | ❌ No seed phrase to save |
| Secure storage | ❌ Auto-handled |
| 5+ minutes | ✅ 30 seconds! |
| Complex | ✅ One click |

**Perfect for:**
- 🆕 New crypto users
- 📱 Mobile users
- ⚡ Quick demos
- 🎯 Low-friction onboarding
- 🔄 Easy re-access

---

**Status:** Ready to configure! Once Twitter API keys are added, feature is live! 🚀

