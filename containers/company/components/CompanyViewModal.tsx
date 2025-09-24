'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import DialogComponent from '@/components/modals/DialogComponent';
import { Badge } from '@/components/ui/badge';
import { Building } from 'lucide-react';
import { 
  getCompanyById, 
  getCompanyAccountBalance, 
  getCompanyTransactionsWithBalance, 
  getUserById 
} from '@/lib/mock-data';
import { formatCurrency, formatDate, getCategoryLabel, getTransactionTypeLabel } from '@/lib/utils';
import { CompanyItem } from '../types/company-type';

interface CompanyViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: CompanyItem | null;
}

export default function CompanyViewModal({ isOpen, onClose, company }: CompanyViewModalProps) {
  const t = useTranslations();
  
  if (!isOpen || !company) return null;

  const accountBalance = getCompanyAccountBalance(company.id);
  const transactionsWithBalance = getCompanyTransactionsWithBalance(company.id);

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
          {company.logoUrl ? (
            <div className="w-16 h-16 relative rounded-lg overflow-hidden border">
              <img src={company.logoUrl} alt={company.title} className="object-cover w-full h-full" />
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
              <span className="text-sm text-gray-600">
                Yaradılma: {formatDate(company.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Budget Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-2">{t('projects.budgetLimit')}</p>
            <p className="text-xl font-bold text-blue-600">
              {company.budgetLimit ? formatCurrency(company.budgetLimit) : '—'}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-2">{t('projects.companyAccount')}</p>
            <p className="text-xl font-bold text-purple-600">
              {formatCurrency(accountBalance)}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-2">{t('projects.transactionCount')}</p>
            <p className="text-xl font-bold text-gray-600">
              {transactionsWithBalance.length}
            </p>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('projects.projectTransactions')}</h3>
          
          {transactionsWithBalance.length > 0 ? (
            <>
              {/* Header Row */}
              <div className="grid grid-cols-4 items-center text-xs text-gray-500 px-1 pb-2 mb-3">
                <div>{t('projects.transaction')}</div>
                <div className="text-center">{t('common.user')}</div>
                <div className="text-right">{t('common.amount')}</div>
                <div className="text-right">{t('projects.companyAccount')}</div>
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {transactionsWithBalance.map(transaction => {
                  const user = getUserById(transaction.userId);
                  return (
                    <div key={transaction.id} className="bg-white rounded-lg p-3 grid grid-cols-4 items-center gap-2">
                      <div>
                        <p className="text-sm font-medium mb-1">
                          {transaction.description || getTransactionTypeLabel(transaction.type)}
                        </p>
                        <div className="text-xs text-gray-500">
                          {formatDate(transaction.date)} · {getCategoryLabel(transaction.category)}
                        </div>
                      </div>
                      <div className="text-center">
                        {user && (
                          <Badge variant="secondary" className="text-xs">
                            {user.name}
                          </Badge>
                        )}
                      </div>
                      <div className={`text-sm font-semibold text-right ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </div>
                      <div className="text-sm font-semibold text-right text-purple-600">
                        {formatCurrency(transaction.runningBalance)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <Building className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">{t('projects.noTransactions')}</p>
            </div>
          )}
        </div>
      </div>
    </DialogComponent>
  );
}
