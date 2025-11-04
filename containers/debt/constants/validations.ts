import { z } from 'zod';

export const debtFormSchema = z.object({
  debtorName: z.string().min(1, 'Borclu adı daxil edilməlidir').max(100, 'Borclu adı çox uzundur'),
  debtorId: z.number().optional().nullable(),
  amount: z.preprocess(
    (val) => (val === '' ? 0 : Number(val)),
    z.number().min(0.01, 'Məbləğ 0-dan böyük olmalıdır').max(1000000, 'Məbləğ çox böyükdür')
  ),
  currency: z.enum(['0', '1', '2'], { required_error: 'Valyuta seçilməlidir' }),
  dueDate: z.string().min(1, 'Müddət tarixi seçilməlidir'),
  description: z.string().max(500, 'Təsvir 500 simvoldan çox ola bilməz').optional(),
  isNewDebtor: z.boolean().default(true),
});

export type DebtFormData = z.infer<typeof debtFormSchema>;

// Debt Payment Form Schema
export const debtPaymentFormSchema = z.object({
  amount: z.preprocess(
    (val) => (val === '' ? 0 : Number(val)),
    z.number().min(0.01, 'Məbləğ 0-dan böyük olmalıdır').max(1000000, 'Məbləğ çox böyükdür')
  ),
  paymentDate: z.string().min(1, 'Ödəniş tarixi seçilməlidir'),
  note: z.string().max(500, 'Qeyd 500 simvoldan çox ola bilməz').optional(),
});

export type DebtPaymentFormData = z.infer<typeof debtPaymentFormSchema>;
