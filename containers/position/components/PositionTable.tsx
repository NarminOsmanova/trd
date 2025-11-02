'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  Edit, 
  Trash2, 
  Search,
  Plus
} from 'lucide-react';
import { Position } from '../types/position-type';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AlertDialogComponent from '@/components/AlertDiolog/AlertDiolog';

interface PositionTableProps {
  positions: Position[];
  pagination: {
    pageNumber: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  } | null;
  filters: {
    search?: string;
    pageNumber?: number;
    pageSize?: number;
  };
  onFiltersChange: (filters: Partial<{ search?: string; pageNumber?: number; pageSize?: number }>) => void;
  onEdit: (position: Position) => void;
  onDelete: (id: number) => void;
  onCreate: () => void;
  isLoading?: boolean;
}

export default function PositionTable({
  positions,
  pagination,
  filters,
  onFiltersChange,
  onEdit,
  onDelete,
  onCreate,
  isLoading
}: PositionTableProps) {
  const t = useTranslations('position');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  
  const getPositionName = (position: Position, language: string = 'az') => {
    const positionSet = position.positionSets?.find(ps => ps.language === language);
    return positionSet?.name || position.positionSets?.[0]?.name || '—';
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

  if (positions.length === 0 && !isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('noPositionsFound')}
          </h3>
          <p className="text-gray-600 mb-4">
            {filters.search ? t('noPositionsMessage') : t('noPositionsYet')}
          </p>
          <Button onClick={onCreate}>
            <Plus className="w-5 h-5 mr-2" />
            {t('newPosition')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={filters.search || ''}
              onChange={(e) => onFiltersChange({ search: e.target.value, pageNumber: 1 })}
              className="pl-10"
            />
          </div>
          <Button onClick={onCreate} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-5 h-5 mr-2" />
            {t('newPosition')}
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('name')}</TableHead>
              <TableHead className="text-right">{t('operations')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">{t('loading')}</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              positions.map((position) => (
                <TableRow key={position?.id} className="hover:bg-gray-50">
                  <TableCell>
                    <span className="text-sm font-medium text-gray-900">{position.name}</span>
                  </TableCell>
              
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(position)}
                        className="text-green-600 border-green-200 hover:bg-green-50"
                        title={t('edit')}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(position.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        title={t('delete')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                {pagination.totalCount > 0 && (
                  <span>
                    {((pagination.pageNumber - 1) * pagination.pageSize) + 1}-{Math.min(pagination.pageNumber * pagination.pageSize, pagination.totalCount)} / {pagination.totalCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onFiltersChange({ pageNumber: pagination.pageNumber - 1 })}
                  disabled={!pagination.hasPreviousPage}
                >
                  {t('previousPage')}
                </Button>
                <span className="text-sm text-gray-600">
                  {t('page')} {pagination.pageNumber} / {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onFiltersChange({ pageNumber: pagination.pageNumber + 1 })}
                  disabled={!pagination.hasNextPage}
                >
                  {t('nextPage')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

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

