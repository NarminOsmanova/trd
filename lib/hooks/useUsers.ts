import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from '@/lib/services/usersService';
import type { User } from '@/types';
import type {
  CurrentUserInfoResponse,
  PaginatedUsersResponse,
  AllUsersResponse,
  GetUserByIdResponse,
  RegistrationLinkRequest,
  CompleteRegistrationRequest,
  LoginRequest,
  ChangePasswordRequest,
  UpdateUserInfosRequest,
  ApiUser,
} from '@/containers/users/types/users-type';

// ==================== Types ====================
export type UserFilters = {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  roleIds?: number[];
  statuses?: number[];
};

// ==================== Main Hook ====================
export const useUsers = (filters: UserFilters = {}) => {
  const queryClient = useQueryClient();

  // Get paginated users
  const { data, isLoading, error, refetch } = useQuery<PaginatedUsersResponse>({
    queryKey: ['users', filters],
    queryFn: () => usersService.getUsersWithPagination(
      filters.pageNumber,
      filters.pageSize,
      filters.searchTerm,
      filters.roleIds,
      filters.statuses
    ),
    retry: false,
  });

  // Delete user
  const deleteUserMutation = useMutation({
    mutationFn: (userId: number) => usersService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
    },
  });

  // Transform API users to app users
  const transformApiUser = (apiUser: ApiUser): User => {
    // Try to get name from sets array first (new API), fallback to set object (old API)
    let name = 'N/A';
    if (apiUser.sets && apiUser.sets.length > 0) {
      const firstSet = apiUser.sets[0];
      name = `${firstSet.firstName || ''} ${firstSet.lastName || ''}`.trim();
    } else if (apiUser.set) {
      name = `${apiUser.set.firstName || ''} ${apiUser.set.lastName || ''}`.trim();
    }

    return {
      id: apiUser.id.toString(),
      name,
      email: apiUser.email || '',
      phone: apiUser.phone || '',
      position: apiUser.position?.name || '',
      // Prioritize role.name over type for role mapping
      role: apiUser.role?.name === 'Admin' ? 'admin' : (apiUser.type === 1 ? 'partner' : 'user'),
      type: apiUser.type,
      status: apiUser.status,
      isActive: apiUser.status === 1,
      avatar: apiUser.avatar,
      createdAt: apiUser.createdDate || apiUser.createdAt || new Date().toISOString(),
      updatedAt: apiUser.createdDate || apiUser.createdAt || new Date().toISOString(),
    };
  };

  const transformedUsers = data?.responseValue?.items?.map(transformApiUser) || [];

  return {
    users: transformedUsers,
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
    refetchUsers: refetch,
    deleteUser: deleteUserMutation.mutate,
    isDeleting: deleteUserMutation.isPending,
  };
};

// ==================== All Users (No Pagination) ====================
export const useAllUsers = (searchTerm: string = "") => {
  const { data, isLoading, error, refetch } = useQuery<AllUsersResponse>({
    queryKey: ['all-users', searchTerm],
    queryFn: () => usersService.getAllUsers(searchTerm),
    retry: false,
  });

  // Transform API users to app users
  const transformApiUser = (apiUser: ApiUser): User => {
    // Try to get name from sets array first (new API), fallback to set object (old API)
    let name = 'N/A';
    if (apiUser.sets && apiUser.sets.length > 0) {
      const firstSet = apiUser.sets[0];
      name = `${firstSet.firstName || ''} ${firstSet.lastName || ''}`.trim();
    } else if (apiUser.set) {
      name = `${apiUser.set.firstName || ''} ${apiUser.set.lastName || ''}`.trim();
    }

    return {
      id: apiUser.id.toString(),
      name,
      email: apiUser.email || '',
      phone: apiUser.phone || '',
      position: apiUser.position?.name || '',
      // Prioritize role.name over type for role mapping
      role: apiUser.role?.name === 'Admin' ? 'admin' : (apiUser.type === 1 ? 'partner' : 'user'),
      type: apiUser.type,
      status: apiUser.status,
      isActive: apiUser.status === 1,
      avatar: apiUser.avatar,
      createdAt: apiUser.createdDate || apiUser.createdAt || new Date().toISOString(),
      updatedAt: apiUser.createdDate || apiUser.createdAt || new Date().toISOString(),
    };
  };

  const transformedUsers = data?.responseValue?.map(transformApiUser) || [];

  return {
    users: transformedUsers,
    isLoading,
    error,
    refetchUsers: refetch,
  };
};

// ==================== Current User ====================
export const useCurrentUser = () => {
  return useQuery<CurrentUserInfoResponse>({
    queryKey: ['current-user'],
    queryFn: () => usersService.getCurrentUserInfo(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// ==================== User By ID ====================
export const useUser = (id: string, enabled: boolean = true) => {
  return useQuery<GetUserByIdResponse>({
    queryKey: ['user', id],
    queryFn: () => usersService.getUserById(id),
    enabled: !!id && enabled,
    retry: false,
  });
};

// ==================== Registration Link ====================
export const useGenerateRegistrationLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegistrationLinkRequest) => 
      usersService.generateRegistrationLink(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// ==================== Complete Registration ====================
export const useCompleteRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CompleteRegistrationRequest) => 
      usersService.completeRegistration(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
    },
  });
};

// ==================== Login ====================
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => usersService.login(data),
    onSuccess: (response) => {
      // Set current user in cache
      if (response.data?.user) {
        queryClient.setQueryData(['current-user'], {
          statusCode: 200,
          message: 'Success',
          data: response.data.user,
        });
      }
    },
  });
};

// ==================== Logout ====================
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => usersService.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

// ==================== Change Password ====================
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => 
      usersService.changePassword(data),
  });
};

// ==================== Change Status ====================
export const useChangeUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, status }: { userId: number; status: number }) =>
      usersService.changeStatus(userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// ==================== Refresh Token ====================
export const useRefreshToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (refreshToken: string) => usersService.refreshToken(refreshToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
    },
  });
};

// ==================== Update User Infos ====================
export const useUpdateUserInfos = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserInfosRequest) => usersService.updateUserInfos(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.id.toString()] });
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
    },
  });
};

// ==================== Update Avatar ====================
export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (avatar: File) => usersService.updateAvatar(avatar),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
