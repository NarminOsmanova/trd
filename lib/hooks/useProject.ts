import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '@/lib/services/projectService';
import { 
  CreateProjectRequest, 
  GetProjectByIdResponse, 
  PaginatedProjectsResponse, 
  UpdateProjectRequest,
  ApiResponse,
  ApiProject,
  ProjectStatus
} from '@/containers/projects/types/projects-type';
import { useEffect, useState } from 'react';


// ==================== Types ====================
export type ProjectFilters = {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  status?: ProjectStatus;
};

// ==================== Main Hook ====================
export const useProjects = (filters: ProjectFilters = {}) => {
  const queryClient = useQueryClient();
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search || '');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search || '');
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timer);
  }, [filters.search]);

  // Get paginated projects with debounced search
  const { data, isLoading, error, refetch } = useQuery<PaginatedProjectsResponse>({
    queryKey: ['projects', { 
      ...filters, 
      search: debouncedSearch // Use debounced search in query key
    }],
    queryFn: () => projectService.getProjectsWithPagination(
      filters.pageNumber,
      filters.pageSize,
      debouncedSearch, // Use debounced search in API call
      filters.status
    ),
    retry: false,
  });

  // Delete project
  const deleteProjectMutation = useMutation({
    mutationFn: (id: number) => projectService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const projects = data?.responseValue?.projects?.items || [];
  const statistics = data?.responseValue?.statistics;

  return {
    projects,
    statistics,
    pagination: data?.responseValue?.projects
      ? {
          pageNumber: data.responseValue.projects.pageNumber,
          totalPages: data.responseValue.projects.totalPages,
          pageSize: data.responseValue.projects.pageSize,
          totalCount: data.responseValue.projects.totalCount,
          hasPreviousPage: data.responseValue.projects.hasPreviousPage,
          hasNextPage: data.responseValue.projects.hasNextPage,
        }
      : null,
    isLoading,
    error,
    refetchProjects: refetch,
    deleteProject: deleteProjectMutation.mutate,
    isDeleting: deleteProjectMutation.isPending,
  };
};

// ==================== All Projects ====================
export const useAllProjects = (search: string = "") => {
  return useQuery<ApiResponse<ApiProject[]>>({
    queryKey: ['projects', 'all', search],
    queryFn: () => projectService.getAllProjects(search),
    retry: false,
  });
};

// ==================== Project By ID ====================
export const useProject = (id: number | null, enabled: boolean = true) => {
  return useQuery<GetProjectByIdResponse>({
    queryKey: ['project', id],
    queryFn: () => projectService.getProjectById(id!),
    enabled: !!id && enabled,
    retry: false,
  });
};

// ==================== Create Project ====================
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectRequest) => 
      projectService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

// ==================== Update Project ====================
export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProjectRequest) => 
      projectService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project'] });
    },
  });
};

// ==================== Delete Project ====================
export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => projectService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

