# 🚨 MANUAL VERCEL DEPLOYMENT GUIDE

## Issue: Vercel Not Auto-Deploying

Your changes are in GitHub but Vercel isn't picking them up automatically.

---

## ✅ SOLUTION 1: Deploy via Vercel Dashboard (EASIEST - DO THIS FIRST)

### Step-by-Step:

1. **Open Vercel Dashboard**:
   - Go to: https://vercel.com
   - Log in to your account

2. **Find Your Project**:
   - Look for `exe-payments` or `exepay` project
   - Click on it

3. **Go to Deployments Tab**:
   - Click "Deployments" at the top

4. **Find Latest Deployment**:
   - Look at the most recent deployment
   - It might be from several hours ago

5. **Trigger New Deployment**:
   - Click the **3 dots (⋮)** on any deployment
   - Click **"Redeploy"**
   - **UNCHECK** "Use existing Build Cache" ⚠️
   - Click **"Redeploy"** button

6. **Wait for Build**:
   - Watch the build logs
   - Should take 2-4 minutes
   - Wait for "Building..." → "Ready"

---

## ✅ SOLUTION 2: Deploy via Vercel CLI (If Dashboard Doesn't Work)

### Install Vercel CLI (if not installed):

```bash
npm install -g vercel
```

### Login to Vercel:

```bash
vercel login
```

### Deploy from Root Directory:

```bash
cd /Users/kingchief/Documents/EXE
vercel --prod
```

**Important**: 
- Make sure you're in the ROOT directory `/Users/kingchief/Documents/EXE`
- NOT in `apps/web`

---

## ✅ SOLUTION 3: Check Vercel Settings

### Verify These Settings in Vercel Dashboard:

1. **Project Settings** → **Git**:
   - ✅ Production Branch: `main`
   - ✅ Auto-deploy: Enabled
   - ✅ Repository: ExePayInfra/exe-pay

2. **Project Settings** → **General**:
   - ✅ Root Directory: `apps/web`
   - ✅ Framework Preset: `Next.js`
   - ✅ Build Command: `pnpm build`
   - ✅ Output Directory: (leave empty or `.next`)
   - ✅ Install Command: `cd ../.. && pnpm install`

3. **Environment Variables**:
   - ✅ `NEXT_PUBLIC_SOLANA_RPC_URL`
   - ✅ `NEXT_PUBLIC_SOLANA_NETWORK`

---

## 🔍 Troubleshooting

### If Builds Aren't Showing Up:

1. **Check GitHub Webhook**:
   - Go to: https://github.com/ExePayInfra/exe-pay/settings/hooks
   - Look for Vercel webhook
   - Should be green checkmark ✅
   - If red ❌, click "Redeliver" on recent deliveries

2. **Check Vercel Account Limits**:
   - Free tier: 100 deployments per day
   - If exceeded, wait or upgrade

3. **Force Sync**:
   - Vercel Dashboard → Project Settings → Git
   - Click "Disconnect" then "Connect" again

---

## 📋 What You Should See After Deployment:

### Homepage (https://exepay.app):
- ✅ Partner logos (Solana SVG, Phantom, Raydium icons)
- ✅ "Powered By" heading
- ✅ Privacy cards with description boxes
- ✅ Footer: "Privacy-preserving payments infrastructure"

### Wallet Page (https://exepay.app/wallet):
- ✅ Gradient background (indigo/purple)
- ✅ Beautiful centered connect card
- ✅ 2-column layout (form + sidebar)
- ✅ Balance display
- ✅ Visual token selector (4 tokens in grid)
- ✅ Privacy cards with emojis (⚡🛡️🔒)
- ✅ Sidebar with features & stats

---

## 🆘 Still Having Issues?

### Check These:

1. **Vercel Dashboard** - Any builds in progress?
2. **Build Logs** - Any error messages?
3. **GitHub Actions** - Check if CI is passing
4. **Browser Cache** - Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)

### Get Build Logs:

1. Vercel Dashboard → Project → Deployments
2. Click on the latest deployment
3. Click "View Function Logs" or "Build Logs"
4. Look for any red error messages

---

## 🎯 Quick Command Summary:

```bash
# Option 1: Push empty commit to trigger webhook
cd /Users/kingchief/Documents/EXE
git commit --allow-empty -m "chore: Force deploy" && git push

# Option 2: Deploy via CLI
cd /Users/kingchief/Documents/EXE
vercel --prod

# Option 3: Check what's in GitHub
git log --oneline -5
git remote -v
```

---

**Try Solution 1 (Vercel Dashboard) first - it's the easiest!**

Let me know what happens or if you see any errors! 🚀

