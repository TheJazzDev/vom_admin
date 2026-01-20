import { type NextRequest, NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase-admin";
import { checkNotificationReceipts } from "@/services/notifications/expoClient";

export const dynamic = "force-dynamic";

/**
 * Check delivery receipts for sent notifications
 * GET /api/notifications/check-receipts?notificationId=xxx
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const notificationId = searchParams.get("notificationId");

    if (!notificationId) {
      return NextResponse.json(
        { success: false, error: "Missing notificationId parameter" },
        { status: 400 },
      );
    }

    // Get notification logs with ticket IDs
    const db = getAdminFirestore();
    const logsSnapshot = await db
      .collection("notificationLogs")
      .where("notificationId", "==", notificationId)
      .get();

    if (logsSnapshot.empty) {
      return NextResponse.json(
        { success: false, error: "No logs found for this notification" },
        { status: 404 },
      );
    }

    const logs = logsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Extract ticket IDs
    const ticketIds = logs
      .filter((log: any) => log.ticket)
      .map((log: any) => log.ticket);

    console.log(`[CheckReceipts] Checking ${ticketIds.length} ticket IDs`);

    if (ticketIds.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No tickets to check",
        logs,
      });
    }

    // Check receipts from Expo
    const receipts = await checkNotificationReceipts(ticketIds);
    console.log("[CheckReceipts] Receipts:", JSON.stringify(receipts, null, 2));

    // Parse receipt results
    const receiptDetails = Object.entries(receipts).map(
      ([ticketId, receipt]: [string, any]) => {
        const log = logs.find((l: any) => l.ticket === ticketId) as any;
        return {
          ticketId,
          recipientName: log?.recipientName as string | undefined,
          status: receipt.status as string,
          message: receipt.message as string | undefined,
          details: receipt.details as any,
        };
      },
    );

    const delivered = receiptDetails.filter((r) => r.status === "ok").length;
    const failed = receiptDetails.filter((r) => r.status === "error").length;

    return NextResponse.json({
      success: true,
      summary: {
        total: receiptDetails.length,
        delivered,
        failed,
      },
      receipts: receiptDetails,
      logs,
    });
  } catch (error) {
    console.error("[CheckReceipts] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to check receipts",
      },
      { status: 500 },
    );
  }
}
