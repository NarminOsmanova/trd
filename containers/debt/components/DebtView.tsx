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
  CreditCard,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import DialogComponent from '@/components/modals/DialogComponent';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Debt } from '../types/debt-type';
import { mockData } from '@/lib/mock-data';
import { formatCurrency, formatDate, getInitials } from '@/lib/utils';

interface DebtViewProps {
  isOpen: boolean;
  onClose: () => void;
  debt: Debt | null;
  onEdit?: (debt: Debt) => void;
  onMarkAsPaid?: (debtId: string) => void;
  onDelete?: (debtId: string) => void;
}

export default function DebtView({
  isOpen,
  onClose,
  debt,
  onEdit,
  onMarkAsPaid,
  onDelete
}: DebtViewProps) {
  const t = useTranslations();

  if (!isOpen || !debt) return null;

  const getStatusColor = (status: Debt['status']) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: Debt['status']) => {
    switch (status) {
      case 'active':
        return <Clock className="w-4 h-4" />;
      case 'paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'overdue':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: Debt['status']) => {
    switch (status) {
      case 'active':
        return 'Aktiv';
      case 'paid':
        return 'Ödənilib';
      case 'overdue':
        return 'Gecikmiş';
      default:
        return 'Naməlum';
    }
  };

  const getDebtUser = (debt: Debt) => {
    return mockData.users.find(u => u.id === debt.createdBy);
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const user = getDebtUser(debt);
  const overdue = isOverdue(debt.dueDate);
  const daysUntilDue = getDaysUntilDue(debt.dueDate);

  return (
    <DialogComponent
      open={isOpen}
      setOpen={onClose}
      title={`Borç Detalları - ${debt.debtor}`}
      size="lg"
      maxHeight="max-h-[90vh]"
    >
      <div className="space-y-6">
        {/* Header with Debtor Info */}
        <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">
              {getInitials(debt.debtor)}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-1">{debt.debtor}</h2>
            <div className="flex items-center space-x-2">
              <Badge className={`${getStatusColor(debt.status)} flex items-center gap-1 border`}>
                {getStatusIcon(debt.status)}
                {getStatusLabel(debt.status)}
              </Badge>
              {overdue && (
                <Badge className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Gecikmiş
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Amount and Currency */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Məbləğ</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(debt.amount)} {debt.currency}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Valyuta</p>
                <p className="text-xl font-bold text-gray-900">{debt.currency}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Due Date and Time Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Müddət Tarixi</p>
                <p className={`text-lg font-semibold ${overdue ? 'text-red-600' : 'text-gray-900'}`}>
                  {formatDate(debt.dueDate)}
                </p>
                {!overdue && debt.status === 'active' && (
                  <p className="text-xs text-gray-500">
                    {daysUntilDue > 0 ? `${daysUntilDue} gün qalıb` : 'Bu gün bitir'}
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
                <p className="text-sm text-gray-600">Yaradılıb</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatDate(debt.createdAt)}
                </p>
                {user && (
                  <p className="text-xs text-gray-500">by {user.name}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {debt.description && (
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2">Təsvir</p>
                <p className="text-gray-900 leading-relaxed">{debt.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar for Active Debts */}
        {debt.status === 'active' && (
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Müddət Proqresi</span>
              <span className="text-sm text-gray-500">{Math.max(0, daysUntilDue)} gün qalıb</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${
                  overdue ? 'bg-red-500 w-full' :
                  daysUntilDue <= 7 ? 'bg-orange-500 w-3/4' :
                  daysUntilDue <= 30 ? 'bg-yellow-500 w-1/2' :
                  'bg-green-500 w-1/4'
                }`}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Başlanğıc</span>
              <span>Bitmə</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Bağla
          </Button>
          {onEdit && (
            <Button
              variant="outline"
              onClick={() => onEdit(debt)}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              Redaktə Et
            </Button>
          )}
          {onMarkAsPaid && debt.status === 'active' && (
            <Button
              onClick={() => onMarkAsPaid(debt.id)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Ödənildi kimi işarələ
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              onClick={() => onDelete(debt.id)}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Sil
            </Button>
          )}
        </div>
      </div>
    </DialogComponent>
  );
}