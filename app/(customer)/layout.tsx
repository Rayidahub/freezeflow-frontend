// app/(customer)/layout.tsx
'use client';

import Link from 'next/link';
import { Snowflake, ShoppingCart, User, LogOut } from 'lucide-react';
import { Footer } from '@/components/shared/Footer';
import { Button } from '@/components/ui/button';
import { CustomerAuthProvider, useCustomerAuth } from '@/context/CustomerAuthContext';
import { ToastProvider } from '@/components/ui/toast';

function CustomerNav() {
  const { isAuthenticated, customer, logout } = useCustomerAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Snowflake className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">FreezeFlow</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/"         className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors">Products</Link>
          {isAuthenticated && (
            <Link href="/orders" className="text-muted-foreground hover:text-foreground transition-colors">My Orders</Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                  {customer?.fullName?.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium">{customer?.fullName?.split(' ')[0]}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={logout} title="Sign out">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/customer-login">
                  <User className="h-4 w-4 mr-1" />Sign In
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/customer-register">Get Started</Link>
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
    <div className="flex min-h-screen flex-col">
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
