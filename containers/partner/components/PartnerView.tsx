'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { 
  Phone, 
  Mail,
  Percent,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import DialogComponent from '@/components/modals/DialogComponent';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PartnerItem, PartnerProject, PartnerTransaction } from '../types/partner-type';
import { formatCurrency, formatDate, getInitials } from '@/lib/utils';

interface PartnerViewProps {
  isOpen: boolean;
  onClose: () => void;
  partner: PartnerItem | null;
  onEdit?: (partner: PartnerItem) => void;
  onDelete?: (partnerId: string) => void;
}

export default function PartnerView({
  isOpen,
  onClose,
  partner,
  onEdit,
  onDelete
}: PartnerViewProps) {
  const t = useTranslations();

  if (!isOpen || !partner) return null;

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />;
  };

  const getStatusLabel = (isActive: boolean) => {
    return isActive ? 'Aktiv' : 'Deaktiv';
  };

  // Mock partner projects data with detailed financial information
  const partnerProjects: PartnerProject[] = [
    {
      projectId: '1',
      projectName: 'Yeni Bina Tikintisi',
      sharePercentage: 25,
      investedAmount: 50000, // Partner's investment
      earnedAmount: 75000,   // Partner's earnings
      status: 'active',
      // Additional fields for detailed view
      totalProjectExpenses: 200000, // Total project expenses
      totalProjectIncome: 300000,   // Total project income
      partnerExpenseShare: 50000,   // Partner's share of expenses (25% of 200000)
      partnerIncomeShare: 75000     // Partner's share of income (25% of 300000)
    },
    {
      projectId: '2',
      projectName: 'Ofis Renovasiyası',
      sharePercentage: 20,
      investedAmount: 30000, // Partner's investment
      earnedAmount: 46000,   // Partner's earnings
      status: 'completed',
      // Additional fields for detailed view
      totalProjectExpenses: 150000, // Total project expenses
      totalProjectIncome: 230000,   // Total project income
      partnerExpenseShare: 30000,   // Partner's share of expenses (20% of 150000)
      partnerIncomeShare: 46000     // Partner's share of income (20% of 230000)
    },
    {
      projectId: '3',
      projectName: 'Mall Tikintisi',
      sharePercentage: 15,
      investedAmount: 15000, // Partner's investment
      earnedAmount: 18000,   // Partner's earnings
      status: 'active',
      // Additional fields for detailed view
      totalProjectExpenses: 100000, // Total project expenses
      totalProjectIncome: 120000,   // Total project income
      partnerExpenseShare: 15000,   // Partner's share of expenses (15% of 100000)
      partnerIncomeShare: 18000     // Partner's share of income (15% of 120000)
    }
  ];

  // Mock partner transactions data
  const partnerTransactions: PartnerTransaction[] = [
    {
      id: 't1',
      projectId: '1',
      projectName: 'Yeni Bina Tikintisi',
      type: 'income',
      amount: 15000,
      currency: 'AZN',
      description: 'Layihə gəliri',
      date: '2024-02-15T00:00:00Z',
      shareAmount: 15000 * (partner.sharePercentage / 100)
    },
    {
      id: 't2',
      projectId: '1',
      projectName: 'Yeni Bina Tikintisi',
      type: 'expense',
      amount: 5000,
      currency: 'AZN',
      description: 'Material xərci',
      date: '2024-02-10T00:00:00Z',
      shareAmount: 5000 * (partner.sharePercentage / 100)
    }
  ];

  return (
    <DialogComponent
      open={isOpen}
      setOpen={onClose}
      title={`Partnyor Detalları - ${partner.name}`}
      size="lg"
      maxHeight="max-h-[90vh]"
    >
      <div className="space-y-6">
        {/* Header with Partner Info */}
        <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">
              {getInitials(partner.name)}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-1">{partner.name}</h2>
            <div className="flex items-center space-x-2">
              <Badge className={`${getStatusColor(partner.isActive)} flex items-center gap-1 border`}>
                {getStatusIcon(partner.isActive)}
                {getStatusLabel(partner.isActive)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-lg font-semibold text-gray-900">{partner.email}</p>
              </div>
            </div>
          </div>

          {partner.phone && (
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Telefon</p>
                  <p className="text-lg font-semibold text-gray-900">{partner.phone}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ümumi İnvestisiya</p>
                <p className="text-xl font-bold text-red-600">
                  {formatCurrency(partner.totalInvested)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ümumi Gəlir</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(partner.totalEarned)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Partner Projects - Detailed View */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Layihələr - Ətraflı Məlumat</h3>
          <div className="space-y-4">
            {partnerProjects.map((project) => (
              <div key={project.projectId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{project.projectName}</h4>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${
                      project.status === 'active' ? 'bg-green-100 text-green-800' :
                      project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.status === 'active' ? 'Aktiv' :
                       project.status === 'completed' ? 'Tamamlandı' : 'Dayandırıldı'}
                    </Badge>
                    <Badge className="bg-orange-100 text-orange-800">
                      {project.sharePercentage}% Hissə
                    </Badge>
                  </div>
                </div>
                
                {/* Project Total Information */}
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Layihə Ümumi Məlumatları</h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Ümumi Xərc</p>
                      <p className="text-sm font-semibold text-red-600">
                        {formatCurrency(project.totalProjectExpenses || 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Ümumi Gəlir</p>
                      <p className="text-sm font-semibold text-green-600">
                        {formatCurrency(project.totalProjectIncome || 0)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500">Layihə Xalis Mənfəəti</p>
                    <p className="text-sm font-bold text-blue-600">
                      {formatCurrency((project.totalProjectIncome || 0) - (project.totalProjectExpenses || 0))}
                    </p>
                  </div>
                </div>

                {/* Partner Share Information */}
                <div className="bg-blue-50 rounded-lg p-3">
                  <h5 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                    <Percent className="w-3 h-3 mr-1" />
                    Sizin Hissəniz ({project.sharePercentage}%)
                  </h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-blue-600">Sizin Xərc Hissəniz</p>
                      <p className="text-sm font-semibold text-red-600">
                        {formatCurrency(project.partnerExpenseShare || 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-600">Sizin Gəlir Hissəniz</p>
                      <p className="text-sm font-semibold text-green-600">
                        {formatCurrency(project.partnerIncomeShare || 0)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-blue-200">
                    <p className="text-xs text-blue-600">Sizin Xalis Mənfəətiniz</p>
                    <p className="text-sm font-bold text-blue-800">
                      {formatCurrency((project.partnerIncomeShare || 0) - (project.partnerExpenseShare || 0))}
                    </p>
                  </div>
                </div>

                {/* Investment vs Earnings Summary */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-xs text-gray-500">Sizin İnvestisiyanız</p>
                      <p className="text-sm font-semibold text-red-600">
                        {formatCurrency(project.investedAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Sizin Qazancınız</p>
                      <p className="text-sm font-semibold text-green-600">
                        {formatCurrency(project.earnedAmount)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Əməliyyatlar</h3>
          <div className="space-y-2">
            {partnerTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-xs text-gray-500">{transaction.projectName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.shareAmount)}
                  </p>
                  <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Bağla
          </Button>
          {onEdit && (
            <Button
              variant="outline"
              onClick={() => onEdit(partner)}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              Redaktə Et
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              onClick={() => onDelete(partner.id)}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Sil
            </Button>
          )}
        </div>
      </div>
    </DialogComponent>
  );
}
