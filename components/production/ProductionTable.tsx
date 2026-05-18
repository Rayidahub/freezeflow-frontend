'use client';
// components/production/ProductionTable.tsx
// Renders the list of production logs with pagination and actions.

import { Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatNaira, formatDate } from '@/lib/utils';
import { Production, PaginationMeta, UserRole } from '@/types';

interface ProductionTableProps {
  logs:        Production[];
  pagination:  PaginationMeta | null;
  isLoading:   boolean;
  userRole:    UserRole;
  onEdit:      (log: Production) => void;
  onDelete:    (log: Production) => void;
  onPageChange:(page: number) => void;
  onAddNew:    () => void;
}

export function ProductionTable({
  logs,
  pagination,
  isLoading,
  userRole,
  onEdit,
  onDelete,
  onPageChange,
  onAddNew,
}: ProductionTableProps) {
  const canEdit   = userRole === 'super_admin' || userRole === 'operations';
  const canDelete = userRole === 'super_admin';

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Production Records</CardTitle>
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
        <CardTitle className="text-base">Production Records</CardTitle>
        <CardDescription>
          {pagination
            ? `Showing ${logs.length} of ${pagination.total} entries`
            : `${logs.length} entries`}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                {['Date', 'Produced', 'Sold', 'Damaged', 'Remaining', 'Price / Bag', 'Total Sales', 'Logged by', ''].map((h) => (
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
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-4 py-3 font-medium whitespace-nowrap">
                    {formatDate(log.date)}
                  </td>
                  <td className="px-4 py-3">{log.bagsProduced.toLocaleString()}</td>
                  <td className="px-4 py-3 text-emerald-600 font-medium">
                    {log.bagsSold.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {log.damagedBags > 0 ? (
                      <Badge variant="destructive">{log.damagedBags}</Badge>
                    ) : (
                      <Badge variant="success">0</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">{log.remainingStock.toLocaleString()}</td>
                  <td className="px-4 py-3">{formatNaira(log.sellingPrice)}</td>
                  <td className="px-4 py-3 font-semibold text-primary">
                    {formatNaira(log.totalSales)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {log.user?.fullName ?? '—'}
                  </td>
                  {/* Actions — visible on row hover */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {canEdit && (
                        <Button
                          variant="ghost" size="icon"
                          className="h-7 w-7"
                          onClick={() => onEdit(log)}
                          title="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      {canDelete && (
                        <Button
                          variant="ghost" size="icon"
                          className="h-7 w-7 hover:text-destructive"
                          onClick={() => onDelete(log)}
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {logs.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-muted-foreground font-medium">No production logs found.</p>
            <p className="text-sm text-muted-foreground mt-1">
              {canEdit ? 'Click "Log Production" to add the first entry.' : 'No entries for this period.'}
            </p>
            {canEdit && (
              <Button className="mt-4" size="sm" onClick={onAddNew}>
                Log First Production
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
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline" size="sm"
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={!pagination.hasNext}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
