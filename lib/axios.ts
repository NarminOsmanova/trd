import axios, { AxiosError, AxiosRequestHeaders, AxiosRequestConfig, AxiosHeaders } from "axios"

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
  // Schedule proactive refresh based on new access token
  if (tokens.accessToken) {
    scheduleProactiveRefresh(tokens.accessToken);
  }
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
    const payload = decodeJwtPayload(token);
    if (!payload || typeof payload.exp !== 'number') {
      return true;
    }
    const currentTime = Math.floor(Date.now() / 1000);
    // add small skew (60s) to avoid race conditions
    const isExpired = payload.exp <= currentTime + 60;
    
    if (isExpired) {
      devLog("Token is expired", { exp: payload.exp, now: currentTime });
    }
    
    return isExpired;
  } catch (error) {
    devLog("Token validation error", error);
    return true;
  }
}

function isTokenExpiringSoon(token: string, thresholdSec: number = 60): boolean {
  const exp = getTokenExp(token);
  if (!exp) return true;
  const nowSec = Math.floor(Date.now() / 1000);
  return exp <= nowSec + thresholdSec;
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
    
    const locale = getCurrentLocaleFromCookie();
    const currentAccessToken = getAuthToken();
    console.log("currentAccessToken", currentAccessToken)
    const response = await refreshClient.post('/web/user/refresh-token', null, {
      params: { RefreshToken: refreshToken },
      headers: {
        ...(currentAccessToken ? { Authorization: `Bearer ${currentAccessToken}` } : {}),
        'Accept-Language': locale,
        'Content-Type': 'application/json',
      },
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
  } catch (error: unknown) {
    devLog("Token refresh failed", error);
    clearAuthCookies();
    // If refresh failed with 400/401, immediately redirect to login
    // const status = (error as AxiosError)?.response?.status;
    // if (typeof window !== 'undefined' && (status === 400 || status === 401)) {
    //   window.location.href = '/login';
    // }
  }
  
  return null;
}

// Proactive refresh helpers
let proactiveRefreshTimer: number | null = null;

interface JwtPayload {
  exp: number;
  [key: string]: unknown;
}

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
    return JSON.parse(atob(padded)) as JwtPayload;
  } catch {
    return null;
  }
}

function getTokenExp(token: string): number | null {
  const payload = decodeJwtPayload(token);
  return payload?.exp ?? null;
}

function clearProactiveRefresh(): void {
  if (proactiveRefreshTimer !== null) {
    clearTimeout(proactiveRefreshTimer);
    proactiveRefreshTimer = null;
  }
}

function scheduleProactiveRefresh(token: string): void {
  if (typeof window === 'undefined') return;
  const exp = getTokenExp(token);
  if (!exp) return;
  const nowSec = Math.floor(Date.now() / 1000);
  const triggerSec = Math.max(exp - 60 - nowSec, 0); // 60s before expiry
  const delayMs = triggerSec * 1000;
  clearProactiveRefresh();
  proactiveRefreshTimer = window.setTimeout(async () => {
    devLog('Proactive timer: refreshing token before expiry');
    await refreshAccessToken();
  }, delayMs);
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
      } else if (token && isTokenExpiringSoon(token)) {
        // Refresh shortly before expiry even if still valid
        devLog('Token expiring soon, refreshing...');
        const newToken = await refreshAccessToken();
        token = newToken || token;
      } else if (!token) {
        // No access token: try to refresh using refresh token if present
        const rt = getRefreshToken();
        if (rt) {
          devLog("No access token, trying refresh with refresh-token...");
          const newToken = await refreshAccessToken();
          token = newToken;
        } else {
          devLog("No token found, skipping auth...");
        }
      }
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Ensure timer is scheduled when a request first adds a valid token
      scheduleProactiveRefresh(token);
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
  async (error: AxiosError) => {
    const originalRequest = error.config as (AxiosRequestConfig & { _retry?: boolean });
    if (!originalRequest) {
      return Promise.reject(error);
    }
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      devLog("Received 401, attempting token refresh...");
      originalRequest._retry = true;
      
      // Try to refresh token
      const newToken = await refreshAccessToken();
      
      if (newToken) {
        devLog("Token refreshed, retrying original request...");
        // Retry original request with new token
        if (originalRequest.headers instanceof AxiosHeaders) {
          originalRequest.headers.set('Authorization', `Bearer ${newToken}`);
        } else {
          const merged: Record<string, unknown> = {
            ...(originalRequest.headers as Record<string, unknown> | undefined),
            Authorization: `Bearer ${newToken}`,
          };
          originalRequest.headers = merged as AxiosRequestHeaders;
        }
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

// On load, schedule proactive refresh if token exists
if (typeof window !== 'undefined') {
  const existing = getAuthToken();
  if (existing) {
    scheduleProactiveRefresh(existing);
  }
}