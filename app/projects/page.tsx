import DashboardLayout from '@/components/layout/DashboardLayout';
import ProjectsPage from '@/containers/projects/ProjectsPage';

export default function Page() {
  return (
    <DashboardLayout 
      title="Layihələr" 
      subtitle="Layihələrin idarəetməsi və monitorinqi"
    >
      <ProjectsPage />
    </DashboardLayout>
  );
}