# 🚀 Deploy ExePay to Production

Your MVP is ready to deploy! Here are your options:

## Option 1: Vercel (Recommended - 5 minutes)

**Why Vercel?**
- Free tier available
- Automatic CI/CD from GitHub
- Perfect for Next.js
- Global CDN included

### Steps:

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login**
```bash
vercel login
```

3. **Deploy**
```bash
cd /Users/kingchief/Documents/EXE/apps/web
vercel
```

4. **Follow prompts:**
   - Link to existing project? **N**
   - Project name: **exe-pay**
   - Directory: **. (current)**
   - Modify settings? **N**

5. **Deploy to production:**
```bash
vercel --prod
```

**Done!** You'll get a URL like: `exe-pay.vercel.app`

---

## Option 2: Netlify (Alternative)

1. **Install Netlify CLI**
```bash
npm i -g netlify-cli
```

2. **Deploy**
```bash
cd /Users/kingchief/Documents/EXE/apps/web
netlify deploy --prod
```

3. **Build settings:**
   - Build command: `pnpm build`
   - Publish directory: `.next`

---

## Option 3: Railway (For Full Stack)

Great if you want to deploy both web + API together

1. Go to [railway.app](https://railway.app)
2. "New Project" → "Deploy from GitHub"
3. Select your repo
4. Add service for `apps/web`
5. Add service for `apps/api`

---

## 📝 After Deployment

### 1. Update URLs in Code

If you have a custom domain, update:
- `apps/web/src/app/page.tsx` - Links to GitHub, etc.
- `README.md` - Add live demo link

### 2. Set Up Custom Domain (Optional)

**Vercel:**
```bash
vercel domains add yourdomain.com
```

Then add DNS records as instructed.

### 3. Share Your Launch!

Post on X/Twitter:
```
🚀 Just deployed ExePay to production!

Privacy-preserving payments on Solana
⚡ Live at: https://exe-pay.vercel.app

Built with @solana @vercel
Code: https://github.com/ExePayInfra/exe-pay

#Solana #Web3 #Privacy
```

### 4. Add to Solana Ecosystem

- Submit to [solana.com/ecosystem](https://solana.com/ecosystem)
- Post in Solana Discord
- Share in /r/solana

---

## 🔧 Troubleshooting

### Build fails on Vercel

Add this to `vercel.json`:
```json
{
  "buildCommand": "cd ../.. && pnpm install && pnpm build --filter @exe-pay/web"
}
```

### Environment Variables

No env vars needed for demo mode!

For production with real payments, you'll need:
- `NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta`
- `NEXT_PUBLIC_RPC_URL=your-rpc-url`

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] App deployed
- [ ] URL working
- [ ] Screenshot taken
- [ ] Shared on social media
- [ ] Added to Solana ecosystem

---

**You're live! Time to get users!** 🎉

