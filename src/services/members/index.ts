import { doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { getMembersRef } from "@/config/collectionRefs";
import { getFirebaseDb } from "@/config/firebase";

export async function findExistingMemberByName(
  firstName: string,
  lastName: string,
  primaryPhone: string,
): Promise<string | null> {
  try {
    const membersRef = getMembersRef();
    const snapshot = await getDocs(membersRef);

    for (const docSnap of snapshot.docs) {
      const member = docSnap.data();
      if (
        member.firstName?.toLowerCase() === firstName.toLowerCase() &&
        member.lastName?.toLowerCase() === lastName.toLowerCase() &&
        member.primaryPhone === primaryPhone
      ) {
        return docSnap.id;
      }
    }
    return null;
  } catch (error) {
    console.error("Error finding existing member:", error);
    return null;
  }
}

// In firebaseSync.ts
export async function findExistingMemberById(
  memberId: string,
): Promise<boolean> {
  try {
    const db = getFirebaseDb();
    const docRef = doc(db, "members", memberId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (error) {
    console.error("Error checking existing member:", error);
    return false;
  }
}

export async function syncMemberToFirebase(
  newMemberData: UserProfile,
): Promise<{
  success: boolean;
  isNew: boolean;
  memberId: string;
}> {
  try {
    const db = getFirebaseDb();
    // Check if member already exists by ID
    const memberExists = await findExistingMemberById(newMemberData.id);

    if (memberExists) {
      // Member exists - get existing data and preserve protected fields
      const existingDoc = await getDoc(doc(db, "members", newMemberData.id));
      const existingData = existingDoc.data() as UserProfile;

      // Preserve protected fields from existing data
      const updateData: UserProfile = {
        ...newMemberData,
        // Preserve these fields if they exist
        uid: existingData?.uid || newMemberData.uid,
        authType: existingData?.authType || newMemberData.authType,
        hasPassword: existingData?.hasPassword ?? newMemberData.hasPassword,
        emailVerified:
          existingData?.emailVerified ?? newMemberData.emailVerified,
        phoneVerified:
          existingData?.phoneVerified ?? newMemberData.phoneVerified,
        verified: existingData?.verified ?? newMemberData.verified,
        createdAt: existingData?.createdAt || newMemberData.createdAt,
        lastLoginAt: existingData?.lastLoginAt || newMemberData.lastLoginAt,
      };

      await setDoc(doc(db, "members", newMemberData.id), updateData);

      return {
        success: true,
        isNew: false,
        memberId: newMemberData.id,
      };
    } else {
      // New member - create with generated ID
      await setDoc(doc(db, "members", newMemberData.id), newMemberData);

      return {
        success: true,
        isNew: true,
        memberId: newMemberData.id,
      };
    }
  } catch (error: any) {
    console.error(`Failed to sync member:`, error);
    return {
      success: false,
      isNew: false,
      memberId: newMemberData.id,
    };
  }
}

export async function syncMembersToFirebase(members: UserProfile[]): Promise<{
  success: number;
  failed: number;
  errors: string[];
}> {
  const results: {
    success: number;
    failed: number;
    newMembers: number;
    updatedMembers: number;
    errors: string[];
  } = {
    success: 0,
    failed: 0,
    newMembers: 0,
    updatedMembers: 0,
    errors: [],
  };

  for (const member of members) {
    try {
      const result = await syncMemberToFirebase(member);

      if (result.success) {
        results.success++;
        if (result.isNew) {
          results.newMembers++;
        } else {
          results.updatedMembers++;
        }
      } else {
        results.failed++;
        results.errors.push(
          `Failed to sync ${member.firstName} ${member.lastName}}`,
        );
      }
    } catch (err: any) {
      results.failed++;
      results.errors.push(
        `Failed to sync ${member.firstName} ${member.lastName}: ${err.message}`,
      );
    }
  }

  return results;
}
