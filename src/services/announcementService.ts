import {
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  type QueryConstraint,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { getAnnouncementsRef } from "@/config/collectionRefs";
import { getFirebaseDb } from "@/config/firebase";

/**
 * Transform Firestore document to Announcement type
 */
export function transformAnnouncementDoc(docSnap: any): Announcement {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    title: data.title,
    content: data.content,
    type: data.type,
    priority: data.priority,
    date: data.date,
    author: data.author,
    readTime: data.readTime,
    tags: data.tags || [],
    isActive: data.isActive ?? true,
    publishDate: data.publishDate,
    expiryDate: data.expiryDate,
    createdAt:
      data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    updatedAt:
      data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  };
}

/**
 * Create a new announcement
 */
export async function createAnnouncement(
  input: CreateAnnouncementInput,
): Promise<string> {
  try {
    const announcementsRef = getAnnouncementsRef();
    const docRef = await addDoc(announcementsRef, {
      ...input,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating announcement:", error);
    throw new Error("Failed to create announcement");
  }
}

/**
 * Get all announcements with optional filters
 */
export async function getAnnouncements(filters?: {
  type?: string;
  priority?: string;
  isActive?: boolean;
}): Promise<Announcement[]> {
  try {
    const announcementsRef = getAnnouncementsRef();
    const constraints: QueryConstraint[] = [orderBy("createdAt", "desc")];

    if (filters?.type) {
      constraints.push(where("type", "==", filters.type));
    }
    if (filters?.priority) {
      constraints.push(where("priority", "==", filters.priority));
    }
    if (filters?.isActive !== undefined) {
      constraints.push(where("isActive", "==", filters.isActive));
    }

    const q = query(announcementsRef, ...constraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(transformAnnouncementDoc);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    throw new Error("Failed to fetch announcements");
  }
}

/**
 * Get a single announcement by ID
 */
export async function getAnnouncementById(
  id: string,
): Promise<Announcement | null> {
  try {
    const db = getFirebaseDb();
    const docRef = doc(db, "announcements", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return transformAnnouncementDoc(docSnap);
  } catch (error) {
    console.error("Error fetching announcement:", error);
    throw new Error("Failed to fetch announcement");
  }
}

/**
 * Update an existing announcement
 */
export async function updateAnnouncement(
  input: UpdateAnnouncementInput,
): Promise<void> {
  try {
    const db = getFirebaseDb();
    const { id, ...updateData } = input;
    const docRef = doc(db, "announcements", id);

    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating announcement:", error);
    throw new Error("Failed to update announcement");
  }
}

/**
 * Delete an announcement (soft delete by setting isActive to false)
 */
export async function deleteAnnouncement(
  id: string,
  hardDelete = false,
): Promise<void> {
  try {
    const db = getFirebaseDb();
    const docRef = doc(db, "announcements", id);

    if (hardDelete) {
      await deleteDoc(docRef);
    } else {
      await updateDoc(docRef, {
        isActive: false,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error("Error deleting announcement:", error);
    throw new Error("Failed to delete announcement");
  }
}

/**
 * Get active announcements only (for public display)
 */
export async function getActiveAnnouncements(): Promise<Announcement[]> {
  try {
    const announcementsRef = getAnnouncementsRef();
    const q = query(
      announcementsRef,
      where("isActive", "==", true),
      orderBy("date", "desc"),
    );
    const querySnapshot = await getDocs(q);

    const now = new Date().toISOString();

    return querySnapshot.docs
      .map(transformAnnouncementDoc)
      .filter((announcement) => {
        // Filter out expired announcements
        if (announcement.expiryDate && announcement.expiryDate < now) {
          return false;
        }
        // Filter out not-yet-published announcements
        if (announcement.publishDate && announcement.publishDate > now) {
          return false;
        }
        return true;
      });
  } catch (error) {
    console.error("Error fetching active announcements:", error);
    throw new Error("Failed to fetch active announcements");
  }
}
