/**
 * Utility functions for exporting data to CSV format
 */

/**
 * Convert an array of objects to CSV format
 */
function arrayToCSV(data: any[], headers: string[]): string {
  const csvRows: string[] = [];

  // Add headers
  csvRows.push(headers.join(","));

  // Add data rows
  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header];

      // Handle different data types
      if (value === null || value === undefined) {
        return "";
      }

      // Convert arrays to string
      if (Array.isArray(value)) {
        return `"${value.join("; ")}"`;
      }

      // Escape quotes and wrap in quotes if contains comma or quote
      const stringValue = String(value);
      if (stringValue.includes(",") || stringValue.includes('"')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }

      return stringValue;
    });
    csvRows.push(values.join(","));
  }

  return csvRows.join("\n");
}

/**
 * Download CSV file
 */
function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export members to CSV
 */
export function exportMembersToCSV(members: UserProfile[]): void {
  const headers = [
    "id",
    "firstName",
    "middleName",
    "lastName",
    "email",
    "primaryPhone",
    "secondaryPhone",
    "gender",
    "dob",
    "maritalStatus",
    "occupation",
    "address",
    "title",
    "position",
    "band",
    "bandKeys",
    "department",
    "departmentKeys",
    "ministry",
    "joinDate",
    "status",
    "verified",
    "emailVerified",
    "phoneVerified",
    "accountType",
    "createdAt",
  ];

  // Transform members data to include readable band names
  const transformedMembers = members.map((member) => ({
    ...member,
    band: member.band?.map((b) => b.name).join("; ") || "",
    bandKeys: member.bandKeys?.join("; ") || "",
    department: member.department?.map((d: any) => d.name).join("; ") || "",
    departmentKeys: member.departmentKeys?.join("; ") || "",
    ministry: member.ministry?.join("; ") || "",
    position: member.position?.join("; ") || "",
  }));

  const csvContent = arrayToCSV(transformedMembers, headers);
  const timestamp = new Date().toISOString().split("T")[0];
  downloadCSV(csvContent, `members-export-${timestamp}.csv`);
}

/**
 * Export bands to CSV
 */
export function exportBandsToCSV(bands: Band[]): void {
  const headers = [
    "id",
    "name",
    "displayName",
    "description",
    "memberCount",
    "isActive",
    "meetingDay",
    "meetingTime",
    "createdAt",
  ];

  // Transform bands data
  const transformedBands = bands.map((band) => ({
    id: band.id,
    name: band.name,
    displayName: band.displayName,
    description: band.description,
    memberCount: band.memberCount,
    isActive: band.isActive,
    meetingDay: band.meetingDay || "",
    meetingTime: band.meetingTime || "",
    createdAt: band.createdAt,
  }));

  const csvContent = arrayToCSV(transformedBands, headers);
  const timestamp = new Date().toISOString().split("T")[0];
  downloadCSV(csvContent, `bands-export-${timestamp}.csv`);
}

/**
 * Export band with members to CSV
 */
export function exportBandWithMembersToCSV(band: BandWithMembers): void {
  const headers = [
    "id",
    "firstName",
    "middleName",
    "lastName",
    "email",
    "primaryPhone",
    "gender",
    "role",
    "status",
  ];

  // Transform members data to include their role in this band
  const transformedMembers = band.members.map((member) => {
    const bandData = member.band?.find((b) => b.name === band.id);
    return {
      id: member.id,
      firstName: member.firstName,
      middleName: member.middleName,
      lastName: member.lastName,
      email: member.email,
      primaryPhone: member.primaryPhone,
      gender: member.gender,
      role: bandData?.role || "Member",
      status: member.status,
    };
  });

  const csvContent = arrayToCSV(transformedMembers, headers);
  const timestamp = new Date().toISOString().split("T")[0];
  const bandName = band.displayName.replace(/\s+/g, "-").toLowerCase();
  downloadCSV(csvContent, `${bandName}-members-${timestamp}.csv`);
}
