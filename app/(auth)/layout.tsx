// app/(auth)/layout.tsx
// Minimal centred layout for login/register pages.
// Wraps with AuthProvider so login can call setAuth after success,
// and redirects to /dashboard if already authenticated.
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Snowflake } from 'lucide-react';
import { AuthProvider, useAuth } from '@/context/AuthContext';

function AuthShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // If already logged in, skip the auth pages
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return null;

  return (
    <div className="min-h-screen ice-gradient flex flex-col items-center justify-center p-4">
      <Link href="/" className="mb-8 flex items-center gap-2 group">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg group-hover:scale-105 transition-transform">
          <Snowflake className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight">FreezeFlow</span>
      </Link>
      <div className="w-full max-w-md">{children}</div>
      <p className="mt-8 text-xs text-muted-foreground text-center">
        FreezeFlow Ops — Ice Block Production Management
      </p>
    </div>
  );
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthShell>{children}</AuthShell>
    </AuthProvider>
  );
}
