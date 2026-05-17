// lib/api.ts
// Typed API client for FreezeFlow Ops backend

import { ApiResponse, AuthResponse, LoginCredentials } from '@/types';

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
    throw new ApiError(
      data.message || 'Request failed',
      response.status,
      data.errors
    );
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

// ─── Token helpers (localStorage) ────────────────────────────────────────────

const TOKEN_KEY = 'freezeflow_token';
const USER_KEY = 'freezeflow_user';

export const tokenStorage = {
  get: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },
  set: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },
  remove: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const authApi = {
  login: (credentials: LoginCredentials) =>
    fetchApi<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (data: {
    fullName: string;
    email: string;
    password: string;
    role?: string;
  }) =>
    fetchApi<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMe: (token: string) =>
    fetchApi('/auth/me', { token }),
};

// ─── Health API ───────────────────────────────────────────────────────────────

export const healthApi = {
  check: () => fetchApi<{ status: string; timestamp: string }>('/health'),
};

export default fetchApi;
