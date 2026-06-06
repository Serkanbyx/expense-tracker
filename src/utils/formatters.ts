import { format, parseISO, isValid } from 'date-fns';
import { enUS } from 'date-fns/locale';

/**
 * Format number as US Dollar currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format date string to localized format
 */
export function formatDate(dateString: string, formatStr: string = 'dd MMM yyyy'): string {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return dateString;
    return format(date, formatStr, { locale: enUS });
  } catch {
    return dateString;
  }
}

/**
 * Format date for input fields (YYYY-MM-DD)
 */
export function formatDateForInput(dateString: string): string {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return dateString;
    return format(date, 'yyyy-MM-dd');
  } catch {
    return dateString;
  }
}

/**
 * Get current date in YYYY-MM-DD format
 */
export function getCurrentDate(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

/**
 * Get current ISO date string
 */
export function getCurrentISOString(): string {
  return new Date().toISOString();
}

/**
 * Format number with thousand separators
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}
