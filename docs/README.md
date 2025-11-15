# ExePay Documentation

Welcome to the ExePay documentation! This directory contains all the guides, references, and resources you need to build with ExePay.

## 📚 Documentation Structure

### **Getting Started**
- [Getting Started](./GETTING_STARTED.md) - Installation and setup guide
- [Features Overview](./FEATURES.md) - Complete feature list with examples

### **Development**
- [API Reference](./development/API.md) - Full API documentation
- [Development Summary](./development/SUMMARY.md) - Technical architecture overview

### **Deployment Guides**
- [Deploy to Vercel](./guides/DEPLOY_TO_VERCEL.md) - Deploy the web app
- [Mainnet Deployment](./guides/MAINNET_DEPLOY.md) - Production deployment guide
- [Quick Start (Mainnet)](./guides/QUICK_START_MAINNET.md) - Fast mainnet setup
- [Domain Setup](./guides/DOMAIN_SETUP.md) - Custom domain configuration
- [Payment Links](./guides/PAYMENT_LINKS_GUIDE.md) - Payment link integration

### **Archive**
Historical documentation and session notes are stored in `./archive/` for reference.

## 🚀 Quick Links

- **[Main README](../README.md)** - Project overview
- **[Contributing Guide](../CONTRIBUTING.md)** - How to contribute
- **[License](../LICENSE)** - MIT License

## 📖 Usage Examples

### Simple Payment
```typescript
import { ExePayClient } from '@exe-pay/core';

const client = new ExePayClient({
  clusterUrl: 'https://api.mainnet-beta.solana.com'
});

const intent = client.createIntent({
  amount: 1000000,
  merchant: merchantPublicKey,
  memo: 'Private payment'
});

const payment = await client.build(intent, { feePayer: payerPublicKey });
const result = await client.settle(payment, signer);
```

### React Integration
```typescript
import { usePrivatePayment } from '@exe-pay/react-hooks';

function PaymentButton() {
  const { sendPayment, loading } = usePrivatePayment();

  const handlePay = async () => {
    await sendPayment({
      recipient: 'RECIPIENT_ADDRESS',
      amount: 1000000,
      privacyLevel: 'private'
    });
  };

  return <button onClick={handlePay} disabled={loading}>Pay</button>;
}
```

## 🔒 Security

- Always test on devnet before mainnet
- Never commit private keys or sensitive data
- Use environment variables for configuration
- Report security issues to: exechainlink@outlook.com

## 📞 Need Help?

- **GitHub Issues**: [Report a bug](https://github.com/ExePayInfra/exe-pay/issues)
- **Email**: exechainlink@outlook.com

---

**Happy building!** 🎉

