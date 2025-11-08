# 📱 App Structure Overview

## Screen Flow

```
┌─────────────────────┐
│   App Launches      │
└──────────┬──────────┘
           │
           ▼
    ┌──────────────┐
    │ Auth Check?  │
    └──────┬───────┘
           │
     ┌─────┴─────┐
     │           │
     ▼           ▼
┌─────────┐  ┌────────────┐
│ Login   │  │  Tabs      │
│ Screen  │  │  Layout    │
└────┬────┘  └─────┬──────┘
     │             │
     │       ┌─────┴─────┐
     │       │           │
     │       ▼           ▼
     │  ┌────────┐  ┌─────────┐
     │  │  Feed  │  │ Profile │
     │  │ Screen │  │ Screen  │
     │  └────────┘  └─────────┘
     │       │           │
     └───────┼───────────┘
             │
         Sign Out
             │
             ▼
       ┌──────────┐
       │  Login   │
       │  Screen  │
       └──────────┘
```

## File Structure

```
check-me-app/
│
├── 📄 START_HERE.md          ← READ THIS FIRST!
├── 📄 SETUP.md               ← Setup instructions
├── 📄 IMPLEMENTATION.md      ← Technical details
├── 📄 CHECKLIST.md          ← Testing checklist
├── 📄 README.md             ← Project overview
├── 📄 .env.example          ← Environment template
│
├── 📁 app/                   ← Screens (Expo Router)
│   ├── _layout.tsx          ← Root layout + providers
│   ├── index.tsx            ← Entry redirect
│   ├── login.tsx            ← 🔐 Auth screen
│   │
│   └── (tabs)/              ← Tab navigation
│       ├── _layout.tsx      ← Tab bar config
│       ├── index.tsx        ← Redirect to feed
│       ├── feed.tsx         ← 📰 News feed
│       └── profile.tsx      ← 👤 Profile
│
├── 📁 components/           ← Reusable components
│   └── ui/                  ← UI primitives
│       ├── button.tsx       ← Button component
│       ├── card.tsx         ← Card components
│       ├── input.tsx        ← Input field
│       ├── text.tsx         ← Text component
│       └── icon.tsx         ← Icon wrapper
│
├── 📁 hooks/                ← Custom hooks
│   ├── use-auth-context.tsx ← Auth state hook
│   └── use-news-query.ts    ← News API hook
│
├── 📁 providers/            ← Context providers
│   ├── auth-provider.tsx    ← Supabase auth
│   └── query-provider.tsx   ← TanStack Query + cache
│
├── 📁 lib/                  ← Utilities
│   ├── supabase.ts          ← Supabase client
│   ├── theme.ts             ← Theme config
│   └── utils.ts             ← Helper functions
│
├── 📁 types/                ← TypeScript types
│   └── news.ts              ← News API types
│
├── 📄 global.css            ← 🎨 Theme & styles
├── 📄 tailwind.config.js    ← Tailwind config
└── 📄 package.json          ← Dependencies

```

## Data Flow

### Authentication

```
User Input
    ↓
Supabase Auth
    ↓
Session Created
    ↓
SecureStore (mobile)
    ↓
Auth Provider
    ↓
Auto Navigation
```

### News Feed

```
Component Mount
    ↓
TanStack Query
    ↓
Check AsyncStorage Cache
    ↓
Display Cached Data (instant)
    ↓
Fetch Fresh from API
    ↓
Update Cache
    ↓
Update UI
```

### User Actions

```
Pull to Refresh → Refetch Query → Update UI
Scroll to End → Load Next Page → Append Data
Tap Article → Open Browser
Sign Out → Clear Session → Redirect to Login
```

## Tech Stack Layers

