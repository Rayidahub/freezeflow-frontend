'use client';
// hooks/useProduction.ts
// All data-fetching and mutations for the Production module.

import { useState, useEffect, useCallback } from 'react';
import { productionApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Production, CreateProductionDto, ProductionSummary, PaginationMeta } from '@/types';

interface UseProductionListOptions {
  page?:  number;
  limit?: number;
  from?:  string;
  to?:    string;
}

export function useProductionList(options: UseProductionListOptions = {}) {
  const { token } = useAuth();
  const [logs,       setLogs]       = useState<Production[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading,  setIsLoading]  = useState(true);
  const [error,      setError]      = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await productionApi.getAll(token, options);
      if (res.data) {
        setLogs(res.data.logs);
        setPagination(res.data.pagination);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load production logs');
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, options.page, options.limit, options.from, options.to]);

  useEffect(() => { fetch(); }, [fetch]);

  return { logs, pagination, isLoading, error, refetch: fetch };
}

export function useProductionSummary(period: 'today' | 'week' | 'month' | 'all' = 'today') {
  const { token } = useAuth();
  const [summary,   setSummary]   = useState<ProductionSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await productionApi.getSummary(token, period);
      if (res.data) setSummary(res.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load summary');
    } finally {
      setIsLoading(false);
    }
  }, [token, period]);

  useEffect(() => { fetch(); }, [fetch]);

  return { summary, isLoading, error, refetch: fetch };
}

export function useProductionMutations() {
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error,        setError]        = useState<string | null>(null);

  const createLog = async (data: CreateProductionDto): Promise<Production | null> => {
    if (!token) return null;
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await productionApi.create(token, data);
      return res.data ?? null;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create log';
      setError(msg);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateLog = async (id: string, data: Partial<CreateProductionDto>): Promise<Production | null> => {
    if (!token) return null;
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await productionApi.update(token, id, data);
      return res.data ?? null;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update log';
      setError(msg);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteLog = async (id: string): Promise<boolean> => {
    if (!token) return false;
    setIsSubmitting(true);
    setError(null);
    try {
      await productionApi.delete(token, id);
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete log';
      setError(msg);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createLog, updateLog, deleteLog, isSubmitting, error, setError };
}
