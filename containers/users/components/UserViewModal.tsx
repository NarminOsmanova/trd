'use client';

import React from 'react';
import { 
  Mail,
  Phone,
  Shield,
  ShieldCheck,
  UserCheck,
  UserX,
  DollarSign,
  TrendingUp,
  Calendar,
  Clock,
  FileText,
  ArrowUpRight,
  ArrowDownLeft,
  Building2
} from 'lucide-react';
import { User } from '../types/users-type';
import { mockData } from '@/lib/mock-data';
import { formatDate, getRoleLabel, getInitials } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import DialogComponent from '@/components/modals/DialogComponent';

interface UserViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export default function UserViewModal({
  isOpen,
  onClose,
  user
}: UserViewModalProps) {
  
  if (!user) return null;

  const getUserTransactions = (userId: string) => {
    return mockData.transactions.filter(t => t.userId === userId);
  };

  const getBudgetInfo = (userId: string) => {
    const userTransactions = getUserTransactions(userId);
    const totalAmount = userTransactions.reduce((sum, t) => sum + t.amount, 0);
    const transactionCount = userTransactions.length;
    
    return {
      totalAmount,
      transactionCount,
      avgTransaction: transactionCount > 0 ? totalAmount / transactionCount : 0,
      incomeTransactions: userTransactions.filter(t => t.type === 'income'),
      expenseTransactions: userTransactions.filter(t => t.type === 'expense')
    };
  };

  const getUserProjects = (userId: string) => {
    return mockData.projects.filter(p => p.assignedUsers.includes(userId));
  };

  const getTransactionCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      material: 'Material',
      salary: 'Maaş',
      equipment: 'Avadanlıq',
      transport: 'Nəqliyyat',
      utilities: 'Kommunal',
      rent: 'Kirayə',
      marketing: 'Marketinq',
      other: 'Digər'
    };
    return labels[category] || category;
  };

  const budgetInfo = getBudgetInfo(user.id);
  const userProjects = getUserProjects(user.id);
  const userTransactions = getUserTransactions(user.id);

  return (
    <DialogComponent
      open={isOpen}
      setOpen={(open) => !open && onClose()}
      title="İstifadəçi Məlumatları"
      size="xl"
      maxHeight="max-h-[95vh]"
      className=""
      contentClassName="p-0"
    >
      <div className="space-y-6 p-6">
          {/* User Header */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
            <div className="flex items-start space-x-6">
              <div className="relative">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <span className="text-white font-bold text-xl">
                      {getInitials(user?.name || '')}
                    </span>
                  </div>
                )}
                <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-white ${
                  user.isActive ? 'bg-green-500' : 'bg-red-500'
                }`} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                  <div className="flex items-center space-x-2">
                    {user.role === 'admin' ? (
                      <Shield className="w-5 h-5 text-purple-600" />
                    ) : (
                      <ShieldCheck className="w-5 h-5 text-blue-600" />
                    )}
                    <Badge variant={user.role === 'admin' ? 'secondary' : 'default'} className="text-sm">
                      {getRoleLabel(user.role)}
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    {user.isActive ? (
                      <UserCheck className="w-5 h-5 text-green-600 mr-1" />
                    ) : (
                      <UserX className="w-5 h-5 text-red-600 mr-1" />
                    )}
                    <Badge variant={user.isActive ? 'success' : 'destructive'} className="text-sm">
                      {user.isActive ? 'Aktiv' : 'Qeyri-aktiv'}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{user.email}</span>
                  </div>
                  {user.position && (
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-700 mr-2">{user.position}</span>
                    </div>
                  )}
                  {user.phone && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span>Qoşulma: {formatDate(user.createdAt)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    <span>ID: {user.id}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Budget Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Ümumi Büdcə</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {budgetInfo.totalAmount.toLocaleString()} AZN
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {budgetInfo.transactionCount} əməliyyat
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Orta Əməliyyat</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {budgetInfo.avgTransaction.toLocaleString()} AZN
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Əməliyyat başına
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Building2 className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Layihələr</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {userProjects.length}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Aktiv layihələr
              </div>
            </div>
          </div>

          {/* Projects Section */}
          {userProjects.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-purple-600" />
                Layihələr
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userProjects.map((project) => (
                  <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{project.name}</h4>
                      <Badge variant={project.status === 'active' ? 'success' : project.status === 'completed' ? 'default' : 'secondary'}>
                        {project.status === 'active' ? 'Aktiv' : project.status === 'completed' ? 'Tamamlandı' : 'Dayandırıldı'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">Büdcə:</span>
                        <div className="font-medium">{project.budget.toLocaleString()} AZN</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Xərc:</span>
                        <div className="font-medium">{project.totalExpenses.toLocaleString()} AZN</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transactions Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[300px]">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Əməliyyatlar ({userTransactions.length})
            </h3>
            
            {userTransactions.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {/* Header Row */}
                <div className="grid grid-cols-4 items-center text-xs text-gray-500 px-1 pb-2 border-b border-gray-200">
                  <div>Tarix</div>
                  <div>Tip</div>
                  <div>Təsvir</div>
                  <div className="text-right">Məbləğ</div>
                </div>
                
                {/* Transactions List */}
                {userTransactions.map((transaction) => {
                  const project = mockData.projects.find(p => p.id === transaction.projectId);
                  return (
                    <div key={transaction.id} className="bg-white rounded-lg p-3 grid grid-cols-4 items-center gap-2 border border-gray-100">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{formatDate(transaction.date)}</p>
                        <p className="text-xs text-gray-500">{getTransactionCategoryLabel(transaction.category)}</p>
                      </div>
                      <div>
                        <div className="flex items-center">
                          {transaction.type === 'income' ? (
                            <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
                          ) : (
                            <ArrowDownLeft className="w-4 h-4 text-red-600 mr-1" />
                          )}
                          <Badge variant={transaction.type === 'income' ? 'success' : 'destructive'} className="text-xs">
                            {transaction.type === 'income' ? 'Mədaxil' : 'Məxaric'}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">{transaction.description}</p>
                        <p className="text-xs text-gray-500">{project?.name || 'Naməlum layihə'}</p>
                      </div>
                      <div className={`text-sm font-semibold text-right ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toLocaleString()} AZN
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">Bu istifadəçinin əməliyyatı yoxdur</p>
              </div>
            )}
          </div>
        </div>
    </DialogComponent>
  );
}
