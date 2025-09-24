import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/config";

interface DepartmentSummary {
  memberCount: number;
  leadership: {
    head?: string;
    assistant?: string;
    secretary?: string;
  };
}

interface UserProfile {
  id: string;
  title?: string;
  firstName: string;
  lastName: string;
  department: Array<{
    name: string;
    role: string;
  }>;
}

function calculateDepartmentSummary(
  members: UserProfile[],
  departmentKey: string,
): DepartmentSummary {
  const leadership: DepartmentSummary["leadership"] = {};

  members.forEach((member) => {
    // Find this member's role in this specific department
    const departmentData = member.department.find(
      (d) => d.name === departmentKey,
    );
    if (departmentData) {
      const fullName = `${member.title || ""} ${member.firstName} ${
        member.lastName
      }`.trim();

      switch (departmentData.role) {
        case "Head":
          leadership.head = fullName;
          break;
        case "Assistant":
          leadership.assistant = fullName;
          break;
        case "Secretary":
          leadership.secretary = fullName;
          break;
      }
    }
  });

  return {
    memberCount: members.length,
    leadership,
  };
}

export async function updateDepartmentStatistics(): Promise<{
  success: boolean;
  departmentsUpdated: number;
  errors: string[];
}> {
  const results: {
    success: boolean;
    departmentsUpdated: number;
    errors: string[];
  } = { success: true, departmentsUpdated: 0, errors: [] };

  try {
    console.log("Starting department statistics update...");

    const membersSnapshot = await getDocs(collection(db, "members"));
    const members = membersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as UserProfile[];

    console.log(
      `Processing ${members.length} members for department statistics...`,
    );

    // Debug: Check member structure
    console.log(
      "Sample member data:",
      members.slice(0, 2).map((m) => ({
        id: m.id,
        name: `${m.firstName} ${m.lastName}`,
        department: m.department,
        departmentLength: m.department?.length,
        departmentType: typeof m.department,
      })),
    );

    const departmentMemberMap = new Map<string, UserProfile[]>();

    members.forEach((member) => {
      if (member.department && member.department.length > 0) {
        member.department.forEach((departmentData) => {
          const departmentKey = departmentData.name;
          if (!departmentMemberMap.has(departmentKey)) {
            departmentMemberMap.set(departmentKey, []);
          }
          departmentMemberMap.get(departmentKey)?.push(member);
        });
      }
    });

    console.log(
      `Found members in ${departmentMemberMap.size} different departments`,
    );

    for (const [departmentKey, departmentMembers] of departmentMemberMap) {
      try {
        const departmentSummary = calculateDepartmentSummary(
          departmentMembers,
          departmentKey,
        );

        await updateDoc(doc(db, "departments", departmentKey), {
          memberCount: departmentSummary.memberCount,
          leadership: departmentSummary.leadership,
          lastUpdated: new Date().toISOString(),
        });

        results.departmentsUpdated++;
      } catch (departmentError: any) {
        results.errors.push(
          `Failed to update ${departmentKey}: ${departmentError.message}`,
        );
      }
    }

    await updateEmptyDepartments(departmentMemberMap);
  } catch (error: any) {
    console.error("Error in department statistics update:", error);
    results.success = false;
    results.errors.push(`General error: ${error.message}`);
  }

  return results;
}

async function updateEmptyDepartments(
  departmentMemberMap: Map<string, UserProfile[]>,
) {
  try {
    const departmentsSnapshot = await getDocs(collection(db, "departments"));

    for (const departmentDoc of departmentsSnapshot.docs) {
      const departmentKey = departmentDoc.id;

      if (!departmentMemberMap.has(departmentKey)) {
        await updateDoc(doc(db, "departments", departmentKey), {
          memberCount: 0,
          leadership: {},
          lastUpdated: new Date().toISOString(),
        });
      }
    }
  } catch (error: any) {
    console.error("Error updating empty departments:", error);
  }
}
