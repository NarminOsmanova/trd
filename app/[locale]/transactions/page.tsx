import DashboardLayout from '@/components/layout/DashboardLayout';
import TransactionsPage from '@/containers/transactions/TransactionsPage';

export default function Page() {
  return (
    <DashboardLayout 
      title="Əməliyyatlar" 
      subtitle="Pul daxilolmaları və xərclərin idarəetməsi"
    >
      <TransactionsPage />
    </DashboardLayout>
  );
}
