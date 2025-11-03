import { ApiDebt, CreateDebtRequest, GetDebtByIdResponse, PaginatedDebtsResponse, UpdateDebtRequest, SearchDebtorsResponse } from '@/containers/debt/types/debt-type';
import { ApiResponse } from '@/containers/users/types/users-type';
import { axiosInstance } from '@/lib/axios';


/**
 * Debt Service
 * API service for debt management
 */
export const debtService = {
  // POST /api/web/debt/create
  async create(data: CreateDebtRequest): Promise<ApiResponse<ApiDebt>> {
    const response = await axiosInstance.post('/web/debt/create', data);
    return response.data;
  },

  // GET /api/web/debt/get-all-with-pagination
  async getDebtsWithPagination(
    pageNumber: number = 1,
    pageSize: number = 10,
    search: string = "",
    status?: number,
    month?: number,
    year?: number
  ): Promise<PaginatedDebtsResponse> {
    const response = await axiosInstance.get('/web/debt/get-all-with-pagination', {
      params: {
        PageNumber: pageNumber,
        PageSize: pageSize,
        Search: search,
        ...(status !== undefined && { Status: status }),
        ...(month !== undefined && { Month: month }),
        ...(year !== undefined && { Year: year })
      }
    });
    return response.data;
  },



  // GET /api/web/debt/get-all
  async getAllDebts(search: string = "", status?: number): Promise<ApiResponse<ApiDebt[]>> {
    const response = await axiosInstance.get('/web/debt/get-all', {
      params: {
        Search: search,
        ...(status !== undefined && { Status: status })
      }
    });
    return response.data;
  },

  // GET /api/web/debt/get-by-id
  async getDebtById(debtId: number): Promise<GetDebtByIdResponse> {
    const response = await axiosInstance.get('/web/debt/get-by-id', {
      params: {
        DebtId: debtId
      }
    });
    return response.data;
  },

  // PUT /api/web/debt/update
  async update(data: UpdateDebtRequest): Promise<ApiResponse<ApiDebt>> {
    const response = await axiosInstance.put('/web/debt/update', data);
    return response.data;
  },

  // DELETE /api/web/debt/delete/{id}
  async delete(id: number): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete(`/web/debt/delete/${id}`);
    return response.data;
  },

  // GET /api/web/debtor/search - Search for debtor people
  async searchDebtors(searchTerm: string = ""): Promise<SearchDebtorsResponse> {
    const response = await axiosInstance.get('/web/debt/search', {
      params: { SearchTerm: searchTerm }
    });
    return response.data;
  },
};

