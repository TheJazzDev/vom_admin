import {
  addDoc,
  collection,
  type DocumentData,
  doc,
  getDocs,
  orderBy,
  type QueryDocumentSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebase";

export interface CreateMemberData {
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  position: string[];
  address: string;
  gender: Gender;
  dob: string;
  department: string[];
  band: string[];
  primaryPhone: string;
  secondaryPhone?: string;
  authType: AuthType;
  avatar?: string;
}

export interface UpdateMemberData extends Partial<CreateMemberData> {
  status?: "active" | "inactive";
  verified?: boolean;
  emailVerified?: boolean;
  phoneVerified?: boolean;
}

export function transformFirestoreDoc(
  doc: QueryDocumentSnapshot<DocumentData>,
): MemberProfile {
  const data = doc.data();

  return {
    memberId: doc.id,
    ...(data as Omit<MemberProfile, "memberId">),
    // Firestore Timestamps → JS Dates
    // createdAt: data.createdAt?.toDate?.() ?? null,
    joinDate: data.joinDate?.toDate?.() ?? null,
    memberSince: data.memberSince?.toDate?.() ?? null,
  };
}

const membersRef = collection(db, "members");

export const memberService = {
  // Get all members - returns raw Firestore docs
  async getAllMembers(): Promise<MemberProfile[]> {
    try {
      const q = query(membersRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(transformFirestoreDoc);
    } catch (error) {
      console.error("Error fetching members:", error);
      throw new Error("Failed to fetch members");
    }
  },

  // Get active members only - returns raw Firestore docs
  async getActiveMembers(): Promise<QueryDocumentSnapshot<DocumentData>[]> {
    try {
      const q = query(
        membersRef,
        where("status", "==", "active"),
        orderBy("createdAt", "desc"),
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs;
    } catch (error) {
      console.error("Error fetching active members:", error);
      throw new Error("Failed to fetch active members");
    }
  },

  // Get member by ID - returns raw Firestore doc
  async getMemberById(
    memberId: string,
  ): Promise<QueryDocumentSnapshot<DocumentData> | null> {
    try {
      const memberDoc = await getDocs(
        query(membersRef, where("__name__", "==", memberId)),
      );

      return memberDoc.empty ? null : memberDoc.docs[0];
    } catch (error) {
      console.error("Error fetching member:", error);
      throw new Error("Failed to fetch member");
    }
  },

  // Create new member
  async createMember(memberData: CreateMemberData): Promise<string> {
    try {
      const memberId = `MEM${Date.now()}`;

      const newMember = {
        ...memberData,
        memberId,
        accountType: "member" as const,
        status: "active" as const,
        verified: false,
        emailVerified: false,
        phoneVerified: false,
        hasPassword: false,
        avatar: memberData.avatar || "",
        createdAt: serverTimestamp(),
        joinDate: serverTimestamp(),
        memberSince: serverTimestamp(),
      };

      const docRef = await addDoc(membersRef, newMember);
      return docRef.id;
    } catch (error) {
      console.error("Error creating member:", error);
      throw new Error("Failed to create member");
    }
  },

  async updateMember(
    memberId: string,
    updates: UpdateMemberData,
  ): Promise<void> {
    try {
      const memberDocRef = doc(db, "members", memberId);

      await updateDoc(memberDocRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating member:", error);
      throw new Error("Failed to update member");
    }
  },
};
