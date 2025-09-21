'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { mockUsers } from '@/lib/mock-data';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, otp?: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isUser: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('trd_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('trd_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, otp?: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user in mock data
      const foundUser = mockUsers.find(u => u.email === email && u.isActive);
      
      if (!foundUser) {
        setIsLoading(false);
        return false;
      }
      
      // Mock password validation (in real app, this would be server-side)
      if (password !== 'password123') {
        setIsLoading(false);
        return false;
      }
      
      // Mock OTP validation (in real app, this would be server-side)
      if (otp && otp !== '123456') {
        setIsLoading(false);
        return false;
      }
      
      // Set user and store in localStorage
      setUser(foundUser);
      localStorage.setItem('trd_user', JSON.stringify(foundUser));
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('trd_user');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isUser: user?.role === 'user'
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
