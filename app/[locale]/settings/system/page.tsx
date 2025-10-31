import DashboardLayout from '@/components/layout/DashboardLayout';
import SettingsPage from '@/containers/settings/SettingsPage';

export default function SystemPage() {
  return (
    <DashboardLayout 
      title="Tənzimləmələr" 
      subtitle="Sistem məlumatları"
    >
      <SettingsPage activeTab="system" />
    </DashboardLayout>
  );
}

