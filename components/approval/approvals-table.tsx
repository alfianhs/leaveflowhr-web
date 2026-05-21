'use client';

import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDateRange, formatDateTimeToJakarta, getLeaveTypeBadgeStyles, getStatusBadgeStyles, getUserInitials } from '@/lib/utils';
import { Approval } from '@/app/_models/approval';
import LoadingCard from '../shared/loading';
import { useApproveLeaveRequest, useRejectLeaveRequest } from '@/hooks/use-leave-request';
import { useState } from 'react';
import { ApprovalModal } from './approval-modal';

interface ModalState {
    type: 'approve' | 'reject';
    leaveRequestId: string;
    employeeName: string;
}

interface ApprovalsTableProps {
    data: Approval[];
    isLoading?: boolean;
    isReviewed?: boolean;
}

const LEAVE_TYPE_COLORS: Record<string, string> = {
    Annual: 'bg-blue-600/20 text-blue-300 border-blue-600/30 hover:bg-blue-600/20',
    Sick: 'bg-yellow-900 text-yellow-200',
};

export function ApprovalsTable({
    data,
    isLoading,
    isReviewed,
}: ApprovalsTableProps) {
    const [modal, setModal] = useState<ModalState | null>(null);
    const approveLeaveRequestMutation = useApproveLeaveRequest();
    const rejectLeaveRequestMutation = useRejectLeaveRequest();

    const isMutating = approveLeaveRequestMutation.isPending || rejectLeaveRequestMutation.isPending;

    const handleConfirm = (note: string) => {
        if (!modal) return;

        const payload = { leaveRequestId: modal.leaveRequestId, note };

        if (modal.type === 'approve') {
            approveLeaveRequestMutation.mutate(payload, {
                onSuccess: () => setModal(null),
            });
        } else {
            rejectLeaveRequestMutation.mutate(payload, {
                onSuccess: () => setModal(null),
            });
        }
    };

    return (
        <>
            <div className="rounded-lg border border-gray-700 bg-black overflow-hidden">
                <Table className="text-gray-100">
                    <TableHeader className="bg-gray-950 border-gray-900">
                        <TableRow className="border-gray-800 hover:bg-gray-800">
                            <TableHead className="text-gray-300">Employee</TableHead>
                            <TableHead className="text-gray-300">Type</TableHead>
                            <TableHead className="text-gray-300">{isReviewed ? 'Approval Note' : 'Reason'}</TableHead>
                            <TableHead className="text-gray-300">Dates</TableHead>
                            <TableHead className="text-gray-300">Days</TableHead>
                            <TableHead className="text-gray-300">Requested At</TableHead>
                            <TableHead className="text-gray-300">{isReviewed ? 'Status' : 'Action'}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-gray-300">
                                    <LoadingCard loadingMessage="Loading leave requests..." />
                                </TableCell>
                            </TableRow>
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-gray-300">
                                    No leave requests found
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="border-gray-700 hover:bg-gray-800/50"
                                >
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-white bg-blue-600`}
                                            >
                                                {getUserInitials(row.leaveRequest?.user?.name || '')}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-300">
                                                    {row.leaveRequest?.user?.name}
                                                </div>
                                                <div className="text-sm text-gray-300">
                                                    {row.leaveRequest?.user?.department}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            className={getLeaveTypeBadgeStyles(row.leaveRequest?.type.value || '')}
                                        >
                                            {row.leaveRequest?.type.value}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-gray-300 wrap-break-words whitespace-normal">
                                        {isReviewed ? row.note ?? '-' : row.leaveRequest?.reason ?? '-'}
                                    </TableCell>
                                    <TableCell className="text-gray-300">
                                        {formatDateRange(new Date(row.leaveRequest?.startDate || '2002-01-01'), new Date(row.leaveRequest?.endDate || '2002-01-01'))}
                                    </TableCell>
                                    <TableCell className="text-gray-300">
                                        {row.leaveRequest?.totalDays} {row.leaveRequest?.totalDays === 1 ? 'day' : 'days'}
                                    </TableCell>
                                    <TableCell className="text-gray-300">
                                        {formatDateTimeToJakarta(row.leaveRequest?.createdAt || '2002-01-01T00:00:00.000')}
                                    </TableCell>
                                    {isReviewed ? (<TableCell>
                                        <div className="flex gap-2">
                                            <Badge
                                                variant="outline"
                                                className={getStatusBadgeStyles(row.decision?.value ?? "Approved")}
                                            >
                                                {row.decision?.value ? row.decision.value : "N/A"}
                                            </Badge>
                                        </div>
                                    </TableCell>) : (<TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="default"
                                                size="sm"
                                                className="bg-green-600 border-green-800 text-white hover:bg-green-800"
                                                onClick={() => setModal({
                                                    type: 'approve',
                                                    leaveRequestId: row.leaveRequestId,
                                                    employeeName: row.leaveRequest?.user?.name || 'Unknown',
                                                })}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                variant="default"
                                                size="sm"
                                                className="bg-red-600 border-red-800 text-white hover:bg-red-800"
                                                onClick={() => setModal({
                                                    type: 'reject',
                                                    leaveRequestId: row.leaveRequestId,
                                                    employeeName: row.leaveRequest?.user?.name || 'Unknown',
                                                })}
                                            >
                                                Reject
                                            </Button>
                                        </div>
                                    </TableCell>)}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            <ApprovalModal
                open={modal !== null}
                type={modal?.type ?? 'approve'}
                employeeName={modal?.employeeName ?? ''}
                onConfirm={handleConfirm}
                onCancel={() => setModal(null)}
                isLoading={isMutating}
            />
        </>
    );
}
