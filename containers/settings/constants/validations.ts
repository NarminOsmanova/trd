import { z } from 'zod';

export const profileFormSchema = z.object({
  email: z
    .string()
    .email('Düzgün email formatı daxil edin'),
  phone: z
    .string()
    .min(1, 'Telefon nömrəsi tələb olunur')
    .refine((val) => {
      return /^(\+?994|0)?(50|51|55|70|77|99)[0-9]{7}$/.test(val);
    }, 'Düzgün telefon nömrəsi formatı daxil edin'),
  positionId: z
    .number()
    .min(1, 'Vəzifə seçilməlidir'),
  sets: z.array(z.object({
    language: z.enum(['az', 'en', 'ru']),
    firstName: z
      .string()
      .min(1, 'Ad tələb olunur')
      .min(2, 'Ad ən azı 2 simvol olmalıdır')
      .max(50, 'Ad 50 simvoldan çox ola bilməz'),
    lastName: z
      .string()
      .min(1, 'Soyad tələb olunur')
      .min(2, 'Soyad ən azı 2 simvol olmalıdır')
      .max(50, 'Soyad 50 simvoldan çox ola bilməz'),
  })).min(1, 'Ən azı bir dil üçün məlumat tələb olunur')
});

export const passwordFormSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Cari şifrə tələb olunur'),
  newPassword: z
    .string()
    .min(8, 'Şifrə ən azı 8 simvol olmalıdır')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._])[A-Za-z\d@$!%*?&._]/, 
      'Şifrə ən azı bir böyük hərf, bir kiçik hərf, bir rəqəm və bir xüsusi simvol (._@$!%*?&) olmalıdır'),
  confirmPassword: z
    .string()
    .min(1, 'Şifrə təsdiqi tələb olunur')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Yeni şifrə və təsdiq şifrəsi eyni olmalıdır",
  path: ["confirmPassword"],
});

export const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  budgetWarnings: z.boolean(),
  weeklyReports: z.boolean()
});

export const userPreferencesSchema = z.object({
  language: z.enum(['az', 'en', 'ru']),
  timezone: z.string().min(1, 'Vaxt qurşağı tələb olunur'),
  dateFormat: z.enum(['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']),
  currency: z.enum(['AZN', 'USD', 'EUR'])
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;
export type PasswordFormData = z.infer<typeof passwordFormSchema>;
export type NotificationSettingsData = z.infer<typeof notificationSettingsSchema>;
export type UserPreferencesData = z.infer<typeof userPreferencesSchema>;
