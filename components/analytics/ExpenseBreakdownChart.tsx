'use client';
// components/analytics/ExpenseBreakdownChart.tsx
// Donut chart + horizontal bar breakdown for expenses by category.

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatNaira } from '@/lib/utils';
import { ExpenseBreakdownData, ExpenseType } from '@/types';

const CATEGORY_COLORS: Record<string, string> = {
  fuel:           '#f97316',
  electricity:    '#eab308',
  water:          '#3b82f6',
  nylon:          '#22c55e',
  transportation: '#a855f7',
  labor:          '#ec4899',
  maintenance:    '#ef4444',
  miscellaneous:  '#94a3b8',
};

const CATEGORY_LABELS: Record<string, string> = {
  fuel:           'Fuel',
  electricity:    'Electricity',
  water:          'Water',
  nylon:          'Nylon / Packaging',
  transportation: 'Transportation',
  labor:          'Labour',
  maintenance:    'Maintenance',
  miscellaneous:  'Miscellaneous',
};

interface ExpenseBreakdownChartProps {
  data:      ExpenseBreakdownData | null;
  isLoading: boolean;
}

export function ExpenseBreakdownChart({ data, isLoading }: ExpenseBreakdownChartProps) {
  if (isLoading || !data) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-44 mb-1" /><Skeleton className="h-3 w-32" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
        </CardContent>
      </Card>
    );
  }

  const { breakdown, total } = data;

  if (breakdown.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Expense Breakdown</CardTitle>
          <CardDescription>No expenses for this period</CardDescription>
        </CardHeader>
        <CardContent className="py-10 text-center text-muted-foreground text-sm">
          No expense records found
        </CardContent>
      </Card>
    );
  }

  // Build SVG donut
  const R = 60, r = 38, cx = 80, cy = 80;
  let cumAngle = -90;
  const slices = breakdown.map((item) => {
    const angle = (item.amount / total) * 360;
    const startAngle = cumAngle;
    cumAngle += angle;
    const endAngle  = cumAngle;
    const startRad  = (startAngle * Math.PI) / 180;
    const endRad    = (endAngle   * Math.PI) / 180;
    const x1 = cx + R * Math.cos(startRad);
    const y1 = cy + R * Math.sin(startRad);
    const x2 = cx + R * Math.cos(endRad);
    const y2 = cy + R * Math.sin(endRad);
    const ix1 = cx + r * Math.cos(startRad);
    const iy1 = cy + r * Math.sin(startRad);
    const ix2 = cx + r * Math.cos(endRad);
    const iy2 = cy + r * Math.sin(endRad);
    const large = angle > 180 ? 1 : 0;
    const d = `M${x1.toFixed(1)},${y1.toFixed(1)} A${R},${R} 0 ${large},1 ${x2.toFixed(1)},${y2.toFixed(1)} L${ix2.toFixed(1)},${iy2.toFixed(1)} A${r},${r} 0 ${large},0 ${ix1.toFixed(1)},${iy1.toFixed(1)} Z`;
    return { ...item, d };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Expense Breakdown</CardTitle>
        <CardDescription>Total: {formatNaira(total)}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Donut */}
          <svg viewBox="0 0 160 160" className="w-36 h-36 shrink-0 mx-auto sm:mx-0">
            {slices.map((s, i) => (
              <path key={i} d={s.d}
                fill={CATEGORY_COLORS[s.expenseType] ?? '#94a3b8'}
                stroke="white" strokeWidth={1} />
            ))}
            <text x={cx} y={cy - 6}  textAnchor="middle" fontSize={9}  fill="currentColor" opacity={0.6}>Total</text>
            <text x={cx} y={cy + 8}  textAnchor="middle" fontSize={10} fill="currentColor" fontWeight="700">
              {(total / 1000).toFixed(0)}k
            </text>
          </svg>

          {/* Category bars */}
          <div className="flex-1 space-y-2.5 w-full">
            {breakdown.map((item) => (
              <div key={item.expenseType}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ background: CATEGORY_COLORS[item.expenseType] ?? '#94a3b8' }} />
                    <span className="text-xs font-medium">
                      {CATEGORY_LABELS[item.expenseType as ExpenseType] ?? item.expenseType}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">{item.percentage}%</span>
                    <span className="font-semibold">{formatNaira(item.amount)}</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percentage}%`,
                      background: CATEGORY_COLORS[item.expenseType] ?? '#94a3b8',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
