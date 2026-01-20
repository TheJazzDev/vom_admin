import {
  addDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getProgrammesRef } from "@/config/collectionRefs";

export interface ProgrammeStats {
  total: number;
  upcoming: number;
  past: number;
  drafts: number;
  thisMonth: number;
}

// Get programme by ID
export const getProgrammeById = async (
  id: string,
): Promise<ProgrammeFormData> => {
  try {
    const programmesRef = getProgrammesRef();
    const docRef = doc(programmesRef, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as ProgrammeFormData;
    } else {
      throw new Error("Programme not found");
    }
  } catch (error) {
    console.error("Error getting programme:", error);
    throw new Error("Failed to get programme");
  }
};

export const saveProgramme = async (
  programmeData: ProgrammeFormData,
  userId: string,
): Promise<string> => {
  const now = new Date().toISOString();
  const programmesRef = getProgrammesRef();

  const data = {
    ...programmeData,
    updatedAt: now,
    createdBy: userId,
    createdAt: programmeData.createdAt || now,
  };

  try {
    const docRef = await addDoc(programmesRef, data);

    // TODO: Send notification via API route after programme is created
    // Notifications are now handled server-side in API routes to avoid client-side Firebase Admin SDK usage

    return docRef.id;
  } catch (error) {
    console.error("Error saving programme:", error);
    throw new Error("Failed to save programme");
  }
};

// Update existing programme
export const updateProgramme = async (
  id: string,
  programmeData: Partial<ProgrammeFormData>,
): Promise<void> => {
  const now = new Date().toISOString();
  const programmesRef = getProgrammesRef();

  const updateData = {
    ...programmeData,
    updatedAt: now,
  };

  // Remove id from update data if it exists
  const { id: _, ...dataToUpdate } = updateData;

  try {
    const docRef = doc(programmesRef, id);

    // Get current programme data to check status change
    const currentDoc = await getDoc(docRef);
    const _currentData = currentDoc.data() as ProgrammeFormData | undefined;

    await updateDoc(docRef, dataToUpdate);

    // TODO: Send notifications via API route after programme is updated
    // Notifications are now handled server-side in API routes to avoid client-side Firebase Admin SDK usage
  } catch (error) {
    console.error("Error updating programme:", error);
    throw new Error("Failed to update programme");
  }
};

// Get programme statistics - single query approach
export const getProgrammeStats = async (): Promise<ProgrammeStats> => {
  try {
    const programmesRef = getProgrammesRef();
    const snapshot = await getDocs(programmesRef);

    const now = new Date();
    const nowISO = now.toISOString();

    // Calculate this month boundaries
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );
    const startOfMonthISO = startOfMonth.toISOString();
    const endOfMonthISO = endOfMonth.toISOString();

    let total = 0;
    let upcoming = 0;
    let past = 0;
    let drafts = 0;
    let thisMonth = 0;

    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const programmeDate = data.date;

      total++;

      // Count by status and date
      if (data.status === "draft") {
        drafts++;
      } else if (programmeDate > nowISO) {
        upcoming++;
      } else if (programmeDate <= nowISO) {
        past++;
      }

      // Count this month's programmes
      if (programmeDate >= startOfMonthISO && programmeDate <= endOfMonthISO) {
        thisMonth++;
      }
    });

    return {
      total,
      upcoming,
      past,
      drafts,
      thisMonth,
    };
  } catch (error) {
    console.error("Error getting programme stats:", error);
    throw new Error("Failed to get programme statistics");
  }
};

// Get recent programmes (by creation date)
export const getRecentProgrammes = async (
  limitCount: number = 5,
): Promise<ProgrammeFormData[]> => {
  try {
    const programmesRef = getProgrammesRef();
    const q = query(
      programmesRef,
      orderBy("createdAt", "desc"),
      limit(limitCount),
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ProgrammeFormData[];
  } catch (error) {
    console.error("Error getting recent programmes:", error);
    throw new Error("Failed to get recent programmes");
  }
};

export const getPublishedProgrammes = async (): Promise<
  ProgrammeFormData[]
> => {
  const programmesRef = getProgrammesRef();
  const q = query(
    programmesRef,
    where("status", "==", "published"),
    orderBy("date", "desc"),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ProgrammeFormData[];
};

// Get upcoming programmes
export const getUpcomingProgrammes = async (): Promise<ProgrammeFormData[]> => {
  const programmesRef = getProgrammesRef();
  const now = new Date().toISOString();
  const q = query(
    programmesRef,
    where("date", ">", now),
    orderBy("date", "asc"),
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ProgrammeFormData[];
};

// Get draft programmes
export const getDraftProgrammes = async (): Promise<ProgrammeFormData[]> => {
  const programmesRef = getProgrammesRef();
  const q = query(programmesRef, where("status", "==", "draft"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ProgrammeFormData[];
};

// Get past programmes
export const getPastProgrammes = async (): Promise<ProgrammeFormData[]> => {
  const programmesRef = getProgrammesRef();
  const now = new Date().toISOString();
  const q = query(
    programmesRef,
    where("date", "<", now),
    where("status", "==", "published"),
    orderBy("date", "desc"),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ProgrammeFormData[];
};

// Get current programmes (today)
export const getCurrentProgrammes = async (): Promise<ProgrammeFormData[]> => {
  const programmesRef = getProgrammesRef();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const q = query(
    programmesRef,
    where("date", ">=", today.toISOString()),
    where("date", "<", tomorrow.toISOString()),
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ProgrammeFormData[];
};

// Get all programmes
export const getAllProgrammes = async (): Promise<ProgrammeFormData[]> => {
  const programmesRef = getProgrammesRef();
  const snapshot = await getDocs(programmesRef);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ProgrammeFormData[];
};
