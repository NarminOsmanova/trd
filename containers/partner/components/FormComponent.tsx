'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import DialogComponent from '@/components/modals/DialogComponent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { partnerFormSchema, type PartnerFormData } from '../constants/validations';

interface FormComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PartnerFormData) => void;
  title: string;
  initialData?: Partial<PartnerFormData>;
}

export default function FormComponent({
  isOpen,
  onClose,
  onSubmit,
  title,
  initialData
}: FormComponentProps) {
  const t = useTranslations();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch
  } = useForm<PartnerFormData>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      sharePercentage: 0,
      isActive: true,
      ...initialData
    }
  });

  const handleFormSubmit = async (data: PartnerFormData) => {
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

  return (
    <DialogComponent
      open={isOpen}
      setOpen={(open) => !open && handleClose()}
      title={title}
      size="md"
      maxHeight="max-h-[90vh]"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Ad *</Label>
          <Input
            {...register('name')}
            id="name"
            placeholder="Partnyor adı"
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            {...register('email')}
            type="email"
            id="email"
            placeholder="partnyor@example.com"
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Telefon</Label>
          <Input
            {...register('phone')}
            type="tel"
            id="phone"
            placeholder="+994 12 345 67 89"
          />
          {errors.phone && (
            <p className="text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Company */}
        <div className="space-y-2">
          <Label htmlFor="company">Şirkət</Label>
          <Input
            {...register('company')}
            id="company"
            placeholder="Şirkət adı"
          />
          {errors.company && (
            <p className="text-sm text-red-600">{errors.company.message}</p>
          )}
        </div>

        {/* Share Percentage */}
        <div className="space-y-2">
          <Label htmlFor="sharePercentage">Hissə Faizi (%) *</Label>
          <Input
            {...register('sharePercentage', { valueAsNumber: true })}
            type="number"
            id="sharePercentage"
            min="0"
            max="100"
            step="0.1"
            placeholder="0.0"
          />
          {errors.sharePercentage && (
            <p className="text-sm text-red-600">{errors.sharePercentage.message}</p>
          )}
        </div>

        {/* Active Status */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isActive"
            checked={watch('isActive')}
            onCheckedChange={(checked) => setValue('isActive', checked as boolean)}
          />
          <Label htmlFor="isActive">Aktiv</Label>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleClose}>
            Ləğv Et
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saxlanılır...' : 'Saxla'}
          </Button>
        </div>
      </form>
    </DialogComponent>
  );
}
