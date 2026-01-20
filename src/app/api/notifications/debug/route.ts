import { NextResponse } from "next/server";
import { getAllMembers } from "@/services/members/memberService";

export const dynamic = "force-dynamic";

/**
 * Debug endpoint to check push token registration status
 * GET /api/notifications/debug
 *
 * Returns statistics about which users have push tokens registered
 */
export async function GET() {
  try {
    const allMembers = await getAllMembers();

    const stats = {
      total: allMembers.length,
      withTokens: 0,
      withoutTokens: 0,
      members: allMembers,
      tokenStatus: [] as Array<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        accountType: string;
        hasToken: boolean;
        token: string | null;
        lastTokenUpdate: any;
      }>,
    };

    stats.tokenStatus = allMembers.map((member) => ({
      id: member.id,
      firstName: member.firstName || "Unknown",
      lastName: member.lastName || "",
      email: member.email || "No email",
      accountType: member.accountType || "unknown",
      hasToken: !!member.expoPushToken,
      token: member.expoPushToken || null,
      lastTokenUpdate: member.lastTokenUpdate || null,
    }));

    stats.withTokens = stats.tokenStatus.filter((m) => m.hasToken).length;
    stats.withoutTokens = stats.tokenStatus.filter((m) => !m.hasToken).length;

    return NextResponse.json({
      success: true,
      stats: {
        total: stats.total,
        withTokens: stats.withTokens,
        withoutTokens: stats.withoutTokens,
      },
      tokenStatus: stats.tokenStatus,
    });
  } catch (error) {
    console.error("[Debug] Error fetching token status:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch token status",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
