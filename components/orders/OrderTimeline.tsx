// components/orders/OrderTimeline.tsx
// Visual status timeline shown on the customer order detail page.

import { CheckCircle, Circle, Clock } from 'lucide-react';
import { OrderStatus, OrderStatusHistoryEntry } from '@/types';

const STEPS: { status: OrderStatus; label: string; description: string }[] = [
  { status: 'pending',          label: 'Order Placed',      description: 'Your order has been received' },
  { status: 'confirmed',        label: 'Confirmed',         description: 'Order confirmed by staff' },
  { status: 'processing',       label: 'Processing',        description: 'Ice blocks being prepared' },
  { status: 'out_for_delivery', label: 'Out for Delivery',  description: 'On the way to you' },
  { status: 'delivered',        label: 'Delivered',         description: 'Order completed' },
];

const STATUS_ORDER: Record<OrderStatus, number> = {
  pending:          0,
  confirmed:        1,
  processing:       2,
  out_for_delivery: 3,
  delivered:        4,
  cancelled:        -1,
};

interface OrderTimelineProps {
  currentStatus: OrderStatus;
  history?:      OrderStatusHistoryEntry[];
}

export function OrderTimeline({ currentStatus, history = [] }: OrderTimelineProps) {
  const currentIndex = STATUS_ORDER[currentStatus] ?? 0;
  const isCancelled  = currentStatus === 'cancelled';

  if (isCancelled) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-center">
        <p className="font-semibold text-red-700">Order Cancelled</p>
        <p className="text-sm text-red-500 mt-1">This order has been cancelled.</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {STEPS.map((step, index) => {
        const stepIndex   = STATUS_ORDER[step.status];
        const isCompleted = stepIndex < currentIndex;
        const isCurrent   = stepIndex === currentIndex;
        const isPending   = stepIndex > currentIndex;

        // Find matching history entry for timestamp
        const historyEntry = history.find((h) => h.status === step.status);

        return (
          <div key={step.status} className="flex gap-4">
            {/* Icon + connector line */}
            <div className="flex flex-col items-center">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                isCompleted
                  ? 'border-emerald-500 bg-emerald-500'
                  : isCurrent
                  ? 'border-primary bg-primary'
                  : 'border-muted-foreground/30 bg-background'
              }`}>
                {isCompleted ? (
                  <CheckCircle className="h-4 w-4 text-white" />
                ) : isCurrent ? (
                  <Clock className="h-4 w-4 text-white" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground/40" />
                )}
              </div>
              {index < STEPS.length - 1 && (
                <div className={`w-0.5 flex-1 my-1 min-h-[20px] transition-colors ${
                  isCompleted ? 'bg-emerald-500' : 'bg-muted-foreground/20'
                }`} />
              )}
            </div>

            {/* Content */}
            <div className={`pb-4 pt-1 ${index === STEPS.length - 1 ? 'pb-0' : ''}`}>
              <p className={`font-semibold text-sm ${
                isPending ? 'text-muted-foreground' : 'text-foreground'
              }`}>
                {step.label}
                {isCurrent && (
                  <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 text-primary text-xs px-2 py-0.5 font-medium">
                    Current
                  </span>
                )}
              </p>
              <p className={`text-xs mt-0.5 ${isPending ? 'text-muted-foreground/60' : 'text-muted-foreground'}`}>
                {step.description}
              </p>
              {historyEntry && (
                <p className="text-xs text-muted-foreground/70 mt-0.5">
                  {new Date(historyEntry.createdAt).toLocaleString('en-NG', {
                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
