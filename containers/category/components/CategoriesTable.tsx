'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProjectCategory, CategoryScope } from '@/containers/category/types/category-type';
import AlertDialogComponent from '@/components/AlertDiolog/AlertDiolog';
import { useChangeProjectCategoryStatus } from '@/lib/hooks/useProjectCategory';
import { toast } from 'sonner';

interface Props {
  categories: ProjectCategory[];
  onEdit: (categoryId: number) => void;
  onDelete: (id: number) => void;
}

export default function CategoriesTable({ categories, onEdit, onDelete }: Props) {
  const t = useTranslations('category');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  
  // Change status mutation
  const changeStatusMutation = useChangeProjectCategoryStatus();

  const getCategoryName = (category: ProjectCategory, language: string = 'az') => {
    const set = category.sets?.find(s => s.language === language);
    return set?.name || category.sets?.[0]?.name || '—';
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteId !== null) {
      onDelete(deleteId);
      setIsDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setDeleteId(null);
  };

  const handleStatusChange = async (id: number, currentStatus: boolean) => {
    try {
      await changeStatusMutation.mutateAsync({ 
        id, 
        isActive: !currentStatus 
      });
      toast.success(t('statusChangeSuccess'));
    } catch (error: any) {
      console.error('Error changing status:', error);
      toast.error(t('statusChangeError'));
    }
  };
  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('noCategoriesFound')}
          </h3>
          <p className="text-gray-600">
            {t('noCategoriesMessage')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('orderNo')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('name')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('scope')}
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('status')}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('operations')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                 <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">
                    {category.orderNo}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {getCategoryName(category)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge 
                    variant={category.scope === CategoryScope.Expense ? 'warning' : 'success'}
                    className="font-medium"
                  >
                    {category.scope === CategoryScope.Expense ? t('expense') : t('income')}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => handleStatusChange(category.id, category.isActive || false)}
                      disabled={changeStatusMutation.isPending}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                        category.isActive ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                      title={category.isActive ? t('active') : t('inactive')}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          category.isActive ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(category.id)}
                      className="text-green-600 border-green-200 hover:bg-green-50"
                      title={t('edit')}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(category.id)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      title={t('delete')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialogComponent
        open={isDeleteDialogOpen}
        setOpen={setIsDeleteDialogOpen}
        title={t('deleteConfirm')}
        description={t('deleteDescription')}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        variant="danger"
      />
    </div>
  );
}


