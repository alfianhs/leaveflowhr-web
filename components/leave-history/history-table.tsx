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
import { formatDateRange, formatDateTimeToJakarta, getLeaveTypeBadgeStyles, getStatusBadgeStyles } from '@/lib/utils';
import { LeaveRequest } from '@/app/_models/leave-request';
import LoadingCard from '../shared/loading';
import { useCancelLeaveRequest } from '@/hooks/use-leave-request';
import { useState } from 'react';
import { ConfirmModal } from '../shared/confirm-modal';

interface HistoriesTableProps {
    data: LeaveRequest[];
    isLoading?: boolean;
}

export function HistoriesTable({
    data,
    isLoading,
}: HistoriesTableProps) {
    const [pendingCancelId, setPendingCancelId] = useState<string | null>(null);
    const cancelLeaveRequestMutation = useCancelLeaveRequest();

    const handleConfirmCancel = () => {
        if (!pendingCancelId) return;
        cancelLeaveRequestMutation.mutate(pendingCancelId, {
            onSuccess: () => setPendingCancelId(null),
        });
    };

    return (
        <>
            <div className="rounded-lg border border-gray-700 bg-black overflow-hidden">
                <Table className="text-gray-100">
                    <TableHeader className="bg-gray-950 border-gray-900">
                        <TableRow className="border-gray-800 hover:bg-gray-800">
                            <TableHead className="text-gray-300">Type</TableHead>
                            <TableHead className="text-gray-300">Days</TableHead>
                            <TableHead className="text-gray-300">Dates</TableHead>
                            <TableHead className="text-gray-300">Last Reviewed By</TableHead>
                            <TableHead className="text-gray-300">Last Reviewed Note</TableHead>
                            <TableHead className="text-gray-300">Status</TableHead>
                            <TableHead className="text-gray-300">Requested At</TableHead>
                            <TableHead className="text-gray-300">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-gray-400">
                                    <LoadingCard loadingMessage="Loading leave requests..." />
                                </TableCell>
                            </TableRow>
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-gray-400">
                                    No leave requests found
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="border-gray-700 hover:bg-gray-800/50"
                                >
                                    <TableCell>
                                        <Badge
                                            className={getLeaveTypeBadgeStyles(row.type.value)}
                                        >
                                            {row.type.value}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-gray-300">
                                        {row.totalDays} {row.totalDays === 1 ? 'day' : 'days'}
                                    </TableCell>
                                    <TableCell className="text-gray-300">
                                        {formatDateRange(new Date(row.startDate || '2002-01-01'), new Date(row.endDate || '2002-01-01'))}
                                    </TableCell>
                                    <TableCell className="text-gray-300 wrap-break-words whitespace-normal">
                                        {row.lastReview?.by || '-'}
                                    </TableCell>
                                    <TableCell className="text-gray-300 wrap-break-words whitespace-normal">
                                        {row.lastReview?.note || '-'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            className={getStatusBadgeStyles(row.status?.value || "Approved")}
                                        >
                                            {row.status?.value}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {formatDateTimeToJakarta(row.createdAt || "2002-01-01T00:00:00.000")}
                                    </TableCell>
                                    {row.status?.value === 'Pending' ? (<TableCell>
                                        <Button
                                            variant="default"
                                            size="sm"
                                            className="bg-yellow-800 border-yellow-900 text-gray-300 hover:bg-yellow-900"
                                            onClick={() => setPendingCancelId(row.id)}
                                        >
                                            Cancel
                                        </Button>
                                    </TableCell>) : (
                                        <TableCell>-</TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <ConfirmModal
                open={pendingCancelId !== null}
                title="Cancel Leave Request"
                description="Are you sure you want to cancel this leave request? This action cannot be undone."
                confirmLabel="Cancel Request"
                cancelLabel="Keep It"
                variant="warning"
                isLoading={cancelLeaveRequestMutation.isPending}
                onConfirm={handleConfirmCancel}
                onCancel={() => setPendingCancelId(null)}
            />
        </>
    );
}
