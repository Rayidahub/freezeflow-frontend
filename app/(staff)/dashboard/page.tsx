// app/(staff)/dashboard/page.tsx
// Dashboard — live production + expense data with net profit calculation.
'use client';

import {
  TrendingUp, TrendingDown, Package, ShoppingCart,
  DollarSign, Layers, AlertTriangle, ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge }    from '@/components/ui/badge';
import { Button }   from '@/components/ui/button';
import { formatNaira } from '@/lib/utils';
import { useProductionSummary, useProductionList } from '@/hooks/useProduction';
import { useOrderSummary } from '@/hooks/useStaffOrders';
import { useExpenseSummary } from '@/hooks/useExpenses';
import { useAuth } from '@/context/AuthContext';

// ─── Reusable stat card ───────────────────────────────────────────────────────

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

// ─── Net profit card ──────────────────────────────────────────────────────────

function NetProfitCard({
  revenue, expenses, isLoading,
}: {
  revenue: number; expenses: number; isLoading: boolean;
}) {
  const profit    = revenue - expenses;
  const isPositive = profit >= 0;

  if (isLoading) {
    return (
      <Card className="lg:col-span-2">
        <CardContent className="pt-6">
          <Skeleton className="h-4 w-28 mb-3" />
          <Skeleton className="h-10 w-40" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`lg:col-span-2 border-2 ${isPositive ? 'border-emerald-200 bg-emerald-50/50' : 'border-red-200 bg-red-50/50'}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Net Profit (Today)
          </CardTitle>
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${isPositive ? 'bg-emerald-100' : 'bg-red-100'}`}>
            {isPositive
              ? <TrendingUp className="h-4 w-4 text-emerald-600" />
              : <TrendingDown className="h-4 w-4 text-red-600" />
            }
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className={`text-3xl font-black ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
          {isPositive ? '+' : ''}{formatNaira(profit)}
        </p>
        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
          <span>Revenue: <strong className="text-foreground">{formatNaira(revenue)}</strong></span>
          <span>Expenses: <strong className="text-foreground">{formatNaira(expenses)}</strong></span>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user } = useAuth();

  const { summary: todayProd,  isLoading: todayProdLoading }  = useProductionSummary('today');
  const { summary: monthProd,  isLoading: monthProdLoading }  = useProductionSummary('month');
  const { summary: todayExp,   isLoading: todayExpLoading }   = useExpenseSummary('today');
  const { summary: monthExp,   isLoading: monthExpLoading }   = useExpenseSummary('month');
  const { logs: recentLogs,    isLoading: logsLoading }       = useProductionList({ limit: 5 });
  const { summary: orderSum,   isLoading: orderSumLoading }   = useOrderSummary();

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const todayLoading  = todayProdLoading || todayExpLoading;
  const monthLoading  = monthProdLoading || monthExpLoading;

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
          {new Date().toLocaleDateString('en-NG', {
            weekday: 'long', day: 'numeric', month: 'long',
          })}
        </Badge>
      </div>

      {/* ── TODAY ── */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Today
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {todayLoading ? (
            [...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)
          ) : (
            <>
              <StatCard
                label="Bags Produced"
                value={(todayProd?.bagsProduced ?? 0).toLocaleString()}
                icon={Package}
                colorText="text-blue-600" colorBg="bg-blue-50"
                subLabel="units produced"
              />
              <StatCard
                label="Bags Sold"
                value={(todayProd?.bagsSold ?? 0).toLocaleString()}
                icon={ShoppingCart}
                colorText="text-emerald-600" colorBg="bg-emerald-50"
                subLabel="units sold"
              />
              <StatCard
                label="Revenue"
                value={formatNaira(todayProd?.totalSales ?? 0)}
                icon={DollarSign}
                colorText="text-violet-600" colorBg="bg-violet-50"
                subLabel="from sales"
              />
              <StatCard
                label="Expenses"
                value={formatNaira(todayExp?.totalExpenses ?? 0)}
                icon={TrendingDown}
                colorText="text-red-600" colorBg="bg-red-50"
                subLabel={`${todayExp?.totalEntries ?? 0} entries`}
              />
            </>
          )}
        </div>
      </div>

      {/* Net Profit (today) */}
      <div className="grid gap-4 lg:grid-cols-4">
        <NetProfitCard
          revenue={todayProd?.totalSales ?? 0}
          expenses={todayExp?.totalExpenses ?? 0}
          isLoading={todayLoading}
        />
        <StatCard
          label="Current Stock"
          value={(todayProd?.currentStock ?? 0).toLocaleString()}
          icon={Layers}
          colorText="text-cyan-600" colorBg="bg-cyan-50"
          subLabel="bags remaining"
        />
        <StatCard
          label="Damaged Bags"
          value={(todayProd?.damagedBags ?? 0).toLocaleString()}
          icon={AlertTriangle}
          colorText="text-amber-600" colorBg="bg-amber-50"
          subLabel="today's losses"
        />
      </div>

      {/* ── THIS MONTH ── */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          This Month
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {monthLoading ? (
            [...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)
          ) : (
            <>
              <StatCard
                label="Total Produced"
                value={(monthProd?.bagsProduced ?? 0).toLocaleString()}
                icon={Package}
                colorText="text-blue-600" colorBg="bg-blue-50"
                subLabel={`across ${monthProd?.totalLogs ?? 0} days`}
              />
              <StatCard
                label="Total Revenue"
                value={formatNaira(monthProd?.totalSales ?? 0)}
                icon={DollarSign}
                colorText="text-violet-600" colorBg="bg-violet-50"
                subLabel="monthly sales"
              />
              <StatCard
                label="Total Expenses"
                value={formatNaira(monthExp?.totalExpenses ?? 0)}
                icon={TrendingDown}
                colorText="text-red-600" colorBg="bg-red-50"
                subLabel={`${monthExp?.totalEntries ?? 0} entries`}
              />
              <StatCard
                label="Net Profit"
                value={formatNaira((monthProd?.totalSales ?? 0) - (monthExp?.totalExpenses ?? 0))}
                icon={TrendingUp}
                colorText="text-emerald-600" colorBg="bg-emerald-50"
                subLabel="this month"
              />
            </>
          )}
        </div>
      </div>

      {/* ── ORDERS SNAPSHOT ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Orders</p>
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/orders">View all <ArrowRight className="h-3.5 w-3.5 ml-1" /></Link>
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          {orderSumLoading ? (
            [...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)
          ) : (
            <>
              <StatCard label="Pending"       value={String(orderSum?.totalPending ?? 0)} icon={ShoppingCart} colorText="text-amber-600"  colorBg="bg-amber-50"  subLabel="awaiting action" />
              <StatCard label="Active"         value={String(orderSum?.totalActive  ?? 0)} icon={ShoppingCart} colorText="text-blue-600"   colorBg="bg-blue-50"   subLabel="being processed" />
              <StatCard label="Delivered"      value={String(orderSum?.byStatus?.delivered ?? 0)} icon={ShoppingCart} colorText="text-emerald-600" colorBg="bg-emerald-50" subLabel="completed" />
              <StatCard label="Order Revenue"  value={formatNaira(orderSum?.totalRevenue ?? 0)} icon={DollarSign} colorText="text-violet-600" colorBg="bg-violet-50" subLabel="paid orders" />
            </>
          )}
        </div>
      </div>

      {/* ── RECENT PRODUCTION LOGS ── */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Recent Production</CardTitle>
            <CardDescription>Last 5 entries</CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/production">
              View all <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {logsLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : recentLogs.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No production logs yet.{' '}
              <Link href="/production" className="text-primary hover:underline">
                Add the first entry →
              </Link>
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
                        {new Date(log.date).toLocaleDateString('en-NG', {
                          day: 'numeric', month: 'short',
                        })}
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
