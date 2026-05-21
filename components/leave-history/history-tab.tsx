import { useState } from "react";
import { useApprovals } from "@/hooks/use-approval";
import { Pagination } from "../shared/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { useLeaveRequests } from "@/hooks/use-leave-request";
import { HistoriesTable } from "./history-table";

export function HistoriesTab() {
    const pagination = usePagination(1, 5);
    const leaveRequestsQuery = useLeaveRequests(pagination.currentPage, pagination.pageSize);
    const leaveRequestsData = leaveRequestsQuery.data?.data ?? [];
    const totalItems = leaveRequestsQuery.data?.meta?.totalItems ?? 0;
    const totalPages = leaveRequestsQuery.data?.meta?.totalPages || 1;

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <HistoriesTable 
                data={leaveRequestsData}
                isLoading={leaveRequestsQuery.isLoading}
                />
            <Pagination
                currentPage={pagination.currentPage}
                totalPages={totalPages}
                pageSize={pagination.pageSize}
                totalItems={totalItems}
                onPageChange={pagination.goToPage}
                onPageSizeChange={pagination.setPageSize}
                isLoading={leaveRequestsQuery.isLoading}
            />
        </div>
    );
}