import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import type { Transaction, TransactionFormData, FilterState, TransactionSummary, CategoryChartData, MonthlyChartData } from '../types';
import { getCurrentISOString } from '../utils/formatters';
import { useCategoryStore } from './categoryStore';

interface TransactionStore {
  transactions: Transaction[];
  
  // Actions
  addTransaction: (data: TransactionFormData) => void;
  updateTransaction: (id: string, data: Partial<TransactionFormData>) => void;
  deleteTransaction: (id: string) => void;
  clearAllTransactions: () => void;
  
  // Selectors
  getFilteredTransactions: (filters: FilterState) => Transaction[];
  getSummary: (transactions?: Transaction[]) => TransactionSummary;
  getRecentTransactions: (limit?: number) => Transaction[];
  getCategoryChartData: (type: 'income' | 'expense', transactions?: Transaction[]) => CategoryChartData[];
  getMonthlyChartData: (transactions?: Transaction[]) => MonthlyChartData[];
}

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set, get) => ({
      transactions: [],

      addTransaction: (data) => {
        const newTransaction: Transaction = {
          id: uuidv4(),
          ...data,
          createdAt: getCurrentISOString(),
        };
        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
        }));
      },

      updateTransaction: (id, data) => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...data } : t
          ),
        }));
      },

      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }));
      },

      clearAllTransactions: () => {
        set({ transactions: [] });
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
            const matchesDescription = t.description.toLowerCase().includes(query);
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
