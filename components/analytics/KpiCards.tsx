'use client';
// components/analytics/KpiCards.tsx
// Renders the top KPI metric cards with trend arrows.

import {
  DollarSign, TrendingDown, TrendingUp, Package,
  ShoppingCart, Users, Layers, AlertTriangle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatNaira } from '@/lib/utils';
import { KpiData, KpiValue } from '@/types';

// ─── Individual KPI card ──────────────────────────────────────────────────────

function KpiCard({
  label, kpi, format, icon: Icon, colorText, colorBg,
}: {
  label: string;
  kpi:   KpiValue;
  format: (v: number) => string;
  icon: React.ComponentType<{ className?: string }>;
  colorText: string;
  colorBg:   string;
}) {
  const change    = kpi.change;
  const isUp      = change !== null && change >= 0;
  const isDown    = change !== null && change < 0;
  const hasChange = change !== null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </CardTitle>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${colorBg}`}>
          <Icon className={`h-4 w-4 ${colorText}`} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{format(kpi.value)}</p>
        {hasChange && (
          <div className={`flex items-center gap-1 mt-1 text-xs ${isUp ? 'text-emerald-600' : 'text-red-500'}`}>
            {isUp
              ? <TrendingUp  className="h-3 w-3" />
              : <TrendingDown className="h-3 w-3" />
            }
            <span>{isUp ? '+' : ''}{change}% vs previous period</span>
          </div>
        )}
        {!hasChange && (
          <p className="text-xs text-muted-foreground mt-1">
            {kpi.prev > 0 ? `Previous: ${format(kpi.prev)}` : 'All time'}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Skeleton row ─────────────────────────────────────────────────────────────

function KpiSkeleton({ count }: { count: number }) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <Card key={i}>
          <CardContent className="pt-6">
            <Skeleton className="h-3 w-24 mb-3" />
            <Skeleton className="h-7 w-20 mb-2" />
            <Skeleton className="h-3 w-28" />
          </CardContent>
        </Card>
      ))}
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface KpiCardsProps {
  data:      KpiData | null;
  isLoading: boolean;
}

export function KpiCards({ data, isLoading }: KpiCardsProps) {
  if (isLoading || !data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiSkeleton count={8} />
      </div>
    );
  }

  const { kpis } = data;
  const n = (v: number) => v.toLocaleString();

  return (
    <div className="space-y-4">
      {/* Financial KPIs */}
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Financial
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Revenue"    kpi={kpis.revenue}    format={formatNaira} icon={DollarSign}   colorText="text-violet-600" colorBg="bg-violet-50" />
        <KpiCard label="Expenses"   kpi={kpis.expenses}   format={formatNaira} icon={TrendingDown}  colorText="text-red-600"    colorBg="bg-red-50" />
        <KpiCard label="Net Profit" kpi={kpis.netProfit}  format={formatNaira} icon={TrendingUp}    colorText="text-emerald-600" colorBg="bg-emerald-50" />
        <KpiCard label="Order Revenue" kpi={kpis.orderRevenue} format={formatNaira} icon={ShoppingCart} colorText="text-blue-600" colorBg="bg-blue-50" />
      </div>

      {/* Production KPIs */}
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-2">
        Production
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Bags Produced"  kpi={kpis.bagsProduced}   format={n} icon={Package}       colorText="text-blue-600"  colorBg="bg-blue-50" />
        <KpiCard label="Bags Sold"      kpi={kpis.bagsSold}       format={n} icon={ShoppingCart}   colorText="text-emerald-600" colorBg="bg-emerald-50" />
        <KpiCard label="Current Stock"  kpi={kpis.currentStock}   format={n} icon={Layers}         colorText="text-cyan-600"  colorBg="bg-cyan-50" />
        <KpiCard label="Damaged Bags"   kpi={kpis.damagedBags}    format={n} icon={AlertTriangle}  colorText="text-amber-600" colorBg="bg-amber-50" />
      </div>

      {/* Customer KPIs */}
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-2">
        Customers
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="New Customers"    kpi={kpis.newCustomers}   format={n} icon={Users}        colorText="text-pink-600"   colorBg="bg-pink-50" />
        <KpiCard label="Total Customers"  kpi={kpis.totalCustomers} format={n} icon={Users}        colorText="text-indigo-600" colorBg="bg-indigo-50" />
        <KpiCard label="Orders Placed"    kpi={kpis.ordersPlaced}   format={n} icon={ShoppingCart} colorText="text-teal-600"   colorBg="bg-teal-50" />
        <KpiCard label="Production Days"  kpi={kpis.productionDays} format={n} icon={Package}      colorText="text-orange-600" colorBg="bg-orange-50" />
      </div>
    </div>
  );
}
