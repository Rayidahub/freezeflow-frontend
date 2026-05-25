'use client';
// app/(auth)/layout.tsx

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Snowflake } from 'lucide-react';
import { AuthProvider, useAuth } from '@/context/AuthContext';

function AuthShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace('/dashboard');
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return null;

  return (
    <div className="min-h-screen hero-gradient relative flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-sky-400/15 blur-3xl" />
        {/* Dot pattern */}
        <div className="absolute inset-0 dot-pattern opacity-30" />
      </div>

      {/* Brand */}
      <Link href="/" className="relative mb-8 flex items-center gap-3 group">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg group-hover:scale-105 transition-transform">
          <Snowflake className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="font-black text-xl text-white tracking-tight">FreezeFlow</p>
          <p className="text-xs text-white/60">Operations Portal</p>
        </div>
      </Link>

      {/* Card */}
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 to-violet-500/20 blur-xl rounded-3xl" />
        <div className="relative glass rounded-2xl shadow-2xl overflow-hidden">
          {children}
        </div>
      </div>

      <p className="relative mt-8 text-xs text-white/50 text-center">
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
