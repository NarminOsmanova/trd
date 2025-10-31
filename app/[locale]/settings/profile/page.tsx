import DashboardLayout from '@/components/layout/DashboardLayout';
import SettingsPage from '@/containers/settings/SettingsPage';

export default function ProfilePage() {
  return (
    <DashboardLayout 
      title="Tənzimləmələr" 
      subtitle="Profil tənzimləmələri"
    >
      <SettingsPage activeTab="profile" />
    </DashboardLayout>
  );
}

