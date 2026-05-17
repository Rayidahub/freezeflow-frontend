// app/(auth)/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authApi, tokenStorage, ApiError } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'operations',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...payload } = form;
      const response = await authApi.register(payload);
      if (response.data) {
        tokenStorage.set(response.data.token);
        localStorage.setItem('freezeflow_user', JSON.stringify(response.data.user));
        router.push('/dashboard');
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="shadow-xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Register Staff</CardTitle>
        <CardDescription>Create a new staff account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" name="fullName" placeholder="John Doe" required
              value={form.fullName} onChange={handleChange} disabled={isLoading} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" name="email" type="email" placeholder="john@freezeflow.com" required
              value={form.email} onChange={handleChange} disabled={isLoading} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <select
              id="role" name="role" value={form.role} onChange={handleChange} disabled={isLoading}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="operations">Operations</option>
              <option value="delivery">Delivery</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" placeholder="Min. 8 characters"
              required minLength={8} value={form.password} onChange={handleChange} disabled={isLoading} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Re-enter password"
              required value={form.confirmPassword} onChange={handleChange} disabled={isLoading} />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Creating account…</>
            ) : (
              <><UserPlus className="h-4 w-4 mr-2" />Create Account</>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
