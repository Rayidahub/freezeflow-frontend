'use client';
// hooks/useDelivery.ts
// Staff delivery hooks: assign staff, view deliveries, status history.

import { useState, useEffect, useCallback } from 'react';
import { deliveryApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import {
  DeliveryStaffMember,
  DeliveryAssignment,
  OrderStatusHistoryEntry,
  Order,
} from '@/types';

// ─── List delivery staff ──────────────────────────────────────────────────────

export function useDeliveryStaff() {
  const { token } = useAuth();
  const [staff,     setStaff]     = useState<DeliveryStaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    deliveryApi.getStaff(token)
      .then((res) => { if (res.data) setStaff(res.data); })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [token]);

  return { staff, isLoading };
}

// ─── Delivery mutations ───────────────────────────────────────────────────────

export function useDeliveryMutations() {
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error,        setError]        = useState<string | null>(null);

  const assignDelivery = async (
    orderId: string,
    deliveryStaffId: string,
    notes?: string
  ): Promise<DeliveryAssignment | null> => {
    if (!token) return null;
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await deliveryApi.assign(token, { orderId, deliveryStaffId, notes });
      return res.data ?? null;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to assign delivery');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { assignDelivery, isSubmitting, error, setError };
}

// ─── My deliveries (delivery staff view) ─────────────────────────────────────

export function useMyDeliveries(statusFilter?: string) {
  const { token } = useAuth();
  const [orders,    setOrders]    = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await deliveryApi.getMyDeliveries(token, statusFilter);
      if (res.data) setOrders(res.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load deliveries');
    } finally {
      setIsLoading(false);
    }
  }, [token, statusFilter]);

  useEffect(() => { fetch(); }, [fetch]);

  return { orders, isLoading, error, refetch: fetch };
}

// ─── Order status history ─────────────────────────────────────────────────────

export function useOrderHistory(orderId: string | null) {
  const { token } = useAuth();
  const [history,   setHistory]   = useState<OrderStatusHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token || !orderId) return;
    setIsLoading(true);
    deliveryApi.getHistory(token, orderId)
      .then((res) => { if (res.data) setHistory(res.data); })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [token, orderId]);

  return { history, isLoading };
}
