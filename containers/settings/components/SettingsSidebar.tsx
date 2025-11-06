'use client';

import React from 'react';
import Link from 'next/link';
import { 
  User, 
  Shield, 
  Bell, 
  Globe, 
  Database
} from 'lucide-react';
import { SettingsTab } from '../types/settings-type';
import { useTranslations } from 'next-intl';

interface SettingsSidebarProps {
  activeTab: string;
}

export default function SettingsSidebar({
  activeTab
}: SettingsSidebarProps) {
  const t = useTranslations('settings.sidebar');
  
  const tabs: SettingsTab[] = [
    { id: 'profile', label: t('profile'), icon: 'User' },
    { id: 'security', label: t('security'), icon: 'Shield' },
    { id: 'notifications', label: t('notifications'), icon: 'Bell' },
    { id: 'preferences', label: t('preferences'), icon: 'Globe' },
    { id: 'users', label: t('users'), icon: 'User' },
    { id: 'system', label: t('system'), icon: 'Database' }
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'User':
        return <User className="w-4 h-4" />;
      case 'Shield':
        return <Shield className="w-4 h-4" />;
      case 'Bell':
        return <Bell className="w-4 h-4" />;
      case 'Globe':
        return <Globe className="w-4 h-4" />;
      case 'Database':
        return <Database className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="lg:w-64 flex-shrink-0">
      <nav className="bg-white rounded-xl shadow-sm border border-gray-200 p-1">
        <div className="space-y-1">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={`/settings/${tab.id}`}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {getIcon(tab.icon)}
              <span className="ml-3">{tab.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
