# 🌐 Custom Domain Setup Guide - ExePay

## 💰 **Domain Costs (Annual Pricing):**

### **Popular Domain Options:**

| Domain             | Registrar      | First Year | Renewal | Total (Year 1) |
| ------------------ | -------------- | ---------- | ------- | -------------- |
| **exepay.app**     | Namecheap      | $14.98     | $19.98  | ~$15           |
| **exepay.io**      | Namecheap      | $32.98     | $39.98  | ~$33           |
| **exepay.xyz**     | Namecheap      | $1.98      | $12.98  | ~$2            |
| **exepay.dev**     | Google Domains | $12.00     | $12.00  | ~$12           |
| **exepay.com**     | GoDaddy        | $11.99     | $19.99  | ~$12           |
| **exepay.network** | Namecheap      | $9.98      | $14.98  | ~$10           |

### **🏆 Recommended Options:**

#### **Best Overall: exepay.app** 💙

- **Cost:** ~$15/year
- **Why:** Modern, tech-focused, perfect for web apps
- **Pros:** Professional, memorable, crypto-friendly
- **Cons:** Slightly more expensive

#### **Budget Option: exepay.xyz** 💚

- **Cost:** ~$2/year (first year)
- **Why:** Cheapest option, still professional
- **Pros:** Super affordable, modern TLD
- **Cons:** Renewal jumps to $13/year

#### **Developer Favorite: exepay.dev** 🧡

- **Cost:** ~$12/year
- **Why:** Developer-focused, consistent pricing
- **Pros:** Google-backed, no price jumps
- **Cons:** Requires HTTPS (Vercel has this ✅)

---

## 📋 **Total Setup Costs:**

### **Option 1: Premium Setup** 🏆

- **Domain:** exepay.app ($15/year)
- **Vercel:** FREE (Hobby plan)
- **SSL Certificate:** FREE (auto-provisioned)
- **DNS Management:** FREE (included)
- **Total Year 1:** **$15** ✨

### **Option 2: Budget Setup** 💚

- **Domain:** exepay.xyz ($2/year first year)
- **Vercel:** FREE (Hobby plan)
- **SSL Certificate:** FREE (auto-provisioned)
- **DNS Management:** FREE (included)
- **Total Year 1:** **$2** ✨

### **Option 3: Professional Setup** 💼

- **Domain:** exepay.io ($33/year)
- **Vercel:** FREE (Hobby plan)
- **SSL Certificate:** FREE (auto-provisioned)
- **DNS Management:** FREE (included)
- **Total Year 1:** **$33** ✨

---

## 🎯 **My Recommendation:**

### **Go with exepay.app** 🚀

**Why:**

- ✅ Perfect for web applications
- ✅ Modern and professional
- ✅ Crypto/tech community loves .app domains
- ✅ Only $15/year (affordable)
- ✅ Consistent pricing (no huge renewal jumps)
- ✅ Great for grant applications
- ✅ Memorable and brandable

**Cost Breakdown:**

- **Year 1:** $15
- **Year 2:** $20
- **Year 3:** $20
- **3-Year Total:** $55 (~$18/year average)

---

## 🛒 **Step-by-Step Purchase Guide:**

### **Step 1: Buy Domain (5 minutes)**

#### **Option A: Namecheap** (Recommended)

1. Go to https://www.namecheap.com
2. Search for "exepay.app"
3. Add to cart
4. **IMPORTANT:** Disable auto-renewal extras (WhoisGuard is free, skip others)
5. Create account or login
6. Pay with credit card/PayPal
7. **Cost:** ~$15

#### **Option B: Google Domains** (for .dev)

1. Go to https://domains.google.com
2. Search for "exepay.dev"
3. Add to cart
4. Login with Google account
5. Pay with credit card
6. **Cost:** ~$12

#### **Option C: Cloudflare** (Best value long-term)

1. Go to https://www.cloudflare.com/products/registrar/
2. Create Cloudflare account
3. Search for "exepay.app"
4. Pay at-cost pricing (no markup!)
5. **Cost:** ~$10/year (cheapest!)

---

### **Step 2: Connect to Vercel (10 minutes)**

#### **2.1: Add Domain in Vercel**

1. Go to https://vercel.com/dashboard
2. Select your "exe-pay" project
3. Click "Settings" → "Domains"
4. Enter your domain: `exepay.app`
5. Click "Add"

#### **2.2: Configure DNS**

Vercel will show you DNS records to add. You'll need to add these in your domain registrar:

**For Root Domain (exepay.app):**

```
Type: A
Name: @
Value: 76.76.21.21
TTL: Auto
```

**For WWW (www.exepay.app):**

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: Auto
```

#### **2.3: Add DNS Records in Namecheap**

1. Login to Namecheap
2. Go to "Domain List"
3. Click "Manage" next to your domain
4. Go to "Advanced DNS" tab
5. Add the A record and CNAME record from Vercel
6. Save changes

#### **2.4: Wait for Propagation**

- **Time:** 5 minutes to 24 hours (usually ~10 minutes)
- **Check status:** https://www.whatsmydns.net

#### **2.5: Verify in Vercel**

- Vercel will auto-detect when DNS is configured
- SSL certificate will auto-provision (FREE)
- Your site will be live at `https://exepay.app` 🎉

