'use client';

import React from 'react';
import { RecentTransaction } from '../types/dashboard-type';
import { mockData } from '@/lib/mock-data';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface RecentTransactionsProps {
  transactions: RecentTransaction[];
  limit?: number;
}

export default function RecentTransactions({ transactions, limit = 10 }: RecentTransactionsProps) {
  
  const getTransactionProject = (transaction: RecentTransaction) => {
    return mockData.projects.find(p => p.id === transaction.projectId);
  };

  const getTransactionUser = (transaction: RecentTransaction) => {
    return mockData.users.find(u => u.id === transaction.userId);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Son Əməliyyatlar
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Ən son əlavə edilən əməliyyatlar
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Layihə</TableHead>
              <TableHead>İstifadəçi</TableHead>
              <TableHead>Növ</TableHead>
              <TableHead>Məbləğ</TableHead>
              <TableHead>Tarix</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.slice(0, limit).map((transaction) => {
              const project = getTransactionProject(transaction);
              const user = getTransactionUser(transaction);
              
              return (
                <TableRow key={transaction.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="text-sm font-medium text-gray-900">
                      {project?.name || 'Naməlum layihə'}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-xs font-medium text-gray-600">
                          {getInitials(user?.name || 'N/A')}
                        </span>
                      </div>
                      <div className="text-sm text-gray-900">
                        {user?.name || 'Naməlum istifadəçi'}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      transaction.type === 'income' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type === 'income' ? 'Daxilolma' : 'Xərc'}
                    </span>
                  </TableCell>
                  
                  <TableCell>
                    <div className={`text-sm font-medium ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-sm text-gray-500">
                    {formatDate(transaction.date)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
      {transactions.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Əməliyyat yoxdur</p>
        </div>
      )}
    </div>
  );
}
