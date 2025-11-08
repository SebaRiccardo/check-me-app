# 📋 Quick Command Reference

## 🔧 Development Commands

```bash
# Start development server (Expo Go)
pnpm dev

# Start with development build (custom native modules)
pnpm run dev:dev-client

# Run on specific platform
pnpm android    # Android
pnpm ios        # iOS
pnpm web        # Web browser
```

## 🏗️ Build Commands

### Android Development Build (Most Common)

```bash
# Build development APK (do this once)
pnpm run build:dev:android

# Then daily development
pnpm run dev:dev-client
```

### All Build Profiles

| Profile         | Android                          | iOS                          | Both                         |
| --------------- | -------------------------------- | ---------------------------- | ---------------------------- |
| **Development** | `pnpm run build:dev:android`     | `pnpm run build:dev:ios`     | `pnpm run build:all:dev`     |
| **Preview**     | `pnpm run build:preview:android` | `pnpm run build:preview:ios` | `pnpm run build:all:preview` |
| **Production**  | `pnpm run build:prod:android`    | `pnpm run build:prod:ios`    | `pnpm run build:all:prod`    |

## 📦 Submission Commands

```bash
# Submit to Play Store
pnpm run submit:android

# Submit to App Store
pnpm run submit:ios
```

## 🔍 EAS Management

```bash
# Login to EAS
eas login

# Configure project for EAS
eas build:configure

# List all builds
eas build:list

# View specific build
eas build:view [BUILD_ID]

# Manage credentials
eas credentials

# Register iOS device
eas device:create

# Create secret environment variable
eas secret:create --scope project --name VAR_NAME --value "value"
```

## 🧹 Cleanup Commands

```bash
# Clean cache and restart
pnpm clean
pnpm dev

# Clear build cache
eas build --clear-cache

# Clear credentials (if issues)
eas build --clear-credentials
```

## 🎯 Most Common Workflow

### First Time Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Setup Supabase (.env file)
cp .env.example .env
# Add your Supabase credentials

# 3. Login to EAS
eas login

# 4. Build development client
pnpm run build:dev:android
```

### Daily Development

```bash
# Just run dev server (after installing dev build once)
pnpm run dev:dev-client
```

### Testing with Team

```bash
# Build preview and share APK link
pnpm run build:preview:android
```

### Production Release

```bash
# 1. Build for production
pnpm run build:prod:android

# 2. Submit to Play Store
pnpm run submit:android
```

## 📱 Platform-Specific Notes

### Android

- **Development**: APK (easier to install)
- **Preview**: APK (easy to share)
- **Production**: AAB (required by Play Store)

### iOS

- **Requires**: Apple Developer Account ($99/year)
- **Device Registration**: `eas device:create`
- **TestFlight**: Used for preview builds

## 🚨 Quick Troubleshooting

```bash
# Metro bundler issues
pnpm clean
pnpm dev

# Build cache issues
eas build --clear-cache --profile development --platform android

# Credential issues
eas credentials
# Then follow prompts to reset

# Environment variable issues
eas secret:list  # View all secrets
```

## 📊 Build Status Check

```bash
# Check recent builds
eas build:list

# Filter by profile
eas build:list --profile development

# Filter by platform
eas build:list --platform android

# View logs
eas build:view [BUILD_ID]
```

## 🌐 Useful Links

- **EAS Dashboard**: https://expo.dev
- **Build Documentation**: https://docs.expo.dev/build/introduction/
- **Your Builds**: https://expo.dev/accounts/[username]/projects/check-me-app/builds

---

## 💡 Pro Tips

1. **Build development client once**, use it for weeks
2. **Preview builds** before every release
3. **Production builds** only when ready to release
4. **Use `--clear-cache`** if builds fail unexpectedly
5. **Check EAS dashboard** for detailed logs
6. **Free tier**: 30 builds/month - use wisely!

---

## 🎯 Copy-Paste Commands

### Complete First Build Setup

```bash
pnpm install
eas login
eas build:configure
pnpm run build:dev:android
```

### Daily Development

```bash
pnpm run dev:dev-client
```

### Share with Testers

```bash
pnpm run build:preview:android
```

### Release to Production

```bash
pnpm run build:prod:android
pnpm run submit:android
```
