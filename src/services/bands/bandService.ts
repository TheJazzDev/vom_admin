import { doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { getBandsRef, getMembersRef } from "@/config/collectionRefs";
import { getFirebaseDb } from "@/config/firebase";

export const getAllBands = async (): Promise<Band[]> => {
  try {
    const bandsRef = getBandsRef();
    const bandsSnapshot = await getDocs(bandsRef);

    return bandsSnapshot.docs.map(
      (docSnap) =>
        ({
          id: docSnap.id,
          ...docSnap.data(),
        }) as Band,
    );
  } catch (error) {
    console.error("Error fetching bands:", error);
    throw new Error("Failed to fetch bands");
  }
};

export const getBandById = async (bandId: string): Promise<Band | null> => {
  try {
    const db = getFirebaseDb();
    const bandDoc = await getDoc(doc(db, "bands", bandId));

    if (!bandDoc.exists()) {
      return null;
    }

    return {
      id: bandDoc.id,
      ...bandDoc.data(),
    } as Band;
  } catch (error) {
    console.error("Error fetching band:", error);
    throw new Error("Failed to fetch band");
  }
};

export const getBandWithMembers = async (
  bandId: BandKeys,
): Promise<BandWithMembers | null> => {
  try {
    const band = await getBandById(bandId);

    if (!band) return null;

    const membersRef = getMembersRef();
    let members: UserProfile[] = [];

    if (band.id === "UNASSIGNED") {
      // Get members with empty or no bandKeys
      const unassignedQuery = query(
        membersRef,
        where("bandKeys", "in", [[], null]),
      );
      const unassignedSnapshot = await getDocs(unassignedQuery);
      members = unassignedSnapshot.docs.map(
        (docSnap) =>
          ({
            id: docSnap.id,
            ...docSnap.data(),
          }) as UserProfile,
      );
    } else {
      // Get members that have this bandId in their bandKeys array
      const membersQuery = query(
        membersRef,
        where("bandKeys", "array-contains", band.id),
      );
      const membersSnapshot = await getDocs(membersQuery);

      members = membersSnapshot.docs.map(
        (docSnap) =>
          ({
            id: docSnap.id,
            ...docSnap.data(),
          }) as UserProfile,
      );
    }

    return {
      ...band,
      members,
    };
  } catch (error) {
    console.error("Error fetching band with members:", error);
    throw new Error("Failed to fetch band with members");
  }
};

// bandService.ts
export const getBandsWithMembers = async (
  bandIds: BandKeys[],
): Promise<BandWithMembers[]> => {
  try {
    const bandsWithMembers = await Promise.all(
      bandIds.map((bandId) => getBandWithMembers(bandId)),
    );

    return bandsWithMembers.filter(
      (band): band is BandWithMembers => band !== null,
    );
  } catch (error) {
    console.error("Error fetching bands with members:", error);
    throw new Error("Failed to fetch bands with members");
  }
};
