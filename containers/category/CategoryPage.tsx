'use client';

import React, { useMemo, useState } from 'react';
import { Plus, Search, Filter, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DialogComponent from '@/components/modals/DialogComponent';
import CategoryForm from '@/containers/category/components/FormComponent';
import CategoriesTable from '@/containers/category/components/CategoriesTable';
import { Category, CategoryFormData } from '@/types';
import { mockData } from '@/lib/mock-data';

const CategoryPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | '0' | '1'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  
  const [categories, setCategories] = useState<Category[]>(() => {
    // Seed from mockData if exists; fall back to some defaults
    // @ts-ignore
    return (mockData.categories as Category[] | undefined) || [];
  });

  const openCreate = () => { setEditing(null); setIsFormOpen(true); };
  const openEdit = (category: Category) => { setEditing(category); setIsFormOpen(true); };

  const handleSubmit = (data: CategoryFormData) => {
    if (editing) {
      setCategories(prev => prev.map(c => c.id === editing.id ? {
        ...editing,
        ...data,
        isActive: data.isActive ?? editing.isActive,
        updatedAt: new Date().toISOString()
      } : c));
    } else {
      const newItem: Category = {
        id: Math.random().toString(36).slice(2),
        name: data.name,
        order: data.order,
        type: data.type,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setCategories(prev => [newItem, ...prev]);
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const handleToggleActive = (id: string) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive, updatedAt: new Date().toISOString() } : c));
  };

  const filteredCategories = useMemo(() => {
    return categories.filter(category => {
      const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || String(category.type) === typeFilter;
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && category.isActive) ||
        (statusFilter === 'inactive' && !category.isActive);
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [categories, searchTerm, typeFilter, statusFilter]);

  const sortedCategories = useMemo(() => {
    return [...filteredCategories].sort((a, b) => a.order - b.order);
  }, [filteredCategories]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setStatusFilter('all');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Plus className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Kateqoriyalar</h2>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title="Yenilə"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Yenilə
          </button>
        </div>

        <Button onClick={openCreate} className="inline-flex items-center">
          <Plus className="w-4 h-4 mr-2" />Yeni Kateqoriya
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Kateqoriya axtar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Select value={typeFilter} onValueChange={(value: 'all' | '0' | '1') => setTypeFilter(value)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Tip" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Bütün tiplər</SelectItem>
                <SelectItem value="0">Xərc</SelectItem>
                <SelectItem value="1">Gəlir</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(value: 'all' | 'active' | 'inactive') => setStatusFilter(value)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Bütün statuslar</SelectItem>
                <SelectItem value="active">Aktiv</SelectItem>
                <SelectItem value="inactive">Passiv</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="flex items-center"
            >
              <Filter className="w-4 h-4 mr-2" />
              Təmizlə
            </Button>
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <CategoriesTable 
        categories={sortedCategories}
        onEdit={openEdit}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
      />

      {/* Form Modal */}
      <DialogComponent
        open={isFormOpen}
        setOpen={setIsFormOpen}
        title={editing ? 'Kateqoriya Yenilə' : 'Yeni Kateqoriya'}
        size="md"
      >
        <CategoryForm
          initialData={editing ? { name: editing.name, order: editing.order, type: editing.type, isActive: editing.isActive } : undefined}
          onSubmit={handleSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      </DialogComponent>
    </div>
  );
}

export default CategoryPage;