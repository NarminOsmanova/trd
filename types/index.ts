// User Types
export interface User {
  id: string;
  email?: string;
  name?: string;
  role: 'admin' | 'user' | 'partner';
  avatar?: string;
  phone: string;
  position?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Project Types
export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'paused';
  startDate: string;
  endDate?: string;
  budget: number; // Total budget (sum of all income transactions)
  totalExpenses: number; // Sum of all expense transactions
  remainingBudget: number; // budget - totalExpenses
  assignedUsers: string[]; // User IDs
  createdAt: string;
  updatedAt: string;
  createdBy: string; // Admin user ID
}

// Transaction Types
export interface Transaction {
  id: string;
  projectId: string;
  userId: string;
  type: 'income' | 'expense' | 'transfer' | 'topup' | 'refund';
  amount: number;
  category: TransactionCategory;
  description?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  // Optional extensions
  currency?: 'AZN' | 'USD' | 'EUR';
  source?: 'cash' | 'bank' | 'partner' | 'own';
  receiptUrl?: string; // data URL or URL
  fromProjectId?: string;
  toProjectId?: string;
  toUserId?: string;
  companyId?: string; // For company-related transactions
}

export type TransactionCategory = 
  | 'material'
  | 'salary'
  | 'equipment'
  | 'transport'
  | 'utilities'
  | 'rent'
  | 'marketing'
  | 'other';

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isRead: boolean;
  createdAt: string;
}

// Dashboard Analytics Types
export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalUsers: number;
  totalBudget: number;
  totalExpenses: number;
  remainingBudget: number;
  recentTransactions: Transaction[];
  projectStats: ProjectStat[];
}

export interface ProjectStat {
  projectId: string;
  projectName: string;
  budget: number;
  expenses: number;
  remaining: number;
  transactionCount: number;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  order: number;
  type: 0 | 1; // 0 -> expense, 1 -> income
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFormData {
  name: string;
  order: number;
  type: 0 | 1;
  isActive?: boolean;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
  otp?: string;
}

export interface ProjectForm {
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'paused';
  startDate: string;
  endDate?: string;
  assignedUsers: string[];
}

export interface TransactionForm {
  projectId: string;
  type: 'income' | 'expense';
  amount: number;
  category: TransactionCategory;
  description?: string;
  date: string;
}

export interface UserForm {
  email: string;
  name: string;
  role: 'admin' | 'user';
  phone?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Filter Types
export interface TransactionFilters {
  projectId?: string;
  userId?: string;
  type?: 'income' | 'expense';
  category?: TransactionCategory;
  startDate?: string;
  endDate?: string;
}

export interface ProjectFilters {
  status?: 'active' | 'completed' | 'paused';
  startDate?: string;
  endDate?: string;
}

export interface UserFilters {
  role?: 'admin' | 'user';
  isActive?: boolean;
}

// Chart Data Types
export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface ExpenseChartData {
  category: TransactionCategory;
  amount: number;
  percentage: number;
}

export interface ProjectBudgetChart {
  projectName: string;
  budget: number;
  expenses: number;
  remaining: number;
}