---

### **Step 3: Update Environment Variables (5 minutes)**

Update your app to use the new domain:

1. **In Vercel Dashboard:**
   - Go to Settings → Environment Variables
   - Add: `NEXT_PUBLIC_APP_URL` = `https://exepay.app`
   - Redeploy

2. **In Local `.env`:**

   ```bash
   NEXT_PUBLIC_APP_URL=https://exepay.app
   ```

3. **Update Payment Links:**
   - Payment links will now use `https://exepay.app/pay/...`
   - QR codes will point to your custom domain

---

## 🎨 **Optional: Subdomain Setup (FREE)**

You can create unlimited subdomains for free:

### **Common Subdomains:**

| Subdomain           | Purpose       | DNS Record                   |
| ------------------- | ------------- | ---------------------------- |
| **docs.exepay.app** | Documentation | CNAME → cname.vercel-dns.com |
| **api.exepay.app**  | API endpoint  | CNAME → cname.vercel-dns.com |
| **app.exepay.app**  | Main app      | CNAME → cname.vercel-dns.com |
| **demo.exepay.app** | Demo/testing  | CNAME → cname.vercel-dns.com |
| **blog.exepay.app** | Blog          | CNAME → cname.vercel-dns.com |

**Setup:**

1. Add CNAME record in Namecheap
2. Add subdomain in Vercel
3. Deploy app to subdomain
4. Done! ✨

---

## 📊 **Domain Availability Check:**

Before buying, let's check if these are available:

### **Check Now:**

1. Go to https://www.namecheap.com
2. Search for:
   - `exepay.app`
   - `exepay.io`
   - `exepay.xyz`
   - `exepay.dev`
   - `exepay.network`

### **Alternative Names (if taken):**

- `exe-pay.app`
- `exepayments.app`
- `getexepay.app`
- `useexepay.app`
- `exepay.money`
- `exepay.finance`

---

## 🔒 **Security & Best Practices:**

### **✅ Included FREE with Vercel:**

- SSL/TLS Certificate (HTTPS)
- DDoS protection
- CDN (Content Delivery Network)
- Automatic HTTPS redirect
- Edge caching

### **✅ Recommended Settings:**

1. **Enable DNSSEC** (in Namecheap)
2. **Enable WhoisGuard** (privacy protection - FREE)
3. **Enable 2FA** (on Namecheap account)
4. **Auto-renew domain** (so you don't lose it)

---

## 💡 **Pro Tips:**

### **1. Buy Multiple TLDs (Optional)**

Protect your brand by buying:

- `exepay.app` (main)
- `exepay.com` (redirect to .app)
- `exepay.io` (redirect to .app)

**Cost:** ~$60/year for all three

### **2. Email Setup (Optional)**

Use your custom domain for email:

- **Free:** Cloudflare Email Routing
- **Paid:** Google Workspace ($6/month)
- **Example:** hello@exepay.app

### **3. Analytics (Optional)**

- **Vercel Analytics:** FREE (built-in)
- **Google Analytics:** FREE
- **Plausible:** $9/month (privacy-focused)

---

## 📅 **Timeline:**

| Step                 | Time        | Cost    |
| -------------------- | ----------- | ------- |
| Buy domain           | 5 min       | $15     |
| Configure DNS        | 10 min      | FREE    |
| Wait for propagation | 10-60 min   | FREE    |
| Update env vars      | 5 min       | FREE    |
| Test & verify        | 5 min       | FREE    |
| **Total**            | **~35 min** | **$15** |

---

## 🚀 **Quick Start Checklist:**

### **Before You Start:**

- [ ] Have credit card or PayPal ready
- [ ] Decide on domain name (recommend: exepay.app)
- [ ] Have Vercel account ready
- [ ] Set aside 30-60 minutes

### **Purchase & Setup:**

- [ ] Buy domain from Namecheap/Cloudflare
- [ ] Add domain in Vercel
- [ ] Configure DNS records
- [ ] Wait for propagation
- [ ] Verify SSL certificate
- [ ] Update environment variables
- [ ] Test the site
- [ ] Celebrate! 🎉

---

## 🎯 **What Should We Do?**

### **Option 1: Buy Now** 🚀

Tell me which domain you want:

- "Let's get exepay.app"
- "I want exepay.xyz"
- "Buy exepay.dev"

And I'll guide you through the exact steps!

### **Option 2: Check Availability First** 🔍

I can help you check if your preferred names are available.

### **Option 3: Discuss More** 💬

Ask me anything about:

- Domain recommendations
- Cost comparisons
- Technical setup
- Alternative names

---

## 💰 **Final Cost Summary:**

### **Minimum Setup:**

- **Domain:** $2-15/year (one-time annual payment)
- **Hosting:** FREE (Vercel)
- **SSL:** FREE (Vercel)
- **Total:** **$2-15/year** ✨

### **No Hidden Costs:**

- ❌ No monthly fees
- ❌ No hosting costs
- ❌ No SSL certificate costs
- ❌ No bandwidth limits
- ✅ Just the domain price!

---

**Ready to get started? Which domain do you want?** 🚀

**My recommendation: exepay.app for $15/year** 💙
