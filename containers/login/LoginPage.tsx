'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LoginFormData, LoginState, DemoCredentials } from './types/login-type';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import DemoCredentialsComponent from './components/DemoCredentials';

export default function LoginPage() {
  const [loginState, setLoginState] = useState<LoginState>({
    showPassword: false,
    showOtp: false,
    isLoading: false,
    error: ''
  });
  
  const { login } = useAuth();
  const router = useRouter();

  const demoCredentials: DemoCredentials = {
    admin: {
      email: 'admin@trd.az',
      password: 'password123'
    },
    user: {
      email: 'memmed@trd.az',
      password: 'password123'
    },
    partner: {
      email: 'elvin@trd.az',
      password: 'password123'
    },
    otp: '123456'
  };

  const handleSubmit = async (data: LoginFormData) => {
    setLoginState(prev => ({ ...prev, isLoading: true, error: '' }));

    try {
      const success = await login(data.email, data.password, data.otp);
      
      if (success) {
        router.push('/dashboard');
      } else {
        if (!data.otp && data.email) {
          setLoginState(prev => ({ 
            ...prev, 
            showOtp: true, 
            error: 'OTP kodunu daxil edin',
            isLoading: false
          }));
        } else {
          setLoginState(prev => ({ 
            ...prev, 
            error: 'Yanlış email, şifrə və ya OTP kodu',
            showOtp: false,
            isLoading: false
          }));
        }
      }
    } catch (error) {
      setLoginState(prev => ({ 
        ...prev, 
        error: 'Giriş zamanı xəta baş verdi',
        isLoading: false
      }));
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
          isLoading={loginState.isLoading}
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
