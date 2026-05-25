'use client';
// app/(staff)/admin/deliveries/page.tsx
// Delivery staff view — shows only their assigned orders.
// They can mark orders as out for delivery and then delivered.

import { useState } from 'react';
import { Truck, MapPin, Phone, Loader2, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button }   from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { useToast }  from '@/components/ui/toast';
import { useAuth }   from '@/context/AuthContext';
import { useMyDeliveries } from '@/hooks/useDelivery';
import { useStaffOrderMutations } from '@/hooks/useStaffOrders';
import { formatNaira, formatDate } from '@/lib/utils';
import { Order, OrderStatus } from '@/types';

const NEXT_STATUS: Partial<Record<OrderStatus, { status: OrderStatus; label: string }>> = {
  processing:       { status: 'out_for_delivery', label: '🚚 Mark Out for Delivery' },
  out_for_delivery: { status: 'delivered',        label: '✅ Mark Delivered' },
};

export default function DeliveriesPage() {
  const { user }  = useAuth();
  const { toast } = useToast();

  const [statusFilter,  setStatusFilter]  = useState('');
  const [updatingId,    setUpdatingId]    = useState<string | null>(null);

  const { orders, isLoading, error, refetch } = useMyDeliveries(statusFilter || undefined);
  const { updateStatus, isSubmitting }        = useStaffOrderMutations();

  async function handleStatusUpdate(order: Order, newStatus: OrderStatus) {
    setUpdatingId(order.id);
    const updated = await updateStatus(order.id, newStatus);
    if (updated) {
      toast(
        newStatus === 'delivered'
          ? 'Order marked as delivered ✅'
          : 'Order marked as out for delivery 🚚',
        'success'
      );
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
        <h2 className="text-2xl font-bold tracking-tight">My Deliveries</h2>
        <p className="text-muted-foreground mt-1">
          Hi {user?.fullName?.split(' ')[0]}, here are your assigned deliveries.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/50 p-1 w-fit">
        {[
          { value: '',                 label: 'Active' },
          { value: 'out_for_delivery', label: 'Out for Delivery' },
          { value: 'delivered',        label: 'Delivered' },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              statusFilter === f.value
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}><CardContent className="pt-6"><Skeleton className="h-24 w-full" /></CardContent></Card>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-md bg-destructive/10 border border-destructive/30 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Truck className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <p className="font-semibold text-muted-foreground">No deliveries assigned</p>
            <p className="text-sm text-muted-foreground mt-1">
              Your deliveries will appear here once assigned by operations.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const nextAction = NEXT_STATUS[order.orderStatus as OrderStatus];
            const isUpdating = isSubmitting && updatingId === order.id;

            return (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Package className="h-4 w-4 text-primary" />
                        {order.product?.name ?? 'Ice Block'} × {order.quantity}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Order #{order.id.slice(-8).toUpperCase()} · {formatDate(order.createdAt)}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <OrderStatusBadge status={order.orderStatus} />
                      <span className="font-bold text-primary">{formatNaira(order.totalAmount)}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Customer info */}
                  <div className="rounded-lg bg-muted/50 p-3 space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-3.5 w-3.5 shrink-0" />
                      <span className="font-medium text-foreground">{order.customer?.fullName}</span>
                      <span>·</span>
                      <span>{order.customer?.phone}</span>
                    </div>
                    {order.deliveryAddress && (
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                        <span>{order.deliveryAddress}</span>
                      </div>
                    )}
                    {order.specialInstructions && (
                      <p className="text-xs text-muted-foreground border-t border-border pt-2 mt-2">
                        📝 {order.specialInstructions}
                      </p>
                    )}
                  </div>

                  {/* Action button */}
                  {nextAction && (
                    <Button
                      className="w-full"
                      disabled={isUpdating}
                      onClick={() => handleStatusUpdate(order, nextAction.status)}
                    >
                      {isUpdating
                        ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Updating…</>
                        : nextAction.label
                      }
                    </Button>
                  )}

                  {order.orderStatus === 'delivered' && (
                    <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-700 text-center font-medium">
                      ✅ Delivery completed
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
