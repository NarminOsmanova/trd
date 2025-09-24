export interface CompanyItem {
  id: string;
  title: string;
  logoUrl?: string;
  isActive: boolean;
  budgetLimit?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyFormData {
  title: string;
  logoUrl?: string;
  isActive?: boolean;
  budgetLimit?: number;
}


