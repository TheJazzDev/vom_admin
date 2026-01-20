import { type NextRequest, NextResponse } from "next/server";
import { getNotificationStats } from "@/services/notifications/notificationService";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest) {
  try {
    const stats = await getNotificationStats();

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("[API] Error fetching notification stats:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
