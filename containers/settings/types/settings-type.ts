export interface SettingsTab {
  id: string;
  label: string;
  icon: string;
}

export interface ProfileFormData {
  name: string;
  phone?: string;
}

export interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  budgetWarnings: boolean;
  weeklyReports: boolean;
}

export interface UserPreferences {
  language: 'az' | 'en' | 'ru';
  timezone: string;
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  currency: 'AZN' | 'USD' | 'EUR';
}

export interface SystemInfo {
  version: string;
  build: string;
  environment: string;
  apiStatus: 'online' | 'offline';
  databaseStatus: 'connected' | 'disconnected';
  lastBackup: string;
}

export interface SupportInfo {
  email: string;
  phone: string;
  workingHours: string;
}
