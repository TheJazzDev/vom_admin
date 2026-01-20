import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser, getUserDisplayName } from "@/lib/session";
import {
  createNotification,
  getRecipients,
  sendNotification,
} from "@/services/notifications/notificationService";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body: SendNotificationRequest = await request.json();

    // Get current authenticated user
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const senderName = getUserDisplayName(currentUser);

    // Validate required fields
    if (!body.title || !body.body || !body.recipients) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: title, body, recipients",
        },
        { status: 400 },
      );
    }

    // Get recipients based on target
    const recipients = await getRecipients(body.recipients);

    if (recipients.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No recipients found with push notification tokens",
        },
        { status: 400 },
      );
    }

    // Create notification document
    const notificationId = await createNotification({
      title: body.title,
      body: body.body,
      type: body.type,
      priority: body.priority ?? "normal",
      data: body.data,
      imageUrl: body.imageUrl,
      route: body.route,
      recipients: body.recipients,
      sentBy: currentUser.id,
      sentByName: senderName,
      status: body.scheduledFor ? "scheduled" : "sending",
      scheduledFor: body.scheduledFor,
    });

    // If scheduled, don't send immediately
    if (body.scheduledFor) {
      return NextResponse.json({
        success: true,
        notificationId,
        recipientCount: recipients.length,
        message: `Notification scheduled for ${new Date(body.scheduledFor).toLocaleString()}`,
      });
    }

    // Send notification immediately
    const result = await sendNotification(notificationId, recipients, {
      title: body.title,
      body: body.body,
      data: {
        ...body.data,
        type: body.type,
        route: body.route,
      },
      imageUrl: body.imageUrl,
      priority: body.priority,
      channelId: getChannelId(body.type),
    });

    return NextResponse.json({
      success: true,
      notificationId,
      recipientCount: recipients.length,
      sent: result.sent,
      failed: result.failed,
      message: `Notification sent to ${result.sent} recipients`,
    });
  } catch (error) {
    console.error("[API /notifications/send] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}

function getChannelId(type: NotificationType): string {
  switch (type) {
    case "announcement":
      return "announcements";
    case "prayer":
      return "prayers";
    case "programme":
    case "sermon":
      return "events";
    default:
      return "default";
  }
}
