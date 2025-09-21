'use client';

import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Bell, 
  Globe, 
  Database,
  RefreshCw
} from 'lucide-react';
import { ProfileFormData, PasswordFormData, NotificationSettingsData, UserPreferencesData, SystemInfo, SupportInfo } from './types/settings-type';
import SettingsSidebar from './components/SettingsSidebar';
import ProfileTab from './components/ProfileTab';
import SecurityTab from './components/SecurityTab';
import NotificationsTab from './components/NotificationsTab';
import PreferencesTab from './components/PreferencesTab';
import SystemTab from './components/SystemTab';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

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
      console.log('Profile update:', data);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Profil uğurla yeniləndi');
    } catch (error) {
      console.error('Profile update error:', error);
      alert('Profil yenilənərkən xəta baş verdi');
    }
  };

  const handlePasswordChange = async (data: PasswordFormData) => {
    try {
      console.log('Password change:', data);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Şifrə uğurla dəyişdirildi');
    } catch (error) {
      console.error('Password change error:', error);
      alert('Şifrə dəyişdirərkən xəta baş verdi');
    }
  };

  const handleNotificationSettings = async (data: NotificationSettingsData) => {
    try {
      console.log('Notification settings:', data);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Bildiriş tənzimləmələri saxlanıldı');
    } catch (error) {
      console.error('Notification settings error:', error);
      alert('Bildiriş tənzimləmələri saxlanarkən xəta baş verdi');
    }
  };

  const handlePreferences = async (data: UserPreferencesData) => {
    try {
      console.log('User preferences:', data);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Tənzimləmələr saxlanıldı');
    } catch (error) {
      console.error('Preferences error:', error);
      alert('Tənzimləmələr saxlanarkən xəta baş verdi');
    }
  };

  const handleRefresh = () => {
    console.log('Refreshing settings');
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
      case 'system':
        return <SystemTab systemInfo={systemInfo} supportInfo={supportInfo} />;
      default:
        return <ProfileTab onSubmit={handleProfileUpdate} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Database className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Tənzimləmələr</h2>
          </div>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title="Yenilə"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Yenilə
          </button>
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content */}
        <div className="flex-1">
          {renderActiveTab()}
        </div>
      </div>
    </div>
  );
}
