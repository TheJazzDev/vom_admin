import {
  type DocumentData,
  type QueryDocumentSnapshot,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { getChildrenRef } from "@/config/collectionRefs";

function transformChildDoc(
  doc: QueryDocumentSnapshot<DocumentData>,
): ChildrenProfile {
  const data = doc.data();
  return {
    id: doc.id,
    ...(data as Omit<ChildrenProfile, "id">),
  };
}

export const getAllChildren = async (): Promise<ChildrenProfile[]> => {
  try {
    const childrenRef = getChildrenRef();
    const q = query(childrenRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(transformChildDoc);
  } catch (error) {
    console.error("Error fetching children:", error);
    throw new Error("Failed to fetch children");
  }
};

export const getChildrenStats = async (): Promise<{
  total: number;
  active: number;
  newThisMonth: number;
}> => {
  try {
    const children = await getAllChildren();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      total: children.length,
      active: children.length, // All children are considered active
      newThisMonth: children.filter((c) => {
        const createdAt = new Date(c.createdAt);
        return createdAt >= startOfMonth;
      }).length,
    };
  } catch (error) {
    console.error("Error getting children stats:", error);
    return { total: 0, active: 0, newThisMonth: 0 };
  }
};
