import axios from "axios"

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://108.142.200.177:8002/api";
  
const isDevelopment = process.env.NODE_ENV === "development";

// Development logging helper
const devLog = (message: string, ...args: unknown[]) => {
  if (isDevelopment) {
    console.log(`🔐 [Auth] ${message}`, ...args);
  }
};

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Helper function to serialize params with array support
function serializeParams(params: Record<string, unknown>): string {
  const parts: string[] = [];
  
  Object.entries(params).forEach(([key, value]) => {
    // Skip undefined, null, and empty arrays
    if (value === undefined || value === null) {
      return;
    }
    
    if (Array.isArray(value)) {
      // Skip empty arrays
      if (value.length === 0) {
        return;
      }
      // Serialize arrays as key=value1&key=value2 (standard format without brackets)
      value.forEach((item) => {
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`);
      });
    } else {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    }
  });
  
  const result = parts.join('&');
  if (isDevelopment) {
    console.log('🔗 [Axios] Serialized params:', result);
  }
  return result;
}

// ==================== Token Management Types ====================

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiration: string;
  refreshTokenLifeTime?: number;
}

// ==================== Cookie Helper Functions ====================

/**
 * Get cookie value by name
 */
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  
  const cookieString = document.cookie;
  const cookies = cookieString.split("; ");
  const targetCookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  
  if (targetCookie) {
    const value = targetCookie.split("=")[1];
    devLog(`Cookie found: ${name}`, value ? `${value.substring(0, 20)}...` : "empty");
    return value;
  }
  
  devLog(`Cookie not found: ${name}`);
  return null;
}

/**
 * Set auth tokens in secure cookies
 */
export function setAuthTokens(tokens: AuthTokens): void {
  if (typeof document === "undefined") {
    devLog("SSR environment, cannot set cookies");
    return;
  }

  const expirationDate = new Date(tokens.expiration);
  
  devLog("Setting auth tokens:", {
    accessToken: tokens.accessToken ? `${tokens.accessToken.substring(0, 20)}...` : "null",
    expiration: tokens.expiration
  });

  // Set access token with backend expiration
  const accessTokenCookie = `auth-token=${tokens.accessToken}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Lax`;
  document.cookie = accessTokenCookie;
  
  // Set refresh token (longer expiration)
  const refreshExpiration = new Date();
  refreshExpiration.setHours(refreshExpiration.getHours() + (tokens.refreshTokenLifeTime || 8760));
  const refreshTokenCookie = `refresh-token=${tokens.refreshToken}; expires=${refreshExpiration.toUTCString()}; path=/; SameSite=Lax`;
  document.cookie = refreshTokenCookie;
  
  devLog("Tokens set successfully");
}

/**
 * Set cookie with custom expiration (days)
 */
export function setCookie(name: string, value: string, expirationDate: Date | string): void {
  if (typeof document === "undefined") return;
  
  const expires = typeof expirationDate === "string" ? new Date(expirationDate) : expirationDate;
  
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  devLog(`Cookie set: ${name}`);
}

/**
 * Remove cookie by name
 */
export function removeCookie(name: string): void {
  if (typeof document === "undefined") return;
  
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
  devLog(`Cookie removed: ${name}`);
}

/**
 * Clear all auth cookies
 */
export function clearAuthCookies(): void {
  devLog("Clearing all auth cookies");
  removeCookie("auth-token");
  removeCookie("refresh-token");
}

/**
 * Get current locale from cookie
 */
function getCurrentLocaleFromCookie(): string {
  return getCookie("NEXT_LOCALE") || "en";
}

/**
 * Get auth token from cookie
 */
function getAuthToken(): string | null {
  return getCookie("auth-token");
}

/**
 * Get refresh token from cookie
 */
function getRefreshToken(): string | null {
  return getCookie("refresh-token");
}

/**
 * Check if JWT token is expired
 */
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = payload.exp < currentTime;
    
    if (isExpired) {
      devLog("Token is expired", { exp: payload.exp, now: currentTime });
    }
    
    return isExpired;
  } catch (error) {
    devLog("Token validation error", error);
    return true;
  }
}

/**
 * Refresh access token using refresh token
 */
async function refreshAccessToken(): Promise<string | null> {
  devLog("Starting token refresh...");
  const refreshToken = getRefreshToken();
  console.log("refreshToken", refreshToken)
  if (!refreshToken) {
    devLog("No refresh token found");
    return null;
  }

  try {
    // Create a separate axios instance for refresh to avoid circular dependency
    const refreshClient = axios.create({
      baseURL: API_BASE_URL,
    });
    
    const response = await refreshClient.post('/web/user/refresh-token', null, {
      params: { RefreshToken: refreshToken }
    });
    
    if (response.data.data?.token) {
      const newAccessToken = response.data.data.token;
      const expiration = response.data.data.expiration || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      
      // Set new access token
      setCookie("auth-token", newAccessToken, expiration);
      
      // Update refresh token if provided
      if (response.data.data.refreshToken) {
        const refreshExpiration = new Date();
        refreshExpiration.setHours(refreshExpiration.getHours() + 8760); // 1 year
        setCookie("refresh-token", response.data.data.refreshToken, refreshExpiration);
      }
      
      devLog("Token refresh successful");
      return newAccessToken;
    }
  } catch (error) {
    devLog("Token refresh failed", error);
    clearAuthCookies();
  }
  
  return null;
}

// ==================== Axios Interceptors ====================

// Request interceptor - proactive token check and refresh
axiosInstance.interceptors.request.use(
  async (config) => {
    const locale = getCurrentLocaleFromCookie();
    let token = getAuthToken();
    
    // Skip token refresh for login/register endpoints
    const isAuthEndpoint = config.url?.includes('/login') || 
                          config.url?.includes('/register') ||
                          config.url?.includes('/complete-registration');
    
    if (!isAuthEndpoint) {
      // Check if token exists and is expired
      if (token && isTokenExpired(token)) {
        devLog("Token expired, attempting proactive refresh...");
        const newToken = await refreshAccessToken();
        token = newToken;
      } else if (!token) {
        // Don't try to refresh if there's no token at all
        devLog("No token found, skipping auth...");
      }
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add Accept-Language header
    config.headers["Accept-Language"] = locale;
    
    // Serialize params with array support for GET requests
    if (config.params && Object.keys(config.params).length > 0) {
      const serialized = serializeParams(config.params as Record<string, unknown>);
      // Replace params with serialized string
      config.params = {};
      config.url = `${config.url}${config.url?.includes('?') ? '&' : '?'}${serialized}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
)

// Response interceptor - handle 401 with retry
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      devLog("Received 401, attempting token refresh...");
      originalRequest._retry = true;
      
      // Try to refresh token
      const newToken = await refreshAccessToken();
      
      if (newToken) {
        devLog("Token refreshed, retrying original request...");
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } else {
        devLog("Token refresh failed, redirecting to login...");
        // Refresh failed - clear cookies and redirect to login
        clearAuthCookies();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }
    
    return Promise.reject(error);
  },
)
// function getCurrentLocaleFromCookie() {
//   if (typeof document !== "undefined") {
//     const match = document.cookie.match(/(^| )NEXT_LOCALE=([^;]+)/);
//     return match ? match[2] : "en";
//   }
//   return "en";
// }