'use client';
// app/(customer)/layout.tsx

import Link from 'next/link';
import { Snowflake, LogOut, ShoppingBag } from 'lucide-react';
import { Footer } from '@/components/shared/Footer';
import { Button } from '@/components/ui/button';
import { CustomerAuthProvider, useCustomerAuth } from '@/context/CustomerAuthContext';
import { ToastProvider } from '@/components/ui/toast';

function CustomerNav() {
  const { isAuthenticated, customer, logout } = useCustomerAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl btn-gradient shadow group-hover:scale-105 transition-transform">
            <Snowflake className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <span className="font-black text-base tracking-tight text-gradient">FreezeFlow</span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { href: '/',         label: 'Home' },
            { href: '/products', label: 'Products' },
            ...(isAuthenticated ? [{ href: '/orders', label: 'My Orders' }] : []),
          ].map((item) => (
            <Link key={item.href} href={item.href}
              className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <div className="hidden sm:flex items-center gap-2 rounded-xl border border-border bg-muted/40 pl-2 pr-3 py-1">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg btn-gradient text-white text-xs font-black">
                  {customer?.fullName?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-semibold">{customer?.fullName?.split(' ')[0]}</span>
              </div>
              <Button variant="ghost" size="icon" className="rounded-xl" onClick={logout} title="Sign out">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="rounded-xl font-medium">
                <Link href="/customer-login">Sign In</Link>
              </Button>
              <Button asChild size="sm" className="rounded-xl btn-gradient text-white border-0 shadow gap-1.5 font-semibold">
                <Link href="/customer-register">
                  <ShoppingBag className="h-3.5 w-3.5" />
                  Get Started
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function CustomerShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <CustomerNav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <CustomerAuthProvider>
      <ToastProvider>
        <CustomerShell>{children}</CustomerShell>
      </ToastProvider>
    </CustomerAuthProvider>
  );
}
