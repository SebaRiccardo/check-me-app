# Community Verifications - Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Community Screen (app/(tabs)/community.tsx)                 │  │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │  │
│  │  │  Header        │  │  FlashList     │  │  FAB Button    │ │  │
│  │  │  + Title       │  │  + Cards       │  │  "+"           │ │  │
│  │  │  + Subtitle    │  │  + Refresh     │  │                │ │  │
│  │  └────────────────┘  └────────────────┘  └────────────────┘ │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                  │                                  │
│                                  ↓                                  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Bottom Sheet Form (CreateVerificationForm)                  │  │
│  │  ┌──────────────────────────────────────────────────────┐   │  │
│  │  │  • Title Input (min 5 chars)                         │   │  │
│  │  │  • Description TextArea (min 20 chars)               │   │  │
│  │  │  • News ID Input (optional)                          │   │  │
│  │  │  • Category Selector (horizontal pills)              │   │  │
│  │  │  • Image Picker (with preview)                       │   │  │
│  │  │  • Submit Button                                     │   │  │
│  │  └──────────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ↓
┌─────────────────────────────────────────────────────────────────────┐
│                       PRESENTATION LAYER                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────┐  ┌──────────────────────┐               │
│  │  VerificationCard    │  │  Controlled Form     │               │
│  │  • Image (optional)  │  │  Components          │               │
│  │  • Category Badge    │  │  • Input             │               │
│  │  • Title             │  │  • TextArea          │               │
│  │  • Description       │  │  • Select            │               │
│  │  • Date              │  │                      │               │
│  └──────────────────────┘  └──────────────────────┘               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ↓
┌─────────────────────────────────────────────────────────────────────┐
│                         BUSINESS LOGIC                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Custom Hooks (hooks/use-verifications.ts)                         │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  useVerifications()                                           │  │
│  │  • Fetch all verifications                                    │  │
│  │  • Real-time subscription                                     │  │
│  │  • Auto-refresh on changes                                    │  │
│  │  • Returns: { verifications, isLoading, error, refetch }     │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  useCreateVerification()                                      │  │
│  │  • Insert new verification                                    │  │
│  │  • Handle errors                                              │  │
│  │  • Returns: { createVerification, isLoading, error }         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  uploadVerificationImage()                                    │  │
│  │  • Upload to Storage                                          │  │
│  │  • Returns public URL                                         │  │
│  │  • Compression & optimization                                 │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ↓
┌─────────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Supabase Client (lib/supabase.ts)                                 │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Auth: SecureStore                                            │  │
│  │  Auto-refresh tokens                                          │  │
│  │  Session management                                           │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ↓
┌─────────────────────────────────────────────────────────────────────┐
│                         BACKEND (Supabase)                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  PostgreSQL Database                                          │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │  Table: verifications                                   │  │  │
│  │  │  • id (UUID, PK)                                        │  │  │
│  │  │  • user_id (UUID, FK → auth.users)                     │  │  │
│  │  │  • title (TEXT)                                         │  │  │
│  │  │  • description (TEXT)                                   │  │  │
│  │  │  • news_id (TEXT, nullable)                            │  │  │
│  │  │  • image_url (TEXT, nullable)                          │  │  │
│  │  │  • category (TEXT)                                      │  │  │
│  │  │  • created_at (TIMESTAMP)                               │  │  │
│  │  │  • updated_at (TIMESTAMP, auto)                         │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  │                                                                │  │
│  │  Indexes:                                                      │  │
│  │  • user_id_idx                                                 │  │
│  │  • category_idx                                                │  │
│  │  • created_at_idx (DESC)                                       │  │
│  │  • news_id_idx                                                 │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Row Level Security (RLS)                                     │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │  SELECT:  Anyone can read                              │  │  │
│  │  │  INSERT:  auth.uid() = user_id                         │  │  │
│  │  │  UPDATE:  auth.uid() = user_id                         │  │  │
│  │  │  DELETE:  auth.uid() = user_id                         │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Storage Bucket: verification-images                          │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │  Public: ✅                                              │  │  │
│  │  │  Structure: {user_id}/{timestamp}.{ext}                │  │  │
│  │  │  Policies:                                             │  │  │
│  │  │  • SELECT: Everyone                                    │  │  │
│  │  │  • INSERT: Authenticated users                         │  │  │
│  │  │  • UPDATE: Owner only (by folder path)                 │  │  │
│  │  │  • DELETE: Owner only (by folder path)                 │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Realtime Subscription                                        │  │
│  │  • Channel: verifications-changes                             │  │
│  │  • Events: INSERT, UPDATE, DELETE                             │  │
│  │  • Auto-refresh UI on database changes                        │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         DATA FLOW                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  CREATE VERIFICATION:                                               │
│  1. User fills form → 2. Validate with Zod → 3. Upload image       │
│  4. Get image URL → 5. Insert to DB → 6. Realtime broadcasts       │
│  7. All clients update automatically                                │
│                                                                     │
│  READ VERIFICATIONS:                                                │
│  1. Component mounts → 2. useVerifications() hook                   │
│  3. Fetch from Supabase → 4. Subscribe to realtime                  │
│  5. Render in FlashList → 6. Auto-update on changes                │
│                                                                     │
│  REFRESH:                                                           │
│  1. Pull down → 2. Trigger refetch() → 3. Query database           │
│  4. Update local state → 5. Re-render list                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         SECURITY LAYERS                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. Client Validation (Zod)                                         │
│     • Min/max lengths                                               │
│     • Required fields                                               │
│     • Type checking                                                 │
│                                                                     │
│  2. Authentication (Supabase Auth)                                  │
│     • JWT tokens                                                    │
│     • SecureStore persistence                                       │
│     • Auto token refresh                                            │
│                                                                     │
│  3. Row Level Security (RLS)                                        │
│     • User can only modify own data                                 │
│     • Everyone can read                                             │
│     • Database-level enforcement                                    │
│                                                                     │
│  4. Storage Policies                                                │
│     • Folder-based access control                                   │
│     • Owner-only modifications                                      │
│     • Public read access                                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      PERFORMANCE OPTIMIZATIONS                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  • FlashList for efficient scrolling                                │
│  • Image compression (quality 0.8)                                  │
│  • Database indexes on common queries                               │
│  • Real-time instead of polling                                     │
│  • Pull-to-refresh instead of auto-refresh                          │
│  • Lazy loading with bottom sheet                                   │
│  • Optimized query with select('*')                                 │
│  • Created_at DESC index for fast recent items                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Key Components Interaction

