# VOM Admin Panel - Complete Setup Guide

This guide will walk you through setting up your VOM Admin Panel from scratch to having your first admin user logged in.

## Prerequisites

- Node.js 18+ installed
- Firebase project created
- Firebase credentials in `.env.local`
- Members data in Firestore (or CSV ready to import)

## Step-by-Step Setup

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Verify Environment Variables

Make sure your `.env.local` file contains all required variables:

```env
# Firebase Client (NEXT_PUBLIC_*)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Firebase Admin
GOOGLE_CLIENT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Step 3: Start the Development Server

```bash
npm run dev
```

The server should start at `http://localhost:3000`

### Step 4: Initialize Collections (Optional)

If you haven't already set up your Firestore collections, visit:

```
http://localhost:3000/api/init-collections
```

This will create the `bands` and `departments` collections with default data.

### Step 5: Import Members Data (If Using CSV)

If you have member data in CSV format:

1. Place your CSV file at `src/app/api/data/data.csv`
2. Visit:

```
http://localhost:3000/api/members-bulk-upload
```

This will parse and import all members from the CSV into Firestore.

**Note**: Members imported from CSV will have `role: 'user'` by default. You'll need to promote at least one to admin.

### Step 6: Create Your First Admin User

You have three options to create an admin user:

#### Option A: Using the API Route (Recommended for Development)

Make a POST request to set a user as admin:

```bash
curl -X POST http://localhost:3000/api/admin/set-admin-role \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com","role":"admin"}'
```

#### Option B: Using the Helper Script

```bash
node scripts/create-admin.js your-email@example.com admin
```

Or for super admin:

```bash
node scripts/create-admin.js your-email@example.com super_admin
```

#### Option C: Manually in Firebase Console

1. Go to Firebase Console → Firestore Database
2. Navigate to the `members` collection
3. Find the user document (by email)
4. Edit the document
5. Add or update the `role` field to `'admin'` or `'super_admin'`
6. Save

### Step 7: Create Firebase Auth Account

Your admin user needs to have Firebase Authentication credentials:

#### If User Already Has Firebase Auth:
Skip to Step 8

#### If User Doesn't Have Firebase Auth:
You can create it through:

**Option A: Firebase Console**
1. Go to Firebase Console → Authentication
2. Click "Add user"
3. Enter the same email as in Firestore
4. Set a password
5. Click "Add user"

**Option B: Programmatically (if you have Firebase Admin SDK access)**
```javascript
// This is just an example - you'd run this in a Node.js script
const { getAuth } = require('firebase-admin/auth');

await getAuth().createUser({
  email: 'your-email@example.com',
  password: 'secure-password-here',
});
```

### Step 8: Verify Admin Setup

To verify your admin user is set up correctly:

1. Make a GET request to check the setup endpoint:

```bash
curl http://localhost:3000/api/admin/set-admin-role
```

2. Or visit the members API to see if data loads:

```bash
curl http://localhost:3000/api/members
```

### Step 9: Log In!

1. Navigate to `http://localhost:3000`
2. You should be redirected to `http://localhost:3000/login`
3. Enter your admin email and password
4. Click "Sign In"
5. You should be redirected to the dashboard!

---

## Troubleshooting Common Issues

### "No session found" Error

**Problem**: Session cookie not being set

**Solutions**:
- Clear your browser cookies
- Make sure you're using the correct email/password
- Check browser console for errors
- Verify Firebase credentials in `.env.local`

### "Access denied. Admin privileges required"

**Problem**: User doesn't have admin role in Firestore

**Solutions**:
1. Double-check the user's role in Firestore:
   ```bash
   curl http://localhost:3000/api/admin/set-admin-role \
     -X POST \
     -H "Content-Type: application/json" \
     -d '{"email":"your-email@example.com","role":"admin"}'
   ```
2. Verify the email matches exactly (case-sensitive)
3. Make sure the Firestore document has `role: 'admin'` or `role: 'super_admin'`

### "User not found" Error

**Problem**: User doesn't exist in Firestore

**Solutions**:
1. Import members from CSV (see Step 5)
2. Or manually create a user in Firestore with this structure:

```json
{
  "id": "unique-id",
  "uid": "",
  "firstName": "John",
  "lastName": "Doe",
  "email": "admin@example.com",
  "role": "admin",
  "status": "active",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "verified": true,
  "emailVerified": true,
  // ... other required fields
}
```

### Firebase Admin SDK Errors

**Problem**: Missing or invalid credentials

