// app/(staff)/expenses/page.tsx
// Fully connected expense management page — no placeholder data.
'use client';

import { useState } from 'react';
import { Plus, Download, Calendar } from 'lucide-react';
import { Button }  from '@/components/ui/button';
import { Input }   from '@/components/ui/input';
import { Label }   from '@/components/ui/label';
import { ExpenseSummaryCards }  from '@/components/expenses/ExpenseSummaryCards';
import { ExpenseTable }         from '@/components/expenses/ExpenseTable';
import { ExpenseFormModal }     from '@/components/expenses/ExpenseFormModal';
import { DeleteConfirmDialog }  from '@/components/production/DeleteConfirmDialog';
import { useToast }             from '@/components/ui/toast';
import { useAuth }              from '@/context/AuthContext';
import {
  useExpenseList,
  useExpenseSummary,
  useExpenseMutations,
} from '@/hooks/useExpenses';
import { Expense, CreateExpenseDto, ExpenseType } from '@/types';
import { EXPENSE_TYPE_LABELS } from '@/components/expenses/ExpenseFormModal';

type Period = 'today' | 'week' | 'month' | 'all';

const EXPENSE_TYPES: ExpenseType[] = [
  'fuel', 'electricity', 'water', 'nylon',
  'transportation', 'labor', 'maintenance', 'miscellaneous',
];

export default function ExpensesPage() {
  const { user }  = useAuth();
  const { toast } = useToast();

  // ─── Filter state ──────────────────────────────────────────────────────────
  const [period,     setPeriod]     = useState<Period>('today');
  const [page,       setPage]       = useState(1);
  const [dateFrom,   setDateFrom]   = useState('');
  const [dateTo,     setDateTo]     = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // ─── Modal state ───────────────────────────────────────────────────────────
  const [formOpen,    setFormOpen]    = useState(false);
  const [deleteOpen,  setDeleteOpen]  = useState(false);
  const [editingExp,  setEditingExp]  = useState<Expense | null>(null);
  const [deletingExp, setDeletingExp] = useState<Expense | null>(null);

  // ─── Data hooks ────────────────────────────────────────────────────────────
  const {
    summary, isLoading: summaryLoading, refetch: refetchSummary,
  } = useExpenseSummary(period);

  const {
    expenses, pagination, isLoading: expensesLoading, refetch: refetchExpenses,
  } = useExpenseList({
    page,
    limit: 20,
    from:  dateFrom  || undefined,
    to:    dateTo    || undefined,
    type:  typeFilter || undefined,
  });

  const {
    createExpense, updateExpense, deleteExpense,
    isSubmitting, error: mutationError, setError,
  } = useExpenseMutations();

  // ─── Handlers ──────────────────────────────────────────────────────────────

  function openCreate() {
    setEditingExp(null);
    setError(null);
    setFormOpen(true);
  }

  function openEdit(expense: Expense) {
    setEditingExp(expense);
    setError(null);
    setFormOpen(true);
  }

  function openDelete(expense: Expense) {
    setDeletingExp(expense);
    setDeleteOpen(true);
  }

  async function handleFormSubmit(data: CreateExpenseDto) {
    if (editingExp) {
      const updated = await updateExpense(editingExp.id, data);
      if (updated) {
        toast('Expense updated successfully', 'success');
        setFormOpen(false);
        refetchExpenses();
        refetchSummary();
      }
    } else {
      const created = await createExpense(data);
      if (created) {
        toast('Expense recorded successfully', 'success');
        setFormOpen(false);
        refetchExpenses();
        refetchSummary();
      }
    }
  }

  async function handleDelete() {
    if (!deletingExp) return;
    const ok = await deleteExpense(deletingExp.id);
    if (ok) {
      toast('Expense deleted', 'success');
      setDeleteOpen(false);
      setDeletingExp(null);
      refetchExpenses();
      refetchSummary();
    } else {
      toast(mutationError ?? 'Failed to delete expense', 'error');
    }
  }

  function handleApplyFilter() {
    setPage(1);
    refetchExpenses();
  }

  function handleClearFilter() {
    setDateFrom('');
    setDateTo('');
    setTypeFilter('');
    setPage(1);
  }

  const hasActiveFilter = dateFrom || dateTo || typeFilter;

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Expenses</h2>
          <p className="text-muted-foreground mt-1">
            Record and monitor all operational costs.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          {(user?.role === 'super_admin' || user?.role === 'operations') && (
            <Button size="sm" onClick={openCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          )}
        </div>
      </div>

      {/* Period selector */}
      <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/50 p-1 w-fit">
        {(['today', 'week', 'month', 'all'] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => { setPeriod(p); setPage(1); }}
            className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
              period === p
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {p === 'all' ? 'All Time' : p === 'today' ? 'Today' : `This ${p.charAt(0).toUpperCase() + p.slice(1)}`}
          </button>
        ))}
      </div>

      {/* Summary cards + breakdown */}
      <ExpenseSummaryCards summary={summary} isLoading={summaryLoading} />

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3 rounded-lg border border-border bg-card p-4">
        <Calendar className="h-4 w-4 text-muted-foreground self-center mt-5" />

        <div className="space-y-1.5">
          <Label className="text-xs">From</Label>
          <Input
            type="date" value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="h-9 w-40 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">To</Label>
          <Input
            type="date" value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="h-9 w-40 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Category</Label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="flex h-9 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">All categories</option>
            {EXPENSE_TYPES.map((t) => (
              <option key={t} value={t}>{EXPENSE_TYPE_LABELS[t]}</option>
            ))}
          </select>
        </div>

        <Button size="sm" onClick={handleApplyFilter} className="h-9">
          Apply
        </Button>
        {hasActiveFilter && (
          <Button size="sm" variant="ghost" onClick={handleClearFilter} className="h-9">
            Clear
          </Button>
        )}
      </div>

      {/* Expense table */}
      <ExpenseTable
        expenses={expenses}
        pagination={pagination}
        isLoading={expensesLoading}
        userRole={user?.role ?? 'delivery'}
        onEdit={openEdit}
        onDelete={openDelete}
        onPageChange={setPage}
        onAddNew={openCreate}
      />

      {/* Create / Edit modal */}
      <ExpenseFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        editData={editingExp}
        serverError={mutationError}
      />

      {/* Delete confirmation */}
      <DeleteConfirmDialog
        open={deleteOpen}
        onClose={() => { setDeleteOpen(false); setDeletingExp(null); }}
        onConfirm={handleDelete}
        isDeleting={isSubmitting}
        title="Delete this expense?"
        description={
          deletingExp
            ? `This will permanently delete the ₦${deletingExp.amount.toLocaleString()} ${deletingExp.expenseType} expense from ${new Date(deletingExp.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}.`
            : 'This action cannot be undone.'
        }
      />
    </div>
  );
}
