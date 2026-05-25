'use client';
// components/production/ProductionSummaryCards.tsx
// Displays aggregated production stats for a selected period.

import { Package, ShoppingCart, DollarSign, AlertTriangle, Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatNaira } from '@/lib/utils';
import { ProductionSummary } from '@/types';

interface ProductionSummaryCardsProps {
  summary:   ProductionSummary | null;
  isLoading: boolean;
}

export function ProductionSummaryCards({ summary, isLoading }: ProductionSummaryCardsProps) {
  const cards = [
    {
      label: 'Bags Produced',
      value: summary?.bagsProduced ?? 0,
      icon:  Package,
      color: 'text-blue-600',
      bg:    'bg-blue-50',
      format: (v: number) => v.toLocaleString(),
    },
    {
      label: 'Bags Sold',
      value: summary?.bagsSold ?? 0,
      icon:  ShoppingCart,
      color: 'text-emerald-600',
      bg:    'bg-emerald-50',
      format: (v: number) => v.toLocaleString(),
    },
    {
      label: 'Total Sales',
      value: summary?.totalSales ?? 0,
      icon:  DollarSign,
      color: 'text-violet-600',
      bg:    'bg-violet-50',
      format: (v: number) => formatNaira(v),
    },
    {
      label: 'Current Stock',
      value: summary?.currentStock ?? 0,
      icon:  Layers,
      color: 'text-cyan-600',
      bg:    'bg-cyan-50',
      format: (v: number) => v.toLocaleString(),
    },
    {
      label: 'Damaged Bags',
      value: summary?.damagedBags ?? 0,
      icon:  AlertTriangle,
      color: 'text-amber-600',
      bg:    'bg-amber-50',
      format: (v: number) => v.toLocaleString(),
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.label} className="rounded-2xl border-0 shadow-sm card-hover overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.bg} shadow-sm`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{card.format(card.value)}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
