'use client';
// components/expenses/ExpenseFormModal.tsx
// Modal form for creating or editing an expense entry.

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Button }  from '@/components/ui/button';
import { Input }   from '@/components/ui/input';
import { Label }   from '@/components/ui/label';
import { Expense, CreateExpenseDto, ExpenseType } from '@/types';

// ─── Expense type options ─────────────────────────────────────────────────────

export const EXPENSE_TYPE_LABELS: Record<ExpenseType, string> = {
  fuel:           '⛽ Fuel',
  electricity:    '⚡ Electricity',
  water:          '💧 Water',
  nylon:          '🛍️ Nylon / Packaging',
  transportation: '🚚 Transportation',
  labor:          '👷 Labour',
  maintenance:    '🔧 Maintenance',
  miscellaneous:  '📦 Miscellaneous',
};

const EXPENSE_TYPES = Object.keys(EXPENSE_TYPE_LABELS) as ExpenseType[];

// ─── Component ────────────────────────────────────────────────────────────────

interface ExpenseFormModalProps {
  open:         boolean;
  onClose:      () => void;
  onSubmit:     (data: CreateExpenseDto) => Promise<void>;
  isSubmitting: boolean;
  editData?:    Expense | null;
  serverError?: string | null;
}

const EMPTY_FORM = {
  date:        new Date().toISOString().slice(0, 10),
  expenseType: 'fuel' as ExpenseType,
  amount:      '',
  description: '',
};

export function ExpenseFormModal({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  editData,
  serverError,
}: ExpenseFormModalProps) {
  const [form,            setForm]            = useState(EMPTY_FORM);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Pre-fill when editing
  useEffect(() => {
    if (editData) {
      setForm({
        date:        editData.date.slice(0, 10),
        expenseType: editData.expenseType,
        amount:      String(editData.amount),
        description: editData.description ?? '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setValidationError(null);
  }, [editData, open]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setValidationError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setValidationError(null);

    if (!form.date)        { setValidationError('Date is required'); return; }
    if (!form.expenseType) { setValidationError('Expense type is required'); return; }

    const amount = parseFloat(form.amount);
    if (!form.amount || isNaN(amount) || amount <= 0) {
      setValidationError('Amount must be greater than 0');
      return;
    }

    await onSubmit({
      date:        form.date,
      expenseType: form.expenseType,
      amount,
      description: form.description.trim() || undefined,
    });
  }

  const displayError = validationError || serverError;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editData ? 'Edit Expense' : 'Record Expense'}
          </DialogTitle>
          <DialogDescription>
            {editData
              ? 'Update the details for this expense entry.'
              : 'Log a new operational cost against today\'s records.'}
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
            <Label htmlFor="exp-date">Date</Label>
            <Input
              id="exp-date" name="date" type="date"
              value={form.date} onChange={handleChange}
              max={new Date().toISOString().slice(0, 10)}
              required disabled={isSubmitting}
            />
          </div>

          {/* Expense Type */}
          <div className="space-y-1.5">
            <Label htmlFor="exp-type">Expense Type</Label>
            <select
              id="exp-type" name="expenseType"
              value={form.expenseType} onChange={handleChange}
              disabled={isSubmitting}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {EXPENSE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {EXPENSE_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <Label htmlFor="exp-amount">Amount (₦)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                ₦
              </span>
              <Input
                id="exp-amount" name="amount" type="number"
                placeholder="0.00" min={1} step="0.01"
                value={form.amount} onChange={handleChange}
                required disabled={isSubmitting}
                className="pl-7"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="exp-desc">
              Description <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <textarea
              id="exp-desc" name="description"
              value={form.description} onChange={handleChange}
              disabled={isSubmitting}
              placeholder="e.g. Generator fuel top-up for evening shift"
              rows={3}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving…</>
              ) : editData ? 'Update Expense' : 'Record Expense'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
