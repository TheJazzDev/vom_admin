import { getDocs, query, where } from "firebase/firestore";
import { membersRef } from "@/config";
import { BAND_CONFIG } from "@/constants/directory/bandConfig";
import { BandKeys } from "@/enums";

export const getAllBandsWithMembers = async (): Promise<
  BandWithDetailsProps[]
> => {
  const bandsArray: BandWithDetailsProps[] = [];

  for (const [bandKey, config] of Object.entries(BAND_CONFIG)) {
    if (bandKey === BandKeys.UNASSIGNED) continue;

    const q = query(
      membersRef,
      where("bandKeys", "array-contains", bandKey as BandKeys),
    );
    const snapshot = await getDocs(q);
    const members = snapshot.docs.map((doc) => doc.data() as UserProfile);

    bandsArray.push({
      ...config,
      memberCount: members.length,
      members,
    });
  }

  // Handle UNASSIGNED members
  const qUnassigned = query(membersRef, where("bandKeys", "==", []));
  const snapshotUnassigned = await getDocs(qUnassigned);
  const unassignedMembers = snapshotUnassigned.docs.map(
    (doc) => doc.data() as UserProfile,
  );

  bandsArray.push({
    ...BAND_CONFIG[BandKeys.UNASSIGNED],
    memberCount: unassignedMembers.length,
    members: unassignedMembers,
  });

  return bandsArray;
};

export const getMembersByBand = async (bandKey: BandKeys) => {
  const q = query(membersRef, where("bandKeys", "array-contains", bandKey));
  console.log(bandKey);
  const snapshot = await getDocs(q);
  const bandMetaData = BAND_CONFIG[bandKey];
  const members = snapshot.docs.map((doc) => doc.data());

  return {
    members,
    meta: bandMetaData,
  };
};

export const getMembersByBands = async (bandKeys: BandKeys[]) => {
  const results = await Promise.all(
    bandKeys.map(async (bandKey) => {
      const q = query(membersRef, where("bandKeys", "array-contains", bandKey));
      const snapshot = await getDocs(q);

      return {
        bandKey,
        members: snapshot.docs.map((doc) => doc.data()),
      };
    }),
  );

  return results;
};

// export const getMembersByBands = async (bandKeys: BandKeys[]) => {
//   const q = query(
//     membersRef,
//     where('bandKeys', 'array-contains-any', bandKeys)
//   );

//   const snapshot = await getDocs(q);

//   const grouped: Record<BandKeys, any[]> = {} as Record<BandKeys, any[]>;

//   snapshot.forEach((doc) => {
//     const data = doc.data();
//     const keys: BandKeys[] = data.bandKeys ?? [];

//     keys.forEach((key) => {
//       if (bandKeys.includes(key)) {
//         if (!grouped[key]) grouped[key] = [];
//         grouped[key].push(data);
//       }
//     });
//   });

//   return grouped;
// };
