# 📖 ExePay User Guide

## **Welcome to ExePay!** 🎉

ExePay is a privacy-first payments platform on Solana that uses zero-knowledge proofs to keep your transactions confidential.

---

## 🚀 **Getting Started**

### **Step 1: Install Phantom Wallet**

1. Go to [phantom.app](https://phantom.app/)
2. Download for your browser or mobile
3. Create a new wallet or import existing
4. **Save your seed phrase securely!**

---

### **Step 2: Connect Your Wallet**

1. Visit [ExePay](https://exe-payments-re46xgprs-exechainlink-5881s-projects.vercel.app)
2. Click "Connect Phantom Wallet"
3. Approve the connection in Phantom
4. Your wallet address will appear

---

### **Step 3: Send a Payment**

#### **Public Payment** (Standard)
1. Select "Public" privacy level
2. Choose token (SOL, USDC, etc.)
3. Enter recipient address
4. Enter amount
5. Click "Send Payment"
6. Approve in Phantom

**Privacy:** Standard Solana transaction (visible on-chain)

---

#### **Shielded Payment** (Hidden Amount)
1. Select "Shielded" privacy level
2. Choose token
3. Enter recipient address
4. Enter amount
5. Click "Send Payment"
6. **Wait for ZK proofs to generate** (~1-2 seconds)
7. Approve in Phantom

**Privacy:** Amount is encrypted, recipient visible

**How it works:**
- Your amount is encrypted using ElGamal encryption
- A zero-knowledge proof proves you have enough balance
- The blockchain only sees encrypted data

---

#### **Private Payment** (Fully Private)
1. Select "Private" privacy level
2. Choose token
3. Enter recipient address
4. Enter amount
5. Click "Send Payment"
6. **Wait for ZK proofs to generate** (~1-2 seconds)
7. Approve in Phantom

**Privacy:** Amount AND recipient encrypted

**How it works:**
- Both amount and recipient are encrypted
- Zero-knowledge proofs verify the transaction
- Complete privacy on-chain

---

## 💸 **Batch Payments**

Send to multiple recipients at once!

### **How to Use:**

1. Go to **Batch Payments** page
2. Add recipients:
   - Enter address
   - Enter amount
   - Click "Add Recipient"
3. Review total amount
4. Click "Send Batch Payment"
5. Approve in Phantom

**Benefits:**
- Save on fees (one transaction)
- Faster than individual sends
- Perfect for payroll or airdrops

**Limits:**
- Up to 10 recipients per batch
- All must use same token

---

## 🔄 **Recurring Payments**

Set up automatic subscriptions!

### **How to Use:**

1. Go to **Recurring Payments** page
2. Fill in details:
   - Recipient address
   - Amount per payment
   - Frequency (daily/weekly/monthly)
   - Start date
3. Click "Create Subscription"
4. Approve initial payment

**Managing Subscriptions:**
- **Pause:** Temporarily stop payments
- **Resume:** Restart paused subscription
- **Cancel:** End subscription permanently

**Important:**
- Payments are NOT automatic (you approve each)
- You'll see "Payment Due" when it's time
- Click "Execute Payment" to send

**Use Cases:**
- Rent payments
- Subscription services
- Regular donations
- Payroll

---

## 🔗 **Payment Links**

Create shareable payment requests!

### **How to Create:**

1. Go to **Create Payment Link**
2. Enter details:
   - Amount
   - Token
   - Description (optional)
3. Click "Generate Link"
4. Share the link or QR code

### **How to Pay:**

1. Click payment link
2. Connect wallet
3. Review details
4. Click "Pay Now"
5. Approve in Phantom

**Use Cases:**
- Invoice customers
- Request donations
- Split bills
- Sell products/services

---

## 📱 **Mobile Usage**

ExePay works great on mobile!

### **iOS (Safari):**
1. Visit ExePay in Safari
2. Tap share icon
3. "Add to Home Screen"
4. Use like a native app!

### **Android (Chrome):**
1. Visit ExePay in Chrome
2. Tap menu (3 dots)
3. "Add to Home Screen"
4. Use like a native app!

**Mobile Features:**
- Touch-friendly buttons
- Responsive design
- QR code scanner
- Wallet integration

---

## 🔐 **Privacy Explained**

### **What is Zero-Knowledge?**

Zero-knowledge proofs let you prove something is true without revealing the actual data.

**Example:**
- You want to prove you have $100
- Without showing your bank balance
- ZK proof: "I have ≥ $100" ✓
- Your actual balance stays secret!

---

### **How ExePay Uses ZK Proofs:**

#### **Range Proof:**
- Proves: "0 < amount < max"
- Without revealing the exact amount
- Prevents invalid amounts

#### **Balance Proof:**
- Proves: "balance ≥ amount"
- Without revealing your balance
- Prevents overspending

**Benefits:**
- Complete privacy
- Mathematically secure
- No trusted third party
- Verifiable on-chain

---

### **Privacy Levels Compared:**

| Feature | Public | Shielded | Private |
|---------|--------|----------|---------|
| Amount visible | ✓ | ✗ | ✗ |
| Recipient visible | ✓ | ✓ | ✗ |
| Sender visible | ✓ | ✓ | ✗ |
| ZK proofs | ✗ | ✓ | ✓ |
| Speed | Fast | Fast | Fast |
| Fees | Low | Low | Low |

---

## 💰 **Supported Tokens**

### **Mainnet:**
- **SOL** (Native Solana)
- **USDC** (USD Coin)
- **USDT** (Tether)
- **BONK** (Bonk)
- **JUP** (Jupiter)

### **Coming Soon:**
- All SPL tokens
- Token search
- Custom tokens

---

## 🛡️ **Security Best Practices**

### **Wallet Security:**
1. **Never share your seed phrase**
2. Use a hardware wallet for large amounts
3. Enable 2FA on exchanges
4. Verify addresses before sending
5. Start with small test transactions

### **Transaction Safety:**
1. **Double-check recipient address**
2. Verify amount before approving
3. Check transaction on Solscan
4. Save transaction signatures
5. Report suspicious activity

### **Privacy Tips:**
1. Use shielded/private for sensitive payments
2. Don't reuse addresses
3. Use VPN for extra privacy
4. Clear browser data regularly
5. Use dedicated wallet for privacy

---

## ❓ **Common Questions**

### **Q: Are my funds safe?**
A: Yes! ExePay never holds your funds. All transactions are direct wallet-to-wallet on Solana.

### **Q: How much do transactions cost?**
A: Standard Solana fees (~$0.00025 per transaction). No ExePay fees!

### **Q: How fast are transactions?**
A: Usually 1-2 seconds on Solana. ZK proof generation adds ~1 second.

### **Q: Can I reverse a transaction?**
A: No. Blockchain transactions are irreversible. Always double-check before sending!

### **Q: What if I send to wrong address?**
A: Transactions cannot be reversed. Always verify the recipient address!

### **Q: Is ExePay audited?**
A: Security audit in progress. Open-source code available on GitHub.

### **Q: Can I use ExePay on mobile?**
A: Yes! Works great on mobile browsers. Native app coming soon!

### **Q: What wallets are supported?**
A: Currently Phantom. More wallets coming soon (Solflare, Backpack, etc.)

---

## 🐛 **Troubleshooting**

### **"Failed to connect wallet"**
1. Install Phantom wallet
2. Refresh the page
3. Try in incognito mode
4. Clear browser cache

### **"Transaction failed"**
1. Check you have enough balance
2. Verify recipient address is valid
3. Check network status (Solana Status)
4. Try again with lower amount

### **"Insufficient funds"**
1. Check your token balance
2. Account for transaction fees (~0.000005 SOL)
3. Add more funds to wallet

### **"Invalid address"**
1. Verify address is correct Solana address
2. Check for typos
3. Try copying address again

### **"ZK proof failed"**
1. Refresh the page
2. Try public mode first
3. Check console for errors
4. Report issue on GitHub

---

## 📞 **Support**

### **Need Help?**

- **GitHub:** [github.com/ExePayInfra/exe-pay](https://github.com/ExePayInfra/exe-pay)
- **Twitter:** @ExePay (coming soon)
- **Discord:** discord.gg/exepay (coming soon)
- **Email:** support@exepay.app (coming soon)

### **Report a Bug:**
1. Go to GitHub Issues
2. Click "New Issue"
3. Describe the problem
4. Include screenshots
5. Submit

---

## 🎓 **Learn More**

### **Resources:**
- [Solana Documentation](https://docs.solana.com/)
- [Zero-Knowledge Proofs Explained](https://z.cash/technology/zksnarks/)
- [Phantom Wallet Guide](https://phantom.app/learn)
- [ExePay GitHub](https://github.com/ExePayInfra/exe-pay)

### **Videos:**
- How to use ExePay (coming soon)
- Privacy explained (coming soon)
- Batch payments tutorial (coming soon)

---

## 🚀 **What's Next?**

### **Coming Soon:**
- Mobile app (iOS/Android)
- More tokens
- Cross-chain support
- Advanced privacy features
- Enterprise features

### **Stay Updated:**
- Follow on Twitter
- Join Discord
- Star on GitHub
- Subscribe to newsletter

---

**Thank you for using ExePay!** 🎉

**Building the future of private payments on Solana.** 🚀

---

**Version:** 1.0.0  
**Last Updated:** November 2025  
**License:** MIT

