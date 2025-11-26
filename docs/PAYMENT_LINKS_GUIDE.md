# Payment Links Guide

**Version:** 0.3.0  
**Last Updated:** November 25, 2025

---

## 🔗 What are Payment Links?

Payment links are shareable URLs that pre-fill payment information, making it easy to request payments from anyone. Perfect for:

- 💰 Requesting payments
- 🎁 Accepting donations
- 🏪 E-commerce checkout
- 📄 Invoice payments
- 🎫 Event tickets

---

## ✨ Features

- **QR Code Generation** - Scannable QR codes for each link
- **Expiration Dates** - Set links to expire after a certain time
- **Usage Limits** - Limit how many times a link can be used
- **Multiple Tokens** - SOL, USDC, USDT support
- **Custom Memos** - Add payment descriptions
- **Link Management** - View and manage all your payment links
- **Mobile Friendly** - Works on all devices

---

## 🚀 Getting Started

### 1. Access Payment Links

Navigate to [https://exepay.app/links](https://exepay.app/links) or click "Links" in the navigation menu.

### 2. Connect Your Wallet

Click "Connect Wallet" and select your preferred wallet (Phantom, Solflare, etc.).

### 3. Create a Payment Link

Click the "+ Create Payment Link" button and fill in the form:

#### Required Fields:

**Recipient Address**
- Your Solana wallet address where funds will be sent
- Must be a valid Solana address (44 characters)
- Example: `7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU`

**Amount**
- How much to request
- Must be greater than 0
- Can include decimals (e.g., 0.5, 1.25, 10.99)

**Token**
- Select SOL, USDC, or USDT
- Defaults to SOL

#### Optional Fields:

**Memo**
- Description of the payment
- Example: "Payment for web design services"
- Displayed to the payer

**Expires In**
- When the link should stop working
- Options: Never, 1 hour, 24 hours, 7 days, 30 days
- Expired links cannot be used

**Max Uses**
- How many times the link can be used
- Leave blank for unlimited
- Once max is reached, link becomes inactive

---

## 📋 Example Use Cases

### E-Commerce Product Payment

```
Recipient: YOUR_WALLET_ADDRESS
Amount: 49.99
Token: USDC
Memo: Payment for Premium Plan subscription
Expires In: 24 hours
Max Uses: 1
```

**Use Case:** Single-use checkout link for a product

---

### Donation Link

```
Recipient: YOUR_WALLET_ADDRESS
Amount: 10
Token: SOL
Memo: Support our open-source project
Expires In: Never
Max Uses: (blank - unlimited)
```

**Use Case:** Reusable donation link on your website

---

### Event Ticket

```
Recipient: YOUR_WALLET_ADDRESS
Amount: 0.5
Token: SOL
Memo: Ticket for Web3 Conference 2026
Expires In: 7 days
Max Uses: 100
```

**Use Case:** Limited-time event ticket sales

---

### Freelance Invoice

```
Recipient: YOUR_WALLET_ADDRESS
Amount: 500
Token: USDC
Memo: Invoice #1234 - Website Development
Expires In: 30 days
Max Uses: 1
```

**Use Case:** Professional invoice payment

---

## 📱 Sharing Payment Links

### Method 1: Copy Link

1. Click "📋 Copy Link" button
2. Share via:
   - Email
   - Messaging apps (WhatsApp, Telegram, Discord)
   - Social media
   - SMS

### Method 2: QR Code

1. Display the QR code on screen
2. Customer scans with phone camera
3. Opens payment page automatically

**Perfect for:**
- In-person payments
- Physical invoices
- Point-of-sale systems
- Printed materials

### Method 3: Embed on Website

```html
<!-- Embed payment button -->
<a href="YOUR_PAYMENT_LINK_HERE" target="_blank">
  <button>Pay with ExePay</button>
</a>

<!-- Embed QR code -->
<img src="QR_CODE_DATA_URL" alt="Payment QR Code" />
```

---

## 💳 Payment Flow

### For the Payer:

1. **Click payment link** - Opens payment page
2. **Review details** - See amount, recipient, memo
3. **Connect wallet** - Click "Connect Wallet"
4. **Authorize payment** - Click "Pay" button
5. **Confirm in wallet** - Approve transaction
6. **Receive confirmation** - See success message + transaction signature

### For the Recipient (You):

1. **Create link** - Fill in payment details
2. **Share link** - Send to customer
3. **Receive payment** - Funds arrive in your wallet
4. **Track usage** - See payment count in dashboard

---

## 🛠️ Managing Payment Links

### View All Links

All your payment links are displayed in the dashboard with:
- Amount and token
- Recipient address (shortened)
- Creation date
- Expiration status
- Usage count

### Copy Link

Click "📋 Copy Link" to copy the payment URL to your clipboard.

### Open Link

Click "🔗 Open Link" to view the payment page (opens in new tab).

### Delete Link

Click "🗑️" to permanently delete a payment link.

**Note:** Deleting a link makes it unusable. Already completed payments are not affected.

---

## ⚠️ Link Status

### Active

- ✅ Green border
- Can be used normally
- No restrictions

### Expired

- ❌ Red border
- Shows "(Expired)" label
- Cannot be used
- Grayed out appearance

### Max Uses Reached

- ❌ Red border
- Shows "(Max reached)" label
- Cannot be used
- Grayed out appearance

---

## 🔒 Security Best Practices

### Do's:

✅ **Verify recipient address** - Double-check before creating link  
✅ **Set expiration dates** - For time-sensitive payments  
✅ **Use max uses** - For single-use payments  
✅ **Add clear memos** - Help payers understand what they're paying for  
✅ **Monitor usage** - Check your links regularly  
✅ **Delete old links** - Clean up unused links

### Don'ts:

❌ **Don't share private keys** - Never include private keys in links  
❌ **Don't reuse single-use links** - Create new links for each customer  
❌ **Don't rely on expired links** - Create new links when needed  
❌ **Don't accept payments to wrong address** - Always verify recipient

---

## 🎨 Customization

### Custom Domain (Future)

Coming soon: Use your own domain for payment links!

Example: `pay.yourdomain.com/invoice123`

### Custom Branding (Future)

Coming soon: Customize payment page with your logo and colors!

---

## 📊 Analytics (Future)

Coming soon: Track payment link performance!

- Views per link
- Conversion rate
- Total payments received
- Most popular payment amounts
- Geographic distribution

---

## 🔌 API Integration (Future)

Coming soon: Programmatic payment link creation!

```typescript
import { ExePayAPI } from '@exe-pay/api';

const api = new ExePayAPI({ apiKey: 'YOUR_API_KEY' });

const link = await api.createPaymentLink({
  recipient: 'YOUR_WALLET_ADDRESS',
  amount: 10.0,
  token: 'SOL',
  memo: 'API-generated payment',
  expiresIn: 3600, // 1 hour in seconds
  maxUses: 1,
});

console.log('Payment link:', link.url);
console.log('QR code:', link.qrCode);
```

---

## ❓ FAQ

### Can I create payment links without connecting a wallet?

No, you need to connect a wallet to verify ownership of the recipient address.

### Are payment links stored on the blockchain?

No, payment links are stored locally in your browser. Only the actual payment transaction is recorded on the blockchain.

### Can I edit a payment link after creating it?

No, payment links cannot be edited. Delete the old link and create a new one.

### What happens if someone pays after the link expires?

The payment page will show an error message and prevent the transaction.

### Can I create multiple links for the same amount?

Yes! Create as many links as you need. Each link has a unique ID.

### Do payment links work on mobile?

Yes! Payment links are fully responsive and work on all devices.

### What wallets are supported for paying?

All major Solana wallets: Phantom, Solflare, Coinbase Wallet, Trust Wallet, Backpack, Glow, Brave, Slope, Torus, and Ledger.

### Can I accept tokens other than SOL, USDC, USDT?

Not yet, but we're working on supporting all SPL tokens!

### Is there a fee for creating payment links?

No! Creating and sharing payment links is completely free. Only standard Solana transaction fees apply when payments are made (~$0.0001).

### Can I use payment links for recurring payments?

Not yet, but recurring payment links are on our roadmap!

---

## 🚀 Coming Soon

- ⏰ Recurring payment links
- 🌈 Custom branding
- 📊 Advanced analytics
- 🔗 Custom domains
- 📧 Email notifications
- 💱 Multi-token support (all SPL tokens)
- 🔌 REST API
- 📱 Mobile app
- 💬 Payment comments
- 🎨 Payment page themes

---

## 📚 Additional Resources

- **[SDK Integration Guide](./SDK_INTEGRATION_GUIDE.md)** - Build your own payment links
- **[API Reference](./API_REFERENCE.md)** - Complete API documentation
- **[Privacy Guide](./PRIVACY_GUIDE.md)** - Privacy features explained

---

## 💬 Need Help?

- **Email:** exechainlink@outlook.com
- **GitHub:** [ExePayInfra/exe-pay](https://github.com/ExePayInfra/exe-pay)
- **Docs:** [docs.exepay.app](https://docs.exepay.app)

---

**Make payments easier with ExePay Payment Links!** 🔗

