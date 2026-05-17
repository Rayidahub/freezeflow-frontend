// components/shared/Footer.tsx
import { Snowflake } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Snowflake className="h-5 w-5 text-primary" />
            <span className="font-bold text-sm">FreezeFlow</span>
          </div>

          <nav className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/products" className="hover:text-foreground transition-colors">
              Products
            </Link>
            <Link href="/orders" className="hover:text-foreground transition-colors">
              My Orders
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Contact
            </Link>
          </nav>

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} FreezeFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
