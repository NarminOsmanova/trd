export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  position?: string;
  role: 'admin' | 'user' | 'partner';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
}

export interface UserFormData {
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'user';
  isActive: boolean;
}

export interface UserFilters {
  searchTerm?: string;
  role?: 'admin' | 'user';
  status?: 'active' | 'inactive';
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  adminUsers: number;
  regularUsers: number;
}

export interface UserTransactionStats {
  userId: string;
  totalTransactions: number;
  totalAmount: number;
  lastTransactionDate?: string;
}
