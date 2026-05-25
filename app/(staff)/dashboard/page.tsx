'use client';
// app/(staff)/dashboard/page.tsx — polished gradient dashboard

import {
  TrendingUp, TrendingDown, Package, ShoppingCart,
  DollarSign, Layers, AlertTriangle, ArrowRight, Zap,
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge }    from '@/components/ui/badge';
import { Button }   from '@/components/ui/button';
import { formatNaira } from '@/lib/utils';
import { useProductionSummary, useProductionList } from '@/hooks/useProduction';
import { useExpenseSummary } from '@/hooks/useExpenses';
import { useOrderSummary }   from '@/hooks/useStaffOrders';
import { useAuth }           from '@/context/AuthContext';

// ─── Gradient stat card ───────────────────────────────────────────────────────

function GradientStatCard({
  label, value, subLabel, icon: Icon, gradient, iconGradient, textColor,
}: {
  label: string; value: string; subLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string; iconGradient: string; textColor: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 ${gradient} card-hover`}>
      {/* Decorative circle */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
      <div className="absolute -right-1 -bottom-6 h-16 w-16 rounded-full bg-white/5" />

      <div className="relative">
        <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${iconGradient} shadow-sm mb-3`}>
          <Icon className={`h-5 w-5 ${textColor}`} />
        </div>
        <p className="text-2xl font-black text-foreground">{value}</p>
        <p className="text-sm font-medium text-foreground/70 mt-0.5">{label}</p>
        {subLabel && <p className="text-xs text-foreground/50 mt-0.5">{subLabel}</p>}
      </div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="rounded-2xl bg-muted/50 p-5">
      <Skeleton className="h-10 w-10 rounded-xl mb-3" />
      <Skeleton className="h-7 w-24 mb-2" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
}

// ─── Net profit banner ────────────────────────────────────────────────────────

function NetProfitBanner({
  revenue, expenses, isLoading,
}: { revenue: number; expenses: number; isLoading: boolean }) {
  const profit     = revenue - expenses;
  const isPositive = profit >= 0;

  if (isLoading) return <Skeleton className="h-24 w-full rounded-2xl" />;

  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 ${
      isPositive
        ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
        : 'bg-gradient-to-r from-red-500 to-orange-500'
    } text-white card-hover`}>
      {/* Pattern overlay */}
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="relative flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-medium opacity-90">Today&apos;s Net Profit</span>
          </div>
          <p className="text-3xl font-black">
            {isPositive ? '+' : ''}{formatNaira(profit)}
          </p>
          <p className="text-xs opacity-70 mt-1">
            Revenue {formatNaira(revenue)} · Expenses {formatNaira(expenses)}
          </p>
        </div>
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20`}>
          {isPositive
            ? <TrendingUp  className="h-7 w-7" />
            : <TrendingDown className="h-7 w-7" />
          }
        </div>
      </div>
    </div>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────

