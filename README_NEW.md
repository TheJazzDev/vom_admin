# VOM Admin Panel

> A secure, full-featured admin panel for managing church members, programmes, and directory information with Firebase backend and Next.js frontend.

## Features

### 🔐 Authentication & Security
- **Email/Password Authentication** via Firebase Auth
- **Role-based Access Control** (Admin, Super Admin)
- **Session Management** with HTTP-only cookies
- **Protected Routes** via Next.js middleware
- **Token Revocation** on logout
- **Server-side Validation** for all operations

### 👥 Member Management
- **CRUD Operations** for member records
- **Advanced Filtering** by status, band, department
- **CSV Export** functionality
- **Bulk Import** from CSV files
- **Real-time Statistics** dashboard
- **Birthday Tracking** and notifications

### 📅 Programme Management
- **Service Planning** (Sunday, Shilo, Vigil)
- **Status Tracking** (Upcoming, Past)
- **Type Filtering** and organization
- **Full CRUD** operations via API

### 📊 Directory Features
- **Band Management** with role assignments
- **Department Organization**
- **Ministry Tracking**
- **Member Statistics** with live calculations
- **Active/Inactive** status monitoring

### 🚀 Technical Features
- **Next.js 15** with App Router and Turbopack
- **Firebase Admin SDK** for secure server-side operations
- **React Query (TanStack Query)** for data management
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling
- **Responsive Design** mobile-friendly interface
- **Dark Mode Support** system-aware theming

## Tech Stack

### Frontend
- **Next.js 15.5.2** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Radix UI** - Accessible components
- **TanStack React Query** - Server state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Sonner** - Toast notifications

### Backend
- **Firebase Admin SDK** - Server-side Firebase operations
- **Firebase Auth** - Authentication
- **Firestore** - NoSQL database
- **Firebase Storage** - File storage
- **Next.js API Routes** - RESTful API

### Development
- **Biome** - Fast linter and formatter
- **Turbopack** - Fast bundler

## Project Structure

```
vom-admin/
├── src/
│   ├── app/
│   │   ├── api/                  # API routes
│   │   │   ├── auth/            # Authentication endpoints
│   │   │   ├── members/         # Member CRUD endpoints
│   │   │   ├── programmes/      # Programme CRUD endpoints
│   │   │   ├── export/          # Export endpoints
│   │   │   └── admin/           # Admin utilities
│   │   ├── login/               # Login page
│   │   ├── directory/           # Directory pages
│   │   ├── programmes/          # Programme pages
│   │   └── layout.tsx           # Root layout
│   ├── components/
│   │   ├── Directory/           # Directory components
│   │   ├── Programme/           # Programme components
│   │   ├── sidebar/             # Sidebar & header
│   │   └── ui/                  # Reusable UI components
│   ├── contexts/
│   │   └── AuthContext.tsx      # Authentication context
│   ├── hooks/
│   │   ├── useMembers.ts        # Member data hooks
│   │   └── useProgrammes.ts     # Programme data hooks
│   ├── services/
│   │   ├── api/                 # API client services
│   │   ├── members/             # Member business logic
│   │   └── programmes/          # Programme business logic
│   ├── lib/
│   │   └── firebase-admin.ts    # Firebase Admin SDK setup
│   ├── config/
│   │   └── firebase.ts          # Firebase client config
│   ├── enums/                   # Enums and constants
│   ├── constants/               # Configuration constants
│   └── middleware.ts            # Route protection
├── scripts/
│   └── create-admin.js          # Admin user setup script
├── SETUP_GUIDE.md               # Complete setup guide
├── IMPLEMENTATION_GUIDE.md      # Technical documentation
├── IMPLEMENTATION_SUMMARY.md    # Overview of changes
├── QUICK_START.md              # Quick reference guide
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- Firebase project with:
  - Firestore Database
  - Firebase Authentication
  - Firebase Storage
  - Service Account credentials

### Installation

1. **Clone and install dependencies**

```bash
npm install
```

2. **Set up environment variables**

Create `.env.local` in the project root:

```env
# Firebase Client
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

3. **Start the development server**

```bash
npm run dev
```

4. **Create your first admin user**

```bash
# Option 1: Using the helper script
node scripts/create-admin.js your-email@example.com admin

# Option 2: Using the API
curl -X POST http://localhost:3000/api/admin/set-admin-role \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com","role":"admin"}'
```

5. **Log in**

Navigate to `http://localhost:3000` and log in with your admin credentials.

For detailed setup instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)

## Quick Start

### Fetching Data

