// components/orders/OrderStatusBadge.tsx
// Consistent status badge used on both portals.

import { OrderStatus, PaymentStatus } from '@/types';

const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  pending:          { label: 'Pending',          className: 'bg-amber-100 text-amber-800' },
  confirmed:        { label: 'Confirmed',         className: 'bg-blue-100 text-blue-800' },
  processing:       { label: 'Processing',        className: 'bg-indigo-100 text-indigo-800' },
  out_for_delivery: { label: 'Out for Delivery',  className: 'bg-purple-100 text-purple-800' },
  delivered:        { label: 'Delivered',         className: 'bg-emerald-100 text-emerald-800' },
  cancelled:        { label: 'Cancelled',         className: 'bg-red-100 text-red-800' },
};

const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, { label: string; className: string }> = {
  unpaid:   { label: 'Unpaid',   className: 'bg-gray-100 text-gray-700' },
  paid:     { label: 'Paid',     className: 'bg-emerald-100 text-emerald-800' },
  failed:   { label: 'Failed',   className: 'bg-red-100 text-red-700' },
  refunded: { label: 'Refunded', className: 'bg-orange-100 text-orange-800' },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const cfg = ORDER_STATUS_CONFIG[status] ?? { label: status, className: 'bg-gray-100 text-gray-700' };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const cfg = PAYMENT_STATUS_CONFIG[status] ?? { label: status, className: 'bg-gray-100 text-gray-700' };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}
