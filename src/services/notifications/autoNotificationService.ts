/**
 * Automatic Notification Service
 *
 * Handles automatic notification triggers for various events like:
 * - Announcement creation
 * - Programme publishing
 * - Other automated notifications
 */

import {
  createNotification,
  getRecipients,
  sendNotification,
} from "./notificationService";

export interface AutoNotificationOptions {
  enabled?: boolean;
  priority?: NotificationPriority;
  target?: NotificationRecipient;
}

/**
 * Send notification when an announcement is created
 */
export async function notifyAnnouncementCreated(
  announcement: {
    id: string;
    title: string;
    content: string;
    type: string;
  },
  options: AutoNotificationOptions = {},
): Promise<void> {
  const {
    enabled = true,
    priority = "high",
    target = { type: "all" },
  } = options;

  if (!enabled) {
    console.log("[AutoNotification] Announcement notification disabled");
    return;
  }

  try {
    // Get recipients
    const recipients = await getRecipients(target);

    if (recipients.length === 0) {
      console.warn(
        "[AutoNotification] No recipients found for announcement notification",
      );
      return;
    }

    // Create notification record
    const notificationId = await createNotification({
      title: announcement.title,
      body: `New announcement: ${announcement.content.substring(0, 100)}...`,
      type: "announcement",
      priority,
      recipients: target,
      sentBy: "system",
      sentByName: "VOM Admin",
      status: "sending",
    });

    // Send push notifications
    await sendNotification(notificationId, recipients, {
      title: announcement.title,
      body: announcement.content.substring(0, 150),
      data: {
        type: "announcement",
        announcementId: announcement.id,
        route: `/(tabs)/home/announcement/${announcement.id}`,
      },
      priority,
    });

    console.log(
      `[AutoNotification] Announcement notification sent to ${recipients.length} recipients`,
    );
  } catch (error) {
    console.error(
      "[AutoNotification] Failed to send announcement notification:",
      error,
    );
    // Don't throw - notification failure shouldn't block announcement creation
  }
}

/**
 * Send notification when a programme is published
 */
export async function notifyProgrammePublished(
  programme: {
    id: string;
    title: string;
    date: string;
    type: string;
  },
  options: AutoNotificationOptions = {},
): Promise<void> {
  const {
    enabled = true,
    priority = "high",
    target = { type: "all" },
  } = options;

  if (!enabled) {
    console.log("[AutoNotification] Programme notification disabled");
    return;
  }

  try {
    // Get recipients
    const recipients = await getRecipients(target);

    if (recipients.length === 0) {
      console.warn(
        "[AutoNotification] No recipients found for programme notification",
      );
      return;
    }

    // Format date for notification
    const programmeDate = new Date(programme.date).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    // Create notification record
    const notificationId = await createNotification({
      title: `New Programme: ${programme.title}`,
      body: `${programme.type} programme scheduled for ${programmeDate}`,
      type: "programme",
      priority,
      recipients: target,
      sentBy: "system",
      sentByName: "VOM Admin",
      status: "sending",
    });

    // Send push notifications
    await sendNotification(notificationId, recipients, {
      title: `New Programme: ${programme.title}`,
      body: `${programme.type} on ${programmeDate}`,
      data: {
        type: "programme",
        programmeId: programme.id,
        route: `/(tabs)/ministry/programme/${programme.id}`,
      },
      priority,
      channelId: "events",
    });

    console.log(
      `[AutoNotification] Programme notification sent to ${recipients.length} recipients`,
    );
  } catch (error) {
    console.error(
      "[AutoNotification] Failed to send programme notification:",
      error,
    );
    // Don't throw - notification failure shouldn't block programme publishing
  }
}

/**
 * Send notification when a programme is updated
 * (Only if already published and significant changes made)
 */
export async function notifyProgrammeUpdated(
  programme: {
    id: string;
    title: string;
    date: string;
    type: string;
  },
  options: AutoNotificationOptions = {},
): Promise<void> {
  const {
    enabled = true,
    priority = "normal",
    target = { type: "all" },
  } = options;

  if (!enabled) {
    console.log("[AutoNotification] Programme update notification disabled");
    return;
  }

  try {
    const recipients = await getRecipients(target);

    if (recipients.length === 0) {
      console.warn(
        "[AutoNotification] No recipients found for programme update notification",
      );
      return;
    }

    const programmeDate = new Date(programme.date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    const notificationId = await createNotification({
      title: `Programme Updated: ${programme.title}`,
      body: `The ${programme.type} programme on ${programmeDate} has been updated`,
      type: "programme",
      priority,
      recipients: target,
      sentBy: "system",
      sentByName: "VOM Admin",
      status: "sending",
    });

    await sendNotification(notificationId, recipients, {
      title: `Programme Updated`,
      body: `${programme.title} on ${programmeDate} has been updated`,
      data: {
        type: "programme",
        programmeId: programme.id,
        route: `/(tabs)/ministry/programme/${programme.id}`,
      },
      priority,
      channelId: "events",
    });

    console.log(
      `[AutoNotification] Programme update notification sent to ${recipients.length} recipients`,
    );
  } catch (error) {
    console.error(
      "[AutoNotification] Failed to send programme update notification:",
      error,
    );
  }
}

export default {
  notifyAnnouncementCreated,
  notifyProgrammePublished,
  notifyProgrammeUpdated,
};
