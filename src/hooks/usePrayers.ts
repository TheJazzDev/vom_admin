import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllPrayers,
  getActivePrayers,
  getTodaysPrayer,
  getPrayerById,
  createPrayer,
  updatePrayer,
  deletePrayer,
  getPrayerStats,
} from "@/services/prayerService";

// Query keys
export const prayerKeys = {
  all: ["prayers"] as const,
  lists: () => [...prayerKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...prayerKeys.lists(), filters] as const,
  active: () => [...prayerKeys.all, "active"] as const,
  today: () => [...prayerKeys.all, "today"] as const,
  detail: (id: string) => [...prayerKeys.all, "detail", id] as const,
  stats: () => [...prayerKeys.all, "stats"] as const,
};

// Queries
export const usePrayers = () => {
  return useQuery({
    queryKey: prayerKeys.lists(),
    queryFn: getAllPrayers,
    staleTime: 5 * 60 * 1000,
  });
};

export const useActivePrayers = () => {
  return useQuery({
    queryKey: prayerKeys.active(),
    queryFn: getActivePrayers,
    staleTime: 5 * 60 * 1000,
  });
};

export const useTodaysPrayer = () => {
  return useQuery({
    queryKey: prayerKeys.today(),
    queryFn: getTodaysPrayer,
    staleTime: 5 * 60 * 1000,
  });
};

export const usePrayerById = (id: string) => {
  return useQuery({
    queryKey: prayerKeys.detail(id),
    queryFn: () => getPrayerById(id),
    enabled: !!id,
  });
};

export const usePrayerStats = () => {
  return useQuery({
    queryKey: prayerKeys.stats(),
    queryFn: getPrayerStats,
    staleTime: 5 * 60 * 1000,
  });
};

// Mutations
export const useCreatePrayer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPrayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: prayerKeys.all });
    },
  });
};

export const useUpdatePrayer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<DailyPrayer> }) =>
      updatePrayer(id, updates),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: prayerKeys.all });
      queryClient.invalidateQueries({ queryKey: prayerKeys.detail(id) });
    },
  });
};

export const useDeletePrayer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePrayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: prayerKeys.all });
    },
  });
};
