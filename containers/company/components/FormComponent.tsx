'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { companyFormSchema, type CompanyFormData } from '../constants/validations';

interface Props {
  initialData?: Partial<CompanyFormData>;
  onSubmit: (data: CompanyFormData) => void;
  onCancel: () => void;
}

export default function CompanyForm({ initialData, onSubmit, onCancel }: Props) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CompanyFormData>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      title: '',
      logoUrl: '',
      isActive: true,
      ...initialData
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Başlıq *</Label>
          <Input {...register('title')} placeholder="Məs: TRD LLC" />
          {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Logo şəkli</Label>
          <Input type="file" accept="image/*" onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
              // Save data URL into form state
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              // We use setValue via register as hidden input fallback
              const hidden = document.getElementById('company-logo-hidden') as HTMLInputElement | null;
              if (hidden) hidden.value = String(reader.result);
            };
            reader.readAsDataURL(file);
          }} />
          {/* Hidden input bound to logoUrl to store data URL */}
          <input id="company-logo-hidden" type="hidden" {...register('logoUrl')} />
          {errors.logoUrl && <p className="text-sm text-red-600">{errors.logoUrl.message}</p>}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Ləğv et</Button>
        <Button type="submit" disabled={isSubmitting}>Saxla</Button>
      </div>
    </form>
  );
}


