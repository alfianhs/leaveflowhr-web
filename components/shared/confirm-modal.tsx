'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type ConfirmModalVariant = 'danger' | 'warning' | 'success';

interface ConfirmModalProps {
    open: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: ConfirmModalVariant;
    isLoading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const VARIANT_STYLES: Record<ConfirmModalVariant, { title: string; button: string; loadingLabel: string }> = {
    danger: { title: 'text-red-600', button: 'bg-red-800 hover:bg-red-900 text-white', loadingLabel: 'Processing...' },
    warning: { title: 'text-yellow-600', button: 'bg-yellow-800 hover:bg-yellow-900 text-white', loadingLabel: 'Processing...' },
    success: { title: 'text-green-600', button: 'bg-green-800 hover:bg-green-900 text-white', loadingLabel: 'Processing...' },
};

export function ConfirmModal({
    open,
    title,
    description,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'danger',
    isLoading = false,
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    const styles = VARIANT_STYLES[variant];

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
            <DialogContent className="bg-gray-950 border-gray-800 text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className={styles.title}>{title}</DialogTitle>
                    <DialogDescription className="text-gray-400">{description}</DialogDescription>
                </DialogHeader>

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={styles.button}
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                {styles.loadingLabel}
                            </span>
                        ) : (
                            confirmLabel
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}