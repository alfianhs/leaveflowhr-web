import { useState } from "react";
import { ApprovalsTable } from "./approvals-table";
import { ReviewTab } from "./review-tab";
import { useApprovals } from "@/hooks/use-approval";
import { Pagination } from "../shared/pagination";
import { usePagination } from "@/hooks/use-pagination";

export function ApprovalsTab() {
    const pagination = usePagination(1, 5);
    const [activeTab, setActiveTab] = useState<'pending' | 'reviewed'>('pending');
    const isReviewed = activeTab === 'reviewed';
    const approvalsQuery = useApprovals(isReviewed, pagination.currentPage, pagination.pageSize);
    const approvalsData = approvalsQuery.data?.data ?? [];
    const totalItems = approvalsQuery.data?.meta?.totalItems ?? 0;
    const totalPages = approvalsQuery.data?.meta?.totalPages || 1;

    const handleTabChange = (tab: 'pending' | 'reviewed') => {
        setActiveTab(tab);
        pagination.reset();
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <ReviewTab activeTab={activeTab} onTabChange={handleTabChange} />
            <ApprovalsTable 
                data={approvalsData}
                isLoading={approvalsQuery.isLoading}
                isReviewed={isReviewed}
                />
            <Pagination
                currentPage={pagination.currentPage}
                totalPages={totalPages}
                pageSize={pagination.pageSize}
                totalItems={totalItems}
                onPageChange={pagination.goToPage}
                onPageSizeChange={pagination.setPageSize}
                isLoading={approvalsQuery.isLoading}
            />
        </div>
    );
}