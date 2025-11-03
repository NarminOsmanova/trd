// ==================== Enums ====================
export enum ProjectStatus {
  Draft = 0,
  Active = 1,
  Completed = 2,
  Paused = 3,
}

export enum ProjectMemberType {
  User = 0,
  Partner = 1,
}

// ==================== API Types ====================
export interface ApiProjectMember {
  id: number;
  userId: number;
  userFullName: string;
}

export interface ApiProject {
  id: number;
  name?: string;
  description?: string;
  startDate?: string;
  endDatePlanned?: string;
  plannedCapital?: number;
  status: ProjectStatus;
  totalExpenses?: number;
  remainingBudget?: number;
  progressPercentage?: number;
  members?: ApiProjectMember[];
  createdAt?: string;
  updatedAt?: string;
}

// ==================== Request Types ====================
export interface CreateProjectRequest {
  name: string;
  description: string;
  startDate: string;
  endDatePlanned: string;
  plannedCapital: number;
  status: ProjectStatus;
  members: {
    userId: number;
  }[];
}

export interface UpdateProjectRequest {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDatePlanned: string;
  plannedCapital: number;
  status: ProjectStatus;
  members: {
    userId: number;
  }[];
}

// ==================== Response Types ====================
export interface ProjectStatistics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalBudget: number;
  totalExpenses: number;
  totalRemainingBudget: number;
  currency: string;
}

export interface PaginatedProjectsResponse {
  statusCode: number;
  message: string;
  responseValue?: {
    projects: {
      items: ApiProject[];
      pageNumber: number;
      totalPages: number;
      pageSize: number;
      totalCount: number;
      hasPreviousPage: boolean;
      hasNextPage: boolean;
    };
    statistics: ProjectStatistics;
  };
}

// GET /api/web/project/get-by-id detailed response
export interface ProjectFinancialSummary {
  plannedCapital: number;
  totalIncome: number;
  totalExpenses: number;
  currentBalance: number;
  remainingBudget: number;
  currency: string;
}

export interface ProjectTeamMember {
  id: number;
  name: string;
  surname: string;
  fullName: string;
  position: string;
  email: string;
  phone: string;
}

export interface ProjectTransaction {
  id: number;
  date: string;
  type: number;
  description: string;
  category: string;
  userName: string;
  amount: number;
  amountDisplay: string;
  currency: number;
  projectBalance: number;
}

export interface ApiProjectDetail {
  id: number;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  endDatePlanned: string;
  endDateActual?: string;
  createdAt: string;
  updatedAt: string;
  financialSummary: ProjectFinancialSummary;
  teamMembers: ProjectTeamMember[];
  recentTransactions: ProjectTransaction[];
}

export interface GetProjectByIdResponse {
  statusCode: number;
  message: string;
  responseValue?: ApiProjectDetail;
}

export interface ApiResponse<T = any> {
  statusCode: number;
  message: string;
  data?: T;
}

// ==================== Application Types ====================
export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'paused' | 'draft';
  startDate: string;
  endDate?: string;
  budget: number;
  totalExpenses: number;
  remainingBudget: number;
  progressPercentage?: number;
  assignedUsers: string[];
  members?: ApiProjectMember[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface ProjectFormData {
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'paused' | 'draft';
  startDate: string;
  endDate?: string;
  assignedUsers?: string[];
  targetBudget?: number;
  monthlyBudget?: number;
}

export interface ProjectFilters {
  status?: 'active' | 'completed' | 'paused' | 'draft';
  startDate?: string;
  endDate?: string;
  assignedUsers?: string[];
}

export interface ProjectStats {
  total: number;
  active: number;
  completed: number;
  paused: number;
  draft: number;
  totalBudget: number;
  totalExpenses: number;
  remainingBudget: number;
}
