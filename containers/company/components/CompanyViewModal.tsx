'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import DialogComponent from '@/components/modals/DialogComponent';
import { Badge } from '@/components/ui/badge';
import { Building, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CompanyDetails } from '../types/company-type';
import { OperationType } from '@/containers/transactions/types/transactions-type';

interface CompanyViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: CompanyDetails | null;
  isLoading?: boolean;
}

const getCurrencySymbol = (currency: number) => {
  switch (currency) {
    case 0: return 'AZN';
    case 1: return 'USD';
    case 2: return 'EUR';
    default: return 'AZN';
  }
};

const getOperationTypeLabel = (operationType: OperationType, t: any) => {
  switch (operationType) {
    case OperationType.IncomeFromProject: return t('operationType.incomeFromProject');
    case OperationType.IncomeFromOwnBudget: return t('operationType.incomeFromOwnBudget');
    case OperationType.CompanyBalanceIncrease: return t('operationType.companyBalanceIncrease');
    case OperationType.Expense: return t('operationType.expense');
    case OperationType.Transfer: return t('operationType.transfer');
    case OperationType.AccountIncreaseFromProject: return t('operationType.accountIncreaseFromProject');
    case OperationType.AccountIncreaseFromCompany: return t('operationType.accountIncreaseFromCompany');
    case OperationType.Refund: return t('operationType.refund');
    default: return t('operationType.other');
  }
};

const getOperationTypeColor = (operationType: OperationType) => {
  switch (operationType) {
    case OperationType.IncomeFromProject: return 'text-green-600';
    case OperationType.IncomeFromOwnBudget: return 'text-emerald-600';
    case OperationType.CompanyBalanceIncrease: return 'text-blue-600';
    case OperationType.Expense: return 'text-red-600';
    case OperationType.Transfer: return 'text-purple-600';
    case OperationType.AccountIncreaseFromProject: return 'text-teal-600';
    case OperationType.AccountIncreaseFromCompany: return 'text-cyan-600';
    case OperationType.Refund: return 'text-orange-600';
    default: return 'text-gray-600';
  }
};

export default function CompanyViewModal({ isOpen, onClose, company, isLoading }: CompanyViewModalProps) {
  const t = useTranslations();
  
  if (!isOpen) return null;

  // Loading state
  if (isLoading || !company) {
    return (
      <DialogComponent
        open={isOpen}
        setOpen={onClose}
        title={t('company.loading')}
        size="xl"
        maxHeight="max-h-[95vh]"
      >
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">{t('company.loadingData')}</span>
        </div>
      </DialogComponent>
    );
  }

  const transactions = company.transactions || [];

  return (
    <DialogComponent
      open={isOpen}
      setOpen={onClose}
      title={company.title}
      size="xl"
      maxHeight="max-h-[95vh]"
    >
      <div className="space-y-6">
        {/* Company Header */}
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          {company.logo ? (
            <div className="w-16 h-16 relative rounded-lg overflow-hidden border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={company.logo} alt={company.title} className="object-cover w-full h-full" />
            </div>
          ) : (
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
              <Building className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{company.title}</h2>
            <div className="flex items-center space-x-4 mt-2">
              <Badge variant={company.isActive ? "default" : "secondary"}>
                {company.isActive ? t('common.active') : t('common.inactive')}
              </Badge>
              {company.createdAt && (
                <span className="text-sm text-gray-600">
                  {t('company.createdAt')}: {formatDate(company.createdAt)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Budget Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-2">{t('company.currentBalance')}</p>
            <p className="text-xl font-bold text-green-600">
              {formatCurrency(company.currentBalance)} 
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-2">{t('company.budgetLimit')}</p>
            <p className="text-xl font-bold text-blue-600">
              {company.budgetLimit ? `${formatCurrency(company.budgetLimit)}` : '—'}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-2">{t('company.transactionCount')}</p>
            <p className="text-xl font-bold text-purple-600">
              {company.transactionCount || 0}
            </p>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('company.transactions')}</h3>
          
          {transactions.length > 0 ? (
            <>
              {/* Header Row */}
              <div className="grid grid-cols-5 items-center text-xs text-gray-500 px-1 pb-2 mb-3 border-b">
                <div className="col-span-2">{t('common.description')}</div>
                <div className="text-center">{t('common.manager')}</div>
                <div className="text-right">{t('common.amount')}</div>
                <div className="text-right">{t('company.balanceAfter')}</div>
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {transactions.map(transaction => (
                  <div key={transaction.id} className="bg-white rounded-lg p-3 grid grid-cols-5 items-center gap-2 hover:shadow-sm transition-shadow">
                    <div className="col-span-2">
                      <p className="text-sm font-medium mb-1 line-clamp-2">
                        {transaction.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{formatDate(transaction.date)}</span>
                        <Badge variant="outline" className="text-xs">
                          {getOperationTypeLabel(transaction.operationType, t)}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-center">
                      <Badge variant="secondary" className="text-xs">
                        {transaction.manager}
                      </Badge>
                    </div>
                    <div className={`text-sm font-semibold text-right flex items-center justify-end gap-1 ${getOperationTypeColor(transaction.operationType)}`}>
                      {transaction.amount < 0 ? (
                        <>
                          <TrendingDown className="w-3 h-3" />
                          {formatCurrency(Math.abs(transaction.amount))}
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-3 h-3" />
                          +{formatCurrency(transaction.amount)}
                        </>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-right text-purple-600">
                      {formatCurrency(transaction.balanceAfter)}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <Building className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">{t('company.noTransactions')}</p>
            </div>
          )}
        </div>
      </div>
    </DialogComponent>
  );
}
