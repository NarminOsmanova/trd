'use client';

import React from 'react';
import { 
  Database,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslations } from 'next-intl';
import { useUpdateUserInfos, useCurrentUser } from '@/lib/hooks/useUsers';
import { ProfileFormData, PasswordFormData, NotificationSettings, UserPreferences, SystemInfo, SupportInfo } from './types/settings-type';
import SettingsSidebar from './components/SettingsSidebar';
import ProfileTab from './components/ProfileTab';
import SecurityTab from './components/SecurityTab';
import NotificationsTab from './components/NotificationsTab';
import PreferencesTab from './components/PreferencesTab';
import SystemTab from './components/SystemTab';
import UsersManagementTab from './components/UsersManagementTab';

interface SettingsPageProps {
  activeTab: string;
}

export default function SettingsPage({ activeTab }: SettingsPageProps) {
  const t = useTranslations('settings.page');
  const { refreshUserData } = useAuth();
  const { data: currentUserData } = useCurrentUser();
  const updateUserInfosMutation = useUpdateUserInfos();

  const apiUser = currentUserData;
  const apiUserRaw = currentUserData?.responseValue;
  // Mock system info
  const systemInfo: SystemInfo = {
    version: 'v1.0.0',
    build: '2024.02.15',
    environment: 'Development',
    apiStatus: 'online',
    databaseStatus: 'connected',
    lastBackup: '2 saat əvvəl'
  };

  // Mock support info
  const supportInfo: SupportInfo = {
    email: 'support@trd.az',
    phone: '+994 12 345 67 89',
    workingHours: 'Bazar ertəsi - Cümə, 09:00 - 18:00'
  };

  const handleProfileUpdate = async (data: ProfileFormData) => {
    try {
      if (!apiUserRaw) {
        toast.error('İstifadəçi məlumatları tapılmadı');
        return;
      }
      await updateUserInfosMutation.mutateAsync({
        id: Number(apiUserRaw.id),
        email: data.email,
        phone: data.phone,
        roleId: apiUserRaw?.role?.id || 0,
        positionId: data.positionId,
        sets: data.sets
      });
      toast.success('Profil uğurla yeniləndi');
      await refreshUserData();
    } catch (error: any) {
      console.error('Profile update error:', error);
      const errorMessage = error?.response?.data?.message || 'Profil yenilənərkən xəta baş verdi';
      toast.error(errorMessage);
    }
  };

  const handlePasswordChange = async (data: PasswordFormData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Password change error:', error);
    }
  };

  const handleNotificationSettings = async (data: NotificationSettings) => {
    try {
      console.log('Notification settings:', data);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Notification settings error:', error);
    }
  };

  const handlePreferences = async (data: UserPreferences) => {
    try {
      console.log('User preferences:', data);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Preferences error:', error);
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab onSubmit={handleProfileUpdate} />;
      case 'security':
        return <SecurityTab onSubmit={handlePasswordChange} />;
      case 'notifications':
        return <NotificationsTab onSubmit={handleNotificationSettings} />;
      case 'preferences':
        return <PreferencesTab onSubmit={handlePreferences} />;
      case 'users':
        return <UsersManagementTab />;
      case 'system':
        return <SystemTab systemInfo={systemInfo} supportInfo={supportInfo} />;
      default:
        return <ProfileTab onSubmit={handleProfileUpdate} />;
    }
  };

  return (
    <div className="space-y-6">
    
      {/* Settings Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <SettingsSidebar activeTab={activeTab} />

        {/* Main Content */}
        <div className="flex-1">
          {renderActiveTab()}
        </div>
      </div>
    </div>
  );
}
