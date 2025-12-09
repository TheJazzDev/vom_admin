import { NextResponse } from 'next/server';
import { getAdminFirestore } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

// GET /api/programmes - Fetch all programmes
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    const db = getAdminFirestore();
    let query = db.collection('programmes');

    // Apply filters if provided
    if (status) {
      query = query.where('status', '==', status) as any;
    }
    if (type) {
      query = query.where('type', '==', type) as any;
    }

    // Order by date
    query = query.orderBy('date', 'desc') as any;

    const snapshot = await query.get();
    const programmes: any[] = [];

    snapshot.forEach((doc) => {
      programmes.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return NextResponse.json({
      success: true,
      data: programmes,
      count: programmes.length,
    });
  } catch (error) {
    console.error('Error fetching programmes:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch programmes',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST /api/programmes - Create new programme
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getAdminFirestore();

    // Create programme document
    const programmeRef = db.collection('programmes').doc();
    const programmeData = {
      ...body,
      id: programmeRef.id,
      createdAt: new Date().toISOString(),
      status: body.status || 'upcoming',
    };

    await programmeRef.set(programmeData);

    return NextResponse.json({
      success: true,
      data: programmeData,
      message: 'Programme created successfully',
    });
  } catch (error) {
    console.error('Error creating programme:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create programme',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
