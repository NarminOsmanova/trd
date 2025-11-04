'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import DialogComponent from '@/components/modals/DialogComponent';
import CompaniesTable from './components/CompaniesTable';
import CompanyForm from './components/FormComponent';
import CompanyViewModal from './components/CompanyViewModal';
import { 
  useCompanies, 
  useCompany, 
  useCreateCompany, 
  useUpdateCompany, 
  useDeleteCompany 
} from '@/lib/hooks/useCompany';
import { Company, CompanyDetails } from './types/company-type';
import { CompanyFormData } from './constants/validations';

const CompanyPage = () => {
  const t = useTranslations('company');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCompanyId, setEditingCompanyId] = useState<number | null>(null);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [viewingCompanyId, setViewingCompanyId] = useState<number | null>(null);
  const [viewingCompany, setViewingCompany] = useState<CompanyDetails | null>(null);
  
  const [filters, setFilters] = useState({
    search: '',
    pageNumber: 1,
    pageSize: 10,
  });

  // API Hooks
  const { 
    companies, 
    pagination, 
    isLoading, 
    refetchCompanies 
  } = useCompanies(filters);

  // Hook for editing
  const { data: companyData, isLoading: isLoadingCompany } = useCompany(
    editingCompanyId, 
    !!editingCompanyId
  );

  // Hook for viewing
  const { data: viewCompanyData, isLoading: isLoadingViewCompany } = useCompany(
    viewingCompanyId, 
    !!viewingCompanyId
  );

  const createMutation = useCreateCompany();
  const updateMutation = useUpdateCompany();
  const deleteMutation = useDeleteCompany();

  // Update editing company when data is fetched
  useEffect(() => {
    if (companyData?.responseValue) {
      setEditingCompany(companyData.responseValue);
    }
  }, [companyData]);

  // Update viewing company when data is fetched
  useEffect(() => {
    if (viewCompanyData?.responseValue) {
      setViewingCompany(viewCompanyData.responseValue);
    }
  }, [viewCompanyData]);

  const handleFiltersChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const openCreate = () => {
    setEditingCompanyId(null);
    setEditingCompany(null);
    setIsFormOpen(true);
  };

  const openEdit = (company: Company) => {
    setEditingCompanyId(company.id);
    setEditingCompany(null);
    setIsFormOpen(true);
  };

  const openView = (company: Company) => {
    setViewingCompanyId(company.id);
    setViewingCompany(null); // Clear previous data first
  };

  const closeView = () => {
    setViewingCompanyId(null);
    setViewingCompany(null);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCompanyId(null);
    setEditingCompany(null);
  };

  const handleFormSubmit = async (data: CompanyFormData) => {
    try {
      if (editingCompany) {
        const updateData = {
          id: editingCompany.id,
          title: data.title,
          logo: data.logo,
          currentBalance: data.currentBalance,
          currency: parseInt(data.currency),
          budgetLimit: data.budgetLimit,
        };
        const response = await updateMutation.mutateAsync(updateData);
        toast.success(response.message || t('updateSuccess'));
      } else {
        const createData = {
          title: data.title,
          logo: data.logo,
          currentBalance: data.currentBalance,
          currency: parseInt(data.currency),
          budgetLimit: data.budgetLimit,
        };
        const response = await createMutation.mutateAsync(createData);
        toast.success(response.message || t('createSuccess'));
      }
      setIsFormOpen(false);
      setEditingCompanyId(null);
      setEditingCompany(null);
      refetchCompanies();
    } catch (error: unknown) {
      console.error('Form submission error:', error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || t('error'));
      throw error;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteMutation.mutateAsync(id);
      toast.success(response.message || t('deleteSuccess'));
      refetchCompanies();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || t('deleteError'));
    }
  };

  return (
    <div className="space-y-6">

      <CompaniesTable
        companies={companies}
        pagination={pagination}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onEdit={openEdit}
        onDelete={handleDelete}
        onView={openView}
        onCreate={openCreate}
        isLoading={isLoading}
      />

      <DialogComponent
        open={isFormOpen}
        setOpen={handleCloseForm}
        title={editingCompanyId ? t('editCompany') : t('newCompany')}
        size="lg"
      >
        <CompanyForm
          initialData={editingCompany}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseForm}
          isLoading={isLoadingCompany}
        />
      </DialogComponent>

      <CompanyViewModal
        isOpen={!!viewingCompanyId}
        onClose={closeView}
        company={viewingCompany}
        isLoading={isLoadingViewCompany}
      />
    </div>
  );
};

export default CompanyPage;