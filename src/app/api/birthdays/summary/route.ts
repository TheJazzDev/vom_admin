import { type NextRequest, NextResponse } from 'next/server';
import { getBirthdaySummary } from '@/services/birthday/birthdayService';

export const dynamic = 'force-dynamic';

/**
 * GET /api/birthdays/summary - Get birthday summary (today, upcoming, this month)
 */
export async function GET(request: NextRequest) {
  try {
    const summary = await getBirthdaySummary();

    return NextResponse.json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error('[API /birthdays/summary] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch birthday summary',
      },
      { status: 500 }
    );
  }
}
