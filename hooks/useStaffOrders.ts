'use client';
// hooks/useStaffOrders.ts
// Staff order management: list all orders, update status, summary.

import { useState, useEffect, useCallback } from 'react';
import { ordersApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Order, OrderSummary, PaginationMeta } from '@/types';

export function useStaffOrders(page = 1, statusFilter?: string) {
  const { token } = useAuth();
  const [orders,     setOrders]     = useState<Order[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading,  setIsLoading]  = useState(true);
  const [error,      setError]      = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await ordersApi.getAll(token, page, statusFilter);
      if (res.data) {
        setOrders(res.data.orders);
        setPagination(res.data.pagination);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  }, [token, page, statusFilter]);

  useEffect(() => { fetch(); }, [fetch]);

  return { orders, pagination, isLoading, error, refetch: fetch };
}

export function useOrderSummary() {
  const { token } = useAuth();
  const [summary,   setSummary]   = useState<OrderSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!token) return;
    try {
      const res = await ordersApi.getSummary(token);
      if (res.data) setSummary(res.data);
    } catch {
      // non-critical
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => { fetch(); }, [fetch]);

  return { summary, isLoading, refetch: fetch };
}

export function useStaffOrderMutations() {
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error,        setError]        = useState<string | null>(null);

  const updateStatus = async (id: string, status: string): Promise<Order | null> => {
    if (!token) return null;
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await ordersApi.updateStatus(token, id, status);
      return res.data ?? null;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update order');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { updateStatus, isSubmitting, error, setError };
}
