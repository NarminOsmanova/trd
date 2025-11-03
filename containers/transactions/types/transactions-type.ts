// Enums
export enum OperationType {
  // ============ INCOME ============
  IncomeFromProject = 0,
  IncomeFromOwnBudget = 1,
  CompanyBalanceIncrease = 2,
  
  // ============ EXPENSE ============
  Expense = 3,
  
  // ============ TRANSFER ============
  Transfer = 4,
  
  // ============ ACCOUNT INCREASE ============
  AccountIncreaseFromProject = 5,
  AccountIncreaseFromCompany = 6,
  
  // ============ REFUND ============
  Refund = 7
}

export interface Transaction {
  id: string;
  projectId: string;
  userId: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFormData {
  projectId: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description?: string;
  date: string;
}

export interface TransactionFilters {
  searchTerm?: string;
  type?: 'income' | 'expense';
  category?: string;
  projectId?: string;
  startDate?: string;
  endDate?: string;
}

export interface TransactionStats {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  totalTransactions: number;
  monthlyTransactions: number;
}

export interface TransactionCategory {
  value: string;
  label: string;
  color: string;
}

export interface TransactionType {
  value: 'income' | 'expense';
  label: string;
  color: string;
}
