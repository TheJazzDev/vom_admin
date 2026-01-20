import {
  Expo,
  type ExpoPushMessage,
  type ExpoPushTicket,
} from "expo-server-sdk";

// Create Expo SDK client
const expo = new Expo({
  accessToken: process.env.EXPO_ACCESS_TOKEN,
  useFcmV1: true, // Use FCM v1 API
});

export interface PushNotificationPayload {
  to: string; // Expo push token
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: "default" | null;
  badge?: number;
  priority?: "default" | "normal" | "high";
  channelId?: string;
  categoryId?: string;
  mutableContent?: boolean;
}

/**
 * Send a single push notification
 */
export async function sendPushNotification(
  payload: PushNotificationPayload,
): Promise<{ success: boolean; ticket?: ExpoPushTicket; error?: string }> {
  try {
    // Validate push token
    if (!Expo.isExpoPushToken(payload.to)) {
      return {
        success: false,
        error: `Invalid Expo push token: ${payload.to}`,
      };
    }

    // Build message
    const message: ExpoPushMessage = {
      to: payload.to,
      sound: payload.sound ?? "default",
      title: payload.title,
      body: payload.body,
      data: payload.data,
      badge: payload.badge,
      priority: payload.priority ?? "high",
      channelId: payload.channelId ?? "default",
      categoryId: payload.categoryId,
      mutableContent: payload.mutableContent ?? false,
    };

    // Send notification
    const chunks = expo.chunkPushNotifications([message]);
    const tickets: ExpoPushTicket[] = [];

    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error("[ExpoClient] Error sending chunk:", error);
        return {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to send notification",
        };
      }
    }

    const ticket = tickets[0];

    if (ticket.status === "error") {
      console.error("[ExpoClient] Notification error:", ticket.message);
      return {
        success: false,
        error: ticket.message,
        ticket,
      };
    }

    return {
      success: true,
      ticket,
    };
  } catch (error) {
    console.error("[ExpoClient] sendPushNotification error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send batch push notifications
 */
export async function sendBatchPushNotifications(
  payloads: PushNotificationPayload[],
): Promise<{
  success: boolean;
  tickets: ExpoPushTicket[];
  errors: string[];
}> {
  try {
    console.log("==== EXPO PUSH NOTIFICATION BATCH SEND ====");
    console.log(`[ExpoClient] Sending to ${payloads.length} recipients`);
    console.log(
      `[ExpoClient] Access token configured: ${!!process.env.EXPO_ACCESS_TOKEN}`,
    );

    const messages: ExpoPushMessage[] = [];
    const errors: string[] = [];

    // Validate and build messages
    for (const payload of payloads) {
      console.log(
        `[ExpoClient] Validating token: ${payload.to.substring(0, 30)}...`,
      );

      if (!Expo.isExpoPushToken(payload.to)) {
        const error = `Invalid Expo push token: ${payload.to}`;
        console.error(`[ExpoClient] ${error}`);
        errors.push(error);
        continue;
      }

      console.log(`[ExpoClient] ✓ Token valid, adding to batch`);
      messages.push({
        to: payload.to,
        sound: payload.sound ?? "default",
        title: payload.title,
        body: payload.body,
        data: payload.data,
        badge: payload.badge,
        priority: payload.priority ?? "high",
        channelId: payload.channelId ?? "default",
        categoryId: payload.categoryId,
        mutableContent: payload.mutableContent ?? false,
      });
    }

    if (messages.length === 0) {
      console.error("[ExpoClient] No valid messages to send");
      return {
        success: false,
        tickets: [],
        errors: ["No valid push tokens to send notifications to"],
      };
    }

    console.log(`[ExpoClient] Prepared ${messages.length} valid messages`);
    console.log(
      `[ExpoClient] Message sample:`,
      JSON.stringify(messages[0], null, 2),
    );

    // Send in chunks (Expo limits to 100 per request)
    const chunks = expo.chunkPushNotifications(messages);
    console.log(`[ExpoClient] Split into ${chunks.length} chunks`);

    const allTickets: ExpoPushTicket[] = [];

    for (const chunk of chunks) {
      try {
        console.log(
          `[ExpoClient] Sending chunk with ${chunk.length} messages...`,
        );
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(`[ExpoClient] Received ${ticketChunk.length} tickets`);
        console.log(
          `[ExpoClient] Tickets:`,
          JSON.stringify(ticketChunk, null, 2),
        );
        allTickets.push(...ticketChunk);
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Chunk send failed";
        console.error(`[ExpoClient] Chunk send error:`, error);
        errors.push(errorMsg);
      }
    }

    // Check for ticket errors
    for (const ticket of allTickets) {
      if (ticket.status === "error") {
        const errorMsg = ticket.message || "Unknown ticket error";
        console.error(`[ExpoClient] Ticket error:`, errorMsg, ticket);
        errors.push(errorMsg);
      } else if (ticket.status === "ok") {
        console.log(`[ExpoClient] ✓ Ticket OK: ${ticket.id}`);
      }
    }

    const successCount = allTickets.filter((t) => t.status === "ok").length;
    console.log(
      `[ExpoClient] Summary: ${successCount}/${allTickets.length} sent successfully`,
    );
    if (errors.length > 0) {
      console.error(`[ExpoClient] Errors:`, errors);
    }
    console.log("==== END EXPO PUSH NOTIFICATION BATCH ====");

    return {
      success: allTickets.length > 0,
      tickets: allTickets,
      errors,
    };
  } catch (error) {
    console.error("[ExpoClient] Critical error:", error);
    return {
      success: false,
      tickets: [],
      errors: [error instanceof Error ? error.message : "Batch send failed"],
    };
  }
}

/**
 * Check receipt status for sent notifications
 */
export async function checkNotificationReceipts(
  ticketIds: string[],
): Promise<Record<string, { status: string; message?: string }>> {
  try {
    const receiptIdChunks = expo.chunkPushNotificationReceiptIds(ticketIds);
    const receipts: Record<string, any> = {};

    for (const chunk of receiptIdChunks) {
      try {
        const receiptChunk = await expo.getPushNotificationReceiptsAsync(chunk);
        Object.assign(receipts, receiptChunk);
      } catch (error) {
        console.error("[ExpoClient] Error fetching receipts:", error);
      }
    }

    return receipts;
  } catch (error) {
    console.error("[ExpoClient] checkNotificationReceipts error:", error);
    return {};
  }
}

export default {
  sendPushNotification,
  sendBatchPushNotifications,
  checkNotificationReceipts,
};
