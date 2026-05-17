// app/(customer)/layout.tsx
// Layout for customer-facing pages

import Link from 'next/link';
import { Snowflake, ShoppingCart } from 'lucide-react';
import { Footer } from '@/components/shared/Footer';
import { Button } from '@/components/ui/button';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Customer Navbar */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Snowflake className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">FreezeFlow</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors">
              Products
            </Link>
            <Link href="/orders" className="text-muted-foreground hover:text-foreground transition-colors">
              My Orders
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <Button asChild size="sm">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}
