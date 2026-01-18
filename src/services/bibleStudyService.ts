import {
  addDoc,
  type DocumentData,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  type QueryDocumentSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  getBibleStudyRef,
  getBibleStudyTopicsRef,
} from "@/config/collectionRefs";
import { getFirebaseDb } from "@/config/firebase";

function transformBibleStudyDoc(
  doc: QueryDocumentSnapshot<DocumentData>,
): BibleStudySession {
  const data = doc.data();
  return {
    id: doc.id,
    ...(data as Omit<BibleStudySession, "id">),
  };
}

function transformTopicDoc(
  doc: QueryDocumentSnapshot<DocumentData>,
): BibleStudyTopic {
  const data = doc.data();
  return {
    id: doc.id,
    ...(data as Omit<BibleStudyTopic, "id">),
  };
}

// Bible Study Sessions CRUD
export const getAllBibleStudySessions = async (): Promise<
  BibleStudySession[]
> => {
  try {
    const bibleStudyRef = getBibleStudyRef();
    const q = query(bibleStudyRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(transformBibleStudyDoc);
  } catch (error) {
    console.error("Error fetching Bible study sessions:", error);
    throw new Error("Failed to fetch Bible study sessions");
  }
};

export const getActiveBibleStudySessions = async (): Promise<
  BibleStudySession[]
> => {
  try {
    const bibleStudyRef = getBibleStudyRef();
    const q = query(
      bibleStudyRef,
      where("isActive", "==", true),
      orderBy("createdAt", "desc"),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(transformBibleStudyDoc);
  } catch (error) {
    console.error("Error fetching active Bible study sessions:", error);
    throw new Error("Failed to fetch active Bible study sessions");
  }
};

export const getBibleStudySessionsByType = async (
  type: BibleStudyType,
): Promise<BibleStudySession[]> => {
  try {
    const bibleStudyRef = getBibleStudyRef();
    const q = query(
      bibleStudyRef,
      where("type", "==", type),
      where("isActive", "==", true),
      orderBy("createdAt", "desc"),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(transformBibleStudyDoc);
  } catch (error) {
    console.error("Error fetching Bible study sessions by type:", error);
    throw new Error("Failed to fetch Bible study sessions by type");
  }
};

export const getUpcomingBibleStudySessions = async (
  limitCount: number = 5,
): Promise<BibleStudySession[]> => {
  try {
    const bibleStudyRef = getBibleStudyRef();
    const now = new Date().toISOString();
    const q = query(
      bibleStudyRef,
      where("isActive", "==", true),
      where("scheduledDate", ">=", now),
      orderBy("scheduledDate", "asc"),
      limit(limitCount),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(transformBibleStudyDoc);
  } catch (error) {
    console.error("Error fetching upcoming Bible study sessions:", error);
    throw new Error("Failed to fetch upcoming Bible study sessions");
  }
};

export const getBibleStudySessionById = async (
  id: string,
): Promise<BibleStudySession | null> => {
  try {
    const db = getFirebaseDb();
    const docRef = doc(db, "bibleStudy", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return {
      id: docSnap.id,
      ...(docSnap.data() as Omit<BibleStudySession, "id">),
    };
  } catch (error) {
    console.error("Error fetching Bible study session:", error);
    throw new Error("Failed to fetch Bible study session");
  }
};

export const createBibleStudySession = async (
  sessionData: CreateBibleStudySessionData,
): Promise<string> => {
  try {
    const bibleStudyRef = getBibleStudyRef();

    const newSession: Omit<BibleStudySession, "id"> = {
      ...sessionData,
      videoUrl: sessionData.videoUrl || null,
      audioUrl: sessionData.audioUrl || null,
      pdfUrl: sessionData.pdfUrl || null,
      thumbnailUrl: sessionData.thumbnailUrl || null,
      scheduledDate: sessionData.scheduledDate || null,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(bibleStudyRef, newSession);
    return docRef.id;
  } catch (error) {
    console.error("Error creating Bible study session:", error);
    throw new Error("Failed to create Bible study session");
  }
};

export const updateBibleStudySession = async (
  id: string,
  updates: Partial<BibleStudySession>,
): Promise<void> => {
  try {
    const db = getFirebaseDb();
    const docRef = doc(db, "bibleStudy", id);

    await updateDoc(docRef, updates);
  } catch (error) {
    console.error("Error updating Bible study session:", error);
    throw new Error("Failed to update Bible study session");
  }
};

export const deleteBibleStudySession = async (id: string): Promise<void> => {
  try {
    const db = getFirebaseDb();
    const docRef = doc(db, "bibleStudy", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting Bible study session:", error);
    throw new Error("Failed to delete Bible study session");
  }
};

// Bible Study Topics CRUD
export const getAllBibleStudyTopics = async (): Promise<BibleStudyTopic[]> => {
  try {
    const topicsRef = getBibleStudyTopicsRef();
    const querySnapshot = await getDocs(topicsRef);
    return querySnapshot.docs.map(transformTopicDoc);
  } catch (error) {
    console.error("Error fetching Bible study topics:", error);
    throw new Error("Failed to fetch Bible study topics");
  }
};

export const createBibleStudyTopic = async (
  topicData: Omit<BibleStudyTopic, "id">,
): Promise<string> => {
  try {
    const topicsRef = getBibleStudyTopicsRef();
    const docRef = await addDoc(topicsRef, topicData);
    return docRef.id;
  } catch (error) {
    console.error("Error creating Bible study topic:", error);
    throw new Error("Failed to create Bible study topic");
  }
};

export const updateBibleStudyTopic = async (
  id: string,
  updates: Partial<BibleStudyTopic>,
): Promise<void> => {
  try {
    const db = getFirebaseDb();
    const docRef = doc(db, "bibleStudyTopics", id);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error("Error updating Bible study topic:", error);
    throw new Error("Failed to update Bible study topic");
  }
};

export const deleteBibleStudyTopic = async (id: string): Promise<void> => {
  try {
    const db = getFirebaseDb();
    const docRef = doc(db, "bibleStudyTopics", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting Bible study topic:", error);
    throw new Error("Failed to delete Bible study topic");
  }
};

// Stats
export const getBibleStudyStats = async (): Promise<{
  total: number;
  active: number;
  thisMonth: number;
  byType: Record<BibleStudyType, number>;
}> => {
  try {
    const sessions = await getAllBibleStudySessions();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split("T")[0];

    const byType: Record<BibleStudyType, number> = {
      topic: 0,
      book: 0,
      series: 0,
      devotional: 0,
    };

    for (const session of sessions) {
      byType[session.type]++;
    }

    return {
      total: sessions.length,
      active: sessions.filter((s) => s.isActive).length,
      thisMonth: sessions.filter((s) => s.createdAt >= startOfMonth).length,
      byType,
    };
  } catch (error) {
    console.error("Error getting Bible study stats:", error);
    return {
      total: 0,
      active: 0,
      thisMonth: 0,
      byType: { topic: 0, book: 0, series: 0, devotional: 0 },
    };
  }
};
