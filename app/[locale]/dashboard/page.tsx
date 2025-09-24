import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardPage from '@/containers/dashboard/DashboardPage';

export default function Page() {
  return (
    <DashboardLayout 
      title="Dashboard" 
      subtitle="Layihə idarəetməsi və xərclərin ümumi baxışı"
    >
      <DashboardPage />
    </DashboardLayout>
  );
}
