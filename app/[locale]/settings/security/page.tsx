import DashboardLayout from '@/components/layout/DashboardLayout';
import SettingsPage from '@/containers/settings/SettingsPage';

export default function SecurityPage() {
  return (
    <DashboardLayout 
      title="Tənzimləmələr" 
      subtitle="Təhlükəsizlik tənzimləmələri"
    >
      <SettingsPage activeTab="security" />
    </DashboardLayout>
  );
}

