'use client';

import React from 'react';
import { 
  Edit, 
  Trash2, 
  MoreVertical, 
  Mail,
  Phone,
  Shield,
  ShieldCheck,
  UserCheck,
  UserX,
  Eye,
  Search
} from 'lucide-react';
import { User, UserFilters } from '../types/users-type';
import { mockData } from '@/lib/mock-data';
import { formatDate, getRoleLabel, getInitials } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePagination } from '@/hooks/usePagination';
import PaginationWrapper from '@/components/ui/pagination-wrapper';

interface UsersTableProps {
  users: User[];
  filters: UserFilters;
  onFiltersChange: (filters: Partial<UserFilters>) => void;
  onViewUser: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export default function UsersTable({
  users,
  filters,
  onFiltersChange,
  onViewUser,
  onToggleStatus
}: UsersTableProps) {
  
  // Add pagination
  const pagination = usePagination({ 
    data: users, 
    itemsPerPage: 10 
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

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>İstifadəçi</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Vəzifə</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Büdcə Məlumatları</TableHead>
              <TableHead>Tarix</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagination.paginatedData.map((user) => {
              const budgetInfo = getBudgetInfo(user.id);
              
              return (
                <TableRow key={user.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onViewUser(user.id)}>
                {/* User Info */}
                <TableCell>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-medium text-blue-600">
                        {getInitials(user.name)}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {user.id}
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Email */}
                <TableCell>
                  <div className="flex items-center text-sm text-gray-900">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    {user.email}
                  </div>
                </TableCell>

                {/* Position */}
                <TableCell>
                  <div className="flex items-center text-sm text-gray-900">
                    {user.position || 'Təyin edilməyib'}
                  </div>
                </TableCell>

                {/* Role */}
                <TableCell>
                  <div className="flex items-center">
                    {user.role === 'admin' ? (
                      <Shield className="w-4 h-4 text-purple-600 mr-2" />
                    ) : (
                      <ShieldCheck className="w-4 h-4 text-blue-600 mr-2" />
                    )}
                    <Badge variant={user.role === 'admin' ? 'secondary' : 'default'}>
                      {getRoleLabel(user.role)}
                    </Badge>
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell>
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
                </TableCell>

                {/* Budget Information */}
                <TableCell>
                  <div className="text-sm text-gray-900">
                    <div className="font-semibold text-green-600">
                      {budgetInfo.totalAmount.toLocaleString()} AZN
                    </div>
                    <div className="text-xs text-gray-500">
                      {budgetInfo.transactionCount} əməliyyat
                    </div>
                    <div className="text-xs text-gray-400">
                      Orta: {budgetInfo.avgTransaction.toLocaleString()} AZN
                    </div>
                  </div>
                </TableCell>

                {/* Created Date */}
                <TableCell className="text-sm text-gray-500">
                  {formatDate(user.createdAt)}
                </TableCell>
              </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-4">
            <PaginationWrapper pagination={pagination} />
          </div>
        )}
      </div>
    </div>
  );
}
