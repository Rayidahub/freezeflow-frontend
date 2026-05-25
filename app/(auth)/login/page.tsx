'use client';
// app/(auth)/login/page.tsx

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, LogIn, Loader2, Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input }  from '@/components/ui/input';
import { Label }  from '@/components/ui/label';
import { authApi, ApiError } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router      = useRouter();
  const { setAuth } = useAuth();

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
      const res = await authApi.login(form);
      if (res.data) {
        setAuth(res.data.token, res.data.user);
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-8">
      <div className="mb-7 text-center">
        <h2 className="text-2xl font-black text-foreground">Welcome back</h2>
        <p className="text-muted-foreground text-sm mt-1">Sign in to your staff account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            <span className="shrink-0 mt-0.5">⚠️</span>
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email" name="email" type="email"
              placeholder="you@freezeflow.com" required
              value={form.email} onChange={handleChange} disabled={isLoading}
              className="pl-10 rounded-xl h-11 border-border/60 focus:border-primary bg-white/60"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password" name="password"
              type={showPw ? 'text' : 'password'}
              placeholder="••••••••" required
              value={form.password} onChange={handleChange}
              disabled={isLoading}
              className="pl-10 pr-10 rounded-xl h-11 border-border/60 focus:border-primary bg-white/60"
            />
            <button type="button" onClick={() => setShowPw(!showPw)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-11 rounded-xl btn-gradient text-white font-bold shadow-lg hover:shadow-sky-500/25 transition-all mt-2"
          disabled={isLoading}
        >
          {isLoading
            ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Signing in…</>
            : <><LogIn className="h-4 w-4 mr-2" />Sign In</>
          }
        </Button>
      </form>

      {/* Demo credentials */}
      <div className="mt-6 rounded-xl bg-muted/50 border border-border/50 p-4 text-xs space-y-1.5">
        <p className="font-bold text-muted-foreground uppercase tracking-wide text-xs">Demo Credentials</p>
        <p><span className="font-semibold">Admin:</span> admin@freezeflow.com / password123</p>
        <p><span className="font-semibold">Ops:</span> ops@freezeflow.com / password123</p>
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Need an account?{' '}
        <Link href="/register" className="font-semibold text-primary hover:underline">Register here</Link>
      </p>
    </div>
  );
}
