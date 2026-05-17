// app/(staff)/production/page.tsx
import type { Metadata } from 'next';
import { Plus, Filter, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatNaira, formatDate } from '@/lib/utils';

export const metadata: Metadata = { title: 'Production' };

// Placeholder data — will be replaced by API calls in Sprint 2
const productionLogs = [
  {
    id: '1',
    date: '2024-12-15T08:00:00Z',
    bagsProduced: 240,
    bagsSold: 198,
    damagedBags: 4,
    remainingStock: 38,
    sellingPrice: 500,
    totalSales: 99000,
    user: { fullName: 'Operations Staff' },
  },
  {
    id: '2',
    date: '2024-12-14T08:00:00Z',
    bagsProduced: 220,
    bagsSold: 210,
    damagedBags: 2,
    remainingStock: 8,
    sellingPrice: 500,
    totalSales: 105000,
    user: { fullName: 'Operations Staff' },
  },
];

export default function ProductionPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Production Logs</h2>
          <p className="text-muted-foreground mt-1">Track daily ice block production and sales.</p>
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
            Log Production
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Production Records</CardTitle>
          <CardDescription>All production entries sorted by date</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  {['Date', 'Produced', 'Sold', 'Damaged', 'Remaining', 'Price/Bag', 'Total Sales', 'Logged by'].map(
                    (h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {productionLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium whitespace-nowrap">{formatDate(log.date)}</td>
                    <td className="px-4 py-3">{log.bagsProduced}</td>
                    <td className="px-4 py-3 text-emerald-600 font-medium">{log.bagsSold}</td>
                    <td className="px-4 py-3">
                      {log.damagedBags > 0 ? (
                        <Badge variant="destructive">{log.damagedBags}</Badge>
                      ) : (
                        <Badge variant="success">0</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">{log.remainingStock}</td>
                    <td className="px-4 py-3">{formatNaira(log.sellingPrice)}</td>
                    <td className="px-4 py-3 font-semibold text-primary">{formatNaira(log.totalSales)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{log.user.fullName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty state */}
          {productionLogs.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No production logs yet.</p>
              <Button className="mt-4" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Log First Production
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
