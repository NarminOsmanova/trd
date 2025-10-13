import { z } from 'zod';

export const partnerFormSchema = z.object({
  name: z.string().min(1, 'Ad tələb olunur'),
  email: z.string().email('Düzgün email ünvanı daxil edin'),
  phone: z.string().optional(),
  sharePercentage: z.number().min(0).max(100, 'Hissə faizi 0-100 arasında olmalıdır'),
  isActive: z.boolean().default(true)
});

export type PartnerFormData = z.infer<typeof partnerFormSchema>;


