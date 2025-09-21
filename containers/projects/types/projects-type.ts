export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'paused';
  startDate: string;
  endDate?: string;
  budget: number;
  totalExpenses: number;
  remainingBudget: number;
  assignedUsers: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface ProjectFormData {
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'paused';
  startDate: string;
  endDate?: string;
  assignedUsers: string[];
}

export interface ProjectFilters {
  status?: 'active' | 'completed' | 'paused';
  startDate?: string;
  endDate?: string;
  assignedUsers?: string[];
}

export interface ProjectStats {
  total: number;
  active: number;
  completed: number;
  paused: number;
  totalBudget: number;
  totalExpenses: number;
  remainingBudget: number;
}
