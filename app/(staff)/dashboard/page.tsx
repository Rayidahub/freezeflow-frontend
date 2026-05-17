// app/(staff)/dashboard/page.tsx
import type { Metadata } from 'next';
import {
  TrendingUp,
  TrendingDown,
  Package,
  ShoppingCart,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatNaira } from '@/lib/utils';

export const metadata: Metadata = { title: 'Dashboard' };

// Placeholder stats — will be fetched from API in Sprint 2
const stats = [
  {
    label: 'Bags Produced Today',
    value: '240',
    change: '+12%',
    trend: 'up',
    icon: Package,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    label: 'Bags Sold Today',
    value: '198',
    change: '+8%',
    trend: 'up',
    icon: ShoppingCart,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    label: "Today's Revenue",
    value: formatNaira(99000),
    change: '+8%',
    trend: 'up',
    icon: DollarSign,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
  },
  {
    label: "Today's Expenses",
    value: formatNaira(34500),
    change: '-3%',
    trend: 'down',
    icon: TrendingDown,
    color: 'text-red-600',
    bg: 'bg-red-50',
  },
];

const recentActivity = [
  { id: 1, action: 'Production log added', user: 'Operations Staff', time: '2 min ago', type: 'production' },
  { id: 2, action: 'Expense recorded: Fuel', user: 'Operations Staff', time: '1 hr ago', type: 'expense' },
  { id: 3, action: 'New order: 5 × Large Ice Block', user: 'System', time: '2 hr ago', type: 'order' },
  { id: 4, action: 'Delivery completed', user: 'Delivery Staff', time: '3 hr ago', type: 'delivery' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Good morning 👋</h2>
          <p className="text-muted-foreground mt-1">
            Here's what's happening at FreezeFlow today.
          </p>
        </div>
        <Badge variant="info" className="hidden sm:flex">
          {new Date().toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long' })}
        </Badge>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.bg}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {stat.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3 text-emerald-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <p className={`text-xs ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {stat.change} from yesterday
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Content row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              Stock Summary
            </CardTitle>
            <CardDescription>Current inventory status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Small Ice Block (5kg)', stock: 42, max: 100 },
              { label: 'Large Ice Block (10kg)', stock: 18, max: 80 },
              { label: 'Extra Large (25kg)', stock: 7, max: 40 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-muted-foreground">{item.stock} / {item.max}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      item.stock / item.max < 0.2
                        ? 'bg-red-500'
                        : item.stock / item.max < 0.5
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${(item.stock / item.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <CardDescription>Latest operations log</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recentActivity.map((activity) => (
                <li key={activity.id} className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.user} · {activity.time}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
