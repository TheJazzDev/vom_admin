import { BandKeysEnum } from "@/enums";
import { parsePosition } from "./parseFields";
import {
  formatPhone,
  generateMemberId,
  mapBandName,
  mapDepartmentName,
} from "./utils";

// Fixed parseSheetRowToMember function
export function parseSheetRowToMember(row: any[]): UserProfile {
  const [
    _serial,
    title,
    firstName,
    middleName,
    lastName,
    gender,
    maritalStatus,
    email,
    primaryPhone,
    secondaryPhone,
    address,
    occupation,
    dob,
    position,
    department,
    band,
    memberSince,
  ] = row;

  console.log(
    `Processing ${firstName} ${lastName} - Position: "${position}", Band: "${band}"`,
  );

  // Generate member ID
  const memberId = generateMemberId(firstName || "", lastName || "", dob || "");

  // Parse position for roles
  const parsed = parsePosition(position || "");

  // Handle band column separately - ADD ALL bands from column
  if (band?.trim()) {
    const bandNames = band
      .split(",")
      .map((b: string) => b.trim())
      .filter((b: string) => b);

    for (const bandName of bandNames) {
      const bandKey = mapBandName(bandName);
      if (bandKey) {
        // Check if this band already exists from position parsing
        const existingBandIndex = parsed.bands.findIndex(
          (b) => b.name === bandKey,
        );

        if (existingBandIndex >= 0) {
          // Band exists from position - keep the role from position (likely has a specific role)
        } else {
          // Band doesn't exist - add as Member
          parsed.bands.push({ name: bandKey, role: "Member" });
        }
      }
    }
  }

  // Handle department column separately
  if (department?.trim()) {
    const deptNames = department
      .split(",")
      .map((d: string) => d.trim())
      .filter((d: string) => d);

    for (const deptName of deptNames) {
      const deptKey = mapDepartmentName(deptName);
      if (deptKey) {
        const existingDeptIndex = parsed.departments.findIndex(
          (d) => d.name === deptKey,
        );

        if (existingDeptIndex >= 0) {
          // Department exists from position - keep the role from position
        } else {
          // Department doesn't exist - add as Member
          parsed.departments.push({ name: deptKey, role: "Member" });
        }
      }
    }
  }

  // If member has no bands at all, assign to UNASSIGNED
  if (parsed.bands.length === 0) {
    parsed.bands.push({ name: BandKeysEnum.UNASSIGNED, role: "Member" });
  }

  const bandKeys = parsed.bands.map((band) => band.name);
  const departmentKeys = parsed.departments.map((dept) => dept.name);

  return {
    id: memberId,
    uid: "",
    avatar: "",
    firstName: firstName || "",
    middleName: middleName || "",
    lastName: lastName || "",
    email: email?.includes("@") ? email : "",
    title: title || "",
    position: parsed.positions,
    address: address || "",
    joinDate: memberSince || "",
    createdAt: new Date().toISOString(),
    status: "active",
    verified: false,
    gender: gender?.toLowerCase() === "male" ? "male" : "female",
    dob: dob || "",
    occupation: occupation || "",
    maritalStatus: mapMaritalStatus(maritalStatus),
    band: parsed.bands,
    bandKeys: bandKeys,
    departmentKeys: departmentKeys,
    department: parsed.departments,
    ministry: parsed.ministries,
    primaryPhone: formatPhone(primaryPhone),
    secondaryPhone: secondaryPhone ? formatPhone(secondaryPhone) : "",
    authType: "",
    hasPassword: false,
    emailVerified: false,
    phoneVerified: false,
    accountType: "member",
    lastLoginAt: "",
  };
}

function mapMaritalStatus(status: string): MaritalStatus {
  if (!status) return "single";
  const lower = status.toLowerCase();
  if (lower.includes("married")) return "married";
  if (lower.includes("divorced")) return "divorced";
  if (lower.includes("widow")) return "widowed";
  if (lower.includes("separated")) return "separated";
  return "single";
}
