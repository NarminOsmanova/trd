import { axiosInstance } from '@/lib/axios';
import { ApiResponse } from '@/containers/users/types/users-type';
import { ApiOperation, ChangeStatusRequest, CreateOperationRequest, GetOperationByIdResponse, OperationFilters, PaginatedOperationsResponse, UpdateOperationRequest } from '@/containers/transactions/types/transactions-type';

// ==================== Service ====================

/**
 * Operation Service
 * API service for operation management
 */
export const operationService = {
  // GET /api/web/operation/get-all-with-pagination
  async getOperationsWithPagination(
    filters: OperationFilters = {}
  ): Promise<PaginatedOperationsResponse> {
    const params: Record<string, unknown> = {
      PageNumber: filters.pageNumber ?? 1,
      PageSize: filters.pageSize ?? 10,
      Search: filters.search ?? '',
    };

    if (filters.fromDate) params.FromDate = filters.fromDate;
    if (filters.toDate) params.ToDate = filters.toDate;
    if (filters.projectId !== undefined) params.ProjectId = filters.projectId;
    if (filters.categoryId !== undefined) params.CategoryId = filters.categoryId;
    if (filters.companyId !== undefined) params.CompanyId = filters.companyId;
    if (filters.type !== undefined) params.Type = filters.type;
    if (filters.status !== undefined) params.Status = filters.status;
    if (filters.isApproved !== undefined) params.IsApproved = filters.isApproved;

    const response = await axiosInstance.get('/web/operation/get-all-with-pagination', {
      params,
    });
    return response.data;
  },

  // GET /api/web/operation/get-by-id
  async getOperationById(id: number): Promise<GetOperationByIdResponse> {
    const response = await axiosInstance.get('/web/operation/get-by-id', {
      params: {
        Id: id,
      },
    });
    return response.data;
  },

  // POST /api/web/operation/create
  async create(data: CreateOperationRequest): Promise<ApiResponse<ApiOperation>> {
    const formData = new FormData();
    
    formData.append('Type', data.type.toString());
    formData.append('Amount', data.amount.toString());
    formData.append('Currency', data.currency.toString());
    formData.append('Date', data.date);
    
    if (data.note) formData.append('Note', data.note);
    if (data.receipt) {
      if (data.receipt instanceof File) {
        formData.append('Receipt', data.receipt);
      } else {
        // If it's a string (URL or base64), we might need to convert it
        // For now, skip if it's not a File
      }
    }
    if (data.projectId !== undefined) formData.append('ProjectId', data.projectId.toString());
    if (data.projectCategoryId !== undefined) formData.append('ProjectCategoryId', data.projectCategoryId.toString());
    if (data.companyId !== undefined) formData.append('CompanyId', data.companyId.toString());
    if (data.toUserId !== undefined) formData.append('ToUserId', data.toUserId.toString());

    const response = await axiosInstance.post('/web/operation/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // PUT /api/web/operation/update
  async update(data: UpdateOperationRequest): Promise<ApiResponse<ApiOperation>> {
    const formData = new FormData();
    
    formData.append('Id', data.id.toString());
    formData.append('Type', data.type.toString());
    formData.append('Amount', data.amount.toString());
    formData.append('Currency', data.currency.toString());
    formData.append('Date', data.date);
    formData.append('Status', data.status.toString());
    
    if (data.note) formData.append('Note', data.note);
    if (data.receipt) {
      if (data.receipt instanceof File) {
        formData.append('Receipt', data.receipt);
      }
    }
    if (data.projectId !== undefined) formData.append('ProjectId', data.projectId.toString());
    if (data.projectCategoryId !== undefined) formData.append('ProjectCategoryId', data.projectCategoryId.toString());
    if (data.companyId !== undefined) formData.append('CompanyId', data.companyId.toString());
    if (data.toUserId !== undefined) formData.append('ToUserId', data.toUserId.toString());

    const response = await axiosInstance.put('/web/operation/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // PUT /api/web/operation/change-status
  async changeStatus(data: ChangeStatusRequest): Promise<ApiResponse<ApiOperation>> {
    const response = await axiosInstance.put('/web/operation/change-status', {
      id: data.id,
      status: data.status,
      reason: data.reason || '',
    });
    return response.data;
  },

  // DELETE /api/web/operation/delete/{id}
  async delete(id: number): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete(`/web/operation/delete/${id}`);
    return response.data;
  },
};

