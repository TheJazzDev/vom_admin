# VOM Admin Panel - Implementation Guide

## Overview
This document outlines the implementation of real database integration with Firebase Admin SDK, authentication system, and API-based data fetching for the VOM Admin Panel.

## What's Been Implemented

### 1. Firebase Admin SDK Setup
- **File**: `src/lib/firebase-admin.ts`
- **Purpose**: Server-side Firebase operations with admin privileges
- **Features**:
  - Secure initialization with service account credentials
  - Firestore admin access
  - Firebase Auth admin access

### 2. Authentication System

#### Backend API Routes
All authentication routes are in `src/app/api/auth/`:

- **POST `/api/auth/login`**: Creates a secure session cookie after verifying user credentials and admin role
- **POST `/api/auth/logout`**: Clears session cookie and revokes refresh tokens
- **GET `/api/auth/session`**: Verifies current session and returns user data

#### Frontend Components
- **Auth Context**: `src/contexts/AuthContext.tsx`
  - Manages authentication state
  - Provides `login()`, `logout()`, and `user` state
  - Automatically checks session on mount
  - Listens to Firebase auth state changes

- **Login Page**: `src/app/login/page.tsx`
  - Email/password authentication
  - Admin role verification
  - Error handling and validation
  - Responsive design

- **Middleware**: `src/middleware.ts`
  - Protects all routes except `/login` and public paths
  - Redirects unauthenticated users to login
  - Validates session cookies for API routes

### 3. API Routes (Server-side with Firebase Admin)

#### Members API
Located in `src/app/api/members/`:

- **GET `/api/members`**: Fetch all members with optional filters
  - Query params: `status`, `band`, `department`
  - Returns: Array of member objects

- **GET `/api/members/[id]`**: Fetch single member by ID
  - Returns: Member object or 404

- **POST `/api/members`**: Create new member
  - Body: Member data object
  - Returns: Created member with ID

- **PATCH `/api/members/[id]`**: Update existing member
  - Body: Partial member data
  - Returns: Updated member object

- **DELETE `/api/members/[id]`**: Delete member
  - Returns: Success message

#### Programmes API
Located in `src/app/api/programmes/`:

- **GET `/api/programmes`**: Fetch all programmes with optional filters
  - Query params: `status`, `type`
  - Returns: Array of programme objects

- **GET `/api/programmes/[id]`**: Fetch single programme
- **POST `/api/programmes`**: Create new programme
- **PATCH `/api/programmes/[id]`**: Update programme
- **DELETE `/api/programmes/[id]`**: Delete programme

#### Export API
- **GET `/api/export/members`**: Export members to CSV
  - Query params: Same as GET `/api/members`
  - Returns: Downloadable CSV file

### 4. Client-side API Services

#### Members API Service
**File**: `src/services/api/membersApi.ts`

```typescript
import { fetchMembers, createMemberApi, updateMemberApi } from '@/services/api/membersApi';

// Fetch all members
const members = await fetchMembers();

// Fetch with filters
const activeMembers = await fetchMembers({ status: 'active' });

// Create member
const newMember = await createMemberApi(memberData);

// Update member
const updated = await updateMemberApi(memberId, updates);

// Export to CSV
await exportMembersToCSV({ status: 'active' });
```

#### Programmes API Service
**File**: `src/services/api/programmesApi.ts`

Similar pattern to members API.

### 5. React Query Hooks

#### Members Hooks
**File**: `src/hooks/useMembers.ts`

```typescript
import { useMembers, useCreateMember, useUpdateMember } from '@/hooks/useMembers';

function MembersComponent() {
  // Fetch all members
  const { data: members, isLoading, error } = useMembers();

  // Fetch with filters
  const { data: activeMembers } = useMembers({ status: 'active' });

  // Create mutation
  const createMember = useCreateMember();
  await createMember.mutateAsync(memberData);

  // Update mutation
  const updateMember = useUpdateMember();
  await updateMember.mutateAsync({ id: memberId, updates });

  // Export mutation
  const exportMembers = useExportMembers();
  await exportMembers.mutateAsync({ status: 'active' });
}
```

#### Programmes Hooks
**File**: `src/hooks/useProgrammes.ts`

Similar pattern to members hooks.

### 6. Updated Components

#### Site Header
**File**: `src/components/sidebar/site-header.tsx`
- Displays logged-in user info (name, role)
- Logout button
- Hidden on login page

#### App Providers
**File**: `src/Providers/Providers.tsx`
- Wraps app with AuthProvider
- Conditionally shows sidebar (hidden on login page)
- Includes Toaster for notifications

## How to Use

### 1. Setting Up Authentication

First, you need to create users with admin roles in Firestore. Users should have the following structure:

```typescript
{
  id: string,
  email: string,
  role: 'admin' | 'super_admin', // Required for admin access
  firstName: string,
  lastName: string,
  // ... other fields
}
```

### 2. Logging In

