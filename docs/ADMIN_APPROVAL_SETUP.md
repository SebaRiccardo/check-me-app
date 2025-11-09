# Admin Approval System - Database Setup Guide

## Overview

This guide will help you set up the necessary database policies for the admin approval system to work securely in production.

## Prerequisites

- Supabase project set up
- Admin access to Supabase dashboard
- Understanding of Row Level Security (RLS)

## Step 1: Verify Database Schema

Ensure your `verifications` table includes the `admin_approved` field:

```sql
-- Check if column exists
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'verifications'
  AND column_name = 'admin_approved';
```

If it doesn't exist, add it:

```sql
-- Add admin_approved column
ALTER TABLE verifications
ADD COLUMN admin_approved BOOLEAN DEFAULT false;

-- Set existing verifications as approved (migration)
UPDATE verifications
SET admin_approved = true
WHERE admin_approved IS NULL;
```

## Step 2: Enable Row Level Security

Enable RLS on the verifications table if not already enabled:

```sql
-- Enable RLS
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;
```

## Step 3: Drop Existing Policies (if any)

Remove any conflicting policies:

```sql
-- List existing policies
SELECT policyname FROM pg_policies WHERE tablename = 'verifications';

-- Drop old policies if needed
DROP POLICY IF EXISTS "Users can view all verifications" ON verifications;
DROP POLICY IF EXISTS "Users can insert verifications" ON verifications;
DROP POLICY IF EXISTS "Users can update own verifications" ON verifications;
DROP POLICY IF EXISTS "Users can delete own verifications" ON verifications;
```

## Step 4: Create New Security Policies

### Policy 1: Users can view only approved verifications (or all if admin)

```sql
CREATE POLICY "Users see only approved verifications"
ON verifications
FOR SELECT
USING (
  admin_approved = true
  OR
  (auth.jwt() -> 'app_metadata' ->> 'admin')::boolean = true
);
```

### Policy 2: Authenticated users can create verifications (pending by default)

```sql
CREATE POLICY "Authenticated users can create verifications"
ON verifications
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND (admin_approved IS NULL OR admin_approved = false)
);
```

### Policy 3: Users can update their own pending verifications

```sql
CREATE POLICY "Users can update own pending verifications"
ON verifications
FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id
  AND (admin_approved = false OR admin_approved IS NULL)
)
WITH CHECK (
  auth.uid() = user_id
  AND (admin_approved = false OR admin_approved IS NULL)
);
```

### Policy 4: Only admins can approve verifications

```sql
CREATE POLICY "Only admins can approve verifications"
ON verifications
FOR UPDATE
TO authenticated
USING (
  (auth.jwt() -> 'app_metadata' ->> 'admin')::boolean = true
)
WITH CHECK (
  (auth.jwt() -> 'app_metadata' ->> 'admin')::boolean = true
);
```

### Policy 5: Users can delete their own pending verifications

```sql
CREATE POLICY "Users can delete own pending verifications"
ON verifications
FOR DELETE
TO authenticated
USING (
  auth.uid() = user_id
  AND (admin_approved = false OR admin_approved IS NULL)
);
```

### Policy 6: Admins can delete any verification

```sql
CREATE POLICY "Admins can delete any verification"
ON verifications
FOR DELETE
TO authenticated
USING (
  (auth.jwt() -> 'app_metadata' ->> 'admin')::boolean = true
);
```

## Step 5: Set Up Admin Users

### Method 1: Using Supabase Dashboard

1. Go to Authentication > Users
2. Find the user you want to make admin
3. Click on the user
4. Scroll to "User Metadata"
5. Add to "App Metadata":

```json
{
  "admin": true
}
```

### Method 2: Using SQL Function

```sql
-- Create a function to make a user admin
CREATE OR REPLACE FUNCTION make_user_admin(user_email TEXT)
RETURNS void AS $$
BEGIN
  UPDATE auth.users
  SET raw_app_meta_data =
    COALESCE(raw_app_meta_data, '{}'::jsonb) || '{"admin": true}'::jsonb
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Usage
SELECT make_user_admin('admin@example.com');
```

### Method 3: Using Supabase Admin API

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  "YOUR_SUPABASE_URL",
  "YOUR_SERVICE_ROLE_KEY", // Use service role key
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

async function makeUserAdmin(userId: string) {
  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
    userId,
    {
      app_metadata: { admin: true },
    },
  );

  if (error) console.error("Error:", error);
  else console.log("User is now admin:", data);
}

// Usage
await makeUserAdmin("user-uuid-here");
```

## Step 6: Test Security Policies

Run these queries to verify policies work correctly:

### Test 1: Regular user can only see approved verifications

```sql
-- As a regular user (non-admin)
SELECT * FROM verifications;
-- Should only return rows where admin_approved = true
```

### Test 2: Admin can see all verifications

```sql
-- As an admin user
SELECT * FROM verifications;
-- Should return all rows including admin_approved = false
```

### Test 3: Regular user cannot approve verifications

```sql
-- As a regular user (should fail)
UPDATE verifications
SET admin_approved = true
WHERE id = 'some-verification-id';
-- Should return: new row violates row-level security policy
```

### Test 4: Admin can approve verifications

```sql
-- As an admin user (should succeed)
UPDATE verifications
SET admin_approved = true
WHERE id = 'some-verification-id';
-- Should succeed
```

## Step 7: Verify in Application

1. **Test as Regular User:**
   - Login as non-admin
   - Verify toggle button is NOT visible
   - Create a verification (should be pending by default)
   - Verify you cannot see your own pending verification in the list

2. **Test as Admin:**
   - Login as admin
   - Verify toggle button IS visible
   - Verify pending count shows your test verification
   - Click "Ver Pendientes"
   - Verify you can see the pending verification
   - Tap on it to open review sheet
   - Test approve action
   - Verify it now appears in approved list
   - Create another test verification
   - Test reject action
   - Verify it's deleted

## Troubleshooting

### Issue: Admin cannot see pending verifications

**Check:**

1. User has `admin: true` in `app_metadata`
2. JWT token includes the admin claim (logout and login again)
3. RLS policies are correctly set up

**Solution:**

```sql
-- Verify user's app_metadata
SELECT raw_app_meta_data FROM auth.users WHERE email = 'admin@example.com';
-- Should show: {"admin": true}
```

### Issue: Regular users can see pending verifications

**Check:**

1. RLS is enabled on the table
2. SELECT policy is correctly filtering by `admin_approved = true`

**Solution:**

```sql
-- Re-create the select policy
DROP POLICY IF EXISTS "Users see only approved verifications" ON verifications;

