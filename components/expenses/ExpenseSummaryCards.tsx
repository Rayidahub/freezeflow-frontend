'use client';
// components/expenses/ExpenseSummaryCards.tsx
// Total expense card + visual category breakdown with progress bars.

import { TrendingDown, Receipt } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatNaira } from '@/lib/utils';
import { ExpenseSummary, ExpenseType } from '@/types';
import { EXPENSE_TYPE_LABELS } from './ExpenseFormModal';

// Color per category
const TYPE_COLORS: Record<ExpenseType, string> = {
  fuel:           'bg-orange-500',
  electricity:    'bg-yellow-500',
  water:          'bg-blue-500',
  nylon:          'bg-green-500',
  transportation: 'bg-purple-500',
  labor:          'bg-pink-500',
  maintenance:    'bg-red-500',
  miscellaneous:  'bg-gray-400',
};

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

interface ExpenseSummaryCardsProps {
  summary:   ExpenseSummary | null;
  isLoading: boolean;
}

export function ExpenseSummaryCards({ summary, isLoading }: ExpenseSummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 lg:grid-cols-3">
        <Card><CardContent className="pt-6 space-y-3">
          <Skeleton className="h-4 w-28" /><Skeleton className="h-10 w-32" />
        </CardContent></Card>
        <Card className="lg:col-span-2"><CardContent className="pt-6 space-y-3">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}
        </CardContent></Card>
      </div>
    );
  }

  const total     = summary?.totalExpenses ?? 0;
  const breakdown = summary?.breakdown ?? [];

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* Total card */}
      <Card className="border-destructive/20 bg-gradient-to-br from-red-50 to-orange-50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Expenses
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10">
              <TrendingDown className="h-4 w-4 text-destructive" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-black text-destructive">{formatNaira(total)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {summary?.totalEntries ?? 0} entries · {summary?.period ?? '—'}
          </p>
        </CardContent>
      </Card>

      {/* Category breakdown */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Receipt className="h-4 w-4 text-muted-foreground" />
            Breakdown by Category
          </CardTitle>
          <CardDescription>
            {breakdown.length === 0
              ? 'No expenses recorded for this period'
              : `${breakdown.length} categories with spend`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {breakdown.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No data for this period.
            </p>
          ) : (
            breakdown.map((item) => {
              const pct = total > 0 ? (item.total / total) * 100 : 0;
              const type = item.expenseType as ExpenseType;
              return (
                <div key={type}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_BADGE[type] ?? 'bg-gray-100 text-gray-700'}`}>
                        {EXPENSE_TYPE_LABELS[type] ?? type}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {item.count} {item.count === 1 ? 'entry' : 'entries'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold">{formatNaira(item.total)}</span>
                      <span className="text-xs text-muted-foreground ml-1">
                        ({pct.toFixed(0)}%)
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${TYPE_COLORS[type] ?? 'bg-gray-400'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
