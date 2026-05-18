'use client';
// components/shared/Navbar.tsx

import { Bell, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

const pageTitles: Record<string, string> = {
  '/dashboard':  'Dashboard',
  '/production': 'Production Logs',
  '/expenses':   'Expenses',
};

interface NavbarProps {
  onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { user }   = useAuth();
  const pathname   = usePathname();
  const title      = pageTitles[pathname] ?? 'FreezeFlow Ops';

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        {user && (
          <div className="flex items-center gap-2">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium leading-none">{user.fullName}</p>
              <p className="text-xs text-muted-foreground capitalize mt-0.5">
                {user.role.replace('_', ' ')}
              </p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
