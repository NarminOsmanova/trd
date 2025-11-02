'use client';

import { useTranslations } from 'next-intl';
import DashboardLayout from '@/components/layout/DashboardLayout';
import CompanyPage from '@/containers/company/CompanyPage';

export default function Page() {
  const t = useTranslations('company');
  
  return (
    <DashboardLayout 
      title={t('title')} 
      subtitle={t('subtitle')}
    >
      <CompanyPage />
    </DashboardLayout>
  );
}
