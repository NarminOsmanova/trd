import { z } from 'zod';

export const companyFormSchema = z.object({
  title: z.string().min(2, 'Başlıq ən az 2 simvol'),
  logo: z.instanceof(File).optional(),
  currentBalance: z.preprocess(
    (val) => (val === '' ? 0 : Number(val)),
    z.number().min(0, 'Cari balans mənfi ola bilməz')
  ),
  currency: z.enum(['0', '1', '2'], { required_error: 'Valyuta seçin' }),
  budgetLimit: z
    .preprocess(
      (val) => (val === '' ? undefined : Number(val)),
      z.number().min(0, 'Büdcə limiti mənfi ola bilməz').optional()
    )
    .optional(),
});

export type CompanyFormData = z.infer<typeof companyFormSchema>;


