# Quick Start Guide - VOM Admin Panel

## 🚀 Getting Started

### 1. Set Up Your First Admin User

Before you can log in, you need at least one user with admin privileges in Firestore.

**Option A: Using Firebase Console**
1. Go to Firebase Console → Firestore Database
2. Navigate to the `members` collection
3. Find or create a user document
4. Set the `role` field to `'admin'` or `'super_admin'`
5. Ensure the user has email and can authenticate

**Option B: Using the bulk upload (if you haven't yet)**
1. Navigate to `http://localhost:3000/api/members-bulk-upload`
2. This will import members from your CSV
3. Then manually update one user's role to `admin` in Firestore

### 2. Run the Development Server

```bash
npm run dev
```

### 3. Access the Admin Panel

Navigate to `http://localhost:3000` - you'll be automatically redirected to `/login`

### 4. Log In

Enter your admin user's email and password. Only users with `role: 'admin'` or `role: 'super_admin'` can access.

---

## 📚 Common Code Patterns

### Fetching Data

```typescript
'use client';

import { useMembers } from '@/hooks/useMembers';

export function MembersList() {
  const { data: members, isLoading, error } = useMembers();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {members?.map(member => (
        <li key={member.id}>{member.firstName} {member.lastName}</li>
      ))}
    </ul>
  );
}
```

### Creating Data

```typescript
'use client';

import { useCreateMember } from '@/hooks/useMembers';
import { toast } from 'sonner';

export function CreateMemberButton() {
  const createMember = useCreateMember();

  const handleCreate = async () => {
    try {
      await createMember.mutateAsync({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        // ... other required fields
      });
      toast.success('Member created!');
    } catch (error) {
      toast.error('Failed to create member');
    }
  };

  return (
    <button onClick={handleCreate} disabled={createMember.isPending}>
      {createMember.isPending ? 'Creating...' : 'Create Member'}
    </button>
  );
}
```

### Updating Data

```typescript
'use client';

import { useUpdateMember } from '@/hooks/useMembers';

export function EditMemberButton({ memberId }) {
  const updateMember = useUpdateMember();

  const handleUpdate = async () => {
    await updateMember.mutateAsync({
      id: memberId,
      updates: {
        firstName: 'Jane',
        status: 'active',
      },
    });
  };

  return <button onClick={handleUpdate}>Update</button>;
}
```

### Filtering Data

```typescript
'use client';

import { useMembers } from '@/hooks/useMembers';

export function ActiveMembers() {
  // Fetch only active members
  const { data: activeMembers } = useMembers({ status: 'active' });

  // Fetch members in a specific band
  const { data: choirMembers } = useMembers({ band: 'CHOIR' });

  // Fetch members in a specific department
  const { data: mediaTeam } = useMembers({ department: 'MEDIA' });

  return <div>{/* render filtered members */}</div>;
}
```

### Exporting to CSV

```typescript
'use client';

import { useExportMembers } from '@/hooks/useMembers';
import { Button } from '@/components/ui/button';

export function ExportButton() {
  const exportMembers = useExportMembers();

  const handleExport = () => {
    // Export all members
    exportMembers.mutate({});

    // Or export with filters
    exportMembers.mutate({
      status: 'active',
      band: 'CHOIR'
    });
  };

  return (
    <Button onClick={handleExport} disabled={exportMembers.isPending}>
      {exportMembers.isPending ? 'Exporting...' : 'Export to CSV'}
    </Button>
  );
}
```

### Using Auth Context

```typescript
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export function UserProfile() {
  const { user, isAdmin, logout, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not logged in</div>;

  return (
    <div>
      <h1>Welcome, {user.firstName} {user.lastName}</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      {isAdmin && <p>You have admin access!</p>}
      <Button onClick={logout}>Logout</Button>
    </div>
  );
}
```

### Protecting Components

```typescript
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function AdminOnlyComponent() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/');
    }
  }, [isAdmin, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!isAdmin) return null;

  return <div>Admin-only content</div>;
}
```

---

## 🔑 API Endpoints Reference

### Authentication
- `POST /api/auth/login` - Log in (requires idToken from Firebase Auth)
- `POST /api/auth/logout` - Log out
- `GET /api/auth/session` - Check current session

### Members
- `GET /api/members` - List all members
- `GET /api/members?status=active` - Filter by status
- `GET /api/members?band=CHOIR` - Filter by band
- `GET /api/members?department=MEDIA` - Filter by department
- `GET /api/members/[id]` - Get single member
- `POST /api/members` - Create member
- `PATCH /api/members/[id]` - Update member
- `DELETE /api/members/[id]` - Delete member

### Programmes
- `GET /api/programmes` - List all programmes
- `GET /api/programmes?status=upcoming` - Filter by status
- `GET /api/programmes?type=sunday` - Filter by type
- `GET /api/programmes/[id]` - Get single programme
- `POST /api/programmes` - Create programme
- `PATCH /api/programmes/[id]` - Update programme
- `DELETE /api/programmes/[id]` - Delete programme

### Export
- `GET /api/export/members` - Export members to CSV
- `GET /api/export/members?status=active` - Export with filters

---

## ⚠️ Common Issues & Solutions

### "No session found" Error
**Problem**: User is not authenticated
**Solution**: Navigate to `/login` and sign in with admin credentials

### "Access denied. Admin privileges required"
**Problem**: User doesn't have admin role
**Solution**: Update user's `role` field in Firestore to `'admin'` or `'super_admin'`

### "Failed to fetch members"
**Problem**: Session expired or API error
**Solution**: Log out and log back in, or check server console for errors

### Build Errors
**Problem**: TypeScript or compilation errors
**Solution**:
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run dev
```

### Firebase Admin SDK Errors
**Problem**: Missing or invalid credentials
**Solution**: Check `.env.local` file has all required variables:
```env
GOOGLE_CLIENT_EMAIL=...
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
```

---

## 📋 Checklist for Production

Before deploying to production:

- [ ] Update all users' roles in Firestore (assign admin roles)
- [ ] Test login/logout flow
- [ ] Test all CRUD operations (Create, Read, Update, Delete)
- [ ] Test export functionality
- [ ] Verify session expiration works (5 days)
- [ ] Test on different browsers
- [ ] Check mobile responsiveness
- [ ] Set up proper Firebase security rules
- [ ] Enable Firebase App Check for additional security
- [ ] Set up logging and monitoring
- [ ] Configure proper error handling
- [ ] Test with production Firebase credentials

---

## 🎯 Next Steps

1. **Migrate existing components** from direct Firestore calls to API hooks
2. **Test all features** thoroughly
3. **Add loading states** to improve UX
4. **Implement optimistic updates** for instant feedback
5. **Add error boundaries** for better error handling
6. **Set up proper logging** for debugging
7. **Add unit and integration tests**
8. **Configure CI/CD pipeline**

---

## 📖 Additional Resources

- **IMPLEMENTATION_GUIDE.md** - Detailed technical documentation
- **IMPLEMENTATION_SUMMARY.md** - Overview of what was implemented
- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [React Query Documentation](https://tanstack.com/query/latest/docs/react/overview)

---

## 🆘 Need Help?

If you encounter issues:
1. Check the browser console for errors
2. Check the server console for API errors
3. Verify Firebase credentials in `.env.local`
4. Ensure Firestore has correct data structure
5. Verify user has admin role in Firestore

## Summary

You now have a fully functional, secure admin panel with:
- 🔐 Authentication system
- 🛡️ Role-based access control
- 🔥 Firebase Admin SDK integration
- 📡 RESTful API routes
- 🪝 React Query hooks
- 📊 CSV export functionality
- 🎨 Professional UI

**Happy coding!** 🚀
