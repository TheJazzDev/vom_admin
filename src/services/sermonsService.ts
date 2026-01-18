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
import { getSermonSeriesRef, getSermonsRef } from "@/config/collectionRefs";
import { getFirebaseDb } from "@/config/firebase";

function transformSermonDoc(doc: QueryDocumentSnapshot<DocumentData>): Sermon {
  const data = doc.data();
  return {
    id: doc.id,
    ...(data as Omit<Sermon, "id">),
  };
}

function transformSeriesDoc(
  doc: QueryDocumentSnapshot<DocumentData>,
): SermonSeries {
  const data = doc.data();
  return {
    id: doc.id,
    ...(data as Omit<SermonSeries, "id">),
  };
}

// Sermons CRUD
export const getAllSermons = async (): Promise<Sermon[]> => {
  try {
    const sermonsRef = getSermonsRef();
    const q = query(sermonsRef, orderBy("sermonDate", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(transformSermonDoc);
  } catch (error) {
    console.error("Error fetching sermons:", error);
    throw new Error("Failed to fetch sermons");
  }
};

export const getActiveSermons = async (): Promise<Sermon[]> => {
  try {
    const sermonsRef = getSermonsRef();
    const q = query(
      sermonsRef,
      where("isActive", "==", true),
      orderBy("sermonDate", "desc"),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(transformSermonDoc);
  } catch (error) {
    console.error("Error fetching active sermons:", error);
    throw new Error("Failed to fetch active sermons");
  }
};

export const getSermonsByCategory = async (
  category: SermonCategory,
): Promise<Sermon[]> => {
  try {
    const sermonsRef = getSermonsRef();
    const q = query(
      sermonsRef,
      where("category", "==", category),
      where("isActive", "==", true),
      orderBy("sermonDate", "desc"),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(transformSermonDoc);
  } catch (error) {
    console.error("Error fetching sermons by category:", error);
    throw new Error("Failed to fetch sermons by category");
  }
};

export const getRecentSermons = async (
  limitCount: number = 10,
): Promise<Sermon[]> => {
  try {
    const sermonsRef = getSermonsRef();
    const q = query(
      sermonsRef,
      where("isActive", "==", true),
      orderBy("sermonDate", "desc"),
      limit(limitCount),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(transformSermonDoc);
  } catch (error) {
    console.error("Error fetching recent sermons:", error);
    throw new Error("Failed to fetch recent sermons");
  }
};

export const getSermonById = async (id: string): Promise<Sermon | null> => {
  try {
    const db = getFirebaseDb();
    const docRef = doc(db, "sermons", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return {
      id: docSnap.id,
      ...(docSnap.data() as Omit<Sermon, "id">),
    };
  } catch (error) {
    console.error("Error fetching sermon:", error);
    throw new Error("Failed to fetch sermon");
  }
};

export const createSermon = async (
  sermonData: CreateSermonData,
): Promise<string> => {
  try {
    const sermonsRef = getSermonsRef();

    const newSermon: Omit<Sermon, "id"> = {
      ...sermonData,
      preacherPhoto: sermonData.preacherPhoto || null,
      videoUrl: sermonData.videoUrl || null,
      audioUrl: sermonData.audioUrl || null,
      thumbnailUrl: sermonData.thumbnailUrl || null,
      viewCount: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(sermonsRef, newSermon);
    return docRef.id;
  } catch (error) {
    console.error("Error creating sermon:", error);
    throw new Error("Failed to create sermon");
  }
};

export const updateSermon = async (
  id: string,
  updates: Partial<Sermon>,
): Promise<void> => {
  try {
    const db = getFirebaseDb();
    const docRef = doc(db, "sermons", id);

    await updateDoc(docRef, updates);
  } catch (error) {
    console.error("Error updating sermon:", error);
    throw new Error("Failed to update sermon");
  }
};

export const deleteSermon = async (id: string): Promise<void> => {
  try {
    const db = getFirebaseDb();
    const docRef = doc(db, "sermons", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting sermon:", error);
    throw new Error("Failed to delete sermon");
  }
};

// Sermon Series CRUD
export const getAllSermonSeries = async (): Promise<SermonSeries[]> => {
  try {
    const seriesRef = getSermonSeriesRef();
    const querySnapshot = await getDocs(seriesRef);
    return querySnapshot.docs.map(transformSeriesDoc);
  } catch (error) {
    console.error("Error fetching sermon series:", error);
    throw new Error("Failed to fetch sermon series");
  }
};

export const createSermonSeries = async (
  seriesData: Omit<SermonSeries, "id">,
): Promise<string> => {
  try {
    const seriesRef = getSermonSeriesRef();
    const docRef = await addDoc(seriesRef, seriesData);
    return docRef.id;
  } catch (error) {
    console.error("Error creating sermon series:", error);
    throw new Error("Failed to create sermon series");
  }
};

export const updateSermonSeries = async (
  id: string,
  updates: Partial<SermonSeries>,
): Promise<void> => {
  try {
    const db = getFirebaseDb();
    const docRef = doc(db, "sermonSeries", id);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error("Error updating sermon series:", error);
    throw new Error("Failed to update sermon series");
  }
};

export const deleteSermonSeries = async (id: string): Promise<void> => {
  try {
    const db = getFirebaseDb();
    const docRef = doc(db, "sermonSeries", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting sermon series:", error);
    throw new Error("Failed to delete sermon series");
  }
};

// Stats
export const getSermonStats = async (): Promise<{
  total: number;
  active: number;
  thisMonth: number;
  totalViews: number;
  byCategory: Record<SermonCategory, number>;
}> => {
  try {
    const sermons = await getAllSermons();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split("T")[0];

    const byCategory: Record<SermonCategory, number> = {
      sunday: 0,
      midweek: 0,
      special: 0,
      conference: 0,
      revival: 0,
    };

    let totalViews = 0;

    for (const sermon of sermons) {
      byCategory[sermon.category]++;
      totalViews += sermon.viewCount;
    }

    return {
      total: sermons.length,
      active: sermons.filter((s) => s.isActive).length,
      thisMonth: sermons.filter((s) => s.createdAt >= startOfMonth).length,
      totalViews,
      byCategory,
    };
  } catch (error) {
    console.error("Error getting sermon stats:", error);
    return {
      total: 0,
      active: 0,
      thisMonth: 0,
      totalViews: 0,
      byCategory: {
        sunday: 0,
        midweek: 0,
        special: 0,
        conference: 0,
        revival: 0,
      },
    };
  }
};
