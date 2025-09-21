'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Users, 
  Receipt, 
  BarChart3, 
  Bell, 
  Settings, 
  LogOut,
  Building2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'user'] },
  { name: 'Layihələr', href: '/projects', icon: FolderOpen, roles: ['admin', 'user'] },
  { name: 'İstifadəçilər', href: '/users', icon: Users, roles: ['admin'] },
  { name: 'Əməliyyatlar', href: '/transactions', icon: Receipt, roles: ['admin', 'user'] },
  { name: 'Hesabatlar', href: '/reports', icon: BarChart3, roles: ['admin', 'user'] },
  { name: 'Bildirişlər', href: '/notifications', icon: Bell, roles: ['admin', 'user'] },
  { name: 'Tənzimləmələr', href: '/settings', icon: Settings, roles: ['admin', 'user'] },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900">TRD</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* User Info */}
      {!isCollapsed && user && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user.role === 'admin' ? 'Admin' : 'İşçi'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation
          .filter(item => item.roles.includes(user?.role || 'user'))
          .map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors group",
                  isActive
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className={cn(
                  "flex-shrink-0",
                  isCollapsed ? "w-5 h-5" : "w-5 h-5 mr-3"
                )} />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors group",
            isCollapsed && "justify-center"
          )}
          title={isCollapsed ? 'Çıxış' : undefined}
        >
          <LogOut className={cn(
            "flex-shrink-0",
            isCollapsed ? "w-5 h-5" : "w-5 h-5 mr-3"
          )} />
          {!isCollapsed && <span>Çıxış</span>}
        </button>
      </div>
    </div>
  );
}
