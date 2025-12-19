import { addDoc, serverTimestamp } from "firebase/firestore";
import { getNotificationRef } from "@/config/collectionRefs";

export async function sendNotification({
  title,
  body,
  type,
  programmeId,
  userIds = [],
}: {
  title: string;
  body: string;
  type: "programme" | "role";
  programmeId: string;
  userIds?: string[];
}) {
  try {
    const notificationRef = getNotificationRef();
    if (userIds.length === 0) {
      // global notification
      await addDoc(notificationRef, {
        title,
        body,
        type,
        programmeId,
        isRead: false,
        createdAt: serverTimestamp(),
      });
    } else {
      // personal notifications
      const tasks = userIds.map((uid) =>
        addDoc(notificationRef, {
          title,
          body,
          type,
          userId: uid,
          programmeId,
          isRead: false,
          createdAt: serverTimestamp(),
        }),
      );
      await Promise.all(tasks);
    }
  } catch (err) {
    console.error("Error sending notification:", err);
  }
}
