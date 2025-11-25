# Development Guide

**ExePay Development Workflow and Best Practices**

---

## Table of Contents

1. [Development Workflow](#development-workflow)
2. [Local Testing](#local-testing)
3. [Environment Setup](#environment-setup)
4. [Code Standards](#code-standards)
5. [Deployment Process](#deployment-process)
6. [Troubleshooting](#troubleshooting)

---

## Development Workflow

### Core Principle

**⚠️ CRITICAL: All changes must be tested locally before deployment**

Our development workflow follows these steps:

1. **Develop** - Write code locally
2. **Test Locally** - Verify all functionality works
3. **Commit** - Save changes to git
4. **Test Again** - Re-verify after commit
5. **Deploy** - Push to production
6. **Verify** - Test on production

### Why Local Testing is Critical

- Prevents breaking production
- Catches bugs early
- Ensures security features work
- Validates user experience
- Reduces deployment rollbacks

---

## Local Testing

### Prerequisites

```bash
# Ensure dev server is running
pnpm dev

# Server should be accessible at:
http://localhost:3000
```

### Testing Checklist

Before any deployment, test these pages locally:

#### 1. Main Wallet Page (`/wallet`)

**Test:**
- [ ] Wallet connection (locked wallet)
- [ ] Signature verification
- [ ] Balance display
- [ ] Token selection
- [ ] Payment form
- [ ] Transaction submission
- [ ] Privacy modes (public/shielded/private)

**Expected:**
- Wallet asks for password if locked
- Signature request appears
- Connection persists after signing
- All forms work correctly

#### 2. Batch Payments (`/batch`)

**Test:**
- [ ] Wallet connection
- [ ] Add multiple recipients
- [ ] Remove recipients
- [ ] Amount calculation
- [ ] Form validation
- [ ] Batch transaction submission

**Expected:**
- Same wallet security as main page
- Can add/remove recipients
- Total calculates correctly
- Transactions send successfully

#### 3. Recurring Payments (`/recurring`)

**Test:**
- [ ] Wallet connection
- [ ] Create subscription
- [ ] Pause subscription
- [ ] Resume subscription
- [ ] Cancel subscription
- [ ] View active subscriptions

**Expected:**
- Same wallet security
- Subscriptions save correctly
- All actions work

#### 4. Transaction History (`/history`)

**Test:**
- [ ] Load transaction history
- [ ] View transaction details
- [ ] Solscan links work
- [ ] Pagination (if applicable)

**Expected:**
- Transactions load
- Details are accurate
- Links open correctly

### Testing Tools

**Browser Console:**
```javascript
// Open DevTools (F12)
// Watch for:
[ExePay] - Application logs
[ExePay Security] - Security verification logs
[Light Protocol] - Privacy feature logs
```

**Network Tab:**
- Monitor RPC requests
- Check for errors
- Verify response times

**Wallet Extension:**
- Test with locked wallet
- Test with unlocked wallet
- Test signature requests
- Test transaction approvals

---

## Environment Setup

### Required Files

**`.env.local` (Local Development)**

```env
# Network Configuration
NEXT_PUBLIC_SOLANA_NETWORK=devnet

# RPC Endpoints
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_LIGHT_RPC_URL=https://devnet.helius-rpc.com

# Optional: API Keys
NEXT_PUBLIC_HELIUS_API_KEY=
```

**`.env.production` (Production)**

```env
# Network Configuration
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta

# RPC Endpoints
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_LIGHT_RPC_URL=https://mainnet.helius-rpc.com

# API Keys (Required for production)
NEXT_PUBLIC_HELIUS_API_KEY=your-production-key
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SOLANA_NETWORK` | Network (devnet/mainnet-beta) | Yes |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | Solana RPC endpoint | Yes |
| `NEXT_PUBLIC_LIGHT_RPC_URL` | Light Protocol RPC endpoint | Yes |
| `NEXT_PUBLIC_HELIUS_API_KEY` | Helius API key | Optional (devnet), Required (mainnet) |

---

## Code Standards

### TypeScript

- Use strict mode
- Define interfaces for all data structures
- Avoid `any` types
- Use proper error handling

### React Components

- Use functional components
- Implement proper hooks usage
- Follow React best practices
- Add proper TypeScript types

### Security

- Always verify wallet signatures
- Never trust client-side data
- Validate all inputs
- Use secure RPC endpoints
- Clear sensitive data on disconnect

### Git Commits

**Format:**
```
type: brief description

Detailed explanation of changes
- What was changed
- Why it was changed
- How to test

Fixes #issue-number (if applicable)
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `refactor:` - Code refactoring
- `test:` - Testing
- `chore:` - Maintenance

**Example:**
```
fix: wallet verification state persistence

CRITICAL FIX:
- Store verified wallet in sessionStorage
- Check on component mount
- Persist across re-renders

Testing:
1. Connect wallet on /batch
2. Sign verification
3. Verify stays connected

Fixes #123
```

---

## Deployment Process

### Pre-Deployment Checklist

**⚠️ MANDATORY: Complete ALL items before deployment**

- [ ] All features tested locally
- [ ] No console errors
- [ ] Wallet security verified
- [ ] All pages working
- [ ] Mobile responsive tested
- [ ] Code committed to git
- [ ] Documentation updated

### Deployment Steps

**1. Local Testing**
```bash
# Ensure dev server is running
pnpm dev

# Test ALL pages:
# - http://localhost:3000
# - http://localhost:3000/wallet
# - http://localhost:3000/batch
# - http://localhost:3000/recurring
# - http://localhost:3000/history
```

**2. Commit Changes**
```bash
git add -A
git commit -m "feat: description of changes"
```

**3. Test Again**
```bash
# Restart dev server
pnpm dev

# Re-test all pages
# Verify nothing broke
```

**4. Deploy**
```bash
git push origin main
```

**5. Monitor Deployment**
- Watch Vercel dashboard
- Check build logs
- Verify deployment success

**6. Test Production**
- Test production URL
- Verify all features work
- Check wallet security
- Test on mobile

### Rollback Procedure

**If issues found in production:**

```bash
# Revert last commit
git revert HEAD

# Push revert
git push origin main

# Or rollback in Vercel dashboard
# Settings → Deployments → Promote previous deployment
```

---

## Troubleshooting

### Common Issues

#### Issue: Environment variables not loading

**Solution:**
```bash
# Ensure file is named exactly:
.env.local

# Restart dev server:
pnpm dev
```

#### Issue: Wallet not connecting

**Checklist:**
- [ ] Wallet extension installed
- [ ] Wallet unlocked
- [ ] Correct network selected
- [ ] Browser console for errors

#### Issue: Transactions failing

**Checklist:**
- [ ] Sufficient balance
- [ ] Correct RPC endpoint
- [ ] Network not congested
- [ ] Valid recipient address

#### Issue: Build errors

**Solution:**
```bash
# Clean build
pnpm clean

# Reinstall dependencies
rm -rf node_modules
pnpm install

# Rebuild
pnpm build
```

### Debug Mode

**Enable verbose logging:**

```typescript
// In browser console:
localStorage.setItem('debug', 'exepay:*');

// Reload page
location.reload();
```

### Getting Help

**Before asking for help:**
1. Check console for errors
2. Review this documentation
3. Test in incognito mode
4. Try different wallet
5. Check network status

**When reporting issues:**
- Describe what you were doing
- Include error messages
- Provide console logs
- Mention browser/wallet used
- Steps to reproduce

---

## Best Practices

### Security

1. **Always verify wallet signatures**
   - Never trust `connected` status alone
   - Require signature verification
   - Store verification in sessionStorage

2. **Validate all inputs**
   - Check addresses are valid
   - Verify amounts are positive
   - Sanitize user input

3. **Clear sensitive data**
   - On disconnect
   - On tab close
   - On errors

### Performance

1. **Optimize RPC calls**
   - Batch when possible
   - Cache results
   - Handle rate limits

2. **Lazy load components**
   - Dynamic imports
   - Code splitting
   - Reduce bundle size

3. **Optimize images**
   - Use Next.js Image component
   - Compress images
   - Use appropriate formats

### User Experience

1. **Clear feedback**
   - Loading states
   - Error messages
   - Success confirmations

2. **Responsive design**
   - Test on mobile
   - Test on tablet
   - Test on desktop

3. **Accessibility**
   - Keyboard navigation
   - Screen reader support
   - Color contrast

---

## Testing Matrix

### Browsers

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

### Wallets

Test with:
- [ ] Phantom (desktop)
- [ ] Phantom (mobile)
- [ ] Solflare (desktop)
- [ ] Solflare (mobile)
- [ ] Coinbase Wallet
- [ ] Trust Wallet

### Networks

Test on:
- [ ] Devnet (development)
- [ ] Mainnet (production)

### Scenarios

Test:
- [ ] Locked wallet
- [ ] Unlocked wallet
- [ ] Signature rejection
- [ ] Transaction rejection
- [ ] Insufficient balance
- [ ] Network errors
- [ ] Page refresh
- [ ] Tab close/reopen

---

## Continuous Integration

### Automated Checks

**On every commit:**
- TypeScript compilation
- Linting
- Unit tests (when implemented)

**On every PR:**
- Build verification
- Integration tests (when implemented)
- Security checks

### Manual Checks

**Before merging:**
- Local testing completed
- Code review passed
- Documentation updated
- Changelog updated

---

## Documentation Standards

### Code Comments

```typescript
/**
 * Brief description of function
 * 
 * Detailed explanation if needed
 * 
 * @param param1 - Description
 * @param param2 - Description
 * @returns Description
 * 
 * @example
 * ```typescript
 * const result = myFunction(arg1, arg2);
 * ```
 */
```

### README Files

- Clear purpose statement
- Installation instructions
- Usage examples
- API documentation
- Troubleshooting section

### Changelog

Keep `CHANGELOG.md` updated:

```markdown
## [Version] - YYYY-MM-DD

### Added
- New features

### Changed
- Modified features

### Fixed
- Bug fixes

### Security
- Security improvements
```

---

## Resources

### Internal Documentation

- [README.md](./README.md) - Project overview
- [ROADMAP.md](./ROADMAP.md) - Development roadmap
- [SECURITY.md](./SECURITY.md) - Security practices
- [CHANGELOG.md](./CHANGELOG.md) - Version history

### External Resources

- [Solana Documentation](https://docs.solana.com)
- [Light Protocol Docs](https://docs.lightprotocol.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

## Summary

**Key Takeaways:**

1. ✅ **Always test locally first**
2. ✅ **Follow the deployment checklist**
3. ✅ **Verify wallet security**
4. ✅ **Document all changes**
5. ✅ **Test on multiple browsers/wallets**

**Remember:** Quality over speed. Taking time to test properly prevents production issues and maintains user trust.

---

**Questions?** Review this guide or check the troubleshooting section.

**Ready to develop?** Start with local testing!

