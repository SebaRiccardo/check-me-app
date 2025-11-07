# Pre-Launch Checklist

Use this checklist before running your app for the first time:

## ✅ Environment Setup

- [ ] Node.js 18+ installed
- [ ] pnpm installed (`npm install -g pnpm`)
- [ ] Dependencies installed (`pnpm install`)

## ✅ Supabase Configuration

- [ ] Supabase account created at [supabase.com](https://supabase.com)
- [ ] New Supabase project created
- [ ] Project URL copied from Project Settings → API
- [ ] Anon/Public key copied from Project Settings → API
- [ ] `.env` file created (copy from `.env.example`)
- [ ] Environment variables set in `.env`:
  - `EXPO_PUBLIC_SUPABASE_URL`
  - `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## ✅ Optional: Database Setup

- [ ] Profiles table created (see SETUP.md for SQL)
- [ ] Row Level Security enabled
- [ ] Policies created for profiles table
- [ ] Trigger created for auto-profile creation

## ✅ Test Run

- [ ] Run `pnpm dev` successfully
- [ ] Choose platform (iOS/Android/Web)
- [ ] App loads without errors
- [ ] Login screen appears

## ✅ Authentication Test

- [ ] Can create new account (sign up)
- [ ] Receive verification email
- [ ] Verify email address
- [ ] Can sign in with credentials
- [ ] Redirected to news feed after login
- [ ] Can sign out from profile screen

## ✅ News Feed Test

- [ ] News articles load and display
- [ ] Images load correctly
- [ ] Can scroll through articles
- [ ] Can pull to refresh
- [ ] Infinite scroll loads more articles
- [ ] Can tap article to open in browser

## ✅ Profile Screen Test

- [ ] Profile screen displays user info
- [ ] Email shows correctly
- [ ] Avatar displays (or default icon)
- [ ] Menu items are clickable
- [ ] Sign out button works
- [ ] Confirmation dialog appears on sign out

## ✅ Offline/Caching Test

- [ ] Close and reopen app
- [ ] Articles load from cache immediately
- [ ] Turn off internet
- [ ] Cached articles still visible
- [ ] Turn on internet
- [ ] Pull to refresh updates with new articles

## ✅ UI/UX Test

- [ ] Tab navigation works smoothly
- [ ] Icons display correctly in tabs
- [ ] Colors match design (check light mode)
- [ ] Text is readable
- [ ] Spacing looks good
- [ ] Safe areas handled (no content under notch)
- [ ] Loading states show properly
- [ ] Error messages are clear

## 🎨 Optional: Theme Test

- [ ] Try device dark mode
- [ ] Check colors in dark mode
- [ ] Verify contrast/readability

## 📱 Platform-Specific

### iOS (if testing on Mac)
- [ ] Runs in iOS Simulator
- [ ] Keyboard shows/hides properly
- [ ] Status bar style correct
- [ ] Safe area insets correct

### Android (if testing)
- [ ] Runs in Android Emulator
- [ ] Back button works correctly
- [ ] Status bar style correct
- [ ] Keyboard behavior correct

### Web (if testing)
- [ ] Runs in web browser
- [ ] Responsive layout
- [ ] Mouse/touch interactions work

## 🚀 Next Steps

After all checks pass:
- [ ] Customize theme colors if desired
- [ ] Add your own features
- [ ] Set up analytics (optional)
- [ ] Configure OAuth providers (optional)
- [ ] Set up EAS Build for distribution
- [ ] Test on physical devices
- [ ] Submit to app stores (when ready)

## 🐛 If Something Fails

1. Check console for error messages
2. Verify `.env` file exists and has correct values
3. Ensure Supabase project is active (not paused)
4. Try `pnpm clean` then `pnpm dev`
5. Check IMPLEMENTATION.md for known issues
6. Review SETUP.md for detailed instructions

---

Good luck! 🎉
