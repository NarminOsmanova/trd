'use client';

import React from 'react';
import { Bell, Globe, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { user } = useAuth();
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const languages = [
    { code: 'az', name: 'Azərbaycan', flag: '🇦🇿' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ];

  const handleLanguageChange = (newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');
    router.push(newPath);
  };

  return (
    <header className="bg-white border-b border-gray-200">
      {/* Desktop Header */}
      <div className="hidden md:block">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Title Section */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-semibold text-gray-900 truncate">{title}</h1>
              {subtitle && (
                <p className="text-sm text-gray-600 mt-1 truncate">{subtitle}</p>
              )}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4 ml-4">
              {/* Language Selector */}
              <div className="relative">
                <Select value={locale} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-[140px] h-9 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">
                        {languages.find(lang => lang.code === locale)?.flag} {languages.find(lang => lang.code === locale)?.name}
                      </span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((language) => (
                      <SelectItem key={language.code} value={language.code}>
                        <div className="flex items-center space-x-2">
                          <span>{language.flag}</span>
                          <span>{language.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Notifications */}
              <button 
                title="Notifications" 
                aria-label="Notifications" 
                className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 truncate max-w-32">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.role === 'admin' ? 'Admin' : 'Menecer'}</p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Mobile Title */}
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold text-gray-900 truncate">{title}</h1>
              {subtitle && (
                <p className="text-xs text-gray-600 truncate">{subtitle}</p>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center space-x-2 ml-2">
              {/* Language Selector */}
              <Select value={locale} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[100px] h-8 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <div className="flex items-center space-x-1">
                    <Globe className="h-3 w-3 text-gray-500" />
                    <span className="text-xs font-medium">
                      {languages.find(lang => lang.code === locale)?.flag}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {languages.map((language) => (
                    <SelectItem key={language.code} value={language.code}>
                      <div className="flex items-center space-x-2">
                        <span>{language.flag}</span>
                        <span>{language.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Notifications */}
              <button 
                title="Notifications" 
                aria-label="Notifications"
                className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Avatar */}
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </div>


          {/* Mobile User Info */}
          <div className="mt-3 flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role === 'admin' ? t('sidebar.admin') : t('sidebar.manager')}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
