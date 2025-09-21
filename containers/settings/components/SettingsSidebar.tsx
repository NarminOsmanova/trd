'use client';

import React from 'react';
import { 
  User, 
  Shield, 
  Bell, 
  Globe, 
  Database
} from 'lucide-react';
import { SettingsTab } from '../types/settings-type';

interface SettingsSidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function SettingsSidebar({
  activeTab,
  onTabChange
}: SettingsSidebarProps) {
  
  const tabs: SettingsTab[] = [
    { id: 'profile', label: 'Profil', icon: 'User' },
    { id: 'security', label: 'Təhlükəsizlik', icon: 'Shield' },
    { id: 'notifications', label: 'Bildirişlər', icon: 'Bell' },
    { id: 'preferences', label: 'Tənzimləmələr', icon: 'Globe' },
    { id: 'system', label: 'Sistem', icon: 'Database' }
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
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {getIcon(tab.icon)}
              <span className="ml-3">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
