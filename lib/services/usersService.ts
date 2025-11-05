import type {
  CurrentUserInfoResponse,
  PaginatedUsersResponse,
  AllUsersResponse,
  GetUserByIdResponse,
  RegistrationLinkRequest,
  RegistrationLinkResponse,
  CompleteRegistrationRequest,
  CompleteRegistrationResponse,
  LoginRequest,
  LoginResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  RefreshTokenResponse,
  UpdateUserInfosRequest,
  UpdateUserInfosResponse,
  UpdateAvatarResponse,
  ApiResponse,
} from '@/containers/users/types/users-type';
import { axiosInstance, setAuthTokens, clearAuthCookies, AuthTokens } from '@/lib/axios';

/**
 * Users Service
 * Simple and practical API service
 */
export const usersService = {
  // GET /api/web/user/current-user-info
  async getCurrentUserInfo(): Promise<CurrentUserInfoResponse> {
    const response = await axiosInstance.get('/web/user/current-user-info');
    return response.data;
  },

  // GET /api/web/user/get-all-with-pagination
  async getUsersWithPagination(
    pageNumber: number = 1, 
    pageSize: number = 10, 
    searchTerm: string = "",
    roleIds?: number[],
    statuses?: number[]
  ): Promise<PaginatedUsersResponse> {
    const response = await axiosInstance.get('/web/user/get-all-with-pagination', {
      params: { 
        PageNumber: pageNumber, 
        PageSize: pageSize, 
        SearchTerm: searchTerm,
        RoleIds: roleIds,
        Statuses: statuses
      }
    });
    return response.data;
  },

  // GET /api/web/user/get-all
  async getAllUsers(searchTerm: string = ""): Promise<AllUsersResponse> {
    const response = await axiosInstance.get('/web/user/get-all', {
      params: { 
        SearchTerm: searchTerm
      }
    });
    return response.data;
  },

  // GET /api/web/user/get-by-id/{id}
  async getUserById(id: string): Promise<GetUserByIdResponse> {
    const response = await axiosInstance.get(`/web/user/get-by-id/${id}`);
    return response.data;
  },

  // POST /api/web/user/registration-link
  async generateRegistrationLink(data: RegistrationLinkRequest): Promise<RegistrationLinkResponse> {
    const response = await axiosInstance.post('/web/user/registration-link', data);
    return response.data;
  },

  // POST /api/web/user/complete-registration
  async completeRegistration(data: CompleteRegistrationRequest): Promise<CompleteRegistrationResponse> {
    const response = await axiosInstance.post('/web/user/complete-registration', data);
    
    // Store tokens in cookies if successful
    if (response.data.data?.token && response.data.data?.refreshToken) {
      const tokens: AuthTokens = {
        accessToken: response.data.data.token,
        refreshToken: response.data.data.refreshToken,
        expiration: response.data.data.expiration || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      };
      setAuthTokens(tokens);
    }
    
    return response.data;
  },

  // POST /api/web/user/login
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await axiosInstance.post('/web/user/login', data);
    
    // Store tokens in cookies if successful
    // Handle both nested token structure (responseValue.token.token) and flat structure (data.token)
    const tokenData = response.data.responseValue?.token || response.data.data?.token;
    
    if (tokenData) {
      const tokens: AuthTokens = {
        accessToken: typeof tokenData === 'string' ? tokenData : tokenData.token,
        refreshToken: typeof tokenData === 'string' ? '' : (tokenData.refreshToken || ''),
        expiration: typeof tokenData === 'string' ? 
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : 
          (tokenData.expiration || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()),
        refreshTokenLifeTime: typeof tokenData === 'string' ? undefined : tokenData.refreshTokenLifeTime,
      };
      setAuthTokens(tokens);
    }

    return response.data;
  },

  // POST /api/web/user/logout
  // Swagger expects a request body: { userId: number }
  async logout(userId: number = 0): Promise<ApiResponse<void>> {
    // Derive userId if not provided: 1) from JWT cookie, 2) fallback 0
    let resolvedUserId = userId;
    if (!resolvedUserId && typeof window !== 'undefined') {
      // Read access token from cookie
      const match = document.cookie.match(/(?:^|; )auth-token=([^;]+)/);
      const token = match ? decodeURIComponent(match[1]) : null;
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
          const nameId =
            payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
            payload['nameid'] ||
            payload['sub'];
          const parsed = typeof nameId === 'string' ? parseInt(nameId) : nameId;
          if (!isNaN(parsed)) {
            resolvedUserId = parsed;
          }
        } catch {
          // ignore decode errors, use fallback 0
        }
      }
    }

    const response = await axiosInstance.post('/web/user/logout', { userId: resolvedUserId || 0 });
    
    // Remove all auth cookies
    clearAuthCookies();
    
    return response.data;
  },

  // PUT /api/web/user/change-password
  async changePassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    const response = await axiosInstance.put('/web/user/change-password', data);
    return response.data;
  },

  // PUT /api/web/user/change-status
  async changeStatus(userId: number, status: number): Promise<ApiResponse<void>> {
    const response = await axiosInstance.put('/web/user/change-status', { 
      userId, 
      status 
    });
    return response.data;
  },

  // DELETE /api/web/user/delete
  async deleteUser(id: number): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete('/web/user/delete', {
      params: { Id: id }
    });
    return response.data;
  },

  // POST /api/web/user/refresh-token
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await axiosInstance.post('/web/user/refresh-token', null, {
      params: { RefreshToken: refreshToken }
    });
    
    // Store new tokens in cookies if successful
    if (response.data.data?.token && response.data.data?.refreshToken) {
      const tokens: AuthTokens = {
        accessToken: response.data.data.token,
        refreshToken: response.data.data.refreshToken,
        expiration: response.data.data.expiration || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      };
      setAuthTokens(tokens);
    }
    
    return response.data;
  },

  // PUT /api/web/user/update-user-infos
  async updateUserInfos(data: UpdateUserInfosRequest): Promise<UpdateUserInfosResponse> {
    const response = await axiosInstance.put('/web/user/update-user-infos', data);
    return response.data;
  },

  // PUT /api/web/user/update-avatar
  async updateAvatar(avatar: File): Promise<UpdateAvatarResponse> {
    const formData = new FormData();
    formData.append('Avatar', avatar);
    
    const response = await axiosInstance.put('/web/user/update-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

