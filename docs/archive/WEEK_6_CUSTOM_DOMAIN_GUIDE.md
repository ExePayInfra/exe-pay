# 🌐 Week 6: Custom Domain Setup Guide

## 🎯 **Goal: Get ExePay on a Custom Domain**

**Recommended Domain:** `exeapp.app` or `exepay.io`  
**Time Required:** 30-60 minutes  
**Cost:** ~$10-15/year  

---

## 📋 **Step-by-Step Guide:**

### **Step 1: Buy a Domain (10 mins)**

#### **Option A: Namecheap (Recommended)**
1. Go to [https://www.namecheap.com](https://www.namecheap.com)
2. Search for your domain:
   - `exeapp.app` (~$10/year)
   - `exepay.io` (~$15/year)
   - `exepay.com` (~$12/year)
3. Add to cart and checkout
4. **Enable WhoisGuard** (free privacy protection)

#### **Option B: Google Domains**
1. Go to [https://domains.google.com](https://domains.google.com)
2. Search and buy your domain
3. Privacy protection included free

#### **Option C: Cloudflare Registrar** (Cheapest)
1. Go to [https://www.cloudflare.com/products/registrar/](https://www.cloudflare.com/products/registrar/)
2. Search and buy at cost price
3. Includes free privacy + DNSSEC

---

### **Step 2: Add Domain to Vercel (5 mins)**

1. Go to your Vercel dashboard:
   - [https://vercel.com/exechainlink-5881s-projects/exe-payments](https://vercel.com/exechainlink-5881s-projects/exe-payments)

2. Click **"Settings"** → **"Domains"**

3. Add your custom domain:
   ```
   exeapp.app
   ```

4. Vercel will show you DNS records to add:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

---

### **Step 3: Configure DNS (10 mins)**

#### **For Namecheap:**
1. Log in to Namecheap
2. Go to **Domain List** → Click **"Manage"**
3. Go to **"Advanced DNS"** tab
4. Add these records:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A Record | @ | 76.76.21.21 | Automatic |
| CNAME Record | www | cname.vercel-dns.com | Automatic |

5. **Delete** any existing A or CNAME records for @ and www

#### **For Google Domains:**
1. Go to DNS settings
2. Add custom resource records:
   - Same as above

#### **For Cloudflare:**
1. Go to DNS management
2. Add records:
   - Same as above
3. **Set proxy status to "DNS only"** (orange cloud off)

---

### **Step 4: Wait for Propagation (15-60 mins)**

DNS changes can take 5 minutes to 24 hours to propagate.

**Check status:**
```bash
# Check if DNS is working
dig exeapp.app

# Or use online tool
https://dnschecker.org
```

**Vercel will show:**
- ⏳ "Pending" (waiting for DNS)
- ✅ "Valid" (domain is working!)

---

### **Step 5: Enable HTTPS (Automatic)**

Vercel automatically provisions SSL certificates via Let's Encrypt.

**This happens automatically when DNS is valid!**

---

### **Step 6: Set as Primary Domain (Optional)**

In Vercel settings:
1. Go to **Domains**
2. Click **"..."** next to your custom domain
3. Click **"Set as Primary Domain"**

This will:
- Redirect `exe-payments-*.vercel.app` → `exeapp.app`
- Update all links to use your custom domain

---

## 🎉 **You're Done!**

Your ExePay app is now live at:
- `https://exeapp.app` ✅
- `https://www.exeapp.app` ✅

---

## 🚀 **Post-Setup: Update Links**

### **1. Update README.md:**
```markdown
**Live Demo:** [https://exeapp.app](https://exeapp.app)
```

### **2. Update GitHub Repo:**
- Go to repo settings
- Add `https://exeapp.app` as website

### **3. Update Social Media:**
- Twitter bio
- LinkedIn
- Discord
- Telegram

---

## 💡 **Pro Tips:**

### **1. Add Subdomain for API:**
```
api.exeapp.app → Your API server
```

### **2. Add Subdomain for Docs:**
```
docs.exeapp.app → Documentation site
```

### **3. Add Email Forwarding:**
Most registrars offer free email forwarding:
```
hello@exeapp.app → your-email@gmail.com
```

---

## 🐛 **Troubleshooting:**

### **Issue: Domain not working after 1 hour**

**Solution 1: Check DNS records**
```bash
dig exeapp.app
```
Should show: `76.76.21.21`

**Solution 2: Clear DNS cache**
```bash
# Mac/Linux
sudo dscacheutil -flushcache

# Windows
ipconfig /flushdns
```

**Solution 3: Check Vercel status**
- Go to Vercel dashboard
- Check domain status
- Click "Refresh" if needed

### **Issue: SSL certificate not provisioning**

**Wait 5-10 minutes** after DNS is valid.

If still not working:
1. Remove domain from Vercel
2. Wait 5 minutes
3. Re-add domain

---

## 📊 **Cost Breakdown:**

| Item | Cost | Frequency |
|------|------|-----------|
| Domain (.app) | $10-15 | Per year |
| Vercel Hosting | $0 | Free (Hobby plan) |
| SSL Certificate | $0 | Free (Let's Encrypt) |
| DNS | $0 | Free |
| **Total** | **$10-15** | **Per year** |

**That's less than $2/month!** 🎉

---

## 🎯 **Alternative Domain Ideas:**

If `exeapp.app` is taken:

### **Premium Options:**
- `exepay.io` (~$15/year)
- `exepay.com` (~$12/year)
- `exepay.xyz` (~$5/year)

### **Creative Options:**
- `exe.money` (~$20/year)
- `exe.cash` (~$25/year)
- `pay.exe.app` (subdomain)

### **Budget Options:**
- `exepay.dev` (~$12/year)
- `exepay.tech` (~$8/year)
- `exepay.app` (~$10/year)

---

## 🚀 **Next Steps After Domain Setup:**

### **1. Update Marketing Materials:**
- [ ] Update README with new URL
- [ ] Update GitHub repo website
- [ ] Update social media bios
- [ ] Create business cards (optional)

### **2. Set Up Analytics (Optional):**
- [ ] Google Analytics
- [ ] Vercel Analytics (free)
- [ ] Plausible (privacy-focused)

### **3. Set Up Monitoring (Optional):**
- [ ] UptimeRobot (free)
- [ ] Better Uptime
- [ ] Vercel monitoring (built-in)

### **4. Apply for Grants:**
Now that you have a custom domain, you look more professional!
- [ ] Solana Foundation
- [ ] Light Protocol
- [ ] Gitcoin

---

## 🎉 **Congratulations!**

With a custom domain, ExePay looks **10x more professional**!

**Before:** `exe-payments-eeuhovhkz-exechainlink-5881s-projects.vercel.app`  
**After:** `exeapp.app` ✨

**This makes a HUGE difference for:**
- 🎯 Investor pitches
- 🚀 Grant applications
- 💼 Partnership discussions
- 📱 Social media sharing
- 🌐 SEO and branding

---

## 💬 **Need Help?**

If you run into issues:
1. Check Vercel's domain docs: [https://vercel.com/docs/concepts/projects/domains](https://vercel.com/docs/concepts/projects/domains)
2. Check your registrar's DNS docs
3. Ask in Vercel Discord: [https://vercel.com/discord](https://vercel.com/discord)

---

**Ready to buy your domain?** Go for it! 🚀

**Total time:** 30-60 minutes  
**Total cost:** $10-15/year  
**Impact:** HUGE! 💪

