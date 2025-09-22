'use client';

import React, { useState } from 'react';
import { 
  FolderOpen, 
  Plus,
  Search,
  Calendar,
  Users,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { mockData } from '@/lib/mock-data';
import { Project, ProjectFormData } from './types/projects-type';
import ProjectsTable from './components/ProjectsTable';
import FormComponent from './components/FormComponent';
import ProjectViewModal from './components/ProjectViewModal';

export default function ProjectsPage() {
  const [projects] = useState<Project[]>(mockData.projects);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [viewProject, setViewProject] = useState<Project | null>(null);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleSelectProject = (projectId: string) => {
    setSelectedProjects(prev => 
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProjects.length === filteredProjects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(filteredProjects.map(p => p.id));
    }
  };

  const handleViewProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId) || null;
    setViewProject(project);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleDeleteProject = (projectId: string) => {
    console.log('Delete project:', projectId);
  };

  const handleCreateProject = () => {
    setEditingProject(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: ProjectFormData) => {
    try {
      if (editingProject) {
        // Update existing project
        console.log('Update project:', editingProject.id, data);
      } else {
        // Create new project
        console.log('Create project:', data);
      }
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsFormOpen(false);
      setEditingProject(null);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProject(null);
  };

  const handleBulkDelete = () => {
    selectedProjects.forEach(handleDeleteProject);
    setSelectedProjects([]);
  };

  // Calculate stats
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const pausedProjects = projects.filter(p => p.status === 'paused').length;
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalExpenses = projects.reduce((sum, p) => sum + p.totalExpenses, 0);
  const remainingBudget = totalBudget - totalExpenses;

  return (
    <>
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Layihə axtar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Bütün statuslar</SelectItem>
                <SelectItem value="active">Aktiv</SelectItem>
                <SelectItem value="completed">Tamamlandı</SelectItem>
                <SelectItem value="paused">Dayandırılıb</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Add Project Button */}
          <Button onClick={handleCreateProject}>
            <Plus className="w-5 h-5 mr-2" />
            Yeni Layihə
          </Button>
        </div>

        {/* Bulk Actions */}
        {selectedProjects.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">
                {selectedProjects.length} layihə seçilib
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Sil
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedProjects([])}
                >
                  Ləğv Et
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Projects Table */}
        <ProjectsTable
          projects={filteredProjects}
          selectedProjects={selectedProjects}
          onSelectProject={handleSelectProject}
          onSelectAll={handleSelectAll}
          onViewProject={handleViewProject}
          onEditProject={handleEditProject}
          onDeleteProject={handleDeleteProject}
        />

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <FolderOpen className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ümumi Layihələr</p>
                <p className="text-lg font-semibold text-gray-900">{totalProjects}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <Users className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Aktiv Layihələr</p>
                <p className="text-lg font-semibold text-green-600">{activeProjects}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <DollarSign className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ümumi Büdcə</p>
                <p className="text-lg font-semibold text-gray-900">
                  {totalBudget.toLocaleString()} AZN
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <Calendar className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tamamlandı</p>
                <p className="text-lg font-semibold text-orange-600">{completedProjects}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      <FormComponent
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        title={editingProject ? 'Layihəni Redaktə Et' : 'Yeni Layihə Yarat'}
        initialData={editingProject ? {
          name: editingProject.name,
          description: editingProject.description,
          status: editingProject.status,
          startDate: editingProject.startDate,
          endDate: editingProject.endDate,
          assignedUsers: editingProject.assignedUsers,
          targetBudget: undefined
        } : undefined}
      />

      {/* View Modal */}
      <ProjectViewModal
        isOpen={!!viewProject}
        onClose={() => setViewProject(null)}
        project={viewProject}
      />
    </>
  );
}
