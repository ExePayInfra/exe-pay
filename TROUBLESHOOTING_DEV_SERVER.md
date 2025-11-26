# Dev Server Troubleshooting

## Current Issue: 404 on localhost:3000

### What's Happening:

- Server is running (node process on port 3000)
- But showing 404 for all pages
- This happens when Next.js is still compiling or has a build issue

### Solution Steps:

#### 1. Hard Refresh Your Browser

**This is the most common fix!**

- **Chrome/Brave:** `Cmd + Shift + R` (Mac) or `Ctrl + Shift + F5` (Windows)
- **Safari:** `Cmd + Option + R`
- **Firefox:** `Ctrl + Shift + R`

Or try **Incognito/Private Mode** to bypass cache entirely.

#### 2. Wait for Full Compilation

The monorepo needs time to build all packages:

- **Core package** (~10-15 seconds)
- **Privacy package** (~10-15 seconds)
- **Web app** (~20-30 seconds)
- **Total:** 40-60 seconds from cold start

**Check console for:** "compiled successfully" messages

#### 3. If Still Not Working:

```bash
# Kill everything
cd /Users/kingchief/Documents/EXE
killall -9 node

# Clean all caches
rm -rf apps/web/.next .next node_modules/.cache

# Restart with increased file limit
ulimit -n 65536
pnpm dev
```

#### 4. Alternative: Run Only Web App

If monorepo is too heavy:

```bash
# Kill all
killall -9 node

# Build packages once
pnpm build --filter=@exe-pay/core
pnpm build --filter=@exe-pay/privacy

# Run only web
cd apps/web
pnpm dev
```

### Current Status:

- ✅ Server is running
- ⏳ Waiting for compilation
- 🔄 Try hard refresh in browser

### Expected Behavior:

When working, you should see:

```
✓ Ready in 2.3s
○ Compiling / ...
✓ Compiled / in 1.2s
```

### Common Causes:

1. **Browser cache** - Most common! Hard refresh fixes it
2. **Slow compilation** - Wait 60 seconds, then refresh
3. **File descriptor limit** - Use `ulimit -n 65536`
4. **Package not built** - Monorepo needs all packages compiled

---

**TRY THIS NOW:**

1. Wait 30 more seconds
2. Hard refresh browser (`Cmd + Shift + R`)
3. If still 404, check terminal for compilation errors
