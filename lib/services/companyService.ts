import { 
  CreateCompanyRequest, 
  GetCompanyByIdResponse, 
  PaginatedCompaniesResponse, 
  Company, 
  UpdateCompanyRequest,
  ApiResponse 
} from '@/containers/company/types/company-type';
import { axiosInstance } from '@/lib/axios';

/**
 * Company Service
 * Handles company CRUD operations with multipart/form-data support
 */
export const companyService = {
  // POST /api/web/company/create
  async create(data: CreateCompanyRequest): Promise<ApiResponse<Company>> {
    const formData = new FormData();
    
    if (data.logo instanceof File) {
      formData.append('Logo', data.logo);
    }
    formData.append('Title', data.title);
    if (data.budgetLimit) {
      formData.append('BudgetLimit', data.budgetLimit.toString());
    }
    formData.append('CurrentBalance', data.currentBalance.toString());
    formData.append('Currency', data.currency.toString());

    const response = await axiosInstance.post('/web/company/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // GET /api/web/company/get-all-with-pagination
  async getCompaniesWithPagination(
    pageNumber: number = 1,
    pageSize: number = 10,
    search: string = ""
  ): Promise<PaginatedCompaniesResponse> {
    const response = await axiosInstance.get('/web/company/get-all-with-pagination', {
      params: {
        PageNumber: pageNumber,
        PageSize: pageSize,
        Search: search
      }
    });
    return response.data;
  },

  // GET /api/web/company/get-all
  async getAllCompanies(search: string = ""): Promise<ApiResponse<Company[]>> {
    const response = await axiosInstance.get('/web/company/get-all', {
      params: {
        Search: search
      }
    });
    return response.data;
  },

  // GET /api/web/company/get-by-id
  async getCompanyById(id: number): Promise<GetCompanyByIdResponse> {
    const response = await axiosInstance.get('/web/company/get-by-id', {
      params: {
        Id: id
      }
    });
    return response.data;
  },

  // PUT /api/web/company/update
  async update(data: UpdateCompanyRequest): Promise<ApiResponse<Company>> {
    const formData = new FormData();
    
    formData.append('Id', data.id.toString());
    if (data.logo instanceof File) {
      formData.append('Logo', data.logo);
    }
    formData.append('Title', data.title);
    if (data.budgetLimit) {
      formData.append('BudgetLimit', data.budgetLimit.toString());
    }
    formData.append('CurrentBalance', data.currentBalance.toString());
    formData.append('Currency', data.currency.toString());

    const response = await axiosInstance.put('/web/company/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // DELETE /api/web/company/delete/{id}
  async delete(id: number): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete(`/web/company/delete/${id}`);
    return response.data;
  },
};

