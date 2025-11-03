import { z } from 'zod';

export const CategoryFormSchema = z.object({
  projectId: z.number().min(1, 'Layihə seçilməlidir'),
  scope: z.union([z.literal(0), z.literal(1)]),
  orderNo: z.preprocess(v => Number(v), z.number().min(0).max(9999)),
  parentId: z.preprocess(v => Number(v), z.number().min(0)),
  sets: z.array(z.object({
    language: z.string(),
    name: z.string().min(2, 'Ad ən az 2 simvol olmalıdır')
  })).min(1)
});

export type CategoryFormData = z.infer<typeof CategoryFormSchema>;


