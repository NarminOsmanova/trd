import DashboardLayout from '@/components/layout/DashboardLayout';
import PartnerPage from '@/containers/partner/PartnerPage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Partner() {
  return (
    <DashboardLayout
      title="Partnyorlar"
      subtitle="Partnyorların idarəetməsi və monitorinqi"
    >
      <PartnerPage />
    </DashboardLayout>
  );
}