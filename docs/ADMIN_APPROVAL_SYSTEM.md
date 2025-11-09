# Admin Verification Approval System

## Overview

This feature adds a complete admin approval workflow for community verifications. Administrators can toggle between viewing approved and pending verifications, and approve or reject submissions through an intuitive bottom sheet interface.

## Architecture

### Data Layer

**Database Field**: `admin_approved` (boolean, nullable)

- `true`: Verification is approved and visible to all users
- `false`: Verification is pending admin approval
- `null`: Legacy verifications (treated as approved for backward compatibility)

### Components

#### 1. **VerificationsProvider** (`providers/verifications-provider.tsx`)

Enhanced with admin-specific functionality:

**New State:**

- `pendingCount`: Number of verifications awaiting approval

**New Methods:**

- `fetchVerifications(isRefreshing?, showPending?)`: Filters by approval status
- `fetchPendingCount()`: Gets count of pending verifications
- `approveVerification(id)`: Sets `admin_approved = true`
- `rejectVerification(id)`: Deletes the verification
- `refetch(showPending?)`: Refreshes with filter option

#### 2. **AdminApprovalBottomSheet** (`components/admin-approval-bottom-sheet.tsx`)

Modal interface for reviewing pending verifications:

**Features:**

- Full verification details display
- User information (avatar, name, username, timestamp)
- Category badge with color coding
- Clickable title link to source
- Full description in styled container
- Image preview (if available)
- Action buttons:
  - **Aprobar** (Green): Approves and publishes the verification
  - **Rechazar** (Red): Deletes the verification

**User Experience:**

- Confirmation dialogs for both approve and reject actions
- Loading states during operations
- Success/error feedback via alerts
- Auto-closes after successful action

#### 3. **CommunityScreen** (`app/(tabs)/index.tsx`)

Updated main screen with admin controls:

**New Features:**

- Admin toggle button in header (visible only to admins)
- Badge showing pending count
- Different header text based on current view
- Tap-to-review interaction for pending verifications
- Automatic refresh after approve/reject

**States:**

- `showPending`: Toggle between approved/pending views
- `selectedVerification`: Currently selected verification for review

#### 4. **VerificationCard** (`components/verification-card.tsx`)

Enhanced to show pending status:

**New Props:**

- `isPendingView`: Indicates if card is in pending view

**Visual Indicator:**

- Amber banner at top when in pending view
- "Pendiente de aprobación - Toca para revisar" message
- Clock icon for visual distinction

## User Flow

### Admin Workflow

1. **Default View (Approved Verifications)**
   - Shows all approved verifications
   - Toggle button displays "Ver Pendientes" with badge count

2. **Toggle to Pending View**
   - Click toggle button
   - Header updates to "Verificaciones pendientes de aprobación"
   - Shows only pending verifications
   - Each card displays amber pending banner

3. **Review Verification**
   - Tap on any pending verification card
   - Bottom sheet slides up with full details
   - Review content, user info, and category

4. **Approve Verification**
   - Click "Aprobar Verificación" button
   - Confirmation dialog appears
   - On confirm:
     - Sets `admin_approved = true` in database
     - Removes from pending list
     - Updates pending count badge
     - Shows success alert
     - Closes bottom sheet

5. **Reject Verification**
   - Click "Rechazar Verificación" button
   - Warning dialog appears (action is permanent)
   - On confirm:
     - Deletes verification from database
     - Removes from pending list
     - Updates pending count badge
     - Shows success alert
     - Closes bottom sheet

6. **Return to Approved View**
   - Click toggle button again
   - Returns to default approved verifications view

### Regular User Experience

- No changes to existing functionality
- Cannot see admin toggle button
- Cannot see pending verifications
- Only sees approved verifications

## Permission Check

Admin status is checked via:

```typescript
const isAdmin = session?.user?.is_admin || false;
```

This requires the JWT token to include the `is_admin` claim in `app_metadata`, which is handled by the `AuthProvider`:

```typescript
const extractAdminClaim = (session: Session | null): boolean => {
  if (!session) return false;

  try {
    const jwt = jwtDecode(session.access_token) as any;
    return jwt.app_metadata?.admin || false;
  } catch (error) {
    return false;
  }
};
```

## Database Queries

### Fetch Approved Verifications

```typescript
const query = supabase
  .from("verifications")
  .select(
    `
    *,
    profiles!verifications_user_id_fkey1 (
      avatar_url,
      full_name,
      username
    )
  `,
  )
  .eq("admin_approved", true)
  .order("created_at", { ascending: false });
```

### Fetch Pending Verifications

