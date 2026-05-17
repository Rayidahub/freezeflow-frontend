// lib/utils.ts
// Utility helpers

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes safely (shadcn pattern).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as Nigerian Naira.
 */
export function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a date string to a human-readable format.
 */
export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr));
}

/**
 * Capitalise the first letter of a string.
 */
export function capitalise(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Humanise a snake_case or camelCase string.
 */
export function humanise(str: string): string {
  return str
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
}
