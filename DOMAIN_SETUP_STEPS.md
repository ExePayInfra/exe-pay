# 🌐 ExePay Domain Setup - exepay.app

## 🎉 **Domain Purchased: exepay.app**

**Status:** ✅ Purchased from Namecheap
**Cost:** £5.45/year
**Privacy:** Enabled (FREE)

---

## 🚀 **Step-by-Step Setup Guide**

### **Part 1: Add Domain to Vercel** (5 minutes)

#### **Step 1.1: Go to Vercel Dashboard**

1. Open: https://vercel.com/dashboard
2. Login to your Vercel account
3. Find your **exe-pay** project (or **exe-payments**)
4. Click on the project to open it

#### **Step 1.2: Add Domain**

1. Click **"Settings"** (top menu)
2. Click **"Domains"** (left sidebar)
3. You'll see a text box that says "Enter domain..."
4. Type: `exepay.app`
5. Click **"Add"**

#### **Step 1.3: Vercel Will Show DNS Records**

After clicking "Add", Vercel will show you DNS records like this:

```
Type: A
Name: @
Value: 76.76.21.21
```

**IMPORTANT:** Keep this Vercel tab open! We'll need these values in the next step.

---

### **Part 2: Configure DNS in Namecheap** (5 minutes)

#### **Step 2.1: Login to Namecheap**

1. Open a new tab: https://www.namecheap.com
2. Click **"Sign In"** (top right)
3. Login with your account

#### **Step 2.2: Go to Domain List**

1. Click your profile icon (top right)
2. Click **"Domain List"**
3. Find **exepay.app**
4. Click **"Manage"** button next to it

#### **Step 2.3: Go to Advanced DNS**

1. Click the **"Advanced DNS"** tab
2. You'll see a list of DNS records

#### **Step 2.4: Add A Record**

1. Click **"Add New Record"**
2. Select **"A Record"** from dropdown
3. Fill in:
   - **Type:** A Record
   - **Host:** `@`
   - **Value:** `76.76.21.21` (from Vercel)
   - **TTL:** Automatic
4. Click the **green checkmark** to save

#### **Step 2.5: Add CNAME Record for www**

1. Click **"Add New Record"** again
2. Select **"CNAME Record"** from dropdown
3. Fill in:
   - **Type:** CNAME Record
   - **Host:** `www`
   - **Value:** `cname.vercel-dns.com`
   - **TTL:** Automatic
4. Click the **green checkmark** to save

#### **Step 2.6: Remove Default Records (If Any)**

If you see any existing records with Host `@` or `www` (like parking page records):

1. Click the **trash icon** next to them
2. Confirm deletion
3. Keep only the two records you just added

#### **Step 2.7: Save Changes**

1. Click **"Save All Changes"** (green button at bottom)
2. You should see: "All changes have been saved"

---

### **Part 3: Wait for DNS Propagation** (5-60 minutes)

#### **Step 3.1: DNS Propagation**

- **Time:** Usually 5-15 minutes (can take up to 24 hours)
- **What's happening:** Your domain is being connected to Vercel's servers worldwide

#### **Step 3.2: Check Status**

You can check propagation status at:

- https://www.whatsmydns.net/#A/exepay.app

Look for the IP: `76.76.21.21` appearing in multiple locations

#### **Step 3.3: Vercel Will Auto-Verify**

- Go back to your Vercel dashboard
- Vercel will automatically detect when DNS is configured
- You'll see a green checkmark next to your domain
- SSL certificate will auto-provision (FREE)

---

### **Part 4: Verify & Test** (5 minutes)

#### **Step 4.1: Check Vercel Dashboard**

1. Go to: https://vercel.com/dashboard
2. Open your project
3. Go to **Settings → Domains**
4. You should see:
   - ✅ **exepay.app** (Valid Configuration)
   - 🔒 SSL certificate issued

#### **Step 4.2: Test Your Site**

