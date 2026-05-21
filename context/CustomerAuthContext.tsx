'use client';
// context/CustomerAuthContext.tsx
// Global authentication state for the customer portal.

import React, {
  createContext, useContext, useEffect,
  useState, useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import { CustomerUser } from '@/types';
import { customerTokenStorage } from '@/lib/api';

interface CustomerAuthContextValue {
  customer:        CustomerUser | null;
  token:           string | null;
  isAuthenticated: boolean;
  isLoading:       boolean;
  setAuth:         (token: string, customer: CustomerUser) => void;
  logout:          () => void;
}

const CustomerAuthContext = createContext<CustomerAuthContextValue | null>(null);

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [customer,  setCustomer]  = useState<CustomerUser | null>(null);
  const [token,     setToken]     = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const storedToken    = customerTokenStorage.get();
    const storedCustomer = localStorage.getItem('freezeflow_customer_user');
    if (storedToken && storedCustomer) {
      try {
        setToken(storedToken);
        setCustomer(JSON.parse(storedCustomer) as CustomerUser);
      } catch {
        customerTokenStorage.remove();
      }
    }
    setIsLoading(false);
  }, []);

  const setAuth = useCallback((newToken: string, newCustomer: CustomerUser) => {
    customerTokenStorage.set(newToken);
    localStorage.setItem('freezeflow_customer_user', JSON.stringify(newCustomer));
    setToken(newToken);
    setCustomer(newCustomer);
  }, []);

  const logout = useCallback(() => {
    customerTokenStorage.remove();
    setToken(null);
    setCustomer(null);
    router.push('/customer-login');
  }, [router]);

  return (
    <CustomerAuthContext.Provider value={{
      customer, token,
      isAuthenticated: !!token && !!customer,
      isLoading,
      setAuth, logout,
    }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth(): CustomerAuthContextValue {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) throw new Error('useCustomerAuth must be used within <CustomerAuthProvider>');
  return ctx;
}
