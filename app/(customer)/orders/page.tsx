// app/(customer)/orders/page.tsx
import type { Metadata } from 'next';
import { Package, ChevronRight, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatNaira, formatDate } from '@/lib/utils';

export const metadata: Metadata = { title: 'My Orders | FreezeFlow' };

// Placeholder — will be replaced by authenticated API calls in Sprint 2+
const mockOrders = [
  {
    id: 'ord-001',
    product: { name: 'Large Ice Block', sizeKg: 10 },
    quantity: 3,
    totalAmount: 3000,
    orderStatus: 'out_for_delivery' as const,
    paymentStatus: 'paid' as const,
    deliveryMethod: 'delivery' as const,
    createdAt: '2024-12-15T09:00:00Z',
  },
  {
    id: 'ord-002',
    product: { name: 'Small Ice Block', sizeKg: 5 },
    quantity: 5,
    totalAmount: 2500,
    orderStatus: 'delivered' as const,
    paymentStatus: 'paid' as const,
    deliveryMethod: 'pickup' as const,
    createdAt: '2024-12-13T14:00:00Z',
  },
];

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'warning' as const },
  confirmed: { label: 'Confirmed', icon: CheckCircle, color: 'info' as const },
  processing: { label: 'Processing', icon: Package, color: 'info' as const },
  out_for_delivery: { label: 'Out for Delivery', icon: Truck, color: 'info' as const },
  delivered: { label: 'Delivered', icon: CheckCircle, color: 'success' as const },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'destructive' as const },
};

export default function OrdersPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Orders</h1>
          <p className="text-muted-foreground mt-1">Track and manage your ice block orders.</p>
        </div>
        <Button asChild>
          <Link href="/products">Place New Order</Link>
        </Button>
      </div>

      {mockOrders.length === 0 ? (
        <Card className="py-16 text-center">
          <CardContent>
            <Package className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="font-semibold text-lg">No orders yet</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Place your first order to get fresh ice delivered.
            </p>
            <Button asChild className="mt-6">
              <Link href="/products">Browse Products</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {mockOrders.map((order) => {
            const status = statusConfig[order.orderStatus];
            const StatusIcon = status.icon;

            return (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Package className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold">{order.product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.quantity} × {order.product.sizeKg}kg block
                          {order.quantity > 1 ? 's' : ''} ·{' '}
                          {order.deliveryMethod === 'delivery' ? '🚚 Delivery' : '🏪 Pickup'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Ordered {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={status.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {status.label}
                        </Badge>
                        <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'warning'}>
                          {order.paymentStatus === 'paid' ? '✓ Paid' : 'Unpaid'}
                        </Badge>
                      </div>
                      <p className="font-bold text-lg">{formatNaira(order.totalAmount)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Auth prompt for guests */}
      <div className="mt-10 rounded-xl border border-border bg-muted/40 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Sign in to see your real orders and track deliveries in real time.
        </p>
        <Button asChild variant="outline" size="sm" className="mt-3">
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    </div>
  );
}
