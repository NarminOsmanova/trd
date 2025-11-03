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
import { ApiDebt, CreateDebtRequest, UpdateDebtRequest, DebtDetail } from './types/debt-type';
import { DebtFormData } from './constants/validations';
import DebtsTable from './components/DebtsTable';
import DebtCards from './components/DebtCards';
import FormComponent from './components/FormComponent';
import DebtView from './components/DebtView';

export default function DebtPage() {
  const t = useTranslations('debt');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<number | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDebtId, setEditingDebtId] = useState<number | null>(null);
  const [editingDebt, setEditingDebt] = useState<DebtDetail | null>(null);
  const [viewingDebtId, setViewingDebtId] = useState<number | null>(null);
  const [viewingDebt, setViewingDebt] = useState<DebtDetail | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    pageNumber: 1,
    pageSize: 10,
    status: undefined as number | undefined,
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
  const { data: viewDebtData, isLoading: isLoadingViewDebt } = useDebt(
    viewingDebtId, 
    !!viewingDebtId
  );

  const createMutation = useCreateDebt();
  const updateMutation = useUpdateDebt();
  const deleteMutation = useDeleteDebt();

  // Update editing debt when data is fetched
  useEffect(() => {
    if (debtData?.responseValue) {
      setEditingDebt(debtData.responseValue);
    }
  }, [debtData]);

  // Update viewing debt when data is fetched
  useEffect(() => {
    if (viewDebtData?.responseValue) {
      setViewingDebt(viewDebtData.responseValue);
      setIsViewOpen(true);
    }
  }, [viewDebtData]);

  const handleFiltersChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleViewDebt = (debtId: number) => {
    setViewingDebtId(debtId);
    setViewingDebt(null);
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

  const handleMarkAsPaid = async (debtId: number) => {
    // Mark as paid - we need to fetch the full debt detail first
    setViewingDebtId(debtId);
    // Once the debt is fetched, you can update it with status: 1 (paid)
    // This would need a separate API endpoint for marking as paid
    toast.info('Bu funksionallıq hazırlanır...');
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
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={filters.search}
                onChange={(e) => handleFiltersChange({ search: e.target.value, pageNumber: 1 })}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select 
              value={filters.status?.toString() || 'all'} 
              onValueChange={(value) => handleFiltersChange({ 
                status: value === 'all' ? undefined : parseInt(value), 
                pageNumber: 1 
              })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('statusFilter')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allStatuses')}</SelectItem>
                <SelectItem value="0">{t('active')}</SelectItem>
                <SelectItem value="1">{t('paid')}</SelectItem>
                <SelectItem value="2">{t('overdue')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View Mode Toggle & Add Button */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <Button
                variant={viewMode === 'cards' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('cards')}
                className="rounded-r-none"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            <Button onClick={handleCreateDebt}>
              <Plus className="w-5 h-5 mr-2" />
              {t('newDebt')}
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 mb-1">{t('totalAmount')}</p>
                <p className="text-2xl font-bold text-blue-900">
                  {totalAmount.toLocaleString()} AZN
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 mb-1">{t('activeAmount')}</p>
                <p className="text-2xl font-bold text-orange-900">
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
            onMarkAsPaid={handleMarkAsPaid}
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
            onMarkAsPaid={handleMarkAsPaid}
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
        onMarkAsPaid={(id) => handleMarkAsPaid(parseInt(id))}
        onDelete={(id) => handleDeleteDebt(parseInt(id))}
        onAddPayment={() => {}}
      />
    </>
  );
}