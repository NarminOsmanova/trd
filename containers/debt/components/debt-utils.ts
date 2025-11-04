import React from 'react';
import { DebtStatus } from '../types/debt-type';
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react';

/**
 * Get status color classes for badges and cards
 */
export const getStatusColor = (status: DebtStatus): string => {
  switch (status) {
    case DebtStatus.Active:
      return 'bg-blue-600 text-white border-blue-700';
    case DebtStatus.Paid:
      return 'bg-green-600 text-white border-green-700';
    case DebtStatus.Overdue:
      return 'bg-red-600 text-white border-red-700';
    default:
      return 'bg-gray-600 text-white border-gray-700';
  }
};

/**
 * Get card background color classes based on status
 */
export const getStatusCardColor = (status: DebtStatus): string => {
  switch (status) {
    case DebtStatus.Active:
      return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
    case DebtStatus.Paid:
      return 'bg-green-50 border-green-200 hover:bg-green-100';
    case DebtStatus.Overdue:
      return 'bg-red-50 border-red-200 hover:bg-red-100';
    default:
      return 'bg-gray-50 border-gray-200 hover:bg-gray-100';
  }
};

/**
 * Get status icon component
 */
export const getStatusIcon = (status: DebtStatus, className: string = 'w-4 h-4 text-white'): React.ReactElement => {
  switch (status) {
    case DebtStatus.Active:
      return React.createElement(Clock, { className });
    case DebtStatus.Paid:
      return React.createElement(CheckCircle, { className });
    case DebtStatus.Overdue:
      return React.createElement(AlertTriangle, { className });
    default:
      return React.createElement(Clock, { className });
  }
};

/**
 * Get status label translation key
 */
export const getStatusLabelKey = (status: DebtStatus): string => {
  switch (status) {
    case DebtStatus.Active:
      return 'active';
    case DebtStatus.Paid:
      return 'paid';
    case DebtStatus.Overdue:
      return 'overdue';
    default:
      return 'N/A';
  }
};

/**
 * Get currency symbol from currency code
 */
export const getCurrencySymbol = (currency: number): string => {
  switch (currency) {
    case 0:
      return 'AZN';
    case 1:
      return 'USD';
    case 2:
      return 'EUR';
    default:
      return 'AZN';
  }
};

/**
 * Format amount with currency symbol
 */
export const formatCurrency = (amount: number, currency: number): string => {
  return `${amount.toFixed(2)} ${getCurrencySymbol(currency)}`;
};

