'use client';

import React from 'react';
import { 
  Mail,
  Shield,
  ShieldCheck,
  UserCheck,
  UserX,
  Clock,
  Ban
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { User } from '@/types';
import type { ApiUser } from '@/containers/users/types/users-type';
import { formatDate, getInitials } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserStatus, UserType } from '@/containers/users/types/users-type';

interface UsersTableProps {
  users: ApiUser[];
  pagination: any;
  isLoading?: boolean;
  onViewUser: (id: string) => void;
  onChangeStatus: (id: string, status: UserStatus) => void;
  onPageChange: (page: number) => void;
}

export default function UsersTable({
  users,
  pagination,
  isLoading,
  onViewUser,
  onChangeStatus,
  onPageChange
}: UsersTableProps) {
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

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('user')}</TableHead>
              <TableHead>{t('email')}</TableHead>
              <TableHead>{t('position')}</TableHead>
              <TableHead>{t('type')}</TableHead>
              <TableHead>{t('status')}</TableHead>
              <TableHead>{t('date')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {viewUsers.map((user) => {
              
              return (
                <TableRow key={user.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onViewUser(user.id)}>
                {/* User Info */}
                <TableCell>
                  <div className="flex items-center">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name || 'User'}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-blue-600">
                          {getInitials(user.name || 'N/A')}
                        </span>
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.name || 'N/A'}
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
                    {user.positionName || t('notAssigned')}
                  </div>
                </TableCell>

                {/* Type */}
                <TableCell>
                  <div className="flex items-center">
                    {user.type === UserType.Partner ? (
                      <ShieldCheck className="w-4 h-4 text-indigo-600 mr-2" />
                    ) : (
                      <Shield className="w-4 h-4 text-blue-600 mr-2" />
                    )}
                    <Badge variant={user.type === UserType.Partner ? 'default' : 'secondary'}>
                      {user.type === UserType.Partner ? t('partner') : t('manager')}
                    </Badge>
                  </div>
                </TableCell>

                {/* Status (read-only) */}
                <TableCell>
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
        {pagination && pagination.totalPages > 1 && (
          <div className="p-4 border-t">
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
    </div>
  );
}
