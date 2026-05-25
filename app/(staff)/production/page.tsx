// app/(staff)/production/page.tsx
// Fully connected production management page.
// All data is live from the API — no hardcoded placeholder data.
'use client';

import { useState } from 'react';
import { Plus, Download, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProductionSummaryCards } from '@/components/production/ProductionSummaryCards';
import { ProductionTable } from '@/components/production/ProductionTable';
import { ProductionFormModal } from '@/components/production/ProductionFormModal';
import { DeleteConfirmDialog } from '@/components/production/DeleteConfirmDialog';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/context/AuthContext';
import {
  useProductionList,
  useProductionSummary,
  useProductionMutations,
} from '@/hooks/useProduction';
import { Production, CreateProductionDto } from '@/types';

type Period = 'today' | 'week' | 'month' | 'all';

export default function ProductionPage() {
  const { user }    = useAuth();
  const { toast }   = useToast();

  // ─── Filter state ──────────────────────────────────────────────────────────
  const [period,    setPeriod]    = useState<Period>('today');
  const [page,      setPage]      = useState(1);
  const [dateFrom,  setDateFrom]  = useState('');
  const [dateTo,    setDateTo]    = useState('');

  // ─── Modal state ───────────────────────────────────────────────────────────
  const [formOpen,        setFormOpen]        = useState(false);
  const [deleteOpen,      setDeleteOpen]      = useState(false);
  const [editingLog,      setEditingLog]      = useState<Production | null>(null);
  const [deletingLog,     setDeletingLog]     = useState<Production | null>(null);

  // ─── Data hooks ────────────────────────────────────────────────────────────
  const { summary, isLoading: summaryLoading, refetch: refetchSummary } =
    useProductionSummary(period);

  const { logs, pagination, isLoading: logsLoading, refetch: refetchLogs } =
    useProductionList({
      page,
      limit: 20,
      from: dateFrom || undefined,
      to:   dateTo   || undefined,
    });

  const { createLog, updateLog, deleteLog, isSubmitting, error: mutationError, setError } =
    useProductionMutations();

  // ─── Handlers ──────────────────────────────────────────────────────────────

  function openCreate() {
    setEditingLog(null);
    setError(null);
    setFormOpen(true);
  }

  function openEdit(log: Production) {
    setEditingLog(log);
    setError(null);
    setFormOpen(true);
  }

  function openDelete(log: Production) {
    setDeletingLog(log);
    setDeleteOpen(true);
  }

  async function handleFormSubmit(data: CreateProductionDto) {
    if (editingLog) {
      const updated = await updateLog(editingLog.id, data);
      if (updated) {
        toast('Production log updated successfully', 'success');
        setFormOpen(false);
        refetchLogs();
        refetchSummary();
      }
    } else {
      const created = await createLog(data);
      if (created) {
        toast('Production log saved successfully', 'success');
        setFormOpen(false);
        refetchLogs();
        refetchSummary();
      }
    }
  }

  async function handleDelete() {
    if (!deletingLog) return;
    const ok = await deleteLog(deletingLog.id);
    if (ok) {
      toast('Production log deleted', 'success');
      setDeleteOpen(false);
      setDeletingLog(null);
      refetchLogs();
      refetchSummary();
    } else {
      toast(mutationError ?? 'Failed to delete log', 'error');
    }
  }

  function handleApplyDateFilter() {
    setPage(1);
    refetchLogs();
  }

  function handleClearDateFilter() {
    setDateFrom('');
    setDateTo('');
    setPage(1);
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Production Logs</h2>
          <p className="text-muted-foreground mt-1">
            Track daily ice block production and sales.
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
              Log Production
            </Button>
          )}
        </div>
      </div>

      {/* Period selector tabs */}
      <div className="flex items-center gap-1 rounded-2xl border border-border bg-white/60 backdrop-blur-sm p-1 w-fit shadow-sm">
        {(['today', 'week', 'month', 'all'] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => { setPeriod(p); setPage(1); }}
            className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
              period === p
                ? 'bg-white shadow-md text-foreground font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {p === 'all' ? 'All Time' : p === 'today' ? 'Today' : `This ${p.charAt(0).toUpperCase() + p.slice(1)}`}
          </button>
        ))}
      </div>

      {/* Summary cards */}
      <ProductionSummaryCards summary={summary} isLoading={summaryLoading} />

      {/* Date range filter */}
      <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-white/70 backdrop-blur-sm p-4 shadow-sm">
        <Calendar className="h-4 w-4 text-muted-foreground self-center mt-5" />
        <div className="space-y-1.5">
          <Label className="text-xs">From</Label>
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="h-9 w-40 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">To</Label>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="h-9 w-40 text-sm"
          />
        </div>
        <Button size="sm" onClick={handleApplyDateFilter} className="h-9">
          Apply Filter
        </Button>
        {(dateFrom || dateTo) && (
          <Button size="sm" variant="ghost" onClick={handleClearDateFilter} className="h-9">
            Clear
          </Button>
        )}
      </div>

      {/* Production table */}
      <ProductionTable
        logs={logs}
        pagination={pagination}
        isLoading={logsLoading}
        userRole={user?.role ?? 'delivery'}
        onEdit={openEdit}
        onDelete={openDelete}
        onPageChange={setPage}
        onAddNew={openCreate}
      />

      {/* Create / Edit modal */}
      <ProductionFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        editData={editingLog}
        serverError={mutationError}
      />

      {/* Delete confirmation */}
      <DeleteConfirmDialog
        open={deleteOpen}
        onClose={() => { setDeleteOpen(false); setDeletingLog(null); }}
        onConfirm={handleDelete}
        isDeleting={isSubmitting}
        title="Delete production log?"
        description={
          deletingLog
            ? `This will permanently delete the log for ${new Date(deletingLog.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}. This cannot be undone.`
            : 'This action cannot be undone.'
        }
      />
    </div>
  );
}
