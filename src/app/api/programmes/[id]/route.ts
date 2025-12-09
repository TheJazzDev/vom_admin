import { NextResponse } from 'next/server';
import { getAdminFirestore } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

// GET /api/programmes/[id] - Fetch single programme
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getAdminFirestore();

    const programmeDoc = await db.collection('programmes').doc(id).get();

    if (!programmeDoc.exists) {
      return NextResponse.json(
        {
          success: false,
          error: 'Programme not found',
        },
        { status: 404 }
      );
    }

    const programme = {
      id: programmeDoc.id,
      ...programmeDoc.data(),
    };

    return NextResponse.json({
      success: true,
      data: programme,
    });
  } catch (error) {
    console.error('Error fetching programme:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch programme',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// PATCH /api/programmes/[id] - Update programme
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = getAdminFirestore();

    const programmeRef = db.collection('programmes').doc(id);
    const programmeDoc = await programmeRef.get();

    if (!programmeDoc.exists) {
      return NextResponse.json(
        {
          success: false,
          error: 'Programme not found',
        },
        { status: 404 }
      );
    }

    // Update programme document
    await programmeRef.update({
      ...body,
      updatedAt: new Date().toISOString(),
    });

    const updatedDoc = await programmeRef.get();
    const updatedProgramme = {
      id: updatedDoc.id,
      ...updatedDoc.data(),
    };

    return NextResponse.json({
      success: true,
      data: updatedProgramme,
      message: 'Programme updated successfully',
    });
  } catch (error) {
    console.error('Error updating programme:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update programme',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/programmes/[id] - Delete programme
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getAdminFirestore();

    const programmeRef = db.collection('programmes').doc(id);
    const programmeDoc = await programmeRef.get();

    if (!programmeDoc.exists) {
      return NextResponse.json(
        {
          success: false,
          error: 'Programme not found',
        },
        { status: 404 }
      );
    }

    await programmeRef.delete();

    return NextResponse.json({
      success: true,
      message: 'Programme deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting programme:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete programme',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
