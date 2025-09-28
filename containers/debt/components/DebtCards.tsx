'use client';

import React from 'react';
import { 
  Calendar,
  User,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  MoreVertical
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Debt, Payment } from '../types/debt-type';
import { mockData } from '@/lib/mock-data';
import { formatCurrency, formatDate, getInitials } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePagination } from '@/hooks/usePagination';
import PaginationWrapper from '@/components/ui/pagination-wrapper';

interface DebtCardsProps {
  debts: Debt[];
  onViewDebt: (id: string) => void;
  onEditDebt: (debt: Debt) => void;
  onDeleteDebt: (id: string) => void;
  onMarkAsPaid: (id: string) => void;
  onAddPayment?: (debtId: string, payment: Omit<Payment, 'id'>) => void;
}

export default function DebtCards({
  debts,
  onViewDebt,
  onEditDebt,
  onDeleteDebt,
  onMarkAsPaid,
}: DebtCardsProps) {
  const t = useTranslations();

  const getStatusColor = (status: Debt['status']) => {
    switch (status) {
      case 'active':
        return 'bg-blue-50 border-blue-200';
      case 'paid':
        return 'bg-green-50 border-green-200';
      case 'overdue':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: Debt['status']) => {
    switch (status) {
      case 'active':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'overdue':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
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

  // Add pagination
  const pagination = usePagination({
    data: debts,
    itemsPerPage: 8 // 2x4 grid layout
  });

  if (debts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Borc tapılmadı
          </h3>
          <p className="text-gray-600">
            Axtarış meyarlarına uyğun borc yoxdur
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Debts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pagination.paginatedData.map((debt) => {
          const user = getDebtUser(debt);
          const overdue = isOverdue(debt.dueDate);
          const daysUntilDue = getDaysUntilDue(debt.dueDate);
          
          return (
            <div 
              key={debt.id} 
              className={`bg-white rounded-xl shadow-sm border-2 p-6 hover:shadow-md transition-all duration-200 ${getStatusColor(debt.status)}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {getInitials(debt.debtor)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {debt.debtor}
                    </h3>
                    {debt.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                        {debt.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-1 ml-2">
                  <Badge className={`${getStatusColor(debt.status).replace('bg-', 'bg-').replace('border-', 'border-')} flex items-center gap-1 text-xs`}>
                    {getStatusIcon(debt.status)}
                    {getStatusLabel(debt.status)}
                  </Badge>
                </div>
              </div>

              {/* Amount */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Məbləğ:</span>
                  <span className="text-xl font-bold text-gray-900">
                    {formatCurrency(debt.amount)}
                  </span>
                </div>
              </div>

              {/* Due Date */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Müddət:</span>
                  </div>
                  <div className={`text-sm font-medium ${overdue ? 'text-red-600' : daysUntilDue <= 7 ? 'text-orange-600' : 'text-gray-900'}`}>
                    {formatDate(debt.dueDate)}
                  </div>
                </div>
                {!overdue && debt.status === 'active' && (
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {daysUntilDue > 0 ? `${daysUntilDue} gün qalıb` : 'Bu gün bitir'}
                  </div>
                )}
              </div>

              {/* Created Info */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Yaradılıb:</span>
                  </div>
                  <span className="text-sm text-gray-900">
                    {formatDate(debt.createdAt)}
                  </span>
                </div>
              </div>

              {/* Progress Bar for Active Debts */}
              {debt.status === 'active' && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Müddət</span>
                    <span>{Math.max(0, daysUntilDue)} gün</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        overdue ? 'bg-red-500 w-full' :
                        daysUntilDue <= 7 ? 'bg-orange-500 w-3/4' :
                        daysUntilDue <= 30 ? 'bg-yellow-500 w-1/2' :
                        'bg-green-500 w-1/4'
                      }`}
                    ></div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDebt(debt.id)}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Baxış
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditDebt(debt)}
                    className="text-gray-600 border-gray-200 hover:bg-gray-50"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Redaktə
                  </Button>
                </div>
                <div className="flex items-center space-x-1">
                  {debt.status === 'active' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onMarkAsPaid(debt.id)}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      title="Ödənildi kimi işarələ"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteDebt(debt.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <PaginationWrapper pagination={pagination} />
          </div>
        </div>
      )}
    </div>
  );
}
