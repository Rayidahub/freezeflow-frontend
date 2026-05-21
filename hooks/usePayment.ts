'use client';
// hooks/usePayment.ts
// Payment operations for both customer and staff.

import { useState } from 'react';
import { paymentApi } from '@/lib/api';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { useAuth }         from '@/context/AuthContext';

// ─── Customer: initialize + verify ───────────────────────────────────────────

export function useCustomerPayment() {
  const { token } = useCustomerAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  /**
   * Fetches the Paystack authorization URL for an order,
   * then redirects the browser to the Paystack payment page.
   */
  const payForOrder = async (orderId: string): Promise<void> => {
    if (!token) { setError('Not authenticated'); return; }
    setIsLoading(true);
    setError(null);
    try {
      const res = await paymentApi.initialize(token, orderId);
      if (res.data?.authorizationUrl) {
        // Redirect to Paystack hosted page
        window.location.href = res.data.authorizationUrl;
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to initialize payment');
      setIsLoading(false);
    }
    // Note: we don't set isLoading(false) on success because the page redirects
  };

  /**
   * Verifies a transaction after Paystack redirects back.
   * Returns 'success' | 'failed' | 'abandoned' | 'pending'
   */
  const verifyPayment = async (reference: string) => {
    if (!token) return null;
    setIsLoading(true);
    setError(null);
    try {
      const res = await paymentApi.verify(token, reference);
      return res.data ?? null;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Verification failed');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { payForOrder, verifyPayment, isLoading, error, setError };
}

// ─── Staff: mark cash paid ────────────────────────────────────────────────────

export function useStaffPayment() {
  const { token } = useAuth();
  const [isMarking, setIsMarking] = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const markCashPaid = async (orderId: string): Promise<boolean> => {
    if (!token) return false;
    setIsMarking(true);
    setError(null);
    try {
      await paymentApi.markCash(token, orderId);
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to mark as paid');
      return false;
    } finally {
      setIsMarking(false);
    }
  };

  return { markCashPaid, isMarking, error };
}
