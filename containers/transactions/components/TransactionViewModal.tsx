'use client';

import React from 'react';
import DialogComponent from '@/components/modals/DialogComponent';
import { mockData } from '@/lib/mock-data';
import { formatCurrency, formatDate, getCategoryLabel, getTransactionTypeLabel } from '@/lib/utils';
import { Transaction } from '@/types';

interface TransactionViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction;
}

export default function TransactionViewModal({ isOpen, onClose, transaction }: TransactionViewModalProps) {
  const project = mockData.projects.find(p => p.id === transaction.projectId);
  const user = mockData.users.find(u => u.id === transaction.userId);

  return (
    <DialogComponent
      open={isOpen}
      setOpen={onClose}
      title="Əməliyyat Detalları"
      size="xl"
      maxHeight="max-h-[90vh]"
    >
      <div className="space-y-6">
        {/* Header with ID and Status */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Əməliyyat #{transaction.id}</h3>
            <p className="text-sm text-gray-500">Yaradılma tarixi: {formatDate(transaction.createdAt)}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            transaction.type === 'income' 
              ? 'bg-green-100 text-green-800' 
              : transaction.type === 'expense' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
          }`}>
            {getTransactionTypeLabel(transaction.type)}
          </div>
        </div>

        {/* Main Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Əsas Məlumatlar</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Kateqoriya:</span>
                  <span className="text-sm font-medium">{getCategoryLabel(transaction.category)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Məbləğ:</span>
                  <span className={`text-lg font-bold ${transaction.type === 'income' ? 'text-green-600' : transaction.type === 'expense' ? 'text-red-600' : 'text-blue-600'}`}>
                    {transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : ''}{formatCurrency(transaction.amount)} {transaction.currency || 'AZN'}
                  </span>
                </div>
                {transaction.type === 'income' && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Mənbə:</span>
                    <span className="text-sm font-medium">{transaction.source || '—'}</span>
                  </div>
                )}
                {transaction.type === 'transfer' && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Hara Layihə:</span>
                    <span className="text-sm font-medium">{mockData.projects.find(p=>p.id===transaction.toProjectId)?.name || '—'}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tarix:</span>
                  <span className="text-sm font-medium">{formatDate(transaction.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Yenilənmə:</span>
                  <span className="text-sm font-medium">{formatDate(transaction.updatedAt)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Layihə Məlumatları</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Layihə:</span>
                  <span className="text-sm font-medium">{project?.name || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className="text-sm font-medium">{project?.status || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Büdcə:</span>
                  <span className="text-sm font-medium">{project ? formatCurrency(project.budget) : '—'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">İstifadəçi Məlumatları</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Ad:</span>
                  <span className="text-sm font-medium">{user?.name || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="text-sm font-medium">{user?.email || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Rol:</span>
                  <span className="text-sm font-medium">{user?.role || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Telefon:</span>
                  <span className="text-sm font-medium">{user?.phone || '—'}</span>
                </div>

              </div>
            </div>
            {transaction.description && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Təsvir</h4>
            <p className="text-sm text-gray-800 leading-relaxed">{transaction.description}</p>
          </div>
        )}
          </div>

        </div>

        {/* Description */}
        
      </div>
    </DialogComponent>
  );
}




