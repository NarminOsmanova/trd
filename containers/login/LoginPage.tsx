'use client';

import React, { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLogin } from '@/lib/hooks/useUsers';
import { LoginFormData, LoginState, DemoCredentials } from './types/login-type';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import DemoCredentialsComponent from './components/DemoCredentials';
import { toast } from 'sonner';

export default function LoginPage() {
  const [loginState, setLoginState] = useState<LoginState>({
    showPassword: false,
    showOtp: false,
    isLoading: false,
    error: ''
  });
  
  const router = useRouter();
  const { refreshUserData } = useAuth();
  const loginMutation = useLogin();

  const demoCredentials: DemoCredentials = {
    admin: {
      email: 'test@gmail.com',
      password: 'Test123!@#'
    },
    user: {
      email: 'narmin@gmail.com',
      password: 'Test123!@#'
    },
    partner: {
      email: 'partner@trd.az',
      password: 'Test123!@#'
    },
    otp: '123456'
  };

  const handleSubmit = async (data: LoginFormData) => {
    setLoginState(prev => ({ ...prev, isLoading: true, error: '' }));

    try {
      const response = await loginMutation.mutateAsync({
        email: data.email,
        password: data.password
      });

      // Check if login was successful
      // API returns: responseValue.token.token (nested structure)
      const isSuccess = response.statusCode === 200 && 
                       (response.responseValue?.token?.token || response.data?.token);

      if (isSuccess) {
        // Tokens are already stored by the service
        toast.success('Giriş uğurlu oldu!');
        
        // Small delay to ensure cookies are set
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Refresh user data in AuthContext (will now work because token exists)
        await refreshUserData();
        
        // Navigate to dashboard
        router.push('/dashboard');
      } else {
        throw new Error(response.message || 'Giriş uğursuz oldu');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle different error scenarios
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Giriş zamanı xəta baş verdi. Email və ya şifrə yanlışdır.';
      
      setLoginState(prev => ({ 
        ...prev, 
        error: errorMessage,
        isLoading: false
      }));
      
      toast.error(errorMessage);
    }
  };

  const handleTogglePassword = () => {
    setLoginState(prev => ({ 
      ...prev, 
      showPassword: !prev.showPassword 
    }));
  };

  const handleBackToCredentials = () => {
    setLoginState(prev => ({ 
      ...prev, 
      showOtp: false, 
      error: '' 
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <LoginHeader />

        {/* Login Form */}
        <LoginForm
          showPassword={loginState.showPassword}
          showOtp={loginState.showOtp}
          isLoading={loginState.isLoading || loginMutation.isPending}
          error={loginState.error}
          onSubmit={handleSubmit}
          onTogglePassword={handleTogglePassword}
          onBackToCredentials={handleBackToCredentials}
        />

        {/* Demo Credentials */}
        <DemoCredentialsComponent
          showOtp={loginState.showOtp}
          credentials={demoCredentials}
        />
      </div>
    </div>
  );
}
