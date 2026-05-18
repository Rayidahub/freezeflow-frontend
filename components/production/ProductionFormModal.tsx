'use client';
// components/production/ProductionFormModal.tsx
// Modal form for creating or editing a production log.
// Auto-calculates remainingStock and totalSales as the user types.

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatNaira } from '@/lib/utils';
import { Production, CreateProductionDto } from '@/types';

interface ProductionFormModalProps {
  open:        boolean;
  onClose:     () => void;
  onSubmit:    (data: CreateProductionDto) => Promise<void>;
  isSubmitting: boolean;
  editData?:   Production | null;   // Pass to pre-fill for editing
  serverError?: string | null;
}

const EMPTY_FORM = {
  date:           new Date().toISOString().slice(0, 10),
  bagsProduced:   '',
  bagsSold:       '',
  damagedBags:    '0',
  sellingPrice:   '500',
  remainingStock: '',
};

export function ProductionFormModal({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  editData,
  serverError,
}: ProductionFormModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Pre-fill when editing
  useEffect(() => {
    if (editData) {
      setForm({
        date:           editData.date.slice(0, 10),
        bagsProduced:   String(editData.bagsProduced),
        bagsSold:       String(editData.bagsSold),
        damagedBags:    String(editData.damagedBags),
        sellingPrice:   String(editData.sellingPrice),
        remainingStock: String(editData.remainingStock),
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setValidationError(null);
  }, [editData, open]);

  // Derived calculated values shown live
  const produced  = parseInt(form.bagsProduced)  || 0;
  const sold      = parseInt(form.bagsSold)       || 0;
  const damaged   = parseInt(form.damagedBags)    || 0;
  const price     = parseFloat(form.sellingPrice) || 0;
  const remaining = produced - sold - damaged;
  const totalSales = sold * price;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setValidationError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setValidationError(null);

    // Client-side validation
    if (!form.date) { setValidationError('Date is required'); return; }
    if (produced <= 0) { setValidationError('Bags produced must be greater than 0'); return; }
    if (sold < 0 || damaged < 0) { setValidationError('Bags sold and damaged cannot be negative'); return; }
    if (sold + damaged > produced) {
      setValidationError(`Bags sold (${sold}) + damaged (${damaged}) cannot exceed produced (${produced})`);
      return;
    }
    if (price <= 0) { setValidationError('Selling price must be greater than 0'); return; }

    await onSubmit({
      date:           form.date,
      bagsProduced:   produced,
      bagsSold:       sold,
      damagedBags:    damaged,
      remainingStock: remaining,
      sellingPrice:   price,
    });
  }

  const displayError = validationError || serverError;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editData ? 'Edit Production Log' : 'Log Daily Production'}</DialogTitle>
          <DialogDescription>
            {editData
              ? 'Update the details for this production entry.'
              : 'Record today\'s ice block production figures.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {displayError && (
            <div className="rounded-md bg-destructive/10 border border-destructive/30 px-3 py-2 text-sm text-destructive">
              {displayError}
            </div>
          )}

          {/* Date */}
          <div className="space-y-1.5">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date" name="date" type="date"
              value={form.date} onChange={handleChange}
              max={new Date().toISOString().slice(0, 10)}
              required disabled={isSubmitting}
            />
          </div>

          {/* Two-column grid for numbers */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="bagsProduced">Bags Produced</Label>
              <Input
                id="bagsProduced" name="bagsProduced" type="number"
                placeholder="e.g. 200" min={0}
                value={form.bagsProduced} onChange={handleChange}
                required disabled={isSubmitting}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bagsSold">Bags Sold</Label>
              <Input
                id="bagsSold" name="bagsSold" type="number"
                placeholder="e.g. 180" min={0}
                value={form.bagsSold} onChange={handleChange}
                required disabled={isSubmitting}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="damagedBags">Damaged Bags</Label>
              <Input
                id="damagedBags" name="damagedBags" type="number"
                placeholder="0" min={0}
                value={form.damagedBags} onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sellingPrice">Price per Bag (₦)</Label>
              <Input
                id="sellingPrice" name="sellingPrice" type="number"
                placeholder="500" min={1}
                value={form.sellingPrice} onChange={handleChange}
                required disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Live calculated preview */}
          <div className="rounded-lg bg-muted/50 border border-border p-3 space-y-2 text-sm">
            <p className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">Calculated</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-muted-foreground text-xs">Remaining Stock</p>
                <p className={`font-bold text-base ${remaining < 0 ? 'text-destructive' : 'text-foreground'}`}>
                  {remaining < 0 ? 'Invalid ⚠' : remaining}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Total Sales</p>
                <p className="font-bold text-base text-primary">{formatNaira(totalSales)}</p>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || remaining < 0}>
              {isSubmitting ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving…</>
              ) : editData ? 'Update Log' : 'Save Log'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
