import { type NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getUserDisplayName } from '@/lib/session';
import {
  createAttendanceRecord,
  getAttendanceRecords,
} from '@/services/attendance/attendanceService';

export const dynamic = 'force-dynamic';

/**
 * GET /api/attendance - Get all attendance records with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;
    const serviceType = searchParams.get('serviceType') as ServiceType | undefined;

    const records = await getAttendanceRecords({
      startDate,
      endDate,
      serviceType,
    });

    return NextResponse.json({
      success: true,
      records,
      count: records.length,
    });
  } catch (error) {
    console.error('[API /attendance] GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch attendance records',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/attendance - Create a new attendance record
 */
export async function POST(request: NextRequest) {
  try {
    // Get current authenticated user
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body: CreateAttendanceInput = await request.json();

    // Validate required fields
    if (!body.date || !body.serviceType || body.maleAdults === undefined || body.femaleAdults === undefined || body.children === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: date, serviceType, maleAdults, femaleAdults, children',
        },
        { status: 400 }
      );
    }

    // Validate numbers are non-negative
    if (body.maleAdults < 0 || body.femaleAdults < 0 || body.children < 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Attendance counts cannot be negative',
        },
        { status: 400 }
      );
    }

    const recordId = await createAttendanceRecord(body, {
      id: currentUser.id,
      name: getUserDisplayName(currentUser),
    });

    return NextResponse.json({
      success: true,
      recordId,
      message: 'Attendance record created successfully',
    });
  } catch (error) {
    console.error('[API /attendance] POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create attendance record',
      },
      { status: 500 }
    );
  }
}
