'use client';
// components/production/DeleteConfirmDialog.tsx
// Reusable delete confirmation modal

import { Loader2, Trash2 } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DeleteConfirmDialogProps {
  open:        boolean;
  onClose:     () => void;
  onConfirm:   () => Promise<void>;
  isDeleting:  boolean;
  title?:      string;
  description?: string;
}

export function DeleteConfirmDialog({
  open,
  onClose,
  onConfirm,
  isDeleting,
  title = 'Delete this record?',
  description = 'This action cannot be undone.',
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mb-2">
            <Trash2 className="h-5 w-5 text-destructive" />
          </div>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 mt-2">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Deleting…</>
            ) : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
