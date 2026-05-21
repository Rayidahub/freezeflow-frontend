'use client';
// hooks/useOrders.ts
// Customer order hooks: place order, view history, cancel.

import { useState, useEffect, useCallback } from 'react';
import { ordersApi } from '@/lib/api';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { Order, PlaceOrderDto, PaginationMeta } from '@/types';

export function useMyOrders(page = 1) {
  const { token } = useCustomerAuth();
  const [orders,     setOrders]     = useState<Order[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading,  setIsLoading]  = useState(true);
  const [error,      setError]      = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!token) { setIsLoading(false); return; }
    setIsLoading(true);
    setError(null);
    try {
      const res = await ordersApi.getMyOrders(token, page);
      if (res.data) {
        setOrders(res.data.orders);
        setPagination(res.data.pagination);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  }, [token, page]);

  useEffect(() => { fetch(); }, [fetch]);

  return { orders, pagination, isLoading, error, refetch: fetch };
}

export function useOrderMutations() {
  const { token } = useCustomerAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error,        setError]        = useState<string | null>(null);

  const placeOrder = async (data: PlaceOrderDto): Promise<Order | null> => {
    if (!token) return null;
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await ordersApi.place(token, data);
      return res.data ?? null;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelOrder = async (id: string): Promise<boolean> => {
    if (!token) return false;
    setIsSubmitting(true);
    setError(null);
    try {
      await ordersApi.cancelMyOrder(token, id);
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to cancel order');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { placeOrder, cancelOrder, isSubmitting, error, setError };
}
