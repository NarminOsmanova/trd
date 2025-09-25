'use client';

import React, { useState } from 'react';
import { 
  DollarSign, 
  Plus,
  Search,
  Calendar,
  Users,
  TrendingUp,
  TrendingDown,
  Grid3X3,
  List,
  Filter
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { mockData } from '@/lib/mock-data';
import { Debt, DebtFormData, DebtFilters } from './types/debt-type';
import DebtsTable from './components/DebtsTable';
import DebtCards from './components/DebtCards';
import FormComponent from './components/FormComponent';
import DebtView from './components/DebtView';

export default function DebtPage() {
  const t = useTranslations();
  const [debts] = useState<Debt[]>(mockData.debts);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currencyFilter, setCurrencyFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);
  const [viewingDebt, setViewingDebt] = useState<Debt | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const filters: DebtFilters = {
    search: searchTerm,
    status: statusFilter as DebtFilters['status'],
    currency: currencyFilter as DebtFilters['currency']
  };

  const filteredDebts = debts.filter(debt => {
    const matchesSearch = debt.debtor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         debt.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || debt.status === statusFilter;
    const matchesCurrency = currencyFilter === 'all' || debt.currency === currencyFilter;
    
    return matchesSearch && matchesStatus && matchesCurrency;
  });

  const handleViewDebt = (debtId: string) => {
    const debt = debts.find(d => d.id === debtId);
    if (debt) {
      setViewingDebt(debt);
      setIsViewOpen(true);
    }
  };

  const handleEditDebt = (debt: Debt) => {
    setEditingDebt(debt);
    setIsFormOpen(true);
  };

  const handleDeleteDebt = (debtId: string) => {
    console.log('Delete debt:', debtId);
  };

  const handleMarkAsPaid = (debtId: string) => {
    console.log('Mark as paid:', debtId);
  };

  const handleCreateDebt = () => {
    setEditingDebt(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: DebtFormData) => {
    try {
      if (editingDebt) {
        // Update existing debt
        console.log('Update debt:', editingDebt.id, data);
      } else {
        // Create new debt
        console.log('Create debt:', data);
      }
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsFormOpen(false);
      setEditingDebt(null);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingDebt(null);
  };

  const handleCloseView = () => {
    setIsViewOpen(false);
    setViewingDebt(null);
  };

  const handleFiltersChange = (newFilters: Partial<DebtFilters>) => {
    if (newFilters.search !== undefined) setSearchTerm(newFilters.search);
    if (newFilters.status !== undefined) setStatusFilter(newFilters.status);
    if (newFilters.currency !== undefined) setCurrencyFilter(newFilters.currency);
  };

  // Calculate stats
  const totalDebts = debts.length;
  const activeDebts = debts.filter(d => d.status === 'active').length;
  const paidDebts = debts.filter(d => d.status === 'paid').length;
  const overdueDebts = debts.filter(d => d.status === 'overdue').length;
  const totalAmount = debts.reduce((sum, d) => sum + d.amount, 0);
  const activeAmount = debts.filter(d => d.status === 'active').reduce((sum, d) => sum + d.amount, 0);

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
                placeholder="Borclu adı ilə axtar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Bütün statuslar</SelectItem>
                <SelectItem value="active">Aktiv</SelectItem>
                <SelectItem value="paid">Ödənilib</SelectItem>
                <SelectItem value="overdue">Gecikmiş</SelectItem>
              </SelectContent>
            </Select>

            {/* Currency Filter */}
            <Select value={currencyFilter} onValueChange={setCurrencyFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Valyuta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Bütün valyutalar</SelectItem>
                <SelectItem value="AZN">AZN</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
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
              Yeni Borc
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
                <p className="text-sm text-gray-600">Ümumi Borclar</p>
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
                <p className="text-sm text-gray-600">Aktiv Borclar</p>
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
                <p className="text-sm text-gray-600">Ödənilib</p>
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
                <p className="text-sm text-gray-600">Gecikmiş</p>
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
                <p className="text-sm text-blue-600 mb-1">Ümumi Məbləğ</p>
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
                <p className="text-sm text-orange-600 mb-1">Aktiv Məbləğ</p>
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
            debts={filteredDebts}
            onViewDebt={handleViewDebt}
            onEditDebt={handleEditDebt}
            onDeleteDebt={handleDeleteDebt}
            onMarkAsPaid={handleMarkAsPaid}
          />
        ) : (
          <DebtsTable
            debts={filteredDebts}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onViewDebt={handleViewDebt}
            onEditDebt={handleEditDebt}
            onDeleteDebt={handleDeleteDebt}
            onMarkAsPaid={handleMarkAsPaid}
            onCreateDebt={handleCreateDebt}
          />
        )}
      </div>

      {/* Form Modal */}
      <FormComponent
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        title={editingDebt ? 'Borcu Redaktə Et' : 'Yeni Borc Yarat'}
        initialData={editingDebt ? {
          amount: editingDebt.amount,
          currency: editingDebt.currency,
          debtor: editingDebt.debtor,
          description: editingDebt.description,
          dueDate: editingDebt.dueDate.split('T')[0]
        } : undefined}
      />

      {/* View Modal */}
      <DebtView
        isOpen={isViewOpen}
        onClose={handleCloseView}
        debt={viewingDebt}
        onEdit={handleEditDebt}
        onMarkAsPaid={handleMarkAsPaid}
        onDelete={handleDeleteDebt}
      />
    </>
  );
}