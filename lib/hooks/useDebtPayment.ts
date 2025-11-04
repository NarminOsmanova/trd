import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { debtPaymentService } from '@/lib/services/debtPaymentService';
import type {
  PaginatedDebtPaymentsResponse,
  CreateDebtPaymentRequest,
  UpdateDebtPaymentRequest,
} from '@/containers/debt/types/debt-type';

// ==================== Types ====================
export type DebtPaymentFilters = {
  debtId?: number;
  status?: number;
  month?: number;
  year?: number;
  pageNumber?: number;
  pageSize?: number;
};

// ==================== Main Hook - Get Debt Payments ====================
export const useDebtPayments = (filters: DebtPaymentFilters = {}) => {
  const { data, isLoading, error, refetch } = useQuery<PaginatedDebtPaymentsResponse>({
    queryKey: ['debt-payments', filters],
    queryFn: () =>
      debtPaymentService.getDebtPayments(
        filters.debtId,
        filters.status,
        filters.month,
        filters.year,
        filters.pageNumber,
        filters.pageSize
      ),
    retry: false,
  });

  return {
    payments: data?.responseValue?.items || [],
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
    refetchPayments: refetch,
  };
};

// ==================== Create Debt Payment ====================
export const useCreateDebtPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDebtPaymentRequest) =>
      debtPaymentService.createDebtPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debt-payments'] });
      queryClient.invalidateQueries({ queryKey: ['debts'] });
      queryClient.invalidateQueries({ queryKey: ['debt'] });
    },
  });
};

// ==================== Update Debt Payment ====================
export const useUpdateDebtPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateDebtPaymentRequest) =>
      debtPaymentService.updateDebtPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debt-payments'] });
      queryClient.invalidateQueries({ queryKey: ['debts'] });
      queryClient.invalidateQueries({ queryKey: ['debt'] });
    },
  });
};

// ==================== Delete Debt Payment ====================
export const useDeleteDebtPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => debtPaymentService.deleteDebtPayment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debt-payments'] });
      queryClient.invalidateQueries({ queryKey: ['debts'] });
      queryClient.invalidateQueries({ queryKey: ['debt'] });
    },
  });
};

