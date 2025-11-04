'use client';

import React, { useMemo } from 'react';
import { 
  Mail,
  Phone,
  Shield,
  ShieldCheck,
  UserCheck,
  UserX,
  DollarSign,
  TrendingUp,
  Calendar,
  Clock,
  FileText,
  ArrowUpRight,
  ArrowDownLeft,
  Building2,
  Activity,
  Briefcase,
  Ban
} from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { useUser } from '@/lib/hooks/useUsers';
import { formatDate, getInitials } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import DialogComponent from '@/components/modals/DialogComponent';
import { ProjectStatus } from '@/containers/projects/types/projects-type';
import { UserStatus, UserType } from '@/containers/users/types/users-type';

interface UserViewModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserViewModal({
  userId,
  isOpen,
  onClose
}: UserViewModalProps) {
  const t = useTranslations('users');
  const locale = useLocale();
  const { data, isLoading } = useUser(userId, isOpen);
  
  const user = data?.responseValue;

  // Get user name based on current locale
  const userName = useMemo(() => {
    if (!user?.sets || user.sets.length === 0) return 'N/A';
    
    const localizedSet = user.sets.find(set => set.language === locale);
    if (localizedSet) {
      return `${localizedSet.firstName} ${localizedSet.lastName}`;
    }
    
    const firstSet = user.sets[0];
    return `${firstSet.firstName} ${firstSet.lastName}`;
  }, [user, locale]);

  // Get initials for avatar
  const initials = useMemo(() => {
    if (!user?.sets || user.sets.length === 0) return 'NA';
    
    const localizedSet = user.sets.find(set => set.language === locale) || user.sets[0];
    return `${localizedSet.firstName?.[0] || ''}${localizedSet.lastName?.[0] || ''}`.toUpperCase();
  }, [user, locale]);

  const getOperationTypeLabel = (type: number) => {
    const types: { [key: number]: string } = {
      0: t('income'),
      1: t('expense'),
      2: t('transfer'),
      3: t('accountIncrease')
    };
    return types[type] || t('unknown');
  };

  const getOperationTypeColor = (type: number) => {
    if (type === 0) return 'text-green-600';
    if (type === 1) return 'text-red-600';
    if (type === 2) return 'text-blue-600';
    return 'text-gray-600';
  };

  const getProjectStatusLabel = (status: number) => {
    const statuses: { [key: number]: string } = {
      [ProjectStatus.Draft]: t('planning'),
      [ProjectStatus.Active]: t('active'),
      [ProjectStatus.Completed]: t('completed'),
      [ProjectStatus.Paused]: t('paused')
    };
    return statuses[status] || t('unknown');
  };

  const getProjectStatusVariant = (status: number): "success" | "default" | "secondary" | "destructive" => {
    if (status === ProjectStatus.Active) return 'success';
    if (status === ProjectStatus.Completed) return 'default';
    if (status === ProjectStatus.Paused) return 'destructive';
    if (status === ProjectStatus.Draft) return 'secondary';
    return 'secondary';
  };

  const formatCurrency = (amount: number, currency?: string) => {
    return `${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency || 'AZN'}`;
  };

  if (isLoading || !user) {
    return (
      <DialogComponent
        open={isOpen}
        setOpen={(open) => !open && onClose()}
        title={t('userDetails')}
        size="xl"
        maxHeight="max-h-[95vh]"
      >
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">{t('loading')}</span>
        </div>
      </DialogComponent>
    );
  }

  return (
    <DialogComponent
      open={isOpen}
      setOpen={(open) => !open && onClose()}
      title={t('userDetails')}
      size="xl"
      maxHeight="max-h-[95vh]"
      className=""
      contentClassName="p-0"
    >
      <div className="space-y-6 p-6">
          {/* User Header */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
            <div className="flex items-start space-x-6">
              <div className="relative">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={userName}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <span className="text-white font-bold text-xl">
                      {initials}
                    </span>
                  </div>
                )}
                <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-white ${
                  user.status === UserStatus.Active ? 'bg-green-500' : 
                  user.status === UserStatus.Pending ? 'bg-gray-400' :
                  user.status === UserStatus.Blocked ? 'bg-red-600' :
                  'bg-red-500'
                }`} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{userName}</h2>
                  <div className="flex items-center space-x-2">
                    {user.type === UserType.Partner ? (
                      <ShieldCheck className="w-5 h-5 text-indigo-600" />
                    ) : (
                      <Shield className="w-5 h-5 text-blue-600" />
                    )}
                    <Badge variant={user.type === UserType.Partner ? 'default' : 'secondary'} className="text-sm">
                      {user.type === UserType.Partner ? t('partner') : t('manager')}
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    {user.status === UserStatus.Active ? (
                      <UserCheck className="w-5 h-5 text-green-600 mr-1" />
                    ) : user.status === UserStatus.Pending ? (
                      <Clock className="w-5 h-5 text-gray-600 mr-1" />
                    ) : user.status === UserStatus.Blocked ? (
                      <Ban className="w-5 h-5 text-red-600 mr-1" />
                    ) : (
                      <UserX className="w-5 h-5 text-red-500 mr-1" />
                    )}
                    <Badge 
                      variant={
                        user.status === UserStatus.Active ? 'success' : 
                        user.status === UserStatus.Pending ? 'secondary' :
                        user.status === UserStatus.Blocked ? 'destructive' : 
                        'destructive'
                      } 
                      className="text-sm"
                    >
                      {user.status === UserStatus.Active ? t('active') : 
                       user.status === UserStatus.Inactive ? t('inactive') :
                       user.status === UserStatus.Pending ? t('pending') :
                       user.status === UserStatus.Blocked ? t('blocked') :
                       t('unknown')}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{user.email}</span>
                  </div>
                  {user.position && (
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-700 mr-2">{user.position.name}</span>
                    </div>
                  )}
                  {user.phone && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      <span>+{user.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{t('joinDate')}: {formatDate(user.createdDate || new Date().toISOString())}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{t('id')}: {user.id}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Overview */}
          {user.statistics && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs text-green-700 font-medium">{t('totalBudget')}</span>
                </div>
                <div className="text-xl font-bold text-green-900">
                  {formatCurrency(user.statistics.totalBudget, user.statistics.currency)}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs text-blue-700 font-medium">{t('operations')}</span>
                </div>
                <div className="text-xl font-bold text-blue-900">
                  {user.statistics.totalOperations}
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200 p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs text-purple-700 font-medium">{t('averageAmount')}</span>
                </div>
                <div className="text-xl font-bold text-purple-900">
                  {formatCurrency(user.statistics.averageAmountPerOperation, user.statistics.currency)}
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-sm border border-orange-200 p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs text-orange-700 font-medium">{t('activeProjects')}</span>
                </div>
                <div className="text-xl font-bold text-orange-900">
                  {user.statistics.activeProjectsCount}
                </div>
              </div>
            </div>
          )}

          {/* Projects Section */}
          {user.projects && user.projects.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
                        <span className="text-gray-500">{t('plan')}:</span>
                        <div className="font-medium text-blue-600">{project.plannedCapital.toLocaleString()} AZN</div>
                      </div>
                      <div>
                        <span className="text-gray-500">{t('spent')}:</span>
                        <div className="font-medium text-red-600">{project.totalExpenses.toLocaleString()} AZN</div>
                      </div>
                      <div>
                        <span className="text-gray-500">{t('remaining')}:</span>
                        <div className="font-medium text-green-600">{project.remainingBudget.toLocaleString()} AZN</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Operations Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[300px]">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              {t('recentOperations')} {user.recentOperations && `(${user.recentOperations.length})`}
            </h3>
            
            {user.recentOperations && user.recentOperations.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {/* Header Row */}
                <div className="grid grid-cols-5 items-center text-xs text-gray-500 px-1 pb-2 border-b border-gray-200">
                  <div>{t('date')}</div>
                  <div>{t('operationType')}</div>
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
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">{t('noOperations')}</p>
              </div>
            )}
          </div>
        </div>
    </DialogComponent>
  );
}
