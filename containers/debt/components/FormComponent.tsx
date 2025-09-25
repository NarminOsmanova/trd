'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import DialogComponent from '@/components/modals/DialogComponent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { debtFormSchema, type DebtFormData } from '../constants/validations';

interface FormComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DebtFormData) => void;
  title: string;
  initialData?: Partial<DebtFormData>;
}

export default function FormComponent({
  isOpen,
  onClose,
  onSubmit,
  title,
  initialData,
}: FormComponentProps) {
  const t = useTranslations();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<DebtFormData>({
    resolver: zodResolver(debtFormSchema),
    defaultValues: {
      amount: 0,
      currency: 'AZN',
      debtor: '',
      description: '',
      dueDate: new Date().toISOString().split('T')[0],
      ...initialData,
    },
  });

  const handleFormSubmit = async (data: DebtFormData) => {
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

  const handleCurrencyChange = (value: string) => {
    setValue('currency', value as DebtFormData['currency']);
  };

  return (
    <DialogComponent
      open={isOpen}
      setOpen={(open) => !open && handleClose()}
      title={title}
      size="lg"
      maxHeight="max-h-[90vh]"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Amount and Currency */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount">{t('common.amount')} *</Label>
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

          <div className="space-y-2">
            <Label>{t('common.currency')} *</Label>
            <Select
              onValueChange={handleCurrencyChange}
              defaultValue={watch('currency')}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('common.currency')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AZN">AZN</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
              </SelectContent>
            </Select>
            {errors.currency && (
              <p className="text-sm text-red-600">{errors.currency.message}</p>
            )}
          </div>
        </div>

        {/* Debtor */}
        <div className="space-y-2">
          <Label htmlFor="debtor">Kimə verildiyi *</Label>
          <Input
            {...register('debtor')}
            type="text"
            id="debtor"
            placeholder="Borclu adını daxil edin"
          />
          {errors.debtor && (
            <p className="text-sm text-red-600">{errors.debtor.message}</p>
          )}
        </div>

        {/* Due Date */}
        <div className="space-y-2">
          <Label htmlFor="dueDate">Müddət tarixi *</Label>
          <Input
            {...register('dueDate')}
            type="date"
            id="dueDate"
          />
          {errors.dueDate && (
            <p className="text-sm text-red-600">{errors.dueDate.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">{t('common.description')}</Label>
          <Textarea
            {...register('description')}
            id="description"
            rows={3}
            placeholder="Borç haqqında ətraflı məlumat..."
          />
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t('common.saving') : t('common.save')}
          </Button>
        </div>
      </form>
    </DialogComponent>
  );
}
