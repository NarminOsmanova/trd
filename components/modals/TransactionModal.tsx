'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Calendar, DollarSign, FileText, TrendingUp, TrendingDown } from 'lucide-react';
import { transactionSchema, type TransactionFormData } from '@/lib/validations';
import { mockData } from '@/lib/mock-data';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionFormData) => void;
  title: string;
  initialData?: Partial<TransactionFormData>;
}

export default function TransactionModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title,
  initialData 
}: TransactionModalProps) {
  const [selectedType, setSelectedType] = useState<'income' | 'expense'>('expense');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      projectId: '',
      type: 'expense',
      amount: 0,
      category: 'material',
      description: '',
      date: new Date().toISOString().split('T')[0],
      ...initialData
    }
  });

  const watchedType = watch('type');

  const handleFormSubmit = async (data: TransactionFormData) => {
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

  const handleTypeChange = (type: 'income' | 'expense') => {
    setSelectedType(type);
    setValue('type', type);
  };

  const categories = [
    { value: 'material', label: 'Material', icon: '🔨' },
    { value: 'salary', label: 'Maaş', icon: '💰' },
    { value: 'equipment', label: 'Avadanlıq', icon: '⚙️' },
    { value: 'transport', label: 'Nəqliyyat', icon: '🚗' },
    { value: 'utilities', label: 'Kommunal', icon: '⚡' },
    { value: 'rent', label: 'Kirayə', icon: '🏠' },
    { value: 'marketing', label: 'Marketinq', icon: '📢' },
    { value: 'other', label: 'Digər', icon: '📋' }
  ];

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
          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Əməliyyat Növü *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`flex items-center justify-center p-4 border-2 rounded-lg transition-colors ${
                  watchedType === 'income'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                <span className="font-medium">Daxilolma</span>
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`flex items-center justify-center p-4 border-2 rounded-lg transition-colors ${
                  watchedType === 'expense'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <TrendingDown className="w-5 h-5 mr-2" />
                <span className="font-medium">Xərc</span>
              </button>
            </div>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>

          {/* Project Selection */}
          <div>
            <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-1">
              Layihə *
            </label>
            <select
              {...register('projectId')}
              id="projectId"
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Layihə seçin</option>
              {mockData.projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            {errors.projectId && (
              <p className="mt-1 text-sm text-red-600">{errors.projectId.message}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Məbləğ (AZN) *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('amount', { valueAsNumber: true })}
                type="number"
                id="amount"
                step="0.01"
                min="0.01"
                title="Amount"
                aria-label="Amount"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Kateqoriya *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {categories.map((category) => (
                <label
                  key={category.value}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg border border-gray-200"
                >
                  <input
                    {...register('category')}
                    type="radio"
                    value={category.value}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-lg">{category.icon}</span>
                  <span className="text-sm font-medium">{category.label}</span>
                </label>
              ))}
            </div>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Tarix *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('date')}
                type="date"
                id="date"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Təsvir
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                {...register('description')}
                id="description"
                rows={3}
                title="Transaction Description"
                aria-label="Transaction Description"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Əməliyyat haqqında ətraflı məlumat..."
              />
            </div>
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
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
              className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-lg focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                watchedType === 'income'
                  ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                  : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
              }`}
            >
              {isSubmitting ? 'Saxlanılır...' : (
                watchedType === 'income' ? 'Vəsait Əlavə Et' : 'Xərc Əlavə Et'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
