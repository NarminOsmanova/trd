import DashboardLayout from '@/components/layout/DashboardLayout';
import SettingsPage from '@/containers/settings/SettingsPage';

export default function NotificationsPage() {
  return (
    <DashboardLayout 
      title="Tənzimləmələr" 
      subtitle="Bildiriş tənzimləmələri"
    >
      <SettingsPage activeTab="notifications" />
    </DashboardLayout>
  );
}

