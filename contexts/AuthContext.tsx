'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User } from '@/types';
import { usersService } from '@/lib/services/usersService';
import { clearAuthCookies } from '@/lib/axios';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, otp?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isUser: boolean;
  isPartner: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current user info from API
  const fetchCurrentUser = useCallback(async () => {
    // Check if we have a token before making API call
    const hasToken = typeof window !== 'undefined' && 
                     document.cookie.includes('auth-token=');
    
    if (!hasToken) {
      // No token, no need to fetch user
      setUser(null);
      localStorage.removeItem('trd_user');
      return null;
    }

    try {
      const response = await usersService.getCurrentUserInfo();
      
      if (response.statusCode === 200 && response.responseValue) {
        setUser(response.responseValue);
        // Store user in localStorage for persistence
        localStorage.setItem('trd_user', JSON.stringify(response.responseValue));
        return response.responseValue;
      } else {
        // No valid session
        setUser(null);
        localStorage.removeItem('trd_user');
        return null;
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      setUser(null);
      localStorage.removeItem('trd_user');
      return null;
    }
  }, []);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      // Check if we have a token
      const hasToken = typeof window !== 'undefined' && 
                       document.cookie.includes('auth-token=');
      
      if (hasToken) {
        // Try to get user from localStorage first (for faster initial render)
        const storedUser = localStorage.getItem('trd_user');
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (error) {
            console.error('Error parsing stored user:', error);
            localStorage.removeItem('trd_user');
          }
        }
        
        // Then fetch fresh user data from API
        await fetchCurrentUser();
      } else {
        // No token, clear any stale data
        setUser(null);
        localStorage.removeItem('trd_user');
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, [fetchCurrentUser]);

  const login = async (email: string, password: string, otp?: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await usersService.login({ email, password });
      
      if (response.statusCode === 200 && (response.responseValue?.token || response.data?.token)) {
        // Tokens are already stored by the service
        // Fetch user data
        await fetchCurrentUser();
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Call logout API
      await usersService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear user state and storage regardless of API call result
      setUser(null);
      localStorage.removeItem('trd_user');
      clearAuthCookies();
    }
  };

  const refreshUserData = async () => {
    await fetchCurrentUser();
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    refreshUserData,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role?.name === 'Admin',
    isUser:  user?.type !== 1,
    isPartner: user?.type === 1,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