CREATE POLICY "Users see only approved verifications"
ON verifications
FOR SELECT
USING (
  admin_approved = true
  OR
  (auth.jwt() -> 'app_metadata' ->> 'admin')::boolean = true
);
```

### Issue: Admin cannot approve/reject

**Check:**

1. Update and delete policies allow admin actions
2. User session has latest JWT with admin claim

**Solution:**

```sql
-- Verify policies exist
SELECT policyname, cmd FROM pg_policies
WHERE tablename = 'verifications'
  AND cmd IN ('UPDATE', 'DELETE');
```

## Default Configuration for New Verifications

When users create verifications, they should be pending by default:

```sql
-- Set default value
ALTER TABLE verifications
ALTER COLUMN admin_approved SET DEFAULT false;
```

Update the client-side form to explicitly set:

```typescript
const verification: VerificationInsert = {
  // ... other fields
  admin_approved: false, // Explicitly set to pending
};
```

## Backup Policies (Optional)

Create a backup of your policies before making changes:

```sql
-- Export policies
SELECT 'CREATE POLICY "' || policyname || '" ON ' ||
       tablename || ' FOR ' || cmd ||
       ' USING (' || qual || ');' AS policy_definition
FROM pg_policies
WHERE tablename = 'verifications';
```

## Migration Script (Complete Setup)

Here's a complete script you can run in Supabase SQL Editor:

```sql
-- Complete Admin Approval System Setup
-- Run this in Supabase SQL Editor

BEGIN;

-- 1. Add admin_approved column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'verifications'
    AND column_name = 'admin_approved'
  ) THEN
    ALTER TABLE verifications
    ADD COLUMN admin_approved BOOLEAN DEFAULT false;
  END IF;
END $$;

-- 2. Migrate existing verifications to approved
UPDATE verifications
SET admin_approved = true
WHERE admin_approved IS NULL;

-- 3. Enable RLS
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;

-- 4. Drop old policies
DROP POLICY IF EXISTS "Users see only approved verifications" ON verifications;
DROP POLICY IF EXISTS "Authenticated users can create verifications" ON verifications;
DROP POLICY IF EXISTS "Users can update own pending verifications" ON verifications;
DROP POLICY IF EXISTS "Only admins can approve verifications" ON verifications;
DROP POLICY IF EXISTS "Users can delete own pending verifications" ON verifications;
DROP POLICY IF EXISTS "Admins can delete any verification" ON verifications;

-- 5. Create new policies
CREATE POLICY "Users see only approved verifications"
ON verifications FOR SELECT
USING (
  admin_approved = true
  OR
  (auth.jwt() -> 'app_metadata' ->> 'admin')::boolean = true
);

CREATE POLICY "Authenticated users can create verifications"
ON verifications FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND (admin_approved IS NULL OR admin_approved = false)
);

CREATE POLICY "Users can update own pending verifications"
ON verifications FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id
  AND (admin_approved = false OR admin_approved IS NULL)
)
WITH CHECK (
  auth.uid() = user_id
  AND (admin_approved = false OR admin_approved IS NULL)
);

CREATE POLICY "Only admins can approve verifications"
ON verifications FOR UPDATE
TO authenticated
USING (
  (auth.jwt() -> 'app_metadata' ->> 'admin')::boolean = true
)
WITH CHECK (
  (auth.jwt() -> 'app_metadata' ->> 'admin')::boolean = true
);

CREATE POLICY "Users can delete own pending verifications"
ON verifications FOR DELETE
TO authenticated
USING (
  auth.uid() = user_id
  AND (admin_approved = false OR admin_approved IS NULL)
);

CREATE POLICY "Admins can delete any verification"
ON verifications FOR DELETE
TO authenticated
USING (
  (auth.jwt() -> 'app_metadata' ->> 'admin')::boolean = true
);

COMMIT;

-- Verify setup
SELECT 'Setup complete! Policies created:' AS status;
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'verifications';
```

## Next Steps

After completing the setup:

1. ✅ Test with non-admin user account
2. ✅ Test with admin user account
3. ✅ Verify all CRUD operations work correctly
4. ✅ Monitor for any RLS policy violations
5. ✅ Document your admin users
6. ✅ Set up monitoring for pending verifications count

## Support

If you encounter issues:

1. Check Supabase logs in the dashboard
2. Review the error messages in the app console
3. Verify JWT token includes admin claim
4. Test policies manually in SQL editor

---

**Last Updated**: November 2025  
**Version**: 1.0.0
