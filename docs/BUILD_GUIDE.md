# 📱 Build Guide - EAS Build

This guide covers building your app for development, preview, and production using EAS (Expo Application Services).

## 🚀 Quick Start

### First Time Setup

1. **Install EAS CLI globally** (or use project's local version)
   ```bash
   npm install -g eas-cli
   # or use project version:
   pnpm exec eas
   ```

2. **Login to Expo**
   ```bash
   eas login
   ```

3. **Configure your project**
   ```bash
   eas build:configure
   ```
   This will create/update `eas.json` and `app.json`

## 📋 Build Profiles

We have 4 build profiles configured in `eas.json`:

### 1. Development Build 🔧
**Purpose**: For development with custom native modules (alternative to Expo Go)

- Includes development tools
- Enables hot reload
- Internal distribution only
- APK for Android (faster to build and install)

### 2. Preview Build 🔍
**Purpose**: For testing before production release

- Production-like build
- Internal distribution (TestFlight/Internal Testing)
- APK for Android (easy to share)
- Can test on real devices without dev tools

### 3. Preview Simulator 📱
**Purpose**: For testing on iOS Simulator

- Same as preview but for iOS simulator
- No code signing required
- Quick testing

### 4. Production Build 🎯
**Purpose**: For app store distribution

- Optimized and minified
- App Bundle for Android (Google Play requirement)
- Full release build for iOS
- Code signing required

## 🛠️ Build Commands

### Development Builds

```bash
# Android Development Build (recommended for testing)
pnpm run build:dev:android
# or
eas build --profile development --platform android

# iOS Development Build
pnpm run build:dev:ios
# or
eas build --profile development --platform ios

# Both platforms
pnpm run build:all:dev
# or
eas build --profile development --platform all
```

**After building**, install on your device and run:
```bash
pnpm run dev:dev-client
```

### Preview Builds

```bash
# Android Preview (APK for testing)
pnpm run build:preview:android
# or
eas build --profile preview --platform android

# iOS Preview (TestFlight or Ad-Hoc)
pnpm run build:preview:ios
# or
eas build --profile preview --platform ios

# Both platforms
pnpm run build:all:preview
# or
eas build --profile preview --platform all
```

### Production Builds

```bash
# Android Production (AAB for Play Store)
pnpm run build:prod:android
# or
eas build --profile production --platform android

# iOS Production (for App Store)
pnpm run build:prod:ios
# or
eas build --profile production --platform ios

# Both platforms
pnpm run build:all:prod
# or
eas build --profile production --platform all
```

## 📲 Installing Development Build

### Android

1. **Build the development client:**
   ```bash
   pnpm run build:dev:android
   ```

2. **Wait for build to complete** (first build takes 10-20 minutes)

3. **Download the APK** from the EAS dashboard or link in terminal

4. **Install on your Android device:**
   - Enable "Install from Unknown Sources" in Settings
   - Download and install the APK
   - Or use ADB:
     ```bash
     adb install path/to/app.apk
     ```

5. **Run the dev server:**
   ```bash
   pnpm run dev:dev-client
   ```

6. **Open the app** and connect to your dev server

### iOS

1. **Build the development client:**
   ```bash
   pnpm run build:dev:ios
   ```

2. **Register your device** with Apple (if not already)
   ```bash
   eas device:create
   ```

3. **Download and install** via TestFlight or direct install

4. **Run the dev server:**
   ```bash
   pnpm run dev:dev-client
   ```

## 🔑 Code Signing Setup

### Android

**For Development/Preview builds:**
- EAS automatically generates a keystore for you
- No setup needed!

**For Production builds:**
- Use EAS-managed credentials (recommended)
- Or provide your own keystore:
  ```bash
  eas credentials
  ```

### iOS

**Requirements:**
- Apple Developer Account ($99/year)
- App identifier registered in Apple Developer Portal

**Setup:**
```bash
# Let EAS manage your credentials (recommended)
eas build --profile production --platform ios

# Or manage manually
eas credentials
```

## 📦 Build Profiles Explained

### `eas.json` Configuration

```json
{
  "build": {
    "development": {
      "developmentClient": true,      // Enables dev tools
      "distribution": "internal",      // Not for app stores
      "android": {
        "gradleCommand": ":app:assembleDebug",
        "buildType": "apk"            // Faster to build/install
      }
    },
    "preview": {
      "distribution": "internal",      // TestFlight/Internal
      "android": {
        "buildType": "apk"            // Easy to share
      }
    },
    "production": {
      "distribution": "store",         // For app stores
      "android": {
        "buildType": "app-bundle"     // Required by Play Store
      }
    }
  }
}
```

## 🎯 Common Workflows

### Workflow 1: Development (Daily Development)
```bash
# Option A: Use Expo Go (if no custom native modules)
pnpm dev

# Option B: Use Development Build (recommended)
# 1. Build once:
pnpm run build:dev:android

# 2. Install on device
# 3. Daily development:
pnpm run dev:dev-client
```

### Workflow 2: Testing (Share with Testers)
```bash
# Build preview
pnpm run build:preview:android

# Share APK link with testers
# They can install directly (no Play Store needed)
```

### Workflow 3: Production Release
```bash
# 1. Build for production
pnpm run build:prod:android

# 2. Download AAB from EAS

# 3. Submit to Play Store
pnpm run submit:android
# or manually upload to Play Console
```

## 🔄 Build Workflow

```
┌─────────────────┐
│  Run Build      │
│  Command        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  EAS Cloud      │
│  Build Server   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Build Process  │
│  (10-20 min)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Download Link  │
│  or Auto-Submit │
└─────────────────┘
```

## 📊 Build Status & Logs

### Check build status:
```bash
eas build:list
```

### View build details:
```bash
eas build:view [BUILD_ID]
```

### View build logs:
```bash
# Logs are available in the web dashboard
# Or in terminal output during build
```

## 🌐 EAS Dashboard

Access your builds at: https://expo.dev/accounts/[your-account]/projects/check-me-app/builds

Features:
- ✅ View all builds
- ✅ Download artifacts (APK/IPA)
- ✅ View build logs
- ✅ Manage credentials
- ✅ Submit to stores

## 🚨 Troubleshooting

### Build fails with "credentials error"
```bash
# Reset credentials
eas credentials

# Or let EAS generate new ones
eas build --clear-credentials
```

### "No bundle URL present" error
```bash
# Make sure you're running dev server with:
pnpm run dev:dev-client

# Not:
pnpm dev  # This is for Expo Go only
```

### Android build fails
```bash
# Clear cache and rebuild
eas build --profile development --platform android --clear-cache
```

### iOS "No devices registered"
```bash
# Register your device
eas device:create

# Then rebuild
pnpm run build:dev:ios
```

## 💰 EAS Pricing

- **Free Tier**: 30 builds/month (shared across all projects)
- **Production**: Unlimited builds ($29/month)
- **Enterprise**: Priority builds + more ($899/month)

**Tip**: Development builds count towards your quota. Use them wisely during development.

## 🔐 Environment Variables in Builds

EAS builds can use environment variables from:

1. **`.env` file** (committed to git)
2. **EAS Secrets** (secure, not in git):
   ```bash
   eas secret:create --scope project --name SUPABASE_URL --value "your_value"
   eas secret:create --scope project --name SUPABASE_ANON_KEY --value "your_key"
   ```

3. **In `eas.json`**:
   ```json
   {
     "build": {
       "production": {
         "env": {
           "APP_ENV": "production"
         }
       }
     }
   }
   ```

## 📱 App Signing & Certificates

### Android
- **Development**: Auto-generated keystore
- **Production**: 
  - Option 1: Let EAS manage (recommended)
  - Option 2: Upload your own keystore

### iOS
- **Development**: Requires Apple Developer account
- **Production**: Distribution certificate + provisioning profile
  - Let EAS manage (recommended)

## 🎯 Best Practices

1. **Use development builds** during active development (not Expo Go)
2. **Preview builds** before every release
3. **Test on real devices** with preview builds
4. **Use EAS Secrets** for sensitive data
5. **Version your builds** properly in `app.json`
6. **Keep build artifacts** for at least 90 days
7. **Test production builds** before submitting to stores

## 📚 Additional Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [Development Builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [App Signing](https://docs.expo.dev/app-signing/app-credentials/)

---

## 🚀 Quick Reference

```bash
# First time setup
eas login
eas build:configure

# Development (build once, use daily)
pnpm run build:dev:android        # Build dev client
pnpm run dev:dev-client           # Run dev server

# Testing (share with team)
pnpm run build:preview:android    # Build preview APK

# Production (release to stores)
pnpm run build:prod:android       # Build production AAB
pnpm run submit:android           # Submit to Play Store

# Check builds
eas build:list                    # List all builds
eas build:view [BUILD_ID]         # View specific build

# Manage credentials
eas credentials                   # Interactive credential manager
```

Happy building! 🎉
