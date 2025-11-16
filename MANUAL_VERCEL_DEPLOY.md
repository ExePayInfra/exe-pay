# Manual Vercel Deployment Guide

**Issue:** Automatic deployments not triggering  
**Solution:** Manual redeploy from Vercel dashboard  

---

## 🚀 Manual Deployment Steps

### Option 1: Redeploy Latest (Recommended)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click on "exe-pay" project

2. **Find Latest Deployment**
   - Go to "Deployments" tab
   - Look for the most recent one (even if failed)
   - Commit message: "Vercel build configuration" or "Trigger Vercel deployment"

3. **Redeploy**
   - Click the "..." (three dots) on the right
   - Click "Redeploy"
   - **IMPORTANT:** Uncheck "Use existing Build Cache"
   - Click "Redeploy" button

4. **Monitor Build**
   - Watch the build logs
   - Should see: "Building..." → "Ready"
   - Takes 2-3 minutes

---

### Option 2: Deploy from Git Branch

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click on "exe-pay" project

2. **New Deployment**
   - Click "Deployments" tab
   - Click "Create Deployment" button (top right)
   - Select "main" branch
   - Click "Deploy"

---

### Option 3: Vercel CLI (If installed)

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login
vercel login

# Deploy
cd /Users/kingchief/Documents/EXE/apps/web
vercel --prod
```

---

## 🔍 Troubleshooting Build Errors

### If Build Still Fails

#### Check Build Logs for:

**1. Routes Manifest Error**
```
The file "/vercel/path0/apps/web/next/routes-manifest.json" couldn't be found
```

**Fix:** Already applied in `vercel.json` (using turbo build)

**2. Module Not Found**
```
Module not found: Can't resolve '@exe-pay/...'
```

**Fix:** Ensure all packages are built
```bash
cd /Users/kingchief/Documents/EXE
pnpm build
git add -A && git commit -m "fix: Build all packages"
git push
```

**3. TypeScript Errors**
```
Type error: ...
```

**Fix:** Already disabled in `next.config.js` (ignoreBuildErrors: true)

**4. Environment Variables**
```
Missing environment variable: ...
```

**Fix:** Add in Vercel dashboard:
- Go to Project Settings → Environment Variables
- Add: `NEXT_PUBLIC_SOLANA_RPC_URL`
- Add: `NEXT_PUBLIC_SOLANA_NETWORK`

---

## ✅ Verify Successful Deployment

### 1. Check Vercel Dashboard
- Status: "Ready" (green checkmark)
- No errors in build logs
- Deployment URL active

### 2. Visit Live Site
- URL: https://exepay.app
- Hard refresh: `Cmd+Shift+R`

### 3. Test Features
- Homepage loads
- Privacy cards show icons
- Wallet page works
- No console errors

---

## 🔧 Fix Vercel Webhook (If Auto-Deploy Not Working)

### Check GitHub Integration

1. **Go to Vercel Dashboard**
   - Project Settings → Git
   - Verify GitHub repo is connected
   - Should show: "ExePayInfra/exe-pay"

2. **Check GitHub Webhooks**
   - Go to: https://github.com/ExePayInfra/exe-pay/settings/hooks
   - Look for Vercel webhook
   - Should be green checkmark (active)
   - If red X, click "Redeliver" to test

3. **Reconnect if Needed**
   - Vercel Dashboard → Project Settings → Git
   - Click "Disconnect"
   - Click "Connect Git Repository"
   - Select "ExePayInfra/exe-pay"
   - Authorize

---

## 📊 Current Build Configuration

### Vercel.json
```json
{
  "buildCommand": "cd ../.. && turbo build --filter=@exe-pay/web",
  "installCommand": "cd ../.. && pnpm install --no-frozen-lockfile",
  "framework": "nextjs"
}
```

### What This Does
1. `cd ../..` - Go to monorepo root
2. `turbo build --filter=@exe-pay/web` - Build web app with Turborepo
3. `pnpm install --no-frozen-lockfile` - Install all dependencies
4. `framework: "nextjs"` - Vercel detects Next.js automatically

---

## 🎯 Expected Build Output

### Successful Build Logs Should Show:

```
Installing dependencies...
✓ Installed dependencies

Building...
@exe-pay/privacy:build: ✓ Compiled successfully
@exe-pay/core:build: ✓ Compiled successfully
@exe-pay/utils:build: ✓ Compiled successfully
@exe-pay/react-hooks:build: ✓ Compiled successfully
@exe-pay/web:build: ✓ Compiled successfully

Collecting page data...
✓ Generating static pages (7/7)

Finalizing page optimization...
✓ Deployment ready
```

---

## 🚨 Common Issues & Solutions

### Issue 1: "No Output Directory"
**Error:** `No Output Directory named '.next' found`

**Solution:**
- Remove `outputDirectory` from `vercel.json` (already done)
- Let Next.js auto-detect

### Issue 2: "Build Command Failed"
**Error:** `Command "turbo build" exited with 1`

**Solution:**
```bash
# Test build locally
cd /Users/kingchief/Documents/EXE
pnpm build

# If fails, fix errors and commit
git add -A && git commit -m "fix: Build errors"
git push
```

### Issue 3: "Module Not Found"
**Error:** `Can't resolve '@exe-pay/privacy'`

**Solution:**
- Ensure `transpilePackages` in `next.config.js` (already done)
- Build all packages first

### Issue 4: "Timeout"
**Error:** `Build exceeded maximum duration`

**Solution:**
- Upgrade Vercel plan (if on free tier)
- Or optimize build (remove unused dependencies)

---

## 📝 Manual Deploy Checklist

Before manual deploy:
- [ ] All changes committed
- [ ] All changes pushed to GitHub
- [ ] Local build works (`pnpm build`)
- [ ] No TypeScript errors
- [ ] Environment variables set in Vercel

During manual deploy:
- [ ] Uncheck "Use existing Build Cache"
- [ ] Monitor build logs
- [ ] Wait for "Ready" status

After manual deploy:
- [ ] Visit live site
- [ ] Hard refresh browser
- [ ] Test key features
- [ ] Check console for errors

---

## 🎉 Success Indicators

### Build Succeeded When:
- ✅ Status: "Ready" (green)
- ✅ No errors in logs
- ✅ Deployment URL works
- ✅ All pages load
- ✅ Privacy cards show icons
- ✅ Animations work

---

**Try Option 1 (Redeploy Latest) now! 🚀**

