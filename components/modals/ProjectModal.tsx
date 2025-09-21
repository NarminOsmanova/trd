'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Calendar, Users, FileText } from 'lucide-react';
import { projectSchema, type ProjectFormData } from '@/lib/validations';
import { mockUsers } from '@/lib/mock-data';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => void;
  title: string;
  initialData?: Partial<ProjectFormData>;
}

export default function ProjectModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title,
  initialData 
}: ProjectModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      assignedUsers: [],
      ...initialData
    }
  });

  const selectedUsers = watch('assignedUsers');

  const handleFormSubmit = async (data: ProjectFormData) => {
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

  const toggleUser = (userId: string) => {
    const currentUsers = selectedUsers || [];
    const newUsers = currentUsers.includes(userId)
      ? currentUsers.filter(id => id !== userId)
      : [...currentUsers, userId];
    
    // Update form value
    const event = {
      target: {
        name: 'assignedUsers',
        value: newUsers
      }
    };
    register('assignedUsers').onChange(event as any);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button title="Close" aria-label="Close"
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
          {/* Project Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Layihə Adı *
            </label>
                    <input
                      {...register('name')}
                      type="text"
                      id="name"
                      title="Project Name"
                      aria-label="Project Name"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Layihə adını daxil edin"
                    />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Təsvir
            </label>
                    <textarea
                      {...register('description')}
                      id="description"
                      rows={3}
                      title="Project Description"
                      aria-label="Project Description"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Layihə haqqında ətraflı məlumat..."
                    />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Status and Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                {...register('status')}
                id="status"
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">Aktiv</option>
                <option value="completed">Tamamlandı</option>
                <option value="paused">Dayandırılıb</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Başlama Tarixi *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('startDate')}
                  type="date"
                  id="startDate"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                Bitmə Tarixi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('endDate')}
                  type="date"
                  id="endDate"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          {/* Assigned Users */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Təyin Edilmiş İşçilər *
            </label>
            <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto">
              <div className="space-y-2">
                {mockUsers.filter(user => user.role === 'user').map((user) => (
                  <label
                    key={user.id}
                    className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
                  >
                    <input
                      type="checkbox"
                      checked={selectedUsers?.includes(user.id) || false}
                      onChange={() => toggleUser(user.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
              <p className="mt-1 text-sm text-red-600">{errors.assignedUsers.message}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Ləğv Et
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Saxlanılır...' : 'Saxla'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
