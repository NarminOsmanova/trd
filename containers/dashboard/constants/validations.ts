import { z } from 'zod';

export const dashboardFiltersSchema = z.object({
  dateRange: z.object({
    start: z.string().optional(),
    end: z.string().optional()
  }).optional(),
  projectId: z.string().optional()
}).refine(data => {
  if (data.dateRange?.start && data.dateRange?.end) {
    return new Date(data.dateRange.end) >= new Date(data.dateRange.start);
  }
  return true;
}, {
  message: 'Bitmə tarixi başlama tarixindən əvvəl ola bilməz',
  path: ['dateRange', 'end'],
});

export type DashboardFiltersData = z.infer<typeof dashboardFiltersSchema>;
