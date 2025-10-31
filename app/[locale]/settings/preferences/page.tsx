import DashboardLayout from '@/components/layout/DashboardLayout';
import SettingsPage from '@/containers/settings/SettingsPage';

export default function PreferencesPage() {
  return (
    <DashboardLayout 
      title="Tənzimləmələr" 
      subtitle="Tənzimləmələr"
    >
      <SettingsPage activeTab="preferences" />
    </DashboardLayout>
  );
}

