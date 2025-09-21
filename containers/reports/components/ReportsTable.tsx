'use client';

import React from 'react';
import { 
  Download, 
  Calendar,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  LineChart,
  FileText,
  Filter
} from 'lucide-react';
import { mockData } from '@/lib/mock-data';
import { formatCurrency, formatDate, getCategoryLabel } from '@/lib/utils';
import { ReportFilters, ReportData } from '../types/reports-type';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ReportsTableProps {
  filters: ReportFilters;
  reportData: ReportData;
  onFiltersChange: (filters: Partial<ReportFilters>) => void;
  onExportPDF: () => void;
  onExportCSV: () => void;
}

export default function ReportsTable({
  filters,
  reportData,
  onFiltersChange,
  onExportPDF,
  onExportCSV
}: ReportsTableProps) {
  
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Hesabat Filtrləri</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={onExportPDF}
              className="text-gray-700 border-gray-300 hover:bg-gray-50"
            >
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button
              variant="outline"
              onClick={onExportCSV}
              className="text-gray-700 border-gray-300 hover:bg-gray-50"
            >
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Başlama Tarixi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => onFiltersChange({ startDate: e.target.value })}
                className="pl-10"
                title="Start Date"
                aria-label="Start Date"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bitmə Tarixi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="date"
                value={filters.endDate || ''}
                onChange={(e) => onFiltersChange({ endDate: e.target.value })}
                className="pl-10"
                title="End Date"
                aria-label="End Date"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Layihə
            </label>
            <Select 
              value={filters.projectId || 'all'} 
              onValueChange={(value) => onFiltersChange({ projectId: value === 'all' ? undefined : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Layihə seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Bütün layihələr</SelectItem>
                {mockData.projects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hesabat Növü
            </label>
            <Select 
              value={filters.reportType || 'overview'} 
              onValueChange={(value) => onFiltersChange({ reportType: value as any })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Hesabat növü seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Ümumi Baxış</SelectItem>
                <SelectItem value="detailed">Ətraflı Hesabat</SelectItem>
                <SelectItem value="comparison">Müqayisəli Analiz</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Ümumi Daxilolmalar</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(reportData.stats.totalIncome)}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Ümumi Xərclər</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(reportData.stats.totalExpenses)}</p>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Net Balans</p>
              <p className={`text-2xl font-bold ${reportData.stats.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(reportData.stats.netBalance)}
              </p>
            </div>
            <div className={`w-12 h-12 ${reportData.stats.netBalance >= 0 ? 'bg-green-50' : 'bg-red-50'} rounded-lg flex items-center justify-center`}>
              <BarChart3 className={`w-6 h-6 ${reportData.stats.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Ümumi Əməliyyatlar</p>
              <p className="text-2xl font-bold text-blue-600">{reportData.stats.totalTransactions}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Xərc Kateqoriyaları</h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {reportData.categoryBreakdown.map((item) => (
              <div key={item.category} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">
                    {getCategoryLabel(item.category)}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(item.amount)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.percentage.toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Layihə Bölgüsü</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {reportData.projectBreakdown.map((project) => (
              <div key={project.projectName} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{project.projectName}</h4>
                  <span className={`text-sm font-semibold ${project.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(project.netBalance)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Daxilolma</p>
                    <p className="font-medium text-green-600">{formatCurrency(project.income)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Xərclər</p>
                    <p className="font-medium text-red-600">{formatCurrency(project.expense)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Aylıq Trend</h3>
          <LineChart className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {reportData.monthlyTrend.map((month) => (
            <div key={month.month} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="text-sm font-medium text-gray-900">
                  {new Date(month.month + '-01').toLocaleDateString('az-AZ', { 
                    year: 'numeric', 
                    month: 'long' 
                  })}
                </div>
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <div className="text-right">
                  <p className="text-gray-600">Daxilolma</p>
                  <p className="font-medium text-green-600">{formatCurrency(month.income)}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">Xərclər</p>
                  <p className="font-medium text-red-600">{formatCurrency(month.expense)}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">Net</p>
                  <p className={`font-medium ${month.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(month.netBalance)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
