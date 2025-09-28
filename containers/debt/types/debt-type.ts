export interface Payment {
  id: string;
  amount: number;
  paymentDate: string;
  description?: string;
  createdBy: string;
}

export interface Debt {
  id: string;
  amount: number;
  currency: 'AZN' | 'USD' | 'EUR';
  debtor: string; // Kimə verildiyi
  description?: string;
  dueDate: string; // Vaxt
  status: 'active' | 'paid' | 'overdue';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  payments?: Payment[]; // Hissə-hissə ödənişlər
}

export interface DebtFormData {
  amount: number;
  currency: 'AZN' | 'USD' | 'EUR';
  debtor: string;
  description?: string;
  dueDate: string;
}

export interface DebtFilters {
  search: string;
  status: 'all' | 'active' | 'paid' | 'overdue';
  currency: 'all' | 'AZN' | 'USD' | 'EUR';
}
