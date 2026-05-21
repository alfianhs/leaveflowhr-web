import { EnumResponse } from "./base";
import { User } from "./user";

// Leave Request Types
export type LeaveTypeApi = "Annual" | "Sick";
export type LeaveStatus = "Pending" | "Approved" | "Rejected" | "Cancelled";

export interface LastReview{
  by: string;
  note: string | null;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  user: User | null;
  type: EnumResponse<LeaveTypeApi>;
  startDate: string;
  endDate: string;
  totalDays: number;
  status: EnumResponse<LeaveStatus> | null;
  reason: string | null;
  lastReview: LastReview | null;
  createdAt: string | null;
  updatedAt: string | null;
}

// Leave request payload
export interface CreateLeaveRequestPayload {
  type: LeaveTypeApi;
  startDate: string; // Format: "YYYY-MM-DD"
  endDate: string;   // Format: "YYYY-MM-DD"
  reason: string | null;
}

// Leave request approval payload
export interface ApproveLeaveRequestPayload {
  leaveRequestId: string;
  note: string | null;
}
