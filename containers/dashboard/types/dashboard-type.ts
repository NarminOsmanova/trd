export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalUsers: number;
  totalBudget: number;
  totalExpenses: number;
  remainingBudget: number;
}

export interface StatCard {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  bgColor: string;
  textColor: string;
}

export interface RecentTransaction {
  id: string;
  projectId: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  date: string;
  description?: string;
}

export interface ProjectBudgetStats {
  projectId: string;
  projectName: string;
  budget: number;
  expenses: number;
  remaining: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentTransactions: RecentTransaction[];
  projectStats: ProjectBudgetStats[];
}

export interface DashboardFilters {
  dateRange?: {
    start: string;
    end: string;
  };
  projectId?: string;
}
