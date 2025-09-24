import {
  addDoc,
  collection,
  type DocumentData,
  doc,
  getDocs,
  orderBy,
  type QueryDocumentSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebase";

export interface UpdateMemberData extends Partial<CreateMemberData> {
  status?: "active" | "inactive";
  verified?: boolean;
  emailVerified?: boolean;
  phoneVerified?: boolean;
}

export function transformFirestoreDoc(
  doc: QueryDocumentSnapshot<DocumentData>,
): UserProfile {
  const data = doc.data();

  return {
    id: doc.id,
    ...(data as Omit<UserProfile, "id">),
  };
}

const membersRef = collection(db, "members");

export const getAllMembers = async (): Promise<UserProfile[]> => {
  try {
    const q = query(membersRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(transformFirestoreDoc);
  } catch (error) {
    console.error("Error fetching members:", error);
    throw new Error("Failed to fetch members");
  }
};

export const getMemberById = async (
  id: string,
): Promise<QueryDocumentSnapshot<DocumentData> | null> => {
  try {
    const memberDoc = await getDocs(
      query(membersRef, where("__name__", "==", id)),
    );

    return memberDoc.empty ? null : memberDoc.docs[0];
  } catch (error) {
    console.error("Error fetching member:", error);
    throw new Error("Failed to fetch member");
  }
};

export const createMember = async (
  memberData: CreateMemberData,
): Promise<string> => {
  try {
    const id = `vom-${Date.now()}`;

    const bandKeys = (memberData.band || []).map((b: BandData) =>
      typeof b.name === "string" ? b.name.replace(/^"|"$/g, "") : b.name,
    );

    const newMember = {
      ...memberData,
      id,
      bandKeys: bandKeys || [],
      accountType: "member" as const,
      status: "active" as const,
      verified: false,
      emailVerified: false,
      phoneVerified: false,
      hasPassword: false,
      avatar: memberData.avatar || "",
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(membersRef, newMember);
    return docRef.id;
  } catch (error) {
    console.error("Error creating member:", error);
    throw new Error("Failed to create member");
  }
};

export const updateMember = async (
  id: string,
  updates: UpdateMemberData,
): Promise<void> => {
  try {
    const memberDocRef = doc(db, "members", id);

    const updatePayload: Record<string, CreateMemberData> = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if ("band" in updates && updates.band) {
      updatePayload.bandKeys = (updates.band as BandData[]).map((b) =>
        typeof b.name === "string" ? b.name.replace(/^"|"$/g, "") : b.name,
      );
    }

    await updateDoc(memberDocRef, updatePayload);
  } catch (error) {
    console.error("Error updating member:", error);
    throw new Error("Failed to update member");
  }
};
