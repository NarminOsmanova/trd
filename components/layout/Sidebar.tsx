'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
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
  ChevronRight,
  Tags,
  Building,
  CreditCard,
  Handshake,
  Briefcase
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const navigation = [
  { nameKey: 'sidebar.dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'user'] },
  { nameKey: 'sidebar.projects', href: '/projects', icon: FolderOpen, roles: ['admin', 'user'] },
  { nameKey: 'sidebar.users', href: '/users', icon: Users, roles: ['admin'] },
  { nameKey: 'sidebar.transactions', href: '/transactions', icon: Receipt, roles: ['admin', 'user'] },
  { nameKey: 'sidebar.reports', href: '/reports', icon: BarChart3, roles: ['admin', 'user'] },
  { nameKey: 'sidebar.category', href: '/category', icon: Tags, roles: ['admin'] },
  { nameKey: 'sidebar.company', href: '/company', icon: Building, roles: ['admin'] },
  { nameKey: 'sidebar.partner', href: '/partner', icon: Handshake, roles: ['admin', 'partner'] },
  { nameKey: 'sidebar.position', href: '/position', icon: Briefcase, roles: ['admin', 'user'] },
  { nameKey: 'sidebar.debt', href: '/debt', icon: CreditCard, roles: ['admin', 'user'] },
  { nameKey: 'sidebar.notifications', href: '/notifications', icon: Bell, roles: ['admin', 'user'] },
  { nameKey: 'sidebar.settings', href: '/settings', icon: Settings, roles: ['admin'] },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const t = useTranslations();
  const [isMobile, setIsMobile] = useState(false);

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLinkClick = () => {
    // On mobile, close sidebar after navigation
    if (isMobile && !isCollapsed) {
      onToggle();
    }
  };

  return (
   
    <>
    {/* Overlay for mobile */}
    {!isCollapsed && (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        onClick={onToggle}
      />
    )}

    {/* Sidebar */}
    <div className={cn(
      "bg-white border-r border-gray-200 flex flex-col transition-all duration-300 h-full overflow-y-auto",
      // Mobile: fixed full width when open, hidden when collapsed
      "md:relative fixed inset-y-0 left-0 z-50",
      isCollapsed ? "-translate-x-full md:translate-x-0 md:w-16" : "translate-x-0 w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900">REPORT</span>
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
                {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user.role === 'admin' ? t('sidebar.admin') : 
                 user.role === 'partner' ? 'Partnyor' : t('sidebar.manager')}
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
            const itemName = t(item.nameKey);
            return (
              <Link
                key={item.nameKey}
                href={item.href}
                onClick={handleLinkClick}
                className={cn(
                  "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors group",
                  isActive
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}
                title={isCollapsed ? itemName : undefined}
              >
                <item.icon className={cn(
                  "flex-shrink-0",
                  isCollapsed ? "w-5 h-5" : "w-5 h-5 mr-3"
                )} />
                {!isCollapsed && <span>{itemName}</span>}
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
          title={isCollapsed ? t('sidebar.logout') : undefined}
        >
          <LogOut className={cn(
            "flex-shrink-0",
            isCollapsed ? "w-5 h-5" : "w-5 h-5 mr-3"
          )} />
          {!isCollapsed && <span>{t('sidebar.logout')}</span>}
        </button>
      </div>
    </div>
    </>
  );
}
