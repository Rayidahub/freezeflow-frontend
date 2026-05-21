'use client';
// app/(customer)/payment/page.tsx
// Paystack redirects here after the customer completes (or cancels) payment.
// URL will be: /payment/verify?reference=FF-xxxx

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle, XCircle, Clock, Loader2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCustomerPayment } from '@/hooks/usePayment';
import { useCustomerAuth }    from '@/context/CustomerAuthContext';

type VerifyStatus = 'loading' | 'success' | 'failed' | 'abandoned' | 'no-ref' | 'not-auth';

export default function PaymentVerifyPage() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const reference    = searchParams.get('reference');

  const { isAuthenticated, isLoading: authLoading } = useCustomerAuth();
  const { verifyPayment } = useCustomerPayment();

  const [status,  setStatus]  = useState<VerifyStatus>('loading');
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      setStatus('not-auth');
      return;
    }

    if (!reference) {
      setStatus('no-ref');
      return;
    }

    verifyPayment(reference).then((result) => {
      if (!result) {
        setStatus('failed');
        return;
      }
      setOrderId(result.orderId);
      setStatus(result.status as VerifyStatus);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference, isAuthenticated, authLoading]);

  // ── Render states ──────────────────────────────────────────────────────────

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground font-medium">Verifying your payment…</p>
          <p className="text-xs text-muted-foreground">Please do not close this page.</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen ice-gradient flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-xl text-center">
          <CardContent className="pt-8 pb-8 space-y-4">
            <div className="flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle className="h-10 w-10 text-emerald-600" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Payment Successful!</h2>
              <p className="text-muted-foreground mt-2">
                Your payment has been confirmed. Your order is being processed.
              </p>
            </div>
            {reference && (
              <div className="rounded-lg bg-muted/50 px-4 py-2 text-xs text-muted-foreground font-mono break-all">
                Ref: {reference}
              </div>
            )}
            <div className="flex flex-col gap-2 pt-2">
              <Button asChild>
                <Link href="/orders">View My Orders</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/products">Order More Ice</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'abandoned') {
    return (
      <div className="min-h-screen ice-gradient flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-xl text-center">
          <CardContent className="pt-8 pb-8 space-y-4">
            <div className="flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
                <Clock className="h-10 w-10 text-amber-600" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Payment Cancelled</h2>
              <p className="text-muted-foreground mt-2">
                You cancelled the payment. Your order is still saved — you can try again from your orders page.
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <Button asChild>
                <Link href="/orders">Back to Orders</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Failed, no-ref, not-auth
  return (
    <div className="min-h-screen ice-gradient flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-xl text-center">
        <CardContent className="pt-8 pb-8 space-y-4">
          <div className="flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Payment Failed</h2>
            <p className="text-muted-foreground mt-2">
              {status === 'not-auth'
                ? 'Please sign in to verify your payment.'
                : status === 'no-ref'
                ? 'No payment reference found. Please go back to your orders.'
                : 'Your payment could not be processed. Please try again or contact support.'}
            </p>
          </div>
          <div className="flex flex-col gap-2 pt-2">
            {status === 'not-auth' ? (
              <Button asChild><Link href="/customer-login">Sign In</Link></Button>
            ) : (
              <Button asChild><Link href="/orders">Back to Orders</Link></Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
