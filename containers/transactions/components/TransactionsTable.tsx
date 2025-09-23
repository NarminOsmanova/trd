'use client';

import React from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  TrendingUp,
  TrendingDown,
  Calendar,
  User,
  FolderOpen,
  DollarSign
} from 'lucide-react';
import { Transaction } from '@/types';
import { TransactionFilters } from '../types/transactions-type';
import { mockData } from '@/lib/mock-data';
import { 
  formatCurrency, 
  formatDate, 
  getTransactionTypeLabel,
  getCategoryLabel,
  getCategoryColor,
  getInitials
} from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { usePagination } from '@/hooks/usePagination';
import PaginationWrapper from '@/components/ui/pagination-wrapper';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type TransactionStatus = 'pending' | 'approved' | 'rejected';

interface TransactionsTableProps {
  transactions: Transaction[];
  filters: TransactionFilters;
  onFiltersChange: (filters: Partial<TransactionFilters>) => void;
  onViewTransaction: (id: string) => void;
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onApproveTransaction: (id: string) => void;
  onRejectTransaction: (id: string) => void;
  getTransactionStatus: (id: string) => TransactionStatus;
  onCreateTransaction: () => void;
}

export default function TransactionsTable({
  transactions,
  filters,
  onFiltersChange,
  onViewTransaction,
  onEditTransaction,
  onDeleteTransaction,
  onApproveTransaction,
  onRejectTransaction,
  getTransactionStatus,
  onCreateTransaction
}: TransactionsTableProps) {
  
  // Add pagination
  const pagination = usePagination({ 
    data: transactions, 
    itemsPerPage: 10 
  });

  const getTransactionProject = (transaction: Transaction) => {
    return mockData.projects.find(p => p.id === transaction.projectId);
  };

  const getTransactionUser = (transaction: Transaction) => {
    return mockData.users.find(u => u.id === transaction.userId);
  };

  if (transactions.length === 0) {
    return (
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Əməliyyat Filtrləri</h3>
            <Button onClick={onCreateTransaction}>
              Yeni Əməliyyat
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Əməliyyat axtar..."
                value={filters.searchTerm || ''}
                onChange={(e) => onFiltersChange({ searchTerm: e.target.value })}
                className="pl-10"
              />
            </div>

            <Select 
              value={filters.type || 'all'} 
              onValueChange={(value) => onFiltersChange({ type: value === 'all' ? undefined : value as 'income' | 'expense' })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Növ seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Bütün növlər</SelectItem>
                <SelectItem value="income">Daxilolma</SelectItem>
                <SelectItem value="expense">Xərc</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={filters.category || 'all'} 
              onValueChange={(value) => onFiltersChange({ category: value === 'all' ? undefined : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Kateqoriya seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Bütün kateqoriyalar</SelectItem>
                <SelectItem value="material">Material</SelectItem>
                <SelectItem value="salary">Maaş</SelectItem>
                <SelectItem value="equipment">Avadanlıq</SelectItem>
                <SelectItem value="transport">Nəqliyyat</SelectItem>
                <SelectItem value="utilities">Kommunal</SelectItem>
                <SelectItem value="rent">Kirayə</SelectItem>
                <SelectItem value="marketing">Marketinq</SelectItem>
                <SelectItem value="other">Digər</SelectItem>
              </SelectContent>
            </Select>

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
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Əməliyyat tapılmadı
            </h3>
            <p className="text-gray-600 mb-4">
              Axtarış meyarlarına uyğun əməliyyat yoxdur
            </p>
            <Button onClick={onCreateTransaction}>
              Yeni Əməliyyat Əlavə Et
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Əməliyyat Filtrləri</h3>
          <Button onClick={onCreateTransaction}>
            Yeni Əməliyyat
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Əməliyyat axtar..."
              value={filters.searchTerm || ''}
              onChange={(e) => onFiltersChange({ searchTerm: e.target.value })}
              className="pl-10"
            />
          </div>

          <Select 
            value={filters.type || 'all'} 
            onValueChange={(value) => onFiltersChange({ type: value === 'all' ? undefined : value as 'income' | 'expense' })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Növ seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Bütün növlər</SelectItem>
              <SelectItem value="income">Daxilolma</SelectItem>
              <SelectItem value="expense">Xərc</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={filters.category || 'all'} 
            onValueChange={(value) => onFiltersChange({ category: value === 'all' ? undefined : value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Kateqoriya seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Bütün kateqoriyalar</SelectItem>
              <SelectItem value="material">Material</SelectItem>
              <SelectItem value="salary">Maaş</SelectItem>
              <SelectItem value="equipment">Avadanlıq</SelectItem>
              <SelectItem value="transport">Nəqliyyat</SelectItem>
              <SelectItem value="utilities">Kommunal</SelectItem>
              <SelectItem value="rent">Kirayə</SelectItem>
              <SelectItem value="marketing">Marketinq</SelectItem>
              <SelectItem value="other">Digər</SelectItem>
            </SelectContent>
          </Select>

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
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Əməliyyat</TableHead>
              <TableHead>Layihə</TableHead>
              <TableHead>İstifadəçi</TableHead>
              <TableHead>Növ</TableHead>
              <TableHead>Kateqoriya</TableHead>
              <TableHead>Məbləğ</TableHead>
              <TableHead>Tarix</TableHead>
              <TableHead className="text-right">Əməllər</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagination.paginatedData.map((transaction) => {
              const project = getTransactionProject(transaction);
              const user = getTransactionUser(transaction);
              
              return (
                <TableRow key={transaction.id} className="hover:bg-gray-50">
                  {/* Transaction Info */}
                  <TableCell>
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                        transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {transaction.type === 'income' ? (
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {transaction.description || 'Əməliyyat'}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {transaction.id}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Project */}
                  <TableCell>
                    <div className="flex items-center">
                      <FolderOpen className="w-4 h-4 text-gray-400 mr-2" />
                      <div className="text-sm text-gray-900">
                        {project?.name || 'Naməlum layihə'}
                      </div>
                    </div>
                  </TableCell>

                  {/* User */}
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-xs font-medium text-gray-600">
                          {getInitials(user?.name || 'N/A')}
                        </span>
                      </div>
                      <div className="text-sm text-gray-900">
                        {user?.name || 'Naməlum istifadəçi'}
                      </div>
                    </div>
                  </TableCell>

                  {/* Type */}
                  <TableCell>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      transaction.type === 'income' 
                        ? 'bg-green-100 text-green-800' 
                        : transaction.type === 'expense'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {getTransactionTypeLabel(transaction.type)}
                    </span>
                  </TableCell>

                  {/* Category */}
                  <TableCell>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(transaction.category)}`}>
                      {getCategoryLabel(transaction.category)}
                    </span>
                  </TableCell>

                  {/* Amount */}
                  <TableCell>
                    <div className={`text-sm font-medium ${
                      transaction.type === 'income' ? 'text-green-600' : transaction.type === 'expense' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : ''}{formatCurrency(transaction.amount)} {transaction.currency || 'AZN'}
                    </div>
                  </TableCell>

                  {/* Date */}
                  <TableCell>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(transaction.date)}
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {getTransactionStatus(transaction.id) === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onRejectTransaction(transaction.id)}
                            title="Rədd et"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            Rədd et
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => onApproveTransaction(transaction.id)}
                            title="Təsdiqlə"
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Təsdiqlə
                          </Button>
                        </>
                      )}
                      {getTransactionStatus(transaction.id) === 'approved' && (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Təsdiqləndi
                        </span>
                      )}
                      {getTransactionStatus(transaction.id) === 'rejected' && (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          Rədd edildi
                        </span>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewTransaction(transaction.id)}
                        title="Baxış"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditTransaction(transaction)}
                        title="Redaktə"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteTransaction(transaction.id)}
                        title="Sil"
                        className="text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                     
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <PaginationWrapper pagination={pagination} />
          </div>
        )}
      </div>
    </div>
  );
}
