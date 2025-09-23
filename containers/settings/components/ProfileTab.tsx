'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  User, 
  Mail, 
  Phone, 
  Camera,
  Save
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { profileFormSchema, type ProfileFormData } from '../constants/validations';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface ProfileTabProps {
  onSubmit: (data: ProfileFormData) => void;
}

export default function ProfileTab({ onSubmit }: ProfileTabProps) {
  const { user } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || ''
    }
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Profil Məlumatları</h3>
        <p className="text-sm text-gray-600 mt-1">Şəxsi məlumatlarınızı yeniləyin</p>
      </div>
      
      <div className="p-6">
        {/* Profile Picture */}
        <div className="flex items-center space-x-6 mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center relative">
            <span className="text-2xl font-medium text-blue-600">
              {user?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </span>
            <button 
              title="Change Profile Picture" 
              aria-label="Change Profile Picture" 
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
            >
              <Camera className="w-3 h-3" />
            </button>
          </div>
          <div>
            <h4 className="text-lg font-medium text-gray-900">{user?.name}</h4>
            <p className="text-sm text-gray-600">{user?.email}</p>
            <p className="text-xs text-gray-500 mt-1">
              {user?.role === 'admin' ? 'Admin' : 'Menecer'}
            </p>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Ad Soyad *</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  {...register('name')}
                  type="text"
                  id="name"
                  className="pl-10"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="email"
                  id="email"
                  value={user?.email}
                  disabled
                  className="pl-10 bg-gray-50 text-gray-500"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Email dəyişdirilə bilməz</p>
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Telefon</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                {...register('phone')}
                type="tel"
                id="phone"
                placeholder="+994XXXXXXXXX"
                className="pl-10"
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Saxlanılır...' : 'Saxla'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
