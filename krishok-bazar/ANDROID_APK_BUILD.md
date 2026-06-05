# কৃষক বাজার — Android APK Build Guide

## Method 1: PWABuilder (Easiest — No Code Needed)

1. Open https://www.pwabuilder.com
2. Enter your live site URL (e.g., `https://krishokbazar.vercel.app`)
3. Click **Start** → wait for analysis
4. Click **Build My PWA** → select **Android**
5. Download the `.apk` file
6. Install directly on any Android phone via USB or file share

**Minimum requirements for PWABuilder:** Valid manifest.json ✅ Service Worker ✅ HTTPS ✅

---

## Method 2: Capacitor (Full Native APK)

### Prerequisites
```bash
# Install Java 17+ and Android Studio first
# Then:
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "কৃষক বাজার" com.krishokbazar.app --web-dir dist
```

### Build Steps
```bash
# 1. Build the web app
npm run build

# 2. Add Android platform
npx cap add android

# 3. Sync web assets
npx cap sync android

# 4. Open in Android Studio
npx cap open android

# 5. In Android Studio: Build → Build Bundle(s) / APK(s) → Build APK(s)
# APK location: android/app/build/outputs/apk/debug/app-debug.apk
```

### For Release APK (Play Store)
```bash
# Build signed release APK
npx cap build android
# Follow Android Studio signing wizard
```

---

## Method 3: Bubblewrap (Google's Official Tool)

```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest https://krishokbazar.vercel.app/manifest.json
bubblewrap build
# Output: krishok-bazar.apk
```

---

## App Details for APK Build

| Field | Value |
|-------|-------|
| App Name | কৃষক বাজার |
| Package ID | com.krishokbazar.app |
| Version | 2.0.0 |
| Min Android | Android 5.0 (API 21) |
| Target Android | Android 14 (API 34) |
| Icon URL | https://cdn.shopify.com/s/files/1/0991/0717/6761/files/Gemini_Generated_Image_k0x5bek0x5bek0x5.png |

---

## How to Install APK on Phone (Direct)

1. Transfer `.apk` file to Android phone (USB / Google Drive / WhatsApp)
2. Go to **Settings → Security → Unknown Sources → Enable**
3. Tap the `.apk` file → Install
4. Open **কৃষক বাজার** from app drawer

---

## Deploy to Vercel (Live URL for PWABuilder)

```bash
# Install Vercel CLI
npm install -g vercel

# Build first
npm run build

# Deploy
vercel --prod

# Your live URL: https://krishok-bazar.vercel.app
```

Or connect GitHub repo at https://vercel.com/new → Import `krishokbazaraj/krishok-bazar`
