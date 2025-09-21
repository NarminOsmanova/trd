import { z } from 'zod';

export const notificationFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Başlıq tələb olunur')
    .min(3, 'Başlıq ən azı 3 simvol olmalıdır')
    .max(100, 'Başlıq 100 simvoldan çox ola bilməz'),
  message: z
    .string()
    .min(1, 'Mesaj tələb olunur')
    .min(10, 'Mesaj ən azı 10 simvol olmalıdır')
    .max(500, 'Mesaj 500 simvoldan çox ola bilməz'),
  type: z
    .enum(['info', 'warning', 'success', 'error'], {
      required_error: 'Bildiriş növünü seçin'
    }),
  userId: z
    .string()
    .min(1, 'İstifadəçi seçin')
});

export const notificationFiltersSchema = z.object({
  type: z.enum(['info', 'warning', 'success', 'error']).optional(),
  isRead: z.boolean().optional(),
  userId: z.string().optional()
});

export type NotificationFormData = z.infer<typeof notificationFormSchema>;
export type NotificationFiltersData = z.infer<typeof notificationFiltersSchema>;
