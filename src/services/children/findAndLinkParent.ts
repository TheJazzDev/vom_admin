import { getDocs, query, where } from "firebase/firestore";
import { getMembersRef } from "@/config/collectionRefs";
import { formatPhoneNumber } from "./utils";

async function findParentByPhone(phone: string): Promise<string | null> {
  try {
    const formattedPhone = formatPhoneNumber(phone);
    if (!formattedPhone) return null;

    const membersRef = getMembersRef();

    // Try primary phone first
    const primaryQuery = query(
      membersRef,
      where("primaryPhone", "==", formattedPhone),
    );
    const primarySnapshot = await getDocs(primaryQuery);

    if (!primarySnapshot.empty) {
      return primarySnapshot.docs[0].id;
    }

    // Try secondary phone
    const secondaryQuery = query(
      membersRef,
      where("secondaryPhone", "==", formattedPhone),
    );
    const secondarySnapshot = await getDocs(secondaryQuery);

    if (!secondarySnapshot.empty) {
      return secondarySnapshot.docs[0].id;
    }

    return null;
  } catch (error) {
    console.error("Error finding parent by phone:", error);
    return null;
  }
}

// Parse parent phones and link to parents
export async function linkToParents(parentPhonesStr: string): Promise<{
  fatherParentId?: string;
  motherParentId?: string;
  parentPhones: string[];
}> {
  const result = {
    parentPhones: [] as string[],
  };

  if (!parentPhonesStr || !parentPhonesStr.trim()) {
    return result;
  }

  // Split by comma and clean up
  const phones = parentPhonesStr
    .split(",")
    .map((p) => p.trim())
    .filter((p) => p);
  result.parentPhones = phones;

  if (phones.length === 1) {
    // Single phone - this is the mother
    const motherId = await findParentByPhone(phones[0]);
    if (motherId) {
      return { ...result, motherParentId: motherId };
    }
  } else if (phones.length === 2) {
    // Two phones - first is father, second is mother
    const fatherId = await findParentByPhone(phones[0]);
    const motherId = await findParentByPhone(phones[1]);

    return {
      ...result,
      fatherParentId: fatherId || undefined,
      motherParentId: motherId || undefined,
    };
  }

  return result;
}
