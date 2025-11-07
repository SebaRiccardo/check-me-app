# Quick Setup Guide

## 1. Install Dependencies

```bash
pnpm install
```

## 2. Configure Supabase

### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the database to be provisioned

### Get Your API Keys

1. Go to Project Settings → API
2. Copy the following:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (starts with `eyJhbG...`)

### Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your keys:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## 3. Optional: Set Up Database

If you want to store additional user profile data, run this SQL in your Supabase SQL Editor:

```sql
-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create a trigger to automatically create a profile for new users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## 4. Run the App

```bash
pnpm dev
```

Then:
- Press `i` for iOS simulator (Mac only)
- Press `a` for Android emulator
- Press `w` for web browser
- Scan QR code with Expo Go app on your phone

## 5. Test Authentication

1. On the login screen, click "Don't have an account? Sign up"
2. Enter an email and password (min 6 characters)
3. Click "SIGN UP"
4. Check your email for a verification link
5. After verification, sign in with your credentials
6. You'll be redirected to the News Feed

## Features to Try

### News Feed
- Pull down to refresh
- Scroll to load more articles
- Tap an article to open in browser

### Profile
- View your user info
- Change theme (if implemented)
- Sign out

## Troubleshooting

### "Network request failed"
- Check your `.env` file has correct Supabase credentials
- Ensure your Supabase project is not paused
- Check internet connection

### "Invalid login credentials"
- Make sure you verified your email
- Check password is at least 6 characters
- Try resetting password in Supabase dashboard

### Metro bundler issues
```bash
pnpm clean
pnpm dev
```

### No news articles showing
- The News API has rate limits
- Pull to refresh to try again
- Check browser console for errors

## Next Steps

- Customize the theme in `global.css`
- Add more screens in `app/(tabs)/`
- Implement additional Supabase features
- Deploy with EAS Build

Enjoy building! 🚀
