import { z } from 'zod';

export const debtFormSchema = z.object({
  amount: z.number().min(0.01, 'Məbləğ 0-dan böyük olmalıdır').max(1000000, 'Məbləğ çox böyükdür'),
  currency: z.enum(['AZN', 'USD', 'EUR'], { required_error: 'Valyuta seçilməlidir' }),
  debtor: z.string().min(1, 'Borclu adı daxil edilməlidir').max(100, 'Borclu adı çox uzundur'),
  description: z.string().max(500, 'Təsvir 500 simvoldan çox ola bilməz').optional(),
  dueDate: z.string().min(1, 'Müddət tarixi seçilməlidir'),
});

export type DebtFormData = z.infer<typeof debtFormSchema>;