```typescript
import { useMembers } from '@/hooks/useMembers';

function MembersList() {
  const { data: members, isLoading } = useMembers();

  if (isLoading) return <div>Loading...</div>;

  return <div>{members?.map(m => m.firstName)}</div>;
}
```

### Creating Data

```typescript
import { useCreateMember } from '@/hooks/useMembers';

function CreateButton() {
  const createMember = useCreateMember();

  const handleCreate = () => {
    createMember.mutate({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      // ... other fields
    });
  };

  return <button onClick={handleCreate}>Create</button>;
}
```

### Exporting Data

```typescript
import { useExportMembers } from '@/hooks/useMembers';

function ExportButton() {
  const exportMembers = useExportMembers();

  return (
    <button onClick={() => exportMembers.mutate({})}>
      Export to CSV
    </button>
  );
}
```

For more examples, see [QUICK_START.md](./QUICK_START.md)

## API Documentation

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Create session (requires Firebase ID token) |
| POST | `/api/auth/logout` | Clear session and revoke tokens |
| GET | `/api/auth/session` | Verify current session |

### Members

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/members` | List all members (supports filtering) |
| GET | `/api/members/[id]` | Get single member |
| POST | `/api/members` | Create new member |
| PATCH | `/api/members/[id]` | Update member |
| DELETE | `/api/members/[id]` | Delete member |

### Programmes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/programmes` | List all programmes (supports filtering) |
| GET | `/api/programmes/[id]` | Get single programme |
| POST | `/api/programmes` | Create new programme |
| PATCH | `/api/programmes/[id]` | Update programme |
| DELETE | `/api/programmes/[id]` | Delete programme |

### Export

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/export/members` | Export members to CSV |

For complete API documentation, see [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)

## Authentication Flow

```
1. User enters email/password on /login page
   ↓
2. Client calls Firebase Auth signInWithEmailAndPassword()
   ↓
3. Firebase returns ID token
   ↓
4. Client sends ID token to POST /api/auth/login
   ↓
5. Server verifies token with Firebase Admin SDK
   ↓
6. Server checks user role in Firestore
   ↓
7. If admin/super_admin: Create session cookie (5-day expiry)
   ↓
8. Return user data to client
   ↓
9. Middleware validates session on all subsequent requests
```

## Data Flow

```
Client Component
   ↓
React Query Hook (useMembers, etc.)
   ↓
API Service (membersApi.ts)
   ↓
API Route (/api/members)
   ↓
Firebase Admin SDK
   ↓
Firestore Database
```

## Security Features

### 🛡️ Route Protection
- All routes except `/login` require authentication
- Middleware checks session cookies on every request
- Automatic redirect to login for unauthenticated users

### 🔑 Role-Based Access
- Only users with `role: 'admin'` or `role: 'super_admin'` can access
- Role checked on login and stored in session
- Server-side validation on all API routes

### 🍪 Secure Cookies
- HTTP-only (not accessible via JavaScript)
- Secure flag in production (HTTPS only)
- SameSite: Lax (CSRF protection)
- 5-day expiration

### 🔥 Firebase Admin SDK
- All data operations server-side
- No client-side Firestore credentials exposed
- Admin-level access control

## Available Scripts

```bash
# Development
npm run dev          # Start dev server with Turbopack

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run Biome linter
npm run format       # Format code with Biome

# Utilities
node scripts/create-admin.js <email> [role]  # Create admin user
```

## Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete setup instructions
- **[QUICK_START.md](./QUICK_START.md)** - Quick reference and examples
- **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Technical documentation
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Overview of features

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Works with any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render
- Self-hosted with Docker

**Important**: Remember to:
- Set all environment variables
- Disable/protect the `/api/admin/set-admin-role` endpoint
- Update Firestore security rules
- Use HTTPS in production

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for production deployment checklist.

## Roadmap

- [ ] Add more export formats (PDF, Excel)
- [ ] Implement audit logging
- [ ] Add email notifications
- [ ] Create mobile app version
- [ ] Add multi-language support
- [ ] Implement advanced reporting
- [ ] Add data visualization dashboards
- [ ] Create public-facing member directory

## Contributing

This is a custom application for Valley of Mercy church. If you'd like to use it for your organization, feel free to fork and modify as needed.

## License

Private - All rights reserved

## Support

For issues or questions:
1. Check the documentation files
2. Review the troubleshooting section in [SETUP_GUIDE.md](./SETUP_GUIDE.md)
3. Check browser and server console for errors
4. Verify Firebase configuration

---

**Built with ❤️ for Valley of Mercy Church**
