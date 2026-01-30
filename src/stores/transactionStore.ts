import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import type { Transaction, TransactionFormData, FilterState, TransactionSummary, CategoryChartData, MonthlyChartData } from '../types';
import { getCurrentISOString } from '../utils/formatters';
import { useCategoryStore } from './categoryStore';

/**
 * Result type for store operations
 */
interface OperationResult {
  success: boolean;
  error?: string;
}

interface TransactionStore {
  transactions: Transaction[];
  
  // Actions
  addTransaction: (data: TransactionFormData) => OperationResult;
  updateTransaction: (id: string, data: Partial<TransactionFormData>) => OperationResult;
  deleteTransaction: (id: string) => OperationResult;
  clearAllTransactions: () => OperationResult;
  
  // Selectors
  getFilteredTransactions: (filters: FilterState) => Transaction[];
  getSummary: (transactions?: Transaction[]) => TransactionSummary;
  getRecentTransactions: (limit?: number) => Transaction[];
  getCategoryChartData: (type: 'income' | 'expense', transactions?: Transaction[]) => CategoryChartData[];
  getMonthlyChartData: (transactions?: Transaction[]) => MonthlyChartData[];
}

/**
 * Validates transaction data before saving
 */
function validateTransactionData(data: TransactionFormData): string | null {
  if (!data.type || !['income', 'expense'].includes(data.type)) {
    return 'Geçersiz işlem tipi';
  }
  if (typeof data.amount !== 'number' || data.amount <= 0) {
    return 'Tutar 0\'dan büyük olmalıdır';
  }
  if (!data.category || data.category.trim() === '') {
    return 'Kategori seçilmelidir';
  }
  if (!data.date) {
    return 'Tarih seçilmelidir';
  }
  return null;
}

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set, get) => ({
      transactions: [],

      addTransaction: (data) => {
        try {
          // Validate data
          const validationError = validateTransactionData(data);
          if (validationError) {
            console.error('Validation error:', validationError);
            return { success: false, error: validationError };
          }

          const newTransaction: Transaction = {
            id: uuidv4(),
            ...data,
            description: data.description || '',
            createdAt: getCurrentISOString(),
          };
          set((state) => ({
            transactions: [newTransaction, ...state.transactions],
          }));
          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'İşlem eklenirken bir hata oluştu';
          console.error('Add transaction error:', errorMessage);
          return { success: false, error: errorMessage };
        }
      },

      updateTransaction: (id, data) => {
        try {
          const { transactions } = get();
          const existingTransaction = transactions.find((t) => t.id === id);
          
          if (!existingTransaction) {
            return { success: false, error: 'İşlem bulunamadı' };
          }

          // Validate amount if provided
          if (data.amount !== undefined && (typeof data.amount !== 'number' || data.amount <= 0)) {
            return { success: false, error: 'Tutar 0\'dan büyük olmalıdır' };
          }

          set((state) => ({
            transactions: state.transactions.map((t) =>
              t.id === id ? { ...t, ...data } : t
            ),
          }));
          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'İşlem güncellenirken bir hata oluştu';
          console.error('Update transaction error:', errorMessage);
          return { success: false, error: errorMessage };
        }
      },

      deleteTransaction: (id) => {
        try {
          const { transactions } = get();
          const existingTransaction = transactions.find((t) => t.id === id);
          
          if (!existingTransaction) {
            return { success: false, error: 'İşlem bulunamadı' };
          }

          set((state) => ({
            transactions: state.transactions.filter((t) => t.id !== id),
          }));
          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'İşlem silinirken bir hata oluştu';
          console.error('Delete transaction error:', errorMessage);
          return { success: false, error: errorMessage };
        }
      },

      clearAllTransactions: () => {
        try {
          set({ transactions: [] });
          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'İşlemler temizlenirken bir hata oluştu';
          console.error('Clear transactions error:', errorMessage);
          return { success: false, error: errorMessage };
        }
      },

      getFilteredTransactions: (filters) => {
        const { transactions } = get();
        
        return transactions.filter((t) => {
          // Filter by type
          if (filters.type !== 'all' && t.type !== filters.type) {
            return false;
          }

          // Filter by category
          if (filters.category && t.category !== filters.category) {
            return false;
          }

          // Filter by date range
          if (filters.dateRange) {
            const transactionDate = parseISO(t.date);
            const start = startOfDay(parseISO(filters.dateRange.start));
            const end = endOfDay(parseISO(filters.dateRange.end));
            
            if (!isWithinInterval(transactionDate, { start, end })) {
              return false;
            }
          }

          // Filter by search query
          if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            const matchesDescription = (t.description || '').toLowerCase().includes(query);
            const matchesCategory = t.category.toLowerCase().includes(query);
            
            if (!matchesDescription && !matchesCategory) {
              return false;
            }
          }

          return true;
        });
      },

      getSummary: (transactionsInput) => {
        const transactions = transactionsInput ?? get().transactions;
        
        const totalIncome = transactions
          .filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        
        const totalExpense = transactions
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);

        return {
          totalIncome,
          totalExpense,
          balance: totalIncome - totalExpense,
        };
      },

      getRecentTransactions: (limit = 5) => {
        const { transactions } = get();
        return [...transactions]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, limit);
      },

      getCategoryChartData: (type, transactionsInput) => {
        const transactions = transactionsInput ?? get().transactions;
        const categoryStore = useCategoryStore.getState();
        
        const filteredTransactions = transactions.filter((t) => t.type === type);
        
        // Group by category
        const categoryTotals = filteredTransactions.reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
          return acc;
        }, {} as Record<string, number>);

        // Map to chart data
        return Object.entries(categoryTotals).map(([categoryId, value]) => {
          const category = categoryStore.getCategoryById(categoryId);
          return {
            name: category?.name || categoryId,
            value,
            color: category?.color || '#6b7280',
          };
        });
      },

      getMonthlyChartData: (transactionsInput) => {
        const transactions = transactionsInput ?? get().transactions;
        
        // Group by month (YYYY-MM)
        const monthlyData = transactions.reduce((acc, t) => {
          const month = t.date.slice(0, 7); // YYYY-MM
          
          if (!acc[month]) {
            acc[month] = { income: 0, expense: 0 };
          }
          
          if (t.type === 'income') {
            acc[month].income += t.amount;
          } else {
            acc[month].expense += t.amount;
          }
          
          return acc;
        }, {} as Record<string, { income: number; expense: number }>);

        // Convert to array and sort by month
        return Object.entries(monthlyData)
          .map(([month, data]) => ({
            month,
            ...data,
          }))
          .sort((a, b) => a.month.localeCompare(b.month))
          .slice(-6); // Last 6 months
      },
    }),
    {
      name: 'expense-tracker-transactions',
    }
  )
);
