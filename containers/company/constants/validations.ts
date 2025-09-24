import { z } from 'zod';

export const companyFormSchema = z.object({
  title: z.string().min(2, 'Başlıq ən az 2 simvol'),
  // Accepts data URL string from uploaded image or empty/undefined
  logoUrl: z.string().optional().or(z.literal('')),
  isActive: z.boolean().optional(),
  budgetLimit: z
    .preprocess(
      (val) => (val === '' ? undefined : Number(val)),
      z.number().min(0, 'Büdcə limiti mənfi ola bilməz').optional()
    )
    .optional(),
});

export type CompanyFormData = z.infer<typeof companyFormSchema>;


