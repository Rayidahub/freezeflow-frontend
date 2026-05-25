'use client';
// components/analytics/RevenueTrendChart.tsx
// Pure SVG line chart — no extra chart library needed.

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatNaira } from '@/lib/utils';
import { TrendPoint } from '@/types';

interface RevenueTrendChartProps {
  data:      TrendPoint[];
  isLoading: boolean;
  period:    string;
}

const LINE_COLORS = {
  revenue:   '#6366f1',
  expenses:  '#ef4444',
  netProfit: '#10b981',
};

export function RevenueTrendChart({ data, isLoading, period }: RevenueTrendChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40 mb-1" />
          <Skeleton className="h-3 w-56" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Revenue Trend</CardTitle>
          <CardDescription>No data for this period</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground text-sm">No production records found</p>
        </CardContent>
      </Card>
    );
  }

  const W = 600, H = 240, PAD = { top: 16, right: 16, bottom: 40, left: 72 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const allValues = data.flatMap((d) => [d.revenue, d.expenses, Math.abs(d.netProfit)]);
  const maxVal    = Math.max(...allValues, 1);
  const minVal    = Math.min(0, ...data.map((d) => d.netProfit));

  const totalRange = maxVal - minVal;
  const scaleY = (v: number) => PAD.top + chartH - ((v - minVal) / totalRange) * chartH;
  const scaleX = (i: number) => PAD.left + (i / Math.max(data.length - 1, 1)) * chartW;

  const pathFor = (key: 'revenue' | 'expenses' | 'netProfit') =>
    data.map((d, i) => `${i === 0 ? 'M' : 'L'}${scaleX(i).toFixed(1)},${scaleY(d[key]).toFixed(1)}`).join(' ');

  // Y axis labels
  const yTicks = 5;
  const yLabels = Array.from({ length: yTicks }, (_, i) => {
    const v = minVal + (totalRange / (yTicks - 1)) * i;
    return { v, y: scaleY(v) };
  });

  // X axis labels — show every N-th date to avoid crowding
  const xStep = Math.ceil(data.length / 6);
  const xLabels = data.filter((_, i) => i % xStep === 0 || i === data.length - 1);

  const totalRevenue  = data.reduce((s, d) => s + d.revenue,   0);
  const totalExpenses = data.reduce((s, d) => s + d.expenses,  0);
  const totalProfit   = totalRevenue - totalExpenses;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Revenue vs Expenses</CardTitle>
        <CardDescription>Daily trend for the selected period</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-4 text-xs">
          {[
            { key: 'revenue',   label: 'Revenue',   total: totalRevenue },
            { key: 'expenses',  label: 'Expenses',  total: totalExpenses },
            { key: 'netProfit', label: 'Net Profit', total: totalProfit },
          ].map(({ key, label, total }) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full" style={{ background: LINE_COLORS[key as keyof typeof LINE_COLORS] }} />
              <span className="text-muted-foreground">{label}:</span>
              <span className={`font-semibold ${total < 0 ? 'text-red-600' : ''}`}>{formatNaira(total)}</span>
            </div>
          ))}
        </div>

        {/* SVG chart */}
        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[320px]" style={{ height: H }}>
            {/* Grid lines */}
            {yLabels.map(({ y }, i) => (
              <line key={i} x1={PAD.left} y1={y} x2={W - PAD.right} y2={y}
                stroke="currentColor" strokeOpacity={0.08} strokeWidth={1} />
            ))}

            {/* Zero line */}
            {minVal < 0 && (
              <line x1={PAD.left} y1={scaleY(0)} x2={W - PAD.right} y2={scaleY(0)}
                stroke="#94a3b8" strokeWidth={1} strokeDasharray="4,4" />
            )}

            {/* Y axis labels */}
            {yLabels.map(({ v, y }, i) => (
              <text key={i} x={PAD.left - 6} y={y + 4} textAnchor="end"
                fontSize={10} fill="currentColor" opacity={0.5}>
                {Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toFixed(0)}
              </text>
            ))}

            {/* X axis labels */}
            {xLabels.map((d, i) => {
              const origIdx = data.indexOf(d);
              return (
                <text key={i} x={scaleX(origIdx)} y={H - 6}
                  textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.5}>
                  {d.date.slice(5)}
                </text>
              );
            })}

            {/* Lines */}
            {(['revenue', 'expenses', 'netProfit'] as const).map((key) => (
              <path key={key} d={pathFor(key)}
                stroke={LINE_COLORS[key]} strokeWidth={2} fill="none"
                strokeLinecap="round" strokeLinejoin="round" />
            ))}

            {/* Data dots — revenue only */}
            {data.map((d, i) => (
              <circle key={i} cx={scaleX(i)} cy={scaleY(d.revenue)} r={3}
                fill={LINE_COLORS.revenue} />
            ))}
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
