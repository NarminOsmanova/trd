'use client';

import React, { useState, useMemo } from 'react';
import { 
  Download, 
  Calendar,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  LineChart,
  FileText,
  Filter,
  RefreshCw
} from 'lucide-react';
import { mockData } from '@/lib/mock-data';
import { ReportFilters, ReportData, ReportStats, CategoryBreakdown, ProjectBreakdown, MonthlyTrend } from './types/reports-type';
import ReportsTable from './components/ReportsTable';
import TransactionsTable from './components/TransactionsTable';

export default function ReportsPage() {
  const [filters, setFilters] = useState<ReportFilters>({
    startDate: '',
    endDate: '',
    projectId: undefined,
    reportType: 'overview',
    userId: undefined,
    type: undefined
  });

  // Calculate filtered transactions
  const filteredTransactions = useMemo(() => {
    let filtered = mockData.transactions;
    
    if (filters.startDate) {
      filtered = filtered.filter(t => new Date(t.date) >= new Date(filters.startDate!));
    }
    if (filters.endDate) {
      filtered = filtered.filter(t => new Date(t.date) <= new Date(filters.endDate!));
    }
    if (filters.projectId) {
      filtered = filtered.filter(t => t.projectId === filters.projectId);
    }
    if (filters.userId) {
      filtered = filtered.filter(t => t.userId === filters.userId);
    }
    if (filters.type) {
      filtered = filtered.filter(t => t.type === filters.type);
    }
    
    return filtered;
  }, [filters]);

  // Calculate report data
  const reportData: ReportData = useMemo(() => {
    // Calculate statistics
    const totalIncome = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const netBalance = totalIncome - totalExpenses;

    const stats: ReportStats = {
      totalIncome,
      totalExpenses,
      netBalance,
      totalTransactions: filteredTransactions.length
    };

    // Category breakdown
    const categoryBreakdown: CategoryBreakdown[] = Object.entries(
      filteredTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
          return acc;
        }, {} as Record<string, number>)
    )
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
    }))
    .sort((a, b) => b.amount - a.amount);

    // Project breakdown
    const projectBreakdown: ProjectBreakdown[] = Object.entries(
      filteredTransactions.reduce((acc, t) => {
        const project = mockData.projects.find(p => p.id === t.projectId);
        const projectName = project?.name || 'Naməlum layihə';
        
        if (!acc[projectName]) {
          acc[projectName] = { income: 0, expense: 0 };
        }
        
        if (t.type === 'income') {
          acc[projectName].income += t.amount;
        } else if (t.type === 'expense') {
          acc[projectName].expense += t.amount;
        }
        
        return acc;
      }, {} as Record<string, { income: number; expense: number }>)
    )
    .map(([projectName, data]) => ({
      projectName,
      income: data.income,
      expense: data.expense,
      netBalance: data.income - data.expense
    }))
    .sort((a, b) => (b.income + b.expense) - (a.income + a.expense));

    // Monthly trend
    const monthlyTrend: MonthlyTrend[] = Object.entries(
      filteredTransactions.reduce((acc, t) => {
        const date = new Date(t.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!acc[monthKey]) {
          acc[monthKey] = { income: 0, expense: 0 };
        }
        
        if (t.type === 'income') {
          acc[monthKey].income += t.amount;
        } else {
          acc[monthKey].expense += t.amount;
        }
        
        return acc;
      }, {} as Record<string, { income: number; expense: number }>)
    )
    .map(([month, data]) => ({
      month,
      income: data.income,
      expense: data.expense,
      netBalance: data.income - data.expense
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

    return {
      stats,
      categoryBreakdown,
      projectBreakdown,
      monthlyTrend,
      transactions: filteredTransactions
    };
  }, [filteredTransactions]);

  const handleFiltersChange = (newFilters: Partial<ReportFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleExportPDF = () => {
    // Mock PDF export functionality
    console.log('Exporting PDF with filters:', filters);
    alert('PDF eksportu tezliklə əlavə ediləcək');
  };

  const handleExportCSV = () => {
    // Mock CSV export functionality
    console.log('Exporting CSV with filters:', filters);
    alert('CSV eksportu tezliklə əlavə ediləcək');
  };

  const handleViewTransaction = (transactionId: string) => {
    console.log('View transaction:', transactionId);
  };

  const handleRefresh = () => {
    // Mock refresh functionality
    console.log('Refreshing report data');
  };

  const handleClearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      projectId: undefined,
      reportType: 'overview',
      userId: undefined
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Hesabatlar</h2>
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

      {/* Reports Table with Filters and Charts */}
      <ReportsTable
        filters={filters}
        reportData={reportData}
        onFiltersChange={handleFiltersChange}
        onExportPDF={handleExportPDF}
        onExportCSV={handleExportCSV}
      />

      {/* Transactions Table */}
      <TransactionsTable
        transactions={reportData.transactions}
        onExportPDF={handleExportPDF}
        onExportCSV={handleExportCSV}
        onViewTransaction={handleViewTransaction}
      />

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <PieChart className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Kateqoriya Sayı</p>
              <p className="text-lg font-semibold text-gray-900">{reportData.categoryBreakdown.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <BarChart3 className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Layihə Sayı</p>
              <p className="text-lg font-semibold text-gray-900">{reportData.projectBreakdown.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <LineChart className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Ay Sayı</p>
              <p className="text-lg font-semibold text-gray-900">{reportData.monthlyTrend.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
