# Admin Approval System - Quick Reference

## 🎯 Quick Start

### For Admins

1. **View Pending Verifications**
   - Look for toggle button in top-right corner of Community screen
   - Badge shows count of pending items
   - Tap "Ver Pendientes" to switch view

2. **Review a Verification**
   - Tap on any card with amber "Pendiente" banner
   - Bottom sheet opens with full details

3. **Approve**
   - Tap green "Aprobar Verificación" button
   - Confirm in dialog
   - Verification goes live immediately

4. **Reject**
   - Tap red "Rechazar Verificación" button
   - Confirm in dialog (permanent deletion)
   - Verification is removed

### For Developers

#### Import the hook

```typescript
import { useVerifications } from "@/hooks/use-verifications";
```

#### Use in component

```typescript
const {
  verifications,
  isLoading,
  pendingCount,
  fetchVerifications,
  fetchPendingCount,
  approveVerification,
  rejectVerification,
} = useVerifications();
```

#### Fetch with filter

```typescript
// Get approved verifications
await fetchVerifications(false, false);

// Get pending verifications
await fetchVerifications(false, true);
```

#### Admin actions

```typescript
// Approve
const success = await approveVerification(verificationId);

// Reject
const success = await rejectVerification(verificationId);
```

## 📋 Component Props

### VerificationCard

```typescript
<VerificationCard
  verification={item}
  isAdmin={true}
  isPendingView={true}
/>
```

### AdminApprovalBottomSheet

```typescript
<AdminApprovalBottomSheet
  ref={bottomSheetRef}
  verification={selectedVerification}
  onApprove={handleApprove}
  onReject={handleReject}
  onClose={handleClose}
/>
```

## 🎨 Visual States

| State                  | Indicator        | Color                            |
| ---------------------- | ---------------- | -------------------------------- |
| Approved               | None             | -                                |
| Pending                | Amber banner     | `bg-amber-50` `border-amber-200` |
| Admin Toggle (Default) | Clock icon       | `border-blue-500` `bg-blue-50`   |
| Admin Toggle (Pending) | CheckCircle icon | `border-blue-500` `bg-blue-50`   |
| Pending Count Badge    | Red circle       | `bg-red-500`                     |
| Approve Button         | Green            | `bg-green-600`                   |
| Reject Button          | Red              | `variant="destructive"`          |

## 🔐 Security Checklist

- [ ] RLS enabled on verifications table
- [ ] SELECT policy filters by `admin_approved`
- [ ] UPDATE policy checks admin claim
- [ ] DELETE policy checks admin claim
- [ ] Admin users have `app_metadata.admin = true`
- [ ] Frontend checks `session?.user?.is_admin`

## 🧪 Testing Steps

1. **Create test verification as regular user**

   ```typescript
   // Should set admin_approved = false by default
   ```

2. **Verify it's hidden from regular users**

   ```typescript
   // Regular user should not see it in list
   ```

3. **Login as admin**

   ```typescript
   // Check isAdmin = true
   // Toggle button should be visible
   ```

4. **Check pending count**

   ```typescript
   // Badge should show number > 0
   ```

5. **Switch to pending view**

   ```typescript
   // Tap "Ver Pendientes"
   // Should see amber banner on cards
   ```

6. **Test approval**

   ```typescript
   // Tap card → Tap "Aprobar" → Confirm
   // Verification should appear in approved list
   ```

7. **Test rejection**
   ```typescript
   // Create another test → Switch to pending
   // Tap card → Tap "Rechazar" → Confirm
   // Verification should be deleted
   ```

## 🐛 Common Issues

### Toggle button not showing

- Check `session?.user?.is_admin` value
- Verify JWT token has admin claim
- Try logout and login again

### Cannot approve/reject

- Check RLS policies in database
- Verify admin claim in JWT
- Check console for errors

### Pending count not updating

- Call `fetchPendingCount()` after actions
- Check network requests in DevTools
- Verify database query returns correct count

### Cards not showing pending banner

- Verify `isPendingView={true}` prop is passed
- Check `showPending` state
- Verify component re-renders on state change

## 📊 Database Queries

### Count pending

```sql
SELECT COUNT(*) FROM verifications WHERE admin_approved = false;
```

### List pending

```sql
SELECT * FROM verifications
WHERE admin_approved = false
ORDER BY created_at DESC;
```

### Approve by ID

```sql
UPDATE verifications
SET admin_approved = true
WHERE id = 'verification-id';
```

### Check admin users

```sql
SELECT id, email, raw_app_meta_data
FROM auth.users
WHERE raw_app_meta_data->>'admin' = 'true';
```

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Run migration script from `ADMIN_APPROVAL_SETUP.md`
- [ ] Test all RLS policies
- [ ] Set up at least one admin user
- [ ] Test approve/reject flows
- [ ] Verify regular users cannot see pending items
- [ ] Test pull-to-refresh in both views
- [ ] Check error handling
- [ ] Verify loading states work
- [ ] Test on iOS and Android
- [ ] Monitor initial user feedback

## 📚 Related Documentation

- [Full Architecture](./ADMIN_APPROVAL_SYSTEM.md)
- [Database Setup Guide](./ADMIN_APPROVAL_SETUP.md)
- [Verifications Context Guide](./VERIFICATIONS_CONTEXT_GUIDE.md)

## 🆘 Support

If issues persist:

1. Check Supabase dashboard logs
2. Review browser/app console errors
3. Verify database policies
4. Test with fresh user account
5. Check JWT token contents

## 📝 Notes

- Rejection is permanent (deletes verification)
- Approval is immediate (no undo)
- Pending count updates automatically
- Real-time updates still work for both views
- Works with existing verifications (backward compatible)

---

**Version**: 1.0.0  
**Last Updated**: November 2025
