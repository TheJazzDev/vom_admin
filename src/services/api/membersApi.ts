export interface MembersApiResponse {
  success: boolean;
  data?: UserProfile[];
  count?: number;
  error?: string;
  message?: string;
}

export interface MemberApiResponse {
  success: boolean;
  data?: UserProfile;
  error?: string;
  message?: string;
}

// GET /api/members - Fetch all members with optional filters
export async function fetchMembers(params?: {
  status?: string;
  band?: string;
  department?: string;
}): Promise<UserProfile[]> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append("status", params.status);
    if (params?.band) queryParams.append("band", params.band);
    if (params?.department) queryParams.append("department", params.department);

    const url = `/api/members${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await fetch(url);
    const data: MembersApiResponse = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to fetch members");
    }

    return data.data || [];
  } catch (error) {
    console.error("Error fetching members:", error);
    throw error;
  }
}

// GET /api/members/[id] - Fetch single member
export async function fetchMemberById(id: string): Promise<UserProfile | null> {
  try {
    const response = await fetch(`/api/members/${id}`);
    const data: MemberApiResponse = await response.json();

    if (!data.success) {
      if (response.status === 404) return null;
      throw new Error(data.error || "Failed to fetch member");
    }

    return data.data || null;
  } catch (error) {
    console.error("Error fetching member:", error);
    throw error;
  }
}

// POST /api/members - Create new member
export async function createMemberApi(memberData: any): Promise<UserProfile> {
  try {
    const response = await fetch("/api/members", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(memberData),
    });

    const data: MemberApiResponse = await response.json();

    if (!data.success || !data.data) {
      throw new Error(data.error || "Failed to create member");
    }

    return data.data;
  } catch (error) {
    console.error("Error creating member:", error);
    throw error;
  }
}

// PATCH /api/members/[id] - Update member
export async function updateMemberApi(
  id: string,
  updates: any,
): Promise<UserProfile> {
  try {
    const response = await fetch(`/api/members/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    const data: MemberApiResponse = await response.json();

    if (!data.success || !data.data) {
      throw new Error(data.error || "Failed to update member");
    }

    return data.data;
  } catch (error) {
    console.error("Error updating member:", error);
    throw error;
  }
}

// DELETE /api/members/[id] - Delete member
export async function deleteMemberApi(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/members/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to delete member");
    }
  } catch (error) {
    console.error("Error deleting member:", error);
    throw error;
  }
}

// GET /api/export/members - Export members to CSV
export async function exportMembersToCSV(params?: {
  status?: string;
  band?: string;
  department?: string;
}): Promise<void> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append("status", params.status);
    if (params?.band) queryParams.append("band", params.band);
    if (params?.department) queryParams.append("department", params.department);

    const url = `/api/export/members${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

    // Open in new window to trigger download
    window.open(url, "_blank");
  } catch (error) {
    console.error("Error exporting members:", error);
    throw error;
  }
}
