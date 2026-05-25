'use client';
// components/analytics/TopCustomersTable.tsx
// Top customers by spend in the selected period.

import { Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatNaira } from '@/lib/utils';
import { TopCustomersData } from '@/types';

interface TopCustomersTableProps {
  data:      TopCustomersData | null;
  isLoading: boolean;
}

export function TopCustomersTable({ data, isLoading }: TopCustomersTableProps) {
  if (isLoading || !data) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-36 mb-1" /><Skeleton className="h-3 w-44" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
        </CardContent>
      </Card>
    );
  }

  const { customers } = data;

  if (customers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />Top Customers
          </CardTitle>
          <CardDescription>No orders for this period</CardDescription>
        </CardHeader>
        <CardContent className="py-10 text-center text-muted-foreground text-sm">
          No customer orders found
        </CardContent>
      </Card>
    );
  }

  const maxSpend = Math.max(...customers.map((c) => c.totalSpend), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Users className="h-4 w-4" />Top Customers
        </CardTitle>
        <CardDescription>Ranked by total spend in period</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              {['#', 'Customer', 'Orders', 'Total Spend', ''].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {customers.map((entry, i) => {
              const pct = Math.round((entry.totalSpend / maxSpend) * 100);
              return (
                <tr key={i} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-muted-foreground font-medium w-8">{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                        {entry.customer?.fullName?.charAt(0).toUpperCase() ?? '?'}
                      </div>
                      <div>
                        <p className="font-medium leading-none">{entry.customer?.fullName ?? 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{entry.customer?.phone ?? ''}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{entry.orderCount}</td>
                  <td className="px-4 py-3 font-semibold text-primary">{formatNaira(entry.totalSpend)}</td>
                  <td className="px-4 py-3 w-24">
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${pct}%` }} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
