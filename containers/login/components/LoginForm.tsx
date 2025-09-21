'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { loginSchema, type LoginFormData } from '../constants/validations';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface LoginFormProps {
  showPassword: boolean;
  showOtp: boolean;
  isLoading: boolean;
  error: string;
  onSubmit: (data: LoginFormData) => void;
  onTogglePassword: () => void;
  onBackToCredentials: () => void;
}

export default function LoginForm({
  showPassword,
  showOtp,
  isLoading,
  error,
  onSubmit,
  onTogglePassword,
  onBackToCredentials
}: LoginFormProps) {
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      otp: ''
    }
  });

  const handleBackToCredentials = () => {
    setValue('otp', '');
    onBackToCredentials();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {showOtp ? 'OTP Təsdiqi' : 'Sistemə Giriş'}
        </h2>
        <p className="text-gray-600 text-sm">
          {showOtp 
            ? 'Email-inizə göndərilən OTP kodunu daxil edin'
            : 'Email və şifrənizi daxil edin'
          }
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {!showOtp ? (
          <>
            {/* Email Field */}
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  {...register('email')}
                  type="email"
                  id="email"
                  className="pl-10"
                  placeholder="admin@trd.az"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <Label htmlFor="password">Şifrə</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="pl-10 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={onTogglePassword}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </>
        ) : (
          <>
            {/* OTP Field */}
            <div>
              <Label htmlFor="otp">OTP Kodu</Label>
              <Input
                {...register('otp')}
                type="text"
                id="otp"
                title="OTP Code"
                aria-label="OTP Code"
                className="text-center text-lg tracking-widest"
                placeholder="123456"
                maxLength={6}
              />
              {errors.otp && (
                <p className="mt-1 text-sm text-red-600">{errors.otp.message}</p>
              )}
            </div>
            
            <button
              type="button"
              onClick={handleBackToCredentials}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              ← Email və şifrəyə qayıt
            </button>
          </>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Giriş edilir...' : (showOtp ? 'Təsdiq Et' : 'Giriş Et')}
        </Button>
      </form>
    </div>
  );
}
