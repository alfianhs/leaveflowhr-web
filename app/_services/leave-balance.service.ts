import api from "@/lib/api";
import type { 
  ApiResponse,
  LeaveBalance
} from "@/app/_models";

// Get leave balance
export async function getLeaveBalanceByYear(year: number): Promise<ApiResponse<LeaveBalance>> {
  const response = await api.get<ApiResponse<LeaveBalance>>("/leave-balances/get-by-year", {
    params: { year }
  });
  return response.data;
}