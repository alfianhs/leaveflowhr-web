import { EnumResponse } from "./base";
import { LeaveRequest } from "./leave-request";
import { User } from "./user";

// Leave Request Types
export type DecisionTypeApi = "Approved" | "Rejected";

export interface Approval {
  id: string;
  leaveRequestId: string;
  leaveRequest: LeaveRequest | null;
  approverId: string | null;
  approver: User | null;
  decision: EnumResponse<DecisionTypeApi> | null;
  note: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}