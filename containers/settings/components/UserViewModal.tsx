'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Mail, Phone, Briefcase, Calendar, Shield, CheckCircle, XCircle } from 'lucide-react';
import { useUser } from '@/lib/hooks/useUsers';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import DialogComponent from '@/components/modals/DialogComponent';

interface UserViewModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserViewModal({ userId, isOpen, onClose }: UserViewModalProps) {
  const t = useTranslations('settings.users');
  const { data, isLoading } = useUser(userId, isOpen);

  const user = data?.responseValue;

  return (
    <DialogComponent
      open={isOpen}
      setOpen={(open) => !open && onClose()}
      title={t('viewTitle')}
      size="xl"
      loading={isLoading}
      onClose={onClose}
    >
      {user ? (
        <div className="space-y-6">
              {/* User Profile Section */}
              <div className="flex items-center space-x-4 pb-6 border-b">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {user.set?.firstName?.[0]}{user.set?.lastName?.[0]}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {user.set?.firstName} {user.set?.lastName}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={user.status === 1 ? 'success' : 'destructive'}>
                      {user.status === 1 ? t('active') : t('inactive')}
                    </Badge>
                    <Badge variant={user.type === 1 ? 'default' : 'secondary'}>
                      {user.type === 1 ? t('partner') : user.role?.name === 'Admin' ? t('admin') : t('employee')}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">{t('email')}</p>
                    <p className="font-medium text-gray-900">{user.email || '-'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">{t('phone')}</p>
                    <p className="font-medium text-gray-900">{user.phone || '-'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Briefcase className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">{t('position')}</p>
                    <p className="font-medium text-gray-900">{user.position?.name || '-'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">{t('role')}</p>
                    <p className="font-medium text-gray-900">{user.role?.name || '-'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">{t('createdDate')}</p>
                    <p className="font-medium text-gray-900">{formatDate(user.createdAt || new Date().toISOString())}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  {user.status === 1 ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">{t('status')}</p>
                    <p className="font-medium text-gray-900">
                      {user.status === 1 ? t('active') : t('inactive')}
                    </p>
                  </div>
                </div>
              </div>

        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">{t('userNotFound')}</p>
        </div>
      )}
    </DialogComponent>
  );
}