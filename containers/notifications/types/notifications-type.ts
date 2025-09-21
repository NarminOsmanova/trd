export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isRead: boolean;
  createdAt: string;
}

export interface NotificationFormData {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  userId: string;
}

export interface NotificationFilters {
  type?: 'info' | 'warning' | 'success' | 'error';
  isRead?: boolean;
  userId?: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  read: number;
  warnings: number;
}
