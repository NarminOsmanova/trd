'use client';

import React from 'react';
import { Bell, Search, User} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { user } = useAuth();

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
              {/* Search */}
              <div className="relative hidden lg:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Axtarış..."
                  className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
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
                  <p className="text-xs text-gray-500">{user?.role === 'admin' ? 'Admin' : 'İşçi'}</p>
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
              {/* Search Button */}
              <button 
                title="Search" 
                aria-label="Search"
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

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

          {/* Mobile Search Bar */}
          <div className="mt-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Axtarış..."
                className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Mobile User Info */}
          <div className="mt-3 flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role === 'admin' ? 'Admin' : 'İşçi'}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
