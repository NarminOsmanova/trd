import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  projectCategoryService,
} from '@/lib/services/projectCategoryService';
import { ApiProjectCategory, ApiResponse, CreateProjectCategoryRequest, GetProjectCategoryByIdResponse, PaginatedProjectCategoriesResponse, ProjectCategory, UpdateProjectCategoryRequest } from '@/containers/category/types/category-type';

// ==================== Types ====================
export type ProjectCategoryFilters = {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  projectId?: number;
  isActive?: boolean;
  scope?: number;
};

// ==================== Helper Functions ====================
const transformApiCategoriesToApp = (apiCategories: ApiProjectCategory[]): ProjectCategory[] => {
  // Group by id to collect all language variants
  const grouped = apiCategories.reduce((acc, item) => {
    if (!acc[item.id]) {
      acc[item.id] = {
        id: item.id,
        projectId: item.projectId,
        scope: item.scope,
        orderNo: item.orderNo || 0,
        parentId: item.parentId || 0,
        isActive: item.isActive,
        sets: []
      };
    }
    acc[item.id].sets.push({
      language: item.language,
      name: item.name
    });
    return acc;
  }, {} as Record<number, ProjectCategory>);

  return Object.values(grouped);
};

// ==================== Main Hook ====================
export const useProjectCategories = (filters: ProjectCategoryFilters = {}) => {
  // Get paginated project categories
  const { data, isLoading, error, refetch } = useQuery<PaginatedProjectCategoriesResponse>({
    queryKey: ['project-categories', filters],
    queryFn: () => projectCategoryService.getProjectCategoriesWithPagination(
      filters.pageNumber,
      filters.pageSize,
      filters.search,
      filters.projectId,
      filters.isActive,
      filters.scope
    ),
    retry: false,
  });

  // Transform API categories to app structure
  const apiCategories = data?.responseValue?.items || [];
  const categories = transformApiCategoriesToApp(apiCategories);

  return {
    categories,
    pagination: data?.responseValue
      ? {
          pageNumber: data.responseValue.pageNumber,
          totalPages: data.responseValue.totalPages,
          pageSize: data.responseValue.pageSize,
          totalCount: data.responseValue.totalCount,
          hasPreviousPage: data.responseValue.hasPreviousPage,
          hasNextPage: data.responseValue.hasNextPage,
        }
      : null,
    isLoading,
    error,
    refetchCategories: refetch,
  };
};

// ==================== All Project Categories ====================
export const useAllProjectCategories = (
  search: string = "",
  projectId?: number,
  isActive?: boolean,
  scope?: number
) => {
  return useQuery<ApiResponse<ProjectCategory[]>>({
    queryKey: ['project-categories', 'all', search, projectId, isActive, scope],
    queryFn: () => projectCategoryService.getAllProjectCategories(search, projectId, isActive, scope),
    retry: false,
  });
};

// ==================== Project Category By ID ====================
export const useProjectCategory = (id: number | null, enabled: boolean = true) => {
  return useQuery<GetProjectCategoryByIdResponse>({
    queryKey: ['project-category', id],
    queryFn: () => projectCategoryService.getProjectCategoryById(id!),
    enabled: !!id && enabled,
    retry: false,
  });
};

// ==================== Project Categories By Project ID ====================
export const useProjectCategoriesByProjectId = (
  projectId: number | null,
  search: string = "",
  enabled: boolean = true
) => {
  const { data, isLoading, error, refetch } = useQuery<ApiResponse<ApiProjectCategory[]>>({
    queryKey: ['project-categories-by-project', projectId, search],
    queryFn: () => projectCategoryService.getProjectCategoriesByProjectId(projectId!, search),
    enabled: !!projectId && enabled,
    retry: false,
  });

  // Transform API categories to app structure
  const apiCategories = data?.responseValue || [];
  const categories = transformApiCategoriesToApp(apiCategories);

  return {
    categories,
    isLoading,
    error,
    refetch,
  };
};

// ==================== Create Project Category ====================
export const useCreateProjectCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectCategoryRequest) => 
      projectCategoryService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-categories'] });
    },
  });
};

// ==================== Update Project Category ====================
export const useUpdateProjectCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProjectCategoryRequest) => 
      projectCategoryService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-categories'] });
      queryClient.invalidateQueries({ queryKey: ['project-category'] });
    },
  });
};

// ==================== Delete Project Category ====================
export const useDeleteProjectCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => projectCategoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-categories'] });
    },
  });
};

// ==================== Change Status ====================
export const useChangeProjectCategoryStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) => 
      projectCategoryService.changeStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-categories'] });
      queryClient.invalidateQueries({ queryKey: ['project-category'] });
    },
  });
};

