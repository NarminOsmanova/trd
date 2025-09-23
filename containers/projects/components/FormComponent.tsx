'use client';

import React, { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { projectFormSchema, type ProjectFormData } from '../constants/validations';
import { mockData } from '@/lib/mock-data';

interface FormComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => void;
  title: string;
  initialData?: Partial<ProjectFormData>;
}

export default function FormComponent({
  isOpen,
  onClose,
  onSubmit,
  title,
  initialData
}: FormComponentProps) {
  
  const [selectedUsers, setSelectedUsers] = useState<string[]>(initialData?.assignedUsers || []);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      targetBudget: undefined,
      monthlyBudget: undefined,
      assignedUsers: [],
      ...initialData
    }
  });

  const handleFormSubmit = async (data: ProjectFormData) => {
    try {
      const formData = {
        ...data,
        assignedUsers: selectedUsers
      };
      await onSubmit(formData);
      reset();
      setSelectedUsers([]);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedUsers([]);
    onClose();
  };

  const handleStatusChange = (value: string) => {
    setValue('status', value as 'active' | 'completed' | 'paused');
  };

  const toggleUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Layihə Adı *</Label>
            <Input
              {...register('name')}
              id="name"
              placeholder="Layihə adını daxil edin"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Təsvir</Label>
            <Textarea
              {...register('description')}
              id="description"
              rows={3}
              placeholder="Layihə haqqında ətraflı məlumat..."
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Status and Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status *</Label>
              <Select onValueChange={handleStatusChange} defaultValue={watch('status')}>
                <SelectTrigger>
                  <SelectValue placeholder="Status seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Aktiv</SelectItem>
                  <SelectItem value="completed">Tamamlandı</SelectItem>
                  <SelectItem value="paused">Dayandırılıb</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetBudget">Hədəf Büdcə</Label>
              <Input
                {...register('targetBudget')}
                type="number"
                inputMode="numeric"
                id="targetBudget"
                placeholder="Məs: 100000"
              />
              {errors.targetBudget && (
                <p className="text-sm text-red-600">{errors.targetBudget.message as string}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Başlama Tarixi *</Label>
              <Input
                {...register('startDate')}
                type="date"
                id="startDate"
              />
              {errors.startDate && (
                <p className="text-sm text-red-600">{errors.startDate.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Bitmə Tarixi</Label>
              <Input
                {...register('endDate')}
                type="date"
                id="endDate"
              />
              {errors.endDate && (
                <p className="text-sm text-red-600">{errors.endDate.message}</p>
              )}
            </div>


           
          </div>

          {/* Assigned Users & Partners */}
          <div className="space-y-2">
            <Label>Təyin Edilmiş Menecerlər *</Label>
            <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto">
              <div className="space-y-2">
                {mockData.users.filter(user => user.role === 'user').map((user) => (
                  <label
                    key={user.id}
                    className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
                  >
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => toggleUser(user.id)}
                    />
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            {errors.assignedUsers && (
              <p className="text-sm text-red-600">{errors.assignedUsers.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Partnyorlar</Label>
            <div className="border border-gray-300 rounded-lg p-4 max-h-40 overflow-y-auto">
              <div className="space-y-2">
                {mockData.users.filter(user => user.role === 'partner').map((user) => (
                  <label
                    key={user.id}
                    className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
                  >
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => toggleUser(user.id)}
                    />
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-500">Partnyor seçimi opsionaldır.</p>
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
