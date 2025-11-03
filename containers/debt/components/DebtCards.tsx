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
import { ApiDebt } from '../types/debt-type';
import { formatDate, getInitials } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AlertDialogComponent from '@/components/AlertDiolog/AlertDiolog';

interface DebtCardsProps {
  debts: ApiDebt[];
  pagination: {
    pageNumber: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  } | null;
  filters: {
    search?: string;
    pageNumber?: number;
    pageSize?: number;
    status?: number;
  };
  onFiltersChange: (filters: Partial<{
    search?: string;
    pageNumber?: number;
    pageSize?: number;
    status?: number;
  }>) => void;
  onViewDebt: (id: number) => void;
  onEditDebt: (debt: ApiDebt) => void;
  onDeleteDebt: (id: number) => void;
  onMarkAsPaid: (id: number) => void;
  onCreate: () => void;
  isLoading?: boolean;
}

export default function DebtCards({
  debts,
  pagination,
  filters,
  onFiltersChange,
  onViewDebt,
  onEditDebt,
  onDeleteDebt,
  onMarkAsPaid,
  onCreate,
  isLoading
}: DebtCardsProps) {
  const t = useTranslations('debt');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0: // active
        return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
      case 1: // paid
        return 'bg-green-50 border-green-200 hover:bg-green-100';
      case 2: // overdue
        return 'bg-red-50 border-red-200 hover:bg-red-100';
      default:
        return 'bg-gray-50 border-gray-200 hover:bg-gray-100';
    }
  };

  const getStatusBadgeColor = (status: number) => {
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

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteId !== null) {
      onDeleteDebt(deleteId);
      setIsDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setDeleteId(null);
  };

  if (debts.length === 0 && !isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('noDebtFound')}
          </h3>
          <p className="text-gray-600 mb-4">
            {filters.search ? t('noDebtFoundDesc') : t('noDebtYet')}
          </p>
          <Button onClick={onCreate}>
            <DollarSign className="w-5 h-5 mr-2" />
            {t('newDebt')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Debts Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">{t('loading')}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {debts.map((debt) => {
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
                        {getInitials(debt.debtorName)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {debt.debtorName}
                      </h3>
                      {debt.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                          {debt.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 ml-2">
                    <Badge className={`${getStatusBadgeColor(debt.status)} flex items-center gap-1 border text-xs`}>
                      {getStatusIcon(debt.status)}
                      {getStatusLabel(debt.status)}
                    </Badge>
                  </div>
                </div>

                {/* Amount */}
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t('amountLabel')}</span>
                    <span className="text-xl font-bold text-gray-900">
                      {debt.amount} {getCurrencySymbol(debt.currency)}
                    </span>
                  </div>
                </div>

              {/* Due Date */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{t('dueDateLabel')}</span>
                  </div>
                  <div className={`text-sm font-medium ${overdue ? 'text-red-600' : daysUntilDue <= 7 ? 'text-orange-600' : 'text-gray-900'}`}>
                    {formatDate(debt.dueDate)}
                  </div>
                </div>
                {!overdue && debt.status === 0 && (
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {daysUntilDue > 0 ? `${daysUntilDue} ${t('daysRemaining')}` : t('dueToday')}
                  </div>
                )}
              </div>

              {/* Created Info */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{t('createdLabel')}</span>
                  </div>
                  <span className="text-sm text-gray-900">
                    {formatDate(debt.createdDate)}
                  </span>
                </div>
              </div>

              {/* Progress Bar for Active Debts */}
              {debt.status === 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>{t('dueDate')}</span>
                    <span>{Math.max(0, daysUntilDue)} {t('daysRemaining')}</span>
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
                    {t('view')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditDebt(debt)}
                    className="text-gray-600 border-gray-200 hover:bg-gray-50"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    {t('edit')}
                  </Button>
                </div>
                <div className="flex items-center space-x-1">
                  {debt.status === 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onMarkAsPaid(debt.id)}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      title={t('markAsPaid')}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClick(debt.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    title={t('delete')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                {pagination.totalCount > 0 && (
                  <span>
                    {((pagination.pageNumber - 1) * pagination.pageSize) + 1}-{Math.min(pagination.pageNumber * pagination.pageSize, pagination.totalCount)} / {pagination.totalCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onFiltersChange({ pageNumber: pagination.pageNumber - 1 })}
                  disabled={!pagination.hasPreviousPage}
                >
                  {t('previousPage')}
                </Button>
                <span className="text-sm text-gray-600">
                  {t('page')} {pagination.pageNumber} / {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onFiltersChange({ pageNumber: pagination.pageNumber + 1 })}
                  disabled={!pagination.hasNextPage}
                >
                  {t('nextPage')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialogComponent
        open={isDeleteDialogOpen}
        setOpen={setIsDeleteDialogOpen}
        title={t('deleteConfirm')}
        description={t('deleteDescription')}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        variant="danger"
      />
    </div>
  );
}
