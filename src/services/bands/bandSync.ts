import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { getFirebaseDb } from "@/config/firebase";

interface BandSummary {
  memberCount: number;
  leadership: {
    captain?: string;
    viceCaptain?: string;
    secretary?: string;
    choirMaster?: string;
    assistantChoirMaster?: string;
  };
}

function calculateBandSummary(
  members: UserProfile[],
  bandKey: string,
): BandSummary {
  const leadership: BandSummary["leadership"] = {};

  members.forEach((member) => {
    // Find this member's role in this specific band
    const bandData = member.band.find((b: BandKeys) => b.name === bandKey);
    if (bandData) {
      const fullName =
        `${member.title} ${member.firstName} ${member.lastName}`.trim();

      switch (bandData.role) {
        case "Captain":
          leadership.captain = fullName;
          break;
        case "Vice Captain":
          leadership.viceCaptain = fullName;
          break;
        case "Secretary":
          leadership.secretary = fullName;
          break;
        case "Choir Master":
          leadership.choirMaster = fullName;
          break;
        case "Assistant Choir Master":
          leadership.assistantChoirMaster = fullName;
          break;
      }
    }
  });

  return {
    memberCount: members.length,
    leadership,
  };
}

export async function updateBandStatistics(): Promise<{
  success: boolean;
  bandsUpdated: number;
  errors: string[];
}> {
  const results: {
    success: boolean;
    bandsUpdated: number;
    errors: string[];
  } = {
    success: true,
    bandsUpdated: 0,
    errors: [],
  };

  try {
    const db = getFirebaseDb();
    console.log("Starting band statistics update...");

    // Get all members
    const membersSnapshot = await getDocs(collection(db, "members"));
    const members = membersSnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as UserProfile[];

    console.log(`Processing ${members.length} members for band statistics...`);

    // Group members by band
    const bandMemberMap = new Map<string, UserProfile[]>();

    members.forEach((member) => {
      if (member.band && member.band.length > 0) {
        member.band.forEach((bandData: BandData) => {
          const bandKey = bandData.name;
          if (!bandMemberMap.has(bandKey)) {
            bandMemberMap.set(bandKey, []);
          }
          bandMemberMap.get(bandKey)?.push(member);
        });
      }
    });

    console.log(`Found members in ${bandMemberMap.size} different bands`);

    // Update each band document
    for (const [bandKey, bandMembers] of bandMemberMap) {
      try {
        const bandSummary = calculateBandSummary(bandMembers, bandKey);

        // Update only memberCount and leaders
        await updateDoc(doc(db, "bands", bandKey), {
          memberCount: bandSummary.memberCount,
          leadership: bandSummary.leadership,
          lastUpdated: new Date().toISOString(),
        });

        results.bandsUpdated++;
      } catch (bandError: any) {
        results.errors.push(
          `Failed to update ${bandKey}: ${bandError.message}`,
        );
      }
    }

    // Also update bands with zero members
    await updateEmptyBands(bandMemberMap);
  } catch (error: any) {
    console.error("Error in band statistics update:", error);
    results.success = false;
    results.errors.push(`General error: ${error.message}`);
  }

  return results;
}

async function updateEmptyBands(bandMemberMap: Map<string, UserProfile[]>) {
  try {
    const db = getFirebaseDb();
    const bandsSnapshot = await getDocs(collection(db, "bands"));

    for (const bandDoc of bandsSnapshot.docs) {
      const bandKey = bandDoc.id;

      if (!bandMemberMap.has(bandKey)) {
        await updateDoc(doc(db, "bands", bandKey), {
          memberCount: 0,
          leadership: {},
          lastUpdated: new Date().toISOString(),
        });
      }
    }
  } catch (error: any) {
    console.error("Error updating empty bands:", error);
  }
}
