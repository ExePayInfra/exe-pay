# 🔗 Payment Links - Feature Guide

## ✅ What We Just Built

**Payment Links** is now live! This feature allows anyone to generate shareable URLs for receiving private payments on Solana.

---

## 🌐 Live URLs

### Your Deployed App
- **Main App**: https://exe-payments-5yo1rx9k6-exechainlink-5881s-projects.vercel.app
- **Create Link**: https://exe-payments-5yo1rx9k6-exechainlink-5881s-projects.vercel.app/create-link
- **Payment Page**: https://exe-payments-5yo1rx9k6-exechainlink-5881s-projects.vercel.app/pay

### Once You Set Up Custom Domain (exeapp.app)
- **Main App**: https://exeapp.app
- **Create Link**: https://exeapp.app/create-link
- **Payment Page**: https://exeapp.app/pay

---

## 🎯 How It Works

### 1. Generate a Payment Link

Visit `/create-link` and fill in:
- **Recipient Address** (required) - Solana wallet address
- **Amount** (required) - In SOL
- **Label** (optional) - What the payment is for
- **Memo** (optional) - Additional message

Click "Generate Payment Link" and get a shareable URL!

### 2. Share the Link

The generated link looks like:
```
https://exeapp.app/pay?r=7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU&a=1000000&m=Coffee&l=Tip
```

Share it via:
- ✅ Copy to clipboard
- ✅ Share button (mobile native sharing)
- ✅ Email, SMS, social media
- ✅ Embed on website
- ✅ QR code (coming next!)

### 3. Recipient Pays

When someone clicks the link:
1. They see a beautiful payment page
2. All details are pre-filled
3. They click "Pay Privately"
4. Payment is sent with zero-knowledge privacy
5. Success confirmation shown

---

## 📋 URL Parameters

Payment links support these parameters:

