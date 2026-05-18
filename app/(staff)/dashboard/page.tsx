// app/(staff)/dashboard/page.tsx
// Dashboard with live data from the production summary API.
'use client';

import { TrendingUp, TrendingDown, Package, ShoppingCart, DollarSign, Layers, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { formatNaira } from '@/lib/utils';
import { useProductionSummary, useProductionList } from '@/hooks/useProduction';
import { useAuth } from '@/context/AuthContext';

function StatCard({
  label, value, icon: Icon, colorText, colorBg, subLabel,
}: {
  label: string; value: string; subLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  colorText: string; colorBg: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${colorBg}`}>
          <Icon className={`h-4 w-4 ${colorText}`} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
        {subLabel && <p className="text-xs text-muted-foreground mt-1">{subLabel}</p>}
      </CardContent>
    </Card>
  );
}

function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6">
        <Skeleton className="h-4 w-28 mb-3" />
        <Skeleton className="h-8 w-20" />
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();

  const { summary: todaySummary,  isLoading: todayLoading }  = useProductionSummary('today');
  const { summary: monthSummary,  isLoading: monthLoading }  = useProductionSummary('month');
  const { logs: recentLogs,       isLoading: logsLoading }   = useProductionList({ limit: 5 });

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {greeting()}, {user?.fullName?.split(' ')[0] ?? 'there'} 👋
          </h2>
          <p className="text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening at FreezeFlow today.
          </p>
        </div>
        <Badge variant="info" className="hidden sm:flex">
          {new Date().toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long' })}
        </Badge>
      </div>

      {/* Today stats */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Today</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {todayLoading ? (
            [...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)
          ) : (
            <>
              <StatCard
                label="Bags Produced"
                value={(todaySummary?.bagsProduced ?? 0).toLocaleString()}
                icon={Package}
                colorText="text-blue-600" colorBg="bg-blue-50"
                subLabel="units produced today"
              />
              <StatCard
                label="Bags Sold"
                value={(todaySummary?.bagsSold ?? 0).toLocaleString()}
                icon={ShoppingCart}
                colorText="text-emerald-600" colorBg="bg-emerald-50"
                subLabel="units sold today"
              />
              <StatCard
                label="Today's Revenue"
                value={formatNaira(todaySummary?.totalSales ?? 0)}
                icon={DollarSign}
                colorText="text-violet-600" colorBg="bg-violet-50"
                subLabel="from production sales"
              />
              <StatCard
                label="Current Stock"
                value={(todaySummary?.currentStock ?? 0).toLocaleString()}
                icon={Layers}
                colorText="text-cyan-600" colorBg="bg-cyan-50"
                subLabel="bags remaining"
              />
            </>
          )}
        </div>
      </div>

      {/* Monthly stats */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">This Month</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {monthLoading ? (
            [...Array(3)].map((_, i) => <StatCardSkeleton key={i} />)
          ) : (
            <>
              <StatCard
                label="Total Produced"
                value={(monthSummary?.bagsProduced ?? 0).toLocaleString()}
                icon={Package}
                colorText="text-blue-600" colorBg="bg-blue-50"
                subLabel={`across ${monthSummary?.totalLogs ?? 0} production days`}
              />
              <StatCard
                label="Total Revenue"
                value={formatNaira(monthSummary?.totalSales ?? 0)}
                icon={DollarSign}
                colorText="text-violet-600" colorBg="bg-violet-50"
                subLabel="monthly production sales"
              />
              <StatCard
                label="Damaged Bags"
                value={(monthSummary?.damagedBags ?? 0).toLocaleString()}
                icon={AlertTriangle}
                colorText="text-amber-600" colorBg="bg-amber-50"
                subLabel="total losses this month"
              />
            </>
          )}
        </div>
      </div>

      {/* Recent Production Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Production Logs</CardTitle>
          <CardDescription>Last 5 entries from your team</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {logsLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : recentLogs.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground text-sm">
              No production logs yet. Head to the Production page to add the first one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    {['Date', 'Produced', 'Sold', 'Revenue', 'Stock'].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium whitespace-nowrap">
                        {new Date(log.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="px-4 py-3">{log.bagsProduced}</td>
                      <td className="px-4 py-3 text-emerald-600 font-medium">{log.bagsSold}</td>
                      <td className="px-4 py-3 text-primary font-semibold">{formatNaira(log.totalSales)}</td>
                      <td className="px-4 py-3">{log.remainingStock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
