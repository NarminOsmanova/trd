import { z } from 'zod';

export const userFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Ad tələb olunur')
    .min(2, 'Ad ən azı 2 simvol olmalıdır')
    .max(50, 'Ad 50 simvoldan çox ola bilməz'),
  email: z
    .string()
    .email('Düzgün email formatı daxil edin')
    .min(1, 'Email tələb olunur'),
  phone: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      return /^(\+994|0)?(50|51|55|70|77|99)[0-9]{7}$/.test(val);
    }, 'Düzgün telefon nömrəsi formatı daxil edin'),
  role: z
    .enum(['admin', 'user'], {
      required_error: 'Rol seçin'
    }),
  isActive: z
    .boolean()
    .default(true)
});

export const userFiltersSchema = z.object({
  searchTerm: z.string().optional(),
  role: z.enum(['admin', 'user']).optional(),
  status: z.enum(['active', 'inactive']).optional()
});

export type UserFormData = z.infer<typeof userFormSchema>;
export type UserFiltersData = z.infer<typeof userFiltersSchema>;
