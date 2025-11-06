'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  User, 
  Mail, 
  Phone, 
  Camera,
  Save,
  Briefcase,
  Shield
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrentUser, useUpdateAvatar } from '@/lib/hooks/useUsers';
import { useAllPositions } from '@/lib/hooks/usePosition';
import { profileFormSchema, type ProfileFormData } from '../constants/validations';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

interface ProfileTabProps {
  onSubmit: (data: ProfileFormData) => void;
}

type LanguageTab = 'az' | 'en' | 'ru';

export default function ProfileTab({ onSubmit }: ProfileTabProps) {
  const t = useTranslations('settings.profile');
  const { user } = useAuth();
  const { data: currentUserData } = useCurrentUser();
  const { data: positionsData } = useAllPositions();
  const updateAvatarMutation = useUpdateAvatar();
  const [avatar, setAvatar] = useState<File | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<LanguageTab>('az');
  
  const apiUserRaw = currentUserData?.responseValue;
  console.log("apiUser", apiUserRaw);
  const positions = positionsData?.responseValue || [];
console.log("apiUserRaw", apiUserRaw);
console.log("positions", positions);
console.log("positionsData", positionsData);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      email: '',
      phone: '',
      positionId: 0,
      sets: [
        { language: 'az', firstName: '', lastName: '' },
        { language: 'en', firstName: '', lastName: '' },
        { language: 'ru', firstName: '', lastName: '' },
      ]
    }
  });

  const { fields } = useFieldArray({
    control,
    name: 'sets'
  });

  // Set form values when API data loads
  useEffect(() => {
    if (apiUserRaw) {
      setValue('email', apiUserRaw.email || '');
      setValue('phone', apiUserRaw.phone || '');
      if (apiUserRaw.position?.id) {
        setValue('positionId', apiUserRaw.position.id);
      }
      const languages: LanguageTab[] = ['az', 'en', 'ru'];
      languages.forEach((lang, idx) => {
        const langSet = Array.isArray(apiUserRaw.sets)
          ? apiUserRaw.sets.find((s: any) => s.language === lang)
          : undefined;
        setValue(`sets.${idx}.firstName`, langSet?.firstName || '');
        setValue(`sets.${idx}.lastName`, langSet?.lastName || '');
        setValue(`sets.${idx}.language`, lang);
      });
      setActiveLanguage('az');
    }
  }, [apiUserRaw, setValue]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(file);
      
      // Upload avatar immediately
      updateAvatarMutation.mutate(file, {
        onSuccess: () => {
          toast.success('Avatar uğurla yeniləndi');
        },
        onError: (error: any) => {
          console.error('Avatar upload error:', error);
          const errorMessage = error?.response?.data?.message || 'Avatar yüklənərkən xəta baş verdi';
          toast.error(errorMessage);
          setAvatar(null);
        },
      });
    }
  };

  const activeLanguageIndex = fields.findIndex(f => f.language === activeLanguage);
  
  const languageLabels = {
    az: { label: t('lang.az'), flag: '🇦🇿' },
    en: { label: t('lang.en'), flag: '🇬🇧' },
    ru: { label: t('lang.ru'), flag: '🇷🇺' }
  };
console.log("apiUser", apiUserRaw);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{t('title')}</h3>
        <p className="text-sm text-gray-600 mt-1">{t('subtitle')}</p>
      </div>
      
      <div className="p-6">
        {/* Profile Picture */}
        <div className="flex items-center space-x-6 mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center relative">
            {apiUserRaw?.avatar ? (
              <img src={apiUserRaw.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-2xl font-medium text-blue-600">
                {(() => {
                  const idx = ['az','en','ru'].indexOf(activeLanguage);
                  const sets = watch('sets');
                  const fn = sets[idx]?.firstName || '';
                  const ln = sets[idx]?.lastName || '';
                  return `${fn?.[0] || ''}${ln?.[0] || ''}`;
                })()}
              </span>
            )}
            <label 
              htmlFor="avatar-upload"
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Camera className="w-3 h-3" />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
                aria-label="Upload avatar"
              />
            </label>
          </div>
          <div>
            <h4 className="text-lg font-medium text-gray-900">
              {(() => {
                const idx = ['az','en','ru'].indexOf(activeLanguage);
                const sets = watch('sets');
                const fn = sets[idx]?.firstName || '';
                const ln = sets[idx]?.lastName || '';
                const composed = `${fn} ${ln}`.trim();
                const fallback = apiUserRaw?.sets && Array.isArray(apiUserRaw.sets) && apiUserRaw.sets[0]?.firstName ? `${apiUserRaw.sets[0]?.firstName} ${apiUserRaw.sets[0]?.lastName}` : '';
                return composed || fallback;
              })()}
            </h4>
            <p className="text-sm text-gray-600">{apiUserRaw?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">{apiUserRaw?.role?.name || ''}</span>
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">{apiUserRaw?.position?.name || ''}</span>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Language Tabs */}
          <div>
            <Label className="mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              {t('name')}
            </Label>
            <div className="flex gap-2 mb-4">
              {(['az', 'en', 'ru'] as LanguageTab[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveLanguage(lang)}
                  className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg border transition-all ${
                    activeLanguage === lang
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2">{languageLabels[lang].flag}</span>
                  {languageLabels[lang].label}
                </button>
              ))}
            </div>

            {/* Name Inputs for Active Language */}
            {activeLanguageIndex !== -1 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`firstName-${activeLanguage}`}>{t('firstName')}</Label>
                    <Input
                      {...register(`sets.${activeLanguageIndex}.firstName`)}
                      id={`firstName-${activeLanguage}`}
                      placeholder="Adınız"
                      className="mt-1"
                    />
                    {errors.sets?.[activeLanguageIndex]?.firstName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.sets[activeLanguageIndex]?.firstName?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor={`lastName-${activeLanguage}`}>{t('lastName')}</Label>
                    <Input
                      {...register(`sets.${activeLanguageIndex}.lastName`)}
                      id={`lastName-${activeLanguage}`}
                      placeholder="Soyadınız"
                      className="mt-1"
                    />
                    {errors.sets?.[activeLanguageIndex]?.lastName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.sets[activeLanguageIndex]?.lastName?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div>
              <Label htmlFor="email">{t('email')}</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  {...register('email')}
                  type="email"
                  id="email"
                  className="pl-10"
                  placeholder="email@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone">{t('phone')}</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  {...register('phone')}
                  type="tel"
                  id="phone"
                  placeholder="+994XXXXXXXXX"
                  className="pl-10"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            {/* Position */}
            <div>
              <Label htmlFor="positionId">{t('position')}</Label>
              <Controller
                name="positionId"
                control={control}
                render={({ field }) => (
                  <Select 
                    value={field.value && field.value > 0 ? field.value.toString() : undefined} 
                    onValueChange={(value) => field.onChange(parseInt(value))}
                  >
                    <SelectTrigger className="w-full">
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
                        <SelectValue placeholder={t('selectPosition')} />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((position) => (
                        <SelectItem key={position.id} value={position.id.toString()}>
                          {position.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.positionId && (
                <p className="mt-1 text-sm text-red-600">{errors.positionId.message}</p>
              )}
            </div>

            {/* Role (Read-only) */}
            <div>
              <Label htmlFor="role">{t('role')}</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  id="role"
                  value={apiUserRaw?.role?.name || ''}
                  disabled
                  className="pl-10 bg-gray-50 text-gray-500"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">{t('roleReadonly')}</p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? t('saving') : t('submit')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
