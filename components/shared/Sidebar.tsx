'use client';
// components/shared/Sidebar.tsx — gradient dark sidebar

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Factory, Receipt, Package,
  ShoppingCart, Users, Settings, LogOut,
  Snowflake, Truck, BarChart3, ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { label: 'Dashboard',  href: '/dashboard',  icon: LayoutDashboard },
  { label: 'Production', href: '/production', icon: Factory },
  { label: 'Expenses',   href: '/expenses',   icon: Receipt },
];

const adminNavItems = [
  { label: 'Products',   href: '/admin/products',   icon: Package,      roles: ['super_admin'] },
  { label: 'Orders',     href: '/admin/orders',     icon: ShoppingCart, roles: ['super_admin', 'operations'] },
  { label: 'Deliveries', href: '/admin/deliveries', icon: Truck,        roles: ['super_admin', 'operations', 'delivery'] },
  { label: 'Customers',  href: '/admin/customers',  icon: Users,        roles: ['super_admin'] },
  { label: 'Analytics',  href: '/analytics',        icon: BarChart3,    roles: ['super_admin', 'operations'] },
  { label: 'Settings',   href: '/admin/settings',   icon: Settings,     roles: ['super_admin'] },
];

const roleLabels: Record<string, string> = {
  super_admin: 'Super Admin',
  operations:  'Operations',
  delivery:    'Delivery',
};

const roleBadgeColors: Record<string, string> = {
  super_admin: 'bg-violet-500/20 text-violet-300 border border-violet-500/30',
  operations:  'bg-sky-500/20 text-sky-300 border border-sky-500/30',
  delivery:    'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
};

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className={cn(
      'flex h-full w-64 flex-col sidebar-gradient',
      className
    )}>
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 px-5 border-b border-white/8">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl btn-gradient shadow-lg">
          <Snowflake className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-sm text-white leading-none tracking-tight">FreezeFlow</p>
          <p className="text-xs text-white/40 mt-0.5">Operations Portal</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {/* Section: Operations */}
        <p className="px-3 pt-1 pb-2 text-xs font-semibold text-white/30 uppercase tracking-widest">
          Operations
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href} href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-white/55 hover:bg-white/8 hover:text-white/90'
              )}
            >
              <div className={cn(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all',
                isActive ? 'btn-gradient shadow' : 'bg-white/8 group-hover:bg-white/12'
              )}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="h-3 w-3 text-white/50" />}
            </Link>
          );
        })}

        {/* Section: Admin */}
        <p className="px-3 pt-4 pb-2 text-xs font-semibold text-white/30 uppercase tracking-widest">
          Management
        </p>
        {adminNavItems
          .filter((item) => !item.roles || item.roles.includes(user?.role ?? ''))
          .map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href);
            return (
              <Link
                key={item.href} href={item.href}
                className={cn(
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-white/55 hover:bg-white/8 hover:text-white/90'
                )}
              >
                <div className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all',
                  isActive ? 'btn-gradient shadow' : 'bg-white/8 group-hover:bg-white/12'
                )}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight className="h-3 w-3 text-white/50" />}
              </Link>
            );
          })}
      </nav>

      {/* User footer */}
      <div className="border-t border-white/8 p-3">
        {user && (
          <div className="flex items-center gap-3 rounded-xl px-2 py-2 mb-1">
            <div className="relative shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl btn-gradient text-white text-sm font-bold shadow">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-[#0f172a]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{user.fullName}</p>
              <span className={cn(
                'inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium',
                roleBadgeColors[user.role] ?? 'bg-white/10 text-white/60'
              )}>
                {roleLabels[user.role] ?? user.role}
              </span>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-white/50 hover:bg-white/8 hover:text-red-400 transition-all"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
