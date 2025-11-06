'use client';

import React from 'react';
import { 
  Mail,
  Shield,
  ShieldCheck,
  UserCheck,
  UserX,
  DollarSign,
  Calendar,
  Clock,
  Ban
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { User } from '@/types';
import type { ApiUser } from '@/containers/users/types/users-type';
import { formatDate, getInitials } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { UserStatus, UserType } from '@/containers/users/types/users-type';

interface UsersCardProps {
  users: ApiUser[];
  pagination: any;
  isLoading?: boolean;
  onViewUser: (id: string) => void;
  onChangeStatus: (id: string, status: UserStatus) => void;
  onPageChange: (page: number) => void;
}

export default function UsersCard({
  users,
  pagination,
  isLoading,
  onViewUser,
  onChangeStatus,
  onPageChange
}: UsersCardProps) {
  const t = useTranslations('users');

  const viewUsers = users.map((u) => {
    const firstSet = Array.isArray(u.sets) && u.sets.length > 0 ? u.sets[0] : (u as any).set;
    const name = `${firstSet?.firstName || ''} ${firstSet?.lastName || ''}`.trim() || u.email || 'N/A';
    return {
      id: u.id.toString(),
      name,
      email: u.email || '',
      avatar: u.avatar,
      status: u.status,
      type: u.type,
      positionName: u.position?.name || '',
      roleName: u.role?.name || '',
      createdAt: (u as any).createdDate || (u as any).createdAt || null,
    };
  });

  const getUserStatus = (status?: number): UserStatus => {
    // Return the numeric status directly, default to Pending if undefined
    return status !== undefined ? status : UserStatus.Pending;
  };

  const getStatusLabel = (status: UserStatus): string => {
    switch (status) {
      case UserStatus.Active:
        return t('active');
      case UserStatus.Inactive:
        return t('inactive');
      case UserStatus.Blocked:
        return t('blocked');
      case UserStatus.Pending:
        return t('pending');
      default:
        return t('unknown');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (viewUsers.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('noUsersFound')}
          </h3>
          <p className="text-gray-600 mb-4">
            {t('noUsersMessage')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Users Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {viewUsers.map((user) => {
          
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
                        alt={user.name || 'User'}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {getInitials(user.name || 'N/A')}
                        </span>
                      </div>
                    )}
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                      getUserStatus(user.status) === UserStatus.Active 
                        ? 'bg-green-500' 
                        : getUserStatus(user.status) === UserStatus.Pending
                        ? 'bg-gray-400'
                        : getUserStatus(user.status) === UserStatus.Blocked
                        ? 'bg-red-600'
                        : 'bg-red-500'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {user.name || 'N/A'}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      ID: {user.id}
                    </p>
                  </div>
                </div>

                {/* Type Badge */}
                <div className="flex items-center justify-center mb-4">
                  <div className="flex items-center space-x-2">
                    {user.type === UserType.Partner ? (
                      <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    ) : (
                      <Shield className="w-4 h-4 text-blue-600" />
                    )}
                    <Badge 
                      variant={user.type === UserType.Partner ? 'default' : 'secondary'} 
                      className="text-xs"
                    >
                      {user.type === UserType.Partner ? t('partner') : t('manager')}
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
                      {user.positionName || t('notAssigned')}
                    </span>
                  </div>
                </div>

                {/* Budget Information - Note: Will be populated from API statistics */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm font-medium text-gray-700">{t('statistics')}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {t('viewDetails')}
                    </span>
                  </div>
                </div>

                {/* Status and Date */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center">
                      {getUserStatus(user.status) === UserStatus.Active ? (
                        <UserCheck className="w-4 h-4 mr-2 text-green-600" />
                      ) : getUserStatus(user.status) === UserStatus.Pending ? (
                        <Clock className="w-4 h-4 mr-2 text-gray-600" />
                      ) : getUserStatus(user.status) === UserStatus.Blocked ? (
                        <Ban className="w-4 h-4 mr-2 text-red-600" />
                      ) : (
                        <UserX className="w-4 h-4 mr-2 text-red-500" />
                      )}
                      <Badge variant={getUserStatus(user.status) === UserStatus.Active ? 'success' : getUserStatus(user.status) === UserStatus.Blocked ? 'destructive' : 'secondary'}>
                        {getStatusLabel(getUserStatus(user.status))}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 whitespace-nowrap">
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
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              {t('page')} {pagination.pageNumber} / {pagination.totalPages} ({t('total')}: {pagination.totalCount})
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(pagination.pageNumber - 1)}
                disabled={!pagination.hasPreviousPage}
              >
                {t('previousPage')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(pagination.pageNumber + 1)}
                disabled={!pagination.hasNextPage}
              >
                {t('nextPage')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
