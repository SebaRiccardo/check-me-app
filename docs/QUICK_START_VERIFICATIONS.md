# 🚀 Quick Start Guide - Community Verifications

## Step-by-Step Setup (5 minutes)

### 1️⃣ Run SQL in Supabase (2 min)

1. Open [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Click **"New Query"**
5. Copy entire content from: `supabase/SETUP_VERIFICATIONS.sql`
6. Paste in editor
7. Click **"Run"** or press `Ctrl+Enter`
8. Wait for success message ✅

### 2️⃣ Verify Storage Bucket (1 min)

1. Go to **Storage** → **Buckets** (left sidebar)
2. Look for bucket named: `verification-images`
3. Should show as **Public** ✅
4. Click on it to verify it's empty (ready for uploads)

### 3️⃣ Test the App (2 min)

1. Run your development build:

   ```bash
   pnpm run dev:dev-client
   ```

2. Navigate to **"Comunidad"** tab (4th tab, Users icon)

3. Tap the **"+"** floating button (top right)

4. Fill the form:
   - **Título**: "Verificación de prueba"
   - **Descripción**: "Esta es mi primera verificación en la comunidad"
   - **Categoría**: Select "Tecnología"
   - **Imagen**: Optional (tap to select from gallery)

5. Tap **"Publicar Verificación"**

6. Watch it appear in the list! 🎉

## 🎯 What You Should See

### ✅ Community Screen Features

- Header: "Comunidad" with subtitle
- "+" button in top right
- List of verifications (or empty state)
- Pull down to refresh

### ✅ Create Form (Bottom Sheet)

- Slides up from bottom
- All input fields visible
- Category pills scroll horizontally
- Image picker area
- "Publicar Verificación" button

### ✅ Verification Card

- Optional image at top
- Category badge (colored)
- Title and description
- Date at bottom

## 🔍 Verify Everything Works

### Test Checklist

- [ ] SQL ran without errors
- [ ] Storage bucket exists
- [ ] Can open create form
- [ ] Can select category
- [ ] Can pick image from gallery
- [ ] Form validation works (try empty fields)
- [ ] Can submit verification
- [ ] Verification appears in list
- [ ] Pull-to-refresh works
- [ ] Real-time updates (test with 2 devices)

## 🐛 Troubleshooting

### Problem: SQL fails

**Solution**:

- Check if table already exists
- Try dropping table first: `DROP TABLE IF EXISTS public.verifications;`
- Re-run the SQL

### Problem: Can't see "Comunidad" tab

**Solution**:

- Restart the app
- Check `app/(tabs)/_layout.tsx` includes community screen
- Clear cache: `pnpm start --clear`

### Problem: Bottom sheet doesn't open

**Solution**:

- Check console for errors
- Verify GestureHandlerRootView is in `app/_layout.tsx`
- Restart app

### Problem: Image picker doesn't work

**Solution**:

- Grant photo permissions on device
- iOS: Check Info.plist has photo permissions
- Android: Check AndroidManifest.xml permissions

### Problem: Upload fails

**Solution**:

- Check you're logged in
- Verify storage bucket exists
- Check RLS policies are active
- Try smaller image size

## 📊 Check Database

### View Verifications in Supabase

1. Go to **Table Editor** → **verifications**
2. Should see your test verification
3. Check all fields are populated correctly

### View Images in Storage

1. Go to **Storage** → **verification-images**
2. Should see folder with your `user_id`
3. Inside: uploaded images with timestamps

## 🎓 Next Steps

### Learn the Code

- Read `VERIFICATION_FEATURE.md` for detailed docs
- Check `hooks/use-verifications.ts` for custom hooks
- Explore `components/create-verification-form.tsx` for form logic

### Enhance the Feature

- Add edit functionality
- Add delete button
- Implement likes/reactions
- Add comments section
- Filter by category

### Test Edge Cases

- Try creating without image
- Test with very long text
- Try different image formats
- Test with poor internet
- Test with multiple users

## 🆘 Need Help?

### Check Logs

```bash
# Supabase logs
Go to: Dashboard → Logs → select service

# App logs
Check Expo console for errors
```

### Common Issues

1. **Realtime not working**: Enable in Supabase settings
2. **RLS blocking access**: Check policies in Table Editor
3. **Storage upload fails**: Verify bucket is public
4. **Form won't submit**: Check validation errors

## ✨ Success Indicators

You'll know everything works when:

- ✅ Can create verifications
- ✅ Can upload images
- ✅ List updates automatically
- ✅ Pull-to-refresh works
- ✅ Categories display correctly
- ✅ Dates format properly
- ✅ No console errors

---

## 🎊 Ready to Go!

Your community verifications feature is now live and functional. Start creating and sharing verifications! 🚀

For detailed documentation, see: **VERIFICATION_FEATURE.md**
