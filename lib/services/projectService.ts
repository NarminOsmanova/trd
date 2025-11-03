import { 
  CreateProjectRequest, 
  GetProjectByIdResponse, 
  PaginatedProjectsResponse, 
  UpdateProjectRequest,
  ApiResponse,
  ApiProject
} from '@/containers/projects/types/projects-type';
import { axiosInstance } from '@/lib/axios';


/**
 * Project Service
 * Simple and practical API service for project management
 */
export const projectService = {
  // POST /api/web/project/create
  async create(data: CreateProjectRequest): Promise<ApiResponse<ApiProject>> {
    const response = await axiosInstance.post('/web/project/create', data);
    return response.data;
  },

  // GET /api/web/project/get-all-with-pagination
  async getProjectsWithPagination(
    pageNumber: number = 1,
    pageSize: number = 10,
    search: string = "",
    status?: number
  ): Promise<PaginatedProjectsResponse> {
    const response = await axiosInstance.get('/web/project/get-all-with-pagination', {
      params: {
        PageNumber: pageNumber,
        PageSize: pageSize,
        Search: search,
        ...(status !== undefined && { Status: status })
      }
    });
    return response.data;
  },

  // GET /api/web/project/get-all
  async getAllProjects(search: string = ""): Promise<ApiResponse<ApiProject[]>> {
    const response = await axiosInstance.get('/web/project/get-all', {
      params: {
        Search: search
      }
    });
    return response.data;
  },

  // GET /api/web/project/get-by-id
  async getProjectById(id: number): Promise<GetProjectByIdResponse> {
    const response = await axiosInstance.get('/web/project/get-by-id', {
      params: {
        Id: id
      }
    });
    return response.data;
  },

  // PUT /api/web/project/update
  async update(data: UpdateProjectRequest): Promise<ApiResponse<ApiProject>> {
    const response = await axiosInstance.put('/web/project/update', data);
    return response.data;
  },

  // DELETE /api/web/project/delete/{id}
  async delete(id: number): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete(`/web/project/delete/${id}`);
    return response.data;
  },
};

