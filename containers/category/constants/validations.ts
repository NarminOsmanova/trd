import { z } from 'zod';

export const categoryFormSchema = z.object({
  name: z.string().min(2, 'Ad ən az 2 simvol'),
  order: z.preprocess(v => Number(v), z.number().min(0).max(9999)),
  type: z.union([z.literal(0), z.literal(1)]),
  isActive: z.boolean().optional()
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;


