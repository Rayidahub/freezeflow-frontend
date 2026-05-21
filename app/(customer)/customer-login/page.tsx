'use client';
// app/(customer)/customer-login/page.tsx

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input }  from '@/components/ui/input';
import { Label }  from '@/components/ui/label';
import { customerAuthApi, ApiError } from '@/lib/api';
import { useCustomerAuth } from '@/context/CustomerAuthContext';

export default function CustomerLoginPage() {
  const router      = useRouter();
  const { setAuth } = useCustomerAuth();

  const [showPw,    setShowPw]    = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const [form,      setForm]      = useState({ email: '', password: '' });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await customerAuthApi.login(form.email, form.password);
      if (res.data) {
        setAuth(res.data.token, res.data.customer);
        router.push('/orders');
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen ice-gradient flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground mt-1 text-sm">Sign in to your FreezeFlow account</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your email and password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-md bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email" name="email" type="email"
                  autoComplete="email" placeholder="you@example.com"
                  required value={form.email} onChange={handleChange} disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password" name="password"
                    type={showPw ? 'text' : 'password'}
                    autoComplete="current-password" placeholder="••••••••"
                    required value={form.password} onChange={handleChange}
                    disabled={isLoading} className="pr-10"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Signing in…</>
                  : <><LogIn className="h-4 w-4 mr-2" />Sign In</>
                }
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/customer-register" className="text-primary hover:underline font-medium">
                Create one
              </Link>
            </p>

            <p className="mt-2 text-center text-xs text-muted-foreground">
              Are you staff?{' '}
              <Link href="/login" className="hover:underline">Staff login →</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
