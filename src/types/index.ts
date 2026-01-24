/**
 * Transaction type - represents an income or expense entry
 */
export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
}

/**
 * Category type - represents a category for transactions
 */
export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
}

/**
 * Filter state for transactions
 */
export interface FilterState {
  dateRange: {
    start: string;
    end: string;
  } | null;
  type: 'all' | 'income' | 'expense';
  category: string | null;
  searchQuery: string;
}

/**
 * Form data for creating/editing transactions
 */
export interface TransactionFormData {
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

/**
 * Summary statistics for dashboard
 */
export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

/**
 * Chart data types
 */
export interface CategoryChartData {
  name: string;
  value: number;
  color: string;
}

export interface MonthlyChartData {
  month: string;
  income: number;
  expense: number;
}
