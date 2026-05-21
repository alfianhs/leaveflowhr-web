'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ApprovalModalProps {
    open: boolean;
    type: 'approve' | 'reject';
    employeeName: string;
    onConfirm: (note: string) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export function ApprovalModal({
    open,
    type,
    employeeName,
    onConfirm,
    onCancel,
    isLoading,
}: ApprovalModalProps) {
    const [note, setNote] = useState('');

    const isReject = type === 'reject';
    const isDisabled = isReject && note.trim() === '';

    const handleConfirm = () => {
        onConfirm(note.trim() || '');
        setNote('');
    };

    const handleCancel = () => {
        setNote('');
        onCancel();
    };

    return (
        <Dialog open={open} onOpenChange={(open) => !open && handleCancel()}>
            <DialogContent className="bg-gray-900 border-gray-700 text-gray-100 sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className={isReject ? 'text-red-400' : 'text-green-400'}>
                        {isReject ? 'Reject' : 'Approve'} Leave Request
                    </DialogTitle>
                    <DialogDescription>
                        You are about to{' '}
                        <span className={isReject ? 'text-red-400 font-medium' : 'text-green-400 font-medium'}>
                            {isReject ? 'reject' : 'approve'}
                        </span>{' '}
                        the leave request from <span className="text-white font-medium">{employeeName}</span>.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label className="text-gray-300">
                            Note{isReject ? <span className="text-red-400 ml-1">*</span> : <span className="text-gray-500 ml-1">(optional)</span>}
                        </Label>
                        <Textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder={isReject ? 'Please provide a reason for rejection...' : 'Add a note (optional)...'}
                            className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500 resize-none"
                            rows={3}
                        />
                        {isReject && note.trim() === '' && (
                            <p className="text-xs text-red-400">A reason is required when rejecting a request.</p>
                        )}
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={isDisabled || isLoading}
                        className={isReject
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                {isReject ? 'Rejecting...' : 'Approving...'}
                            </span>
                        ) : (
                            isReject ? 'Reject' : 'Approve'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}