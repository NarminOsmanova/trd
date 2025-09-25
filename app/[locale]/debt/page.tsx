import DashboardLayout from '@/components/layout/DashboardLayout';
import DebtPage from '@/containers/debt/DebtPage';

export default function Page() {
  return (
    <DashboardLayout 
      title="Borclar" 
      subtitle="Borcların idarəetməsi və monitorinqi"
    >
      <DebtPage />
    </DashboardLayout>
  );
}