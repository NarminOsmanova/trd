'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Save
} from 'lucide-react';
import { notificationSettingsSchema, type NotificationSettingsData } from '../constants/validations';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface NotificationsTabProps {
  onSubmit: (data: NotificationSettingsData) => void;
}

export default function NotificationsTab({ onSubmit }: NotificationsTabProps) {
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<NotificationSettingsData>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: false,
      budgetWarnings: true,
      weeklyReports: true
    }
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Bildiriş Tənzimləmələri</h3>
        <p className="text-sm text-gray-600 mt-1">Bildiriş növlərini idarə edin</p>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Email Bildirişləri</h4>
              <p className="text-xs text-gray-600">Yeni əməliyyat və layihə bildirişləri</p>
            </div>
            <Checkbox
              {...register('emailNotifications')}
              title="Email Notifications"
              aria-label="Email Notifications"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">SMS Bildirişləri</h4>
              <p className="text-xs text-gray-600">Vacib bildirişlər üçün SMS</p>
            </div>
            <Checkbox
              {...register('smsNotifications')}
              title="SMS Notifications"
              aria-label="SMS Notifications"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Büdcə Xəbərdarlıqları</h4>
              <p className="text-xs text-gray-600">Büdcə həddi aşıldıqda xəbərdarlıq</p>
            </div>
            <Checkbox
              {...register('budgetWarnings')}
              title="Budget Warnings"
              aria-label="Budget Warnings"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Həftəlik Hesabatlar</h4>
              <p className="text-xs text-gray-600">Həftəlik layihə və xərc hesabatları</p>
            </div>
            <Checkbox
              {...register('weeklyReports')}
              title="Weekly Reports"
              aria-label="Weekly Reports"
            />
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
