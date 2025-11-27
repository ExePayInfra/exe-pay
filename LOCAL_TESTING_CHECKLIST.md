# Local Testing Checklist

**Complete testing guide before deployment**

---

## 🚀 Start Local Server

```bash
cd /Users/kingchief/Documents/EXE

# Clean install
rm -rf node_modules pnpm-lock.yaml .next apps/web/.next
pnpm install

# Build all packages
pnpm build

# Start dev server
pnpm dev
```

Visit: `http://localhost:3000`

---

## ✅ Testing Checklist

### 1. **Homepage** (`/`)
- [ ] Page loads without errors
- [ ] Logo displays correctly ("ExePay" as one word, black "Pay")
- [ ] Hero section animates smoothly
- [ ] "Launch App" button works
- [ ] "Documentation" button works
- [ ] Stats section displays (1,247 transactions, $125.5K volume, 389 users, 100% privacy)
- [ ] Partner logos scroll smoothly
- [ ] Features section visible
- [ ] Footer links work
- [ ] Mobile responsive

---

### 2. **Wallet Page** (`/wallet`)
- [ ] Page loads without errors
- [ ] Back button works
- [ ] Wallet connection modal opens
- [ ] Can connect wallet (test with Phantom/Solflare)
- [ ] Balance displays correctly
- [ ] Token selector works (SOL, USDC, USDT, BONK, JUP)
- [ ] Privacy level selector works:
  - [ ] Public option
  - [ ] Stealth option (with "Learn More" link)
  - [ ] Light Protocol option (with "Learn More" link)
- [ ] Tooltips appear on hover (Privacy Level, Memo)
- [ ] Recipient address input works
- [ ] Amount input works
- [ ] Memo input works (optional)
- [ ] Send button enabled when form complete
- [ ] Send button hover animation works
- [ ] Privacy cards lift on hover
- [ ] Stealth Address Card displays in sidebar
- [ ] Mobile responsive

---

### 3. **Privacy Page** (`/privacy`)
- [ ] Page loads without errors
- [ ] Back button works
- [ ] Main tabs visible (Stealth System, Light Protocol)
- [ ] **Stealth System Tab**:
  - [ ] Sub-tabs visible (Receive, Send, Scan & Claim)
  - [ ] **Receive Tab**:
    - [ ] "Sign to Generate Address" button works
    - [ ] Stealth meta-address generates
    - [ ] QR code displays
    - [ ] Copy button works
  - [ ] **Send Tab**:
    - [ ] Stealth meta-address input works
    - [ ] One-time address generates
    - [ ] Copy button for one-time address works
    - [ ] Amount input works
    - [ ] Memo input works
    - [ ] Send button works
  - [ ] **Scan & Claim Tab**:
    - [ ] "Enable Privacy Scanning" button works
    - [ ] Scanning detects payments
    - [ ] Payments display with details
    - [ ] "Claim" button works
    - [ ] Notification appears (not ugly alert)
- [ ] **Light Protocol Tab**:
  - [ ] Shielded Pool Manager displays
  - [ ] Shows shielded balance
  - [ ] Features visible
- [ ] Tab switching smooth
- [ ] Mobile responsive

---

### 4. **Batch Page** (`/batch`)
- [ ] Page loads without errors
- [ ] Back button works
- [ ] Breadcrumbs display
- [ ] Wallet connection works
- [ ] Token selector works
- [ ] Add recipient button works
- [ ] Can add multiple recipients
- [ ] Remove recipient button works
- [ ] CSV import works (if implemented)
- [ ] Total calculation correct
- [ ] Send batch button works
- [ ] Progress tracking displays
- [ ] Transaction confirmation shows
- [ ] Mobile responsive

---

### 5. **Recurring Page** (`/recurring`)
- [ ] Page loads without errors
- [ ] Back button works
- [ ] Breadcrumbs display
- [ ] Wallet connection works
- [ ] Token selector works
- [ ] Recipient input works
- [ ] Amount input works
- [ ] Interval selector works (Daily, Weekly, Monthly, Custom)
- [ ] Start date picker works
- [ ] End date picker works (optional)
- [ ] Create recurring payment button works
- [ ] Recurring payments list displays
- [ ] Pause/Resume buttons work
- [ ] Cancel button works
- [ ] Mobile responsive

---

