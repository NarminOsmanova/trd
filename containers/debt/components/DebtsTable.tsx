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
  Calendar,
  User,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Debt, DebtFilters } from '../types/debt-type';
import { mockData } from '@/lib/mock-data';
import { formatCurrency, formatDate, getInitials } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePagination } from '@/hooks/usePagination';
import PaginationWrapper from '@/components/ui/pagination-wrapper';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DebtsTableProps {
  debts: Debt[];
  filters: DebtFilters;
  onFiltersChange: (filters: Partial<DebtFilters>) => void;
  onViewDebt: (id: string) => void;
  onEditDebt: (debt: Debt) => void;
  onDeleteDebt: (id: string) => void;
  onMarkAsPaid: (id: string) => void;
  onCreateDebt: () => void;
}

export default function DebtsTable({
  debts,
  filters,
  onFiltersChange,
  onViewDebt,
  onEditDebt,
  onDeleteDebt,
  onMarkAsPaid,
  onCreateDebt,
}: DebtsTableProps) {
  const t = useTranslations();

  const getStatusColor = (status: Debt['status']) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Debt['status']) => {
    switch (status) {
      case 'active':
        return <Clock className="w-4 h-4" />;
      case 'paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'overdue':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: Debt['status']) => {
    switch (status) {
      case 'active':
        return 'Aktiv';
      case 'paid':
        return 'Ödənilib';
      case 'overdue':
        return 'Gecikmiş';
      default:
        return 'Naməlum';
    }
  };

  const getDebtUser = (debt: Debt) => {
    return mockData.users.find(u => u.id === debt.createdBy);
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  // Add pagination
  const pagination = usePagination({
    data: debts,
    itemsPerPage: 10
  });

  if (debts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Borc tapılmadı
          </h3>
          <p className="text-gray-600 mb-4">
            Axtarış meyarlarına uyğun borc yoxdur
          </p>
          <Button onClick={onCreateDebt}>
            <Plus className="w-5 h-5 mr-2" />
            Yeni Borc
          </Button>
        </div>
      </div>
    );
  }

  return (
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
              value={filters.search}
              onChange={(e) => onFiltersChange({ search: e.target.value })}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <Select value={filters.status} onValueChange={(value) => onFiltersChange({ status: value as DebtFilters['status'] })}>
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
          <Select value={filters.currency} onValueChange={(value) => onFiltersChange({ currency: value as DebtFilters['currency'] })}>
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

        {/* Add Debt Button */}
        <Button onClick={onCreateDebt}>
          <Plus className="w-5 h-5 mr-2" />
          Yeni Borc
        </Button>
      </div>

      {/* Debts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Borclu</TableHead>
              <TableHead>Məbləğ</TableHead>
              <TableHead>Müddət</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Yaradılıb</TableHead>
              <TableHead>Əməliyyatlar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagination.paginatedData.map((debt) => {
              const user = getDebtUser(debt);
              const overdue = isOverdue(debt.dueDate);
              
              return (
                <TableRow key={debt.id} className="hover:bg-gray-50">
                  {/* Debtor */}
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-xs font-medium text-gray-600">
                          {getInitials(debt.debtor)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{debt.debtor}</p>
                        {debt.description && (
                          <p className="text-xs text-gray-500 truncate max-w-48">
                            {debt.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Amount */}
                  <TableCell>
                    <div className="text-sm font-semibold text-gray-900">
                      {formatCurrency(debt.amount)} {debt.currency}
                    </div>
                  </TableCell>

                  {/* Due Date */}
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <div className={`text-sm ${overdue ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                        {formatDate(debt.dueDate)}
                      </div>
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge className={`${getStatusColor(debt.status)} flex items-center gap-1`}>
                      {getStatusIcon(debt.status)}
                      {getStatusLabel(debt.status)}
                    </Badge>
                  </TableCell>

                  {/* Created At */}
                  <TableCell>
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <div className="text-sm text-gray-900">
                        {formatDate(debt.createdAt)}
                      </div>
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDebt(debt.id)}
                        title="Baxış"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditDebt(debt)}
                        title="Redaktə"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      {debt.status === 'active' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onMarkAsPaid(debt.id)}
                          title="Ödənildi kimi işarələ"
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteDebt(debt.id)}
                        title="Sil"
                        className="text-red-600 hover:text-red-700"
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
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <PaginationWrapper pagination={pagination} />
          </div>
        </div>
      )}
    </div>
  );
}
