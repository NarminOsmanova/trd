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
import { Textarea } from '@/components/ui/textarea';
import { transactionFormSchema, type TransactionFormData } from '../constants/validations';
import { mockData } from '@/lib/mock-data';

interface FormComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionFormData) => void;
  title: string;
  initialData?: Partial<TransactionFormData>;
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
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      projectId: '',
      type: 'expense',
      category: '',
      amount: 0,
      description: '',
      date: new Date().toISOString().split('T')[0],
      currency: 'AZN',
      ...initialData
    }
  });

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

  const handleTypeChange = (value: string) => {
    setValue('type', value as TransactionFormData['type']);
  };

  const handleProjectChange = (value: string) => {
    setValue('projectId', value);
  };

  const handleCategoryChange = (value: string) => {
    setValue('category', value);
  };

  const handleCurrencyChange = (value: string) => {
    setValue('currency', value as TransactionFormData['currency']);
  };

  const handleSourceChange = (value: string) => {
    setValue('source', value as NonNullable<TransactionFormData['source']>);
  };

  const handleToProjectChange = (value: string) => {
    setValue('toProjectId', value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Project */}
            <div className="space-y-2">
              <Label>Layihə *</Label>
              <Select onValueChange={handleProjectChange} defaultValue={watch('projectId')}>
                <SelectTrigger>
                  <SelectValue placeholder="Layihə seçin" />
                </SelectTrigger>
                <SelectContent>
                  {mockData.projects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.projectId && (
                <p className="text-sm text-red-600">{errors.projectId.message}</p>
              )}
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label>Əməliyyat Növü *</Label>
              <Select onValueChange={handleTypeChange} defaultValue={watch('type')}>
                <SelectTrigger>
                  <SelectValue placeholder="Növ seçin" />
                </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Mədaxil (Gəlir)</SelectItem>
                <SelectItem value="expense">Məxaric (Xərc)</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
                <SelectItem value="topup">Hesab artımı</SelectItem>
              </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-600">{errors.type.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div className="space-y-2">
              <Label>Kateqoriya *</Label>
              <Select onValueChange={handleCategoryChange} defaultValue={watch('category')}>
                <SelectTrigger>
                  <SelectValue placeholder="Kateqoriya seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="material">Material</SelectItem>
                  <SelectItem value="salary">Maaş</SelectItem>
                  <SelectItem value="equipment">Avadanlıq</SelectItem>
                  <SelectItem value="transport">Nəqliyyat</SelectItem>
                  <SelectItem value="utilities">Kommunal</SelectItem>
                  <SelectItem value="rent">Kirayə</SelectItem>
                  <SelectItem value="marketing">Marketinq</SelectItem>
                  <SelectItem value="other">Digər</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Məbləğ *</Label>
              <Input
                {...register('amount', { valueAsNumber: true })}
                type="number"
                id="amount"
                step="0.01"
                min="0"
                placeholder="0.00"
              />
              {errors.amount && (
                <p className="text-sm text-red-600">{errors.amount.message}</p>
              )}
            </div>
          </div>

        {/* Currency & Source */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Valyuta</Label>
            <Select onValueChange={handleCurrencyChange} defaultValue={watch('currency')}>
              <SelectTrigger>
                <SelectValue placeholder="Valyuta seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AZN">AZN</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {watch('type') === 'income' && (
            <div className="space-y-2">
              <Label>Hardan</Label>
              <Select onValueChange={handleSourceChange} defaultValue={watch('source')}>
                <SelectTrigger>
                  <SelectValue placeholder="Mənbə seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Kassa</SelectItem>
                  <SelectItem value="bank">Bank</SelectItem>
                  <SelectItem value="partner">Tərəfdaş</SelectItem>
                  <SelectItem value="own">Öz vəsaiti</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Transfer target project */}
        {watch('type') === 'transfer' && (
          <div className="space-y-2">
            <Label>Hara (Layihə)</Label>
            <Select onValueChange={handleToProjectChange} defaultValue={watch('toProjectId')}>
              <SelectTrigger>
                <SelectValue placeholder="Layihə seçin" />
              </SelectTrigger>
              <SelectContent>
                {mockData.projects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Receipt upload (required) */}
        <div className="space-y-2">
          <Label htmlFor="receipt">Qəbz şəkli *</Label>
          <Input type="file" id="receipt" accept="image/*" onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => setValue('receiptUrl', reader.result as string);
            reader.readAsDataURL(file);
          }} />
          {!watch('receiptUrl') && (
            <p className="text-xs text-gray-500">Qəbz şəkli zəruridir.</p>
          )}
        </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Tarix *</Label>
              <Input
                {...register('date')}
                type="date"
                id="date"
              />
              {errors.date && (
                <p className="text-sm text-red-600">{errors.date.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Təsvir</Label>
              <Textarea
                {...register('description')}
                id="description"
                rows={3}
                placeholder="Əməliyyat haqqında ətraflı məlumat..."
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description.message}</p>
              )}
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
