'use client';

import React from 'react';
import { 
  Mail,
  Phone,
  Shield,
  ShieldCheck,
  UserCheck,
  UserX,
  Search,
  DollarSign,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { User } from '../types/users-type';
import { mockData } from '@/lib/mock-data';
import { formatDate, getRoleLabel, getInitials } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePagination } from '@/hooks/usePagination';
import PaginationWrapper from '@/components/ui/pagination-wrapper';

interface UsersCardProps {
  users: User[];
  filters: any;
  onFiltersChange: (filters: any) => void;
  onViewUser: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export default function UsersCard({
  users,
  filters,
  onFiltersChange,
  onViewUser,
  onToggleStatus
}: UsersCardProps) {
  
  // Add pagination
  const pagination = usePagination({ 
    data: users, 
    itemsPerPage: 12 
  });

  const getTotalTransactions = (userId: string) => {
    return mockData.transactions.filter(t => t.userId === userId).length;
  };

  const getTotalAmount = (userId: string) => {
    const userTransactions = mockData.transactions.filter(t => t.userId === userId);
    return userTransactions.reduce((sum, t) => sum + t.amount, 0);
  };

  const getBudgetInfo = (userId: string) => {
    const userTransactions = mockData.transactions.filter(t => t.userId === userId);
    const totalAmount = userTransactions.reduce((sum, t) => sum + t.amount, 0);
    const transactionCount = userTransactions.length;
    
    return {
      totalAmount,
      transactionCount,
      avgTransaction: transactionCount > 0 ? totalAmount / transactionCount : 0
    };
  };

  if (users.length === 0) {
    return (
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">İstifadəçi Filtrləri</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="İstifadəçi axtar..."
                value={filters.searchTerm || ''}
                onChange={(e) => onFiltersChange({ searchTerm: e.target.value })}
                className="pl-10"
              />
            </div>

            <Select 
              value={filters.role || 'all'} 
              onValueChange={(value) => onFiltersChange({ role: value === 'all' ? undefined : value as 'admin' | 'user' })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Rol seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Bütün rollar</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">Menecer</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={filters.status || 'all'} 
              onValueChange={(value) => onFiltersChange({ status: value === 'all' ? undefined : value as 'active' | 'inactive' })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Bütün statuslar</SelectItem>
                <SelectItem value="active">Aktiv</SelectItem>
                <SelectItem value="inactive">Qeyri-aktiv</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              İstifadəçi tapılmadı
            </h3>
            <p className="text-gray-600 mb-4">
              Axtarış meyarlarına uyğun istifadəçi yoxdur
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">İstifadəçi Filtrləri</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="İstifadəçi axtar..."
              value={filters.searchTerm || ''}
              onChange={(e) => onFiltersChange({ searchTerm: e.target.value })}
              className="pl-10"
            />
          </div>

          <Select 
            value={filters.role || 'all'} 
            onValueChange={(value) => onFiltersChange({ role: value === 'all' ? undefined : value as 'admin' | 'user' | 'partner' })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Rol seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Bütün rollar</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">Menecer</SelectItem>
              <SelectItem value="partner">Partnyor</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={filters.status || 'all'} 
            onValueChange={(value) => onFiltersChange({ status: value === 'all' ? undefined : value as 'active' | 'inactive' })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Bütün statuslar</SelectItem>
              <SelectItem value="active">Aktiv</SelectItem>
              <SelectItem value="inactive">Qeyri-aktiv</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Users Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6">
        {pagination.paginatedData.map((user) => {
          const budgetInfo = getBudgetInfo(user.id);
          
          return (
            <div 
              key={user.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer group"
              onClick={() => onViewUser(user.id)}
            >
              {/* Card Header */}
              <div className="p-6 pb-4">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {getInitials(user.name)}
                        </span>
                      </div>
                    )}
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                      user.isActive ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {user.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      ID: {user.id}
                    </p>
                  </div>
                </div>

                {/* Role Badge */}
                <div className="flex items-center justify-center mb-4">
                  <div className="flex items-center space-x-2">
                    {user.role === 'admin' ? (
                      <Shield className="w-4 h-4 text-purple-600" />
                    ) : (
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                    )}
                    <Badge variant={user.role === 'admin' ? 'secondary' : 'default'} className="text-xs">
                      {getRoleLabel(user.role)}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="px-6 pb-4">
                {/* Contact & Position Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-700">
                      {user.position || 'Vəzifə təyin edilməyib'}
                    </span>
                  </div>
                </div>

                {/* Budget Information */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm font-medium text-gray-700">Ümumi Büdcə</span>
                    </div>
                    <span className="text-lg font-bold text-green-600">
                      {budgetInfo.totalAmount.toLocaleString()} AZN
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      <span>{budgetInfo.transactionCount} əməliyyat</span>
                    </div>
                    <span>Orta: {budgetInfo.avgTransaction.toLocaleString()} AZN</span>
                  </div>
                </div>

                {/* Status and Date */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={(e) => { e.stopPropagation(); onToggleStatus(user.id); }}
                    className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${user.isActive ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}
                  >
                    {user.isActive ? (
                      <UserCheck className="w-4 h-4 mr-1" />
                    ) : (
                      <UserX className="w-4 h-4 mr-1" />
                    )}
                    {user.isActive ? 'Aktiv' : 'Qeyri-aktiv'}
                  </button>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>{formatDate(user.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6">
          <PaginationWrapper pagination={pagination} />
        </div>
      )}
    </div>
  );
}
