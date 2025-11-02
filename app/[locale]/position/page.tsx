'use client';

import { useTranslations } from 'next-intl';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PositionPage from '@/containers/position/PositionPage';

export default function Partner() {
  const t = useTranslations('position');
  
  return (
    <DashboardLayout
      title={t('title')}
      subtitle={t('subtitle')}
    >
      <PositionPage />
    </DashboardLayout>
  );
}