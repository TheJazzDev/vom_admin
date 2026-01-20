import { getAdminFirestore } from "@/lib/firebase-admin";
import { getAllMembers } from "@/services/members/memberService";
import { sendBatchPushNotifications } from "./expoClient";

const NOTIFICATIONS_COLLECTION = "notifications";
const NOTIFICATION_LOGS_COLLECTION = "notificationLogs";

/**
 * Get recipients based on target criteria
 */
export async function getRecipients(
  target: NotificationRecipient,
): Promise<UserProfile[]> {
  console.log("==== GETTING NOTIFICATION RECIPIENTS ====");
  console.log("[NotificationService] Target type:", target.type);

  const allMembers = await getAllMembers();
  console.log(
    `[NotificationService] Total members in database: ${allMembers.length}`,
  );

  let recipients: UserProfile[] = [];

  switch (target.type) {
    case "all":
      recipients = allMembers;
      break;

    case "members":
      recipients = allMembers.filter((m) => m.accountType === "member");
      break;

    case "guests":
      recipients = allMembers.filter((m) => m.accountType === "guest");
      break;

    case "band":
      if (target.bandKeys && target.bandKeys.length > 0) {
        recipients = allMembers.filter((m) =>
          m.bandKeys?.some((key: string) => target.bandKeys?.includes(key)),
        );
      }
      break;

    case "department":
      if (target.departmentKeys && target.departmentKeys.length > 0) {
        recipients = allMembers.filter((m) =>
          m.departmentKeys?.some((key: string) =>
            target.departmentKeys?.includes(key),
          ),
        );
      }
      break;

    case "custom":
      if (target.customIds && target.customIds.length > 0) {
        recipients = allMembers.filter((m) => target.customIds?.includes(m.id));
      }
      break;

    default:
      recipients = [];
  }

  console.log(
    `[NotificationService] Recipients after filter: ${recipients.length}`,
  );

  // Check how many have tokens
  const withTokens = recipients.filter((m) => m.expoPushToken);
  const withoutTokens = recipients.filter((m) => !m.expoPushToken);

  console.log(
    `[NotificationService] Recipients with push tokens: ${withTokens.length}`,
  );
  console.log(
    `[NotificationService] Recipients without push tokens: ${withoutTokens.length}`,
  );

  if (withTokens.length > 0) {
    console.log("[NotificationService] Sample recipient with token:", {
      id: withTokens[0].id,
      name: `${withTokens[0].firstName} ${withTokens[0].lastName}`,
      token: `${withTokens[0].expoPushToken?.substring(0, 30)}...`,
    });
  }

  if (withoutTokens.length > 0) {
    console.log(
      "[NotificationService] Sample recipients without tokens:",
      withoutTokens.slice(0, 3).map((m) => ({
        id: m.id,
        name: `${m.firstName} ${m.lastName}`,
        hasToken: !!m.expoPushToken,
      })),
    );
  }

  console.log("==== END GETTING RECIPIENTS ====");

  // Filter out members without push tokens
  return withTokens;
}

/**
 * Create a notification document
 */
