'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { 
  Calendar, 
  User, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  FileText,
  TrendingUp,
} from 'lucide-react';
import DialogComponent from '@/components/modals/DialogComponent';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DebtDetail } from '../types/debt-type';
import { formatDate, getInitials } from '@/lib/utils';

interface DebtViewProps {
  isOpen: boolean;
  onClose: () => void;
  debt: DebtDetail | null;
  onEdit?: (debt: DebtDetail) => void;
  onMarkAsPaid?: (debtId: string) => void;
  onDelete?: (debtId: string) => void;
  onAddPayment?: (debtId: string, payment: { amount: number; paymentDate: string; note?: string }) => void;
}

export default function DebtView({
  isOpen,
  onClose,
  debt,
  onEdit,
  onMarkAsPaid,
  onDelete,
  onAddPayment
}: DebtViewProps) {
  const t = useTranslations('debt');

  if (!isOpen || !debt) return null;

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0: // active
        return 'bg-blue-600 text-white border-blue-700';
      case 1: // paid
        return 'bg-green-600 text-white border-green-700';
      case 2: // overdue
        return 'bg-red-600 text-white border-red-700';
      default:
        return 'bg-gray-600 text-white border-gray-700';
    }
  };

  const getStatusIcon = (status: number) => {
    switch (status) {
      case 0: // active
        return <Clock className="w-4 h-4 text-white" />;
      case 1: // paid
        return <CheckCircle className="w-4 h-4 text-white" />;
      case 2: // overdue
        return <AlertTriangle className="w-4 h-4 text-white" />;
      default:
        return <Clock className="w-4 h-4 text-white" />;
    }
  };

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 0: // active
        return t('active');
      case 1: // paid
        return t('paid');
      case 2: // overdue
        return t('overdue');
      default:
        return 'N/A';
    }
  };

  const getCurrencySymbol = (currency: number) => {
    switch (currency) {
      case 0: return 'AZN';
      case 1: return 'USD';
      case 2: return 'EUR';
      default: return 'AZN';
    }
  };

  const formatCurrency = (amount: number, currency: number) => {
    return `${amount.toFixed(2)} ${getCurrencySymbol(currency)}`;
  };

  const overdue = debt.remainingDays < 0;
  const payments = debt.payments || [];

  return (
    <DialogComponent
      open={isOpen}
      setOpen={onClose}
      title={`${t('debtDetails')} - ${debt.debtorName}`}
      size="lg"
      maxHeight="max-h-[90vh]"
    >
      <div className="space-y-6">
        {/* Header with Debtor Info */}
        <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">
              {getInitials(debt.debtorName)}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-1">{debt.debtorName}</h2>
            <div className="flex items-center space-x-2">
              <Badge className={`${getStatusColor(debt.status)} flex items-center gap-1 border`}>
                {getStatusIcon(debt.status)}
                {getStatusLabel(debt.status)}
              </Badge>
              {overdue && debt.status === 0 && (
                <Badge className="bg-red-600 text-white border-red-700 border flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-white" />
                  {t('overdue')}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Amount and Payment Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('totalAmountLabel')}</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(debt.totalAmount, debt.currency)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('paidAmountLabel')}</p>
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(debt.paidAmount, debt.currency)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('remainingAmount')}</p>
                <p className={`text-xl font-bold ${debt.remainingAmount > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                  {formatCurrency(debt.remainingAmount, debt.currency)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Progress Bar */}
        {debt.status === 0 && (
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{t('paymentProgress')}</span>
              <span className="text-sm text-gray-500">{debt.paymentProgressPercentage.toFixed(1)}% {t('completed')}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all duration-300 bg-blue-500"
                style={{ width: `${Math.min(debt.paymentProgressPercentage, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>{formatCurrency(debt.totalAmount, debt.currency)}</span>
            </div>
          </div>
        )}

        {/* Due Date and Time Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('dueDate')}</p>
                <p className={`text-lg font-semibold ${overdue ? 'text-red-600' : 'text-gray-900'}`}>
                  {formatDate(debt.dueDate)}
                </p>
                {!overdue && debt.status === 0 && (
                  <p className="text-xs text-gray-500">
                    {debt.remainingDays > 0 ? `${debt.remainingDays} ${t('daysRemaining')}` : t('dueToday')}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('createdAt')}</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatDate(debt.createdDate)}
                </p>
                <p className="text-xs text-gray-500">{t('by')} {debt.createdBy}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment History */}
        {payments.length > 0 && (
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">{t('paymentHistory')}</p>
                  <p className="text-xs text-gray-500">{payments.length} {t('payments')}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              {payments
                .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
                .map((payment, index) => {
                  return (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">#{payments.length - index}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(payment.amount, payment.currency)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(payment.paymentDate)}
                          </p>
                          {payment.note && (
                            <p className="text-xs text-gray-600 mt-1">{payment.note}</p>
                          )}
                        </div>
                      </div>
                      <Badge className="bg-green-600 text-white border-green-700 border">
                        {t('paid')}
                      </Badge>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Description */}
        {debt.description && (
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2">{t('descriptionLabel')}</p>
                <p className="text-gray-900 leading-relaxed">{debt.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar for Active Debts */}
        {debt.status === 0 && (
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{t('durationProgress')}</span>
              <span className="text-sm text-gray-500">{Math.max(0, debt.remainingDays)} {t('daysRemaining')}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${
                  overdue ? 'bg-red-500 w-full' :
                  debt.remainingDays <= 7 ? 'bg-orange-500 w-3/4' :
                  debt.remainingDays <= 30 ? 'bg-yellow-500 w-1/2' :
                  'bg-green-500 w-1/4'
                }`}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{t('start')}</span>
              <span>{t('end')}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
          >
            {t('close')}
          </Button>
          {onAddPayment && debt.status === 0 && debt.remainingAmount > 0 && (
            <Button
              onClick={() => {
                const amount = prompt(`${t('enterPaymentAmount')} ${formatCurrency(debt.remainingAmount, debt.currency)}):`);
                if (amount && !isNaN(Number(amount)) && Number(amount) > 0) {
                  const paymentAmount = Number(amount);
                  if (paymentAmount <= debt.remainingAmount) {
                    const note = prompt(t('paymentNote'));
                    onAddPayment(debt.id.toString(), {
                      amount: paymentAmount,
                      paymentDate: new Date().toISOString().split('T')[0],
                      note: note || undefined
                    });
                  } else {
                    alert(t('paymentExceedsRemaining'));
                  }
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              {t('addPayment')}
            </Button>
          )}
          {onEdit && (
            <Button
              variant="outline"
              onClick={() => onEdit(debt)}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              {t('edit')}
            </Button>
          )}
          {onMarkAsPaid && debt.status === 0 && debt.remainingAmount === 0 && (
            <Button
              onClick={() => onMarkAsPaid(debt.id.toString())}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {t('markAsPaid')}
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              onClick={() => onDelete(debt.id.toString())}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              {t('delete')}
            </Button>
          )}
        </div>
      </div>
    </DialogComponent>
  );
}