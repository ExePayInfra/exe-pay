# 🎨 ExePay Logo Guide

## ✅ **Logo Files Created:**

### **1. Main Logo** (`apps/web/public/logo.svg`)
- **Size:** 200x200px
- **Format:** SVG (scalable)
- **Use:** Homepage, marketing materials, social media
- **Features:**
  - Shield shape (represents security)
  - Stylized "E" letter
  - Blue gradient (#6366f1 → #4f46e5)
  - Privacy lock accent
  - Outer glow ring

### **2. Favicon** (`apps/web/public/favicon.svg`)
- **Size:** 32x32px
- **Format:** SVG
- **Use:** Browser tab icon
- **Features:**
  - Simplified shield + E
  - Same blue gradient
  - Optimized for small sizes

### **3. Logo Component** (`apps/web/src/components/Logo.tsx`)
- **Variants:**
  - `<Logo />` - Full logo with animation
  - `<LogoText />` - Logo + "ExePay" text
  - `<LogoIcon />` - Icon only
- **Props:**
  - `size` - Width/height in pixels
  - `animated` - Enable floating animation
  - `className` - Custom CSS classes

---

## 🎨 **Logo Design Concept:**

### **Shield Shape:**
- Represents **security** and **protection**
- Hexagonal/diamond shape for modern look
- Layered design (outer ring → shield → inner content)

### **"E" Letter:**
- Stylized horizontal bars
- Represents **ExePay** brand
- Blue gradient for premium feel

### **Privacy Accent:**
- Circular lock element
- Subtle opacity (0.5)
- Reinforces privacy focus

### **Color Palette:**
- **Primary Blue:** #6366f1 (indigo-500)
- **Secondary Blue:** #4f46e5 (indigo-600)
- **Accent Blue:** #3b82f6 (blue-500)
- **White:** #ffffff (for contrast)

---

## 📦 **How to Use:**

### **1. In React/Next.js:**

```tsx
import { Logo, LogoText, LogoIcon } from '@/components/Logo';

// Full logo with animation
<Logo size={100} animated />

// Logo with text (for navigation)
<LogoText size={32} />

// Icon only (for mobile)
<LogoIcon size={24} />
```

### **2. As Static Image:**

```html
<!-- In HTML -->
<img src="/logo.svg" alt="ExePay Logo" width="200" />

<!-- In Next.js -->
<Image src="/logo.svg" alt="ExePay Logo" width={200} height={200} />
```

### **3. As Favicon:**

Add to `apps/web/src/app/layout.tsx`:

```tsx
export const metadata = {
  title: 'ExePay',
  description: 'Privacy-preserving payments on Solana',
  icons: {
    icon: '/favicon.svg',
  },
};
```

---

## 🎯 **Logo Variations:**

### **1. Full Logo** (200x200)
- Use: Homepage hero, marketing
- File: `apps/web/public/logo.svg`

### **2. Logo + Text** (Horizontal)
- Use: Navigation, headers
- Component: `<LogoText />`

### **3. Icon Only** (32x32)
- Use: Favicon, mobile menu, social icons
- File: `apps/web/public/favicon.svg`

### **4. Animated Logo**
- Use: Homepage, loading screens
- Component: `<Logo animated />`

---

## 🌐 **Social Media Sizes:**

### **Twitter/X:**
- Profile: 400x400px (use `logo.svg`)
- Header: 1500x500px (create banner with logo + text)

### **GitHub:**
- Profile: 200x200px (use `logo.svg`)
- Social Preview: 1280x640px

### **Discord:**
- Server Icon: 512x512px (use `logo.svg`)

### **LinkedIn:**
- Profile: 400x400px (use `logo.svg`)
- Cover: 1584x396px

---

## 🎨 **Export Instructions:**

### **To PNG (for social media):**

```bash
# Install rsvg-convert (if not installed)
brew install librsvg  # macOS
sudo apt install librsvg2-bin  # Linux

# Convert to PNG
rsvg-convert -w 400 -h 400 apps/web/public/logo.svg > logo-400.png
rsvg-convert -w 512 -h 512 apps/web/public/logo.svg > logo-512.png
rsvg-convert -w 1024 -h 1024 apps/web/public/logo.svg > logo-1024.png
```

### **To ICO (for Windows):**

```bash
# Use online converter or ImageMagick
convert logo.svg -define icon:auto-resize=16,32,48,64,256 favicon.ico
```

---

## 📋 **Brand Guidelines:**

### **DO:**
- ✅ Use the official blue gradient (#6366f1 → #4f46e5)
- ✅ Maintain aspect ratio (always square)
- ✅ Use on white or light backgrounds
- ✅ Add animation for interactive elements
- ✅ Use SVG for web (scalable)

### **DON'T:**
- ❌ Change the colors
- ❌ Stretch or distort the logo
- ❌ Use on busy backgrounds
- ❌ Add drop shadows or effects
- ❌ Use low-resolution versions

---

## 🚀 **Next Steps:**

### **1. Update Favicon:**
Add to `apps/web/src/app/layout.tsx`:

```tsx
export const metadata = {
  icons: {
    icon: '/favicon.svg',
    apple: '/logo.svg',
  },
};
```

### **2. Create Social Media Assets:**
- Twitter profile image (400x400)
- GitHub profile image (200x200)
- Discord server icon (512x512)

### **3. Create Marketing Materials:**
- Banner images (1280x640)
- Email signature logo
- Pitch deck logo

### **4. Create Variations:**
- Dark mode version (white logo on dark bg)
- Monochrome version (for print)
- Wordmark (ExePay text only)

---

## 📁 **File Structure:**

```
apps/web/
├── public/
│   ├── logo.svg          # Main logo (200x200)
│   ├── favicon.svg       # Favicon (32x32)
│   └── (future assets)
│       ├── logo-400.png  # Social media
│       ├── logo-512.png  # Discord
│       └── logo-1024.png # High-res
└── src/
    └── components/
        └── Logo.tsx      # React components
```

---

## 🎉 **Logo is Ready!**

**Your ExePay logo is now:**
- ✅ Professional and modern
- ✅ Scalable (SVG format)
- ✅ Brand-consistent (PayAI colors)
- ✅ Animated (optional)
- ✅ Responsive (multiple sizes)
- ✅ Ready for deployment

**Use it everywhere:**
- Website navigation
- Social media profiles
- Marketing materials
- Documentation
- Pitch decks

**The logo represents:**
- 🔒 **Security** (shield shape)
- ⚡ **Speed** (Solana-powered)
- 🎨 **Modern** (blue gradient)
- 🔐 **Privacy** (lock accent)

---

**Your brand identity is complete!** 🚀💎

