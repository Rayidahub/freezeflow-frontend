'use client';
// app/(staff)/admin/orders/page.tsx
// Staff view of all customer orders with status update actions.

import { useState } from 'react';
import { ShoppingCart, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button }   from '@/components/ui/button';
import { Badge }    from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/orders/OrderStatusBadge';
import { useToast }           from '@/components/ui/toast';
import { useStaffOrders, useOrderSummary, useStaffOrderMutations } from '@/hooks/useStaffOrders';
import { formatNaira, formatDate } from '@/lib/utils';
import { Order, OrderStatus } from '@/types';

const ORDER_STATUSES: { value: string; label: string }[] = [
  { value: '',                label: 'All Orders' },
  { value: 'pending',         label: 'Pending' },
  { value: 'confirmed',       label: 'Confirmed' },
  { value: 'processing',      label: 'Processing' },
  { value: 'out_for_delivery',label: 'Out for Delivery' },
  { value: 'delivered',       label: 'Delivered' },
  { value: 'cancelled',       label: 'Cancelled' },
];

// Next allowed status transitions per current status
const NEXT_ACTIONS: Record<OrderStatus, { status: OrderStatus; label: string; variant: 'default' | 'outline' | 'destructive' }[]> = {
  pending:          [{ status: 'confirmed',        label: 'Confirm',        variant: 'default' },
                     { status: 'cancelled',         label: 'Cancel',         variant: 'destructive' }],
  confirmed:        [{ status: 'processing',        label: 'Start Processing', variant: 'default' },
                     { status: 'cancelled',          label: 'Cancel',         variant: 'destructive' }],
  processing:       [{ status: 'out_for_delivery',  label: 'Send Out',       variant: 'default' },
                     { status: 'cancelled',          label: 'Cancel',         variant: 'destructive' }],
  out_for_delivery: [{ status: 'delivered',         label: 'Mark Delivered', variant: 'default' }],
  delivered:        [],
  cancelled:        [],
};

export default function StaffOrdersPage() {
  const { toast }   = useToast();
  const [page,      setPage]      = useState(1);
  const [status,    setStatus]    = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const { orders, pagination, isLoading, refetch } = useStaffOrders(page, status || undefined);
  const { summary, isLoading: summaryLoading }      = useOrderSummary();
  const { updateStatus, isSubmitting }              = useStaffOrderMutations();

  async function handleStatusUpdate(order: Order, newStatus: OrderStatus) {
    setUpdatingId(order.id);
    const updated = await updateStatus(order.id, newStatus);
    if (updated) {
      toast(`Order updated to: ${newStatus.replace('_', ' ')}`, 'success');
      refetch();
    } else {
      toast('Failed to update order status', 'error');
    }
    setUpdatingId(null);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Customer Orders</h2>
        <p className="text-muted-foreground mt-1">Manage and fulfil all customer orders.</p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryLoading ? (
          [...Array(4)].map((_, i) => (
            <Card key={i}><CardContent className="pt-6"><Skeleton className="h-8 w-full" /></CardContent></Card>
          ))
        ) : (
          <>
            {[
              { label: 'Pending',    value: summary?.totalPending ?? 0, color: 'text-amber-600' },
              { label: 'Active',     value: summary?.totalActive  ?? 0, color: 'text-blue-600'  },
              { label: 'Delivered',  value: summary?.byStatus?.delivered ?? 0, color: 'text-emerald-600' },
              { label: 'Cancelled',  value: summary?.byStatus?.cancelled ?? 0, color: 'text-red-600' },
            ].map((s) => (
              <Card key={s.label}>
                <CardHeader className="pb-1">
                  <CardTitle className="text-xs font-medium text-muted-foreground">{s.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-muted/50 p-1 w-fit">
        {ORDER_STATUSES.map((s) => (
          <button
            key={s.value}
            onClick={() => { setStatus(s.value); setPage(1); }}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              status === s.value
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {s.label}
            {s.value === 'pending' && (summary?.totalPending ?? 0) > 0 && (
              <span className="ml-1.5 rounded-full bg-amber-500 text-white text-xs px-1.5 py-0.5">
                {summary?.totalPending}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />Orders
          </CardTitle>
          <CardDescription>
            {pagination ? `${pagination.total} total orders` : ''}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              No orders found for this filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    {['Date', 'Customer', 'Product', 'Qty', 'Total', 'Method', 'Status', 'Payment', 'Actions'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orders.map((order) => {
                    const actions = NEXT_ACTIONS[order.orderStatus as OrderStatus] ?? [];
                    const isUpdating = isSubmitting && updatingId === order.id;
                    return (
                      <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap text-xs text-muted-foreground">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium">{order.customer?.fullName ?? '—'}</p>
                          <p className="text-xs text-muted-foreground">{order.customer?.phone ?? ''}</p>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {order.product?.name ?? '—'}
                        </td>
                        <td className="px-4 py-3">{order.quantity}</td>
                        <td className="px-4 py-3 font-semibold text-primary whitespace-nowrap">
                          {formatNaira(order.totalAmount)}
                        </td>
                        <td className="px-4 py-3 capitalize whitespace-nowrap">
                          {order.deliveryMethod === 'delivery' ? '🚚 Delivery' : '🏪 Pickup'}
                        </td>
                        <td className="px-4 py-3">
                          <OrderStatusBadge status={order.orderStatus} />
                        </td>
                        <td className="px-4 py-3">
                          <PaymentStatusBadge status={order.paymentStatus} />
                        </td>
                        <td className="px-4 py-3">
                          {actions.length > 0 && (
                            <div className="flex gap-1 flex-wrap">
                              {actions.map((action) => (
                                <Button
                                  key={action.status}
                                  variant={action.variant}
                                  size="sm"
                                  className="h-7 text-xs"
                                  disabled={isUpdating}
                                  onClick={() => handleStatusUpdate(order, action.status)}
                                >
                                  {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : action.label}
                                </Button>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border px-4 py-3">
              <p className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={!pagination.hasPrev} onClick={() => setPage(p => p - 1)}>
                  <ChevronLeft className="h-4 w-4 mr-1" />Previous
                </Button>
                <Button variant="outline" size="sm" disabled={!pagination.hasNext} onClick={() => setPage(p => p + 1)}>
                  Next<ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
