// app/(customer)/orders/page.tsx
// Customer order history — live from API, with cancel action.
'use client';

import { useState } from 'react';
import { Package, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/orders/OrderStatusBadge';
import { useToast } from '@/components/ui/toast';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { useMyOrders, useOrderMutations } from '@/hooks/useOrders';
import { formatNaira, formatDate } from '@/lib/utils';
import { Order } from '@/types';

export default function CustomerOrdersPage() {
  const { isAuthenticated } = useCustomerAuth();
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const { orders, pagination, isLoading, refetch } = useMyOrders(page);
  const { cancelOrder, isSubmitting } = useOrderMutations();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Package className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
        <h2 className="text-xl font-bold">Sign in to view your orders</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          You need to be signed in to view your order history.
        </p>
        <div className="flex justify-center gap-3 mt-6">
          <Button asChild><Link href="/customer-login">Sign In</Link></Button>
          <Button asChild variant="outline"><Link href="/customer-register">Create Account</Link></Button>
        </div>
      </div>
    );
  }

  async function handleCancel(order: Order) {
    setCancellingId(order.id);
    const ok = await cancelOrder(order.id);
    if (ok) {
      toast('Order cancelled successfully', 'success');
      refetch();
    } else {
      toast('Failed to cancel order', 'error');
    }
    setCancellingId(null);
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Orders</h1>
          <p className="text-muted-foreground mt-1">Track and manage your ice block orders.</p>
        </div>
        <Button asChild><Link href="/products">Place New Order</Link></Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : orders.length === 0 ? (
        <Card className="py-16 text-center">
          <CardContent>
            <Package className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="font-semibold text-lg">No orders yet</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Place your first order to get fresh ice delivered.
            </p>
            <Button asChild className="mt-6"><Link href="/products">Browse Products</Link></Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold">{order.product?.name ?? 'Product'}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.quantity} × {order.product?.sizeKg}kg ·{' '}
                        {order.deliveryMethod === 'delivery' ? '🚚 Delivery' : '🏪 Pickup'}
                      </p>
                      {order.deliveryAddress && (
                        <p className="text-xs text-muted-foreground mt-0.5 max-w-xs truncate">
                          📍 {order.deliveryAddress}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Ordered {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      <OrderStatusBadge status={order.orderStatus} />
                      <PaymentStatusBadge status={order.paymentStatus} />
                    </div>
                    <p className="font-bold text-lg">{formatNaira(order.totalAmount)}</p>
                    {['pending', 'confirmed'].includes(order.orderStatus) && (
                      <Button
                        variant="ghost" size="sm"
                        className="text-destructive hover:text-destructive h-7 text-xs"
                        onClick={() => handleCancel(order)}
                        disabled={isSubmitting && cancellingId === order.id}
                      >
                        {isSubmitting && cancellingId === order.id
                          ? <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          : <XCircle className="h-3 w-3 mr-1" />
                        }
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              <Button variant="outline" size="sm" disabled={!pagination.hasPrev} onClick={() => setPage(p => p - 1)}>
                Previous
              </Button>
              <span className="flex items-center text-sm text-muted-foreground px-2">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button variant="outline" size="sm" disabled={!pagination.hasNext} onClick={() => setPage(p => p + 1)}>
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
