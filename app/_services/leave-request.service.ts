import api from "@/lib/api";
import type {
  ApiResponse,
  LeaveRequest,
  CreateLeaveRequestPayload,
  ApproveLeaveRequestPayload
} from "@/app/_models";

export async function getLeaveRequests(page: number = 1, limit: number = 5): Promise<ApiResponse<LeaveRequest[]>> {
  const response = await api.get<ApiResponse<LeaveRequest[]>>("/leave-requests", {
    params: {
      Page: page,
      PageSize: limit
    },
  });

  return response.data;
}

// Create new leave request
export async function createLeaveRequest(payload: CreateLeaveRequestPayload): Promise<ApiResponse<LeaveRequest>> {
  const response = await api.post<ApiResponse<LeaveRequest>>("/leave-requests", payload);

  return response.data;
}

// Cancel leave request
export async function cancelLeaveRequest(id: string): Promise<ApiResponse<null>> {
  const response = await api.patch<ApiResponse<null>>(`/leave-requests/${id}/cancel`);

  return response.data;
}

// Get sick leave used days for the year
export async function getSickLeaveUsedDays(year: number) {
  const response = await api.get<ApiResponse<number>>(
    "/leave-requests/sick-leave-used-days",
    {
      params: { year },
    }
  );

  return response.data;
}

// Approve a leave request
export async function approveLeaveRequest(payload: ApproveLeaveRequestPayload): Promise<ApiResponse<LeaveRequest>> {
  const response = await api.patch<ApiResponse<LeaveRequest>>(`/leave-requests/${payload.leaveRequestId}/approve`, {
    note: payload.note,
  });
  return response.data;
}

// Reject a leave request
export async function rejectLeaveRequest(payload: ApproveLeaveRequestPayload): Promise<ApiResponse<LeaveRequest>> {
  const response = await api.patch<ApiResponse<LeaveRequest>>(`/leave-requests/${payload.leaveRequestId}/reject`, {
    note: payload.note,
  });
  return response.data;
}
