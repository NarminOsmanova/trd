'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  Edit, 
  Trash2, 
  Calendar,
  DollarSign,
  FileText,
  Plus
} from 'lucide-react';
import DialogComponent from '@/components/modals/DialogComponent';
import { Button } from '@/components/ui/button';
import AlertDialogComponent from '@/components/AlertDiolog/AlertDiolog';
import { formatDate } from '@/lib/utils';
import { useDebtPayments, useDeleteDebtPayment } from '@/lib/hooks/useDebtPayment';
import { DebtPayment, PaymentDetail } from '../types/debt-type';
import { toast } from 'sonner';

interface DebtPaymentsProps {
  isOpen: boolean;
  onClose: () => void;
  debtId: number | null;
  debtorName?: string;
  currency?: string;
  payments?: PaymentDetail[];
  onEditPayment: (payment: DebtPayment) => void;
  onAddPayment: () => void;
}

export default function DebtPayments({
  isOpen,
  onClose,
  debtId,
  debtorName,
  currency = 'AZN',
  payments: externalPayments,
  onEditPayment,
  onAddPayment,
}: DebtPaymentsProps) {
  const t = useTranslations('debt');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Always fetch payments from API for real-time updates
  const { payments: fetchedPayments, isLoading: isFetchingPayments, refetchPayments } = useDebtPayments({
    debtId: debtId || undefined,
  });

  // Use fetched payments if available, otherwise fallback to external payments
  // This ensures we always show the latest data after create/update/delete
  const payments = fetchedPayments.length > 0 
    ? fetchedPayments 
    : externalPayments 
      ? externalPayments.map(p => ({
          ...p,
          debtId: debtId || 0,
        }))
      : [];
  const isLoading = isFetchingPayments;

  const deleteMutation = useDeleteDebtPayment();

  const getCurrencySymbol = (currency: number) => {
    switch (currency) {
      case 0: return 'AZN';
      case 1: return 'USD';
      case 2: return 'EUR';
      default: return 'AZN';
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteId === null) return;

    try {
      const response = await deleteMutation.mutateAsync(deleteId);
      toast.success(response.message || t('paymentDeleteSuccess'));
      setIsDeleteDialogOpen(false);
      setDeleteId(null);
      refetchPayments();
    } catch (error: unknown) {
      console.error('Delete payment error:', error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || t('paymentDeleteError'));
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setDeleteId(null);
  };

  if (!isOpen || !debtId) return null;

  return (
    <>
      <DialogComponent
        open={isOpen}
        setOpen={(open) => !open && onClose()}
        title={`${t('paymentHistory')} - ${debtorName || ''}`}
        size="lg"
        onClose={onClose}
        footer={
          <div className="flex items-center justify-between w-full">
            <Button
              type="button"
              onClick={onAddPayment}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('addPayment')}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              {t('close')}
            </Button>
          </div>
        }
        showFooter={true}
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">{t('loading')}</span>
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('noPaymentsFound')}
            </h3>
            <p className="text-gray-600 mb-4">
              {t('noPaymentsYet')}
            </p>
            <Button onClick={onAddPayment}>
              <Plus className="w-5 h-5 mr-2" />
              {t('addPayment')}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Payments List */}
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Payment Amount */}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xl font-bold text-gray-900">
                          {payment.amount} {currency}
                        </p>
                        <p className="text-xs text-gray-500">
                          {t('paymentAmount')}
                        </p>
                      </div>
                    </div>

                    {/* Payment Date */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(payment.paymentDate)}</span>
                    </div>

                    {/* Note */}
                    {payment.note && (
                      <div className="flex items-start gap-2 text-sm text-gray-600 mt-2">
                        <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <p className="flex-1">{payment.note}</p>
                      </div>
                    )}

                    {/* Payment Info */}
                    {debtorName && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="text-xs text-gray-500">
                          <span>{t('debtor')}: {debtorName}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditPayment(payment)}
                      className="text-green-600 border-green-200 hover:bg-green-50"
                      title={t('edit')}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(payment.id)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      title={t('delete')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogComponent>

      {/* Delete Confirmation Dialog */}
      <AlertDialogComponent
        open={isDeleteDialogOpen}
        setOpen={setIsDeleteDialogOpen}
        title={t('deletePaymentConfirm')}
        description={t('deletePaymentDescription')}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        variant="danger"
      />
    </>
  );
}

