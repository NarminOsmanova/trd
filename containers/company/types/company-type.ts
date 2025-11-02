// ==================== Types ====================
export interface Company {
  id: number;
  title: string;
  logo?: string;
  budgetLimit?: number;
  currentBalance: number;
  currency: number; // Currency as enum: 0=AZN, 1=USD, 2=EUR
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyRequest {
  logo?: File | string;
  title: string;
  budgetLimit?: number;
  currentBalance: number;
  currency: number;
}

export interface UpdateCompanyRequest {
  id: number;
  logo?: File | string;
  title: string;
  budgetLimit?: number;
  currentBalance: number;
  currency: number;
}

export interface PaginatedCompaniesResponse {
  statusCode: number;
  message: string;
  responseValue?: {
    items: Company[];
    pageNumber: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export interface GetCompanyByIdResponse {
  statusCode: number;
  message: string;
  responseValue?: Company;
}

export interface ApiResponse<T = void> {
  statusCode: number;
  message: string;
  responseValue?: T;
}

// Legacy types for backward compatibility
export interface CompanyItem extends Company {
  logoUrl?: string;
}

export interface CompanyFormData {
  title: string;
  logoUrl?: string;
  isActive?: boolean;
  budgetLimit?: number;
}