```
┌─────────────────────────────────────┐
│           React Native              │  UI Layer
│           (with Expo)                │
├─────────────────────────────────────┤
│         Expo Router                 │  Navigation
├─────────────────────────────────────┤
│    NativeWind (Tailwind CSS)        │  Styling
├─────────────────────────────────────┤
│       TanStack Query                │  Data Fetching
│    + AsyncStorage Cache             │
├─────────────────────────────────────┤
│        Supabase Client              │  Backend
│  (Auth + Optional Database)         │
├─────────────────────────────────────┤
│         Newsdata.io API             │  Content
└─────────────────────────────────────┘
```

## Component Hierarchy

```
RootLayout
  └─ ThemeProvider
      └─ QueryProvider (TanStack Query + Cache)
          └─ AuthProvider (Supabase Auth State)
              └─ Navigation Stack
                  ├─ Login Screen
                  └─ Tab Navigator
                      ├─ Feed Screen
                      │   └─ FlashList
                      │       └─ NewsCard[]
                      └─ Profile Screen
                          ├─ User Info Card
                          ├─ Menu Items
                          └─ Sign Out Button
```

## State Management

### Global State

- **Auth State**: `AuthProvider` + `useAuthContext`
  - session, profile, isLoading, isLoggedIn

- **Query Cache**: `QueryProvider` + TanStack Query
  - News articles (with pagination)
  - Persisted in AsyncStorage

### Local State

- **Login Screen**: email, password, isLoading, isSignUp
- **Feed Screen**: isRefreshing
- **Profile Screen**: (mostly derived from auth context)

## API Integration

### Supabase

```typescript
// Authentication
supabase.auth.signUp({ email, password });
supabase.auth.signInWithPassword({ email, password });
supabase.auth.signOut();
supabase.auth.getSession();
supabase.auth.onAuthStateChange(callback);

// Optional: Profiles
supabase.from("profiles").select("*").eq("id", userId);
```

### Newsdata.io

```typescript
// Fetch news
GET https://newsdata.io/api/1/latest
  ?apikey=xxx
  &country=au,us
  &language=en
  &page=nextPageToken

// Response
{
  status: "success",
  totalResults: number,
  results: Article[],
  nextPage: string | null
}
```

## Key Features Implementation

### ♾️ Infinite Scroll

- Uses TanStack Query's `useInfiniteQuery`
- `getNextPageParam` extracts `nextPage` token
- `onEndReached` triggers `fetchNextPage`

### 🔄 Pull to Refresh

- `RefreshControl` component
- Calls `refetch()` from TanStack Query
- Shows loading spinner

### 💾 Offline Caching

- `createAsyncStoragePersister` from TanStack
- Cache key: `TANSTACK_QUERY_CACHE`
- 24-hour cache duration
- Auto-loads on mount, fetches fresh data in background

### 🔐 Protected Routes

- `Stack.Protected` with `guard` prop
- Based on `isLoggedIn` from auth context
- Auto-redirects based on auth state

## Performance Optimizations

1. **FlashList** instead of FlatList (faster rendering)
2. **Image caching** (React Native default)
3. **Query deduplication** (TanStack Query)
4. **Stale-while-revalidate** pattern
5. **Lazy loading** with Expo Router
6. **Optimized re-renders** with proper hooks

## Design System

### Colors (from global.css)

- **Primary**: Blue (#1DA1F2 - Twitter-like blue)
- **Background**: White (light) / Black (dark)
- **Card**: Light gray (light) / Dark gray (dark)
- **Muted**: Light gray for secondary text

### Typography

- **Headlines**: Bold, 2xl-3xl
- **Body**: Regular, base
- **Muted**: Smaller, gray

### Spacing

- **Screen padding**: 6 (24px)
- **Card gap**: 4 (16px)
- **Element gap**: 2-3 (8-12px)

### Components

- **Rounded corners**: lg (13px from --radius: 1.3rem)
- **Shadows**: Subtle, black/5-10%
- **Borders**: Border color from theme

---

This structure follows:
✅ Expo Router conventions
✅ React Query best practices
✅ Supabase patterns
✅ React Native performance guidelines
✅ Clean architecture principles
