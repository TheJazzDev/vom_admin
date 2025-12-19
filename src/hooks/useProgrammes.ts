import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  getAllProgrammes,
  getCurrentProgrammes,
  getDraftProgrammes,
  getPastProgrammes,
  getProgrammeById,
  getProgrammeStats,
  getRecentProgrammes,
  getUpcomingProgrammes,
  saveProgramme,
  updateProgramme,
} from "@/services/programmeService";

export const programmesKeys = {
  all: ["programmes"] as const,
  lists: () => [...programmesKeys.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...programmesKeys.lists(), filters] as const,
  details: () => [...programmesKeys.all, "detail"] as const,
  detail: (id: string) => [...programmesKeys.details(), id] as const,
  search: (term: string) => [...programmesKeys.all, "search", term] as const,
  drafts: () => [...programmesKeys.all, "drafts"] as const,
  published: () => [...programmesKeys.all, "published"] as const,
  upcoming: () => [...programmesKeys.all, "upcoming"] as const,
  past: () => [...programmesKeys.all, "past"] as const,
  current: () => [...programmesKeys.all, "current"] as const,
  stats: () => [...programmesKeys.all, "stats"] as const,
  recent: (limit: number) => [...programmesKeys.all, "recent", limit] as const,
};

// Get programme by ID hook
export const useProgrammeById = (id: string | undefined) => {
  return useQuery({
    queryKey: programmesKeys.detail(String(id)),
    queryFn: () => getProgrammeById(String(id)),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// All programmes
export const useProgrammes = () =>
  useQuery({
    queryKey: programmesKeys.lists(),
    queryFn: getAllProgrammes,
    staleTime: 5 * 60 * 1000,
  });

// Upcoming programmes
export const useUpcomingProgrammes = () =>
  useQuery({
    queryKey: programmesKeys.upcoming(),
    queryFn: getUpcomingProgrammes,
    staleTime: 5 * 60 * 1000,
  });

// Draft programmes
export const useDraftProgrammes = () =>
  useQuery({
    queryKey: programmesKeys.drafts(),
    queryFn: getDraftProgrammes,
    staleTime: 5 * 60 * 1000,
  });

// Past programmes
export const usePastProgrammes = () =>
  useQuery({
    queryKey: programmesKeys.past(),
    queryFn: getPastProgrammes,
    staleTime: 5 * 60 * 1000,
  });

// Current programmes
export const useCurrentProgrammes = () =>
  useQuery({
    queryKey: programmesKeys.current(),
    queryFn: getCurrentProgrammes,
    staleTime: 60 * 1000, // current day → keep fresher
  });

// Programme statistics - Updated with proper staleTime
export const useProgrammeStats = () => {
  return useQuery({
    queryKey: programmesKeys.stats(),
    queryFn: getProgrammeStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Recent programmes - Updated with proper staleTime
export const useRecentProgrammes = (limit = 5) => {
  return useQuery({
    queryKey: programmesKeys.recent(limit),
    queryFn: () => getRecentProgrammes(limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Save programme - Updated invalidation logic
export const useSaveProgramme = () => {
  const { user } = useAuth();
  const userId = user?.id || "";
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProgrammeFormData) => saveProgramme(data, userId),
    onSuccess: (_programmeId, variables) => {
      // Invalidate all programme-related queries
      queryClient.invalidateQueries({ queryKey: programmesKeys.all });

      // Invalidate specific queries based on status
      if (variables.status === "draft") {
        queryClient.invalidateQueries({ queryKey: programmesKeys.drafts() });
      } else if (variables.status === "upcoming") {
        queryClient.invalidateQueries({ queryKey: programmesKeys.upcoming() });
      }

      // Invalidate stats and recent (they depend on all programmes)
      queryClient.invalidateQueries({ queryKey: programmesKeys.stats() });
      queryClient.invalidateQueries({ queryKey: programmesKeys.recent(5) });

      // Show success message
      if (variables.status === "draft") {
        toast.info("Programme saved as draft");
      } else {
        toast.success("Programme published successfully");
      }

      // Navigate based on status
      if (variables.status === "draft") {
        router.push("/programmes/drafts");
      } else {
        router.push("/programmes/upcoming");
      }
    },
    onError: (error) => {
      console.error("Failed to save programme:", error);
      toast.error("Failed to save programme. Please try again.");
    },
  });
};

// Update programme hook
export const useUpdateProgramme = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ProgrammeFormData>;
    }) => updateProgramme(id, data),
    onSuccess: (_, variables) => {
      // Invalidate all programme queries
      queryClient.invalidateQueries({ queryKey: programmesKeys.all });

      // Invalidate specific programme
      queryClient.invalidateQueries({
        queryKey: programmesKeys.detail(variables.id),
      });

      // Invalidate stats and recent
      queryClient.invalidateQueries({ queryKey: programmesKeys.stats() });
      queryClient.invalidateQueries({ queryKey: programmesKeys.recent(5) });

      toast.info("Programme updated successfully");

      // Navigate based on status
      if (variables.data.status === "draft") {
        router.push("/programmes/drafts");
      } else {
        router.push("/programmes/upcoming");
      }
    },
    onError: (error) => {
      console.error("Failed to update programme:", error);
      toast.error("Failed to update programme. Please try again.");
    },
  });
};
