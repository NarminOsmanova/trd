import DashboardLayout from '@/components/layout/DashboardLayout';
import ReportsPage from '@/containers/reports/ReportsPage';

export default function Page() {
  return (
    <DashboardLayout 
      title="Hesabatlar" 
      subtitle="Layihə və xərc analitikası"
    >
      <ReportsPage />
    </DashboardLayout>
  );
}
