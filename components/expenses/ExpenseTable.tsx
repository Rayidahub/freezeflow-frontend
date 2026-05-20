'use client';
// components/expenses/ExpenseTable.tsx
// Renders paginated expense log with role-aware action buttons.

import { Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button }   from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatNaira, formatDate } from '@/lib/utils';
import { Expense, PaginationMeta, UserRole, ExpenseType } from '@/types';
import { EXPENSE_TYPE_LABELS } from './ExpenseFormModal';

const TYPE_BADGE: Record<ExpenseType, string> = {
  fuel:           'bg-orange-100 text-orange-800',
  electricity:    'bg-yellow-100 text-yellow-800',
  water:          'bg-blue-100 text-blue-800',
  nylon:          'bg-green-100 text-green-800',
  transportation: 'bg-purple-100 text-purple-800',
  labor:          'bg-pink-100 text-pink-800',
  maintenance:    'bg-red-100 text-red-800',
  miscellaneous:  'bg-gray-100 text-gray-700',
};

interface ExpenseTableProps {
  expenses:    Expense[];
  pagination:  PaginationMeta | null;
  isLoading:   boolean;
  userRole:    UserRole;
  onEdit:      (expense: Expense) => void;
  onDelete:    (expense: Expense) => void;
  onPageChange:(page: number) => void;
  onAddNew:    () => void;
}

export function ExpenseTable({
  expenses,
  pagination,
  isLoading,
  userRole,
  onEdit,
  onDelete,
  onPageChange,
  onAddNew,
}: ExpenseTableProps) {
  const canEdit   = userRole === 'super_admin' || userRole === 'operations';
  const canDelete = userRole === 'super_admin';

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Expense Records</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Expense Records</CardTitle>
        <CardDescription>
          {pagination
            ? `Showing ${expenses.length} of ${pagination.total} entries`
            : `${expenses.length} entries`}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                {['Date', 'Type', 'Amount', 'Description', 'Logged by', ''].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {expenses.map((expense) => {
                const type = expense.expenseType as ExpenseType;
                return (
                  <tr key={expense.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-4 py-3 font-medium whitespace-nowrap">
                      {formatDate(expense.date)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${TYPE_BADGE[type] ?? 'bg-gray-100 text-gray-700'}`}>
                        {EXPENSE_TYPE_LABELS[type] ?? type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-destructive">
                      {formatNaira(expense.amount)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">
                      {expense.description ?? <span className="italic opacity-50">—</span>}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                      {expense.user?.fullName ?? '—'}
                    </td>
                    {/* Hover actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {canEdit && (
                          <Button
                            variant="ghost" size="icon"
                            className="h-7 w-7"
                            onClick={() => onEdit(expense)}
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {canDelete && (
                          <Button
                            variant="ghost" size="icon"
                            className="h-7 w-7 hover:text-destructive"
                            onClick={() => onDelete(expense)}
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {expenses.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-muted-foreground font-medium">No expense records found.</p>
            <p className="text-sm text-muted-foreground mt-1">
              {canEdit
                ? 'Click "Add Expense" to record the first entry.'
                : 'No entries for this period.'}
            </p>
            {canEdit && (
              <Button className="mt-4" size="sm" onClick={onAddNew}>
                Add First Expense
              </Button>
            )}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline" size="sm"
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={!pagination.hasPrev}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />Previous
              </Button>
              <Button
                variant="outline" size="sm"
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={!pagination.hasNext}
              >
                Next<ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
