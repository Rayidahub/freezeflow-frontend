'use client';
// components/ui/toast.tsx
// Lightweight toast — no extra dependencies needed

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastVariant = 'success' | 'error' | 'info';

export interface Toast {
  id:       string;
  message:  string;
  variant?: ToastVariant;
}

interface ToastContextValue {
  toasts:   Toast[];
  toast:    (message: string, variant?: ToastVariant) => void;
  dismiss:  (id: string) => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, variant: ToastVariant = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, variant }]);
    // Auto-dismiss after 4 s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}

// ─── Viewport (renders toasts) ────────────────────────────────────────────────

const icons: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />,
  error:   <XCircle     className="h-4 w-4 text-red-500    shrink-0" />,
  info:    <AlertCircle className="h-4 w-4 text-blue-500   shrink-0" />,
};

const variantStyles: Record<ToastVariant, string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  error:   'border-red-200    bg-red-50    text-red-900',
  info:    'border-blue-200   bg-blue-50   text-blue-900',
};

function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts:    Toast[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'flex items-start gap-3 rounded-lg border p-3 shadow-lg pointer-events-auto',
            'animate-in slide-in-from-bottom-2 fade-in duration-200',
            variantStyles[t.variant ?? 'info']
          )}
        >
          {icons[t.variant ?? 'info']}
          <p className="flex-1 text-sm font-medium">{t.message}</p>
          <button onClick={() => onDismiss(t.id)} className="opacity-60 hover:opacity-100">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
