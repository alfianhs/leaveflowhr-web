import { approveLeaveRequest, cancelLeaveRequest, createLeaveRequest, getLeaveRequests, getSickLeaveUsedDays, rejectLeaveRequest } from "@/app/_services";
import { useQuery } from "@tanstack/react-query";
import { useApiMutation } from "./use-api-mutation";
import { toast } from "sonner";

export function useSickLeaveUsedDays(year: number) {
    return useQuery({
        queryKey: ["sick-leave-used-days"],
        queryFn: () => getSickLeaveUsedDays(year),
    });
}

export function useLeaveRequests(page: number = 1, limit: number = 5) {
    return useQuery({
        queryKey: ["leave-requests", page, limit],
        queryFn: () => getLeaveRequests(page, limit),
    });
}

export function useCreateLeaveRequest() {
    return useApiMutation({
        mutationFn: createLeaveRequest,
        invalidateKeys: [["leave-requests"], ["leave-balance"], ["sick-leave-used-days"]],
        onSuccess: () => {
            toast.success("Leave request created");
        }
    });
}

export function useCancelLeaveRequest() {
    return useApiMutation({
        mutationFn: cancelLeaveRequest,
        invalidateKeys: [["leave-requests"], ["leave-balance"], ["sick-leave-used-days"]],
        onSuccess: () => {
            toast.success("Leave request cancelled");
        }
    });
}

export function useApproveLeaveRequest() {
    return useApiMutation({
        mutationFn: approveLeaveRequest,
        invalidateKeys: [["approvals"], ["pending-approvals-count"]],
        onSuccess: () => {
            toast.success("Leave request approved");
        }
    });
}

export function useRejectLeaveRequest() {
    return useApiMutation({
        mutationFn: rejectLeaveRequest,
        invalidateKeys: [["approvals"], ["pending-approvals-count"]],
        onSuccess: () => {
            toast.success("Leave request rejected");
        }
    });
}