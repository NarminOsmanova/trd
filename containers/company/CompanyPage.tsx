'use client';

import React, { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DialogComponent from '@/components/modals/DialogComponent';
import CompaniesTable from './components/CompaniesTable';
import CompanyForm from './components/FormComponent';
import { mockData } from '@/lib/mock-data';
import { CompanyItem } from './types/company-type';

const CompanyPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<CompanyItem | null>(null);
  const [companies, setCompanies] = useState<CompanyItem[]>(() => {
    // @ts-ignore
    return (mockData.companies as CompanyItem[] | undefined) || [];
  });

  const openCreate = () => { setEditing(null); setIsFormOpen(true); };
  const openEdit = (item: CompanyItem) => { setEditing(item); setIsFormOpen(true); };

  const handleSubmit = (data: { title: string; logoUrl?: string; isActive?: boolean }) => {
    if (editing) {
      setCompanies(prev => prev.map(c => c.id === editing.id ? {
        ...editing,
        title: data.title,
        logoUrl: data.logoUrl,
        isActive: data.isActive ?? editing.isActive,
        updatedAt: new Date().toISOString()
      } : c));
    } else {
      const newItem: CompanyItem = {
        id: Math.random().toString(36).slice(2),
        title: data.title,
        logoUrl: data.logoUrl,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setCompanies(prev => [newItem, ...prev]);
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    setCompanies(prev => prev.filter(c => c.id !== id));
  };

  const handleToggleActive = (id: string) => {
    setCompanies(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive, updatedAt: new Date().toISOString() } : c));
  };

  const sorted = useMemo(() => companies, [companies]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Şirkətlər</h2>
        <Button onClick={openCreate} className="inline-flex items-center">
          <Plus className="w-4 h-4 mr-2" />Yeni Şirkət
        </Button>
      </div>

      <CompaniesTable 
        data={sorted}
        onEdit={openEdit}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
      />

      <DialogComponent
        open={isFormOpen}
        setOpen={setIsFormOpen}
        title={editing ? 'Şirkəti Yenilə' : 'Yeni Şirkət'}
        size="md"
      >
        <CompanyForm
          initialData={editing ? { title: editing.title, logoUrl: editing.logoUrl, isActive: editing.isActive } : undefined}
          onSubmit={handleSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      </DialogComponent>
    </div>
  );
}

export default CompanyPage