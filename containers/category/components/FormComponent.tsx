'use client';

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Flag } from 'lucide-react';
import { 
  useProjectCategory, 
  useCreateProjectCategory, 
  useUpdateProjectCategory,
  useProjectCategoriesByProjectId
} from '@/lib/hooks/useProjectCategory';
import { useAllProjects } from '@/lib/hooks/useProject';
import { CategoryScope } from '../types/category-type';
import { toast } from 'sonner';
import { CategoryFormSchema, CategoryFormData } from '../constants/validations';

interface Props {
  categoryId: number | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CategoryForm({ categoryId, onSuccess, onCancel }: Props) {
  const t = useTranslations('category');
  const [activeLanguage, setActiveLanguage] = useState<'az' | 'en' | 'ru'>('az');

  const languages = [
    { 
      value: 'az' as const, 
      label: 'Azərbaycan', 
      flag: (
        <svg className="w-5 h-5" viewBox="0 0 640 480">
          <path fill="#3f9c35" d="M0 0h640v160H0z"/>
          <path fill="#ed2939" d="M0 160h640v160H0z"/>
          <path fill="#00b9e4" d="M0 320h640v160H0z"/>
          <circle cx="304" cy="240" r="72" fill="#fff"/>
          <circle cx="320" cy="240" r="60" fill="#ed2939"/>
          <path fill="#fff" d="m384 200 7.7 21.5 20.6-9.8-9.8 20.7L424 240l-21.5 7.7 9.8 20.6-20.7-9.8L384 280l-7.7-21.5-20.6 9.8 9.8-20.7L344 240l21.5-7.7-9.8-20.6 20.7 9.8z"/>
        </svg>
      )
    },
    { 
      value: 'en' as const, 
      label: 'English', 
      flag: (
        <svg className="w-5 h-5" viewBox="0 0 640 480">
          <path fill="#012169" d="M0 0h640v480H0z"/>
          <path fill="#FFF" d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0z"/>
          <path fill="#C8102E" d="m424 281 216 159v40L369 281zm-184 20 6 35L54 480H0zM640 0v3L391 191l2-44L590 0zM0 0l239 176h-60L0 42z"/>
          <path fill="#FFF" d="M241 0v480h160V0zM0 160v160h640V160z"/>
          <path fill="#C8102E" d="M0 193v96h640v-96zM273 0v480h96V0z"/>
        </svg>
      )
    },
    { 
      value: 'ru' as const, 
      label: 'Русский', 
      flag: (
        <svg className="w-5 h-5" viewBox="0 0 640 480">
          <path fill="#fff" d="M0 0h640v160H0z"/>
          <path fill="#0039a6" d="M0 160h640v160H0z"/>
          <path fill="#d52b1e" d="M0 320h640v160H0z"/>
        </svg>
      )
    },
  ];

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch, control, reset } = useForm<CategoryFormData>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      projectId: 0,
      scope: CategoryScope.Expense,
      orderNo: 0,
      parentId: 0,
      sets: [
        { language: 'az', name: '' },
        { language: 'en', name: '' },
        { language: 'ru', name: '' }
      ]
    }
  });

  // Fetch all projects for select
  const { data: projectsData, isLoading: isLoadingProjects } = useAllProjects();
  const projects = (projectsData as any)?.responseValue || [];
  
  // Watch projectId to fetch parent categories
  const selectedProjectId = watch('projectId');
  
  // Fetch parent categories by project ID
  const { categories: parentCategories, isLoading: isLoadingParentCategories } = useProjectCategoriesByProjectId(
    selectedProjectId || null,
    '',
    !!selectedProjectId
  );

  // Fetch category data if editing
  const { data: categoryData, isLoading: isLoadingCategory } = useProjectCategory(categoryId, !!categoryId);

  // Mutations
  const createMutation = useCreateProjectCategory();
  const updateMutation = useUpdateProjectCategory();

  // Populate form when editing
  useEffect(() => {
    // Wait for projects to load before populating form
    if (isLoadingProjects) {
      return;
    }
    
    if (categoryData?.responseValue && categoryId) {
      const category = categoryData.responseValue;
      
      // Reset form with all values at once
      const formData = {
        projectId: Number(category.projectId) || 0,
        scope: Number(category.scope) as 0 | 1,
        orderNo: Number(category.orderNo) || 0,
        parentId: Number(category.parentId) || 0,
        sets: category.sets && category.sets.length > 0 
          ? category.sets 
          : [
              { language: 'az', name: '' },
              { language: 'en', name: '' },
              { language: 'ru', name: '' }
            ]
      };
      
      reset(formData);
      
      // Force update the field value
      setTimeout(() => {
        setValue('projectId', formData.projectId);
      }, 100);
      
    } else if (!categoryId) {
      // Reset to default values when creating new
      reset({
        projectId: 0,
        scope: CategoryScope.Expense,
        orderNo: 0,
        parentId: 0,
        sets: [
          { language: 'az', name: '' },
          { language: 'en', name: '' },
          { language: 'ru', name: '' }
        ]
      });
    }
  }, [categoryData, categoryId, reset, projects.length, isLoadingProjects]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      // Remove parentId if it's 0
      const payload = {
        ...data,
        ...(data.parentId === 0 ? {} : { parentId: data.parentId })
      };
      
      // Remove parentId key completely if it's 0
      if (data.parentId === 0) {
        delete (payload as any).parentId;
      }

      if (categoryId) {
        // Update
        await updateMutation.mutateAsync({
          id: categoryId,
          ...payload
        });
        toast.success(t('updateSuccess'));
      } else {
        // Create
        await createMutation.mutateAsync(payload);
        toast.success(t('createSuccess'));
      }
      onSuccess();
    } catch (error: any) {
      console.error('Form submission error:', error);
      
      // Handle validation errors
      const validationErrors = error?.response?.data?.errors;
      if (validationErrors) {
        // Display all validation errors
        Object.keys(validationErrors).forEach((key) => {
          const messages = validationErrors[key];
          if (Array.isArray(messages)) {
            messages.forEach((msg: string) => {
              toast.error(msg);
            });
          }
        });
      } else {
        // Display general error message
        toast.error(error?.response?.data?.message || t('error'));
      }
    }
  };

  if (isLoadingCategory) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" key={categoryId || 'new'}>
      {/* Multi-language names */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Globe className="w-5 h-5 text-gray-600" />
          <Label className="text-base font-semibold">{t('name')} *</Label>
        </div>
        
        {/* Language Selection Buttons */}
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
              <span className="flex-shrink-0">{lang.flag}</span>
              <span className="font-medium">{lang.label}</span>
            </Button>
          ))}
        </div>

        {/* Language Input Fields */}
        <div className="space-y-4">
          {/* Azerbaijani */}
          <div 
            className={`bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200 ${
              activeLanguage === 'az' ? 'block' : 'hidden'
            }`}
          >
            <div className="space-y-2">
              <Label htmlFor="name_az" className="text-sm font-medium text-gray-700">
                {t('name')} *
              </Label>
              <Input
                id="name_az"
                {...register('sets.0.name')}
                placeholder={t('name')}
                className="h-12 text-base"
              />
              {errors.sets?.[0]?.name && (
                <p className="text-sm text-red-600">{errors.sets[0].name.message}</p>
              )}
            </div>
          </div>

          {/* English */}
          <div 
            className={`bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200 ${
              activeLanguage === 'en' ? 'block' : 'hidden'
            }`}
          >
            <div className="space-y-2">
              <Label htmlFor="name_en" className="text-sm font-medium text-gray-700">
                {t('name')} *
              </Label>
              <Input
                id="name_en"
                {...register('sets.1.name')}
                placeholder={t('name')}
                className="h-12 text-base"
              />
              {errors.sets?.[1]?.name && (
                <p className="text-sm text-red-600">{errors.sets[1].name.message}</p>
              )}
            </div>
          </div>

          {/* Russian */}
          <div 
            className={`bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200 ${
              activeLanguage === 'ru' ? 'block' : 'hidden'
            }`}
          >
            <div className="space-y-2">
              <Label htmlFor="name_ru" className="text-sm font-medium text-gray-700">
                {t('name')} *
              </Label>
              <Input
                id="name_ru"
                {...register('sets.2.name')}
                placeholder={t('name')}
                className="h-12 text-base"
              />
              {errors.sets?.[2]?.name && (
                <p className="text-sm text-red-600">{errors.sets[2].name.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Project Select */}
      <div className="space-y-2">
        <Label>{t('project')} *</Label>
        <Controller
          key={`project-${categoryId || 'new'}`}
          name="projectId"
          control={control}
          render={({ field }) => {
            const selectedValue = field.value && field.value > 0 ? String(field.value) : "";
            
            return (
              <Select 
                value={selectedValue || undefined}
                onValueChange={(value) => {
                  field.onChange(Number(value));
                }}
                disabled={isLoadingProjects}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingProjects ? t('loading') : t('selectProject')} />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project: any) => (
                    <SelectItem key={project.id} value={String(project.id)}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          }}
        />
        {errors.projectId && <p className="text-sm text-red-600">{errors.projectId.message}</p>}
      </div>

      {/* Scope (Type) */}
      <div className="space-y-2">
        <Label>{t('scope')} *</Label>
        <Controller
          name="scope"
          control={control}
          render={({ field }) => (
            <Select 
              value={String(field.value)} 
              onValueChange={(value) => field.onChange(Number(value) as 0 | 1)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('selectScope')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={String(CategoryScope.Income)}>{t('income')}</SelectItem>
                <SelectItem value={String(CategoryScope.Expense)}>{t('expense')}</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.scope && <p className="text-sm text-red-600">{t('scope')}</p>}
      </div>

      {/* Order and Parent */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t('orderNo')} *</Label>
          <Input type="number" inputMode="numeric" {...register('orderNo', { valueAsNumber: true })} />
          {errors.orderNo && <p className="text-sm text-red-600">{errors.orderNo.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>{t('parentId')}</Label>
          <Controller
            name="parentId"
            control={control}
            render={({ field }) => (
              <Select 
                value={field.value ? String(field.value) : '0'} 
                onValueChange={(value) => field.onChange(Number(value))}
                disabled={!selectedProjectId || isLoadingParentCategories}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    !selectedProjectId 
                      ? t('selectProjectFirst') 
                      : isLoadingParentCategories 
                        ? t('loading') 
                        : t('selectParentOptional')
                  } />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">{t('noParent')}</SelectItem>
                  {parentCategories
                    .filter(cat => cat.id !== categoryId)
                    .map((category) => {
                      const categoryName = category.sets?.find(s => s.language === 'az')?.name 
                        || category.sets?.[0]?.name 
                        || 'N/A';
                      return (
                        <SelectItem key={category.id} value={String(category.id)}>
                          {categoryName}
                        </SelectItem>
                      );
                    })}
                </SelectContent>
              </Select>
            )}
          />
          {errors.parentId && <p className="text-sm text-red-600">{errors.parentId.message}</p>}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>{t('cancel')}</Button>
        <Button type="submit" disabled={isSubmitting || isLoadingProjects}>
          {isSubmitting ? t('saving') : t('save')}
        </Button>
      </div>
    </form>
  );
}
