import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { memberService } from "@/services/memberService";

// Query Keys
export const memberKeys = {
  all: ["members"] as const,
  lists: () => [...memberKeys.all, "list"] as const,
  // biome-ignore lint/suspicious/noExplicitAny: ignore
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
    queryFn: memberService.getAllMembers,
    staleTime: 5 * 60 * 1000,
  });
};

// Get single member
export const useMember = (memberId: string) => {
  return useQuery({
    queryKey: memberKeys.detail(memberId),
    queryFn: () => memberService.getMemberById(memberId),
    enabled: !!memberId,
  });
};

// Create member mutation
export const useCreateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: memberService.createMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: memberKeys.all });
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
    mutationFn: ({
      memberId,
      data,
    }: {
      memberId: string;
      data: MemberEditForm;
    }) => memberService.updateMember(memberId, data),
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
//     onSuccess: (_, memberId) => {
//       // Remove from all relevant queries
//       queryClient.invalidateQueries({ queryKey: memberKeys.all });
//     },
//   });
// };
