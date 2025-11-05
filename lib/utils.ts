import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Format currency in AZN
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('az-AZ', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' AZN';
}

// Format date
export function formatDate(date: string | Date | undefined | null): string {
  if (!date) return '-';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) return '-';
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${day}.${month}.${year}`;
}

// Format date with time
export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

// Format relative time
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'indi';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} dəqiqə əvvəl`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} saat əvvəl`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} gün əvvəl`;
  } else {
    return formatDate(dateObj);
  }
}

// Get status color
export function getStatusColor(status: string): string {
  switch (status) {
    case 'active':
      return 'text-green-600 bg-green-100';
    case 'completed':
      return 'text-blue-600 bg-blue-100';
    case 'paused':
      return 'text-yellow-600 bg-yellow-100';
    case 'income':
      return 'text-green-600 bg-green-100';
    case 'expense':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

// Get category color
export function getCategoryColor(category: string): string {
  switch (category) {
    case 'material':
      return 'text-orange-600 bg-orange-100';
    case 'salary':
      return 'text-blue-600 bg-blue-100';
    case 'equipment':
      return 'text-purple-600 bg-purple-100';
    case 'transport':
      return 'text-green-600 bg-green-100';
    case 'utilities':
      return 'text-yellow-600 bg-yellow-100';
    case 'rent':
      return 'text-indigo-600 bg-indigo-100';
    case 'marketing':
      return 'text-pink-600 bg-pink-100';
    case 'other':
      return 'text-gray-600 bg-gray-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

// Get notification type color
export function getNotificationColor(type: string): string {
  switch (type) {
    case 'info':
      return 'text-blue-600 bg-blue-100';
    case 'warning':
      return 'text-yellow-600 bg-yellow-100';
    case 'success':
      return 'text-green-600 bg-green-100';
    case 'error':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Generate random ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Calculate percentage
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

// Get initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+994[0-9]{9}$/;
  return phoneRegex.test(phone);
}

// Format phone number
export function formatPhone(phone: string): string {
  if (phone.startsWith('+994')) {
    const number = phone.slice(4);
    return `+994 (${number.slice(0, 2)}) ${number.slice(2, 5)} ${number.slice(5, 7)} ${number.slice(7)}`;
  }
  return phone;
}

// Get transaction type label
export function getTransactionTypeLabel(type: string): string {
  switch (type) {
    case 'income':
      return 'Mədaxil';
    case 'expense':
      return 'Məxaric';
    case 'transfer':
      return 'Transfer';
    case 'topup':
      return 'Hesab artımı';
    default:
      return type;
  }
}

// Get category label
export function getCategoryLabel(category: string): string {
  switch (category) {
    case 'material':
      return 'Material';
    case 'salary':
      return 'Maaş';
    case 'equipment':
      return 'Avadanlıq';
    case 'transport':
      return 'Nəqliyyat';
    case 'utilities':
      return 'Kommunal';
    case 'rent':
      return 'Kirayə';
    case 'marketing':
      return 'Marketinq';
    case 'other':
      return 'Digər';
    default:
      return category;
  }
}

// Get status label
export function getStatusLabel(status: string): string {
  switch (status) {
    case 'active':
      return 'Aktiv';
    case 'completed':
      return 'Tamamlandı';
    case 'paused':
      return 'Dayandırılıb';
    default:
      return status;
  }
}

// Get role label
export function getRoleLabel(role: string): string {
  switch (role) {
    case 'admin':
      return 'Admin';
    case 'user':
      return 'Menecer';
    case 'partner':
      return 'Partnyor';
    default:
      return role;
  }
}
