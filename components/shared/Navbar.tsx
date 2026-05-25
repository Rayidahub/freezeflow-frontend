'use client';
// components/shared/Navbar.tsx

import { Bell, Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  '/dashboard':        { title: 'Dashboard',       subtitle: 'Business overview' },
  '/production':       { title: 'Production',      subtitle: 'Daily production logs' },
  '/expenses':         { title: 'Expenses',         subtitle: 'Operational costs' },
  '/admin/orders':     { title: 'Orders',           subtitle: 'Customer order management' },
  '/admin/deliveries': { title: 'Deliveries',       subtitle: 'Active delivery assignments' },
  '/analytics':        { title: 'Analytics',        subtitle: 'Performance & reports' },
};

interface NavbarProps {
  onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { user }  = useAuth();
  const pathname  = usePathname();
  const meta      = pageMeta[pathname] ?? { title: 'FreezeFlow Ops', subtitle: '' };

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-white/80 backdrop-blur-sm px-6 sticky top-0 z-30">
      {/* Left */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden rounded-xl" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-base font-bold leading-tight">{meta.title}</h1>
          {meta.subtitle && (
            <p className="text-xs text-muted-foreground hidden sm:block">{meta.subtitle}</p>
          )}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Search hint */}
        <div className="hidden md:flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground cursor-pointer hover:bg-muted transition-colors">
          <Search className="h-3.5 w-3.5" />
          <span className="text-xs">Search...</span>
          <kbd className="ml-2 rounded border border-border px-1 text-xs">⌘K</kbd>
        </div>

        {/* Notifications */}
        <div className="relative">
          <Button variant="ghost" size="icon" className="rounded-xl relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-gradient-to-r from-sky-500 to-violet-500 shadow" />
          </Button>
        </div>

        {/* User pill */}
        {user && (
          <div className="flex items-center gap-2.5 rounded-xl border border-border bg-muted/40 pl-1 pr-3 py-1 ml-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg btn-gradient text-white text-xs font-bold shadow-sm">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold leading-none">{user.fullName.split(' ')[0]}</p>
              <p className="text-xs text-muted-foreground capitalize mt-0.5">
                {user.role.replace('_', ' ')}
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
