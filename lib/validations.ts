import { z } from 'zod';

// Login validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email tələb olunur')
    .email('Düzgün email formatı daxil edin'),
  password: z
    .string()
    .min(1, 'Şifrə tələb olunur')
    .min(6, 'Şifrə ən azı 6 simvol olmalıdır'),
  otp: z
    .string()
    .optional()
});

// Project validation schema
export const projectSchema = z.object({
  name: z
    .string()
    .min(1, 'Layihə adı tələb olunur')
    .min(3, 'Layihə adı ən azı 3 simvol olmalıdır')
    .max(100, 'Layihə adı 100 simvoldan çox ola bilməz'),
  description: z
    .string()
    .max(500, 'Təsvir 500 simvoldan çox ola bilməz')
    .optional(),
  status: z
    .enum(['active', 'completed', 'paused'], {
      required_error: 'Status seçin'
    }),
  startDate: z
    .string()
    .min(1, 'Başlama tarixi tələb olunur'),
  endDate: z
    .string()
    .optional(),
  assignedUsers: z
    .array(z.string())
    .min(1, 'Ən azı bir işçi seçin')
});

// Transaction validation schema
export const transactionSchema = z.object({
  projectId: z
    .string()
    .min(1, 'Layihə seçin'),
  type: z
    .enum(['income', 'expense'], {
      required_error: 'Əməliyyat növünü seçin'
    }),
  amount: z
    .number()
    .min(0.01, 'Məbləğ 0-dan böyük olmalıdır')
    .max(1000000, 'Məbləğ çox böyükdür'),
  category: z
    .enum(['material', 'salary', 'equipment', 'transport', 'utilities', 'rent', 'marketing', 'other'], {
      required_error: 'Kateqoriya seçin'
    }),
  description: z
    .string()
    .max(200, 'Təsvir 200 simvoldan çox ola bilməz')
    .optional(),
  date: z
    .string()
    .min(1, 'Tarix tələb olunur')
});

// User validation schema
export const userSchema = z.object({
  email: z
    .string()
    .min(1, 'Email tələb olunur')
    .email('Düzgün email formatı daxil edin'),
  name: z
    .string()
    .min(1, 'Ad tələb olunur')
    .min(2, 'Ad ən azı 2 simvol olmalıdır')
    .max(50, 'Ad 50 simvoldan çox ola bilməz'),
  role: z
    .enum(['admin', 'user'], {
      required_error: 'Rol seçin'
    }),
  phone: z
    .string()
    .regex(/^\+994[0-9]{9}$/, 'Düzgün telefon nömrəsi daxil edin (+994XXXXXXXXX)')
    .optional()
    .or(z.literal(''))
});

// Profile update schema
export const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(1, 'Ad tələb olunur')
    .min(2, 'Ad ən azı 2 simvol olmalıdır')
    .max(50, 'Ad 50 simvoldan çox ola bilməz'),
  phone: z
    .string()
    .regex(/^\+994[0-9]{9}$/, 'Düzgün telefon nömrəsi daxil edin (+994XXXXXXXXX)')
    .optional()
    .or(z.literal(''))
});

// Password change schema
export const passwordChangeSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Cari şifrə tələb olunur'),
  newPassword: z
    .string()
    .min(6, 'Yeni şifrə ən azı 6 simvol olmalıdır')
    .max(50, 'Yeni şifrə 50 simvoldan çox ola bilməz'),
  confirmPassword: z
    .string()
    .min(1, 'Şifrəni təsdiq edin')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Şifrələr uyğun gəlmir',
  path: ['confirmPassword']
});

// Filter schemas
export const transactionFiltersSchema = z.object({
  projectId: z.string().optional(),
  userId: z.string().optional(),
  type: z.enum(['income', 'expense']).optional(),
  category: z.enum(['material', 'salary', 'equipment', 'transport', 'utilities', 'rent', 'marketing', 'other']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional()
});

export const projectFiltersSchema = z.object({
  status: z.enum(['active', 'completed', 'paused']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional()
});

export const userFiltersSchema = z.object({
  role: z.enum(['admin', 'user']).optional(),
  isActive: z.boolean().optional()
});

// Export types
export type LoginFormData = z.infer<typeof loginSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
export type TransactionFormData = z.infer<typeof transactionSchema>;
export type UserFormData = z.infer<typeof userSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;
export type TransactionFiltersData = z.infer<typeof transactionFiltersSchema>;
export type ProjectFiltersData = z.infer<typeof projectFiltersSchema>;
export type UserFiltersData = z.infer<typeof userFiltersSchema>;
