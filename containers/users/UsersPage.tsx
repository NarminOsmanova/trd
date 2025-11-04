'use client';

import React, { useState, useMemo } from 'react';
import { 
  Shield, 
  ShieldCheck,
  UserCheck,
  UserX,
  RefreshCw,
  Filter,
  Grid3X3,
  List,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslations } from 'next-intl';
import { useUsers, useChangeUserStatus } from '@/lib/hooks/useUsers';
import UsersTable from './components/UsersTable';
import UsersCard from './components/UsersCard';
import UserViewModal from '@/containers/settings/components/UserViewModal';
import { toast } from 'sonner';
import { UserStatus, UserType, UserRoleFilter, UserStatusFilter } from './types/users-type';

export default function UsersPage() {
  const t = useTranslations('users');
  
  // Simple filters (like ProjectsPage)
  const [filters, setFilters] = useState({
    search: '',
    role: 'all' as UserRoleFilter,
    status: 'all' as UserStatusFilter,
    pageNumber: 1,
    pageSize: 12,
  });
  
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Map UI filters to API filters
  const apiFilters = useMemo(() => {
    // Map role to roleIds (only UserType enum values)
    let roleIds: number[] | undefined = undefined;
    if (filters.role !== 'all') {
      if (filters.role === 'partner') {
        roleIds = [UserType.Partner];
      } else if (filters.role === 'user') {
        roleIds = [UserType.User];
      }
    }

    // Map status to statuses (only UserStatus enum values)
    let statuses: number[] | undefined = undefined;
    if (filters.status !== 'all') {
      if (filters.status === 'active') {
        statuses = [UserStatus.Active];
      } else if (filters.status === 'inactive') {
        statuses = [UserStatus.Inactive];
      } else if (filters.status === 'pending') {
        statuses = [UserStatus.Pending];
      } else if (filters.status === 'blocked') {
        statuses = [UserStatus.Blocked];
      }
    }

    return {
      pageNumber: filters.pageNumber,
      pageSize: filters.pageSize,
      searchTerm: filters.search,
      roleIds,
      statuses,
    };
  }, [filters]);

  // Fetch users with API
  const { users, pagination, isLoading, refetchUsers } = useUsers(apiFilters);
  const changeStatusMutation = useChangeUserStatus();

  // Calculate user statistics (from all users, not filtered)
  const userStats = useMemo(() => {
    return {
      totalUsers: pagination?.totalCount || 0,
      activeUsers: users.filter(u => u.status === UserStatus.Active).length,
      inactiveUsers: users.filter(u => u.status !== UserStatus.Active).length,
      adminUsers: users.filter(u => u.role === 'admin').length,
      regularUsers: users.filter(u => u.type === UserType.User).length,
      partnerUsers: users.filter(u => u.type === UserType.Partner).length
    };
  }, [users, pagination]);

  // Helper function to calculate percentage safely
  const calculatePercentage = (value: number, total: number): string => {
    if (total === 0) return '0.0';
    return ((value / total) * 100).toFixed(1);
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      pageNumber: 1, // Reset to first page on filter change
    }));
  };

  const handleViewUser = (userId: string) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  const handleChangeStatus = async (userId: string, newStatus: UserStatus) => {
    try {
      await changeStatusMutation.mutateAsync({
        userId: parseInt(userId),
        status: newStatus
      });
      
      const statusText = newStatus === UserStatus.Active ? t('active') : 
                        newStatus === UserStatus.Inactive ? t('inactive') :
                        newStatus === UserStatus.Blocked ? t('blocked') :
                        t('pending');
      
      toast.success(t('statusChanged', { status: statusText }));
      refetchUsers();
    } catch (error) {
      toast.error(t('statusChangeError'));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUserId(null);
  };

  const handleRefresh = () => {
    refetchUsers();
    toast.success(t('dataRefreshed'));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      role: 'all',
      status: 'all',
      pageNumber: 1,
      pageSize: 12,
    });
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, pageNumber: newPage }));
  };

  return (
    <>
      <div className="space-y-4 md:space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{t('filters')}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={filters.search}
                onChange={(e) => handleFiltersChange({ search: e.target.value })}
                className="pl-10"
              />
            </div>

            {/* Role Filter */}
            <Select 
              value={filters.role} 
              onValueChange={(value) => handleFiltersChange({ role: value as UserRoleFilter })}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('selectRole')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allRoles')}</SelectItem>
                <SelectItem value="user">{t('manager')}</SelectItem>
                <SelectItem value="partner">{t('partner')}</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select 
              value={filters.status} 
              onValueChange={(value) => handleFiltersChange({ status: value as UserStatusFilter })}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('selectStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allStatuses')}</SelectItem>
                <SelectItem value="active">{t('active')}</SelectItem>
                <SelectItem value="inactive">{t('inactive')}</SelectItem>
                <SelectItem value="pending">{t('pending')}</SelectItem>
                <SelectItem value="blocked">{t('blocked')}</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters Button */}
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Filter className="w-4 h-4 mr-2" />
              {t('clearFilters')}
            </button>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex flex-col gap-3 lg:flex-row lg:gap-4 lg:justify-between lg:items-center">
          <div className="flex items-center gap-2 justify-between md:justify-end">
            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('card')}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                  viewMode === 'card'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title={t('cards')}
              >
                <Grid3X3 className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">{t('cards')}</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                  viewMode === 'table'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title={t('table')}
              >
                <List className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">{t('table')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Users View */}
        {viewMode === 'card' ? (
          <UsersCard
            users={users}
            pagination={pagination}
            isLoading={isLoading}
            onViewUser={handleViewUser}
            onChangeStatus={handleChangeStatus}
            onPageChange={handlePageChange}
          />
        ) : (
          <UsersTable
            users={users}
            pagination={pagination}
            isLoading={isLoading}
            onViewUser={handleViewUser}
            onChangeStatus={handleChangeStatus}
            onPageChange={handlePageChange}
          />
        )}

        {/* Summary Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2 md:mr-3">
                <Shield className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">{t('totalUsers')}</p>
                <p className="text-base md:text-lg font-semibold text-gray-900">{userStats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-2 md:mr-3">
                <Shield className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">{t('admins')}</p>
                <p className="text-base md:text-lg font-semibold text-gray-900">{userStats.adminUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-2 md:mr-3">
                <UserCheck className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">{t('activeUsers')}</p>
                <p className="text-base md:text-lg font-semibold text-gray-900">{userStats.activeUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-2 md:mr-3">
                <ShieldCheck className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">{t('managers')}</p>
                <p className="text-base md:text-lg font-semibold text-gray-900">{userStats.regularUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-2 md:mr-3">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">{t('partners')}</p>
                <p className="text-base md:text-lg font-semibold text-gray-900">{userStats.partnerUsers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">{t('roleDistribution')}</h3>
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 md:w-5 md:h-5 text-purple-600 mr-2" />
                  <span className="text-xs md:text-sm font-medium text-gray-700">{t('admins')}</span>
                </div>
                <span className="text-xs md:text-sm font-semibold text-gray-900">
                  {userStats.adminUsers} ({calculatePercentage(userStats.adminUsers, userStats.totalUsers)}%)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-blue-600 mr-2" />
                  <span className="text-xs md:text-sm font-medium text-gray-700">{t('managers')}</span>
                </div>
                <span className="text-xs md:text-sm font-semibold text-gray-900">
                  {userStats.regularUsers} ({calculatePercentage(userStats.regularUsers, userStats.totalUsers)}%)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-indigo-600 mr-2" />
                  <span className="text-xs md:text-sm font-medium text-gray-700">{t('partners')}</span>
                </div>
                <span className="text-xs md:text-sm font-semibold text-gray-900">
                  {userStats.partnerUsers} ({calculatePercentage(userStats.partnerUsers, userStats.totalUsers)}%)
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">{t('statusDistribution')}</h3>
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <UserCheck className="w-4 h-4 md:w-5 md:h-5 text-green-600 mr-2" />
                  <span className="text-xs md:text-sm font-medium text-gray-700">{t('active')}</span>
                </div>
                <span className="text-xs md:text-sm font-semibold text-gray-900">
                  {userStats.activeUsers} ({calculatePercentage(userStats.activeUsers, userStats.totalUsers)}%)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <UserX className="w-4 h-4 md:w-5 md:h-5 text-red-600 mr-2" />
                  <span className="text-xs md:text-sm font-medium text-gray-700">{t('inactive')}</span>
                </div>
                <span className="text-xs md:text-sm font-semibold text-gray-900">
                  {userStats.inactiveUsers} ({calculatePercentage(userStats.inactiveUsers, userStats.totalUsers)}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User View Modal */}
      {selectedUserId && (
        <UserViewModal
          userId={selectedUserId}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
