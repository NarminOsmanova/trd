'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CategoryFormData } from '@/types';

const schema = z.object({
  name: z.string().min(2, 'Ad ən az 2 simvol olmalıdır'),
  order: z.preprocess(v => Number(v), z.number().min(0).max(9999)),
  type: z.union([z.literal(0), z.literal(1)]),
  isActive: z.boolean().optional()
});

interface Props {
  initialData?: Partial<CategoryFormData>;
  onSubmit: (data: CategoryFormData) => void;
  onCancel: () => void;
}

export default function CategoryForm({ initialData, onSubmit, onCancel }: Props) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm<CategoryFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      order: 0,
      type: 0,
      isActive: true,
      ...initialData
    }
  });

  const handleTypeChange = (value: string) => setValue('type', Number(value) as 0 | 1);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Ad *</Label>
          <Input {...register('name')} placeholder="Məs: Material" />
          {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Sıra *</Label>
          <Input type="number" inputMode="numeric" {...register('order', { valueAsNumber: true })} />
          {errors.order && <p className="text-sm text-red-600">Sıra 0-9999 arası olmalıdır</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tip *</Label>
        <Select onValueChange={handleTypeChange} defaultValue={String(watch('type'))}>
          <SelectTrigger>
            <SelectValue placeholder="Tip seçin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Xərc</SelectItem>
            <SelectItem value="1">Gəlir</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && <p className="text-sm text-red-600">Tip mütləqdir</p>}
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Ləğv et</Button>
        <Button type="submit" disabled={isSubmitting}>Saxla</Button>
      </div>
    </form>
  );
}


