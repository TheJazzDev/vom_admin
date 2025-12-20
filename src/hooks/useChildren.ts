import { useQuery } from "@tanstack/react-query";
import {
  getAllChildren,
  getChildrenStats,
} from "@/services/children/childrenService";

export const childrenKeys = {
  all: ["children"] as const,
  lists: () => [...childrenKeys.all, "list"] as const,
  stats: () => [...childrenKeys.all, "stats"] as const,
};

export const useChildren = () => {
  return useQuery({
    queryKey: childrenKeys.lists(),
    queryFn: getAllChildren,
    staleTime: 5 * 60 * 1000,
  });
};

export const useChildrenStats = () => {
  return useQuery({
    queryKey: childrenKeys.stats(),
    queryFn: getChildrenStats,
    staleTime: 5 * 60 * 1000,
  });
};
