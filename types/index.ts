// types/index.ts
// Shared TypeScript types for FreezeFlow Ops frontend

// ─── Enums ────────────────────────────────────────────────────────────────────

export type UserRole = 'super_admin' | 'operations' | 'delivery';

export type ExpenseType =
  | 'fuel' | 'electricity' | 'water' | 'nylon'
  | 'transportation' | 'labor' | 'maintenance' | 'miscellaneous';

export type DeliveryMethod  = 'delivery' | 'pickup';
export type OrderStatus     = 'pending' | 'confirmed' | 'processing' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type PaymentStatus   = 'unpaid' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod   = 'card' | 'bank_transfer' | 'ussd' | 'cash';

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface StaffUser {
  id:        string;
  fullName:  string;
  email:     string;
  role:      UserRole;
  createdAt?: string;
}

export interface LoginCredentials {
  email:    string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user:  StaffUser;
}

// ─── Production ───────────────────────────────────────────────────────────────

export interface Production {
  id:             string;
  date:           string;
  bagsProduced:   number;
  bagsSold:       number;
  damagedBags:    number;
  remainingStock: number;
  sellingPrice:   number;
  totalSales:     number;
  userId:         string;
  createdAt:      string;
  user?: Pick<StaffUser, 'id' | 'fullName' | 'email'>;
}

export interface CreateProductionDto {
  date:           string;
  bagsProduced:   number;
  bagsSold:       number;
  damagedBags:    number;
  remainingStock: number;
  sellingPrice:   number;
}

export interface ProductionSummary {
  period:       string;
  totalLogs:    number;
  bagsProduced: number;
  bagsSold:     number;
  damagedBags:  number;
  totalSales:   number;
  currentStock: number;
  lastUpdated:  string | null;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginationMeta {
  page:       number;
  limit:      number;
  total:      number;
  totalPages: number;
  hasNext:    boolean;
  hasPrev:    boolean;
}

// ─── Expenses ─────────────────────────────────────────────────────────────────

export interface Expense {
  id:          string;
  date:        string;
  expenseType: ExpenseType;
  amount:      number;
  description?: string;
  userId:      string;
  createdAt:   string;
  user?: Pick<StaffUser, 'id' | 'fullName' | 'email'>;
}

export interface CreateExpenseDto {
  date:        string;
  expenseType: ExpenseType;
  amount:      number;
  description?: string;
}

// ─── Products ─────────────────────────────────────────────────────────────────

export interface Product {
  id:          string;
  name:        string;
  sizeKg:      number;
  price:       number;
  isAvailable: boolean;
  createdAt:   string;
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export interface Customer {
  id:              string;
  fullName:        string;
  email:           string;
  phone:           string;
  deliveryAddress?: string;
  createdAt:       string;
}

export interface Order {
  id:                  string;
  customerId:          string;
  productId:           string;
  quantity:            number;
  totalAmount:         number;
  deliveryMethod:      DeliveryMethod;
  deliveryAddress?:    string;
  orderStatus:         OrderStatus;
  paymentStatus:       PaymentStatus;
  specialInstructions?: string;
  createdAt:           string;
  updatedAt:           string;
  customer?: Customer;
  product?:  Product;
}

// ─── API Response wrapper ─────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success:  boolean;
  message?: string;
  data?:    T;
  errors?:  string[];
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardStats {
  production: ProductionSummary | null;
}

// ─── Expenses (Sprint 3) ──────────────────────────────────────────────────────

export interface ExpenseSummary {
  period:        string;
  totalExpenses: number;
  totalEntries:  number;
  breakdown: {
    expenseType: ExpenseType;
    total:       number;
    count:       number;
  }[];
}

export interface CreateExpenseDto {
  date:         string;
  expenseType:  ExpenseType;
  amount:       number;
  description?: string;
}
