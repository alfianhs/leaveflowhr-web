import { useDashboardData } from "@/hooks/use-dashboard-data";
import LoadingCard from "../shared/loading";
import { LeaveBalances } from "./leave-balances";
import { RecentRequests } from "./recent-requests";

export function DashboardTab() {
    const year = new Date().getFullYear();
    const { leaveBalanceQuery, sickLeaveQuery, recentRequestsQuery } = useDashboardData(year);

    const isLoading = leaveBalanceQuery.isLoading || sickLeaveQuery.isLoading || recentRequestsQuery.isLoading;
    
    if (isLoading) {
        return <LoadingCard loadingMessage="Loading dashboard..." />;
    }

    const leaveBalance = leaveBalanceQuery.data?.data;
    const sickLeaveUsedDays = sickLeaveQuery.data?.data;
    const recentRequests = recentRequestsQuery.data?.data ?? [];

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <LeaveBalances
                annualLeave={{
                    remaining: leaveBalance?.remainingDays ?? 0,
                    total: leaveBalance?.entitledDays ?? 0,
                    used: leaveBalance?.usedDays ?? 0,
                    pending: leaveBalance?.pendingDays ?? 0,
                }}
                sickLeave={{
                    taken: sickLeaveUsedDays ?? 0,
                    hasLimit: false,
                }}
            />
            <RecentRequests requests={recentRequests} />
        </div>
    );
}