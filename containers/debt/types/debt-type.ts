
// ==================== Types ====================
export interface ApiDebt {
  id: number;
  debtorName: string;
  amount: number;
  currency: number; // 0=AZN, 1=USD, 2=EUR
  dueDate: string;
  description: string | null;
  status: number; // 0=active, 1=paid, 2=overdue
  createdDate: string;
}

export interface DebtStatistics {
  totalDebts: number;
  activeDebts: number;
  paidDebts: number;
  overdueDebts: number;
  totalAmount: number;
  activeAmount: number;
}

export interface CreateDebtRequest {
  debtorName: string;
  debtorId?: number;
  amount: number;
  currency: number;
  dueDate: string;
  description: string;
  isNewDebtor: boolean;
}

export interface UpdateDebtRequest {
  id: number;
  debtorName: string;
  debtorId?: number;
  amount: number;
  currency: number;
  dueDate: string;
  description: string;
  isNewDebtor: boolean;
}

export interface PaginatedDebtsResponse {
  statusCode: number;
  message: string;
  responseValue?: {
    statistics: DebtStatistics;
    debts: {
      items: ApiDebt[];
      pageNumber: number;
      totalPages: number;
      pageSize: number;
      totalCount: number;
      hasPreviousPage: boolean;
      hasNextPage: boolean;
    };
  };
}

export interface PaymentDetail {
  id: number;
  amount: number;
  currency: number;
  paymentDate: string;
  note: string;
}

export interface DebtDetail {
  id: number;
  debtorName: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  currency: number;
  dueDate: string;
  createdDate: string;
  createdBy: string;
  description: string;
  status: number;
  paymentProgressPercentage: number;
  remainingDays: number;
  payments: PaymentDetail[];
}

export interface GetDebtByIdResponse {
  statusCode: number;
  message: string;
  responseValue?: DebtDetail;
}

export interface ApiResponse<T = void> {
  statusCode: number;
  message: string;
  responseValue?: T;
}

// ==================== Debtor Types ====================
export interface Debtor {
  id: number;
  name: string;
  riskStatus: number; // 0=Low Risk, 1=Medium Risk, 2=High Risk
}

export interface SearchDebtorsResponse {
  statusCode: number;
  message: string;
  responseValue?: Debtor[];
}
