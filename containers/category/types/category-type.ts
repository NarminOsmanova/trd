// ==================== Enums ====================
export enum CategoryScope {
  Income = 0,
  Expense = 1
}

// ==================== Types ====================
export interface ProjectCategorySet {
  language: string;
  name: string;
}

// API Response structure (flat)
export interface ApiProjectCategory {
  id: number;
  projectId: number;
  project: any | null;
  scope: number;
  isActive: boolean;
  orderNo: number | null;
  parentId: number | null;
  name: string;
  language: string;
  createdAt: string;
  updatedAt: string | null;
}

// Application structure (with sets)
export interface ProjectCategory {
  id: number;
  projectId: number;
  scope: number;
  orderNo: number;
  parentId: number;
  isActive?: boolean;
  sets: ProjectCategorySet[];
}

export interface CreateProjectCategoryRequest {
  projectId: number;
  scope: number;
  orderNo: number;
  parentId?: number;
  sets: ProjectCategorySet[];
}

export interface UpdateProjectCategoryRequest {
  id: number;
  projectId: number;
  scope: number;
  orderNo: number;
  parentId?: number;
  sets: ProjectCategorySet[];
}

export interface PaginatedProjectCategoriesResponse {
  statusCode: number;
  message: string;
  responseValue?: {
    items: ApiProjectCategory[];
    pageNumber: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export interface GetProjectCategoryByIdResponse {
  statusCode: number;
  message: string;
  responseValue?: ProjectCategory;
}

export interface ApiResponse<T = void> {
  statusCode: number;
  message: string;
  responseValue?: T;
}

