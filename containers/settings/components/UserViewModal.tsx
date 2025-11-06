'use client';

import React, { useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { 
  Mail, 
  Phone, 
  Briefcase, 
  Calendar, 
  Shield, 
  ShieldCheck,
  CheckCircle, 
  XCircle, 
  DollarSign,
  TrendingUp,
  Activity,
  Briefcase as BriefcaseIcon,
  User,
  UserCheck,
  UserX,
  Clock,
  Ban,
  Building2,
  FileText,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import { useUser } from '@/lib/hooks/useUsers';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import DialogComponent from '@/components/modals/DialogComponent';
import { UserStatus, UserType } from '@/containers/users/types/users-type';

interface UserViewModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserViewModal({ userId, isOpen, onClose }: UserViewModalProps) {
  const t = useTranslations('settings.userModal');
  const locale = useLocale();
  const { data, isLoading } = useUser(userId, isOpen);

  const user = data?.responseValue;

  // Get user name based on current locale
  const userName = useMemo(() => {
    if (!user?.sets || user.sets.length === 0) return 'N/A';
    
    // Try to find name for current locale
    const localizedSet = user.sets.find(set => set.language === locale);
    if (localizedSet) {
      return `${localizedSet.firstName} ${localizedSet.lastName}`;
    }
    
    // Fallback to first available name
    const firstSet = user.sets[0];
    return `${firstSet.firstName} ${firstSet.lastName}`;
  }, [user, locale]);

  // Get initials for avatar
  const initials = useMemo(() => {
    if (!user?.sets || user.sets.length === 0) return 'NA';
    
    const localizedSet = user.sets.find(set => set.language === locale) || user.sets[0];
    return `${localizedSet.firstName?.[0] || ''}${localizedSet.lastName?.[0] || ''}`.toUpperCase();
  }, [user, locale]);

  const formatCurrency = (amount: number, currency?: string) => {
    return `${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency || 'AZN'}`;
  };

  const getOperationTypeLabel = (type: number) => {
    const types: { [key: number]: string } = {
      0: t('income'),
      1: t('expense'),
      2: t('transfer'),
      3: t('accountIncrease')
    };
    return types[type] || 'Naməlum';
  };

  const getOperationTypeColor = (type: number) => {
    if (type === 0) return 'text-green-600';
    if (type === 1) return 'text-red-600';
    if (type === 2) return 'text-blue-600';
    return 'text-gray-600';
  };

  const getProjectStatusLabel = (status: number) => {
    const statuses: { [key: number]: string } = {
      0: t('projectPlanned'),
      1: t('projectActive'),
      2: t('projectCompleted'),
      3: t('projectPaused')
    };
    return statuses[status] || 'Naməlum';
  };

  const getProjectStatusVariant = (status: number): "success" | "default" | "secondary" | "destructive" => {
    if (status === 1) return 'success';
    if (status === 2) return 'default';
    return 'secondary';
  };

  return (
    <DialogComponent
      open={isOpen}
      setOpen={(open) => !open && onClose()}
      title={t('viewTitle')}
      size="xl"
      loading={isLoading}
      onClose={onClose}
    >
      {user ? (
        <div className="space-y-6">
          {/* User Profile Section */}
          <div className="flex items-center space-x-4 pb-6 border-b">
            {user.avatar ? (
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={user.avatar} 
                  alt={userName}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center border-2 border-blue-200">
                <span className="text-2xl font-bold text-white">
                  {initials}
                </span>
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900">
                {userName}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center">
                  {user.status === UserStatus.Active ? (
                    <UserCheck className="w-4 h-4 text-green-600 mr-1" />
                  ) : user.status === UserStatus.Pending ? (
                    <Clock className="w-4 h-4 text-gray-600 mr-1" />
                  ) : user.status === UserStatus.Blocked ? (
                    <Ban className="w-4 h-4 text-red-600 mr-1" />
                  ) : (
                    <UserX className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <Badge 
                    variant={
                      user.status === UserStatus.Active ? 'success' : 
                      user.status === UserStatus.Pending ? 'secondary' :
                      user.status === UserStatus.Blocked ? 'destructive' : 
                      'destructive'
                    }
                  >
                    {user.status === UserStatus.Active ? t('active') : 
                     user.status === UserStatus.Inactive ? t('inactive') :
                     user.status === UserStatus.Pending ? t('pending') :
                     user.status === UserStatus.Blocked ? t('blocked') :
                     t('unknown')}
                  </Badge>
                </div>
                <div className="flex items-center">
                  {user.type === UserType.Partner ? (
                    <ShieldCheck className="w-4 h-4 text-indigo-600 mr-1" />
                  ) : (
                    <Shield className="w-4 h-4 text-blue-600 mr-1" />
                  )}
                  <Badge variant={user.type === UserType.Partner ? 'default' : 'secondary'}>
                    {user.type === UserType.Partner ? t('partner') : t('user')}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          {user.statistics && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-xs text-green-700 font-medium">{t('totalBudget')}</p>
                </div>
                <p className="text-lg font-bold text-green-900">
                  {formatCurrency(user.statistics.totalBudget, user.statistics.currency)}
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-xs text-blue-700 font-medium">{t('operations')}</p>
                </div>
                <p className="text-lg font-bold text-blue-900">
                  {user.statistics.totalOperations}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-xs text-purple-700 font-medium">{t('avgAmount')}</p>
                </div>
                <p className="text-lg font-bold text-purple-900">
                  {formatCurrency(user.statistics.averageAmountPerOperation, user.statistics.currency)}
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    <BriefcaseIcon className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-xs text-orange-700 font-medium">{t('activeProjects')}</p>
                </div>
                <p className="text-lg font-bold text-orange-900">
                  {user.statistics.activeProjectsCount}
                </p>
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">{t('email')}</p>
                <p className="font-medium text-gray-900">{user.email || '-'}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Phone className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">{t('phone')}</p>
                <p className="font-medium text-gray-900">{user.phone ? `+${user.phone}` : '-'}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Briefcase className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">{t('position')}</p>
                <p className="font-medium text-gray-900">{user.position?.name || '-'}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              {user.type === UserType.Partner ? (
                <ShieldCheck className="w-5 h-5 text-indigo-600 mt-0.5" />
              ) : (
                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="text-sm text-gray-600">{t('type')}</p>
                <p className="font-medium text-gray-900">
                  {user.type === UserType.Partner ? t('partner') : t('user')}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">{t('createdDate')}</p>
                <p className="font-medium text-gray-900">{formatDate(user.createdDate || new Date().toISOString())}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              {user.status === UserStatus.Active ? (
                <UserCheck className="w-5 h-5 text-green-600 mt-0.5" />
              ) : user.status === UserStatus.Pending ? (
                <Clock className="w-5 h-5 text-gray-600 mt-0.5" />
              ) : user.status === UserStatus.Blocked ? (
                <Ban className="w-5 h-5 text-red-600 mt-0.5" />
              ) : (
                <UserX className="w-5 h-5 text-red-500 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="text-sm text-gray-600">{t('status')}</p>
                <p className="font-medium text-gray-900">
                  {user.status === UserStatus.Active ? t('active') : 
                   user.status === UserStatus.Inactive ? t('inactive') :
                   user.status === UserStatus.Pending ? t('pending') :
                   user.status === UserStatus.Blocked ? t('blocked') :
                   t('unknown')}
                </p>
              </div>
            </div>
          </div>

          {/* Projects Section */}
          {user.projects && user.projects.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-purple-600" />
                {t('projects')} ({user.projects.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.projects.map((project) => (
                  <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{project.name}</h4>
                      <Badge variant={getProjectStatusVariant(project.status)}>
                        {getProjectStatusLabel(project.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">Plan:</span>
                        <div className="font-medium text-blue-600">{project.plannedCapital.toLocaleString()} AZN</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Xərc:</span>
                        <div className="font-medium text-red-600">{project.totalExpenses.toLocaleString()} AZN</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Qalan:</span>
                        <div className="font-medium text-green-600">{project.remainingBudget.toLocaleString()} AZN</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Operations Section */}
          {user.recentOperations && user.recentOperations.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                {t('recentOperations')} ({user.recentOperations.length})
              </h3>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {/* Header Row */}
                <div className="grid grid-cols-5 items-center text-xs text-gray-500 px-1 pb-2 border-b border-gray-200">
                  <div>{t('date')}</div>
                  <div>{t('type')}</div>
                  <div>{t('project')}</div>
                  <div>{t('description')}</div>
                  <div className="text-right">{t('amount')}</div>
                </div>
                
                {/* Operations List */}
                {user.recentOperations.map((operation) => {
                  const isIncome = operation.type === 0;
                  const isExpense = operation.type === 1;
                  return (
                    <div key={operation.id} className="bg-white rounded-lg p-3 grid grid-cols-5 items-center gap-2 border border-gray-100 hover:shadow-sm transition-shadow">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{formatDate(operation.date)}</p>
                      </div>
                      <div>
                        <div className="flex items-center">
                          {isIncome ? (
                            <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
                          ) : isExpense ? (
                            <ArrowDownLeft className="w-4 h-4 text-red-600 mr-1" />
                          ) : (
                            <Activity className="w-4 h-4 text-blue-600 mr-1" />
                          )}
                          <Badge 
                            variant={isIncome ? 'success' : isExpense ? 'destructive' : 'default'} 
                            className="text-xs"
                          >
                            {getOperationTypeLabel(operation.type)}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{operation.projectName}</p>
                        {operation.categoryName && operation.categoryName !== '—' && (
                          <p className="text-xs text-gray-500">{operation.categoryName}</p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">{operation.description}</p>
                      </div>
                      <div className={`text-sm font-semibold text-right ${getOperationTypeColor(operation.type)}`}>
                        {isIncome ? '+' : isExpense ? '-' : ''}{operation.amount.toLocaleString()} AZN
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Language Versions */}
          {user.sets && user.sets.length > 1 && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <User className="w-4 h-4 mr-2" />
                {t('languageVersions')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {user.sets.map((set, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg border ${
                      set.language === locale 
                        ? 'bg-blue-50 border-blue-300' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant={set.language === locale ? 'default' : 'secondary'} className="text-xs">
                        {set.language.toUpperCase()}
                      </Badge>
                      {set.language === locale && (
                        <span className="text-xs text-blue-600 font-medium">{t('activeLabel')}</span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {set.firstName} {set.lastName}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">{t('userNotFound')}</p>
        </div>
      )}
    </DialogComponent>
  );
}