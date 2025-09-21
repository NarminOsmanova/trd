'use client';

import React from 'react';
import { 
  Eye, 
  EyeOff, 
  Trash2, 
  MoreVertical,
  Info,
  AlertCircle,
  CheckCircle,
  XCircle,
  Bell
} from 'lucide-react';
import { Notification } from '../types/notifications-type';
import { formatDateTime, formatRelativeTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { usePagination } from '@/hooks/usePagination';
import PaginationWrapper from '@/components/ui/pagination-wrapper';

interface NotificationsTableProps {
  notifications: Notification[];
  selectedNotifications: string[];
  onSelectNotification: (id: string) => void;
  onSelectAll: () => void;
  onMarkAsRead: (id: string) => void;
  onDeleteNotification: (id: string) => void;
}

export default function NotificationsTable({
  notifications,
  selectedNotifications,
  onSelectNotification,
  onSelectAll,
  onMarkAsRead,
  onDeleteNotification
}: NotificationsTableProps) {
  
  // Add pagination
  const pagination = usePagination({ 
    data: notifications, 
    itemsPerPage: 10 
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="w-5 h-5" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5" />;
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationBadgeVariant = (type: string) => {
    switch (type) {
      case 'info':
        return 'info';
      case 'warning':
        return 'warning';
      case 'success':
        return 'success';
      case 'error':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Bildiriş yoxdur
          </h3>
          <p className="text-gray-600">
            Seçilmiş filtrə uyğun bildiriş tapılmadı
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="divide-y divide-gray-200">
        {pagination.paginatedData.map((notification) => (
          <div
            key={notification.id}
            className={`p-6 hover:bg-gray-50 transition-colors ${
              !notification.isRead ? 'bg-blue-50/30' : ''
            }`}
          >
            <div className="flex items-start space-x-4">
              {/* Selection Checkbox */}
              <div className="flex-shrink-0 pt-1">
                <Checkbox
                  checked={selectedNotifications.includes(notification.id)}
                  onCheckedChange={() => onSelectNotification(notification.id)}
                  aria-label={`Select notification ${notification.title}`}
                />
              </div>

              {/* Notification Icon */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                notification.type === 'info' ? 'bg-blue-100 text-blue-600' :
                notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                notification.type === 'success' ? 'bg-green-100 text-green-600' :
                notification.type === 'error' ? 'bg-red-100 text-red-600' :
                'bg-gray-100 text-gray-600'
              }`}>
                {getNotificationIcon(notification.type)}
              </div>

              {/* Notification Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className={`text-sm font-semibold ${
                        !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {notification.title}
                      </h3>
                      <Badge variant={getNotificationBadgeVariant(notification.type) as any}>
                        {notification.type}
                      </Badge>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{formatRelativeTime(notification.createdAt)}</span>
                      <span>•</span>
                      <span>{formatDateTime(notification.createdAt)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onMarkAsRead(notification.id)}
                      title={notification.isRead ? "Oxunmadı et" : "Oxundu et"}
                    >
                      {notification.isRead ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteNotification(notification.id)}
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Daha çox"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="p-4 border-t border-gray-200">
          <PaginationWrapper pagination={pagination} />
        </div>
      )}
    </div>
  );
}
