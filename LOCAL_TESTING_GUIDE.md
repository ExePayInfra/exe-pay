# 🧪 LOCAL TESTING GUIDE - New UI Changes

## 🚀 Dev Server Running

The development server is now running at:
- **Homepage**: http://localhost:3000
- **Wallet**: http://localhost:3000/wallet
- **Batch**: http://localhost:3000/batch
- **Recurring**: http://localhost:3000/recurring
- **History**: http://localhost:3000/history

---

## ✅ What to Test

### 1. Homepage (http://localhost:3000)

#### Partner Section:
- [ ] See "Powered By" heading (not "Built With")
- [ ] Partner logos appear as icons in white cards:
  - Light Protocol (L icon, indigo gradient)
  - Solana (colorful gradient logo)
  - Phantom (purple ghost icon)
  - Helius (H icon, blue gradient)
  - Raydium (layers icon, cyan gradient)
  - Pump.fun (P icon, green gradient)
- [ ] Icons scroll infinitely from right to left
- [ ] Hover over logos - they should scale up slightly

#### Privacy Mode Cards:
- [ ] Three cards: Public, Shielded, Private
- [ ] Each card has a description box:
  - Public: "Fast & transparent - Best for everyday payments"
  - Shielded: "Most used - Hide amounts, show addresses"
  - Private: "Maximum security - Complete anonymity"
- [ ] Hover over cards - they should scale up
- [ ] Animated background blobs

#### Footer:
- [ ] New text: "Privacy-preserving payments infrastructure powered by Solana & Light Protocol"
- [ ] No more "Built with ❤️"

---

### 2. Wallet Page (http://localhost:3000/wallet)

#### Before Connecting Wallet:
- [ ] Gradient background (indigo → white → purple)
- [ ] Beautiful centered card with pulsing wallet icon
- [ ] "Connect Your Wallet" heading
- [ ] List of supported wallets (Phantom, Solflare, Coinbase, Trust)
- [ ] Smooth animations

#### After Connecting Wallet:
- [ ] 2-column layout (form on left, sidebar on right)
- [ ] **Wallet Header Card**:
  - [ ] Shows connected address (short format)
  - [ ] Shows SOL balance
  - [ ] Disconnect button
- [ ] **Token Selector**:
  - [ ] Grid of 4 tokens with emojis
  - [ ] 💰 SOL | 💵 USDC | 💎 USDT | 🔷 Custom
  - [ ] Selected token has shadow and indigo border
- [ ] **Privacy Level Cards**:
  - [ ] Public ⚡ Fast
  - [ ] Shielded 🛡️ Hidden amount (SIMULATED badge)
  - [ ] Private 🔒 Anonymous (SIMULATED badge)
- [ ] **Form Fields**:
  - [ ] Recipient address input
  - [ ] Amount input with token symbol on right
  - [ ] Shows "Remaining balance" calculation
  - [ ] Optional memo field
- [ ] **Send Button**:
  - [ ] Gradient (indigo → purple)
  - [ ] Text changes based on privacy level
  - [ ] Hover lift effect

#### Sidebar (Right Column):
- [ ] **Privacy Features Card**:
  - [ ] Zero-Knowledge Proofs
  - [ ] Hidden Amounts
  - [ ] Anonymous Transfers
  - [ ] Each with colored icon
- [ ] **Network Stats Card**:
  - [ ] Transaction Speed: < 1 second
  - [ ] Average Fee: $0.0001
  - [ ] Network: Solana Mainnet
- [ ] **Help Card**:
  - [ ] Link to docs.exepay.app
  - [ ] Gradient background

#### After Sending Payment:
- [ ] Success: Green card with checkmark
- [ ] Error: Red card with X icon
- [ ] Link to Solscan
- [ ] Smooth scale-in animation

---

## 🎨 Visual Quality Checklist

### Homepage:
- [ ] Smooth animations (fade-in, slide-up)
- [ ] Partner logos look professional
- [ ] Cards have subtle shadows
- [ ] Hover effects work
- [ ] Mobile responsive

### Wallet Page:
- [ ] Glassmorphism cards (frosted glass effect)
- [ ] Gradient background visible
- [ ] All animations smooth
- [ ] Proper spacing and padding
- [ ] Balance updates after transaction
- [ ] Mobile responsive (sidebar goes below form)

---

## 🐛 Common Issues & Fixes

### Issue: "Invalid public key input" error (FIXED ✅)
This error has been fixed! The problem was:
- Lazy loading of PublicKey instances
- Fixed invalid program ID (44 chars required)
If you still see it, restart dev server:
```bash
pkill -f "next dev"
cd /Users/kingchief/Documents/EXE
pnpm dev
```

### Issue: Dev server won't start
```bash
# Kill existing process
pkill -f "next dev"

# Restart
cd /Users/kingchief/Documents/EXE
pnpm dev
```

### Issue: Changes not showing
```bash
# Clear Next.js cache
rm -rf apps/web/.next
pnpm dev
```

### Issue: Wallet won't connect
- Make sure Phantom/Solflare is installed
- Try refreshing the page
- Check browser console for errors

### Issue: Balance not showing
- This is expected on devnet (if no balance)
- Switch to mainnet in .env.local
- Or just test the UI without balance

---

## 📱 Mobile Testing

### Test on Mobile:
1. Get your local IP: `ifconfig | grep "inet "`
2. On mobile, open: `http://YOUR_IP:3000`
3. Test wallet connection (should open wallet app)

---

## ✨ Key Improvements to Notice

### Homepage:
- Professional partner logos (not just text)
- Better privacy card descriptions
- More professional footer copy

### Wallet Page:
- **Much more visual** - colors, gradients, icons
- **Better UX** - clear sections, sidebar info
- **Real balance** - shows your SOL balance
- **Better feedback** - success/error states
- **More professional** - looks like a real product

---

## 🎯 Testing Flow

1. **Open homepage** - check partners & cards
2. **Navigate to /wallet**
3. **Connect wallet** - test the flow
4. **Select different tokens** - see selection state
5. **Toggle privacy levels** - check badges
6. **Enter a test address** - see form validation
7. **Send a small test payment** (0.001 SOL)
8. **Check success state** - see animation & Solscan link

---

## 🚀 Ready for Production?

Once you test and everything looks good:
- Wait for Vercel deployment limit to reset (2 hours)
- Or upgrade to Vercel Pro for unlimited deployments
- Changes will auto-deploy when limit resets

---

**Enjoy testing your beautiful new UI! 🎨✨**

Let me know if you find any issues or want to adjust anything!

