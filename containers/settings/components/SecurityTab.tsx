'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Key,
  Eye,
  EyeOff,
  Save
} from 'lucide-react';
import { passwordFormSchema, type PasswordFormData } from '../constants/validations';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface SecurityTabProps {
  onSubmit: (data: PasswordFormData) => void;
}

export default function SecurityTab({ onSubmit }: SecurityTabProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const handleFormSubmit = async (data: PasswordFormData) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error('Password change error:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Təhlükəsizlik</h3>
        <p className="text-sm text-gray-600 mt-1">Şifrə və təhlükəsizlik tənzimləmələri</p>
      </div>
      
      <div className="p-6">
        {/* Password Change */}
        <div className="mb-8">
          <h4 className="text-md font-medium text-gray-900 mb-4">Şifrəni Dəyişdir</h4>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Cari Şifrə *</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  {...register('currentPassword')}
                  type={showCurrentPassword ? 'text' : 'password'}
                  id="currentPassword"
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="newPassword">Yeni Şifrə *</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  {...register('newPassword')}
                  type={showNewPassword ? 'text' : 'password'}
                  id="newPassword"
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Şifrəni Təsdiq Et *</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="destructive"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Dəyişdirilir...' : 'Şifrəni Dəyişdir'}
              </Button>
            </div>
          </form>
        </div>

        {/* Security Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h5 className="text-sm font-medium text-gray-900 mb-2">Təhlükəsizlik Məsləhətləri</h5>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Şifrəniz ən azı 8 simvol olmalıdır</li>
            <li>• Böyük və kiçik hərflər, rəqəmlər və xüsusi simvollar istifadə edin</li>
            <li>• Şifrənizi düzgün yadda saxlayın və heç kimə verməyin</li>
            <li>• Müntəzəm olaraq şifrənizi yeniləyin</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
