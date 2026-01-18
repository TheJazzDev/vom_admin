import {
  addDoc,
  type DocumentData,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  type QueryDocumentSnapshot,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { getFirstTimersRef, getMembersRef } from "@/config/collectionRefs";
import { getFirebaseDb } from "@/config/firebase";

/**
 * Transform Firestore document to typed object
 */
function transformFirstTimerDoc(
  doc: QueryDocumentSnapshot<DocumentData>,
): FirstTimer {
  const data = doc.data();
  return {
    id: doc.id,
    ...(data as Omit<FirstTimer, "id">),
  };
}

/**
 * Transform a single document snapshot to FirstTimer
 */
function transformFirstTimerSnapshot(docSnap: any): FirstTimer | null {
  if (!docSnap.exists()) {
    return null;
  }
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
  } as FirstTimer;
}

/**
 * Get all first timers
 */
export async function getAllFirstTimers(): Promise<FirstTimer[]> {
  try {
    const firstTimersRef = getFirstTimersRef();
    const q = query(firstTimersRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => transformFirstTimerDoc(doc));
  } catch (error) {
    console.error("Error fetching first timers:", error);
    throw new Error("Failed to fetch first timers");
  }
}

/**
 * Get active first timers (within 48 hours of createdAt)
 */
export async function getActiveFirstTimers(): Promise<FirstTimer[]> {
  try {
    const firstTimersRef = getFirstTimersRef();
    const fortyEightHoursAgo = new Date();
    fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);

    const q = query(
      firstTimersRef,
      where("status", "==", "active"),
      where("createdAt", ">=", Timestamp.fromDate(fortyEightHoursAgo)),
      orderBy("createdAt", "desc"),
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => transformFirstTimerDoc(doc));
  } catch (error) {
    console.error("Error fetching active first timers:", error);
    throw new Error("Failed to fetch active first timers");
  }
}

/**
 * Get first timer by ID
 */
export async function getFirstTimerById(
  id: string,
): Promise<FirstTimer | null> {
  try {
    const db = getFirebaseDb();
    const docRef = doc(db, "firstTimers", id);
    const docSnap = await getDoc(docRef);
    return transformFirstTimerSnapshot(docSnap);
  } catch (error) {
    console.error("Error fetching first timer:", error);
    throw new Error("Failed to fetch first timer");
  }
}

/**
 * Create new first timer
 */
export async function createFirstTimer(
  data: CreateFirstTimerData,
): Promise<string> {
  try {
    const firstTimersRef = getFirstTimersRef();
    const now = new Date();
    const displayUntil = new Date(now.getTime() + 48 * 60 * 60 * 1000); // 48 hours

    const firstTimerData = {
      ...data,
      createdAt: serverTimestamp(),
      displayUntil: Timestamp.fromDate(displayUntil),
      visitDate: data.visitDate || serverTimestamp(),
      status: "active",
      followedUp: false,
    };

    const docRef = await addDoc(firstTimersRef, firstTimerData);
    return docRef.id;
  } catch (error) {
    console.error("Error creating first timer:", error);
    throw new Error("Failed to create first timer");
  }
}

/**
 * Update first timer
 */
export async function updateFirstTimer(
  id: string,
  data: Partial<FirstTimer>,
): Promise<void> {
  try {
    const db = getFirebaseDb();
    const docRef = doc(db, "firstTimers", id);
    await updateDoc(docRef, { ...data });
  } catch (error) {
    console.error("Error updating first timer:", error);
    throw new Error("Failed to update first timer");
  }
}

/**
 * Delete first timer
 */
export async function deleteFirstTimer(id: string): Promise<void> {
  try {
    const db = getFirebaseDb();
    const docRef = doc(db, "firstTimers", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting first timer:", error);
    throw new Error("Failed to delete first timer");
  }
}

/**
 * Archive first timer (mark as archived, don't delete)
 */
export async function archiveFirstTimer(id: string): Promise<void> {
  try {
    await updateFirstTimer(id, { status: "archived" });
  } catch (error) {
    console.error("Error archiving first timer:", error);
    throw new Error("Failed to archive first timer");
  }
}

/**
 * Promote first timer to member
 * Creates a member account from first timer data
 */
export async function promoteToMember(
  firstTimerId: string,
  adminId: string,
  additionalMemberData?: Partial<UserProfile>,
): Promise<string> {
  try {
    const firstTimer = await getFirstTimerById(firstTimerId);
    if (!firstTimer) {
      throw new Error("First timer not found");
    }

    // Create member from first timer data
    const membersRef = getMembersRef();
    const memberData = {
      firstName: firstTimer.firstName,
      lastName: firstTimer.lastName,
      middleName: "",
      address: firstTimer.address,
      primaryPhone: firstTimer.phoneNumber,
      email: "",
      gender: "",
      dob: "",
      maritalStatus: "single",
      occupation: "",
      title: "",
      position: [],
      department: [],
      departmentKeys: [],
      band: [],
      bandKeys: [],
      role: "user",
      status: "active",
      verified: false,
      emailVerified: false,
      phoneVerified: false,
      authType: "phone",
      accountType: "member",
      hasPassword: false,
      createdAt: serverTimestamp(),
      joinDate: firstTimer.visitDate,
      uid: "",
      avatar: "",
      ...additionalMemberData,
    };

    const memberDocRef = await addDoc(membersRef, memberData);

    // Update first timer to mark as converted
    await updateFirstTimer(firstTimerId, {
      status: "converted",
      convertedToMemberId: memberDocRef.id,
      convertedAt: new Date().toISOString(),
      convertedBy: adminId,
    });

    return memberDocRef.id;
  } catch (error) {
    console.error("Error promoting first timer to member:", error);
    throw new Error("Failed to promote to member");
  }
}

/**
 * Get first timer statistics
 */
export async function getFirstTimerStats(): Promise<FirstTimerStats> {
  try {
    const allFirstTimers = await getAllFirstTimers();
    const now = new Date();
    const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const stats: FirstTimerStats = {
      total: allFirstTimers.length,
      active: allFirstTimers.filter(
        (ft) =>
          ft.status === "active" &&
          new Date(ft.createdAt) >= fortyEightHoursAgo,
      ).length,
      converted: allFirstTimers.filter((ft) => ft.status === "converted")
        .length,
      archived: allFirstTimers.filter((ft) => ft.status === "archived").length,
      thisWeek: allFirstTimers.filter(
        (ft) => new Date(ft.createdAt) >= oneWeekAgo,
      ).length,
      thisMonth: allFirstTimers.filter(
        (ft) => new Date(ft.createdAt) >= oneMonthAgo,
      ).length,
      byProgramme: {
        sunday: allFirstTimers.filter((ft) => ft.programmeType === "sunday")
          .length,
        shilo: allFirstTimers.filter((ft) => ft.programmeType === "shilo")
          .length,
        vigil: allFirstTimers.filter((ft) => ft.programmeType === "vigil")
          .length,
      },
    };

    return stats;
  } catch (error) {
    console.error("Error getting first timer stats:", error);
    throw new Error("Failed to get first timer statistics");
  }
}
