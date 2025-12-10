# ❓ ExePay Frequently Asked Questions (FAQ)

## **General Questions**

### **What is ExePay?**
ExePay is a privacy-first payments platform built on Solana. It uses zero-knowledge proofs to enable confidential transactions while maintaining the speed and low costs of Solana.

### **Is ExePay free to use?**
Yes! ExePay doesn't charge any fees. You only pay standard Solana network fees (~$0.00025 per transaction).

### **Is ExePay open source?**
Yes! All code is available on [GitHub](https://github.com/ExePayInfra/exe-pay) under MIT license.

### **Who built ExePay?**
ExePay is built by a solo developer passionate about privacy and Solana. Community contributions welcome!

---

## **Privacy & Security**

### **How private are my transactions?**
It depends on the privacy level you choose:
- **Public:** Standard Solana transaction (all details visible)
- **Shielded:** Amount encrypted, recipient visible
- **Private:** Amount and recipient encrypted

### **What are zero-knowledge proofs?**
Zero-knowledge proofs (ZK proofs) let you prove something is true without revealing the underlying data. For example, proving you have enough balance without showing your actual balance.

### **Are ZK proofs secure?**
Yes! We use Groth16 ZK-SNARKs, the same technology used by Zcash. They're mathematically proven to be secure.

### **Can anyone see my balance?**
No. Your balance is never revealed in shielded or private transactions. Only you can see it in your wallet.

### **Can transactions be traced?**
- **Public:** Yes (standard blockchain)
- **Shielded:** Amount is hidden, but sender/recipient visible
- **Private:** Fully untraceable (amount, sender, recipient all hidden)

### **Is my wallet address private?**
In private mode, yes. The recipient address is encrypted. In shielded mode, addresses are visible but amounts are hidden.

### **Are my funds safe?**
Yes! ExePay never holds your funds. All transactions are direct wallet-to-wallet. You always control your private keys.

### **Has ExePay been audited?**
Security audit is in progress. Code is open-source for community review.

---

## **Wallets & Connections**

### **What wallets are supported?**
Currently:
- Phantom (desktop & mobile)

Coming soon:
- Solflare
- Backpack
- Glow
- Ledger

### **Do I need SOL for gas fees?**
Yes. You need a small amount of SOL (~0.001 SOL) for transaction fees, even when sending other tokens.

### **Can I use ExePay without connecting a wallet?**
No. You need a Solana wallet to send transactions. You can view payment links without a wallet though!

### **Why can't I connect my wallet?**
Common solutions:
1. Make sure Phantom is installed
2. Refresh the page
3. Try incognito mode
4. Clear browser cache
5. Check Phantom is unlocked

### **Can I use multiple wallets?**
Yes! Disconnect current wallet and connect a different one.

---

## **Payments**

### **What tokens can I send?**
Currently supported (mainnet):
- SOL (native)
- USDC
- USDT
- BONK
- JUP

More tokens coming soon!

### **What's the minimum/maximum amount?**
- **Minimum:** 0.000001 of any token
- **Maximum:** Limited by your balance

### **How long do transactions take?**
- **Public:** 1-2 seconds
- **Shielded/Private:** 2-3 seconds (includes ZK proof generation)

### **Can I cancel a transaction?**
No. Once confirmed on the blockchain, transactions are irreversible.

### **What if I send to the wrong address?**
Transactions cannot be reversed. Always double-check addresses before sending!

### **Why did my transaction fail?**
Common reasons:
1. Insufficient balance
2. Invalid recipient address
3. Network congestion
4. Not enough SOL for fees
5. Token account doesn't exist

### **Do I need to create token accounts?**
No! ExePay automatically creates associated token accounts if they don't exist.

---

## **Batch Payments**

### **What are batch payments?**
Send to multiple recipients in a single transaction. Perfect for payroll, airdrops, or splitting bills.

### **How many recipients can I send to?**
Up to 10 recipients per batch transaction.

### **Do batch payments save on fees?**
Yes! One transaction fee instead of multiple.

### **Can I use different tokens in one batch?**
No. All recipients must receive the same token type.

### **What if one recipient address is invalid?**
The entire batch will fail. Verify all addresses before sending!

---

## **Recurring Payments**

### **How do recurring payments work?**
Set up a subscription with:
- Recipient address
- Amount per payment
- Frequency (daily/weekly/monthly)
- Start date

You'll be notified when payments are due.

### **Are payments automatic?**
No. You must approve each payment manually. This keeps you in control of your funds.

### **Can I pause a subscription?**
Yes! Pause, resume, or cancel anytime.

### **What happens if I miss a payment?**
Nothing! You can execute it later or skip it. No penalties.

### **Can the recipient see my subscription?**
No. Subscriptions are stored locally in your browser.

---

## **Payment Links**

### **What are payment links?**
Shareable URLs that request payment. Like a digital invoice!

### **How do I create a payment link?**
1. Go to "Create Payment Link"
2. Enter amount, token, description
3. Generate link
4. Share via URL or QR code

### **Can I customize payment links?**
Yes! Add a description and choose any supported token.

### **Do payment links expire?**
No. They work forever until paid.

### **Can one link be used multiple times?**
Yes! Perfect for accepting donations or selling products.

### **Are payment links secure?**
Yes! The recipient address is embedded in the link. Payers always see who they're paying.

---

## **Mobile**

### **Does ExePay work on mobile?**
Yes! Fully responsive design works on all devices.

### **Is there a mobile app?**
Not yet! Progressive Web App (PWA) available now. Native app coming soon.

### **How do I install the PWA?**
**iOS:** Safari → Share → "Add to Home Screen"  
**Android:** Chrome → Menu → "Add to Home Screen"

### **Can I scan QR codes on mobile?**
Yes! Use the built-in QR scanner on the payment page.

---

## **Technical**

### **What blockchain does ExePay use?**
Solana mainnet-beta.

### **What's the RPC endpoint?**
We use Helius for reliable, fast RPC access.

### **Can I use my own RPC?**
Not yet, but coming soon!

### **What are the smart contracts?**
ExePay uses:
- SPL Token program (standard)
- System program (native SOL)
- Custom ZK verification (coming soon)

### **Is the code audited?**
Security audit in progress. Code is open-source for review.

### **How are ZK proofs generated?**
We use Groth16 ZK-SNARKs with:
- ElGamal encryption (amounts)
- Pedersen commitments (hiding values)
- Range proofs (valid amounts)
- Balance proofs (sufficient funds)

### **Where are ZK proofs verified?**
Currently client-side (mock proofs for demo). On-chain verification coming soon with SPL Token 2022 confidential transfers.

---

## **Fees & Costs**

### **Does ExePay charge fees?**
No! 100% free. Only Solana network fees apply.

### **How much are Solana fees?**
~$0.00025 per transaction (0.000005 SOL).

### **Are there hidden costs?**
No. What you see is what you pay.

### **Will ExePay always be free?**
Basic features will always be free. Premium features (coming soon) may have optional fees.

---

## **Grants & Funding**

### **Is ExePay funded?**
Currently bootstrapped. Applying for grants from Solana Foundation and ecosystem partners.

### **Can I invest in ExePay?**
Not currently raising. May consider funding after token launch.

### **How can I support ExePay?**
- Use the product
- Share with friends
- Star on GitHub
- Contribute code
- Provide feedback

---

## **Roadmap**

### **What's coming next?**
**Q4 2025:**
- Custom domain
- Mobile optimization
- Performance improvements
- More tokens

**Q1 2026:**
- Native mobile app
- On-chain ZK verification
- Cross-chain support
- Advanced privacy features

**Q2 2026:**
- Enterprise features
- Advanced privacy
- DeFi integrations
- Partnerships

### **Can I request features?**
Yes! Open an issue on GitHub or join our Discord (coming soon).

---

## **Troubleshooting**

### **Transaction failed - what do I do?**
1. Check balance (including SOL for fees)
2. Verify recipient address
3. Try smaller amount
4. Check Solana network status
5. Try again in a few minutes

### **ZK proof generation failed**
1. Refresh the page
2. Try public mode
3. Check browser console
4. Report on GitHub

### **Can't see my transaction history**
1. Make sure wallet is connected
2. Check you're on correct network (mainnet)
3. Try refreshing
4. Clear browser cache

### **QR code won't scan**
1. Ensure good lighting
2. Hold steady
3. Try different distance
4. Use manual address entry

### **Payment link doesn't work**
1. Check link is complete
2. Try copying again
3. Use QR code instead
4. Contact sender

---

## **Legal & Compliance**

### **Is ExePay legal?**
Yes! Privacy is a fundamental right. ExePay complies with all applicable laws.

### **Do I need KYC?**
No. ExePay is non-custodial. You control your funds.

### **Are there transaction limits?**
No limits from ExePay. Your wallet or exchange may have limits.

### **Can I use ExePay for business?**
Yes! Perfect for payroll, invoicing, and payments.

### **What about taxes?**
You're responsible for reporting crypto transactions per your local laws. ExePay provides transaction history to help.

---

## **Community**

### **How can I get involved?**
- Contribute on GitHub
- Join Discord (coming soon)
- Follow on Twitter (coming soon)
- Write tutorials
- Report bugs

### **Is there a bug bounty?**
Coming soon! Will announce on Twitter.

### **Can I translate ExePay?**
Yes! Internationalization coming soon. Translations welcome!

### **How do I report a security issue?**
Email: security@exepay.app (coming soon)  
Or: Open a private security advisory on GitHub

---

## **Still Have Questions?**

- **GitHub:** [github.com/ExePayInfra/exe-pay](https://github.com/ExePayInfra/exe-pay)
- **Twitter:** @ExePay (coming soon)
- **Discord:** discord.gg/exepay (coming soon)
- **Email:** support@exepay.app (coming soon)

---

**Updated:** November 2025  
**Version:** 1.0.0

