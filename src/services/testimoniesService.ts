import {
  addDoc,
  collection,
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
import { getTestimoniesRef } from "@/config/collectionRefs";
import { getFirebaseDb } from "@/config/firebase";

function transformTestimonyDoc(
  doc: QueryDocumentSnapshot<DocumentData>,
): Testimony {
  const data = doc.data();
  return {
    id: doc.id,
    ...(data as Omit<Testimony, "id">),
  };
}

function transformCommentDoc(
  doc: QueryDocumentSnapshot<DocumentData>,
): TestimonyComment {
  const data = doc.data();
  return {
    id: doc.id,
    ...(data as Omit<TestimonyComment, "id">),
  };
}

// Testimonies CRUD
export const getAllTestimonies = async (): Promise<Testimony[]> => {
  try {
    const testimoniesRef = getTestimoniesRef();
    const q = query(testimoniesRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(transformTestimonyDoc);
  } catch (error) {
    console.error("Error fetching testimonies:", error);
    throw new Error("Failed to fetch testimonies");
  }
};

export const getApprovedTestimonies = async (): Promise<Testimony[]> => {
  try {
    const testimoniesRef = getTestimoniesRef();
    const q = query(
      testimoniesRef,
      where("status", "==", "approved"),
      orderBy("createdAt", "desc"),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(transformTestimonyDoc);
  } catch (error) {
    console.error("Error fetching approved testimonies:", error);
    throw new Error("Failed to fetch approved testimonies");
  }
};

export const getPendingTestimonies = async (): Promise<Testimony[]> => {
  try {
    const testimoniesRef = getTestimoniesRef();
    const q = query(
      testimoniesRef,
      where("status", "==", "pending"),
      orderBy("createdAt", "desc"),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(transformTestimonyDoc);
  } catch (error) {
    console.error("Error fetching pending testimonies:", error);
    throw new Error("Failed to fetch pending testimonies");
  }
};

export const getTestimoniesByCategory = async (
  category: TestimonyCategory,
): Promise<Testimony[]> => {
  try {
    const testimoniesRef = getTestimoniesRef();
    const q = query(
      testimoniesRef,
      where("category", "==", category),
      where("status", "==", "approved"),
      orderBy("createdAt", "desc"),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(transformTestimonyDoc);
  } catch (error) {
    console.error("Error fetching testimonies by category:", error);
    throw new Error("Failed to fetch testimonies by category");
  }
};

export const getRecentTestimonies = async (
  limitCount: number = 10,
): Promise<Testimony[]> => {
  try {
    const testimoniesRef = getTestimoniesRef();
    const q = query(
      testimoniesRef,
      where("status", "==", "approved"),
      orderBy("createdAt", "desc"),
      limit(limitCount),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(transformTestimonyDoc);
  } catch (error) {
    console.error("Error fetching recent testimonies:", error);
    throw new Error("Failed to fetch recent testimonies");
  }
};

export const getTestimonyById = async (
  id: string,
): Promise<Testimony | null> => {
  try {
    const db = getFirebaseDb();
    const docRef = doc(db, "testimonies", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return {
      id: docSnap.id,
      ...(docSnap.data() as Omit<Testimony, "id">),
    };
  } catch (error) {
    console.error("Error fetching testimony:", error);
    throw new Error("Failed to fetch testimony");
  }
};

export const createTestimony = async (
  testimonyData: CreateTestimonyData,
): Promise<string> => {
  try {
    const testimoniesRef = getTestimoniesRef();

    const newTestimony: Omit<Testimony, "id"> = {
      ...testimonyData,
      authorAvatar: testimonyData.authorAvatar || null,
      mediaUrls: testimonyData.mediaUrls || [],
      likesCount: 0,
      commentsCount: 0,
      status: "pending",
      approvedAt: null,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(testimoniesRef, newTestimony);
    return docRef.id;
  } catch (error) {
    console.error("Error creating testimony:", error);
    throw new Error("Failed to create testimony");
  }
};

export const updateTestimony = async (
  id: string,
  updates: Partial<Testimony>,
): Promise<void> => {
  try {
    const db = getFirebaseDb();
    const docRef = doc(db, "testimonies", id);

    await updateDoc(docRef, updates);
  } catch (error) {
    console.error("Error updating testimony:", error);
    throw new Error("Failed to update testimony");
  }
};

export const approveTestimony = async (id: string): Promise<void> => {
  try {
    const db = getFirebaseDb();
    const docRef = doc(db, "testimonies", id);

    await updateDoc(docRef, {
      status: "approved",
      approvedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error approving testimony:", error);
    throw new Error("Failed to approve testimony");
  }
};

export const rejectTestimony = async (id: string): Promise<void> => {
  try {
    const db = getFirebaseDb();
    const docRef = doc(db, "testimonies", id);

    await updateDoc(docRef, {
      status: "rejected",
    });
  } catch (error) {
    console.error("Error rejecting testimony:", error);
    throw new Error("Failed to reject testimony");
  }
};

export const deleteTestimony = async (id: string): Promise<void> => {
  try {
    const db = getFirebaseDb();
    const docRef = doc(db, "testimonies", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting testimony:", error);
    throw new Error("Failed to delete testimony");
  }
};

// Comments Management
export const getTestimonyComments = async (
  testimonyId: string,
): Promise<TestimonyComment[]> => {
  try {
    const db = getFirebaseDb();
    const commentsRef = collection(db, `testimonies/${testimonyId}/comments`);
    const q = query(commentsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(transformCommentDoc);
  } catch (error) {
    console.error("Error fetching testimony comments:", error);
    throw new Error("Failed to fetch testimony comments");
  }
};

export const deleteTestimonyComment = async (
  testimonyId: string,
  commentId: string,
): Promise<void> => {
  try {
    const db = getFirebaseDb();
    const commentRef = doc(
      db,
      `testimonies/${testimonyId}/comments/${commentId}`,
    );
    const testimonyRef = doc(db, "testimonies", testimonyId);

    await deleteDoc(commentRef);
    // Decrement comment count
    const testimonyDoc = await getDoc(testimonyRef);
    if (testimonyDoc.exists()) {
      const currentCount = testimonyDoc.data()?.commentsCount || 0;
      await updateDoc(testimonyRef, {
        commentsCount: Math.max(0, currentCount - 1),
      });
    }
  } catch (error) {
    console.error("Error deleting testimony comment:", error);
    throw new Error("Failed to delete testimony comment");
  }
};

// Stats
export const getTestimonyStats = async (): Promise<{
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  byCategory: Record<TestimonyCategory, number>;
}> => {
  try {
    const testimonies = await getAllTestimonies();

    const byCategory: Record<TestimonyCategory, number> = {
      healing: 0,
      provision: 0,
      deliverance: 0,
      salvation: 0,
      restoration: 0,
      breakthrough: 0,
      protection: 0,
      other: 0,
    };

    for (const testimony of testimonies) {
      byCategory[testimony.category]++;
    }

    return {
      total: testimonies.length,
      approved: testimonies.filter((t) => t.status === "approved").length,
      pending: testimonies.filter((t) => t.status === "pending").length,
      rejected: testimonies.filter((t) => t.status === "rejected").length,
      byCategory,
    };
  } catch (error) {
    console.error("Error getting testimony stats:", error);
    return {
      total: 0,
      approved: 0,
      pending: 0,
      rejected: 0,
      byCategory: {
        healing: 0,
        provision: 0,
        deliverance: 0,
        salvation: 0,
        restoration: 0,
        breakthrough: 0,
        protection: 0,
        other: 0,
      },
    };
  }
};
