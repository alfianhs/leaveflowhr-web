import { ApiResponse } from "@/app/_models";
import { getApprovals, getPendingApprovalsCount } from "@/app/_services";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export function useApprovals(isReviewed: boolean = false, page: number = 1, limit: number = 5) {
    return useQuery({
        queryKey: ["approvals", isReviewed, page, limit],
        queryFn: () => getApprovals(isReviewed, page, limit),
    });
}

export function usePendingApprovalsCount(
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["pending-approvals-count"],
    queryFn: () => getPendingApprovalsCount(),
    enabled: options?.enabled,
  });
}