```typescript
const query = supabase
  .from("verifications")
  .select(
    `
    *,
    profiles!verifications_user_id_fkey1 (
      avatar_url,
      full_name,
      username
    )
  `,
  )
  .eq("admin_approved", false)
  .order("created_at", { ascending: false });
```

### Get Pending Count

```typescript
const { count } = await supabase
  .from("verifications")
  .select("*", { count: "exact", head: true })
  .eq("admin_approved", false);
```

### Approve Verification

```typescript
await supabase
  .from("verifications")
  .update({ admin_approved: true })
  .eq("id", id);
```

### Reject Verification

```typescript
await supabase.from("verifications").delete().eq("id", id);
```

## Visual Design

### Admin Toggle Button

- **Location**: Top right of header, next to "Comunidad" title
- **Colors**:
  - Border: `border-blue-500`
  - Background: `bg-blue-50`
  - Active: `bg-blue-100`
  - Text: `text-blue-600`
- **Icons**:
  - Pending view: `CheckCircle2` (view approved)
  - Approved view: `Clock` (view pending)
- **Badge**:
  - Red circle with white text
  - Shows pending count when in approved view
  - Position: top-right of button

### Pending Banner (on cards)

- **Colors**:
  - Background: `bg-amber-50`
  - Border: `border-amber-200`
  - Text: `text-amber-700`
  - Icon: `text-amber-600`
- **Text**: "Pendiente de aprobación - Toca para revisar"

### Bottom Sheet Actions

- **Approve Button**:
  - Background: `bg-green-600`
  - Icon: `CheckCircle`
  - Text: "Aprobar Verificación"
- **Reject Button**:
  - Variant: `destructive` (red theme)
  - Icon: `XCircle`
  - Text: "Rechazar Verificación"

## Error Handling

All operations include:

1. Try-catch blocks for database operations
2. Error state management in provider
3. User-friendly error alerts
4. Fallback UI states
5. Proper cleanup on unmount

## Performance Considerations

- Pending count fetched only when:
  - Screen gains focus (for admins)
  - After approve/reject actions
- Verifications re-fetched only when:
  - View toggle changes
  - Manual refresh triggered
- Real-time subscriptions still work for both views
- Optimistic UI updates for better UX

## Testing Checklist

- [ ] Admin can see toggle button
- [ ] Non-admin cannot see toggle button
- [ ] Toggle switches between views correctly
- [ ] Pending count displays accurately
- [ ] Pending banner shows on cards in pending view
- [ ] Tapping pending card opens bottom sheet
- [ ] Bottom sheet displays all verification details
- [ ] Approve action works and updates UI
- [ ] Reject action works and updates UI
- [ ] Pending count updates after actions
- [ ] Confirmation dialogs appear for both actions
- [ ] Success/error alerts display correctly
- [ ] Pull-to-refresh works in both views
- [ ] Real-time updates still function
- [ ] No errors in console

## Future Enhancements

Potential improvements:

1. Add reason field for rejections
2. Notification to user when verified/rejected
3. History of admin actions
4. Batch approval interface
5. Filter by category in pending view
6. Search within pending verifications
7. Analytics dashboard for admin actions

## Security Notes

⚠️ **Important**: This is a client-side implementation. For production:

1. **Backend Validation**: Add RLS policies to ensure only admins can:
   - Update `admin_approved` field
   - Delete verifications
   - Query pending verifications

2. **Recommended Supabase RLS Policies**:

```sql
-- Only admins can approve verifications
CREATE POLICY "Only admins can approve verifications"
ON verifications
FOR UPDATE
USING (
  auth.jwt() ->> 'app_metadata' ->> 'admin' = 'true'
)
WITH CHECK (
  auth.jwt() ->> 'app_metadata' ->> 'admin' = 'true'
);

-- Only admins can delete verifications
CREATE POLICY "Only admins can delete verifications"
ON verifications
FOR DELETE
USING (
  auth.jwt() ->> 'app_metadata' ->> 'admin' = 'true'
);

-- Regular users only see approved verifications
CREATE POLICY "Users see only approved verifications"
ON verifications
FOR SELECT
USING (
  admin_approved = true
  OR
  auth.jwt() ->> 'app_metadata' ->> 'admin' = 'true'
);
```

## Related Files

- `/providers/verifications-provider.tsx` - Context provider with admin methods
- `/components/admin-approval-bottom-sheet.tsx` - Review interface
- `/components/verification-card.tsx` - Card with pending indicator
- `/app/(tabs)/index.tsx` - Main community screen
- `/hooks/use-verifications.ts` - Hook for consuming provider
- `/types/verification.ts` - TypeScript types
- `/lib/supabase/database.types.ts` - Database schema types
