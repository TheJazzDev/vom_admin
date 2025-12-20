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
import { getPrayersRef } from "@/config/collectionRefs";
import { getFirebaseDb } from "@/config/firebase";

function transformPrayerDoc(
  doc: QueryDocumentSnapshot<DocumentData>,
): DailyPrayer {
  const data = doc.data();
  return {
    id: doc.id,
    ...(data as Omit<DailyPrayer, "id">),
  };
}

// Daily Prayers CRUD
export const getAllPrayers = async (): Promise<DailyPrayer[]> => {
  try {
    const prayersRef = getPrayersRef();
    const q = query(prayersRef, orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(transformPrayerDoc);
  } catch (error) {
    console.error("Error fetching prayers:", error);
    throw new Error("Failed to fetch prayers");
  }
};

export const getActivePrayers = async (): Promise<DailyPrayer[]> => {
  try {
    const prayersRef = getPrayersRef();
    const q = query(
      prayersRef,
      where("isActive", "==", true),
      orderBy("date", "desc"),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(transformPrayerDoc);
  } catch (error) {
    console.error("Error fetching active prayers:", error);
    throw new Error("Failed to fetch active prayers");
  }
};

export const getTodaysPrayer = async (): Promise<DailyPrayer | null> => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const prayersRef = getPrayersRef();
    const q = query(
      prayersRef,
      where("date", "==", today),
      where("isActive", "==", true),
      limit(1),
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // Fallback to most recent active prayer
      const fallbackQ = query(
        prayersRef,
        where("isActive", "==", true),
        orderBy("date", "desc"),
        limit(1),
      );
      const fallbackSnapshot = await getDocs(fallbackQ);
      return fallbackSnapshot.empty
        ? null
        : transformPrayerDoc(fallbackSnapshot.docs[0]);
    }

    return transformPrayerDoc(querySnapshot.docs[0]);
  } catch (error) {
    console.error("Error fetching today's prayer:", error);
    throw new Error("Failed to fetch today's prayer");
  }
};

export const getPrayerById = async (
  id: string,
): Promise<DailyPrayer | null> => {
  try {
    const db = getFirebaseDb();
    const docRef = doc(db, "prayers", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return {
      id: docSnap.id,
      ...(docSnap.data() as Omit<DailyPrayer, "id">),
    };
  } catch (error) {
    console.error("Error fetching prayer:", error);
    throw new Error("Failed to fetch prayer");
  }
};

export const createPrayer = async (
  prayerData: CreateDailyPrayerData,
): Promise<string> => {
  try {
    const prayersRef = getPrayersRef();

    const newPrayer: Omit<DailyPrayer, "id"> = {
      ...prayerData,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(prayersRef, newPrayer);
    return docRef.id;
  } catch (error) {
    console.error("Error creating prayer:", error);
    throw new Error("Failed to create prayer");
  }
};

export const updatePrayer = async (
  id: string,
  updates: Partial<DailyPrayer>,
): Promise<void> => {
  try {
    const db = getFirebaseDb();
    const docRef = doc(db, "prayers", id);

    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating prayer:", error);
    throw new Error("Failed to update prayer");
  }
};

export const deletePrayer = async (id: string): Promise<void> => {
  try {
    const db = getFirebaseDb();
    const docRef = doc(db, "prayers", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting prayer:", error);
    throw new Error("Failed to delete prayer");
  }
};

export const getPrayerStats = async (): Promise<{
  total: number;
  active: number;
  thisMonth: number;
}> => {
  try {
    const prayers = await getAllPrayers();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split("T")[0];

    return {
      total: prayers.length,
      active: prayers.filter((p) => p.isActive).length,
      thisMonth: prayers.filter((p) => p.date >= startOfMonth).length,
    };
  } catch (error) {
    console.error("Error getting prayer stats:", error);
    return { total: 0, active: 0, thisMonth: 0 };
  }
};
