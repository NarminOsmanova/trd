'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, X } from 'lucide-react';
import { companyFormSchema, type CompanyFormData } from '../constants/validations';
import { Company } from '../types/company-type';

interface Props {
  initialData?: Company | null;
  onSubmit: (data: CompanyFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const getCurrencyLabel = (currency: string) => {
  switch (currency) {
    case '0': return 'AZN';
    case '1': return 'USD';
    case '2': return 'EUR';
    default: return 'AZN';
  }
};

export default function CompanyForm({ initialData, onSubmit, onCancel, isLoading }: Props) {
  const t = useTranslations('company');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [existingLogoUrl, setExistingLogoUrl] = useState<string | null>(null);
  
  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<CompanyFormData>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      title: '',
      currentBalance: '' as unknown as number,
      currency: '0',
      budgetLimit: '' as unknown as number,
    }
  });

  // initialData dəyişəndə formu yenilə
  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || '',
        currentBalance: initialData.currentBalance,
        currency: initialData.currency?.toString() as '0' | '1' | '2' || '0',
        budgetLimit: initialData.budgetLimit || ('' as unknown as number),
      });
      // Mövcud logo URL-ni saxla
      setExistingLogoUrl(initialData.logo || null);
      setLogoFile(null);
      setLogoPreviewUrl(null);
    } else {
      reset({
        title: '',
        currentBalance: '' as unknown as number,
        currency: '0',
        budgetLimit: '' as unknown as number,
      });
      setExistingLogoUrl(null);
      setLogoFile(null);
      setLogoPreviewUrl(null);
    }
  }, [initialData, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setValue('logo', file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setLogoPreviewUrl(previewUrl);
    }
  };

  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (logoPreviewUrl) {
        URL.revokeObjectURL(logoPreviewUrl);
      }
    };
  }, [logoPreviewUrl]);

  const handleFormSubmit = (data: CompanyFormData) => {
    // Yalnız yeni logo file yüklənibsə onu göndəririk
    // Əks halda logo sahəsini boş saxlayırıq ki, backend mövcud logonu saxlasın
    onSubmit({
      ...data,
      logo: logoFile || undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">{t('loading')}</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t('titleLabel')} *</Label>
          <Input {...register('title')} placeholder={t('titlePlaceholder')} />
          {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label>{t('logoLabel')}</Label>
          
          {/* Yeni yüklənən logo preview */}
          {logoPreviewUrl && logoFile && (
            <div className="mb-2 flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="w-12 h-12 relative rounded-lg overflow-hidden border border-green-300">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={logoPreviewUrl} 
                  alt="New logo preview" 
                  className="object-cover w-full h-full" 
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-green-700">{t('newLogo')}</p>
                <p className="text-xs text-green-600">{logoFile.name}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setLogoFile(null);
                  setLogoPreviewUrl(null);
                  setValue('logo', undefined);
                }}
                className="text-red-600 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
          
          {/* Mövcud logo preview (yalnız yeni logo yoxdursa) */}
          {existingLogoUrl && !logoFile && (
            <div className="mb-2 flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="w-12 h-12 relative rounded-lg overflow-hidden border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={existingLogoUrl} 
                  alt="Current logo" 
                  className="object-cover w-full h-full" 
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">{t('currentLogo')}</p>
                <p className="text-xs text-gray-500">{t('currentLogoDescription')}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setExistingLogoUrl(null)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
          
          <Input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
          />
          {errors.logo && <p className="text-sm text-red-600">{errors.logo.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t('currentBalanceLabel')} *</Label>
          <Input 
            {...register('currentBalance')} 
            type="number" 
            placeholder={t('currentBalancePlaceholder')} 
          />
          {errors.currentBalance && <p className="text-sm text-red-600">{errors.currentBalance.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>{t('currencyLabel')} *</Label>
          <Select
            key={watch('currency') || '0'}
            value={watch('currency') || '0'}
            onValueChange={(value) => setValue('currency', value as '0' | '1' | '2', { shouldValidate: true })}
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
          {errors.currency && <p className="text-sm text-red-600">{errors.currency.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t('budgetLimitLabel')}</Label>
        <Input 
          {...register('budgetLimit')} 
          type="number" 
          placeholder={t('budgetLimitPlaceholder')} 
        />
        {errors.budgetLimit && <p className="text-sm text-red-600">{errors.budgetLimit.message}</p>}
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting || isLoading}>
          {t('cancel')}
        </Button>
        <Button type="submit" disabled={isSubmitting || isLoading}>
          {isSubmitting ? t('saving') : t('save')}
        </Button>
      </div>
    </form>
  );
}
