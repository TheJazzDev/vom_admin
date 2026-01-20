declare global {
  type NotificationType =
    | "announcement"
    | "programme"
    | "prayer"
    | "sermon"
    | "general";

  type NotificationPriority = "normal" | "high" | "urgent";

  type NotificationStatus =
    | "draft"
    | "scheduled"
    | "sending"
    | "sent"
    | "failed";

  type RecipientTarget =
    | "all"
    | "members"
    | "guests"
    | "band"
    | "department"
    | "custom";

  interface NotificationRecipient {
    type: RecipientTarget;
    bandKeys?: string[];
    departmentKeys?: string[];
    customIds?: string[];
  }

  interface NotificationData {
    id: string;
    title: string;
    body: string;
    type: NotificationType;
    priority: NotificationPriority;
    data?: Record<string, any>;
    imageUrl?: string;
    route?: string; // Deep link route
    recipients: NotificationRecipient;
    sentBy: string; // Admin user ID
    sentByName: string;
    sentAt?: string;
    scheduledFor?: string;
    status: NotificationStatus;
    deliveryStats: {
      total: number;
      sent: number;
      failed: number;
      received: number;
    };
    createdAt: string;
    updatedAt?: string;
  }

  interface NotificationLog {
    id: string;
    notificationId: string;
    recipientId: string;
    recipientName: string;
    expoPushToken: string;
    status: "pending" | "sent" | "failed" | "received";
    error?: string;
    sentAt?: string;
    receivedAt?: string;
    ticket?: string; // Expo push ticket ID
  }

  interface SendNotificationRequest {
    title: string;
    body: string;
    type: NotificationType;
    priority?: NotificationPriority;
    data?: Record<string, any>;
    imageUrl?: string;
    route?: string;
    recipients: NotificationRecipient;
    scheduledFor?: string;
  }

  interface SendNotificationResponse {
    success: boolean;
    notificationId?: string;
    recipientCount?: number;
    message?: string;
    error?: string;
  }
}

export {};
