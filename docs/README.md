# ExePay Documentation

Welcome to the ExePay documentation! This directory contains all the guides, references, and resources you need to build with ExePay.

## 📚 Documentation Structure

### **Getting Started**
- [Getting Started](./GETTING_STARTED.md) - Installation and setup guide
- [Quick Start](./QUICK_START.md) - 5-minute quick start guide
- [Features Overview](./FEATURES.md) - Complete feature list with examples

### **SDK & Integration**
- [SDK Integration Guide](./SDK_INTEGRATION_GUIDE.md) - **NEW!** Complete SDK integration guide
- [API Reference](./API_REFERENCE.md) - Full API documentation with examples
- [Privacy Guide](./PRIVACY_GUIDE.md) - **NEW!** Privacy levels explained
- [Payment Links Guide](./PAYMENT_LINKS_GUIDE.md) - **NEW!** Create shareable payment links

### **Development**
- [Development Summary](./development/SUMMARY.md) - Technical architecture overview
- [User Guide](./USER_GUIDE.md) - End-user documentation

### **Deployment Guides**
- [Deploy to Vercel](./guides/DEPLOY_TO_VERCEL.md) - Deploy the web app
- [Mainnet Deployment](./guides/MAINNET_DEPLOY.md) - Production deployment guide
- [Quick Start (Mainnet)](./guides/QUICK_START_MAINNET.md) - Fast mainnet setup
- [Domain Setup](./guides/DOMAIN_SETUP.md) - Custom domain configuration

### **Archive**
Historical documentation and session notes are stored in `./archive/` for reference.

## 🚀 Quick Links

- **[Main README](../README.md)** - Project overview
- **[Contributing Guide](../CONTRIBUTING.md)** - How to contribute
- **[License](../LICENSE)** - MIT License

## 📖 Usage Examples

### Simple Payment
```typescript
import { createPayment } from '@exe-pay/core';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

const { publicKey, signTransaction } = useWallet();
const { connection } = useConnection();

const result = await createPayment({
  connection,
  sender: publicKey,
  recipient: new PublicKey('RECIPIENT_ADDRESS'),
  amount: 0.1, // 0.1 SOL
  signTransaction,
});

console.log('Payment sent!', result.signature);
```

### Private Payment
```typescript
import { createPrivateTransfer } from '@exe-pay/privacy';

const result = await createPrivateTransfer({
  connection,
  sender: publicKey,
  recipient: recipientPublicKey,
  amount: 1.0, // Amount and recipient hidden on-chain
  signTransaction,
});

console.log('Private payment sent!', result.signature);
```

### React Integration
```typescript
import { useExePay } from '@exe-pay/react-hooks';

function PaymentButton() {
  const { sendPayment, connected } = useExePay();

  const handlePay = async () => {
    const result = await sendPayment({
      recipient: 'RECIPIENT_ADDRESS',
      amount: 0.5,
      privacyLevel: 'private',
    });
    alert(`Payment sent! ${result.signature}`);
  };

  return (
    <button onClick={handlePay} disabled={!connected}>
      Send Payment
    </button>
  );
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

