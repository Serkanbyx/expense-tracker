import { z } from 'zod';

/**
 * Zod schema for transaction form validation
 */
export const transactionSchema = z.object({
  type: z.enum(['income', 'expense'], {
    required_error: 'Select a transaction type',
  }),
  amount: z
    .number({
      required_error: 'Amount is required',
      invalid_type_error: 'Enter a valid amount',
    })
    .positive('Amount must be greater than 0')
    .max(999999999, 'Amount is too large'),
  category: z
    .string({
      required_error: 'Select a category',
    })
    .min(1, 'Select a category'),
  description: z
    .string()
    .max(200, 'Description can be at most 200 characters')
    .optional()
    .default(''),
  date: z
    .string({
      required_error: 'Select a date',
    })
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, 'Enter a valid date'),
});

/**
 * Zod schema for category form validation
 */
export const categorySchema = z.object({
  name: z
    .string({
      required_error: 'Category name is required',
    })
    .min(1, 'Category name is required')
    .max(50, 'Category name can be at most 50 characters'),
  type: z.enum(['income', 'expense'], {
    required_error: 'Select a category type',
  }),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Enter a valid color code')
    .default('#22c55e'),
  icon: z.string().default('tag'),
});

export type TransactionSchemaType = z.infer<typeof transactionSchema>;
export type CategorySchemaType = z.infer<typeof categorySchema>;