export async function createNotification(
  data: Omit<NotificationData, "id" | "createdAt" | "deliveryStats">,
): Promise<string> {
  try {
    const db = getAdminFirestore();

    // Build notification object, filtering out undefined values
    const notification: Record<string, any> = {
      title: data.title,
      body: data.body,
      type: data.type,
      priority: data.priority,
      recipients: data.recipients,
      sentBy: data.sentBy,
      sentByName: data.sentByName,
      status: data.status,
      deliveryStats: {
        total: 0,
        sent: 0,
        failed: 0,
        received: 0,
      },
      createdAt: new Date().toISOString(),
    };

    // Only add optional fields if they have values (not undefined)
    if (data.data !== undefined) notification.data = data.data;
    if (data.imageUrl !== undefined) notification.imageUrl = data.imageUrl;
    if (data.route !== undefined) notification.route = data.route;
    if (data.sentAt !== undefined) notification.sentAt = data.sentAt;
    if (data.scheduledFor !== undefined)
      notification.scheduledFor = data.scheduledFor;
    if (data.updatedAt !== undefined) notification.updatedAt = data.updatedAt;

    const docRef = await db
      .collection(NOTIFICATIONS_COLLECTION)
      .add(notification);
    return docRef.id;
  } catch (error) {
    console.error("[NotificationService] Error creating notification:", error);
    throw new Error(
      `Failed to create notification: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Send notification to recipients
 */
export async function sendNotification(
  notificationId: string,
  recipients: UserProfile[],
  message: {
    title: string;
    body: string;
    data?: Record<string, any>;
    imageUrl?: string;
    priority?: NotificationPriority;
    channelId?: string;
  },
): Promise<{ sent: number; failed: number }> {
  try {
    const db = getAdminFirestore();
    const batch = db.batch();

    // Prepare push notification payloads
    const payloads = recipients.map((recipient) => ({
      to: recipient.expoPushToken as string,
      title: message.title,
      body: message.body,
      data: {
        ...message.data,
        notificationId,
      },
      priority:
        message.priority === "urgent"
          ? ("high" as const)
          : ("default" as const),
      channelId: message.channelId ?? "default",
    }));

    // Send batch notifications
    const result = await sendBatchPushNotifications(payloads);

    // Create notification logs
    const logsRef = db.collection(NOTIFICATION_LOGS_COLLECTION);
    const sentCount = result.tickets.filter((t) => t.status === "ok").length;
    const failedCount = result.tickets.filter(
      (t) => t.status === "error",
    ).length;

    const now = new Date().toISOString();

    for (let i = 0; i < recipients.length; i++) {
      const recipient = recipients[i];
      const ticket = result.tickets[i];

      // Build log object without undefined values
      const log: Record<string, any> = {
        notificationId,
        recipientId: recipient.id,
        recipientName: `${recipient.firstName} ${recipient.lastName}`,
        expoPushToken: recipient.expoPushToken as string,
        status: ticket?.status === "ok" ? "sent" : "failed",
        sentAt: now,
      };

      // Only add error field if there was an error
      if (ticket?.status === "error" && ticket.message) {
        log.error = ticket.message;
      }

      // Only add ticket ID if successful
      if (ticket?.status === "ok" && ticket.id) {
        log.ticket = ticket.id;
      }

      const logRef = logsRef.doc();
      batch.set(logRef, log);

      // Create individual notification document for mobile app to query
      // Mobile app expects notifications with userId or isGlobal fields
      const individualNotification: Record<string, any> = {
        type: message.data?.type || "announcement",
        title: message.title,
        message: message.body, // Mobile app uses "message" instead of "body"
        timestamp: now,
        createdAt: now,
        read: false,
        priority:
          message.priority === "urgent" ? "high" : message.priority || "medium",
        sender: message.data?.sentByName || "Admin",
        userId: recipient.id, // Critical: allows mobile app to query this notification
        isGlobal: false,
      };

      // Add optional fields
      if (message.data?.route) {
        individualNotification.actionRoute = message.data.route;
      }
      if (message.data?.referenceId) {
        individualNotification.referenceId = message.data.referenceId;
      }
      if (message.data?.referenceType) {
        individualNotification.referenceType = message.data.referenceType;
      }

      const individualNotifRef = db.collection(NOTIFICATIONS_COLLECTION).doc();
      batch.set(individualNotifRef, individualNotification);
    }

    // Update notification stats
    const notificationRef = db
      .collection(NOTIFICATIONS_COLLECTION)
      .doc(notificationId);
    batch.update(notificationRef, {
      status: "sent",
      sentAt: now,
      "deliveryStats.total": recipients.length,
      "deliveryStats.sent": sentCount,
      "deliveryStats.failed": failedCount,
    });

    await batch.commit();

    return { sent: sentCount, failed: failedCount };
  } catch (error) {
    console.error("[NotificationService] Error sending notification:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to send notification",
    );
  }
}

/**
 * Get all notifications (admin bulk notifications only, not individual user notifications)
 */
export async function getAllNotifications(): Promise<NotificationData[]> {
  try {
    const db = getAdminFirestore();
    const querySnapshot = await db
      .collection(NOTIFICATIONS_COLLECTION)
      .orderBy("createdAt", "desc")
      .get();

    // Filter to only include bulk notifications (those with recipients field)
    // Exclude individual user notifications (those with userId field)
    const notifications = querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter(
        (notification: any) => notification.recipients && !notification.userId,
      ) as NotificationData[];

    return notifications;
  } catch (error) {
    console.error("[NotificationService] Error fetching notifications:", error);
    throw new Error("Failed to fetch notifications");
  }
}

/**
 * Get notification by ID
 */
export async function getNotificationById(
  id: string,
): Promise<NotificationData | null> {
  try {
    const db = getAdminFirestore();
    const docSnap = await db.collection(NOTIFICATIONS_COLLECTION).doc(id).get();

    if (!docSnap.exists) {
      return null;
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as NotificationData;
  } catch (error) {
    console.error("[NotificationService] Error fetching notification:", error);
    throw new Error("Failed to fetch notification");
  }
}

/**
 * Get notification logs
 */
export async function getNotificationLogs(
  notificationId: string,
): Promise<NotificationLog[]> {
  try {
    const db = getAdminFirestore();
    const querySnapshot = await db
      .collection(NOTIFICATION_LOGS_COLLECTION)
      .where("notificationId", "==", notificationId)
      .get();

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as NotificationLog[];
  } catch (error) {
    console.error("[NotificationService] Error fetching logs:", error);
    throw new Error("Failed to fetch notification logs");
  }
}

/**
 * Delete notification
 */
export async function deleteNotification(id: string): Promise<void> {
  try {
    const db = getAdminFirestore();
    await db.collection(NOTIFICATIONS_COLLECTION).doc(id).delete();

    // Also delete associated logs
    const querySnapshot = await db
      .collection(NOTIFICATION_LOGS_COLLECTION)
      .where("notificationId", "==", id)
      .get();

    const batch = db.batch();
    querySnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  } catch (error) {
    console.error("[NotificationService] Error deleting notification:", error);
    throw new Error("Failed to delete notification");
  }
}

/**
 * Get notification statistics
 */
export async function getNotificationStats(): Promise<{
  total: number;
  sent: number;
  scheduled: number;
  failed: number;
  totalRecipients: number;
  successRate: number;
}> {
  try {
    const notifications = await getAllNotifications();

    const total = notifications.length;
    const sent = notifications.filter((n) => n.status === "sent").length;
    const scheduled = notifications.filter(
      (n) => n.status === "scheduled",
    ).length;
    const failed = notifications.filter((n) => n.status === "failed").length;

    const totalRecipients = notifications.reduce(
      (sum, n) => sum + n.deliveryStats.total,
      0,
    );
    const totalSent = notifications.reduce(
      (sum, n) => sum + n.deliveryStats.sent,
      0,
    );

    const successRate =
      totalRecipients > 0 ? (totalSent / totalRecipients) * 100 : 0;

    return {
      total,
      sent,
      scheduled,
      failed,
      totalRecipients,
      successRate: Math.round(successRate * 100) / 100,
    };
  } catch (error) {
    console.error("[NotificationService] Error getting stats:", error);
    return {
      total: 0,
      sent: 0,
      scheduled: 0,
      failed: 0,
      totalRecipients: 0,
      successRate: 0,
    };
  }
}

export default {
  getRecipients,
  createNotification,
  sendNotification,
  getAllNotifications,
  getNotificationById,
  getNotificationLogs,
  deleteNotification,
  getNotificationStats,
};
