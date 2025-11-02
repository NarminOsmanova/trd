import { CreatePositionRequest, GetPositionByIdResponse, PaginatedPositionsResponse, Position, UpdatePositionRequest } from '@/containers/position/types/position-type';
import { ApiResponse } from '@/containers/users/types/users-type';
import { axiosInstance } from '@/lib/axios';


/**
 * Position Service
 * Simple and practical API service
 */
export const positionService = {
  // POST /api/web/position/create
  async create(data: CreatePositionRequest): Promise<ApiResponse<Position>> {
    const response = await axiosInstance.post('/web/position/create', data);
    return response.data;
  },

  // GET /api/web/position/get-all-with-pagination
  async getPositionsWithPagination(
    pageNumber: number = 1,
    pageSize: number = 10,
    search: string = ""
  ): Promise<PaginatedPositionsResponse> {
    const response = await axiosInstance.get('/web/position/get-all-with-pagination', {
      params: {
        PageNumber: pageNumber,
        PageSize: pageSize,
        Search: search
      }
    });
    return response.data;
  },

  // GET /api/web/position/get-all
  async getAllPositions(search: string = ""): Promise<ApiResponse<Position[]>> {
    const response = await axiosInstance.get('/web/position/get-all', {
      params: {
        Search: search
      }
    });
    return response.data;
  },

  // GET /api/web/position/get-by-id
  async getPositionById(id: number): Promise<GetPositionByIdResponse> {
    const response = await axiosInstance.get('/web/position/get-by-id', {
      params: {
        Id: id
      }
    });
    return response.data;
  },

  // PUT /api/web/position/update
  async update(data: UpdatePositionRequest): Promise<ApiResponse<Position>> {
    const response = await axiosInstance.put('/web/position/update', data);
    return response.data;
  },

  // DELETE /api/web/position/delete/{id}
  async delete(id: number): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete(`/web/position/delete/${id}`);
    return response.data;
  },
};