### 6. **Links Page** (`/links`)
- [ ] Page loads without errors
- [ ] Back button works
- [ ] Wallet connection works
- [ ] "Create Payment Link" button works
- [ ] Link creation form displays
- [ ] Token selector works
- [ ] Amount input works
- [ ] Memo input works
- [ ] Expiration date picker works (optional)
- [ ] Max uses input works (optional)
- [ ] Create link button works
- [ ] QR code generates
- [ ] Link URL displays
- [ ] Copy link button works
- [ ] Payment links list displays
- [ ] Delete link button works
- [ ] Mobile responsive

---

### 7. **History Page** (`/history`)
- [ ] Page loads without errors
- [ ] Back button works
- [ ] Address input works
- [ ] "Fetch History" button works
- [ ] Transactions display
- [ ] Transaction details show (date, amount, status, signature)
- [ ] Explorer links work
- [ ] Export CSV button works
- [ ] CSV downloads correctly
- [ ] Mobile responsive

---

## 🔍 Cross-Browser Testing

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## 📱 Mobile Testing

Test on:
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] iPad (Safari)

Check:
- [ ] Touch interactions work
- [ ] Buttons are tappable
- [ ] Text is readable
- [ ] No horizontal scroll
- [ ] Menus work properly
- [ ] Wallet connections work

---

## 🎨 UI/UX Testing

### Animations:
- [ ] Page transitions smooth
- [ ] Hover effects work
- [ ] Loading states display
- [ ] Success/error notifications appear
- [ ] No janky animations
- [ ] Reduced motion respected (if enabled)

### Navigation:
- [ ] All back buttons work
- [ ] Breadcrumbs accurate
- [ ] Menu always accessible
- [ ] Mobile menu works
- [ ] No broken links

### Responsiveness:
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] Mobile (320x568) - smallest

---

## 🔐 Security Testing

- [ ] No private keys in console
- [ ] No sensitive data in localStorage
- [ ] Wallet disconnects properly
- [ ] Message signing works
- [ ] No XSS vulnerabilities
- [ ] HTTPS enforced (in production)

---

## ⚡ Performance Testing

### Lighthouse Audit:
```bash
# Run Lighthouse in Chrome DevTools
# Target scores:
# Performance: > 90
# Accessibility: > 90
# Best Practices: > 90
# SEO: > 90
```

### Load Times:
- [ ] Homepage < 2s
- [ ] Wallet page < 3s
- [ ] Privacy page < 3s
- [ ] Other pages < 2s

### Console:
- [ ] No errors in console
- [ ] No warnings (except known dev warnings)
- [ ] No memory leaks

---

## 🧪 Functional Testing

### Wallet Integration:
Test with **at least 2 different wallets**:
- [ ] Phantom
- [ ] Solflare
- [ ] Coinbase Wallet
- [ ] Trust Wallet

### Payment Testing:
**⚠️ Use Devnet/Testnet for testing!**

- [ ] Send 0.01 SOL (public)
- [ ] Send 0.01 USDC (public)
- [ ] Send stealth payment
- [ ] Scan for stealth payment
- [ ] Claim stealth payment
- [ ] Create batch payment (3 recipients)
- [ ] Create recurring payment
- [ ] Create payment link
- [ ] Scan QR code

---

## 📊 Data Testing

### Edge Cases:
- [ ] Empty wallet (0 balance)
- [ ] Very small amounts (0.000001 SOL)
- [ ] Very large amounts (1000 SOL)
- [ ] Special characters in memo
- [ ] Long addresses
- [ ] Invalid addresses
- [ ] Network errors
- [ ] RPC timeouts

---

## 🐛 Bug Tracking

### If you find issues:

1. **Document the bug**:
   - What happened?
   - What should have happened?
   - Steps to reproduce
   - Browser/device
   - Screenshots/video

2. **Check console**:
   - Any errors?
   - Any warnings?
   - Network requests failing?

3. **Test workaround**:
   - Can you work around it?
   - Is it blocking?
   - Does it affect other features?

---

## ✅ Final Checks

Before declaring "ready to deploy":

- [ ] All features tested and working
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Cross-browser compatible
- [ ] Performance acceptable
- [ ] Security verified
- [ ] Documentation accurate
- [ ] Known issues documented

---

## 📝 Testing Notes

**Date**: _______________  
**Tester**: _______________  
**Environment**: _______________  

### Issues Found:
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

### Resolved:
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

### Outstanding:
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

---

## 🎉 Ready to Deploy?

If all checkboxes are checked and no critical issues remain:

**✅ READY FOR PRODUCTION DEPLOYMENT!**

---

**Last Updated**: November 27, 2025  
**Version**: 1.0.0

