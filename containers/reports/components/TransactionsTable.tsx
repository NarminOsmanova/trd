'use client';

import React from 'react';
import { 
  Download, 
  FileText,
  Eye,
  Filter
} from 'lucide-react';
import { mockData } from '@/lib/mock-data';
import { formatCurrency, formatDate, getCategoryLabel } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePagination } from '@/hooks/usePagination';
import PaginationWrapper from '@/components/ui/pagination-wrapper';

interface TransactionsTableProps {
  transactions: any[];
  onExportPDF: () => void;
  onExportCSV: () => void;
  onViewTransaction: (id: string) => void;
}

export default function TransactionsTable({
  transactions,
  onExportPDF,
  onExportCSV,
  onViewTransaction
}: TransactionsTableProps) {
  
  // Add pagination
  const pagination = usePagination({ 
    data: transactions, 
    itemsPerPage: 10 
  });

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Əməliyyat tapılmadı
          </h3>
          <p className="text-gray-600">
            Seçilmiş meyarlara uyğun əməliyyat yoxdur
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Ətraflı Əməliyyatlar</h3>
            <p className="text-sm text-gray-600 mt-1">
              Seçilmiş meyarlara uyğun bütün əməliyyatlar
            </p>
          </div>
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
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tarix</TableHead>
              <TableHead>Layihə</TableHead>
              <TableHead>İstifadəçi</TableHead>
              <TableHead>Növ</TableHead>
              <TableHead>Kateqoriya</TableHead>
              <TableHead>Məbləğ</TableHead>
              <TableHead>Təsvir</TableHead>
              <TableHead className="text-right">Əməliyyatlar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagination.paginatedData.map((transaction) => {
              const project = mockData.projects.find(p => p.id === transaction.projectId);
              const user = mockData.users.find(u => u.id === transaction.userId);
              
              return (
                <TableRow key={transaction.id} className="hover:bg-gray-50">
                  <TableCell className="text-sm text-gray-900">
                    {formatDate(transaction.date)}
                  </TableCell>
                  <TableCell className="text-sm text-gray-900">
                    {project?.name || 'Naməlum layihə'}
                  </TableCell>
                  <TableCell className="text-sm text-gray-900">
                    {user?.name || 'Naməlum istifadəçi'}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={transaction.type === 'income' ? 'success' : 'destructive'}
                      className="text-xs"
                    >
                      {transaction.type === 'income' ? 'Daxilolma' : 'Xərc'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-900">
                    {getCategoryLabel(transaction.category)}
                  </TableCell>
                  <TableCell className={`text-sm font-medium ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell className="text-sm text-gray-900 max-w-xs truncate">
                    {transaction.description || '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewTransaction(transaction.id)}
                      title="Baxış"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <PaginationWrapper pagination={pagination} />
        </div>
      )}
    </div>
  );
}
