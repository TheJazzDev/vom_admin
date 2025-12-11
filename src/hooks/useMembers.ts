import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  createMember,
  getAllMembers,
  getMemberById,
  updateMember,
} from "@/services/members/memberService";

// Query Keys
export const memberKeys = {
  all: ["members"] as const,
  lists: () => [...memberKeys.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...memberKeys.lists(), filters] as const,
  details: () => [...memberKeys.all, "detail"] as const,
  detail: (id: string) => [...memberKeys.details(), id] as const,
  search: (term: string) => [...memberKeys.all, "search", term] as const,
};

// Get all members
export const useMembers = () => {
  return useQuery({
    queryKey: memberKeys.lists(),
    queryFn: getAllMembers,
    staleTime: 5 * 60 * 1000,
  });
};

// Get single member
export const useMember = (id: string) => {
  return useQuery({
    queryKey: memberKeys.detail(id),
    queryFn: () => getMemberById(id),
    enabled: !!id,
  });
};

// Create member mutation
export const useCreateMember = () => {
  const router = useRouter();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: memberKeys.all });
      toast.success("Member created successfully!");
      router.push("/directory/members");
    },
    onError: (error) => {
      toast.error(`Failed to create member: ${error}`);
      console.error("Failed to create member:", error);
    },
  });
};

// Update member mutation
export const useEditMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MemberEditForm }) =>
      updateMember(id, data),
    onSuccess: () => {
      toast.info("Member updated successfully!");
      queryClient.invalidateQueries({ queryKey: memberKeys.lists() });
    },
  });
};

// Export members to CSV
export const useExportMembers = () => {
  return useMutation({
    mutationFn: async (filters?: Record<string, any>) => {
      // Get all members
      const members = await getAllMembers();

      // Apply filters if provided
      let filteredMembers = members;
      if (filters) {
        if (filters.status) {
          filteredMembers = filteredMembers.filter(
            (m) => m.status === filters.status,
          );
        }
        if (filters.band) {
          filteredMembers = filteredMembers.filter((m) =>
            m.band?.some((b: any) => b.name === filters.band),
          );
        }
        if (filters.department) {
          filteredMembers = filteredMembers.filter((m) =>
            m.department?.some((d: any) => d.name === filters.department),
          );
        }
      }

      // Convert to CSV
      const headers = [
        "First Name",
        "Last Name",
        "Email",
        "Phone",
        "Gender",
        "Status",
        "Bands",
        "Departments",
        "Date Joined",
      ];

      const csvRows = [
        headers.join(","),
        ...filteredMembers.map((member) =>
          [
            member.firstName || "",
            member.lastName || "",
            member.email || "",
            member.phone || "",
            member.gender || "",
            member.status || "",
            member.band?.map((b: any) => b.name).join("; ") || "",
            member.department?.map((d: any) => d.name).join("; ") || "",
            member.createdAt
              ? new Date(member.createdAt).toLocaleDateString()
              : "",
          ]
            .map((field) => `"${field}"`)
            .join(","),
        ),
      ];

      const csvContent = csvRows.join("\n");

      // Create download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `members_export_${new Date().toISOString().split("T")[0]}.csv`,
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return filteredMembers;
    },
  });
};

// // Delete member mutation (soft delete)
// export const useDeleteMember = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: memberService.deleteMember,
//     onSuccess: (_, id) => {
//       // Remove from all relevant queries
//       queryClient.invalidateQueries({ queryKey: memberKeys.all });
//     },
//   });
// };
