import DashboardLayout from '@/components/layout/DashboardLayout';
import ProjectsPage from '@/containers/projects/ProjectsPage';
import {getTranslations} from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations();
  return (
    <DashboardLayout 
      title={t('header.projects')} 
      subtitle={t('header.projectsSubtitle')}
    >
      <ProjectsPage />
    </DashboardLayout>
  );
}