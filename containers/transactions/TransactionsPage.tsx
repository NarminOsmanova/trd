'use client';

import React, { useState, useMemo } from 'react';
import { 
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  RefreshCw,
  Filter
} from 'lucide-react';
import { mockData } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';
import { Transaction, TransactionFilters, TransactionStats } from './types/transactions-type';
import TransactionsTable from './components/TransactionsTable';
import FormComponent from './components/FormComponent';

export default function TransactionsPage() {
  const [transactions] = useState<Transaction[]>(mockData.transactions);
  const [filters, setFilters] = useState<TransactionFilters>({
    searchTerm: '',
    type: undefined,
    category: undefined,
    projectId: undefined,
    startDate: undefined,
    endDate: undefined
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Filter transactions based on current filters
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const project = mockData.projects.find(p => p.id === transaction.projectId);
      const user = mockData.users.find(u => u.id === transaction.userId);
      
      const matchesSearch = !filters.searchTerm || 
        project?.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        user?.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        transaction.description?.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      const matchesType = !filters.type || transaction.type === filters.type;
      const matchesCategory = !filters.category || transaction.category === filters.category;
      const matchesProject = !filters.projectId || transaction.projectId === filters.projectId;
      
      const matchesStartDate = !filters.startDate || new Date(transaction.date) >= new Date(filters.startDate);
      const matchesEndDate = !filters.endDate || new Date(transaction.date) <= new Date(filters.endDate);
      
      return matchesSearch && matchesType && matchesCategory && matchesProject && matchesStartDate && matchesEndDate;
    });
  }, [transactions, filters]);

  // Calculate transaction statistics
  const transactionStats: TransactionStats = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      const currentDate = new Date();
      return transactionDate.getMonth() === currentDate.getMonth() &&
             transactionDate.getFullYear() === currentDate.getFullYear();
    }).length;

    return {
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
      totalTransactions: transactions.length,
      monthlyTransactions
    };
  }, [transactions]);

  const handleFiltersChange = (newFilters: Partial<TransactionFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleViewTransaction = (transactionId: string) => {
    console.log('View transaction:', transactionId);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleDeleteTransaction = (transactionId: string) => {
    console.log('Delete transaction:', transactionId);
  };

  const handleCreateTransaction = () => {
    setEditingTransaction(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingTransaction) {
        // Update existing transaction
        console.log('Update transaction:', editingTransaction.id, data);
      } else {
        // Create new transaction
        console.log('Create transaction:', data);
      }
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsFormOpen(false);
      setEditingTransaction(null);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  const handleRefresh = () => {
    console.log('Refreshing transaction data');
  };

  const handleClearFilters = () => {
    setFilters({
      searchTerm: '',
      type: undefined,
      category: undefined,
      projectId: undefined,
      startDate: undefined,
      endDate: undefined
    });
  };

  return (
    <>
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Ümumi Daxilolmalar
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(transactionStats.totalIncome)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Ümumi Xərclər
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(transactionStats.totalExpenses)}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Net Balans
                </p>
                <p className={`text-2xl font-bold ${transactionStats.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(transactionStats.netBalance)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Əməliyyatlar</h2>
            </div>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="Yenilə"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Yenilə
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtrləri Təmizlə
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <TransactionsTable
          transactions={filteredTransactions}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onViewTransaction={handleViewTransaction}
          onEditTransaction={handleEditTransaction}
          onDeleteTransaction={handleDeleteTransaction}
          onCreateTransaction={handleCreateTransaction}
        />

        {/* Transaction Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ümumi Daxilolmalar</p>
                <p className="text-lg font-semibold text-green-600">{formatCurrency(transactionStats.totalIncome)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <TrendingDown className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ümumi Xərclər</p>
                <p className="text-lg font-semibold text-red-600">{formatCurrency(transactionStats.totalExpenses)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <DollarSign className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ümumi Əməliyyatlar</p>
                <p className="text-lg font-semibold text-gray-900">{transactionStats.totalTransactions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <Calendar className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Bu Ay</p>
                <p className="text-lg font-semibold text-gray-900">{transactionStats.monthlyTransactions}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      <FormComponent
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        title={editingTransaction ? 'Əməliyyatı Redaktə Et' : 'Yeni Əməliyyat Yarat'}
        initialData={editingTransaction ? {
          projectId: editingTransaction.projectId,
          type: editingTransaction.type,
          category: editingTransaction.category,
          amount: editingTransaction.amount,
          description: editingTransaction.description,
          date: editingTransaction.date
        } : undefined}
      />
    </>
  );
}
