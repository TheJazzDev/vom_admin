import {
  collection,
  type DocumentData,
  doc,
  getDocs,
  orderBy,
  type QueryDocumentSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { db, storage } from "@/config/firebase";
import { BandKeysEnum } from "@/enums";
import { generateMemberId } from "./utils";

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
    // Generate unique member ID
    const memberId = generateMemberId(
      memberData.firstName,
      memberData.lastName,
      memberData.dob,
    );

    // Extract department keys from department data
    const departmentKeys = (memberData.department || []).map(
      (d: Department) => d.name,
    );

    // If no bands assigned, add UNASSIGNED
    const finalBands =
      memberData.band && memberData.band.length > 0
        ? memberData.band
        : [{ name: BandKeysEnum.UNASSIGNED, role: "Member" as BandRole }];

    const finalBandKeys = finalBands.map((b: Band) =>
      typeof b.name === "string" ? b.name.replace(/^"|"$/g, "") : b.name,
    );

    // Build the complete member profile
    const newMember: UserProfile = {
      id: memberId,
      uid: "",
      firstName: memberData.firstName,
      middleName: memberData.middleName || "",
      lastName: memberData.lastName,
      email: memberData.email,
      title: memberData.title,
      address: memberData.address,
      gender: memberData.gender,
      dob: memberData.dob,
      occupation: memberData.occupation || "",
      maritalStatus: memberData.maritalStatus || "single",
      primaryPhone: memberData.primaryPhone,
      secondaryPhone: memberData.secondaryPhone || "",
      avatar: memberData.avatar || "",
      joinDate: memberData.joinDate || "",
      position: memberData.position || [],
      band: finalBands,
      bandKeys: finalBandKeys,
      department: memberData.department || [],
      departmentKeys: departmentKeys,
      ministry: memberData.ministry || [],
      accountType: "member",
      status: "active",
      verified: false,
      emailVerified: false,
      phoneVerified: false,
      hasPassword: false,
      authType: "",
      lastLoginAt: "",
      role: "user",
      createdAt: new Date().toISOString(),
    };

    // Add to Firestore
    const docRef = doc(db, "members", memberId);
    await setDoc(docRef, newMember);
    // const docRef = await addDoc(collection(db, "members", memberId), newMember);

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

    const updatePayload: Record<string, any> = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // Update band keys if bands are being updated
    if ("band" in updates && updates.band) {
      updatePayload.bandKeys = (updates.band as BandData[]).map((b) =>
        typeof b.name === "string" ? b.name.replace(/^"|"$/g, "") : b.name,
      );
    }

    // Update department keys if departments are being updated
    if ("department" in updates && updates.department) {
      updatePayload.departmentKeys = (updates.department as DepartmentData[]).map(
        (d) =>
          typeof d.name === "string" ? d.name.replace(/^"|"$/g, "") : d.name,
      );
    }

    await updateDoc(memberDocRef, updatePayload);
  } catch (error) {
    console.error("Error updating member:", error);
    throw new Error("Failed to update member");
  }
};

export async function uploadMemberAvatar(
  file: File,
  memberId?: string,
): Promise<string> {
  try {
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const fileName = memberId
      ? `${memberId}_${timestamp}_${sanitizedFileName}`
      : `temp_${timestamp}_${sanitizedFileName}`;

    const storageRef = ref(storage, `members/avatars/${fileName}`);
    const snapshot = await uploadBytes(storageRef, file, {
      contentType: file.type,
    });

    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw new Error("Failed to upload avatar");
  }
}

export async function deleteMemberAvatar(avatarUrl: string): Promise<void> {
  try {
    if (!avatarUrl) return;

    const urlObj = new URL(avatarUrl);
    const pathMatch = urlObj.pathname.match(/\/o\/(.+)\?/);

    if (!pathMatch) {
      console.warn("Could not extract path from avatar URL");
      return;
    }

    const path = decodeURIComponent(pathMatch[1]);
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Error deleting avatar:", error);
  }
}

export async function updateMemberAvatar(
  newFile: File,
  oldAvatarUrl?: string,
  memberId?: string,
): Promise<string> {
  try {
    if (oldAvatarUrl) {
      await deleteMemberAvatar(oldAvatarUrl);
    }
    const newAvatarUrl = await uploadMemberAvatar(newFile, memberId);
    return newAvatarUrl;
  } catch (error) {
    console.error("Error updating avatar:", error);
    throw new Error("Failed to update avatar");
  }
}
