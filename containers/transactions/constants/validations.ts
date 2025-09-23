import { z } from 'zod';

export const transactionFormSchema = z.object({
  projectId: z
    .string()
    .min(1, 'Layihə seçilməlidir'),
  type: z
    .enum(['income', 'expense', 'transfer', 'topup'], {
      required_error: 'Əməliyyat növü seçilməlidir'
    }),
  category: z
    .string()
    .min(1, 'Kateqoriya seçilməlidir'),
  amount: z
    .number()
    .min(0.01, 'Məbləğ 0-dan böyük olmalıdır')
    .max(1000000, 'Məbləğ çox böyükdür'),
  description: z
    .string()
    .max(500, 'Təsvir 500 simvoldan çox ola bilməz')
    .optional(),
  date: z
    .string()
    .min(1, 'Tarix seçilməlidir')
}).and(z.object({
  currency: z.enum(['AZN','USD','EUR']).default('AZN'),
  source: z.enum(['cash','bank','partner','own']).optional(),
  receiptUrl: z.string().optional(),
  toProjectId: z.string().optional(),
  toUserId: z.string().optional(),
}));

export const transactionFiltersSchema = z.object({
  searchTerm: z.string().optional(),
  type: z.enum(['income', 'expense','transfer','topup']).optional(),
  category: z.string().optional(),
  projectId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional()
});

export type TransactionFormData = z.infer<typeof transactionFormSchema>;
export type TransactionFiltersData = z.infer<typeof transactionFiltersSchema>;
