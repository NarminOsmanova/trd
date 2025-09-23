export const dynamic = 'force-dynamic';
export const revalidate = 0;

import DashboardLayout from '@/components/layout/DashboardLayout';
import UsersPage from '@/containers/users/UsersPage';

export default function Page() {
  return (
    <DashboardLayout 
      title="İstifadəçilər" 
      subtitle="İstifadəçi hesablarının idarəetməsi"
    >
      <UsersPage />
    </DashboardLayout>
  );
}
