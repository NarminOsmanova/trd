export interface CompanyItem {
  id: string;
  title: string;
  logoUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyFormData {
  title: string;
  logoUrl?: string;
  isActive?: boolean;
}


