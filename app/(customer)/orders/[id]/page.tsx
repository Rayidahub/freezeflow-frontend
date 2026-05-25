'use client';
// app/(customer)/orders/[id]/page.tsx
// Full order detail with status timeline and delivery info.

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Package, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/orders/OrderStatusBadge';
import { OrderTimeline } from '@/components/orders/OrderTimeline';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { ordersApi, deliveryApi } from '@/lib/api';
import { formatNaira, formatDate } from '@/lib/utils';
import { Order, OrderStatusHistoryEntry, DeliveryAssignment } from '@/types';

export default function OrderDetailPage() {
  const params   = useParams();
  const router   = useRouter();
  const { token, isAuthenticated } = useCustomerAuth();

  const [order,      setOrder]      = useState<Order | null>(null);
  const [history,    setHistory]    = useState<OrderStatusHistoryEntry[]>([]);
  const [assignment, setAssignment] = useState<DeliveryAssignment | null>(null);
  const [isLoading,  setIsLoading]  = useState(true);
  const [error,      setError]      = useState<string | null>(null);

  const orderId = params.id as string;

  useEffect(() => {
    if (!isAuthenticated || !token || !orderId) return;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        // Load order, history and delivery assignment in parallel
        const [orderRes, historyRes] = await Promise.all([
          ordersApi.getMyOrderById(token!, orderId),
          deliveryApi.getHistory(token!, orderId).catch(() => ({ data: [] as OrderStatusHistoryEntry[] })),
        ]);

        if (orderRes.data) setOrder(orderRes.data);
        if (historyRes.data) setHistory(historyRes.data);

        // Try to load delivery assignment (may 404 for pickup orders)
        if (orderRes.data?.deliveryMethod === 'delivery') {
          deliveryApi.getByOrder(token!, orderId)
            .then((r) => { if (r.data) setAssignment(r.data); })
            .catch(() => { /* no assignment yet */ });
        }
      } catch {
        setError('Failed to load order details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [isAuthenticated, token, orderId]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Please sign in to view order details.</p>
        <Button className="mt-4" onClick={() => router.push('/customer-login')}>Sign In</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">{error ?? 'Order not found.'}</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      {/* Back button */}
      <Button variant="ghost" size="sm" className="mb-6 -ml-2" onClick={() => router.push('/orders')}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Orders
      </Button>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Order Details</h1>
          <p className="text-muted-foreground text-sm mt-1">
            #{order.id.slice(-8).toUpperCase()} · Placed {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <OrderStatusBadge  status={order.orderStatus} />
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>
      </div>

      {/* Order summary */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="h-4 w-4" />Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Product</span>
            <span className="font-medium">{order.product?.name ?? '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Size</span>
            <span className="font-medium">{order.product?.sizeKg}kg block</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Quantity</span>
            <span className="font-medium">{order.quantity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Price per block</span>
            <span className="font-medium">{formatNaira(order.product?.price ?? 0)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-3">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-primary text-base">{formatNaira(order.totalAmount)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Delivery info */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Delivery Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Method</span>
            <span className="font-medium capitalize">
              {order.deliveryMethod === 'delivery' ? '🚚 Delivery' : '🏪 Pickup'}
            </span>
          </div>
          {order.deliveryAddress && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Address</span>
              <span className="font-medium text-right max-w-xs">{order.deliveryAddress}</span>
            </div>
          )}
          {assignment && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery Staff</span>
              <span className="font-medium">{assignment.deliveryStaff.fullName}</span>
            </div>
          )}
          {order.specialInstructions && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Instructions</span>
              <span className="font-medium text-right max-w-xs">{order.specialInstructions}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status timeline */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Order Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderTimeline
            currentStatus={order.orderStatus}
            history={history}
          />
        </CardContent>
      </Card>
    </div>
  );
}
