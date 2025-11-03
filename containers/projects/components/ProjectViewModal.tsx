'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import DialogComponent from '@/components/modals/DialogComponent';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useProject } from '@/lib/hooks/useProject';
import { OperationType } from '@/containers/transactions/types/transactions-type';
import { Currency } from '@/containers/company/types/company-type';
import { ProjectStatus } from '../types/projects-type';

interface ProjectViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string | null;
}

export default function ProjectViewModal({ isOpen, onClose, projectId }: ProjectViewModalProps) {
  const t = useTranslations();
  
  // Fetch project details
  const { data: projectData, isLoading } = useProject(
    projectId ? parseInt(projectId) : null,
    !!(isOpen && projectId)
  );

  if (!isOpen) return null;

  const project = projectData?.responseValue;

  if (isLoading) {
    return (
      <DialogComponent
        open={isOpen}
        setOpen={onClose}
        title={t('common.loading')}
        size="xl"
        maxHeight="max-h-[95vh]"
      >
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DialogComponent>
    );
  }

  if (!project) return null;

  // Helper functions
  const getStatusLabel = (status: ProjectStatus): string => {
    switch (status) {
      case ProjectStatus.Active:
        return t('common.active');
      case ProjectStatus.Completed:
        return t('common.completed');
      case ProjectStatus.Paused:
        return t('common.paused');
      case ProjectStatus.Draft:
        return t('common.draft');
      default:
        return '';
    }
  };

  const getStatusVariant = (status: ProjectStatus): 'default' | 'success' | 'warning' | 'secondary' => {
    switch (status) {
      case ProjectStatus.Active:
        return 'success';
      case ProjectStatus.Completed:
        return 'default';
      case ProjectStatus.Paused:
        return 'warning';
      case ProjectStatus.Draft:
        return 'secondary';
      default:
        return 'default';
    }
  };

  const isIncomeOperation = (type: number): boolean => {
    return [
      OperationType.IncomeFromProject,
      OperationType.IncomeFromOwnBudget,
      OperationType.CompanyBalanceIncrease,
      OperationType.AccountIncreaseFromProject,
      OperationType.AccountIncreaseFromCompany,
      OperationType.Refund
    ].includes(type);
  };

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
            <Badge variant={getStatusVariant(project.status)} className="text-xs">
              {getStatusLabel(project.status)}
            </Badge>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">{t('projects.projectStart')}</p>
            <p className="text-sm font-medium">{formatDate(project.startDate)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">{t('projects.projectEnd')}</p>
            <p className="text-sm font-medium">
              {project.endDatePlanned ? formatDate(project.endDatePlanned) : '-'}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">{t('projects.projectTargetBudget')}</p>
            <p className="text-sm font-medium">
              {formatCurrency(project.financialSummary.plannedCapital)} 
            </p>
          </div>
        </div>

        {/* Budget Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600 mb-1">{t('projects.totalIncome')}</p>
            <p className="text-lg font-bold text-blue-600">
              {formatCurrency(project.financialSummary.totalIncome)} 
            </p>
          </div>
          <div className="bg-red-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600 mb-1">{t('projects.projectExpenses')}</p>
            <p className="text-lg font-bold text-red-600">
              {formatCurrency(project.financialSummary.totalExpenses)} 
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600 mb-1">{t('projects.projectRemainingBudget')}</p>
            <p className="text-lg font-bold text-green-600">
              {formatCurrency(project.financialSummary.remainingBudget)} 
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600 mb-1">{t('projects.projectAccount')}</p>
            <p className="text-lg font-bold text-purple-600">
              {formatCurrency(project.financialSummary.currentBalance)}
            </p>
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
              {project.teamMembers.map(member => (
                <Badge key={member.id} variant="outline" className="text-xs">
                  {member.fullName}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm font-medium text-gray-700 mb-3">{t('projects.projectTransactions')}</p>
          {/* Header Row */}
          <div className="grid grid-cols-5 items-center text-xs text-gray-500 px-1 pb-2">
            <div>{t('projects.transaction')}</div>
            <div className="text-center">{t('projects.category')}</div>
            <div className="text-center">{t('projects.manager')}</div>
            <div className="text-right">{t('common.amount')}</div>
            <div className="text-right">{t('projects.projectAccount')}</div>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {project.recentTransactions.map(transaction => {
              const isIncome = isIncomeOperation(transaction.type);
              return (
                <div key={transaction.id} className="bg-white rounded-lg p-3 grid grid-cols-5 items-center gap-2">
                  <div>
                    <p className="text-sm font-medium mb-1">{transaction.description}</p>
                    <div className="text-xs text-gray-500">{formatDate(transaction.date)}</div>
                  </div>
                  <div className="text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">
                      {transaction.category}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                      {transaction.userName}
                    </span>
                  </div>
                  <div className={`text-sm font-semibold text-right ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                    {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </div>
                  <div className="text-sm font-semibold text-right text-purple-600">
                    {formatCurrency(transaction.projectBalance)} 
                  </div>
                </div>
              );
            })}
            {project.recentTransactions.length === 0 && (
              <p className="text-sm text-gray-500 py-4 text-center">{t('projects.noTransactions')}</p>
            )}
          </div>
        </div>
      </div>
    </DialogComponent>
  );
}