**Solutions**:
1. Verify `GOOGLE_PRIVATE_KEY` in `.env.local` is properly formatted with `\n` for newlines
2. Ensure `GOOGLE_CLIENT_EMAIL` matches your service account
3. Check `NEXT_PUBLIC_FIREBASE_PROJECT_ID` is correct
4. Restart the dev server after changing `.env.local`

### "Failed to fetch members" Error

**Problem**: API route can't access Firestore

**Solutions**:
1. Check server console for detailed error messages
2. Verify Firebase credentials
3. Ensure Firestore database exists and has data
4. Check Firestore security rules allow admin SDK access

### Build Errors

**Problem**: TypeScript or compilation errors

**Solutions**:
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run dev
```

### Login Page Shows Blank or Errors

**Problem**: Client-side rendering issues

**Solutions**:
1. Check browser console for errors
2. Verify all dependencies are installed
3. Clear browser cache
4. Try in incognito/private window

---

## Security Checklist for Production

Before deploying to production, make sure to:

- [ ] **Disable or remove** the `/api/admin/set-admin-role` endpoint
- [ ] **Set proper Firestore security rules** to prevent unauthorized access
- [ ] **Enable Firebase App Check** for additional security
- [ ] **Use HTTPS only** (secure cookies won't work on HTTP in production)
- [ ] **Set up proper error logging** and monitoring
- [ ] **Review all admin users** and remove any test accounts
- [ ] **Rotate Firebase credentials** if they were exposed during development
- [ ] **Enable two-factor authentication** for admin Firebase accounts
- [ ] **Set up regular backups** of Firestore data
- [ ] **Implement rate limiting** on API routes
- [ ] **Add audit logging** for admin actions

---

## Production Deployment Checklist

### 1. Environment Variables

Set these in your production environment (Vercel, Netlify, etc.):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
GOOGLE_CLIENT_EMAIL=...
GOOGLE_PRIVATE_KEY=...
```

### 2. Firestore Security Rules

Update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only allow Firebase Admin SDK (server-side) access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

Since all data access goes through your API routes with Firebase Admin SDK, you can lock down client-side access completely.

### 3. Disable Admin Setup Route

In production, either:

**Option A**: Delete the file
```bash
rm src/app/api/admin/set-admin-role/route.ts
```

**Option B**: Add environment check
```typescript
// In src/app/api/admin/set-admin-role/route.ts
export async function POST(request: Request) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { success: false, error: 'This endpoint is disabled in production' },
      { status: 403 }
    );
  }
  // ... rest of the code
}
```

### 4. Build and Deploy

```bash
npm run build
```

Verify the build completes successfully, then deploy to your hosting platform.

---

## Quick Reference: API Endpoints

### Authentication
- `POST /api/auth/login` - Sign in
- `POST /api/auth/logout` - Sign out
- `GET /api/auth/session` - Check session

### Members
- `GET /api/members` - List all members
- `GET /api/members/[id]` - Get one member
- `POST /api/members` - Create member
- `PATCH /api/members/[id]` - Update member
- `DELETE /api/members/[id]` - Delete member

### Programmes
- `GET /api/programmes` - List all programmes
- `GET /api/programmes/[id]` - Get one programme
- `POST /api/programmes` - Create programme
- `PATCH /api/programmes/[id]` - Update programme
- `DELETE /api/programmes/[id]` - Delete programme

### Export
- `GET /api/export/members` - Export members to CSV

### Admin (Development Only)
- `POST /api/admin/set-admin-role` - Grant admin role to user

### Utilities
- `GET /api/init-collections` - Initialize bands/departments
- `GET /api/members-bulk-upload` - Import members from CSV

---

## Next Steps

Once you're logged in and everything is working:

1. **Explore the dashboard** - View members, stats, etc.
2. **Test the export** - Click "Export" button on members page
3. **Create a new member** - Click "Add Member" and fill out the form
4. **Update existing components** - Migrate any remaining components to use the new API hooks
5. **Customize the UI** - Modify components to match your needs
6. **Add more features** - Build on top of the API infrastructure

---

## Support

If you run into issues:

1. Check the browser console for client-side errors
2. Check the server console (terminal) for API errors
3. Review the troubleshooting section above
4. Check Firebase Console for Firestore/Auth issues
5. Verify all environment variables are set correctly

---

## Summary

You should now have:
- ✅ A running Next.js application
- ✅ Firebase Admin SDK configured
- ✅ At least one admin user created
- ✅ Authentication working
- ✅ API routes serving real data from Firestore
- ✅ Export functionality working
- ✅ Protected routes with middleware

**Welcome to your VOM Admin Panel!** 🎉
