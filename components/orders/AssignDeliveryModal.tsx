'use client';
// components/orders/AssignDeliveryModal.tsx
// Staff modal to assign a delivery staff member to an order.

import { useState, useEffect } from 'react';
import { Loader2, Truck } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Button }   from '@/components/ui/button';
import { Label }    from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useDeliveryStaff } from '@/hooks/useDelivery';
import { Order } from '@/types';

interface AssignDeliveryModalProps {
  open:         boolean;
  onClose:      () => void;
  onSubmit:     (deliveryStaffId: string, notes?: string) => Promise<void>;
  isSubmitting: boolean;
  order:        Order | null;
  serverError?: string | null;
}

export function AssignDeliveryModal({
  open, onClose, onSubmit, isSubmitting, order, serverError,
}: AssignDeliveryModalProps) {
  const { staff, isLoading: staffLoading } = useDeliveryStaff();
  const [selectedStaff, setSelectedStaff] = useState('');
  const [notes,         setNotes]         = useState('');
  const [validationErr, setValidationErr] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setSelectedStaff('');
      setNotes('');
      setValidationErr(null);
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedStaff) { setValidationErr('Please select a delivery staff member'); return; }
    setValidationErr(null);
    await onSubmit(selectedStaff, notes.trim() || undefined);
  }

  const displayError = validationErr || serverError;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            Assign Delivery
          </DialogTitle>
          <DialogDescription>
            {order
              ? `Order #${order.id.slice(-8).toUpperCase()} — ${order.customer?.fullName}`
              : 'Assign a delivery staff member'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {displayError && (
            <div className="rounded-md bg-destructive/10 border border-destructive/30 px-3 py-2 text-sm text-destructive">
              {displayError}
            </div>
          )}

          <div className="space-y-1.5">
            <Label>Delivery Staff Member</Label>
            {staffLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : staff.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">
                No delivery staff found. Add staff with the delivery role first.
              </p>
            ) : (
              <select
                value={selectedStaff}
                onChange={(e) => { setSelectedStaff(e.target.value); setValidationErr(null); }}
                disabled={isSubmitting}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              >
                <option value="">— Select staff member —</option>
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>{s.fullName}</option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>
              Notes <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isSubmitting}
              placeholder="e.g. Call customer before arriving"
              rows={2}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 resize-none"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || staffLoading || staff.length === 0}>
              {isSubmitting
                ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Assigning…</>
                : 'Assign'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
