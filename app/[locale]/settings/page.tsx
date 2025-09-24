import DashboardLayout from '@/components/layout/DashboardLayout';
import SettingsPage from '@/containers/settings/SettingsPage';

export default function Page() {
  return (
    <DashboardLayout 
      title="Tənzimləmələr" 
      subtitle="Hesab və sistem tənzimləmələri"
    >
      <SettingsPage />
    </DashboardLayout>
  );
}
