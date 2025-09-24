import { doc, setDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

export async function syncMemberToFirebase(
  newMemberData: UserProfile,
): Promise<{
  success: boolean;
  isNew: boolean;
  memberId: string;
}> {
  try {
    await setDoc(doc(db, "members", newMemberData.id), newMemberData);

    return {
      success: true,
      isNew: true,
      memberId: newMemberData.id,
    };
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
