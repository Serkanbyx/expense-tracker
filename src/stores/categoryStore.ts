import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Category } from '../types';

/**
 * Default expense categories
 */
const DEFAULT_EXPENSE_CATEGORIES: Category[] = [
  { id: 'exp-food', name: 'Yiyecek', type: 'expense', color: '#f97316', icon: 'utensils' },
  { id: 'exp-transport', name: 'Ulaşım', type: 'expense', color: '#3b82f6', icon: 'car' },
  { id: 'exp-bills', name: 'Faturalar', type: 'expense', color: '#eab308', icon: 'receipt' },
  { id: 'exp-entertainment', name: 'Eğlence', type: 'expense', color: '#a855f7', icon: 'gamepad-2' },
  { id: 'exp-health', name: 'Sağlık', type: 'expense', color: '#ef4444', icon: 'heart-pulse' },
  { id: 'exp-shopping', name: 'Alışveriş', type: 'expense', color: '#ec4899', icon: 'shopping-bag' },
  { id: 'exp-other', name: 'Diğer', type: 'expense', color: '#6b7280', icon: 'more-horizontal' },
];

/**
 * Default income categories
 */
const DEFAULT_INCOME_CATEGORIES: Category[] = [
  { id: 'inc-salary', name: 'Maaş', type: 'income', color: '#22c55e', icon: 'wallet' },
  { id: 'inc-freelance', name: 'Freelance', type: 'income', color: '#14b8a6', icon: 'laptop' },
  { id: 'inc-investment', name: 'Yatırım', type: 'income', color: '#8b5cf6', icon: 'trending-up' },
  { id: 'inc-gift', name: 'Hediye', type: 'income', color: '#f43f5e', icon: 'gift' },
  { id: 'inc-other', name: 'Diğer', type: 'income', color: '#6b7280', icon: 'more-horizontal' },
];

const DEFAULT_CATEGORIES = [...DEFAULT_EXPENSE_CATEGORIES, ...DEFAULT_INCOME_CATEGORIES];

interface CategoryStore {
  categories: Category[];
  
  // Actions
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  resetCategories: () => void;
  
  // Selectors
  getCategoriesByType: (type: 'income' | 'expense') => Category[];
  getCategoryById: (id: string) => Category | undefined;
  getCategoryByName: (name: string) => Category | undefined;
}

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set, get) => ({
      categories: DEFAULT_CATEGORIES,

      addCategory: (categoryData) => {
        const newCategory: Category = {
          ...categoryData,
          id: uuidv4(),
        };
        set((state) => ({
          categories: [...state.categories, newCategory],
        }));
      },

      updateCategory: (id, categoryData) => {
        set((state) => ({
          categories: state.categories.map((cat) =>
            cat.id === id ? { ...cat, ...categoryData } : cat
          ),
        }));
      },

      deleteCategory: (id) => {
        // Prevent deleting default categories
        const isDefault = DEFAULT_CATEGORIES.some((cat) => cat.id === id);
        if (isDefault) {
          console.warn('Cannot delete default category');
          return;
        }
        set((state) => ({
          categories: state.categories.filter((cat) => cat.id !== id),
        }));
      },

      resetCategories: () => {
        set({ categories: DEFAULT_CATEGORIES });
      },

      getCategoriesByType: (type) => {
        return get().categories.filter((cat) => cat.type === type);
      },

      getCategoryById: (id) => {
        return get().categories.find((cat) => cat.id === id);
      },

      getCategoryByName: (name) => {
        return get().categories.find((cat) => cat.name === name);
      },
    }),
    {
      name: 'expense-tracker-categories',
    }
  )
);
