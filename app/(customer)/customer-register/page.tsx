'use client';
// app/(customer)/customer-register/page.tsx

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input }  from '@/components/ui/input';
import { Label }  from '@/components/ui/label';
import { customerAuthApi, ApiError } from '@/lib/api';
import { useCustomerAuth } from '@/context/CustomerAuthContext';

export default function CustomerRegisterPage() {
  const router      = useRouter();
  const { setAuth } = useCustomerAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const [form,      setForm]      = useState({
    fullName: '', email: '', phone: '',
    password: '', confirmPassword: '', deliveryAddress: '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match'); return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...payload } = form;
      const res = await customerAuthApi.register({
        ...payload,
        deliveryAddress: payload.deliveryAddress || undefined,
      });
      if (res.data) {
        setAuth(res.data.token, res.data.customer);
        router.push('/products');
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen ice-gradient flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Order fresh ice blocks delivered to your door
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle>Get Started</CardTitle>
            <CardDescription>Fill in your details below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-md bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" name="fullName" placeholder="John Doe"
                    required value={form.fullName} onChange={handleChange} disabled={isLoading} />
                </div>

                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="you@example.com"
                    required value={form.email} onChange={handleChange} disabled={isLoading} />
                </div>

                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="08012345678"
                    required value={form.phone} onChange={handleChange} disabled={isLoading} />
                </div>

                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password"
                    placeholder="Min 8 characters" required minLength={8}
                    value={form.password} onChange={handleChange} disabled={isLoading} />
                </div>

                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" name="confirmPassword" type="password"
                    placeholder="Re-enter password" required
                    value={form.confirmPassword} onChange={handleChange} disabled={isLoading} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryAddress">
                  Default Delivery Address{' '}
                  <span className="text-muted-foreground text-xs">(optional)</span>
                </Label>
                <textarea
                  id="deliveryAddress" name="deliveryAddress"
                  value={form.deliveryAddress} onChange={handleChange}
                  disabled={isLoading}
                  placeholder="e.g. 12 Ahmadu Bello Way, Garki, Abuja"
                  rows={2}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 resize-none"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Creating account…</>
                  : <><UserPlus className="h-4 w-4 mr-2" />Create Account</>
                }
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/customer-login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
