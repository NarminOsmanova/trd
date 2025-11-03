import { ApiProjectCategory, ApiResponse, CreateProjectCategoryRequest, GetProjectCategoryByIdResponse, PaginatedProjectCategoriesResponse, ProjectCategory, UpdateProjectCategoryRequest } from '@/containers/category/types/category-type';
import { axiosInstance } from '@/lib/axios';

/**
 * Project Category Service
 * Simple and practical API service for project category management
 */
export const projectCategoryService = {
  // POST /api/web/project-category/create
  async create(data: CreateProjectCategoryRequest): Promise<ApiResponse<ProjectCategory>> {
    const response = await axiosInstance.post('/web/project-category/create', data);
    return response.data;
  },

  // GET /api/web/project-category/get-all-with-pagination
  async getProjectCategoriesWithPagination(
    pageNumber: number = 1,
    pageSize: number = 10,
    search: string = "",
    projectId?: number,
    isActive?: boolean,
    scope?: number
  ): Promise<PaginatedProjectCategoriesResponse> {
    const response = await axiosInstance.get('/web/project-category/get-all-with-pagination', {
      params: {
        PageNumber: pageNumber,
        PageSize: pageSize,
        Search: search,
        ...(projectId !== undefined && { ProjectId: projectId }),
        ...(isActive !== undefined && { IsActive: isActive }),
        ...(scope !== undefined && { Scope: scope })
      }
    });
    return response.data;
  },

  // GET /api/web/project-category/get-all
  async getAllProjectCategories(
    search: string = "",
    projectId?: number,
    isActive?: boolean,
    scope?: number
  ): Promise<ApiResponse<ProjectCategory[]>> {
    const response = await axiosInstance.get('/web/project-category/get-all', {
      params: {
        Search: search,
        ...(projectId !== undefined && { ProjectId: projectId }),
        ...(isActive !== undefined && { IsActive: isActive }),
        ...(scope !== undefined && { Scope: scope })
      }
    });
    return response.data;
  },

  // GET /api/web/project-category/get-by-id
  async getProjectCategoryById(id: number): Promise<GetProjectCategoryByIdResponse> {
    const response = await axiosInstance.get('/web/project-category/get-by-id', {
      params: {
        Id: id
      }
    });
    return response.data;
  },

  // GET /api/web/project-category/get-by-project-id
  async getProjectCategoriesByProjectId(
    projectId: number,
    search: string = ""
  ): Promise<ApiResponse<ApiProjectCategory[]>> {
    const response = await axiosInstance.get('/web/project-category/get-by-project-id', {
      params: {
        ProjectId: projectId,
        Search: search
      }
    });
    return response.data;
  },

  // PUT /api/web/project-category/update/{id}
  async update(data: UpdateProjectCategoryRequest): Promise<ApiResponse<ProjectCategory>> {
    const response = await axiosInstance.put(`/web/project-category/update/${data.id}`, data);
    return response.data;
  },

  // DELETE /api/web/project-category/delete/{id}
  async delete(id: number): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete(`/web/project-category/delete/${id}`);
    return response.data;
  },

  // PUT /api/web/project-category/change-status
  async changeStatus(id: number, isActive: boolean): Promise<ApiResponse<void>> {
    const response = await axiosInstance.put('/web/project-category/change-status', {
      id,
      isActive
    });
    return response.data;
  },
};

