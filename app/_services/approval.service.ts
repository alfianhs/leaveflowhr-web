import api from "@/lib/api";
import type { ApiResponse, LeaveRequest } from "@/app/_models";
import { Approval } from "../_models/approval";

// Get approvals (for managers/HR)
export async function getApprovals(isReviewed: boolean = false, page: number = 1, limit: number = 5): Promise<ApiResponse<Approval[]>> {
  const response = await api.get<ApiResponse<Approval[]>>("/approvals",  {
    params: {
      IsReviewed: isReviewed,
      Page: page,
      PageSize: limit
    },
  });
  return response.data;
}

// Get pending approvals count
export async function getPendingApprovalsCount(): Promise<ApiResponse<number>> {
  const response = await api.get<ApiResponse<number>>("/approvals/pending-count");
  return response.data;
}
