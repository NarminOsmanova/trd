import DashboardLayout from '@/components/layout/DashboardLayout';
import NotificationsPage from '@/containers/notifications/NotificationsPage';

export default function Page() {
  return (
    <DashboardLayout 
      title="Bildirişlər" 
      subtitle="Sistem bildirişləri və xəbərdarlıqlar"
    >
      <NotificationsPage />
    </DashboardLayout>
  );
}
