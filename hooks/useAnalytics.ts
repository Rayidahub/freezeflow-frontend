'use client';
// hooks/useAnalytics.ts
// Analytics data hooks — all use the staff auth token.

import { useState, useEffect, useCallback } from 'react';
import { analyticsApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import {
  KpiData, RevenueTrend, ExpenseBreakdownData,
  OrderFunnelData, ProductionEfficiency, TopCustomersData,
  AnalyticsPeriod,
} from '@/types';

// ─── Generic analytics hook factory ──────────────────────────────────────────

function useAnalyticsData<T>(
  fetcher: (token: string, period: AnalyticsPeriod) => Promise<{ data?: T }>,
  period: AnalyticsPeriod
) {
  const { token } = useAuth();
  const [data,      setData]      = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetcher(token, period);
      if (res.data) setData(res.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  }, [token, period]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

// ─── Individual hooks ─────────────────────────────────────────────────────────

export const useKpi = (period: AnalyticsPeriod = '30d') =>
  useAnalyticsData<KpiData>(analyticsApi.getKpi, period);

export const useRevenueTrend = (period: AnalyticsPeriod = '30d') =>
  useAnalyticsData<RevenueTrend>(analyticsApi.getRevenueTrend, period);

export const useExpenseBreakdown = (period: AnalyticsPeriod = '30d') =>
  useAnalyticsData<ExpenseBreakdownData>(analyticsApi.getExpenseBreakdown, period);

export const useOrderFunnel = (period: AnalyticsPeriod = '30d') =>
  useAnalyticsData<OrderFunnelData>(analyticsApi.getOrderFunnel, period);

export const useProductionEfficiency = (period: AnalyticsPeriod = '30d') =>
  useAnalyticsData<ProductionEfficiency>(analyticsApi.getProductionEfficiency, period);

export const useTopCustomers = (period: AnalyticsPeriod = '30d') =>
  useAnalyticsData<TopCustomersData>(analyticsApi.getTopCustomers, period);
