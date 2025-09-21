'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { ProjectBudgetStats } from '../types/dashboard-type';
import { formatCurrency } from '@/lib/utils';

interface DashboardChartsProps {
  projectStats: ProjectBudgetStats[];
  monthlyData: MonthlyData[];
}

interface MonthlyData {
  month: string;
  income: number;
  expense: number;
  net: number;
}

export default function DashboardCharts({ projectStats, monthlyData }: DashboardChartsProps) {
  
  // Project budget data for bar chart
  const projectBudgetData = projectStats.map(project => ({
    name: project.projectName.length > 15 ? project.projectName.substring(0, 15) + '...' : project.projectName,
    budget: project.budget,
    expenses: project.expenses,
    remaining: project.remaining
  }));

  // Project status data for pie chart
  const projectStatusData = [
    { name: 'Aktiv Layihələr', value: projectStats.filter(p => p.remaining > 0).length, color: '#10B981' },
    { name: 'Tamamlanmış', value: projectStats.filter(p => p.expenses >= p.budget * 0.9).length, color: '#8B5CF6' },
    { name: 'Büdcə Aşımı', value: projectStats.filter(p => p.remaining < 0).length, color: '#EF4444' }
  ];

  // Monthly trend data
  const monthlyTrendData = monthlyData.map(item => ({
    month: item.month,
    'Daxilolma': item.income,
    'Xərc': item.expense,
    'Net': item.net
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Project Budget Bar Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Layihə Büdcə Analizi</h3>
          <p className="text-sm text-gray-600">Layihələr üzrə büdcə və xərc müqayisəsi</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={projectBudgetData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
            />
            <YAxis 
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              fontSize={12}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [
                formatCurrency(value), 
                name === 'budget' ? 'Büdcə' : 
                name === 'expenses' ? 'Xərclər' : 'Qalıq'
              ]}
              labelStyle={{ color: '#374151' }}
            />
            <Legend />
            <Bar dataKey="budget" fill="#3B82F6" name="Büdcə" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" fill="#EF4444" name="Xərclər" radius={[4, 4, 0, 0]} />
            <Bar dataKey="remaining" fill="#10B981" name="Qalıq" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Project Status Pie Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Layihə Statusu</h3>
          <p className="text-sm text-gray-600">Layihələrin status bölgüsü</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={projectStatusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {projectStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`${value} layihə`, 'Sayı']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Trend Line Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aylıq Trend Analizi</h3>
          <p className="text-sm text-gray-600">Daxilolma və xərc trendləri</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyTrendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" fontSize={12} />
            <YAxis 
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              fontSize={12}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [
                formatCurrency(value), 
                name === 'income' ? 'Daxilolma' : 
                name === 'expense' ? 'Xərc' : 'Net'
              ]}
              labelStyle={{ color: '#374151' }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="Daxilolma" 
              stroke="#10B981" 
              strokeWidth={3}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="Xərc" 
              stroke="#EF4444" 
              strokeWidth={3}
              dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="Net" 
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
