import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { debtService } from '@/lib/services/debtService';
import { ApiDebt, CreateDebtRequest, GetDebtByIdResponse, PaginatedDebtsResponse, UpdateDebtRequest, SearchDebtorsResponse } from '@/containers/debt/types/debt-type';
import { ApiResponse } from '@/containers/users/types/users-type';

// ==================== Types ====================
export type DebtFilters = {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  status?: number; // 0=active, 1=paid, 2=overdue
  month?: number;
  year?: number;
};

// ==================== Main Hook ====================
export const useDebts = (filters: DebtFilters = {}) => {
  const queryClient = useQueryClient();

  // Get paginated debts
  const { data, isLoading, error, refetch } = useQuery<PaginatedDebtsResponse>({
    queryKey: ['debts', filters],
    queryFn: () => debtService.getDebtsWithPagination(
      filters.pageNumber,
      filters.pageSize,
      filters.search,
      filters.status,
      filters.month,
      filters.year
    ),
    retry: false,
  });

  // Delete debt
  const deleteDebtMutation = useMutation({
    mutationFn: (id: number) => debtService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
    },
  });

  const debts = data?.responseValue?.debts?.items || [];
  const statistics = data?.responseValue?.statistics;

  return {
    debts,
    statistics,
    pagination: data?.responseValue?.debts
      ? {
          pageNumber: data.responseValue.debts.pageNumber,
          totalPages: data.responseValue.debts.totalPages,
          pageSize: data.responseValue.debts.pageSize,
          totalCount: data.responseValue.debts.totalCount,
          hasPreviousPage: data.responseValue.debts.hasPreviousPage,
          hasNextPage: data.responseValue.debts.hasNextPage,
        }
      : null,
    isLoading,
    error,
    refetchDebts: refetch,
    deleteDebt: deleteDebtMutation.mutate,
    isDeleting: deleteDebtMutation.isPending,
  };
};



// ==================== Search Debtors (People) ====================
export const useSearchDebtors = (searchTerm: string = "") => {
  return useQuery<SearchDebtorsResponse>({
    queryKey: ['debtors', 'search', searchTerm],
    queryFn: () => debtService.searchDebtors(searchTerm),
    retry: false,
    enabled: searchTerm.length > 0,
  });
};

// ==================== All Debts ====================
export const useAllDebts = (search: string = "", status?: number) => {
  return useQuery<ApiResponse<ApiDebt[]>>({
    queryKey: ['debts', 'all', search, status],
    queryFn: () => debtService.getAllDebts(search, status),
    retry: false,
  });
};

// ==================== Debt By ID ====================
export const useDebt = (debtId: number | null, enabled: boolean = true) => {
  return useQuery<GetDebtByIdResponse>({
    queryKey: ['debt', debtId],
    queryFn: () => debtService.getDebtById(debtId!),
    enabled: !!debtId && enabled,
    retry: false,
  });
};

// ==================== Create Debt ====================
export const useCreateDebt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDebtRequest) => 
      debtService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
    },
  });
};

// ==================== Update Debt ====================
export const useUpdateDebt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateDebtRequest) => 
      debtService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
      queryClient.invalidateQueries({ queryKey: ['debt'] });
    },
  });
};

// ==================== Delete Debt ====================
export const useDeleteDebt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => debtService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
    },
  });
};

