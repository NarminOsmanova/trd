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
import { notificationFormSchema, type NotificationFormData } from '../constants/validations';
import { mockData } from '@/lib/mock-data';

interface FormComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NotificationFormData) => void;
  title: string;
  initialData?: Partial<NotificationFormData>;
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
  } = useForm<NotificationFormData>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      title: '',
      message: '',
      type: 'info',
      userId: '',
      ...initialData
    }
  });

  const handleFormSubmit = async (data: NotificationFormData) => {
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

  const handleTypeChange = (value: string) => {
    setValue('type', value as 'info' | 'warning' | 'success' | 'error');
  };

  const handleUserChange = (value: string) => {
    setValue('userId', value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Başlıq *</Label>
            <Input
              {...register('title')}
              id="title"
              placeholder="Bildiriş başlığını daxil edin"
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Mesaj *</Label>
            <textarea
              {...register('message')}
              id="message"
              rows={3}
              className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Bildiriş mesajını daxil edin"
            />
            {errors.message && (
              <p className="text-sm text-red-600">{errors.message.message}</p>
            )}
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label>Növ *</Label>
            <Select onValueChange={handleTypeChange} defaultValue={watch('type')}>
              <SelectTrigger>
                <SelectValue placeholder="Bildiriş növünü seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="info">Məlumat</SelectItem>
                <SelectItem value="warning">Xəbərdarlıq</SelectItem>
                <SelectItem value="success">Uğur</SelectItem>
                <SelectItem value="error">Xəta</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>

          {/* User */}
          <div className="space-y-2">
            <Label>İstifadəçi *</Label>
            <Select onValueChange={handleUserChange} defaultValue={watch('userId')}>
              <SelectTrigger>
                <SelectValue placeholder="İstifadəçi seçin" />
              </SelectTrigger>
              <SelectContent>
                {mockData.users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.userId && (
              <p className="text-sm text-red-600">{errors.userId.message}</p>
            )}
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
