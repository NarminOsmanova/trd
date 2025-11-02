import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companyService } from '@/lib/services/companyService';
import { 
  CreateCompanyRequest, 
  GetCompanyByIdResponse, 
  PaginatedCompaniesResponse, 
  Company, 
  UpdateCompanyRequest,
  ApiResponse 
} from '@/containers/company/types/company-type';

// ==================== Types ====================
export type CompanyFilters = {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
};

// ==================== Main Hook ====================
export const useCompanies = (filters: CompanyFilters = {}) => {
  const queryClient = useQueryClient();

  // Get paginated companies
  const { data, isLoading, error, refetch } = useQuery<PaginatedCompaniesResponse>({
    queryKey: ['companies', filters],
    queryFn: () => companyService.getCompaniesWithPagination(
      filters.pageNumber,
      filters.pageSize,
      filters.search
    ),
    retry: false,
  });

  // Delete company
  const deleteCompanyMutation = useMutation({
    mutationFn: (id: number) => companyService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });

  const companies = data?.responseValue?.items || [];

  return {
    companies,
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
    refetchCompanies: refetch,
    deleteCompany: deleteCompanyMutation.mutate,
    isDeleting: deleteCompanyMutation.isPending,
  };
};

// ==================== All Companies ====================
export const useAllCompanies = (search: string = "") => {
  return useQuery<ApiResponse<Company[]>>({
    queryKey: ['companies', 'all', search],
    queryFn: () => companyService.getAllCompanies(search),
    retry: false,
  });
};

// ==================== Company By ID ====================
export const useCompany = (id: number | null, enabled: boolean = true) => {
  return useQuery<GetCompanyByIdResponse>({
    queryKey: ['company', id],
    queryFn: () => companyService.getCompanyById(id!),
    enabled: !!id && enabled,
    retry: false,
  });
};

// ==================== Create Company ====================
export const useCreateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCompanyRequest) => 
      companyService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
};

// ==================== Update Company ====================
export const useUpdateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCompanyRequest) => 
      companyService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['company'] });
    },
  });
};

// ==================== Delete Company ====================
export const useDeleteCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => companyService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
};

