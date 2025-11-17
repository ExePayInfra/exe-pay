# 🎨 Partner Logos Setup - Quick Guide

Your homepage is now set up to display official partner logos! Follow these simple steps to add them.

## 📁 Where to Add Logos

Save all logo files in: `apps/web/public/logos/`

## 📥 Quick Download Links

### 1. **Solana** ⚡
- Download: https://solana.com/branding
- Save as: `solana.svg` or `solana.png`

### 2. **Phantom** 👻
- Download: https://phantom.app/brand
- Save as: `phantom.svg` or `phantom.png`

### 3. **Jupiter** 🪐
- Download: https://jup.ag (look for press kit/brand assets)
- Save as: `jupiter.svg` or `jupiter.png`

### 4. **Raydium** 💧
- Download: https://raydium.io (look for brand assets)
- Save as: `raydium.svg` or `raydium.png`

### 5. **Magic Eden** ✨
- Download: https://magiceden.io (look for press kit)
- Save as: `magic-eden.svg` or `magic-eden.png`

### 6. **Helius** ☀️
- Download: https://helius.dev (look for brand assets)
- Save as: `helius.svg` or `helius.png`

### 7. **Light Protocol** 💡
- Download: https://lightprotocol.com (look for brand assets)
- Save as: `light-protocol.svg` or `light-protocol.png`

### 8. **Pump.fun** 🚀
- Download: https://pump.fun (look for brand assets)
- Save as: `pump-fun.svg` or `pump-fun.png`

---

## ✅ File Checklist

After downloading, your logos folder should look like this:

```
apps/web/public/logos/
├── solana.svg (or .png)
├── phantom.svg (or .png)
├── jupiter.svg (or .png)
├── raydium.svg (or .png)
├── magic-eden.svg (or .png)
├── helius.svg (or .png)
├── light-protocol.svg (or .png)
└── pump-fun.svg (or .png)
```

---

## 🎨 Logo Requirements

- **Format**: SVG preferred (best quality), PNG as backup
- **Size**: Minimum 512x512px for PNG files
- **Background**: Transparent
- **Colors**: Full color (the website applies grayscale effect automatically)

---

## 🚀 How It Works

Once you add the logos:
1. The homepage will **automatically detect** and load them
2. Logos appear in **grayscale** by default
3. They become **full color** on hover
4. The circular gradient background shows through

**No code changes needed!** Just drop the files in the `logos/` folder and refresh your browser.

---

## 💡 Tips

1. **SVG is best**: Scalable and looks crisp at any size
2. **PNG backup**: The system tries `.svg` first, then falls back to `.png`
3. **File names matter**: Use exact names listed above (lowercase, with hyphens)
4. **Test locally**: Run `pnpm dev` and check `http://localhost:3000`

---

## 🆘 Need Help?

If a logo isn't showing up:
1. Check the file name matches exactly (e.g., `phantom.svg`, not `Phantom.svg`)
2. Make sure it's in `/apps/web/public/logos/`
3. Try clearing your browser cache (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
4. Check browser console for errors (F12 → Console tab)

---

**Note**: The current placeholder icons will display until you add the actual logo files. This ensures your site looks professional even during the transition!

