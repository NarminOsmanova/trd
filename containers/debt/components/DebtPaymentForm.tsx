'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Calendar, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import DialogComponent from '@/components/modals/DialogComponent';
import { debtPaymentFormSchema, DebtPaymentFormData } from '../constants/validations';

interface DebtPaymentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DebtPaymentFormData, paymentId?: number) => void;
  title: string;
  initialData?: Partial<DebtPaymentFormData>;
  paymentId?: number | null;
  isLoading?: boolean;
  debtInfo?: {
    debtorName: string;
    totalAmount: number;
    remainingAmount: number;
    currency: string;
  };
}

export default function DebtPaymentForm({
  isOpen,
  onClose,
  onSubmit,
  title,
  initialData,
  paymentId,
  isLoading = false,
  debtInfo,
}: DebtPaymentFormProps) {
  const t = useTranslations('debt');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DebtPaymentFormData>({
    resolver: zodResolver(debtPaymentFormSchema),
    defaultValues: {
      amount: 0,
      paymentDate: new Date().toISOString().split('T')[0],
      note: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          amount: initialData.amount || 0,
          paymentDate: initialData.paymentDate || new Date().toISOString().split('T')[0],
          note: initialData.note || '',
        });
      } else {
        reset({
          amount: 0,
          paymentDate: new Date().toISOString().split('T')[0],
          note: '',
        });
      }
    }
  }, [isOpen, initialData, reset]);

  const handleFormSubmit = async (data: DebtPaymentFormData) => {
    try {
      await onSubmit(data, paymentId || undefined);
      reset();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <DialogComponent
      open={isOpen}
      setOpen={(open) => !open && handleClose()}
      title={title}
      size="md"
      loading={isLoading}
      onClose={handleClose}
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={handleClose}>
            {t('cancel')}
          </Button>
          <Button
            type="submit"
            form="payment-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? t('saving') : t('save')}
          </Button>
        </div>
      }
      showFooter={true}
    >
      {/* Debt Info Card */}
      {debtInfo && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">{t('debtor')}</h3>
            <span className="text-base font-bold text-gray-900">{debtInfo.debtorName}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-600">{t('totalAmount')}</p>
              <p className="text-sm font-semibold text-gray-900">
                {debtInfo.totalAmount} {debtInfo.currency}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">{t('remainingAmount')}</p>
              <p className="text-sm font-semibold text-orange-600">
                {debtInfo.remainingAmount} {debtInfo.currency}
              </p>
            </div>
          </div>
        </div>
      )}

      <form id="payment-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Amount */}
        <div>
          <Label htmlFor="amount" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            {t('paymentAmount')} *
          </Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder={t('enterAmount')}
            {...register('amount', { valueAsNumber: true })}
            className={errors.amount ? 'border-red-500' : ''}
          />
          {errors.amount && (
            <p className="text-sm text-red-500 mt-1">{errors.amount.message}</p>
          )}
          {debtInfo && (
            <p className="text-xs text-gray-500 mt-1">
              {t('maxPayment')}: {debtInfo.remainingAmount} {debtInfo.currency}
            </p>
          )}
        </div>

        {/* Payment Date */}
        <div>
          <Label htmlFor="paymentDate" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {t('paymentDate')} *
          </Label>
          <Input
            id="paymentDate"
            type="date"
            {...register('paymentDate')}
            className={errors.paymentDate ? 'border-red-500' : ''}
          />
          {errors.paymentDate && (
            <p className="text-sm text-red-500 mt-1">{errors.paymentDate.message}</p>
          )}
        </div>

        {/* Note */}
        <div>
          <Label htmlFor="note">{t('note')}</Label>
          <Textarea
            id="note"
            placeholder={t('enterNote')}
            rows={3}
            {...register('note')}
            className={errors.note ? 'border-red-500' : ''}
          />
          {errors.note && (
            <p className="text-sm text-red-500 mt-1">{errors.note.message}</p>
          )}
        </div>
      </form>
    </DialogComponent>
  );
}

