'use client';
// components/analytics/OrderFunnelChart.tsx
// Order status breakdown + payment and delivery method splits.

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatNaira } from '@/lib/utils';
import { OrderFunnelData } from '@/types';

const STATUS_COLORS: Record<string, string> = {
  pending:          '#f59e0b',
  confirmed:        '#3b82f6',
  processing:       '#6366f1',
  out_for_delivery: '#8b5cf6',
  delivered:        '#10b981',
  cancelled:        '#ef4444',
};

const STATUS_LABELS: Record<string, string> = {
  pending:          'Pending',
  confirmed:        'Confirmed',
  processing:       'Processing',
  out_for_delivery: 'Out for Delivery',
  delivered:        'Delivered',
  cancelled:        'Cancelled',
};

interface OrderFunnelChartProps {
  data:      OrderFunnelData | null;
  isLoading: boolean;
}

export function OrderFunnelChart({ data, isLoading }: OrderFunnelChartProps) {
  if (isLoading || !data) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-36 mb-1" /><Skeleton className="h-3 w-44" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
        </CardContent>
      </Card>
    );
  }

  const { byStatus, byPayment, byDelivery, total } = data;

  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Order Funnel</CardTitle>
          <CardDescription>No orders for this period</CardDescription>
        </CardHeader>
        <CardContent className="py-10 text-center text-muted-foreground text-sm">
          No orders found
        </CardContent>
      </Card>
    );
  }

  const paid     = byPayment.find((p) => p.status === 'paid');
  const unpaid   = byPayment.find((p) => p.status === 'unpaid');
  const delivery = byDelivery.find((d) => d.method === 'delivery');
  const pickup   = byDelivery.find((d) => d.method === 'pickup');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Order Funnel</CardTitle>
        <CardDescription>{total} total orders in period</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status breakdown */}
        <div className="space-y-2.5">
          {byStatus.map((item) => (
            <div key={item.status}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ background: STATUS_COLORS[item.status] ?? '#94a3b8' }} />
                  <span className="text-xs font-medium">
                    {STATUS_LABELS[item.status] ?? item.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-muted-foreground">{item.count} orders ({item.pct}%)</span>
                  <span className="font-semibold">{formatNaira(item.revenue)}</span>
                </div>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${item.pct}%`,
                    background: STATUS_COLORS[item.status] ?? '#94a3b8',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Payment + Delivery splits */}
        <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
          {/* Payment */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Payment
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-xs">Paid</span>
                </span>
                <span className="font-semibold text-xs">{paid?.count ?? 0}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: total > 0 ? `${((paid?.count ?? 0) / total) * 100}%` : '0%' }}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-amber-400" />
                  <span className="text-xs">Unpaid</span>
                </span>
                <span className="font-semibold text-xs">{unpaid?.count ?? 0}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-400"
                  style={{ width: total > 0 ? `${((unpaid?.count ?? 0) / total) * 100}%` : '0%' }}
                />
              </div>
            </div>
          </div>

          {/* Delivery method */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Method
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="text-xs">🚚 Delivery</span>
                </span>
                <span className="font-semibold text-xs">{delivery?.count ?? 0} ({delivery?.pct ?? 0}%)</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-purple-500"
                  style={{ width: `${delivery?.pct ?? 0}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="text-xs">🏪 Pickup</span>
                </span>
                <span className="font-semibold text-xs">{pickup?.count ?? 0} ({pickup?.pct ?? 0}%)</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-indigo-500"
                  style={{ width: `${pickup?.pct ?? 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
