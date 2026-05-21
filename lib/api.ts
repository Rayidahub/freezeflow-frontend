// lib/api.ts
// Typed API client for FreezeFlow Ops backend

import type {
  ApiResponse,
  AuthResponse,
  LoginCredentials,
  Production,
  CreateProductionDto,
  ProductionSummary,
  PaginationMeta,
  Expense,
  ExpenseSummary,
  CreateExpenseDto,
  Product,
  Order,
  CustomerAuthResponse,
  CustomerRegisterDto,
  CustomerUser,
  PlaceOrderDto,
  OrderSummary,
} from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

interface FetchOptions extends RequestInit {
  token?: string;
}

async function fetchApi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const { token, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...fetchOptions.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  const data: ApiResponse<T> = await response.json();

  if (!response.ok) {
    throw new ApiError(data.message || 'Request failed', response.status, data.errors);
  }

  return data;
}

// ─── Custom Error class ───────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errors?: string[]
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ─── Staff token storage ──────────────────────────────────────────────────────

const TOKEN_KEY = 'freezeflow_token';
const USER_KEY  = 'freezeflow_user';

export const tokenStorage = {
  get:    (): string | null =>
    typeof window === 'undefined' ? null : localStorage.getItem(TOKEN_KEY),
  set:    (token: string) => localStorage.setItem(TOKEN_KEY, token),
  remove: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

// ─── Customer token storage ───────────────────────────────────────────────────

const CUSTOMER_TOKEN_KEY = 'freezeflow_customer_token';
const CUSTOMER_USER_KEY  = 'freezeflow_customer_user';

export const customerTokenStorage = {
  get:    (): string | null =>
    typeof window === 'undefined' ? null : localStorage.getItem(CUSTOMER_TOKEN_KEY),
  set:    (token: string) => localStorage.setItem(CUSTOMER_TOKEN_KEY, token),
  remove: () => {
    localStorage.removeItem(CUSTOMER_TOKEN_KEY);
    localStorage.removeItem(CUSTOMER_USER_KEY);
  },
};

// ─── Staff Auth API ───────────────────────────────────────────────────────────

export const authApi = {
  login: (credentials: LoginCredentials) =>
    fetchApi<AuthResponse>('/auth/login', {
      method: 'POST', body: JSON.stringify(credentials),
    }),

  register: (data: { fullName: string; email: string; password: string; role?: string }) =>
    fetchApi<AuthResponse>('/auth/register', {
      method: 'POST', body: JSON.stringify(data),
    }),

  getMe: (token: string) =>
    fetchApi('/auth/me', { token }),
};

// ─── Customer Auth API ────────────────────────────────────────────────────────

export const customerAuthApi = {
  register: (data: CustomerRegisterDto) =>
    fetchApi<CustomerAuthResponse>('/customers/register', {
      method: 'POST', body: JSON.stringify(data),
    }),

  login: (email: string, password: string) =>
    fetchApi<CustomerAuthResponse>('/customers/login', {
      method: 'POST', body: JSON.stringify({ email, password }),
    }),

  getMe: (token: string) =>
    fetchApi<CustomerUser>('/customers/me', { token }),

  updateMe: (token: string, data: Partial<CustomerRegisterDto>) =>
    fetchApi<CustomerUser>('/customers/me', {
      method: 'PUT', token, body: JSON.stringify(data),
    }),
};

// ─── Production API ───────────────────────────────────────────────────────────

interface GetAllProductionOptions {
  page?:  number;
  limit?: number;
  from?:  string;
  to?:    string;
}

export const productionApi = {
  getAll: (token: string, opts: GetAllProductionOptions = {}) => {
    const params = new URLSearchParams();
    if (opts.page)  params.set('page',  String(opts.page));
    if (opts.limit) params.set('limit', String(opts.limit));
    if (opts.from)  params.set('from',  opts.from);
    if (opts.to)    params.set('to',    opts.to);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return fetchApi<{ logs: Production[]; pagination: PaginationMeta }>(
      `/production${qs}`, { token }
    );
  },

  getSummary: (token: string, period: 'today' | 'week' | 'month' | 'all' = 'today') =>
    fetchApi<ProductionSummary>(`/production/summary?period=${period}`, { token }),

  getOne: (token: string, id: string) =>
    fetchApi<Production>(`/production/${id}`, { token }),

  create: (token: string, data: CreateProductionDto) =>
    fetchApi<Production>('/production', {
      method: 'POST', token, body: JSON.stringify(data),
    }),

  update: (token: string, id: string, data: Partial<CreateProductionDto>) =>
    fetchApi<Production>(`/production/${id}`, {
      method: 'PUT', token, body: JSON.stringify(data),
    }),

  delete: (token: string, id: string) =>
    fetchApi<null>(`/production/${id}`, { method: 'DELETE', token }),
};

// ─── Expense API ──────────────────────────────────────────────────────────────

interface GetAllExpensesOptions {
  page?:  number;
  limit?: number;
  from?:  string;
  to?:    string;
  type?:  string;
}

export const expenseApi = {
  getAll: (token: string, opts: GetAllExpensesOptions = {}) => {
    const params = new URLSearchParams();
    if (opts.page)  params.set('page',  String(opts.page));
    if (opts.limit) params.set('limit', String(opts.limit));
    if (opts.from)  params.set('from',  opts.from);
    if (opts.to)    params.set('to',    opts.to);
    if (opts.type)  params.set('type',  opts.type);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return fetchApi<{ expenses: Expense[]; pagination: PaginationMeta }>(
      `/expenses${qs}`, { token }
    );
  },

  getSummary: (token: string, period: 'today' | 'week' | 'month' | 'all' = 'today') =>
    fetchApi<ExpenseSummary>(`/expenses/summary?period=${period}`, { token }),

  getOne: (token: string, id: string) =>
    fetchApi<Expense>(`/expenses/${id}`, { token }),

  create: (token: string, data: CreateExpenseDto) =>
    fetchApi<Expense>('/expenses', {
      method: 'POST', token, body: JSON.stringify(data),
    }),

  update: (token: string, id: string, data: Partial<CreateExpenseDto>) =>
    fetchApi<Expense>(`/expenses/${id}`, {
      method: 'PUT', token, body: JSON.stringify(data),
    }),

  delete: (token: string, id: string) =>
    fetchApi<null>(`/expenses/${id}`, { method: 'DELETE', token }),
};

// ─── Products API ─────────────────────────────────────────────────────────────

export const productsApi = {
  getAll: () =>
    fetchApi<Product[]>('/products'),

  getOne: (id: string) =>
    fetchApi<Product>(`/products/${id}`),
};

// ─── Orders API ───────────────────────────────────────────────────────────────

export const ordersApi = {
  // Customer endpoints
  place: (token: string, data: PlaceOrderDto) =>
    fetchApi<Order>('/orders', {
      method: 'POST', token, body: JSON.stringify(data),
    }),

  getMyOrders: (token: string, page = 1) =>
    fetchApi<{ orders: Order[]; pagination: PaginationMeta }>(
      `/orders/my?page=${page}`, { token }
    ),

  getMyOrderById: (token: string, id: string) =>
    fetchApi<Order>(`/orders/my/${id}`, { token }),

  cancelMyOrder: (token: string, id: string) =>
    fetchApi<Order>(`/orders/my/${id}/cancel`, { method: 'PATCH', token }),

  // Staff endpoints
  getAll: (token: string, page = 1, status?: string) => {
    const qs = status ? `?page=${page}&status=${status}` : `?page=${page}`;
    return fetchApi<{ orders: Order[]; pagination: PaginationMeta }>(
      `/orders${qs}`, { token }
    );
  },

  getSummary: (token: string) =>
    fetchApi<OrderSummary>('/orders/summary', { token }),

  getById: (token: string, id: string) =>
    fetchApi<Order>(`/orders/${id}`, { token }),

  updateStatus: (token: string, id: string, status: string) =>
    fetchApi<Order>(`/orders/${id}/status`, {
      method: 'PATCH', token, body: JSON.stringify({ status }),
    }),
};

// ─── Health API ───────────────────────────────────────────────────────────────

export const healthApi = {
  check: () => fetchApi<{ status: string; timestamp: string }>('/health'),
};

export default fetchApi;
