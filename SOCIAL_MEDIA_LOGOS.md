# 🎨 ExePay Social Media Logos - Export Guide

## ✅ **All Files Created!**

### **Logo Files:**
- ✅ `logo-perfect.svg` - Main logo (320x120) with Inter SemiBold
- ✅ `twitter-profile-400.svg` - Twitter/X profile picture
- ✅ `twitter-banner-1500x500.svg` - Twitter/X header banner
- ✅ `discord-512.svg` - Discord server icon
- ✅ `linkedin-400.svg` - LinkedIn profile picture
- ✅ `high-res-2000.svg` - High-resolution for print/downloads

---

## 📁 **File Locations:**

```
apps/web/public/
├── logo-perfect.svg (Main logo)
└── social-media/
    ├── twitter-profile-400.svg
    ├── twitter-banner-1500x500.svg
    ├── discord-512.svg
    ├── linkedin-400.svg
    └── high-res-2000.svg
```

---

## 🎯 **Perfect Alignment:**

### **What's Fixed:**
✅ **X is PERFECTLY CENTERED** between both E's
✅ **Pay is ALIGNED** with E's baseline (y=95)
✅ **Inter SemiBold font** (modern & professional)
✅ **Equal spacing** on both sides of X

### **Measurements:**
- Left E: x=30 to x=70 (width: 40px)
- Gap: 15px
- X center: x=85 (PERFECTLY CENTERED!)
- Gap: 15px  
- Right E: x=100 to x=140 (width: 40px)
- Pay baseline: y=95 (aligned with E's bottom)

---

## 📊 **Social Media Sizes:**

### **1. Twitter/X Profile Picture**
- **File:** `twitter-profile-400.svg`
- **Size:** 400x400px
- **Format:** Square
- **Use:** Profile picture on Twitter/X

**To Export to PNG:**
```bash
cd apps/web/public/social-media
rsvg-convert -w 400 -h 400 twitter-profile-400.svg > twitter-profile.png
```

---

### **2. Twitter/X Banner**
- **File:** `twitter-banner-1500x500.svg`
- **Size:** 1500x500px
- **Format:** Wide banner
- **Use:** Header image on Twitter/X
- **Features:** Gradient background + tagline

**To Export to PNG:**
```bash
rsvg-convert -w 1500 -h 500 twitter-banner-1500x500.svg > twitter-banner.png
```

---

### **3. Discord Server Icon**
- **File:** `discord-512.svg`
- **Size:** 512x512px
- **Format:** Square
- **Use:** Discord server icon

**To Export to PNG:**
```bash
rsvg-convert -w 512 -h 512 discord-512.svg > discord-icon.png
```

---

### **4. LinkedIn Profile Picture**
- **File:** `linkedin-400.svg`
- **Size:** 400x400px
- **Format:** Square
- **Use:** LinkedIn profile picture

**To Export to PNG:**
```bash
rsvg-convert -w 400 -h 400 linkedin-400.svg > linkedin-profile.png
```

---

### **5. High-Resolution (Print/Downloads)**
- **File:** `high-res-2000.svg`
- **Size:** 2000x750px
- **Format:** Large horizontal
- **Use:** Print materials, high-quality downloads, presentations

**To Export to PNG:**
```bash
rsvg-convert -w 2000 -h 750 high-res-2000.svg > logo-high-res.png
```

---

## 💾 **How to Export All at Once:**

### **Option 1: Command Line (Best Quality)**

```bash
cd /Users/kingchief/Documents/EXE/apps/web/public

# Install rsvg-convert (one-time)
brew install librsvg

# Navigate to social media folder
cd social-media

# Export all sizes
rsvg-convert -w 400 -h 400 twitter-profile-400.svg > twitter-profile.png
rsvg-convert -w 1500 -h 500 twitter-banner-1500x500.svg > twitter-banner.png
rsvg-convert -w 512 -h 512 discord-512.svg > discord-icon.png
rsvg-convert -w 400 -h 400 linkedin-400.svg > linkedin-profile.png
rsvg-convert -w 2000 -h 750 high-res-2000.svg > logo-high-res.png

# Also export main logo
cd ..
rsvg-convert -w 320 -h 120 logo-perfect.svg > logo-perfect.png
rsvg-convert -w 640 -h 240 logo-perfect.svg > logo-perfect-2x.png
rsvg-convert -w 960 -h 360 logo-perfect.svg > logo-perfect-3x.png
```

---

### **Option 2: Online Converter (Easiest)**

1. Go to: https://cloudconvert.com/svg-to-png
2. Upload each SVG file
3. Download as PNG

---

### **Option 3: Right-Click Save (Quick)**

1. Open each SVG file in browser
2. Right-click → "Save Image As..."
3. Choose PNG format

---

## 🎨 **Design Specs:**

### **Colors:**
- **Background:** #0066FF (Light Protocol blue)
- **EXE:** White (#FFFFFF)
- **Pay:** Dark gray (#1a1a1a)

### **Font:**
- **Family:** Inter
- **Weight:** 600 (SemiBold)
- **Why:** Used by Stripe, GitHub, Vercel - modern & professional

### **Alignment:**
- **X:** Perfectly centered between E's
- **Pay:** Aligned with E's baseline
- **Spacing:** 15px gaps on both sides

---

## 📱 **Usage Guide:**

### **Twitter/X:**
1. Profile Picture: Use `twitter-profile.png` (400x400)
2. Header Banner: Use `twitter-banner.png` (1500x500)

### **Discord:**
1. Server Icon: Use `discord-icon.png` (512x512)
2. Recommended: Upload PNG for best quality

### **LinkedIn:**
1. Profile Picture: Use `linkedin-profile.png` (400x400)

### **GitHub:**
1. Profile Picture: Use `twitter-profile.png` (400x400)
2. Social Preview: Use `high-res.png` (2000x750)

### **Website:**
1. Use `logo-perfect.svg` (scalable, small file size)
2. Or use `logo-perfect-2x.png` for retina displays

---

## 🚀 **Quick Export Commands:**

### **Export Everything:**
```bash
cd /Users/kingchief/Documents/EXE/apps/web/public/social-media

# All social media sizes
for file in *.svg; do
  name="${file%.svg}"
  rsvg-convert "$file" > "${name}.png"
done
```

### **Export Specific Size:**
```bash
# Twitter profile (400x400)
rsvg-convert -w 400 -h 400 twitter-profile-400.svg > twitter-profile.png

# Discord (512x512)
rsvg-convert -w 512 -h 512 discord-512.svg > discord-icon.png

# High-res (2000x750)
rsvg-convert -w 2000 -h 750 high-res-2000.svg > logo-high-res.png
```

---

## 📋 **Checklist:**

### **Before Uploading:**
- [ ] Export to PNG (better compatibility)
- [ ] Check file size (< 5MB for most platforms)
- [ ] Preview on white/dark backgrounds
- [ ] Test on mobile devices

### **Platforms to Update:**
- [ ] Twitter/X (profile + banner)
- [ ] Discord (server icon)
- [ ] LinkedIn (profile picture)
- [ ] GitHub (profile picture)
- [ ] Website (favicon + logo)
- [ ] Vercel (project icon)

---

## 🎯 **File Sizes:**

| Platform | Recommended Size | File |
|----------|-----------------|------|
| Twitter Profile | 400x400 | `twitter-profile.png` |
| Twitter Banner | 1500x500 | `twitter-banner.png` |
| Discord Icon | 512x512 | `discord-icon.png` |
| LinkedIn Profile | 400x400 | `linkedin-profile.png` |
| GitHub Profile | 400x400 | `twitter-profile.png` |
| High-Res/Print | 2000x750 | `logo-high-res.png` |
| Website | 320x120 | `logo-perfect.svg` |

---

## 💡 **Tips:**

### **For Best Quality:**
1. Always use SVG for web (scalable, small file size)
2. Export to PNG for social media (better compatibility)
3. Use 2x or 3x resolution for retina displays
4. Keep file sizes under 5MB

### **For Social Media:**
1. **Twitter:** PNG works best
2. **Discord:** PNG required
3. **LinkedIn:** PNG or JPG
4. **GitHub:** PNG or SVG

---

## 🎉 **You're Ready!**

**All logos are:**
- ✅ Perfectly aligned
- ✅ Inter SemiBold font
- ✅ Professional quality
- ✅ Ready for social media
- ✅ High-resolution available

**To view:**
```bash
open apps/web/public/logo-perfect.svg
open apps/web/public/social-media/
```

**To export:**
```bash
cd apps/web/public/social-media
rsvg-convert -w 400 -h 400 twitter-profile-400.svg > twitter-profile.png
```

---

**Your brand is ready to launch!** 🚀💎

