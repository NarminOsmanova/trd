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


// ==================== Types ====================

export interface ApiOperation {
  id: number;
  type: number;
  amount: number;
  currency: number;
  date: string;
  note?: string;
  receipt?: string;
  status: number;
  projectId?: number;
  projectCategoryId?: number;
  companyId?: number;
  toUserId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOperationRequest {
  type: number;
  amount: number;
  currency: number;
  date: string;
  note?: string;
  receipt?: File | string;
  projectId?: number;
  projectCategoryId?: number;
  companyId?: number;
  toUserId?: number;
}

export interface UpdateOperationRequest {
  id: number;
  type: number;
  amount: number;
  currency: number;
  date: string;
  note?: string;
  receipt?: File | string;
  status: number;
  projectId?: number;
  projectCategoryId?: number;
  companyId?: number;
  toUserId?: number;
}

export interface ChangeStatusRequest {
  id: number;
  status: number;
  reason?: string;
}

export interface OperationFilters {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  fromDate?: string;
  toDate?: string;
  projectId?: number;
  categoryId?: number;
  companyId?: number;
  type?: number;
  status?: number;
  isApproved?: boolean;
}

export interface PaginatedOperationsResponse {
  statusCode: number;
  message: string;
  responseValue: {
    items: ApiOperation[];
    pageNumber: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export interface GetOperationByIdResponse {
  statusCode: number;
  message: string;
  responseValue: ApiOperation;
}
