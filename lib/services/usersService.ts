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
  ApiResponse,
} from '@/containers/users/types/users-type';
import { axiosInstance } from '@/lib/axios';

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
    
    // Store token if successful
    if (response.data.data?.token && typeof window !== 'undefined') {
      localStorage.setItem('authToken', response.data.data.token);
    }
    
    return response.data;
  },

  // POST /api/web/user/login
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await axiosInstance.post('/web/user/login', data);
    
    // Store token if successful
    if (response.data.data?.token && typeof window !== 'undefined') {
      localStorage.setItem('authToken', response.data.data.token);
    }
    
    return response.data;
  },

  // POST /api/web/user/logout
  async logout(): Promise<ApiResponse<void>> {
    const response = await axiosInstance.post('/web/user/logout');
    
    // // Remove token
    // if (typeof window !== 'undefined') {
    //   localStorage.removeItem('authToken');
    //   sessionStorage.removeItem('authToken');
    // }
    
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
};

