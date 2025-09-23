export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  projectId?: string;
  reportType?: 'overview' | 'byProject' | 'byUser' | 'byType';
  userId?: string;
  type?: 'income' | 'expense' | 'transfer' | 'topup';
}

export interface ReportStats {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  totalTransactions: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

export interface ProjectBreakdown {
  projectName: string;
  income: number;
  expense: number;
  netBalance: number;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expense: number;
  netBalance: number;
}

export interface ReportData {
  stats: ReportStats;
  categoryBreakdown: CategoryBreakdown[];
  projectBreakdown: ProjectBreakdown[];
  monthlyTrend: MonthlyTrend[];
  transactions: any[];
}

export interface ExportOptions {
  format: 'pdf' | 'csv' | 'excel';
  includeCharts: boolean;
  dateRange: {
    start: string;
    end: string;
  };
}
