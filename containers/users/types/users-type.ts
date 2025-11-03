// ==================== Enums ====================

export enum UserType {
  User = 0,
  Partner = 1,
}

export enum UserStatus {
  Pending = 0,
  Active = 1,
  Inactive = 2,
  Blocked = 3,
}

// ==================== Base User Interface ====================
export interface User {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  position?: string;
  role: 'admin' | 'user' | 'partner';
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
}

// ==================== API Request/Response Types ====================

// GET /api/web/user/current-user-info
export interface CurrentUserInfoResponse {
  statusCode: number;
  message: string;
  data?: User;
}

// GET /api/web/user/get-all-with-pagination
export interface ApiUser {
  id: number;
  set?: {
    firstName?: string;
    lastName?: string;
    language?: string;
  } | null;
  email?: string;
  phone?: string;
  type: UserType;
  status: UserStatus;
  role?: {
    id: number;
    name: string;
  } | null;
  position?: {
    id: number;
    name: string;
  } | null;
  createdAt?: string;
}

export interface PaginatedUsersResponse {
  statusCode: number;
  message: string;
  responseValue?: {
    items: ApiUser[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

// GET /api/web/user/get-all
export interface AllUsersResponse {
  statusCode: number;
  message: string;
  responseValue?: ApiUser[];
}

// GET /api/web/user/get-by-id/{id}
export interface GetUserByIdResponse {
  statusCode: number;
  message: string;
  responseValue?: ApiUser;
}

// POST /api/web/user/registration-link
export interface RegistrationLinkRequest {
  phone: string;
  userType: UserType;
}

export interface RegistrationLinkResponse {
  statusCode: number;
  message: string;
  data?: {
    registrationLink: string;
    expiresAt: string;
  };
}

// POST /api/web/user/complete-registration
export interface UserRegistrationData {
  userId: number;
  firstName: string;
  lastName: string;
  language: string;
}

export interface CompleteRegistrationRequest {
  phone: string;
  email: string;
  password: string;
  sets: UserRegistrationData[];
}

export interface CompleteRegistrationResponse {
  statusCode: number;
  message: string;
  data?: {
    userId: string;
    token: string;
  };
}

// POST /api/web/user/login
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  statusCode: number;
  message: string;
  data?: {
    token: string;
    refreshToken: string;
    user: User;
  };
}

// PUT /api/web/user/change-password
export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  statusCode: number;
  message: string;
}

// ==================== Utility Types ====================
export type ApiResponse<T = unknown> = {
  statusCode: number;
  message: string;
  data?: T;
  responseValue?: T;
};
