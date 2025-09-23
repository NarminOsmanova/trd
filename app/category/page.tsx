import DashboardLayout from '@/components/layout/DashboardLayout';
import CategoryPage from '@/containers/category/CategoryPage';

export default function Page() {
  return (
    <DashboardLayout 
      title="Kateqoriyalar" 
      subtitle="Kateqoriyaların idarəetməsi"
    >
      <CategoryPage />
    </DashboardLayout>
  );
}
