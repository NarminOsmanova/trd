'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import PositionTable from './components/PositionTable';
import FormComponent from './components/FormComponent';
import { usePositions, useCreatePosition, useUpdatePosition, useDeletePosition, usePosition } from '@/lib/hooks/usePosition';
import type { Position, CreatePositionRequest, UpdatePositionRequest } from './types/position-type';
import { toast, Toaster } from "sonner";


export default function PositionPage() {
  const t = useTranslations('position');
  const [filters, setFilters] = useState({
    search: '',
    pageNumber: 1,
    pageSize: 10,
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPositionId, setEditingPositionId] = useState<number | null>(null);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);

  // Hooks
  const { 
    positions, 
    pagination, 
    isLoading, 
    refetchPositions 
  } = usePositions(filters);

  // Fetch single position for editing
  const { data: positionData, isLoading: isLoadingPosition } = usePosition(
    editingPositionId, 
    !!editingPositionId
  );

  const createMutation = useCreatePosition();
  const updateMutation = useUpdatePosition();
  const deleteMutation = useDeletePosition();

  // Update editingPosition when API data is loaded
  useEffect(() => {
    if (positionData?.responseValue) {
      setEditingPosition(positionData.responseValue);
    }
  }, [positionData]);

  const handleFiltersChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleCreate = () => {
    setEditingPositionId(null);
    setEditingPosition(null);
    setIsFormOpen(true);
  };

  const handleEdit = (position: Position) => {
    setEditingPositionId(position.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteMutation.mutateAsync(id);
      toast.success(response.message || 'Position uğurla silindi');
      refetchPositions();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || t('deleteError') as string);
    }
  };

  const handleFormSubmit = async (data: { positionSets: Array<{ name: string; language: string }> }) => {
    try {
      if (editingPosition) {
        // Update
        const updateData: UpdatePositionRequest = {
          id: editingPosition.id,
          positionSets: data.positionSets,
        };
        const response = await updateMutation.mutateAsync(updateData);
        toast.success(response.message || 'Position uğurla yeniləndi');
      } else {
        // Create
        const createData: CreatePositionRequest = {
          positionSets: data.positionSets,
        };
        const response = await createMutation.mutateAsync(createData);
        toast.success(response.message || 'Position uğurla yaradıldı');
      }
      setIsFormOpen(false);
      setEditingPositionId(null);
      setEditingPosition(null);
      refetchPositions();
    } catch (error: any) {
      console.error('Form submission error:', error);
      toast.error(error?.response?.data?.message || 'Xəta baş verdi');
      throw error;
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingPositionId(null);
    setEditingPosition(null);
  };

  // Statistics
  return (
    <>
      <div className="space-y-6">
        {/* Position Table */}
        <PositionTable
          positions={positions}
          pagination={pagination}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreate={handleCreate}
          isLoading={isLoading}
        />
      </div>

      {/* Form Modal */}
      <FormComponent
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        title={editingPositionId ? t('editPosition') : t('createPosition')}
        initialData={editingPosition}
        isLoading={isLoadingPosition}
      />
    </>
  );
}

