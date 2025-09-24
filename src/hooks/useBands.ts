import { useQuery } from "@tanstack/react-query";
import {
  getAllBands,
  getBandsWithMembers,
  getBandWithMembers,
} from "@/services/bands/bandService";

export const bandsKeys = {
  all: ["bands"] as const,
  lists: () => [...bandsKeys.all, "list"] as const,
  search: (term: string) => [...bandsKeys.all, "search", term] as const,
  bandWithMembers: (id: string) => [...bandsKeys.all, "members", id] as const,
  bandsWithMembers: (ids: BandKeys[]) =>
    [...bandsKeys.all, "members", ...ids] as const,
};

export const useAllBands = () => {
  return useQuery({
    queryKey: bandsKeys.lists(),
    queryFn: getAllBands,
    staleTime: 5 * 60 * 1000,
  });
};

export const useBandWithMembers = (key: BandKeys) => {
  return useQuery({
    queryKey: bandsKeys.bandWithMembers(key),
    queryFn: () => getBandWithMembers(key),
    staleTime: 5 * 60 * 1000,
    enabled: !!key,
  });
};

export const useBandsWithMembers = (bandIds: BandKeys[]) => {
  return useQuery({
    queryKey: bandsKeys.bandsWithMembers(bandIds),
    queryFn: () => getBandsWithMembers(bandIds),
    enabled: bandIds.length > 0,
    staleTime: 5 * 60 * 1000,
  });
};
