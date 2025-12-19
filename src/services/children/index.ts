import { doc, getDoc, setDoc } from "firebase/firestore";
import { getFirebaseDb } from "@/config/firebase";

export async function findExistingChildById(childId: string): Promise<boolean> {
  try {
    const db = getFirebaseDb();
    const docRef = doc(db, "children", childId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (_error) {
    console.error("Error checking");

    return false;
  }
}

export async function syncChildToFirebase(childData: ChildrenProfile): Promise<{
  success: boolean;
  isNew: boolean;
  childId: string;
}> {
  try {
    const db = getFirebaseDb();
    const childExists = await findExistingChildById(childData.id);

    if (childExists) {
      // Child exists - update but preserve avatar and creation date
      const existingDoc = await getDoc(doc(db, "children", childData.id));
      const existingData = existingDoc.data() as ChildrenProfile;

      const updateData: ChildrenProfile = {
        ...childData,
        avatar: existingData?.avatar || childData.avatar,
        createdAt: existingData?.createdAt || childData.createdAt,
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "children", childData.id), updateData);

      return {
        success: true,
        isNew: false,
        childId: childData.id,
      };
    } else {
      // New child
      await setDoc(doc(db, "children", childData.id), childData);

      return {
        success: true,
        isNew: true,
        childId: childData.id,
      };
    }
  } catch (error: any) {
    console.error(`Failed to sync child:`, error);
    return {
      success: false,
      isNew: false,
      childId: childData.id,
    };
  }
}

// Updated batch sync function
export async function syncChildrenToFirebase(
  children: ChildrenProfile[],
): Promise<{
  success: number;
  failed: number;
  newChildren: number;
  updatedChildren: number;
  linkedToParents: number;
  errors: string[];
}> {
  const results: {
    success: number;
    failed: number;
    newChildren: number;
    updatedChildren: number;
    linkedToParents: number;
    errors: string[];
  } = {
    success: 0,
    failed: 0,
    newChildren: 0,
    updatedChildren: 0,
    linkedToParents: 0,
    errors: [],
  };

  for (const child of children) {
    try {
      const result = await syncChildToFirebase(child);

      if (result.success) {
        results.success++;
        if (result.isNew) {
          results.newChildren++;
        } else {
          results.updatedChildren++;
        }

        // Count if child was linked to any parent
        if (child.fatherParentId || child.motherParentId) {
          results.linkedToParents++;
        }
      } else {
        results.failed++;
        results.errors.push(
          `Failed to sync ${child.firstName} ${child.lastName}`,
        );
      }
    } catch (error: any) {
      results.failed++;
      results.errors.push(
        `${child.firstName} ${child.lastName}: ${error.message}`,
      );
    }
  }

  return results;
}
