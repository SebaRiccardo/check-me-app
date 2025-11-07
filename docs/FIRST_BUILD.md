# 🎯 Your First Build - Step by Step

This guide will walk you through building your first Android development build.

## ⏱️ Time Required
- **First Build**: ~15-20 minutes (EAS cloud build)
- **Subsequent Builds**: Same time, but you rarely need to rebuild
- **Daily Development**: 0 minutes (just run dev server!)

## 📋 Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] pnpm installed
- [ ] Dependencies installed (`pnpm install`)
- [ ] Supabase configured (`.env` file with credentials)
- [ ] Expo account created (free at expo.dev)
- [ ] Android device or emulator ready

## 🚀 Step-by-Step Guide

### Step 1: Install Dependencies (if not done)
```bash
cd check-me-app
pnpm install
```
**Expected**: All packages install successfully

---

### Step 2: Login to Expo/EAS
```bash
eas login
```

**Prompts:**
```
? Email or username: your@email.com
? Password: ********
```

**Expected**: "Logged in as [your-username]"

**Don't have an account?**
- Go to [expo.dev](https://expo.dev) and sign up (free)
- Or use: `eas register`

---

### Step 3: Configure Your Project
```bash
eas build:configure
```

**What it does:**
- ✅ Validates your `app.json`
- ✅ Creates/updates `eas.json`
- ✅ Links project to your Expo account

**Prompts you might see:**
```
? Would you like to automatically create an EAS project for @your-username/check-me-app? › (Y/n)
```
**Answer**: `Y` (Yes)

**Expected**: "EAS project created successfully"

---

### Step 4: Build Development APK

```bash
pnpm run build:dev:android
```

Or the full command:
```bash
eas build --profile development --platform android
```

**What happens:**

1. **Project Analysis** (10 seconds)
   ```
   📦 Analyzing project...
   ✔ Project is ready to build
   ```

2. **Credentials Setup** (first time only)
   ```
   ? Would you like to generate a new Android keystore? › (Y/n)
   ```
   **Answer**: `Y` (Yes - let EAS handle it)

3. **Build Queue** (immediate)
   ```
   🚀 Build queued
   Build ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   ```

4. **Building** (15-20 minutes)
   ```
   ⏳ Build in progress...
   
   You can monitor the build at:
   https://expo.dev/accounts/[username]/projects/check-me-app/builds/[build-id]
   ```

5. **Completion**
   ```
   ✔ Build finished
   📦 APK: https://expo.dev/artifacts/eas/[artifact-id].apk
   ```

**💡 Pro Tip**: You can close the terminal and check status later:
```bash
eas build:list
```

---

### Step 5: Download & Install APK

**Option A: Direct Download (Recommended)**
1. Click the APK link in terminal output
2. Download to your Android device
3. Enable "Install from Unknown Sources"
4. Tap the downloaded APK to install

**Option B: Using ADB (if device is connected)**
```bash
# First, download the APK from the link
# Then install via ADB:
adb install path/to/downloaded-app.apk
```

**Option C: Scan QR Code**
- Scan the QR code shown in terminal
- Download on your device
- Install

---

### Step 6: Configure Environment

Make sure your `.env` file exists with Supabase credentials:
```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

### Step 7: Start Development Server

```bash
pnpm run dev:dev-client
```

**Expected output:**
```
› Metro waiting on exp://192.168.1.xxx:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Web is waiting on http://localhost:8081

› Press a │ open Android
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
› Press o │ open project code in your editor

› Press ? │ show all commands
```

**Important**: 
- This is different from `pnpm dev` (which is for Expo Go)
- The dev server must be running for the app to work

---

### Step 8: Open Your App

1. **Open the installed app** on your Android device
2. **App will show**: "Connecting to Metro..."
3. **App loads** your code from the dev server

**Success!** 🎉 You should see your login screen!

---

## 🎯 What You've Accomplished

✅ Built a development client with custom native modules  
✅ Installed it on your device  
✅ Connected to your dev server  
✅ Can now develop with hot reload  

## 🔄 Daily Development Workflow

Now that you have the development build installed:

1. **Start dev server** (every time you code)
   ```bash
   pnpm run dev:dev-client
   ```

2. **Open the app** on your device (it's already installed!)

3. **Code!** Changes appear automatically (hot reload)

**You DON'T need to rebuild unless**:
- You add/change native modules
- You update Expo SDK
- You change native configuration (app.json)

## 📊 Build Status & Troubleshooting

### Check Build Status
```bash
# List all builds
eas build:list

# View specific build
eas build:view [BUILD_ID]

# Check latest build
eas build:list --limit 1
```

### Build Failed?

**Common Issues:**

1. **Credentials Error**
   ```bash
   eas credentials
   # Follow prompts to reset
   ```

2. **Build Timeout**
   ```bash
   # Retry with:
   pnpm run build:dev:android
   ```

3. **Configuration Error**
   - Check `app.json` is valid JSON
   - Ensure `eas.json` exists
   - Run `eas build:configure` again

### App Won't Connect?

1. **Check dev server is running**
   ```bash
   pnpm run dev:dev-client
   ```

2. **Ensure device and computer are on same WiFi**

3. **Try restarting the app**

4. **Check firewall** (allow port 8081)

## 🎓 Next Steps

### Option 1: Continue Development
- Write code
- See changes in real-time
- Test on real device

### Option 2: Share with Team
```bash
# Build preview for testing
pnpm run build:preview:android
# Share the APK link with testers
```

### Option 3: Prepare for Production
```bash
# Build production version
pnpm run build:prod:android
# Then submit to Play Store
```

## 📱 Alternative: Preview Build (No Dev Server)

If you just want to test the app without dev server:

```bash
# Build preview
pnpm run build:preview:android

# Install APK
# App runs standalone (no dev server needed)
```

**Difference:**
- **Development build**: Needs dev server, has dev tools, hot reload
- **Preview build**: Standalone, production-like, no dev tools

## 💰 EAS Build Limits

**Free Tier:**
- 30 builds/month (across all projects)
- Shared build queue
- Full features

**Tips to Conserve Builds:**
- Build development client once, use for weeks
- Only rebuild when adding native modules
- Use Expo Go when possible (no native modules)
- Team members can share same build

## 📚 Additional Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Development Builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [Your EAS Dashboard](https://expo.dev/accounts)

---

## 🎉 Summary

| Step | Command | Time | Frequency |
|------|---------|------|-----------|
| 1. Install deps | `pnpm install` | 2 min | Once |
| 2. Login | `eas login` | 30 sec | Once |
| 3. Configure | `eas build:configure` | 30 sec | Once |
| 4. Build | `pnpm run build:dev:android` | 15-20 min | Rarely |
| 5. Install APK | (manual) | 2 min | Rarely |
| 6. Dev server | `pnpm run dev:dev-client` | 30 sec | Daily |

**After first setup:** Just run step 6 daily! 🚀

---

## 🆘 Need Help?

1. Check [BUILD_GUIDE.md](./BUILD_GUIDE.md) for detailed explanations
2. Check [COMMANDS.md](./COMMANDS.md) for quick reference
3. Visit [Expo Forums](https://forums.expo.dev)
4. Check [EAS Build Docs](https://docs.expo.dev/build/introduction/)

Happy building! 🎊
