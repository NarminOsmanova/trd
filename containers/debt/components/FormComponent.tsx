'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { AlertCircle, CheckCircle, Shield } from 'lucide-react';
import DialogComponent from '@/components/modals/DialogComponent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { debtFormSchema, type DebtFormData } from '../constants/validations';
import { useSearchDebtors } from '@/lib/hooks/useDebt';
import { Debtor } from '../types/debt-type';

interface FormComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DebtFormData) => void;
  title: string;
  initialData?: Partial<DebtFormData>;
  isLoading?: boolean;
}

export default function FormComponent({
  isOpen,
  onClose,
  onSubmit,
  title,
  initialData,
  isLoading,
}: FormComponentProps) {
  const t = useTranslations('debt');
  const tCommon = useTranslations('common');
  const [debtorSearchTerm, setDebtorSearchTerm] = useState('');
  const [showDebtorDropdown, setShowDebtorDropdown] = useState(false);
  const [selectedDebtor, setSelectedDebtor] = useState<Debtor | null>(null);
  const [rememberDebtor, setRememberDebtor] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: debtorsData, isLoading: isLoadingDebtors } = useSearchDebtors(debtorSearchTerm);
  const debtors = debtorsData?.responseValue || [];

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
      debtorName: '',
      debtorId: undefined,
      amount: '' as unknown as number,
      currency: '0',
      description: '',
      dueDate: new Date().toISOString().split('T')[0],
      isNewDebtor: true,
    },
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDebtorDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      reset({
        debtorName: initialData.debtorName || '',
        debtorId: initialData.debtorId || undefined,
        amount: initialData.amount || ('' as unknown as number),
        currency: initialData.currency || '0',
        description: initialData.description || '',
        dueDate: initialData.dueDate || new Date().toISOString().split('T')[0],
        isNewDebtor: initialData.isNewDebtor ?? true,
      });
      setDebtorSearchTerm(initialData.debtorName || '');
      setSelectedDebtor(null);
      setRememberDebtor(initialData.isNewDebtor ?? true);
      setShowDebtorDropdown(false);
    } else {
      reset({
        debtorName: '',
        debtorId: undefined,
        amount: '' as unknown as number,
        currency: '0',
        description: '',
        dueDate: new Date().toISOString().split('T')[0],
        isNewDebtor: true,
      });
      setDebtorSearchTerm('');
      setSelectedDebtor(null);
      setRememberDebtor(false);
      setShowDebtorDropdown(false);
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data: DebtFormData) => {
    try {
      await onSubmit(data);
      reset();
      setDebtorSearchTerm('');
      setSelectedDebtor(null);
      setRememberDebtor(false);
      setShowDebtorDropdown(false);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleClose = () => {
    reset();
    setDebtorSearchTerm('');
    setSelectedDebtor(null);
    setRememberDebtor(false);
    setShowDebtorDropdown(false);
    onClose();
  };

  const handleCurrencyChange = (value: string) => {
    setValue('currency', value as '0' | '1' | '2', { shouldValidate: true });
  };

  const getCurrencyLabel = (value: string) => {
    switch (value) {
      case '0': return 'AZN';
      case '1': return 'USD';
      case '2': return 'EUR';
      default: return 'AZN';
    }
  };

  const getRiskStatusColor = (riskStatus: number) => {
    switch (riskStatus) {
      case 0: return 'bg-green-100 text-green-800 border-green-200';
      case 1: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 2: return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskStatusLabel = (riskStatus: number) => {
    switch (riskStatus) {
      case 0: return t('lowRisk');
      case 1: return t('mediumRisk');
      case 2: return t('highRisk');
      default: return 'N/A';
    }
  };

  const getRiskStatusIcon = (riskStatus: number) => {
    switch (riskStatus) {
      case 0: return <CheckCircle className="w-3 h-3" />;
      case 1: return <Shield className="w-3 h-3" />;
      case 2: return <AlertCircle className="w-3 h-3" />;
      default: return <Shield className="w-3 h-3" />;
    }
  };

  const handleDebtorSelect = (debtor: Debtor) => {
    setSelectedDebtor(debtor);
    setValue('debtorName', debtor.name, { shouldValidate: true });
    setValue('debtorId', debtor.id, { shouldValidate: true });
    setValue('isNewDebtor', false, { shouldValidate: true });
    setDebtorSearchTerm(debtor.name);
    setShowDebtorDropdown(false);
  };

  const handleDebtorNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue('debtorName', value, { shouldValidate: true });
    setDebtorSearchTerm(value);
    setShowDebtorDropdown(value.length > 0);
    if (value !== selectedDebtor?.name) {
      setSelectedDebtor(null);
      setValue('debtorId', undefined);
      setValue('isNewDebtor', true);
    }
  };

  const handleRememberDebtorChange = (checked: boolean) => {
    setRememberDebtor(checked);
    setValue('isNewDebtor', checked, { shouldValidate: true });
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
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">{t('loading')}</span>
          </div>
        ) : (
          <>
            {/* Debtor Name with Search */}
            <div className="space-y-2 relative" ref={dropdownRef}>
              <Label htmlFor="debtorName">{t('debtorName')} *</Label>
              <Input
                type="text"
                id="debtorName"
                value={watch('debtorName')}
                onChange={handleDebtorNameChange}
                onFocus={() => debtorSearchTerm.length > 0 && setShowDebtorDropdown(true)}
                placeholder={t('debtorNamePlaceholder')}
                className={selectedDebtor ? 'border-green-300 bg-green-50' : ''}
              />
              {errors.debtorName && (
                <p className="text-sm text-red-600">{errors.debtorName.message}</p>
              )}

              {/* Debtors Dropdown */}
              {showDebtorDropdown && debtorSearchTerm.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {isLoadingDebtors ? (
                    <div className="p-4 text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                  ) : debtors.length > 0 ? (
                    <div className="py-2">
                      {debtors.map((debtor) => (
                        <button
                          key={debtor.id}
                          type="button"
                          onClick={() => handleDebtorSelect(debtor)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between transition-colors"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{debtor.name}</p>
                          </div>
                          <Badge className={`${getRiskStatusColor(debtor.riskStatus)} flex items-center gap-1 border`}>
                            {getRiskStatusIcon(debtor.riskStatus)}
                            {getRiskStatusLabel(debtor.riskStatus)}
                          </Badge>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      <p className="text-sm">{t('noResultsFound')}</p>
                      <p className="text-xs mt-1">{t('addNewDebtor')}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Remember Debtor Checkbox */}
              {!selectedDebtor && watch('debtorName').length > 0 && (
                <div className="flex items-center space-x-2 mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Checkbox
                    id="rememberDebtor"
                    checked={rememberDebtor}
                    onCheckedChange={handleRememberDebtorChange}
                  />
                  <Label
                    htmlFor="rememberDebtor"
                    className="text-sm font-medium text-blue-900 cursor-pointer"
                  >
                    {t('rememberDebtor')}
                  </Label>
                </div>
              )}

              {/* Selected Debtor Info */}
              {selectedDebtor && (
                <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-900">
                        {t('selectedDebtor')} {selectedDebtor.name}
                      </p>
                    </div>
                    <Badge className={`${getRiskStatusColor(selectedDebtor.riskStatus)} flex items-center gap-1 border`}>
                      {getRiskStatusIcon(selectedDebtor.riskStatus)}
                      {getRiskStatusLabel(selectedDebtor.riskStatus)}
                    </Badge>
                  </div>
                </div>
              )}
            </div>

            {/* Amount and Currency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">{tCommon('amount')} *</Label>
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
                <Label>{tCommon('currency')} *</Label>
                <Select
                  key={watch('currency') || '0'}
                  value={watch('currency') || '0'}
                  onValueChange={handleCurrencyChange}
                >
                  <SelectTrigger>
                    <SelectValue>
                      {getCurrencyLabel(watch('currency') || '0')}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">AZN</SelectItem>
                    <SelectItem value="1">USD</SelectItem>
                    <SelectItem value="2">EUR</SelectItem>
                  </SelectContent>
                </Select>
                {errors.currency && (
                  <p className="text-sm text-red-600">{errors.currency.message}</p>
                )}
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <Label htmlFor="dueDate">{t('dueDate')} *</Label>
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
              <Label htmlFor="description">{tCommon('description')}</Label>
              <Textarea
                {...register('description')}
                id="description"
                rows={3}
                placeholder={tCommon('descriptionPlaceholder')}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                {tCommon('cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? tCommon('saving') : tCommon('save')}
              </Button>
            </div>
          </>
        )}
      </form>
    </DialogComponent>
  );
}
