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
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedNotifications.length === pagination.paginatedData.length}
                onCheckedChange={onSelectAll}
                aria-label="Select all notifications"
              />
            </TableHead>
            <TableHead>Bildiriş</TableHead>
            <TableHead>Mesaj</TableHead>
            <TableHead>Növ</TableHead>
            <TableHead>Tarix</TableHead>
            <TableHead>Əməliyyatlar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pagination.paginatedData.map((notification) => (
            <TableRow 
              key={notification.id} 
              className={`hover:bg-gray-50 ${!notification.isRead ? 'bg-blue-50/30' : ''}`}
            >
              <TableCell>
                <Checkbox
                  checked={selectedNotifications.includes(notification.id)}
                  onCheckedChange={() => onSelectNotification(notification.id)}
                  aria-label={`Select notification ${notification.title}`}
                />
              </TableCell>

              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    notification.type === 'info' ? 'bg-blue-100 text-blue-600' :
                    notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                    notification.type === 'success' ? 'bg-green-100 text-green-600' :
                    notification.type === 'error' ? 'bg-red-100 text-red-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${
                      !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                    }`}>
                      {notification.title}
                    </span>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <p className="text-sm text-gray-600 max-w-md truncate">
                  {notification.message}
                </p>
              </TableCell>

              <TableCell>
                <Badge variant={getNotificationBadgeVariant(notification.type) as any}>
                  {notification.type}
                </Badge>
              </TableCell>

              <TableCell>
                <div className="text-sm text-gray-600">
                  <p>{formatRelativeTime(notification.createdAt)}</p>
                  <p className="text-xs text-gray-400">{formatDateTime(notification.createdAt)}</p>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMarkAsRead(notification.id)}
                    title={notification.isRead ? "Oxunmadı et" : "Oxundu et"}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    {notification.isRead ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteNotification(notification.id)}
                    title="Sil"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    title="Daha çox"
                    className="text-gray-600 border-gray-200 hover:bg-gray-50"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="p-4 border-t border-gray-200">
          <PaginationWrapper pagination={pagination} />
        </div>
      )}
    </div>
  );
}
