import { z } from 'zod';

export const reportFiltersSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  projectId: z.string().optional(),
  reportType: z.enum(['overview', 'detailed', 'comparison']).optional(),
  userId: z.string().optional()
});

export const exportOptionsSchema = z.object({
  format: z.enum(['pdf', 'csv', 'excel']),
  includeCharts: z.boolean().default(true),
  dateRange: z.object({
    start: z.string().min(1, 'Başlama tarixi tələb olunur'),
    end: z.string().min(1, 'Bitmə tarixi tələb olunur')
  })
});

export type ReportFiltersData = z.infer<typeof reportFiltersSchema>;
export type ExportOptionsData = z.infer<typeof exportOptionsSchema>;
