import { NextResponse } from 'next/server';
import { getAdminFirestore } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

// GET /api/members/[id] - Fetch single member
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getAdminFirestore();

    const memberDoc = await db.collection('members').doc(id).get();

    if (!memberDoc.exists) {
      return NextResponse.json(
        {
          success: false,
          error: 'Member not found',
        },
        { status: 404 }
      );
    }

    const member: UserProfile = {
      id: memberDoc.id,
      ...memberDoc.data(),
    } as UserProfile;

    return NextResponse.json({
      success: true,
      data: member,
    });
  } catch (error) {
    console.error('Error fetching member:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch member',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// PATCH /api/members/[id] - Update member
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = getAdminFirestore();

    const memberRef = db.collection('members').doc(id);
    const memberDoc = await memberRef.get();

    if (!memberDoc.exists) {
      return NextResponse.json(
        {
          success: false,
          error: 'Member not found',
        },
        { status: 404 }
      );
    }

    // Update member document
    await memberRef.update({
      ...body,
      updatedAt: new Date().toISOString(),
    });

    const updatedDoc = await memberRef.get();
    const updatedMember: UserProfile = {
      id: updatedDoc.id,
      ...updatedDoc.data(),
    } as UserProfile;

    return NextResponse.json({
      success: true,
      data: updatedMember,
      message: 'Member updated successfully',
    });
  } catch (error) {
    console.error('Error updating member:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update member',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/members/[id] - Delete member
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getAdminFirestore();

    const memberRef = db.collection('members').doc(id);
    const memberDoc = await memberRef.get();

    if (!memberDoc.exists) {
      return NextResponse.json(
        {
          success: false,
          error: 'Member not found',
        },
        { status: 404 }
      );
    }

    await memberRef.delete();

    return NextResponse.json({
      success: true,
      message: 'Member deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting member:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete member',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
