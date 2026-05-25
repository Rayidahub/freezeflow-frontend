'use client';
// components/shared/Sidebar.tsx

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Factory, Receipt, Package,
  ShoppingCart, Users, Settings, LogOut, Snowflake, ChevronRight, Truck, BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { label: 'Dashboard',  href: '/dashboard',  icon: LayoutDashboard },
  { label: 'Production', href: '/production', icon: Factory },
  { label: 'Expenses',   href: '/expenses',   icon: Receipt },
];

const adminNavItems = [
  { label: 'Products',  href: '/admin/products',  icon: Package,      roles: ['super_admin'] },
  { label: 'Orders',      href: '/admin/orders',     icon: ShoppingCart, roles: ['super_admin', 'operations'] },
  { label: 'Deliveries',  href: '/admin/deliveries', icon: Truck,        roles: ['super_admin', 'operations', 'delivery'] },
  { label: 'Customers', href: '/admin/customers', icon: Users,        roles: ['super_admin'] },
  { label: 'Analytics', href: '/analytics',        icon: BarChart3,    roles: ['super_admin', 'operations'] },
  { label: 'Settings',  href: '/admin/settings',  icon: Settings,     roles: ['super_admin'] },
];

const roleLabels: Record<string, string> = {
  super_admin: 'Super Admin',
  operations:  'Operations',
  delivery:    'Delivery',
};

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className={cn('flex h-full w-64 flex-col border-r border-border bg-card', className)}>
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Snowflake className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-sm leading-none">FreezeFlow</p>
          <p className="text-xs text-muted-foreground mt-0.5">Operations</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Operations
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href} href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="h-3 w-3 opacity-60" />}
            </Link>
          );
        })}

        <Separator className="my-3" />

        <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Admin
        </p>
        {adminNavItems
          .filter((item) => !item.roles || item.roles.includes(user?.role ?? ''))
          .map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href} href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
              </Link>
            );
          })}
      </nav>

      {/* User info + logout */}
      <div className="border-t border-border p-4 space-y-3">
        {user && (
          <div className="flex items-center gap-3 px-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold shrink-0">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user.fullName}</p>
              <p className="text-xs text-muted-foreground">{roleLabels[user.role] ?? user.role}</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
