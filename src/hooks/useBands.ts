import { useQuery } from "@tanstack/react-query";
import type { BandKeys } from "@/enums";
import {
  getAllBandsWithMembers,
  getMembersByBand,
  getMembersByBands,
} from "@/services/bandService";

export const bandsKeys = {
  all: ["bands"] as const,
  lists: () => [...bandsKeys.all, "list"] as const,

  list: (filters: Record<string, any>) =>
    [...bandsKeys.lists(), filters] as const,
  details: () => [...bandsKeys.all, "detail"] as const,
  detail: (id: string) => [...bandsKeys.details(), id] as const,
  search: (term: string) => [...bandsKeys.all, "search", term] as const,
  membersByBand: (id: string) => [...bandsKeys.all, "members", id] as const,
  membersByBands: (ids: string[]) =>
    [...bandsKeys.all, "members", ...ids] as const,
};

export const useBands = () => {
  return useQuery({
    queryKey: bandsKeys.lists(),
    queryFn: getAllBandsWithMembers,
    staleTime: 5 * 60 * 1000,
  });
};

export const useMembersByBand = (id: BandKeys) => {
  return useQuery({
    queryKey: bandsKeys.membersByBand(id.toLowerCase()),
    queryFn: () => getMembersByBand(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
};

export const useMembersByBands = (keys: BandKeys[]) => {
  const lowercaseKeys = keys.map((k) => k.toLowerCase());
  return useQuery({
    queryKey: bandsKeys.membersByBands(lowercaseKeys),
    queryFn: () => getMembersByBands(keys),
    staleTime: 5 * 60 * 1000,
    enabled: keys.length > 0,
  });
};
