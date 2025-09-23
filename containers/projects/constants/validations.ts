import { z } from 'zod';

export const projectFormSchema = z.object({
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
  targetBudget: z
    .preprocess((v) => (v === '' || v === undefined || v === null ? undefined : Number(v)), z.number().positive('Müsbət rəqəm olmalıdır').optional()),
  monthlyBudget: z
    .preprocess((v) => (v === '' || v === undefined || v === null ? undefined : Number(v)), z.number().positive('Müsbət rəqəm olmalıdır').optional()),
  assignedUsers: z
    .array(z.string())
    .min(1, 'Ən azı bir menecer seçin')
});

export const projectFiltersSchema = z.object({
  status: z.enum(['active', 'completed', 'paused']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  assignedUsers: z.array(z.string()).optional()
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;
export type ProjectFiltersData = z.infer<typeof projectFiltersSchema>;
