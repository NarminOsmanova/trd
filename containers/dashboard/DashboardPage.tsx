'use client';

import React, { useState, useMemo } from 'react';
import { 
  RefreshCw,
  Filter,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { mockData } from '@/lib/mock-data';
import { DashboardStats, DashboardFilters, DashboardData } from './types/dashboard-type';
import StatsCards from './components/StatsCards';
import RecentTransactions from './components/RecentTransactions';
import ProjectBudgetStats from './components/ProjectBudgetStats';
import DashboardCharts from './components/DashboardCharts';

export default function DashboardPage() {
  const [filters, setFilters] = useState<DashboardFilters>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Calculate dashboard statistics
  const dashboardStats: DashboardStats = useMemo(() => {
    const projects = mockData.projects;
    const transactions = mockData.transactions;
    
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const totalUsers = mockData.users.length;
    
    const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const remainingBudget = totalBudget - totalExpenses + totalIncome;

    return {
      totalProjects,
      activeProjects,
      totalUsers,
      totalBudget,
      totalExpenses,
      remainingBudget
    };
  }, []);

  // Get recent transactions
  const recentTransactions = useMemo(() => {
    return mockData.transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  }, []);

  // Calculate project budget statistics
  const projectStats = useMemo(() => {
    return mockData.projects.map(project => {
      const projectTransactions = mockData.transactions.filter(t => t.projectId === project.id);
      const expenses = projectTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      const income = projectTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        projectId: project.id,
        projectName: project.name,
        budget: project.budget,
        expenses: expenses,
        remaining: project.budget - expenses + income
      };
    });
  }, []);

  // Calculate monthly trend data
  const monthlyData = useMemo(() => {
    const monthlyMap = new Map();
    
    mockData.transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, { month: monthKey, income: 0, expense: 0, net: 0 });
      }
      
      const monthData = monthlyMap.get(monthKey);
      if (transaction.type === 'income') {
        monthData.income += transaction.amount;
      } else {
        monthData.expense += transaction.amount;
      }
      monthData.net = monthData.income - monthData.expense;
    });
    
    return Array.from(monthlyMap.values())
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6); // Son 6 ay
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Dashboard data refreshed');
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleFilterChange = (newFilters: Partial<DashboardFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            title="Yenilə"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Yenilənir...' : 'Yenilə'}
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

      {/* Stats Cards */}
      <StatsCards stats={dashboardStats} />

      {/* Recent Transactions */}
      <RecentTransactions transactions={recentTransactions} />

      {/* Dashboard Charts */}
      <DashboardCharts projectStats={projectStats} monthlyData={monthlyData} />

      {/* Project Budget Stats */}
      <ProjectBudgetStats projects={projectStats} />

      {/* Additional Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Ümumi Analiz</h3>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Ümumi Layihələr</span>
              <span className="text-sm font-medium text-gray-900">{dashboardStats.totalProjects}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Aktiv Layihələr</span>
              <span className="text-sm font-medium text-green-600">{dashboardStats.activeProjects}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Ümumi İstifadəçilər</span>
              <span className="text-sm font-medium text-gray-900">{dashboardStats.totalUsers}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Maliyyə Analizi</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Ümumi Büdcə</span>
              <span className="text-sm font-medium text-gray-900">{dashboardStats.totalBudget.toLocaleString()} AZN</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Ümumi Xərclər</span>
              <span className="text-sm font-medium text-red-600">{dashboardStats.totalExpenses.toLocaleString()} AZN</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Qalıq Büdcə</span>
              <span className={`text-sm font-medium ${dashboardStats.remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {dashboardStats.remainingBudget.toLocaleString()} AZN
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
