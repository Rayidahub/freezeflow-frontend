// app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authApi, tokenStorage, ApiError } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({ email: '', password: '' });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.login(form);
      if (response.data) {
        tokenStorage.set(response.data.token);
        localStorage.setItem('freezeflow_user', JSON.stringify(response.data.user));
        router.push('/dashboard');
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="shadow-xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Staff Login</CardTitle>
        <CardDescription>Sign in to access the FreezeFlow Ops portal</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@freezeflow.com"
              required
              value={form.email}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                required
                value={form.password}
                onChange={handleChange}
                disabled={isLoading}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Signing in…</>
            ) : (
              <><LogIn className="h-4 w-4 mr-2" />Sign In</>
            )}
          </Button>
        </form>

        <div className="mt-6 rounded-md bg-muted/50 p-3 text-xs space-y-1">
          <p className="font-semibold text-muted-foreground">Demo credentials:</p>
          <p><span className="font-medium">Super Admin:</span> admin@freezeflow.com / password123</p>
          <p><span className="font-medium">Operations:</span> ops@freezeflow.com / password123</p>
        </div>
      </CardContent>
    </Card>
  );
}
