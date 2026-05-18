'use client';
// context/AuthContext.tsx
// Global authentication state for the staff portal.
// Wrap the staff layout with <AuthProvider> so every staff page
// can read the current user and token via useAuth().

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import { StaffUser } from '@/types';
import { tokenStorage } from '@/lib/api';

interface AuthContextValue {
  user:            StaffUser | null;
  token:           string | null;
  isAuthenticated: boolean;
  isLoading:       boolean;
  setAuth:         (token: string, user: StaffUser) => void;
  logout:          () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user,      setUser]      = useState<StaffUser | null>(null);
  const [token,     setToken]     = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate from localStorage on first mount
  useEffect(() => {
    const storedToken = tokenStorage.get();
    const storedUser  = localStorage.getItem('freezeflow_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser) as StaffUser);
      } catch {
        tokenStorage.remove();
      }
    }
    setIsLoading(false);
  }, []);

  const setAuth = useCallback((newToken: string, newUser: StaffUser) => {
    tokenStorage.set(newToken);
    localStorage.setItem('freezeflow_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    tokenStorage.remove();
    setToken(null);
    setUser(null);
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        setAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
