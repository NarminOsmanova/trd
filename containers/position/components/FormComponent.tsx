
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Globe } from 'lucide-react';
import DialogComponent from '@/components/modals/DialogComponent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { positionInputSchema, type PositionFormData, type PositionInputData } from '../constants/validations';
import type { Position } from '../types/position-type';

interface FormComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PositionFormData) => Promise<void>;
  title: string;
  initialData?: Position | null;
  isLoading?: boolean;
}

export default function FormComponent({
  isOpen,
  onClose,
  onSubmit,
  title,
  initialData,
  isLoading = false
}: FormComponentProps) {
  const t = useTranslations('position');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState<'az' | 'en' | 'ru'>('az');

  const languages = [
    { value: 'az' as const, label: t('az'), flag: '🇦🇿' },
    { value: 'en' as const, label: t('en'), flag: '🇬🇧' },
    { value: 'ru' as const, label: t('ru'), flag: '🇷🇺' },
  ];

  // Initialize form data from initialData
  const getInitialValues = useCallback((): PositionInputData => {
    if (initialData && initialData.positionSets) {
      const data: PositionInputData = {
        name_az: '',
        name_en: '',
        name_ru: '',
      };
      initialData.positionSets.forEach((ps) => {
        if (ps.language === 'az') data.name_az = ps.name;
        if (ps.language === 'en') data.name_en = ps.name;
        if (ps.language === 'ru') data.name_ru = ps.name;
      });
      return data;
    }
    return {
      name_az: '',
      name_en: '',
      name_ru: '',
    };
  }, [initialData]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<PositionInputData>({
    resolver: zodResolver(positionInputSchema),
    mode: 'onSubmit',
    defaultValues: getInitialValues()
  });

  useEffect(() => {
    if (isOpen) {
      const initialValues = getInitialValues();
      reset(initialValues);
      // Set active language to first available language or 'az'
      if (initialData && initialData.positionSets && initialData.positionSets.length > 0) {
        setActiveLanguage(initialData.positionSets[0].language as 'az' | 'en' | 'ru');
      } else {
        setActiveLanguage('az');
      }
    }
  }, [initialData, isOpen, getInitialValues, reset]);

  const handleFormSubmit = async (data: PositionInputData) => {
    setIsSubmitting(true);
    try {
      // Transform form data to PositionFormData format
      const positionSets = languages
        .map(lang => ({
          name: data[`name_${lang.value}`] || '',
          language: lang.value
        }))
        .filter(ps => ps.name.trim() !== ''); // Only include filled languages

      await onSubmit({ positionSets } as PositionFormData);
      reset();
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setActiveLanguage('az');
    onClose();
  };

  return (
    <DialogComponent
      open={isOpen}
      setOpen={handleClose}
      title={title}
      size="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">{t('loading')}</span>
          </div>
        )}

        {/* Language Selection Buttons */}
        {!isLoading && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Globe className="w-5 h-5 text-gray-600" />
              <Label className="text-base font-semibold">{t('languageTranslations')}</Label>
            </div>
          
          <div className="grid grid-cols-3 gap-3">
            {languages.map((lang) => (
              <Button
                key={lang.value}
                type="button"
                variant={activeLanguage === lang.value ? 'default' : 'outline'}
                onClick={() => setActiveLanguage(lang.value)}
                className={`flex items-center justify-center gap-2 h-12 transition-all duration-200 ${
                  activeLanguage === lang.value
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                    : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="font-medium">{lang.label}</span>
              </Button>
            ))}
          </div>
          </div>
        )}

        {/* All Language Name Inputs (only show active) */}
        {!isLoading && (
          <div className="space-y-4">
          {languages.map((lang) => (
            <div 
              key={lang.value}
              className={`bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200 ${
                activeLanguage === lang.value ? 'block' : 'hidden'
              }`}
            >
              <div className="space-y-2">
                <Label htmlFor={`name_${lang.value}`} className="text-sm font-medium text-gray-700">
                  {t('name')} ({lang.label}) *
                </Label>
                <Input
                  id={`name_${lang.value}`}
                  {...register(`name_${lang.value}` as keyof PositionInputData)}
                  placeholder={t('namePlaceholder')}
                  className="h-12 text-base"
                />
                {errors[`name_${lang.value}` as keyof PositionInputData] && (
                  <p className="text-sm text-red-600">
                    {t(errors[`name_${lang.value}` as keyof PositionInputData]?.message as string)}
                  </p>
                )}
              </div>
            </div>
          ))}
          </div>
        )}

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            {t('cancel')}
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? t('saving') : t('save')}
          </Button>
        </div>
      </form>
    </DialogComponent>
  );
}

