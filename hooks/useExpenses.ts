'use client';
// hooks/useExpenses.ts
// All data-fetching and mutations for the Expenses module.

import { useState, useEffect, useCallback } from 'react';
import { expenseApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import {
  Expense,
  ExpenseSummary,
  CreateExpenseDto,
  PaginationMeta,
} from '@/types';

interface UseExpenseListOptions {
  page?:  number;
  limit?: number;
  from?:  string;
  to?:    string;
  type?:  string;
}

export function useExpenseList(options: UseExpenseListOptions = {}) {
  const { token } = useAuth();
  const [expenses,   setExpenses]   = useState<Expense[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading,  setIsLoading]  = useState(true);
  const [error,      setError]      = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await expenseApi.getAll(token, options);
      if (res.data) {
        setExpenses(res.data.expenses);
        setPagination(res.data.pagination);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load expenses');
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, options.page, options.limit, options.from, options.to, options.type]);

  useEffect(() => { fetch(); }, [fetch]);

  return { expenses, pagination, isLoading, error, refetch: fetch };
}

export function useExpenseSummary(period: 'today' | 'week' | 'month' | 'all' = 'today') {
  const { token } = useAuth();
  const [summary,   setSummary]   = useState<ExpenseSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await expenseApi.getSummary(token, period);
      if (res.data) setSummary(res.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load expense summary');
    } finally {
      setIsLoading(false);
    }
  }, [token, period]);

  useEffect(() => { fetch(); }, [fetch]);

  return { summary, isLoading, error, refetch: fetch };
}

export function useExpenseMutations() {
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error,        setError]        = useState<string | null>(null);

  const createExpense = async (data: CreateExpenseDto): Promise<Expense | null> => {
    if (!token) return null;
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await expenseApi.create(token, data);
      return res.data ?? null;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create expense');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateExpense = async (
    id: string,
    data: Partial<CreateExpenseDto>
  ): Promise<Expense | null> => {
    if (!token) return null;
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await expenseApi.update(token, id, data);
      return res.data ?? null;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update expense');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteExpense = async (id: string): Promise<boolean> => {
    if (!token) return false;
    setIsSubmitting(true);
    setError(null);
    try {
      await expenseApi.delete(token, id);
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete expense');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createExpense, updateExpense, deleteExpense, isSubmitting, error, setError };
}
