"use client";

import { useLeaveBalance } from "./use-leave-balance";
import { useLeaveRequests, useSickLeaveUsedDays } from "./use-leave-request";

export function useDashboardData(year: number) {
    const leaveBalanceQuery = useLeaveBalance(year);
    const sickLeaveQuery = useSickLeaveUsedDays(year);
    const recentRequestsQuery = useLeaveRequests(1, 5);

    return {
        leaveBalanceQuery,
        sickLeaveQuery,
        recentRequestsQuery,
    };
}