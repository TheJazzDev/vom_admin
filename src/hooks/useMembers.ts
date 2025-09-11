import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  createMember,
  getAllMembers,
  getMemberById,
  updateMember,
} from "@/services/memberService";

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
      router.push("/directory/members");
    },
    onError: (error) => {
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
      queryClient.invalidateQueries({ queryKey: memberKeys.lists() });
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