1. Open a new tab
2. Go to: https://exepay.app
3. You should see your ExePay app! 🎉

**Note:** If you see "DNS_PROBE_FINISHED_NXDOMAIN" or similar error, wait 5-10 more minutes for DNS to propagate.

#### **Step 4.3: Test WWW Subdomain**

1. Go to: https://www.exepay.app
2. Should redirect to https://exepay.app

---

## 🎯 **Quick Reference - DNS Records**

### **What You Need to Add in Namecheap:**

| Type  | Host | Value                | TTL       |
| ----- | ---- | -------------------- | --------- |
| A     | @    | 76.76.21.21          | Automatic |
| CNAME | www  | cname.vercel-dns.com | Automatic |

**Note:** The IP address `76.76.21.21` is Vercel's default. If Vercel shows you a different IP, use that one instead!

---

## 🔧 **Troubleshooting**

### **Problem: "Invalid Configuration" in Vercel**

**Solution:**

- Wait 5-10 more minutes for DNS to propagate
- Check that you added the A record correctly in Namecheap
- Make sure Host is `@` (not blank or "exepay.app")

### **Problem: "DNS_PROBE_FINISHED_NXDOMAIN" Error**

**Solution:**

- DNS hasn't propagated yet
- Wait 10-30 minutes
- Clear your browser cache (Cmd+Shift+R on Mac)

### **Problem: "This site can't be reached"**

**Solution:**

- Check DNS records in Namecheap
- Make sure you saved changes
- Wait for propagation

### **Problem: "Not Secure" or SSL Error**

**Solution:**

- Vercel's SSL takes 5-10 minutes to provision
- Wait a bit longer
- Refresh the page

---

## 📱 **After Setup is Complete**

### **Update Environment Variables:**

Once your domain is live, update your app:

1. **In Vercel Dashboard:**
   - Go to **Settings → Environment Variables**
   - Add or update: `NEXT_PUBLIC_APP_URL` = `https://exepay.app`
   - Click **"Save"**
   - Redeploy your app

2. **In Local `.env`:**

   ```bash
   NEXT_PUBLIC_APP_URL=https://exepay.app
   ```

3. **Commit Changes:**
   ```bash
   cd /Users/kingchief/Documents/EXE
   git add .env
   git commit -m "Update app URL to exepay.app"
   git push
   ```

---

## 🎊 **What You'll Have:**

✅ **Live Site:** https://exepay.app
✅ **SSL Certificate:** FREE & automatic
✅ **Professional URL:** Perfect for grants & investors
✅ **Payment Links:** Now use exepay.app domain
✅ **QR Codes:** Point to your custom domain

---

## 📋 **Checklist:**

### **Vercel Setup:**

- [ ] Login to Vercel dashboard
- [ ] Go to Settings → Domains
- [ ] Add domain: exepay.app
- [ ] Note the DNS records shown

### **Namecheap DNS:**

- [ ] Login to Namecheap
- [ ] Go to Domain List → Manage
- [ ] Click Advanced DNS tab
- [ ] Add A record: @ → 76.76.21.21
- [ ] Add CNAME record: www → cname.vercel-dns.com
- [ ] Remove default parking records
- [ ] Save all changes

### **Verification:**

- [ ] Wait 5-60 minutes for DNS propagation
- [ ] Check Vercel dashboard for green checkmark
- [ ] Visit https://exepay.app
- [ ] Verify SSL certificate (🔒 in browser)
- [ ] Test www.exepay.app redirect

### **Final Steps:**

- [ ] Update environment variables in Vercel
- [ ] Update local .env file
- [ ] Redeploy app
- [ ] Celebrate! 🎉

---

## 🚀 **Ready to Start?**

**Let's begin with Part 1: Add Domain to Vercel**

Tell me when you're ready, and I'll guide you through each step! 🎯

---

**Status: 🔥 READY TO CONNECT! 🔥**
