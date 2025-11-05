import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from '@/lib/services/usersService';
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

  // Use raw backend user objects directly
  const rawUsers: ApiUser[] = (data?.responseValue?.items as ApiUser[]) || [];

  return {
    users: rawUsers,
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

  // Use raw backend users directly
  const users: ApiUser[] = (data?.responseValue as ApiUser[]) || [];

  return {
    users,
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
    // Optional userId; if not provided, derive from cached current-user or localStorage
    mutationFn: (userId?: number) => {
      if (typeof userId === 'number') {
        return usersService.logout(userId);
      }
      const cached = queryClient.getQueryData(['current-user']) as CurrentUserInfoResponse | undefined;
      const derivedId = (cached?.responseValue?.id as number | undefined) ?? (cached?.data?.id as string | undefined);
      let idNumber = typeof derivedId === 'string' ? parseInt(derivedId) : (derivedId ?? 0);
      if (!idNumber && typeof window !== 'undefined') {
        const stored = localStorage.getItem('trd_user_id');
        if (stored) idNumber = parseInt(stored) || 0;
      }
      return usersService.logout(idNumber || 0);
    },
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