function SectionHeading({ label, href, linkLabel }: { label: string; href?: string; linkLabel?: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="h-4 w-1 rounded-full btn-gradient" />
        <p className="text-sm font-bold text-foreground">{label}</p>
      </div>
      {href && (
        <Button asChild variant="ghost" size="sm" className="text-xs h-7 rounded-lg">
          <Link href={href}>{linkLabel ?? 'View all'} <ArrowRight className="h-3 w-3 ml-1" /></Link>
        </Button>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user } = useAuth();

  const { summary: todayProd,  isLoading: todayProdLoading  } = useProductionSummary('today');
  const { summary: monthProd,  isLoading: monthProdLoading  } = useProductionSummary('month');
  const { summary: todayExp,   isLoading: todayExpLoading   } = useExpenseSummary('today');
  const { summary: monthExp,   isLoading: monthExpLoading   } = useExpenseSummary('month');
  const { logs: recentLogs,    isLoading: logsLoading        } = useProductionList({ limit: 5 });
  const { summary: orderSum,   isLoading: orderSumLoading   } = useOrderSummary();

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const todayLoading  = todayProdLoading  || todayExpLoading;
  const monthLoading  = monthProdLoading  || monthExpLoading;

  return (
    <div className="space-y-7">
      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight">
            {greeting()},{' '}
            <span className="text-gradient">{user?.fullName?.split(' ')[0] ?? 'there'}</span> 👋
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Here&apos;s FreezeFlow at a glance today.
          </p>
        </div>
        <Badge className="hidden sm:flex bg-gradient-to-r from-sky-500 to-violet-500 text-white border-0 px-3 py-1 text-xs font-medium">
          {new Date().toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long' })}
        </Badge>
      </div>

      {/* ── Net Profit Banner ── */}
      <NetProfitBanner
        revenue={todayProd?.totalSales    ?? 0}
        expenses={todayExp?.totalExpenses ?? 0}
        isLoading={todayLoading}
      />

      {/* ── Today Stats ── */}
      <div className="space-y-3">
        <SectionHeading label="Today" href="/production" linkLabel="Production" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {todayLoading ? (
            [...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)
          ) : (
            <>
              <GradientStatCard label="Bags Produced"  value={(todayProd?.bagsProduced ?? 0).toLocaleString()} subLabel="units produced"     icon={Package}      gradient="card-gradient-blue"    iconGradient="icon-gradient-blue"    textColor="text-blue-600" />
              <GradientStatCard label="Bags Sold"       value={(todayProd?.bagsSold     ?? 0).toLocaleString()} subLabel="units sold"          icon={ShoppingCart} gradient="card-gradient-emerald" iconGradient="icon-gradient-emerald" textColor="text-emerald-600" />
              <GradientStatCard label="Revenue"         value={formatNaira(todayProd?.totalSales    ?? 0)}       subLabel="from production"     icon={DollarSign}   gradient="card-gradient-violet"  iconGradient="icon-gradient-violet"  textColor="text-violet-600" />
              <GradientStatCard label="Expenses"        value={formatNaira(todayExp?.totalExpenses  ?? 0)}       subLabel={`${todayExp?.totalEntries ?? 0} entries`} icon={TrendingDown} gradient="card-gradient-red" iconGradient="icon-gradient-red" textColor="text-red-600" />
            </>
          )}
        </div>
      </div>

      {/* ── Stock + Damaged ── */}
      <div className="grid gap-4 sm:grid-cols-2">
        {todayLoading ? (
          [...Array(2)].map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <GradientStatCard label="Current Stock"  value={(todayProd?.currentStock ?? 0).toLocaleString()} subLabel="bags remaining"      icon={Layers}        gradient="bg-gradient-to-br from-cyan-50 to-sky-100"        iconGradient="icon-gradient-cyan"    textColor="text-cyan-600" />
            <GradientStatCard label="Damaged Bags"   value={(todayProd?.damagedBags  ?? 0).toLocaleString()} subLabel="today&apos;s losses" icon={AlertTriangle}  gradient="bg-gradient-to-br from-amber-50 to-orange-100"     iconGradient="icon-gradient-amber"   textColor="text-amber-600" />
          </>
        )}
      </div>

      {/* ── Orders Snapshot ── */}
      <div className="space-y-3">
        <SectionHeading label="Orders" href="/admin/orders" linkLabel="All Orders" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {orderSumLoading ? (
            [...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)
          ) : (
            <>
              <GradientStatCard label="Pending"       value={String(orderSum?.totalPending ?? 0)}               subLabel="awaiting action"  icon={ShoppingCart}  gradient="card-gradient-amber"   iconGradient="icon-gradient-amber"   textColor="text-amber-600" />
              <GradientStatCard label="Active"        value={String(orderSum?.totalActive  ?? 0)}               subLabel="being processed"  icon={Zap}           gradient="card-gradient-blue"    iconGradient="icon-gradient-blue"    textColor="text-blue-600" />
              <GradientStatCard label="Delivered"     value={String(orderSum?.byStatus?.delivered ?? 0)}        subLabel="completed"        icon={Package}       gradient="card-gradient-emerald" iconGradient="icon-gradient-emerald" textColor="text-emerald-600" />
              <GradientStatCard label="Order Revenue" value={formatNaira(orderSum?.totalRevenue ?? 0)}          subLabel="paid orders"      icon={DollarSign}    gradient="card-gradient-violet"  iconGradient="icon-gradient-violet"  textColor="text-violet-600" />
            </>
          )}
        </div>
      </div>

      {/* ── This Month ── */}
      <div className="space-y-3">
        <SectionHeading label="This Month" href="/analytics" linkLabel="Full Analytics" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {monthLoading ? (
            [...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)
          ) : (
            <>
              <GradientStatCard label="Total Produced"   value={(monthProd?.bagsProduced ?? 0).toLocaleString()} subLabel={`${monthProd?.totalLogs ?? 0} production days`} icon={Package}      gradient="card-gradient-blue"    iconGradient="icon-gradient-blue"    textColor="text-blue-600" />
              <GradientStatCard label="Monthly Revenue"  value={formatNaira(monthProd?.totalSales    ?? 0)}       subLabel="production sales"   icon={DollarSign}   gradient="card-gradient-violet"  iconGradient="icon-gradient-violet"  textColor="text-violet-600" />
              <GradientStatCard label="Monthly Expenses" value={formatNaira(monthExp?.totalExpenses  ?? 0)}       subLabel={`${monthExp?.totalEntries ?? 0} entries`}   icon={TrendingDown} gradient="card-gradient-red"     iconGradient="icon-gradient-red"     textColor="text-red-600" />
              <GradientStatCard label="Net Profit"       value={formatNaira((monthProd?.totalSales ?? 0) - (monthExp?.totalExpenses ?? 0))} subLabel="this month" icon={TrendingUp}   gradient="card-gradient-emerald" iconGradient="icon-gradient-emerald" textColor="text-emerald-600" />
            </>
          )}
        </div>
      </div>

      {/* ── Recent Production Logs ── */}
      <div className="space-y-3">
        <SectionHeading label="Recent Production" href="/production" linkLabel="View all" />
        <Card className="rounded-2xl border-0 shadow-sm overflow-hidden">
          {logsLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full rounded-xl" />)}
            </div>
          ) : recentLogs.length === 0 ? (
            <div className="py-14 text-center">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl card-gradient-blue mb-3">
                <Package className="h-7 w-7 text-blue-500" />
              </div>
              <p className="font-semibold text-foreground">No production logs yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                <Link href="/production" className="text-primary hover:underline">
                  Add the first entry →
                </Link>
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {['Date', 'Produced', 'Sold', 'Revenue', 'Stock'].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentLogs.map((log, i) => (
                    <tr key={log.id} className={`hover:bg-muted/20 transition-colors ${i === 0 ? 'bg-primary/3' : ''}`}>
                      <td className="px-5 py-3.5 font-semibold whitespace-nowrap">
                        {new Date(log.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="px-5 py-3.5">{log.bagsProduced}</td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-xs font-semibold">
                          {log.bagsSold}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-bold text-gradient">{formatNaira(log.totalSales)}</td>
                      <td className="px-5 py-3.5 text-muted-foreground">{log.remainingStock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
