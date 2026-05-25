'use client';
// components/analytics/ProductionEfficiencyPanel.tsx
// Efficiency metrics: sell-through rate, damage rate, daily averages.

import { Target, AlertTriangle, BarChart3, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatNaira } from '@/lib/utils';
import { ProductionEfficiency } from '@/types';

interface GaugeProps {
  value:   number;   // 0-100
  color:   string;
  size?:   number;
}

function Gauge({ value, color, size = 80 }: GaugeProps) {
  const r   = (size / 2) - 8;
  const circ = 2 * Math.PI * r;
  const pct  = Math.min(100, Math.max(0, value));
  const dash = (pct / 100) * circ;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="currentColor" strokeOpacity={0.1} strokeWidth={8} />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={8} strokeLinecap="round"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeDashoffset={circ * 0.25}
        transform={`rotate(-90 ${size/2} ${size/2})`}
      />
      <text x={size/2} y={size/2 + 5} textAnchor="middle" fontSize={14} fontWeight="700" fill={color}>
        {pct}%
      </text>
    </svg>
  );
}

interface ProductionEfficiencyPanelProps {
  data:      ProductionEfficiency | null;
  isLoading: boolean;
}

export function ProductionEfficiencyPanel({ data, isLoading }: ProductionEfficiencyPanelProps) {
  if (isLoading || !data) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-44 mb-1" /><Skeleton className="h-3 w-32" />
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />Production Efficiency
        </CardTitle>
        <CardDescription>{data.productionDays} production days in period</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {/* Sell-through rate */}
          <div className="flex flex-col items-center rounded-lg bg-emerald-50 border border-emerald-100 p-4">
            <Gauge value={data.sellThroughRate} color="#10b981" />
            <p className="text-sm font-semibold mt-2">Sell-Through</p>
            <p className="text-xs text-muted-foreground">
              {data.sold.toLocaleString()} of {data.produced.toLocaleString()} bags
            </p>
          </div>

          {/* Damage rate */}
          <div className="flex flex-col items-center rounded-lg bg-amber-50 border border-amber-100 p-4">
            <Gauge value={data.damageRate} color="#f59e0b" />
            <p className="text-sm font-semibold mt-2">Damage Rate</p>
            <p className="text-xs text-muted-foreground">
              {data.damaged.toLocaleString()} damaged bags
            </p>
          </div>
        </div>

        {/* Daily averages */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          {[
            { label: 'Avg Daily Production', value: data.avgDailyProduction.toLocaleString() + ' bags', icon: Target, color: 'text-blue-600' },
            { label: 'Avg Daily Revenue',    value: formatNaira(data.avgDailySales),                    icon: TrendingUp, color: 'text-violet-600' },
            { label: 'Avg Selling Price',    value: formatNaira(data.avgSellingPrice) + '/bag',          icon: BarChart3, color: 'text-cyan-600' },
            { label: 'Remaining Stock',      value: data.remaining.toLocaleString() + ' bags',           icon: AlertTriangle, color: 'text-orange-600' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-lg bg-muted/50 p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className={`h-3.5 w-3.5 ${item.color}`} />
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
                <p className="font-bold text-sm">{item.value}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
