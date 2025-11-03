'use client';

import React, { useState } from 'react';
import { Plus, Search, Filter, } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DialogComponent from '@/components/modals/DialogComponent';
import CategoryForm from '@/containers/category/components/FormComponent';
import CategoriesTable from '@/containers/category/components/CategoriesTable';
import { useProjectCategories, useDeleteProjectCategory } from '@/lib/hooks/useProjectCategory';
import { useAllProjects } from '@/lib/hooks/useProject';
import { CategoryScope } from './types/category-type';
import { toast } from 'sonner';

const CategoryPage = () => {
  const t = useTranslations('category');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [scopeFilter, setScopeFilter] = useState<number | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProjectId, setSelectedProjectId] = useState<number | undefined>(undefined);
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | undefined>(undefined);

  // API: Get all projects for filter
  const { data: projectsData, isLoading: isLoadingProjects } = useAllProjects();
  const projects = (projectsData as any)?.responseValue || [];

  // API: Get categories with pagination
  const { categories, pagination, isLoading, refetchCategories } = useProjectCategories({
    pageNumber: currentPage,
    pageSize: 10,
    search: searchTerm,
    projectId: selectedProjectId,
    scope: scopeFilter,
    isActive: isActiveFilter
  });

  // API: Delete category
  const deleteMutation = useDeleteProjectCategory();

  const openCreate = () => { 
    setEditingCategoryId(null); 
    setIsFormOpen(true); 
  };
  
  const openEdit = (categoryId: number) => { 
    setEditingCategoryId(categoryId); 
    setIsFormOpen(true); 
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success(t('deleteSuccess'));
        refetchCategories();
      },
      onError: (error: any) => {
        console.error('Error deleting category:', error);
        toast.error(t('deleteError'));
      }
    });
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingCategoryId(null);
    refetchCategories();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setScopeFilter(undefined);
    setSelectedProjectId(undefined);
    setIsActiveFilter(undefined);
  };

  return (
    <div className="space-y-6">

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col gap-4">
          {/* Top Row: Search and New Category Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder={t('searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button onClick={openCreate} className="inline-flex items-center whitespace-nowrap">
              <Plus className="w-4 h-4 mr-2" />{t('newCategory')}
            </Button>
          </div>
          
          {/* Bottom Row: Filters */}
          <div className="flex gap-2 items-center">
            {/* Project Filter */}
            <Select 
              value={selectedProjectId !== undefined ? String(selectedProjectId) : 'all'} 
              onValueChange={(value) => setSelectedProjectId(value === 'all' ? undefined : Number(value))}
              disabled={isLoadingProjects}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={isLoadingProjects ? t('loading') : t('allProjects')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allProjects')}</SelectItem>
                {projects.map((project: any) => (
                  <SelectItem key={project.id} value={String(project.id)}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Scope Filter */}
            <Select 
              value={scopeFilter !== undefined ? String(scopeFilter) : 'all'} 
              onValueChange={(value) => setScopeFilter(value === 'all' ? undefined : Number(value))}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder={t('allScopes')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allScopes')}</SelectItem>
                <SelectItem value={String(CategoryScope.Income)}>{t('income')}</SelectItem>
                <SelectItem value={String(CategoryScope.Expense)}>{t('expense')}</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select 
              value={isActiveFilter !== undefined ? String(isActiveFilter) : 'all'} 
              onValueChange={(value) => setIsActiveFilter(value === 'all' ? undefined : value === 'true')}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder={t('allStatuses')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allStatuses')}</SelectItem>
                <SelectItem value="true">{t('active')}</SelectItem>
                <SelectItem value="false">{t('inactive')}</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="flex items-center"
            >
              <Filter className="w-4 h-4 mr-2" />
              {t('cancel')}
            </Button>
          </div>
        </div>
      </div>

      {/* Categories Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <CategoriesTable 
          categories={categories}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Form Modal */}
      <DialogComponent
        open={isFormOpen}
        setOpen={setIsFormOpen}
        title={editingCategoryId ? t('editCategory') : t('newCategory')}
        size="md"
      >
        <CategoryForm
          categoryId={editingCategoryId}
          onSuccess={handleFormSuccess}
          onCancel={() => setIsFormOpen(false)}
        />
      </DialogComponent>
    </div>
  );
}

export default CategoryPage;