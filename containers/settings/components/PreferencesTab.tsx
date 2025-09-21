'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Save
} from 'lucide-react';
import { userPreferencesSchema, type UserPreferencesData } from '../constants/validations';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PreferencesTabProps {
  onSubmit: (data: UserPreferencesData) => void;
}

export default function PreferencesTab({ onSubmit }: PreferencesTabProps) {
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<UserPreferencesData>({
    resolver: zodResolver(userPreferencesSchema),
    defaultValues: {
      language: 'az',
      timezone: 'UTC+4',
      dateFormat: 'DD/MM/YYYY',
      currency: 'AZN'
    }
  });

  const handleLanguageChange = (value: string) => {
    setValue('language', value as 'az' | 'en' | 'ru');
  };

  const handleTimezoneChange = (value: string) => {
    setValue('timezone', value);
  };

  const handleDateFormatChange = (value: string) => {
    setValue('dateFormat', value as 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD');
  };

  const handleCurrencyChange = (value: string) => {
    setValue('currency', value as 'AZN' | 'USD' | 'EUR');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Tənzimləmələr</h3>
        <p className="text-sm text-gray-600 mt-1">İstifadəçi təcrübəsi tənzimləmələri</p>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <Label>Dil</Label>
            <Select onValueChange={handleLanguageChange} defaultValue={watch('language')}>
              <SelectTrigger>
                <SelectValue placeholder="Dil seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="az">Azərbaycan</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ru">Русский</SelectItem>
              </SelectContent>
            </Select>
            {errors.language && (
              <p className="text-sm text-red-600">{errors.language.message}</p>
            )}
          </div>

          <div>
            <Label>Vaxt Qurşağı</Label>
            <Select onValueChange={handleTimezoneChange} defaultValue={watch('timezone')}>
              <SelectTrigger>
                <SelectValue placeholder="Vaxt qurşağı seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC+4">UTC+4 (Bakı)</SelectItem>
                <SelectItem value="UTC+0">UTC+0 (London)</SelectItem>
                <SelectItem value="UTC-5">UTC-5 (New York)</SelectItem>
              </SelectContent>
            </Select>
            {errors.timezone && (
              <p className="text-sm text-red-600">{errors.timezone.message}</p>
            )}
          </div>

          <div>
            <Label>Tarix Formatı</Label>
            <Select onValueChange={handleDateFormatChange} defaultValue={watch('dateFormat')}>
              <SelectTrigger>
                <SelectValue placeholder="Tarix formatı seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
            {errors.dateFormat && (
              <p className="text-sm text-red-600">{errors.dateFormat.message}</p>
            )}
          </div>

          <div>
            <Label>Para Vahidi</Label>
            <Select onValueChange={handleCurrencyChange} defaultValue={watch('currency')}>
              <SelectTrigger>
                <SelectValue placeholder="Para vahidi seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AZN">AZN (Azərbaycan Manatı)</SelectItem>
                <SelectItem value="USD">USD (Amerika Dolları)</SelectItem>
                <SelectItem value="EUR">EUR (Euro)</SelectItem>
              </SelectContent>
            </Select>
            {errors.currency && (
              <p className="text-sm text-red-600">{errors.currency.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            <Save className="w-4 h-4 mr-2" />
            Tənzimləmələri Saxla
          </Button>
        </div>
      </div>
    </div>
  );
}
