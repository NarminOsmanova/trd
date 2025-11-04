import type {
  PaginatedDebtPaymentsResponse,
  CreateDebtPaymentRequest,
  UpdateDebtPaymentRequest,
  ApiResponse,
} from '@/containers/debt/types/debt-type';
import { axiosInstance } from '@/lib/axios';

/**
 * Debt Payment Service
 * API service for debt payment management
 */
export const debtPaymentService = {
  // GET /api/web/debt-payment/get-all
  async getDebtPayments(
    debtId?: number,
    status?: number,
    month?: number,
    year?: number,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedDebtPaymentsResponse> {
    const response = await axiosInstance.get('/web/debt-payment/get-all', {
      params: {
        DebtId: debtId,
        Status: status,
        Month: month,
        Year: year,
        PageNumber: pageNumber,
        PageSize: pageSize,
      },
    });
    return response.data;
  },

  // POST /api/web/debt-payment/create
  async createDebtPayment(data: CreateDebtPaymentRequest): Promise<ApiResponse<void>> {
    const response = await axiosInstance.post('/web/debt-payment/create', data);
    return response.data;
  },

  // PUT /api/web/debt-payment/update
  async updateDebtPayment(data: UpdateDebtPaymentRequest): Promise<ApiResponse<void>> {
    const response = await axiosInstance.put('/web/debt-payment/update', data);
    return response.data;
  },

  // DELETE /api/web/debt-payment/delete/{id}
  async deleteDebtPayment(id: number): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete(`/web/debt-payment/delete/${id}`);
    return response.data;
  },
};

