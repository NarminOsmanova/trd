'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import DialogComponent from '@/components/modals/DialogComponent';
import { Badge } from '@/components/ui/badge';
import { getTransactionsByProject, getUsersByProject, getUserById } from '@/lib/mock-data';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Transaction } from '@/types';

interface ProjectViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    id: string;
    name: string;
    description?: string;
    status: 'active' | 'completed' | 'paused';
    startDate: string;
    endDate?: string;
    budget: number;
    totalExpenses: number;
    remainingBudget: number;
    assignedUsers: string[];
    targetBudget?: number;
  } | null;
}

export default function ProjectViewModal({ isOpen, onClose, project }: ProjectViewModalProps) {
  const t = useTranslations();
  
  if (!isOpen || !project) return null;

  const users = getUsersByProject(project.id);
  const transactions: Transaction[] = getTransactionsByProject(project.id);

  return (
    <DialogComponent
      open={isOpen}
      setOpen={onClose}
      title={project.name}
      size="xl"
      maxHeight="max-h-[95vh]"
    >
      <div className="space-y-4">
        {/* Compact Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">{t('projects.projectStatus')}</p>
            <Badge variant="secondary" className="text-xs">{project.status}</Badge>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">{t('projects.projectStart')}</p>
            <p className="text-sm font-medium">{formatDate(project.startDate)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">{t('projects.projectEnd')}</p>
            <p className="text-sm font-medium">{project.endDate ? formatDate(project.endDate) : '-'}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">{t('projects.projectTargetBudget')}</p>
            <p className="text-sm font-medium">{project.targetBudget ? formatCurrency(project.targetBudget) : '-'}</p>
          </div>
        </div>

        {/* Budget Summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600 mb-1">{t('projects.projectTotalBudget')}</p>
            <p className="text-lg font-bold text-blue-600">{formatCurrency(project.budget)}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600 mb-1">{t('projects.projectExpenses')}</p>
            <p className="text-lg font-bold text-red-600">{formatCurrency(project.totalExpenses)}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600 mb-1">{t('projects.projectRemainingBudget')}</p>
            <p className="text-lg font-bold text-green-600">{formatCurrency(project.remainingBudget)}</p>
          </div>
        </div>

        {/* Description & Users Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Description */}
          {project.description && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-2">{t('projects.projectDescription')}</p>
              <p className="text-sm text-gray-800">{project.description}</p>
            </div>
          )}

          {/* Users */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-2">{t('projects.projectManagers')}</p>
            <div className="flex flex-wrap gap-1">
              {users.map(u => (
                <Badge key={u.id} variant="outline" className="text-xs">{u.name}</Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm font-medium text-gray-700 mb-3">{t('projects.projectTransactions')}</p>
          {/* Header Row */}
          <div className="grid grid-cols-3 items-center text-xs text-gray-500 px-1 pb-2">
            <div>{t('projects.transaction')}</div>
            <div className="text-center">{t('projects.manager')}</div>
            <div className="text-right">{t('common.amount')}</div>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {transactions.map(transaction => {
              const user = getUserById(transaction.userId);
              return (
                <div key={transaction.id} className="bg-white rounded-lg p-3 grid grid-cols-3 items-center gap-2">
                  <div>
                    <p className="text-sm font-medium mb-1">{transaction.description || (transaction.type === 'income' ? t('projects.income') : t('projects.expense'))}</p>
                    <div className="text-xs text-gray-500">{formatDate(transaction.date)} </div>
                  </div>
                  <div className="text-center">
                    {user && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                        {user.name}
                      </span>
                    )}
                  </div>
                  <div className={`text-sm font-semibold text-right ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </div>
                </div>
              );
            })}
            {transactions.length === 0 && (
              <p className="text-sm text-gray-500 py-4 text-center">{t('projects.noTransactions')}</p>
            )}
          </div>
        </div>
      </div>
    </DialogComponent>
  );
}


