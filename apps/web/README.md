# ExePay Web

Beautiful web interface for ExePay - privacy-preserving payments on Solana.

## Features

- 🎨 Modern, glassmorphism UI design
- 🔐 Wallet integration (Phantom, Solflare)
- ⚡ Real-time transaction processing
- 📊 Live statistics dashboard
- 🌓 Dark mode optimized
- 📱 Fully responsive

## Getting Started

### Install Dependencies

```bash
cd /Users/kingchief/Documents/EXE
pnpm install
```

### Run Development Server

```bash
pnpm --filter @exe-pay/web dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **Solana Wallet Adapter** - Wallet connection
- **@exe-pay/core** - Payment SDK
- **Light Protocol** - ZK compression (coming soon)

## Usage

1. **Connect Wallet**: Click "Select Wallet" in the header
2. **Enter Details**: Recipient address, amount, and optional memo
3. **Send Payment**: Click "Send Private Payment"
4. **View Transaction**: Check Solana Explorer for confirmation

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd apps/web
vercel
```

### Other Platforms

- **Netlify**: Connect GitHub repo and set build command to `pnpm build --filter @exe-pay/web`
- **Railway**: Use dockerfile or buildpack
- **Self-hosted**: `pnpm build && pnpm start`

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
```

## Development

### Project Structure

```
apps/web/
├── src/
│   ├── app/           # Next.js app router pages
│   ├── components/    # React components
│   └── lib/           # Utilities
├── public/            # Static assets
└── package.json
```

### Key Components

- `PaymentForm.tsx` - Main payment interface
- `WalletProvider.tsx` - Solana wallet context
- `Stats.tsx` - Dashboard statistics

## License

Apache-2.0

