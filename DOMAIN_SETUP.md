# 🌐 Domain Setup Guide

## Domain Registration

### Option 1: Namecheap (Recommended)
1. Go to https://www.namecheap.com
2. Search for `exeapp.app`
3. Cost: ~$15-20/year for `.app` domain
4. Add to cart and checkout

### Option 2: Google Domains
1. Go to https://domains.google
2. Search for `exeapp.app`
3. Cost: ~$12/year
4. Purchase

### Option 3: Cloudflare Registrar (Cheapest)
1. Go to https://www.cloudflare.com/products/registrar/
2. Search for `exeapp.app`
3. Cost: At-cost pricing (~$10/year)
4. Requires Cloudflare account

---

## Alternative Domain Names (if exeapp.app is taken)

If `exeapp.app` is unavailable, here are great alternatives:

### Premium Options
- `exepay.app` - Original name
- `payexe.app` - Shorter
- `exe.app` - Super short (if available)

### Creative Options
- `exepayments.app`
- `privatepay.app`
- `shieldedpay.app`
- `zkpay.app` - Zero-knowledge payments

### .com Alternatives
- `exeapp.com`
- `exepay.com`
- `useexe.com`

---

## Vercel Domain Configuration

Once you have your domain, follow these steps:

### 1. Add Domain to Vercel

```bash
# In your terminal
cd /Users/kingchief/Documents/EXE
vercel domains add exeapp.app
```

Or via Vercel Dashboard:
1. Go to https://vercel.com/exechainlink-5881s-projects/exe-payments/settings/domains
2. Click "Add Domain"
3. Enter `exeapp.app`
4. Click "Add"

### 2. Configure DNS Records

Vercel will provide DNS records. Add these to your domain registrar:

**For Root Domain (exeapp.app):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For WWW Subdomain (www.exeapp.app):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 3. Wait for DNS Propagation

- Usually takes 5-30 minutes
- Can take up to 48 hours in rare cases
- Check status: https://dnschecker.org

### 4. Enable SSL (Automatic)

Vercel automatically provisions SSL certificates via Let's Encrypt.
- Your site will be accessible via `https://exeapp.app`
- SSL certificate renews automatically

---

## Payment Link Structure

Once domain is set up, your payment links will look like:

```
https://exeapp.app/pay?r=RECIPIENT&a=AMOUNT&m=MEMO

Examples:
https://exeapp.app/pay?r=7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU&a=1000000&m=Coffee
https://exeapp.app/pay?r=merchant123&a=5000000&m=Invoice%20%231234
```

---

## Subdomain Strategy (Future)

When you scale, you can add subdomains:

```
https://exeapp.app          - Main landing page
https://pay.exeapp.app      - Payment processing
https://app.exeapp.app      - Dashboard/app
https://api.exeapp.app      - API endpoint
https://docs.exeapp.app     - Documentation
```

---

## Custom Domain Benefits

✅ **Professional branding** - No more vercel.app URLs
✅ **Better SEO** - Custom domains rank better
✅ **Trust** - Users trust custom domains more
✅ **Memorable** - Easy to share and remember
✅ **Email** - Can set up hello@exeapp.app later

---

## Next Steps

1. ✅ Register domain (choose from options above)
2. ✅ Add domain to Vercel
3. ✅ Configure DNS records
4. ✅ Wait for propagation
5. ✅ Test: Visit https://exeapp.app

---

## Cost Summary

| Item | Cost | Frequency |
|------|------|-----------|
| Domain (.app) | $10-20 | Per year |
| Vercel Hosting | $0 | Free tier |
| SSL Certificate | $0 | Included |
| **Total** | **$10-20** | **Per year** |

---

## Need Help?

If you encounter issues:
1. Check DNS propagation: https://dnschecker.org
2. Verify DNS records in registrar dashboard
3. Check Vercel domain settings
4. Contact Vercel support (very responsive!)

---

**Once domain is set up, we'll proceed with building the payment link features!**

