'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { userFormSchema, type UserFormData } from '../constants/validations';

interface FormComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  title: string;
  initialData?: Partial<UserFormData>;
}

export default function FormComponent({
  isOpen,
  onClose,
  onSubmit,
  title,
  initialData
}: FormComponentProps) {
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: 'user',
      isActive: true,
      ...initialData
    }
  });

  const handleFormSubmit = async (data: UserFormData) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleRoleChange = (value: string) => {
    setValue('role', value as 'admin' | 'user');
  };

  const handleActiveChange = (checked: boolean) => {
    setValue('isActive', checked);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Ad Soyad *</Label>
            <Input
              {...register('name')}
              id="name"
              placeholder="İstifadəçinin adını daxil edin"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              {...register('email')}
              type="email"
              id="email"
              placeholder="email@example.com"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Telefon</Label>
            <Input
              {...register('phone')}
              type="tel"
              id="phone"
              placeholder="+994 50 123 45 67"
            />
            {errors.phone && (
              <p className="text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          {/* Role and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Rol *</Label>
              <Select onValueChange={handleRoleChange} defaultValue={watch('role')}>
                <SelectTrigger>
                  <SelectValue placeholder="Rol seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">İşçi</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={watch('isActive')}
                  onCheckedChange={handleActiveChange}
                />
                <Label htmlFor="isActive" className="text-sm font-normal">
                  Aktiv istifadəçi
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Ləğv Et
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saxlanılır...' : 'Saxla'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
