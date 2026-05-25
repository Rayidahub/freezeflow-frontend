'use client';
// app/(staff)/analytics/page.tsx
// Full analytics dashboard — KPIs, trends, expense breakdown,
// order funnel, production efficiency, top customers.

import { useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { Button }  from '@/components/ui/button';
import { KpiCards }                   from '@/components/analytics/KpiCards';
import { RevenueTrendChart }          from '@/components/analytics/RevenueTrendChart';
import { ExpenseBreakdownChart }      from '@/components/analytics/ExpenseBreakdownChart';
import { OrderFunnelChart }           from '@/components/analytics/OrderFunnelChart';
import { ProductionEfficiencyPanel }  from '@/components/analytics/ProductionEfficiencyPanel';
import { TopCustomersTable }          from '@/components/analytics/TopCustomersTable';
import {
  useKpi, useRevenueTrend, useExpenseBreakdown,
  useOrderFunnel, useProductionEfficiency, useTopCustomers,
} from '@/hooks/useAnalytics';
import { AnalyticsPeriod } from '@/types';

const PERIODS: { value: AnalyticsPeriod; label: string }[] = [
  { value: '7d',   label: 'Last 7 days'   },
  { value: '30d',  label: 'Last 30 days'  },
  { value: '90d',  label: 'Last 90 days'  },
  { value: 'year', label: 'This Year'     },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<AnalyticsPeriod>('30d');

  const kpi        = useKpi(period);
  const trend      = useRevenueTrend(period);
  const expenses   = useExpenseBreakdown(period);
  const funnel     = useOrderFunnel(period);
  const efficiency = useProductionEfficiency(period);
  const customers  = useTopCustomers(period);

  function handleRefreshAll() {
    kpi.refetch();
    trend.refetch();
    expenses.refetch();
    funnel.refetch();
    efficiency.refetch();
    customers.refetch();
  }

  const isAnyLoading =
    kpi.isLoading || trend.isLoading || expenses.isLoading ||
    funnel.isLoading || efficiency.isLoading || customers.isLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analytics & Reports</h2>
          <p className="text-muted-foreground mt-1">
            Business performance overview with key metrics and trends.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline" size="sm"
            onClick={handleRefreshAll}
            disabled={isAnyLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isAnyLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Period selector */}
      <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/50 p-1 w-fit">
        {PERIODS.map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              period === p.value
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* KPI cards */}
      <KpiCards data={kpi.data} isLoading={kpi.isLoading} />

      {/* Revenue trend — full width */}
      <RevenueTrendChart
        data={trend.data?.trend ?? []}
        isLoading={trend.isLoading}
        period={period}
      />

      {/* Two column: expense breakdown + order funnel */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ExpenseBreakdownChart data={expenses.data} isLoading={expenses.isLoading} />
        <OrderFunnelChart      data={funnel.data}   isLoading={funnel.isLoading} />
      </div>

      {/* Two column: production efficiency + top customers */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ProductionEfficiencyPanel data={efficiency.data} isLoading={efficiency.isLoading} />
        <TopCustomersTable          data={customers.data}  isLoading={customers.isLoading} />
      </div>
    </div>
  );
}
