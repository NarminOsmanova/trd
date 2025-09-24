import DashboardLayout from '@/components/layout/DashboardLayout';
import CompanyPage from '@/containers/company/CompanyPage';

export default function Page() {
  return (
    <DashboardLayout 
      title="Şirkətlər" 
      subtitle="Şirkətlərin idarəetməsi"
    >
      <CompanyPage />
    </DashboardLayout>
  );
}
