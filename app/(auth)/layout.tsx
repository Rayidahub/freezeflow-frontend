// app/(auth)/layout.tsx
// Minimal centred layout for login/register pages

import { Snowflake } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen ice-gradient flex flex-col items-center justify-center p-4">
      {/* Brand mark */}
      <Link href="/" className="mb-8 flex items-center gap-2 group">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg group-hover:scale-105 transition-transform">
          <Snowflake className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight">FreezeFlow</span>
      </Link>

      {/* Auth card */}
      <div className="w-full max-w-md">{children}</div>

      {/* Footer note */}
      <p className="mt-8 text-xs text-muted-foreground text-center">
        FreezeFlow Ops — Ice Block Production Management
      </p>
    </div>
  );
}
