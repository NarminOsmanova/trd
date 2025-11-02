import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { positionService } from '@/lib/services/positionService';
import { CreatePositionRequest, GetPositionByIdResponse, PaginatedPositionsResponse, Position, UpdatePositionRequest } from '@/containers/position/types/position-type';
import { ApiResponse } from '@/containers/users/types/users-type';


// ==================== Types ====================
export type PositionFilters = {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
};

// ==================== Main Hook ====================
export const usePositions = (filters: PositionFilters = {}) => {
  const queryClient = useQueryClient();

  // Get paginated positions
  const { data, isLoading, error, refetch } = useQuery<PaginatedPositionsResponse>({
    queryKey: ['positions', filters],
    queryFn: () => positionService.getPositionsWithPagination(
      filters.pageNumber,
      filters.pageSize,
      filters.search
    ),
    retry: false,
  });

  // Delete position
  const deletePositionMutation = useMutation({
    mutationFn: (id: number) => positionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['positions'] });
    },
  });

  const positions = data?.responseValue?.items || [];

  return {
    positions,
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
    refetchPositions: refetch,
    deletePosition: deletePositionMutation.mutate,
    isDeleting: deletePositionMutation.isPending,
  };
};

// ==================== All Positions ====================
export const useAllPositions = (search: string = "") => {
  return useQuery<ApiResponse<Position[]>>({
    queryKey: ['positions', 'all', search],
    queryFn: () => positionService.getAllPositions(search),
    retry: false,
  });
};

// ==================== Position By ID ====================
export const usePosition = (id: number | null, enabled: boolean = true) => {
  return useQuery<GetPositionByIdResponse>({
    queryKey: ['position', id],
    queryFn: () => positionService.getPositionById(id!),
    enabled: !!id && enabled,
    retry: false,
  });
};

// ==================== Create Position ====================
export const useCreatePosition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePositionRequest) => 
      positionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['positions'] });
    },
  });
};

// ==================== Update Position ====================
export const useUpdatePosition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePositionRequest) => 
      positionService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['positions'] });
      queryClient.invalidateQueries({ queryKey: ['position'] });
    },
  });
};

// ==================== Delete Position ====================
export const useDeletePosition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => positionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['positions'] });
    },
  });
};

