'use client';
// app/(customer)/customer-login/page.tsx

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, LogIn, Loader2, Mail, Lock, Snowflake } from 'lucide-react';
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
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (error) setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await customerAuthApi.login(form.email, form.password);
      if (res.data) { setAuth(res.data.token, res.data.customer); router.push('/orders'); }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Login failed. Please try again.');
    } finally { setIsLoading(false); }
  }

  return (
    <div className="min-h-screen hero-gradient relative flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-20 pointer-events-none" />
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-xl mb-4">
            <Snowflake className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">Welcome back</h1>
          <p className="text-white/60 mt-1 text-sm">Sign in to your FreezeFlow account</p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex gap-2.5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                <span>⚠️</span>{error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wide text-foreground/60">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" name="email" type="email" placeholder="you@example.com"
                  required value={form.email} onChange={handleChange} disabled={isLoading}
                  className="pl-10 rounded-xl h-11 bg-white/70 border-border/60" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wide text-foreground/60">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" name="password" type={showPw ? 'text' : 'password'}
                  placeholder="••••••••" required value={form.password} onChange={handleChange}
                  disabled={isLoading} className="pl-10 pr-10 rounded-xl h-11 bg-white/70 border-border/60" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-11 rounded-xl btn-gradient text-white font-bold shadow-lg mt-2" disabled={isLoading}>
              {isLoading
                ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Signing in…</>
                : <><LogIn className="h-4 w-4 mr-2" />Sign In</>}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/customer-register" className="font-bold text-primary hover:underline">Create one</Link>
          </p>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Are you staff?{' '}
            <Link href="/login" className="text-primary hover:underline">Staff login →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
