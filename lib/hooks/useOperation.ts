import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { operationService } from '@/lib/services/operationService';
import { useEffect, useState } from 'react';
import { ApiOperation, ChangeStatusRequest, CreateOperationRequest, GetOperationByIdResponse, OperationFilters, PaginatedOperationsResponse, UpdateOperationRequest } from '@/containers/transactions/types/transactions-type';

// ==================== Main Hook ====================
export const useOperations = (filters: OperationFilters = {}) => {
  const queryClient = useQueryClient();
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search || '');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search || '');
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timer);
  }, [filters.search]);

  // Get paginated operations with debounced search
  const { data, isLoading, error, refetch } = useQuery<PaginatedOperationsResponse>({
    queryKey: ['operations', {
      ...filters,
      search: debouncedSearch, // Use debounced search in query key
    }],
    queryFn: () => operationService.getOperationsWithPagination({
      ...filters,
      search: debouncedSearch, // Use debounced search in API call
    }),
    retry: false,
  });

  // Delete operation
  const deleteOperationMutation = useMutation({
    mutationFn: (id: number) => operationService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operations'] });
    },
  });

  const operations: ApiOperation[] = data?.responseValue?.items || [];
  const pagination = data?.responseValue
    ? {
        pageNumber: data.responseValue.pageNumber,
        totalPages: data.responseValue.totalPages,
        pageSize: data.responseValue.pageSize,
        totalCount: data.responseValue.totalCount,
        hasPreviousPage: data.responseValue.hasPreviousPage,
        hasNextPage: data.responseValue.hasNextPage,
      }
    : null;

  return {
    operations,
    pagination,
    isLoading,
    error,
    refetchOperations: refetch,
    deleteOperation: deleteOperationMutation.mutate,
    isDeleting: deleteOperationMutation.isPending,
  };
};

// ==================== Operation By ID ====================
export const useOperation = (id: number | null, enabled: boolean = true) => {
  return useQuery<GetOperationByIdResponse>({
    queryKey: ['operation', id],
    queryFn: () => operationService.getOperationById(id!),
    enabled: !!id && enabled,
    retry: false,
  });
};

// ==================== Create Operation ====================
export const useCreateOperation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOperationRequest) =>
      operationService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operations'] });
    },
  });
};

// ==================== Update Operation ====================
export const useUpdateOperation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateOperationRequest) =>
      operationService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operations'] });
      queryClient.invalidateQueries({ queryKey: ['operation'] });
    },
  });
};

// ==================== Change Status ====================
export const useChangeOperationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChangeStatusRequest) =>
      operationService.changeStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operations'] });
      queryClient.invalidateQueries({ queryKey: ['operation'] });
    },
  });
};

// ==================== Delete Operation ====================
export const useDeleteOperation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => operationService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operations'] });
    },
  });
};

