
export interface PartnerItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  sharePercentage: number;
  totalInvested: number;
  totalEarned: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerProject {
  projectId: string;
  projectName: string;
  sharePercentage: number;
  investedAmount: number;
  earnedAmount: number;
  status: 'active' | 'completed' | 'paused';
  // Additional fields for detailed view
  totalProjectExpenses?: number;
  totalProjectIncome?: number;
  partnerExpenseShare?: number;
  partnerIncomeShare?: number;
}

export interface PartnerTransaction {
  id: string;
  projectId: string;
  projectName: string;
  type: 'income' | 'expense';
  amount: number;
  currency: string;
  description?: string;
  date: string;
  shareAmount: number;
}


