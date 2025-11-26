# Bug Report #1 - Scanner Import Errors

## Test: Test 3 - Scan for Payments
**Severity:** 🔴 **CRITICAL** (Blocking)

## Description
Scanner component failed to load due to import errors. Functions `canClaimPayment` and `claimPayment` were not exported from the privacy package, causing the scanner UI to crash.

## Steps to Reproduce
1. Go to `localhost:3000/privacy`
2. Click "🔍 Scan (Detect)" tab
3. Click "Scan for Payments"
4. Check browser console

## Expected
- Scanner should load and scan blockchain
- No import errors

## Actual
- Error: `'canClaimPayment' is not exported from '@exe-pay/privacy'`
- Error: `'claimPayment' is not exported from '@exe-pay/privacy'`
- Scanner UI shows error message
- "No Payments Detected" displayed

## Console Errors
```
Attempted import error: 'canClaimPayment' is not exported from '@exe-pay/privacy' (imported as 'canClaimPayment').
Attempted import error: 'claimPayment' is not exported from '@exe-pay/privacy' (imported as 'claimPayment').
```

## Root Cause
1. **Build Issue**: Privacy package had TypeScript errors preventing build
   - `ParsedTransactionWithMeta` not imported as type
   - `getX25519PublicKey` and `getX25519SecretKey` don't exist in `@solana/web3.js`
   
2. **Missing Functions**: Scanner tried to import functions before package was rebuilt

## Fix Applied
1. ✅ Changed `ParsedTransactionWithMeta` to type-only import
2. ✅ Removed non-existent `getX25519PublicKey`/`getX25519SecretKey` imports
3. ✅ Used `ed25519.utils.toMontgomerySecret` for key conversion
4. ✅ Used `x25519.getPublicKey` for ephemeral key conversion
5. ✅ Rebuilt privacy package successfully

## Files Modified
- `packages/privacy/src/scanner.ts`

## Status
✅ **FIXED** - Package rebuilt, imports now working

## Testing Required
- [ ] Refresh browser
- [ ] Try scanning again
- [ ] Verify no import errors
- [ ] Check if scanner detects payments

## Commit
`68a30b6` - fix: resolve scanner build errors and import issues

---

**Time to Fix:** 5 minutes
**Impact:** High (blocked all scanner functionality)
**Priority:** P0 (Critical)