```
Community Screen
      ↓
      ├→ useVerifications() → Supabase.from('verifications').select()
      │                    → Subscribe to realtime changes
      │                    → Return: verifications[]
      ↓
VerificationCard (for each item)
      │
      └→ Display: image, category, title, description, date


FAB Button "+" clicked
      ↓
Bottom Sheet opens
      ↓
User fills form
      ↓
Submit clicked
      ↓
      ├→ uploadVerificationImage() → Supabase.storage.upload()
      │                           → Return: public URL
      ↓
      └→ useCreateVerification() → Supabase.from('verifications').insert()
                                 → Realtime broadcasts INSERT event
                                 → All screens auto-update
```

## File Dependencies

```
community.tsx
  ├── uses: useVerifications()
  ├── uses: CreateVerificationForm
  └── uses: VerificationCard

CreateVerificationForm
  ├── uses: useCreateVerification()
  ├── uses: uploadVerificationImage()
  ├── uses: ControlledInput
  ├── uses: ControlledTextArea
  ├── uses: ControlledSelect
  └── uses: react-hook-form + zod

use-verifications.ts
  ├── imports: supabase client
  └── exports: 5 functions

verification.ts (types)
  └── exports: Verification, VerificationInsert, VERIFICATION_CATEGORIES
```

This architecture ensures:

- ✅ Separation of concerns
- ✅ Reusable components
- ✅ Type safety
- ✅ Security at every layer
- ✅ Optimal performance
- ✅ Real-time updates
- ✅ Scalability
