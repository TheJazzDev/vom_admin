import { NextResponse } from 'next/server';
import { getAdminFirestore } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/set-admin-role
 *
 * This is a temporary route to help you set up your first admin user.
 *
 * Usage:
 * POST /api/admin/set-admin-role
 * Body: { "email": "user@example.com", "role": "admin" }
 *
 * SECURITY WARNING:
 * This route should be disabled or protected in production!
 * Only use it during initial setup.
 */
export async function POST(request: Request) {
  try {
    const { email, role } = await request.json();

    if (!email || !role) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email and role are required',
        },
        { status: 400 }
      );
    }

    // Validate role
    if (!['admin', 'super_admin', 'user'].includes(role)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid role. Must be "admin", "super_admin", or "user"',
        },
        { status: 400 }
      );
    }

    const db = getAdminFirestore();

    // Find user by email
    const usersSnapshot = await db
      .collection('members')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      return NextResponse.json(
        {
          success: false,
          error: `No user found with email: ${email}`,
        },
        { status: 404 }
      );
    }

    const userDoc = usersSnapshot.docs[0];
    const userId = userDoc.id;

    // Update user role
    await db.collection('members').doc(userId).update({
      role: role,
      updatedAt: new Date().toISOString(),
    });

    const updatedUser = (await db.collection('members').doc(userId).get()).data();

    return NextResponse.json({
      success: true,
      message: `User ${email} has been granted ${role} role`,
      user: {
        id: userId,
        email: updatedUser?.email,
        firstName: updatedUser?.firstName,
        lastName: updatedUser?.lastName,
        role: updatedUser?.role,
      },
    });
  } catch (error) {
    console.error('Error setting admin role:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to set admin role',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/set-admin-role
 *
 * Returns usage instructions
 */
export async function GET() {
  return NextResponse.json({
    message: 'Admin Role Setup Endpoint',
    description: 'Use this endpoint to grant admin roles to users',
    usage: {
      method: 'POST',
      endpoint: '/api/admin/set-admin-role',
      body: {
        email: 'user@example.com',
        role: 'admin', // or 'super_admin'
      },
    },
    example: `
curl -X POST http://localhost:3000/api/admin/set-admin-role \\
  -H "Content-Type: application/json" \\
  -d '{"email":"user@example.com","role":"admin"}'
    `,
    warning: 'This endpoint should be disabled or protected in production!',
  });
}
