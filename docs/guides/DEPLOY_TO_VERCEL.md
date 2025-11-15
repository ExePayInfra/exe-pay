# 🚀 Deploy ExePay to Vercel - Quick Guide

## ⚡ 5-Minute Deployment

### Step 1: Deploy to Vercel

```bash
cd /Users/kingchief/Documents/EXE
vercel --prod
```

**When prompted:**
1. "Set up and deploy?" → **Yes**
2. "Which scope?" → Select your account
3. "Link to existing project?" → **Yes** (if you deployed before) or **No** (first time)
4. "Project name?" → **exe-pay** (or keep existing)
5. "In which directory is your code?" → **./apps/web**
6. "Want to modify settings?" → **No**

### Step 2: Add Environment Variables

After deployment, add your mainnet RPC:

```bash
# Add network setting
vercel env add NEXT_PUBLIC_SOLANA_NETWORK production
# When prompted, enter: mainnet-beta

# Add RPC URL
vercel env add NEXT_PUBLIC_SOLANA_RPC_URL production
# When prompted, enter: https://mainnet.helius-rpc.com/?api-key=YOUR_KEY
```

### Step 3: Redeploy with Environment Variables

```bash
vercel --prod
```

---

## ✅ Verification Checklist

After deployment, visit your Vercel URL and check:

- [ ] Homepage loads with new blue/cyan colors
- [ ] Wallet page works
- [ ] Can connect Phantom wallet
- [ ] Can send a test payment (0.001 SOL)
- [ ] Transaction confirms successfully
- [ ] Batch payments page loads
- [ ] Recurring payments page loads
- [ ] Payment links page works
- [ ] Transaction history loads

---

## 🔗 Your Live URLs

After deployment, you'll get:
- **Production URL**: `https://exe-pay-[random].vercel.app`
- **Custom domain** (optional): Can add later in Vercel dashboard

---

## 🐛 Troubleshooting

### "Build failed"
- Check the Vercel logs
- Make sure all packages are installed: `pnpm install`
- Try building locally first: `pnpm build --filter @exe-pay/web`

### "Environment variables not working"
- Make sure you added them to **production** environment
- Redeploy after adding env vars
- Check they're visible in Vercel dashboard → Settings → Environment Variables

### "Wallet won't connect"
- Make sure `NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta`
- Check your Phantom wallet is on mainnet
- Try disconnecting and reconnecting

---

## 📊 Post-Deployment

### 1. Test Everything
- Send a real payment to yourself
- Try all features
- Check on mobile

### 2. Share Your URL
- Add to GitHub README
- Post on social media
- Include in demo video

### 3. Monitor
- Check Vercel Analytics (free)
- Watch for errors in Vercel logs
- Monitor RPC usage on Helius

---

## 🎯 Next Steps After Deployment

1. ✅ Refresh your browser to see new blue/cyan colors
2. ✅ Deploy to Vercel (5 min)
3. 🎬 Record demo video (30 min)
4. 📱 Post on social media (15 min)
5. 💰 Apply for grants (1 hour)

---

**Ready to deploy? Run the command above!** 🚀

