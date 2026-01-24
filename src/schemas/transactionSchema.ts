import { z } from 'zod';

/**
 * Zod schema for transaction form validation
 */
export const transactionSchema = z.object({
  type: z.enum(['income', 'expense'], {
    required_error: 'İşlem tipi seçiniz',
  }),
  amount: z
    .number({
      required_error: 'Tutar gereklidir',
      invalid_type_error: 'Geçerli bir tutar giriniz',
    })
    .positive('Tutar 0\'dan büyük olmalıdır')
    .max(999999999, 'Tutar çok büyük'),
  category: z
    .string({
      required_error: 'Kategori seçiniz',
    })
    .min(1, 'Kategori seçiniz'),
  description: z
    .string()
    .max(200, 'Açıklama en fazla 200 karakter olabilir')
    .optional()
    .default(''),
  date: z
    .string({
      required_error: 'Tarih seçiniz',
    })
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, 'Geçerli bir tarih giriniz'),
});

/**
 * Zod schema for category form validation
 */
export const categorySchema = z.object({
  name: z
    .string({
      required_error: 'Kategori adı gereklidir',
    })
    .min(1, 'Kategori adı gereklidir')
    .max(50, 'Kategori adı en fazla 50 karakter olabilir'),
  type: z.enum(['income', 'expense'], {
    required_error: 'Kategori tipi seçiniz',
  }),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Geçerli bir renk kodu giriniz')
    .default('#22c55e'),
  icon: z.string().default('tag'),
});

export type TransactionSchemaType = z.infer<typeof transactionSchema>;
export type CategorySchemaType = z.infer<typeof categorySchema>;
