import { z } from 'zod';

export const positionSetSchema = z.object({
  name: z
    .string()
    .min(1, 'Ad tələb olunur')
    .min(2, 'Ad ən azı 2 simvol olmalıdır')
    .max(100, 'Ad 100 simvoldan çox ola bilməz'),
  language: z
    .string()
    .min(1, 'Dil tələb olunur')
    .refine((val) => ['az', 'en', 'ru'].includes(val), 'Dil az, en və ya ru olmalıdır')
});

export const positionFormSchema = z.object({
  positionSets: z
    .array(positionSetSchema)
    .min(1, 'Ən azı bir dil üçün ad tələb olunur'),
});

// Form input schema for individual language fields
export const positionInputSchema = z.object({
  name_az: z
    .string()
    .min(1, 'nameRequired')
    .min(2, 'nameMinLength')
    .max(100, 'nameMaxLength'),
  name_en: z
    .string()
    .min(1, 'nameRequired')
    .min(2, 'nameMinLength')
    .max(100, 'nameMaxLength'),
  name_ru: z
    .string()
    .min(1, 'nameRequired')
    .min(2, 'nameMinLength')
    .max(100, 'nameMaxLength'),
});

export const positionFiltersSchema = z.object({
  search: z.string().optional(),
});

export type PositionFormData = z.infer<typeof positionFormSchema>;
export type PositionInputData = z.infer<typeof positionInputSchema>;
export type PositionFiltersData = z.infer<typeof positionFiltersSchema>;

