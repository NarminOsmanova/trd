'use client';

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Plus,
  Search,
  Calendar,
  TrendingUp,
  TrendingDown,
  Grid3X3,
  List,
  X,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  useDebts, 
  useDebt, 
  useCreateDebt, 
  useUpdateDebt, 
  useDeleteDebt 
} from '@/lib/hooks/useDebt';
import { ApiDebt, CreateDebtRequest, UpdateDebtRequest, DebtDetail, DebtStatus } from './types/debt-type';
import { DebtFormData, DebtPaymentFormData } from './constants/validations';
import DebtsTable from './components/DebtsTable';
import DebtCards from './components/DebtCards';
import FormComponent from './components/FormComponent';
import DebtView from './components/DebtView';
import DebtPaymentForm from './components/DebtPaymentForm';
import DebtPayments from './components/DebtPayments';
import { useCreateDebtPayment, useUpdateDebtPayment } from '@/lib/hooks/useDebtPayment';
import { DebtPayment } from './types/debt-type';

export default function DebtPage() {
  const t = useTranslations('debt');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDebtId, setEditingDebtId] = useState<number | null>(null);
  const [editingDebt, setEditingDebt] = useState<DebtDetail | null>(null);
  const [viewingDebtId, setViewingDebtId] = useState<number | null>(null);
  const [viewingDebt, setViewingDebt] = useState<DebtDetail | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);
  const [paymentDebtId, setPaymentDebtId] = useState<number | null>(null);
  const [isPaymentsModalOpen, setIsPaymentsModalOpen] = useState(false);
  const [paymentsDebtId, setPaymentsDebtId] = useState<number | null>(null);
  const [editingPayment, setEditingPayment] = useState<DebtPayment | null>(null);

  const [filters, setFilters] = useState({
    search: '',
    pageNumber: 1,
    pageSize: 10,
    status: undefined as number | undefined,
    month: undefined as number | undefined,
    year: undefined as number | undefined,
  });

  // API Hooks
  const { 
    debts, 
    statistics,
    pagination, 
    isLoading, 
    refetchDebts 
  } = useDebts(filters);

  // Hook for editing
  const { data: debtData, isLoading: isLoadingDebt } = useDebt(
    editingDebtId, 
    !!editingDebtId
  );

  // Hook for viewing
  const { data: viewDebtData, isLoading: isLoadingViewDebt, refetch: refetchViewDebt } = useDebt(
    viewingDebtId, 
    !!viewingDebtId
  );

  const createMutation = useCreateDebt();
  const updateMutation = useUpdateDebt();
  const deleteMutation = useDeleteDebt();
  const createPaymentMutation = useCreateDebtPayment();
  const updatePaymentMutation = useUpdateDebtPayment();

  // Update editing debt when data is fetched
  useEffect(() => {
    if (debtData?.responseValue) {
      setEditingDebt(debtData.responseValue);
    }
  }, [debtData]);

  // Update viewing debt when data is fetched (but don't auto-open modal)
  useEffect(() => {
    if (viewDebtData?.responseValue) {
      setViewingDebt(viewDebtData.responseValue);
      // Don't auto-open DebtView modal - only open when explicitly requested
    }
  }, [viewDebtData]);

  const handleFiltersChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      pageNumber: 1,
      pageSize: 10,
      status: undefined,
      month: undefined,
      year: undefined,
    });
  };

  const hasActiveFilters = filters.search || filters.status !== undefined || filters.month !== undefined || filters.year !== undefined;

  const handleViewDebt = (debtId: number) => {
    setViewingDebtId(debtId);
    setViewingDebt(null);
    setIsViewOpen(true); // Explicitly open DebtView modal
  };

  const handleEditDebt = (debt: ApiDebt) => {
    setEditingDebtId(debt.id);
    setEditingDebt(null);
    setIsFormOpen(true);
  };

  const handleDeleteDebt = async (debtId: number) => {
    try {
      const response = await deleteMutation.mutateAsync(debtId);
      toast.success(response.message || t('deleteSuccess'));
      refetchDebts();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || t('deleteError'));
    }
  };

  const handleAddPayment = async (debtId: number) => {
    setPaymentDebtId(debtId);
    setViewingDebtId(debtId); // Fetch debt details for payment form (but don't open DebtView)
    setIsPaymentFormOpen(true);
  };

  const handleCreateDebt = () => {
    setEditingDebtId(null);
    setEditingDebt(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: DebtFormData) => {
    try {
      if (editingDebt) {
        const updateData: UpdateDebtRequest = {
          id: editingDebt.id,
          debtorName: data.debtorName,
          ...(data.debtorId && data.debtorId > 0 && { debtorId: data.debtorId }),
          amount: data.amount,
          currency: parseInt(data.currency),
          dueDate: data.dueDate,
          description: data.description || '',
          isNewDebtor: data.isNewDebtor ?? true,
        };
        const response = await updateMutation.mutateAsync(updateData);
        toast.success(response.message || t('updateSuccess'));
      } else {
        const createData: CreateDebtRequest = {
          debtorName: data.debtorName,
          ...(data.debtorId && data.debtorId > 0 && { debtorId: data.debtorId }),
          amount: data.amount,
          currency: parseInt(data.currency),
          dueDate: data.dueDate,
          description: data.description || '',
          isNewDebtor: data.isNewDebtor ?? true,
        };
        const response = await createMutation.mutateAsync(createData);
        toast.success(response.message || t('createSuccess'));
      }
      setIsFormOpen(false);
      setEditingDebtId(null);
      setEditingDebt(null);
      refetchDebts();
    } catch (error: unknown) {
      console.error('Form submission error:', error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || t('error'));
      throw error;
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingDebtId(null);
    setEditingDebt(null);
  };

  const handleCloseView = () => {
    setIsViewOpen(false);
    setViewingDebtId(null);
    setViewingDebt(null);
  };

  const handlePaymentSubmit = async (data: DebtPaymentFormData, paymentId?: number) => {
    if (!paymentDebtId) return;

    try {
      if (paymentId) {
        // Update existing payment
        const response = await updatePaymentMutation.mutateAsync({
          debtPaymentId: paymentId,
          amount: data.amount,
          paymentDate: data.paymentDate,
          note: data.note || '',
        });
        toast.success(response.message || t('paymentUpdateSuccess'));
      } else {
        // Create new payment
        const response = await createPaymentMutation.mutateAsync({
          debtId: paymentDebtId,
          amount: data.amount,
          paymentDate: data.paymentDate,
          note: data.note || '',
        });
        toast.success(response.message || t('paymentSuccess'));
      }
      setIsPaymentFormOpen(false);
      setPaymentDebtId(null);
      setEditingPayment(null);
      // Refetch debt details to get updated payments list
      if (viewingDebtId) {
        refetchViewDebt();
      }
      refetchDebts();
    } catch (error: unknown) {
      console.error('Payment submission error:', error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || t('paymentError'));
      throw error;
    }
  };

  const handleClosePaymentForm = () => {
    setIsPaymentFormOpen(false);
    setPaymentDebtId(null);
    setEditingPayment(null);
    if (!isViewOpen) {
      setViewingDebtId(null);
    }
  };

  const handleViewPayments = (debtId: number) => {
    setPaymentsDebtId(debtId);
    setViewingDebtId(debtId); // Fetch debt details
    setIsPaymentsModalOpen(true);
  };

  const handleEditPayment = (payment: DebtPayment) => {
    setEditingPayment(payment);
    setPaymentDebtId(payment.debtId);
    setViewingDebtId(payment.debtId);
    setIsPaymentsModalOpen(false);
    setIsPaymentFormOpen(true);
  };

  const handleAddPaymentFromList = () => {
    setEditingPayment(null);
    // Keep the paymentDebtId from paymentsDebtId
    if (paymentsDebtId) {
      setPaymentDebtId(paymentsDebtId);
    }
    setIsPaymentFormOpen(true);
  };

  const handleClosePaymentsModal = () => {
    setIsPaymentsModalOpen(false);
    setPaymentsDebtId(null);
    if (!isPaymentFormOpen) {
      setViewingDebtId(null);
    }
  };

  // Use statistics from API
  const totalDebts = statistics?.totalDebts || 0;
  const activeDebts = statistics?.activeDebts || 0;
  const paidDebts = statistics?.paidDebts || 0;
  const overdueDebts = statistics?.overdueDebts || 0;
  const totalAmount = statistics?.totalAmount || 0;
  const activeAmount = statistics?.activeAmount || 0;

  return (
    <>
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="space-y-4">
          {/* Top Row: Search and Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            {/* Search */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={filters.search}
                onChange={(e) => handleFiltersChange({ search: e.target.value, pageNumber: 1 })}
                className="pl-10 pr-10"
              />
              {filters.search && (
                <button
                  onClick={() => handleFiltersChange({ search: '', pageNumber: 1 })}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer hover:text-gray-700"
                  title={t('clearSearch')}
                  aria-label={t('clearSearch')}
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                  className="rounded-r-none cursor-pointer"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="rounded-l-none cursor-pointer"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
              <Button onClick={handleCreateDebt} className="cursor-pointer">
                <Plus className="w-5 h-5 mr-2" />
                {t('newDebt')}
              </Button>
            </div>
          </div>

          {/* Bottom Row: Filters */}
          <div className="flex  items-center gap-3">
            {/* Status Filter */}
            <Select 
              value={filters.status?.toString() || 'all'} 
              onValueChange={(value) => handleFiltersChange({ 
                status: value === 'all' ? undefined : parseInt(value), 
                pageNumber: 1 
              })}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder={t('statusFilter')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allStatuses')}</SelectItem>
                <SelectItem value="0">{t('active')}</SelectItem>
                <SelectItem value="1">{t('paid')}</SelectItem>
                <SelectItem value="2">{t('overdue')}</SelectItem>
              </SelectContent>
            </Select>

            {/* Month Filter */}
            <Select 
              value={filters.month?.toString() || 'all'} 
              onValueChange={(value) => handleFiltersChange({ 
                month: value === 'all' ? undefined : parseInt(value), 
                pageNumber: 1 
              })}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder={t('monthFilter')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allMonths')}</SelectItem>
                <SelectItem value="1">{t('january')}</SelectItem>
                <SelectItem value="2">{t('february')}</SelectItem>
                <SelectItem value="3">{t('march')}</SelectItem>
                <SelectItem value="4">{t('april')}</SelectItem>
                <SelectItem value="5">{t('may')}</SelectItem>
                <SelectItem value="6">{t('june')}</SelectItem>
                <SelectItem value="7">{t('july')}</SelectItem>
                <SelectItem value="8">{t('august')}</SelectItem>
                <SelectItem value="9">{t('september')}</SelectItem>
                <SelectItem value="10">{t('october')}</SelectItem>
                <SelectItem value="11">{t('november')}</SelectItem>
                <SelectItem value="12">{t('december')}</SelectItem>
              </SelectContent>
            </Select>

            {/* Year Filter */}
            <Select 
              value={filters.year?.toString() || 'all'} 
              onValueChange={(value) => handleFiltersChange({ 
                year: value === 'all' ? undefined : parseInt(value), 
                pageNumber: 1 
              })}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder={t('yearFilter')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allYears')}</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleClearFilters}
                className="cursor-pointer"
              >
                <X className="w-4 h-4 mr-1" />
                {t('clearFilters')}
              </Button>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <DollarSign className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('totalDebts')}</p>
                <p className="text-lg font-semibold text-gray-900">{totalDebts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('activeDebts')}</p>
                <p className="text-lg font-semibold text-green-600">{activeDebts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <Calendar className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('paidDebts')}</p>
                <p className="text-lg font-semibold text-purple-600">{paidDebts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <TrendingDown className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('overdueDebts')}</p>
                <p className="text-lg font-semibold text-red-600">{overdueDebts}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Amount Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 mb-1">{t('totalAmount')}</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-900">
                  {totalAmount.toLocaleString()} AZN
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 mb-1">{t('activeAmount')}</p>
                <p className="text-xl sm:text-2xl font-bold text-orange-900">
                  {activeAmount.toLocaleString()} AZN
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Debts Display */}
        {viewMode === 'cards' ? (
          <DebtCards
            debts={debts}
            pagination={pagination}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onViewDebt={handleViewDebt}
            onEditDebt={handleEditDebt}
            onDeleteDebt={handleDeleteDebt}
            onMarkAsPaid={handleAddPayment}
            onViewPayments={handleViewPayments}
            onCreate={handleCreateDebt}
            isLoading={isLoading}
          />
        ) : (
          <DebtsTable
            debts={debts}
            pagination={pagination}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onViewDebt={handleViewDebt}
            onEditDebt={handleEditDebt}
            onDeleteDebt={handleDeleteDebt}
            onMarkAsPaid={handleAddPayment}
            onViewPayments={handleViewPayments}
            onCreate={handleCreateDebt}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Form Modal */}
      <FormComponent
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        title={editingDebt ? t('editDebt') : t('createDebt')}
        initialData={editingDebt ? {
          debtorName: editingDebt.debtorName,
          debtorId: undefined,
          amount: editingDebt.totalAmount,
          currency: editingDebt.currency.toString() as '0' | '1' | '2',
          description: editingDebt.description || '',
          dueDate: editingDebt.dueDate.split('T')[0],
          isNewDebtor: false,
        } : undefined}
        isLoading={isLoadingDebt}
      />

      {/* View Modal */}
      <DebtView
        isOpen={isViewOpen}
        onClose={handleCloseView}
        debt={viewingDebt}
        onEdit={(debt) => {
          const apiDebt = debts.find(d => d.id === debt.id);
          if (apiDebt) handleEditDebt(apiDebt);
        }}
        onMarkAsPaid={(id) => handleAddPayment(parseInt(id))}
        onDelete={(id) => handleDeleteDebt(parseInt(id))}
        onAddPayment={() => {}}
      />

      {/* Payment Form Modal */}
      <DebtPaymentForm
        isOpen={isPaymentFormOpen}
        onClose={handleClosePaymentForm}
        onSubmit={handlePaymentSubmit}
        title={editingPayment ? t('editPayment') : t('addPayment')}
        paymentId={editingPayment?.id}
        initialData={editingPayment ? {
          amount: editingPayment.amount,
          paymentDate: editingPayment.paymentDate.split('T')[0],
          note: editingPayment.note,
        } : undefined}
        isLoading={isLoadingViewDebt}
        debtInfo={viewDebtData?.responseValue ? {
          debtorName: viewDebtData.responseValue.debtorName,
          totalAmount: viewDebtData.responseValue.totalAmount,
          remainingAmount: viewDebtData.responseValue.remainingAmount,
          currency: viewDebtData.responseValue.currency === 0 ? 'AZN' : viewDebtData.responseValue.currency === 1 ? 'USD' : 'EUR',
        } : undefined}
      />

      {/* Payments List Modal */}
      <DebtPayments
        isOpen={isPaymentsModalOpen}
        onClose={handleClosePaymentsModal}
        debtId={paymentsDebtId}
        debtorName={viewDebtData?.responseValue?.debtorName}
        currency={viewDebtData?.responseValue ? (
          viewDebtData.responseValue.currency === 0 ? 'AZN' :
          viewDebtData.responseValue.currency === 1 ? 'USD' : 'EUR'
        ) : 'AZN'}
        payments={viewDebtData?.responseValue?.payments}
        onEditPayment={handleEditPayment}
        onAddPayment={handleAddPaymentFromList}
      />
    </>
  );
}