| Parameter | Key | Required | Description |
|-----------|-----|----------|-------------|
| Recipient | `r` | ✅ Yes | Solana wallet address (Base58) |
| Amount | `a` | ✅ Yes | Amount in lamports (1 SOL = 1,000,000,000 lamports) |
| Memo | `m` | ❌ No | Payment memo/note |
| Label | `l` | ❌ No | Payment label (what it's for) |
| Message | `msg` | ❌ No | Additional message |
| Reference | `ref` | ❌ No | Reference public key for tracking |
| Token | `token` | ❌ No | SPL token mint address (default: SOL) |

### Example URLs

**Simple payment:**
```
https://exeapp.app/pay?r=7xKXtg...&a=1000000
```

**With memo:**
```
https://exeapp.app/pay?r=7xKXtg...&a=5000000&m=Invoice%20%231234
```

**Full featured:**
```
https://exeapp.app/pay?r=7xKXtg...&a=10000000&l=Coffee&m=Thank%20you!
```

---

## 💻 Code Examples

### Generate a Link (TypeScript)

```typescript
import { generatePaymentLink } from '@exe-pay/utils';
import { PublicKey } from '@solana/web3.js';

const link = generatePaymentLink({
  recipient: new PublicKey('7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU'),
  amount: 1_000_000, // 0.001 SOL in lamports
  memo: 'Coffee payment',
  label: 'Cafe Order #123'
});

console.log(link);
// https://exeapp.app/pay?r=7xKXtg...&a=1000000&m=Coffee%20payment&l=Cafe%20Order%20%23123
```

### Parse a Link

```typescript
import { parsePaymentLink } from '@exe-pay/utils';

const url = 'https://exeapp.app/pay?r=7xKXtg...&a=1000000';
const params = parsePaymentLink(url);

console.log(params.recipient); // PublicKey
console.log(params.amount); // 1000000
console.log(params.memo); // undefined (not provided)
```

### Validate a Link

```typescript
import { validatePaymentLink } from '@exe-pay/utils';

const isValid = validatePaymentLink('https://exeapp.app/pay?r=7xKXtg...&a=1000000');
console.log(isValid); // true or false
```

### Format Amount

```typescript
import { formatPaymentAmount } from '@exe-pay/utils';

const display = formatPaymentAmount(1_000_000);
console.log(display); // "0.0010 SOL"
```

---

## 🎨 UI Components

### PaymentLinkGenerator Component

Located at: `apps/web/src/components/PaymentLinkGenerator.tsx`

Features:
- ✅ Form validation
- ✅ Real-time amount formatting
- ✅ Error handling
- ✅ Copy to clipboard
- ✅ Native share API
- ✅ Beautiful Tailwind UI

### Payment Page

Located at: `apps/web/src/app/pay/page.tsx`

Features:
- ✅ Auto-parse URL parameters
- ✅ Display payment details
- ✅ Privacy notice
- ✅ Loading states
- ✅ Success confirmation
- ✅ Error handling

---

## 🚀 Use Cases

### 1. **Invoicing**
```typescript
// Generate invoice link
const invoice = generatePaymentLink({
  recipient: merchantWallet,
  amount: 50_000_000, // 0.05 SOL
  label: 'Invoice #1234',
  memo: 'Web design services - March 2025'
});

// Send to client via email
```

### 2. **Donations**
```typescript
// Donation link for content creator
const donation = generatePaymentLink({
  recipient: creatorWallet,
  amount: 1_000_000, // 0.001 SOL
  label: 'Support My Work',
  memo: 'Thank you for your support!'
});

// Add to website or social media bio
```

### 3. **E-commerce**
```typescript
// Product payment link
const product = generatePaymentLink({
  recipient: storeWallet,
  amount: 25_000_000, // 0.025 SOL
  label: 'Digital Product',
  memo: 'License key will be emailed',
  reference: orderIdPublicKey // Track this order
});
```

### 4. **Tips & Gratuities**
```typescript
// Tip jar link
const tip = generatePaymentLink({
  recipient: serviceWorkerWallet,
  amount: 500_000, // 0.0005 SOL
  label: 'Tip',
  memo: 'Thanks for great service!'
});
```

---

## 🔒 Privacy Features

All payments made through payment links are **privacy-preserving**:

1. **Zero-Knowledge Proofs** - Transaction details hidden
2. **Compressed Accounts** - Reduced on-chain footprint
3. **Light Protocol** - Production-ready ZK compression
4. **No Tracking** - No analytics or user tracking on payment pages

---

## 📱 Mobile Support

Payment links work great on mobile:

- ✅ Responsive design
- ✅ Native share API
- ✅ Touch-friendly UI
- ✅ Mobile wallet support (coming soon)
- ✅ QR code scanning (coming next!)

---

## 🎯 Next Steps

### Immediate (You Can Do Now)

1. **Test the feature**:
   - Visit https://exe-payments-5yo1rx9k6-exechainlink-5881s-projects.vercel.app/create-link
   - Generate a payment link
   - Open it and see the payment page

2. **Set up custom domain**:
   - Follow `DOMAIN_SETUP.md`
   - Register `exeapp.app` or similar
   - Configure DNS in Vercel

3. **Share with friends**:
   - Generate a test link
   - Share on social media
   - Get feedback!

### Coming Next Week

1. **QR Codes** (Feature #2)
   - Generate QR codes for payment links
   - Scan-to-pay functionality
   - Print-friendly formats

2. **Transaction History** (Feature #3)
   - View past payments
   - Filter and search
   - Export to CSV

3. **Better Error Handling** (Feature #4)
   - User-friendly error messages
   - Retry logic
   - Network status indicators

---

## 🐛 Troubleshooting

### Link Not Working?

**Check:**
1. ✅ Recipient address is valid Solana address
2. ✅ Amount is positive number
3. ✅ URL is properly encoded (spaces become `%20`)
4. ✅ All required parameters present (`r` and `a`)

### Payment Page Shows Error?

**Common issues:**
1. Invalid recipient address
2. Amount is zero or negative
3. Malformed URL
4. Missing required parameters

### Can't Generate Link?

**Verify:**
1. All required fields filled
2. Amount is valid number
3. Recipient address is correct format
4. JavaScript is enabled

---

## 📊 Technical Details

### File Structure

```
packages/utils/src/
└── payment-links.ts          # Core payment link logic

apps/web/src/
├── app/
│   ├── create-link/
│   │   └── page.tsx          # Link generator page
│   └── pay/
│       └── page.tsx          # Payment handler page
└── components/
    └── PaymentLinkGenerator.tsx  # Generator UI component
```

### Dependencies

- `@solana/web3.js` - Solana SDK
- `@exe-pay/utils` - Payment link utilities
- `@exe-pay/core` - ExePay SDK (for future wallet integration)
- `next` - Next.js framework
- `react` - React library

### Performance

- ✅ Static page generation (fast loading)
- ✅ Client-side link generation (instant)
- ✅ No server required for link creation
- ✅ Minimal JavaScript bundle

---

## 🎉 Success Metrics

Track these to measure adoption:

1. **Links Generated** - How many payment links created
2. **Links Clicked** - How many people visit payment pages
3. **Payments Completed** - Conversion rate
4. **Average Amount** - Typical payment size
5. **Share Method** - Copy vs native share usage

---

## 💡 Tips & Best Practices

### For Merchants

1. **Use descriptive labels** - Help customers know what they're paying for
2. **Add memos** - Include order numbers, thank you messages
3. **Test links first** - Always verify before sending to customers
4. **Use references** - Track payments with reference public keys

### For Developers

1. **Validate inputs** - Always check addresses and amounts
2. **Handle errors gracefully** - Show user-friendly messages
3. **Use HTTPS** - Payment links should always be secure
4. **Consider mobile** - Most users will pay on mobile devices

---

## 🔗 Related Documentation

- [FEATURES.md](./FEATURES.md) - All ExePay features
- [API.md](./API.md) - Complete API reference
- [DOMAIN_SETUP.md](./DOMAIN_SETUP.md) - Custom domain guide
- [README.md](./README.md) - Project overview

---

## 🤝 Need Help?

- **GitHub Issues**: https://github.com/ExePayInfra/exe-pay/issues
- **Documentation**: Check FEATURES.md and API.md
- **Examples**: See code examples above

---

**Payment Links are live! Start sharing and accepting private payments today!** 🚀

