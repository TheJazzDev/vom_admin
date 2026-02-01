import { type NextRequest, NextResponse } from 'next/server';
import { getAttendanceStats } from '@/services/attendance/attendanceService';

export const dynamic = 'force-dynamic';

/**
 * GET /api/attendance/stats - Get attendance statistics
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;
    const serviceType = searchParams.get('serviceType') as ServiceType | undefined;

    const stats = await getAttendanceStats({
      startDate,
      endDate,
      serviceType,
    });

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('[API /attendance/stats] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch attendance statistics',
      },
      { status: 500 }
    );
  }
}
