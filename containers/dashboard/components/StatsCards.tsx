'use client';

import React from 'react';
import { 
  FolderOpen, 
  Users, 
  Receipt, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Activity
} from 'lucide-react';
import { DashboardStats } from '../types/dashboard-type';
import { formatCurrency } from '@/lib/utils';

interface StatsCardsProps {
  stats: DashboardStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'FolderOpen':
        return <FolderOpen className="w-6 h-6" />;
      case 'Activity':
        return <Activity className="w-6 h-6" />;
      case 'Users':
        return <Users className="w-6 h-6" />;
      case 'DollarSign':
        return <DollarSign className="w-6 h-6" />;
      case 'TrendingDown':
        return <TrendingDown className="w-6 h-6" />;
      case 'TrendingUp':
        return <TrendingUp className="w-6 h-6" />;
      default:
        return <FolderOpen className="w-6 h-6" />;
    }
  };

  const statCards = [
    {
      title: 'Ümumi Layihələr',
      value: stats.totalProjects,
      icon: 'FolderOpen',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Aktiv Layihələr',
      value: stats.activeProjects,
      icon: 'Activity',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Ümumi İstifadəçilər',
      value: stats.totalUsers,
      icon: 'Users',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Ümumi Büdcə',
      value: formatCurrency(stats.totalBudget),
      icon: 'DollarSign',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Ümumi Xərclər',
      value: formatCurrency(stats.totalExpenses),
      icon: 'TrendingDown',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Qalıq Büdcə',
      value: formatCurrency(stats.remainingBudget),
      icon: 'TrendingUp',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {stat.title}
              </p>
              <p className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </p>
            </div>
            <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
              <div className={stat.color}>
                {getIcon(stat.icon)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
