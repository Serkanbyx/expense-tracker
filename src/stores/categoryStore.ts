import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Category } from '../types';

/**
 * Result type for store operations
 */
interface OperationResult {
  success: boolean;
  error?: string;
}

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

/**
 * Validates category data before saving
 */
function validateCategoryData(data: Partial<Omit<Category, 'id'>>): string | null {
  if (data.name !== undefined && (!data.name || data.name.trim() === '')) {
    return 'Kategori adı gereklidir';
  }
  if (data.type !== undefined && !['income', 'expense'].includes(data.type)) {
    return 'Geçersiz kategori tipi';
  }
  if (data.color !== undefined && !/^#[0-9A-Fa-f]{6}$/.test(data.color)) {
    return 'Geçersiz renk kodu';
  }
  return null;
}

interface CategoryStore {
  categories: Category[];
  
  // Actions
  addCategory: (category: Omit<Category, 'id'>) => OperationResult;
  updateCategory: (id: string, category: Partial<Category>) => OperationResult;
  deleteCategory: (id: string) => OperationResult;
  resetCategories: () => OperationResult;
  
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
        try {
          // Validate data
          const validationError = validateCategoryData(categoryData);
          if (validationError) {
            console.error('Validation error:', validationError);
            return { success: false, error: validationError };
          }

          // Check for duplicate name
          const existingCategory = get().categories.find(
            (cat) => cat.name.toLowerCase() === categoryData.name.toLowerCase() && cat.type === categoryData.type
          );
          if (existingCategory) {
            return { success: false, error: 'Bu isimde bir kategori zaten mevcut' };
          }

          const newCategory: Category = {
            ...categoryData,
            id: uuidv4(),
          };
          set((state) => ({
            categories: [...state.categories, newCategory],
          }));
          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Kategori eklenirken bir hata oluştu';
          console.error('Add category error:', errorMessage);
          return { success: false, error: errorMessage };
        }
      },

      updateCategory: (id, categoryData) => {
        try {
          const { categories } = get();
          const existingCategory = categories.find((cat) => cat.id === id);
          
          if (!existingCategory) {
            return { success: false, error: 'Kategori bulunamadı' };
          }

          // Validate data
          const validationError = validateCategoryData(categoryData);
          if (validationError) {
            return { success: false, error: validationError };
          }

          set((state) => ({
            categories: state.categories.map((cat) =>
              cat.id === id ? { ...cat, ...categoryData } : cat
            ),
          }));
          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Kategori güncellenirken bir hata oluştu';
          console.error('Update category error:', errorMessage);
          return { success: false, error: errorMessage };
        }
      },

      deleteCategory: (id) => {
        try {
          // Prevent deleting default categories
          const isDefault = DEFAULT_CATEGORIES.some((cat) => cat.id === id);
          if (isDefault) {
            return { success: false, error: 'Varsayılan kategoriler silinemez' };
          }

          const { categories } = get();
          const existingCategory = categories.find((cat) => cat.id === id);
          
          if (!existingCategory) {
            return { success: false, error: 'Kategori bulunamadı' };
          }

          set((state) => ({
            categories: state.categories.filter((cat) => cat.id !== id),
          }));
          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Kategori silinirken bir hata oluştu';
          console.error('Delete category error:', errorMessage);
          return { success: false, error: errorMessage };
        }
      },

      resetCategories: () => {
        try {
          set({ categories: DEFAULT_CATEGORIES });
          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Kategoriler sıfırlanırken bir hata oluştu';
          console.error('Reset categories error:', errorMessage);
          return { success: false, error: errorMessage };
        }
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
