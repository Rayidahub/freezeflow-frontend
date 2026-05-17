// app/(staff)/expenses/page.tsx
import type { Metadata } from 'next';
import { Plus, Filter, Download, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatNaira, formatDate, humanise } from '@/lib/utils';

export const metadata: Metadata = { title: 'Expenses' };

const expenseTypeColors: Record<string, string> = {
  fuel: 'bg-orange-100 text-orange-800',
  electricity: 'bg-yellow-100 text-yellow-800',
  water: 'bg-blue-100 text-blue-800',
  nylon: 'bg-green-100 text-green-800',
  transportation: 'bg-purple-100 text-purple-800',
  labor: 'bg-pink-100 text-pink-800',
  maintenance: 'bg-red-100 text-red-800',
  miscellaneous: 'bg-gray-100 text-gray-800',
};

const expenses = [
  { id: '1', date: '2024-12-15T10:00:00Z', expenseType: 'fuel', amount: 15000, description: 'Generator fuel', user: { fullName: 'Operations Staff' } },
  { id: '2', date: '2024-12-15T14:00:00Z', expenseType: 'electricity', amount: 8500, description: 'EKEDC prepaid token', user: { fullName: 'Operations Staff' } },
  { id: '3', date: '2024-12-14T09:00:00Z', expenseType: 'labor', amount: 10000, description: 'Daily wages', user: { fullName: 'Operations Staff' } },
];

const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

export default function ExpensesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Expenses</h2>
          <p className="text-muted-foreground mt-1">Record and monitor all operational costs.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Summary card */}
      <Card className="border-destructive/30 bg-destructive/5">
        <CardContent className="flex items-center gap-4 pt-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
            <TrendingDown className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total expenses this period</p>
            <p className="text-3xl font-bold text-destructive">{formatNaira(totalExpenses)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Expense breakdown by type */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Expense Breakdown</CardTitle>
          <CardDescription>Costs grouped by category</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(
            expenses.reduce<Record<string, number>>((acc, e) => {
              acc[e.expenseType] = (acc[e.expenseType] || 0) + e.amount;
              return acc;
            }, {})
          ).map(([type, total]) => (
            <div key={type} className="flex items-center justify-between">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${expenseTypeColors[type] || 'bg-gray-100 text-gray-800'}`}
              >
                {humanise(type)}
              </span>
              <span className="font-semibold text-sm">{formatNaira(total)}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Expenses</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  {['Date', 'Type', 'Amount', 'Description', 'Logged by'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap font-medium">{formatDate(expense.date)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${expenseTypeColors[expense.expenseType] || 'bg-gray-100 text-gray-800'}`}
                      >
                        {humanise(expense.expenseType)}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-destructive">{formatNaira(expense.amount)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{expense.description || '—'}</td>
                    <td className="px-4 py-3 text-muted-foreground">{expense.user.fullName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
