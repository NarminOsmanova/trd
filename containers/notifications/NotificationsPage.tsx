'use client';

import React, { useState } from 'react';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Plus,
  AlertCircle,
  Eye,
  EyeOff,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { mockData } from '@/lib/mock-data';
import { Notification, NotificationFormData, NotificationFilters } from './types/notifications-type';
import NotificationsTable from './components/NotificationsTable';
import FormComponent from './components/FormComponent';

export default function NotificationsPage() {
  const [notifications] = useState<Notification[]>(mockData.notifications);
  const [filter, setFilter] = useState<string>('all');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'read') return notification.isRead;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (notificationId: string) => {
    // Mock function - in real app this would update the backend
    console.log('Mark as read:', notificationId);
  };

  const handleMarkAllAsRead = () => {
    // Mock function - in real app this would update the backend
    console.log('Mark all as read');
  };

  const handleDeleteNotification = (notificationId: string) => {
    // Mock function - in real app this would delete from backend
    console.log('Delete notification:', notificationId);
  };

  const handleSelectNotification = (notificationId: string) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    }
  };

  const handleCreateNotification = () => {
    setEditingNotification(null);
    setIsFormOpen(true);
  };

  const handleEditNotification = (notification: Notification) => {
    setEditingNotification(notification);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: NotificationFormData) => {
    try {
      if (editingNotification) {
        // Update existing notification
        console.log('Update notification:', editingNotification.id, data);
      } else {
        // Create new notification
        console.log('Create notification:', data);
      }
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsFormOpen(false);
      setEditingNotification(null);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingNotification(null);
  };

  const handleBulkMarkAsRead = () => {
    selectedNotifications.forEach(handleMarkAsRead);
    setSelectedNotifications([]);
  };

  const handleBulkDelete = () => {
    selectedNotifications.forEach(handleDeleteNotification);
    setSelectedNotifications([]);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Bell className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Bildirişlər</h2>
              {unreadCount > 0 && (
                <Badge variant="destructive">
                  {unreadCount} oxunmayan
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtr seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Bütün bildirişlər</SelectItem>
                <SelectItem value="unread">Oxunmayanlar</SelectItem>
                <SelectItem value="read">Oxunanlar</SelectItem>
                <SelectItem value="info">Məlumat</SelectItem>
                <SelectItem value="warning">Xəbərdarlıq</SelectItem>
                <SelectItem value="success">Uğur</SelectItem>
                <SelectItem value="error">Xəta</SelectItem>
              </SelectContent>
            </Select>

            {unreadCount > 0 && (
              <Button
                variant="outline"
                onClick={handleMarkAllAsRead}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <CheckCheck className="w-4 h-4 mr-2" />
                Hamısını Oxundu Et
              </Button>
            )}

            <Button onClick={handleCreateNotification}>
              <Plus className="w-4 h-4 mr-2" />
              Yeni Bildiriş
            </Button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedNotifications.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">
                {selectedNotifications.length} bildiriş seçilib
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkMarkAsRead}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <Check className="w-3 h-3 mr-1" />
                  Oxundu Et
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <XCircle className="w-3 h-3 mr-1" />
                  Sil
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedNotifications([])}
                >
                  Ləğv Et
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Table */}
        <NotificationsTable
          notifications={filteredNotifications}
          selectedNotifications={selectedNotifications}
          onSelectNotification={handleSelectNotification}
          onSelectAll={handleSelectAll}
          onMarkAsRead={handleMarkAsRead}
          onDeleteNotification={handleDeleteNotification}
        />

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <Bell className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ümumi Bildirişlər</p>
                <p className="text-lg font-semibold text-gray-900">{notifications.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <EyeOff className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Oxunmayanlar</p>
                <p className="text-lg font-semibold text-red-600">{unreadCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <Eye className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Oxunanlar</p>
                <p className="text-lg font-semibold text-green-600">
                  {notifications.length - unreadCount}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Xəbərdarlıqlar</p>
                <p className="text-lg font-semibold text-yellow-600">
                  {notifications.filter(n => n.type === 'warning').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      <FormComponent
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        title={editingNotification ? 'Bildirişi Redaktə Et' : 'Yeni Bildiriş Yarat'}
        initialData={editingNotification ? {
          title: editingNotification.title,
          message: editingNotification.message,
          type: editingNotification.type,
          userId: editingNotification.userId
        } : undefined}
      />
    </>
  );
}