1. Navigate to `/login`
2. Enter email and password
3. System will:
   - Verify credentials with Firebase Auth
   - Check if user has admin role
   - Create secure session cookie
   - Redirect to dashboard

### 3. Using Data in Components

#### Example: Fetching Members

```typescript
'use client';

import { useMembers } from '@/hooks/useMembers';

export function MembersTable() {
  const { data: members, isLoading, error } = useMembers();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {members?.map(member => (
        <div key={member.id}>
          {member.firstName} {member.lastName}
        </div>
      ))}
    </div>
  );
}
```

#### Example: Creating a Member

```typescript
'use client';

import { useCreateMember } from '@/hooks/useMembers';
import { toast } from 'sonner';

export function CreateMemberForm() {
  const createMember = useCreateMember();

  const handleSubmit = async (data) => {
    try {
      await createMember.mutateAsync(data);
      toast.success('Member created successfully');
    } catch (error) {
      toast.error('Failed to create member');
    }
  };

  return <form onSubmit={handleSubmit}>{/* form fields */}</form>;
}
```

#### Example: Exporting Data

```typescript
'use client';

import { useExportMembers } from '@/hooks/useMembers';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function ExportButton() {
  const exportMembers = useExportMembers();

  const handleExport = async () => {
    try {
      await exportMembers.mutateAsync({ status: 'active' });
      toast.success('Export started');
    } catch (error) {
      toast.error('Export failed');
    }
  };

  return (
    <Button onClick={handleExport} disabled={exportMembers.isPending}>
      {exportMembers.isPending ? 'Exporting...' : 'Export to CSV'}
    </Button>
  );
}
```

### 4. Protecting Components

Components are automatically protected by the middleware. If a user is not authenticated, they'll be redirected to `/login`.

To check auth state in components:

```typescript
'use client';

import { useAuth } from '@/contexts/AuthContext';

export function AdminComponent() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isAdmin) return <div>Unauthorized</div>;

  return <div>Welcome {user?.firstName}!</div>;
}
```

## Migration Guide: Updating Existing Components

### Before (Direct Firestore)
```typescript
import { getAllMembers } from '@/services/members/memberService';

export function MembersPage() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    getAllMembers().then(setMembers);
  }, []);

  return <div>{/* render members */}</div>;
}
```

### After (API with React Query)
```typescript
import { useMembers } from '@/hooks/useMembers';

export function MembersPage() {
  const { data: members, isLoading } = useMembers();

  if (isLoading) return <div>Loading...</div>;

  return <div>{/* render members */}</div>;
}
```

## Security Considerations

1. **Session Cookies**:
   - HTTP-only (not accessible via JavaScript)
   - Secure in production (HTTPS only)
   - 5-day expiration
   - SameSite: Lax

2. **Role-Based Access**:
   - Only `admin` and `super_admin` roles can log in
   - Verified on both client and server

3. **API Protection**:
   - All API routes (except auth) require valid session
   - Middleware validates session cookies
   - Firebase Admin SDK verifies tokens

4. **Token Revocation**:
   - Refresh tokens revoked on logout
   - Sessions invalidated server-side

## Next Steps

### Updating Existing Components
1. Replace direct Firestore calls with API hooks
2. Update forms to use mutation hooks
3. Add loading and error states
4. Implement optimistic updates where needed

### Adding More API Routes
Follow the same pattern:

1. Create API route in `src/app/api/`
2. Create service function in `src/services/api/`
3. Create React Query hook in `src/hooks/`
4. Use hook in components

### Data Seeding
You can still use the existing bulk upload routes:
- `/api/members-bulk-upload` - Upload members from CSV
- `/api/sync-children` - Sync children data
- `/api/init-collections` - Initialize bands and departments

These routes work with the new system and use Firebase Admin SDK.

## Troubleshooting

### Login Issues
- Verify user exists in Firestore members collection
- Check user has `role: 'admin'` or `role: 'super_admin'`
- Ensure Firebase credentials are correct in `.env.local`
- Check browser console for errors

### API Errors
- Check Network tab in browser dev tools
- Verify session cookie is being sent
- Check server console for Firebase Admin errors
- Ensure Firestore indexes are created if needed

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Check TypeScript errors with `npm run lint`
- Clear `.next` cache and rebuild

## Environment Variables Required

```env
# Firebase Client (NEXT_PUBLIC_*)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Firebase Admin
GOOGLE_CLIENT_EMAIL=
GOOGLE_PRIVATE_KEY=
```

## Summary

The VOM Admin Panel now:
- ✅ Uses Firebase Admin SDK for server-side operations
- ✅ Has complete authentication system with session management
- ✅ Provides RESTful API routes for all data operations
- ✅ Includes React Query hooks for easy data fetching
- ✅ Supports CSV export functionality
- ✅ Protects all routes with middleware
- ✅ Shows user info and logout in header
- ✅ Ready for production use

All data now flows through secure API routes instead of direct Firestore calls from the client!
