# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VOM Admin is a Next.js 15 church administration application for managing members, bands, departments, and church programmes. It uses Firebase for backend services (Firestore, Authentication, Storage) and Tailwind CSS v4 for styling.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application with Turbopack
- `npm run start` - Start production server
- `npm run format` - Format code with Biome
- `npm run lint` - Lint and auto-fix code with Biome (includes unsafe fixes)

### Environment Setup
- Create `.env.local` with Firebase configuration variables:
  - `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - `NEXT_PUBLIC_FIREBASE_APP_ID`
  - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

## Architecture

### Tech Stack
- **Framework**: Next.js 15 (App Router) with TypeScript
- **Styling**: Tailwind CSS v4
- **Backend**: Firebase (Firestore, Auth, Storage)
- **Forms**: React Hook Form + Zod validation
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **UI Components**: Radix UI primitives + custom components
- **Code Quality**: Biome (linting + formatting)

### Project Structure

```
src/
├── app/                      # Next.js App Router pages and API routes
│   ├── api/                  # API route handlers
│   │   ├── sync-children/    # Google Sheets sync endpoint
│   │   ├── members-bulk-upload/ # CSV bulk upload endpoint
│   │   ├── update-bands/     # Band sync endpoint
│   │   └── update-departments/ # Department sync endpoint
│   ├── directory/            # Member and band management pages
│   │   ├── members/          # Member listing and creation
│   │   └── bands/            # Band listing and details
│   └── programmes/           # Programme management pages
│       ├── create/           # Create new programme
│       ├── edit/             # Edit programme
│       ├── drafts/           # Draft programmes
│       ├── upcoming/         # Upcoming programmes
│       └── past/             # Past programmes
├── components/
│   ├── Directory/            # Directory feature components
│   │   ├── Members/          # Member management components
│   │   │   ├── Create/       # Member creation form components
│   │   │   ├── Edit/         # Member editing form components
│   │   │   ├── Components/   # Reusable member field components
│   │   │   ├── Schemas/      # Zod validation schemas
│   │   │   ├── Table/        # Member table with filters and columns
│   │   │   └── utils/        # Member-related utilities
│   │   └── Bands/            # Band management components
│   ├── Programme/            # Programme feature components
│   ├── sidebar/              # Sidebar navigation components
│   └── ui/                   # Reusable UI primitives (shadcn-based)
├── services/                 # Firebase service layer
│   ├── members/              # Member CRUD operations
│   ├── bands/                # Band operations and sync
│   ├── children/             # Children ministry operations
│   ├── departments/          # Department operations
│   ├── programmeService.ts   # Programme CRUD operations
│   ├── collectionsSetup.ts   # Firestore collection initialization
│   └── notifications.ts      # Notification service
├── config/
│   ├── firebase.ts           # Firebase app initialization
│   └── collectionRefs.ts     # Firestore collection references
├── enums/
│   ├── bands.ts              # Band role and key enums
│   ├── department.ts         # Department key and role enums
│   └── ministry.ts           # Ministry enums
├── stores/
│   └── adminStore.ts         # Zustand store for admin state
├── hooks/                    # Custom React hooks
├── utils/                    # Utility functions
└── constants/                # Static configuration constants

@types/
└── user.d.ts                 # Global TypeScript type definitions
```

### Key Architectural Patterns

#### Firebase Collections Structure
- `members` - Church member profiles with bands, departments, ministries
- `bands` - Band information (Choir, Love Divine, Daniel, Deborah, etc.)
- `children` - Children ministry data (synced from Google Sheets)
- `departments` - Department information (Media, Programme, IT, etc.)
- `programmes` - Church service programmes (upcoming, past, drafts)
- `guests` - Guest records
- `notifications` - System notifications

#### Data Flow Pattern
1. **Services Layer** (`src/services/`) - Handles all Firebase operations
   - Direct Firestore queries and mutations
   - Data transformation functions (e.g., `transformFirestoreDoc`)
   - File upload/delete operations with Storage

2. **Components** - Use TanStack Query hooks to call services
   - Mutations for create/update/delete operations
   - Queries for data fetching with caching
   - Form components use React Hook Form + Zod schemas

3. **State Management**
   - Local component state for UI
   - Zustand for global admin state
   - TanStack Query for server state

#### Form Validation Pattern
Forms use a three-schema approach in `src/components/Directory/Members/Schemas/`:
- `createMemberSchema.ts` - For creating new members (excludes auto-generated fields)
- `tableSchema.ts` - Full schema with all fields including generated ones
- `shared.ts` - Common field schemas reused across forms

#### Type Definitions
Global types defined in `@types/user.d.ts`:
- `UserProfile` - Inferred from Zod schema
- `Gender`, `AuthType`, `AccountType`, `Role`, `MaritalStatus`, `Ministry`

### Component Organization

Components are organized by feature, not by type. Each feature folder contains:
- Main page component
- Sub-components specific to that feature
- Schemas for validation
- Utils specific to that feature
- Table components (columns, filters) when applicable

Example: `src/components/Directory/Members/` contains everything member-related.

### Path Aliases
- `@/*` maps to `src/*` (configured in `tsconfig.json`)

## Important Notes

### Tailwind CSS v4 Specifics
When writing Tailwind classes, be aware of v4 changes:
- `flex-shrink-0` → `shrink-0`
- `bg-gradient-to-br` → `bg-linear-to-br`
Always verify class names match Tailwind v4 syntax

### File Organization
- Prefer splitting large files into smaller, more readable modules
- Keep components focused and single-purpose
- Separate concerns: forms, validation, data fetching, presentation

### Firebase Operations
- All Firebase operations go through the services layer
- Never call Firebase directly from components
- Use `transformFirestoreDoc` helper to convert Firestore docs to typed objects
- Collection refs are centralized in `src/config/collectionRefs.ts`

### Enum Usage
Key enums in `src/enums/`:
- `BandKeysEnum` - Band identifiers (CHOIR, LOVE_DIVINE, DANIEL, etc.)
- `BandRoleEnum` - Band roles (Captain, Vice Captain, Secretary, etc.)
- `DepartmentKeysEnum` - Department identifiers
- `DepartmentRoleEnum` - Department roles (Head, Assistant, Secretary, Member)

### API Routes
Located in `src/app/api/`:
- `sync-children/` - Syncs children data from Google Sheets
- `members-bulk-upload/` - Handles CSV uploads for bulk member creation
- `update-bands/` - Syncs band data
- `update-departments/` - Syncs department data
- `init-collections/` - Initializes Firestore collections

### Member Management
Members have complex relationships:
- Can belong to multiple bands with different roles
- Can belong to multiple departments with different roles
- Can belong to multiple ministries
- Have verification states (verified, emailVerified, phoneVerified)
- Have status (active/inactive)

## Common Patterns

### Creating a New Feature
1. Create feature folder under `src/components/[FeatureArea]/`
2. Add service functions in `src/services/`
3. Create Zod schemas if forms are needed
4. Add page in `src/app/` using App Router
5. Use TanStack Query for data fetching
6. Keep components small and focused

### Adding a New Member Field
1. Update `@types/user.d.ts` if adding global type
2. Update schemas in `src/components/Directory/Members/Schemas/`
3. Update form components in `Create/` or `Edit/`
4. Update table columns if field should display in table
5. Update service layer to handle new field

### Working with Firebase Data
```typescript
// Import collection ref
import { membersRef } from "@/config/collectionRefs";

// Use in service
const querySnapshot = await getDocs(query(membersRef, orderBy("createdAt", "desc")));
const members = querySnapshot.docs.map(transformFirestoreDoc);
```
