import { doc, setDoc, writeBatch } from "firebase/firestore";
import { getFirebaseDb } from "@/config/firebase";
import { BANDS_CONFIG } from "@/constants/directory/BANDS_CONFIG";
import { DEPARTMENTS_CONFIG } from "@/constants/directory/DEPARTMENTS_CONFIG";
import { BandKeysEnum } from "@/enums";

export async function initializeBandsCollection() {
  const db = getFirebaseDb();
  const batch = writeBatch(db);

  Object.values(BANDS_CONFIG).forEach((band) => {
    const bandRef = doc(db, "bands", band.id);

    // Handle choir differently
    const leadership =
      band.id === BandKeysEnum.CHOIR
        ? {
            choirMaster: null,
            assistantChoirMaster: null,
            secretary: null,
          }
        : {
            captain: null,
            vice: null,
            secretary: null,
          };

    batch.set(bandRef, {
      ...band,
      displayName: `${band.name} Band`,
      createdAt: new Date().toISOString(),
      isActive: true,
      memberCount: 0,
      leadership,
    });
  });

  await batch.commit();
  console.log("Bands collection initialized with full configuration");
}

// Initialize Departments Collection
export async function initializeDepartmentsCollection() {
  const db = getFirebaseDb();
  const batch = writeBatch(db);

  Object.values(DEPARTMENTS_CONFIG).forEach((dept) => {
    const deptRef = doc(db, "departments", dept.id);
    batch.set(deptRef, {
      ...dept,
      displayName: `${dept.name} Department`,
      createdAt: new Date().toISOString(),
      isActive: true,
      memberCount: 0,
      leadership: {
        head: null,
        assistant: null,
        secretary: null,
      },
    });
  });

  await batch.commit();
  console.log("Departments collection initialized with full configuration");
}

export async function updateBandLeadership(
  bandId: string,
  leader1?: string,
  leader2?: string,
  secretary?: string,
) {
  const db = getFirebaseDb();
  const bandRef = doc(db, "bands", bandId);
  const updateData: any = { leadership: {} };

  if (bandId === "choir") {
    if (leader1) updateData.leadership.choirMaster = leader1;
    if (leader2) updateData.leadership.assistantChoirMaster = leader2;
  } else {
    if (leader1) updateData.leadership.captain = leader1;
    if (leader2) updateData.leadership.vice = leader2;
  }

  if (secretary) updateData.leadership.secretary = secretary;

  await setDoc(bandRef, updateData, { merge: true });
}

// Helper function to update department leadership
export async function updateDepartmentLeadership(
  deptId: string,
  head?: string,
  assistant?: string,
  secretary?: string,
) {
  const db = getFirebaseDb();
  const deptRef = doc(db, "departments", deptId);
  const updateData: any = { leadership: {} };

  if (head) updateData.leadership.head = head;
  if (assistant) updateData.leadership.assistant = assistant;
  if (secretary) updateData.leadership.secretary = secretary;

  await setDoc(deptRef, updateData, { merge: true });
}

export async function initializeCollections() {
  try {
    await initializeBandsCollection();
    await initializeDepartmentsCollection();
    console.log("All collections initialized successfully");
    return {
      bandsCreated: Object.keys(BANDS_CONFIG).length,
      departmentsCreated: Object.keys(DEPARTMENTS_CONFIG).length,
    };
  } catch (error) {
    console.error("Error initializing collections:", error);
    throw error;
  }
}
