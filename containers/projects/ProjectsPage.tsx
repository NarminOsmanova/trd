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
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Project, ProjectFormData, ProjectStatus } from './types/projects-type';
import ProjectsTable from './components/ProjectsTable';
import FormComponent from './components/FormComponent';
import ProjectViewModal from './components/ProjectViewModal';
import { useProjects, useDeleteProject, useProject } from '@/lib/hooks/useProject';
import { toast } from 'sonner';

export default function ProjectsPage() {
  const t = useTranslations();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [viewProjectId, setViewProjectId] = useState<string | null>(null);

  // API: Get projects with pagination
  const statusValue = statusFilter === 'all' ? undefined : 
    statusFilter === 'active' ? ProjectStatus.Active :
    statusFilter === 'completed' ? ProjectStatus.Completed :
    statusFilter === 'paused' ? ProjectStatus.Paused :
    statusFilter === 'draft' ? ProjectStatus.Draft : undefined;

  const { projects: apiProjects, statistics, isLoading, refetchProjects } = useProjects({
    pageNumber: currentPage,
    pageSize: 100,
    search: searchTerm,
    status: statusValue
  });

  // API: Delete project
  const { mutate: deleteProject } = useDeleteProject();

  // API: Get project by ID for edit only
  const { data: projectDetailData, isLoading: isLoadingDetail } = useProject(
    selectedProjectId,
    !!selectedProjectId
  );

  // Update editingProject when detail data arrives
  React.useEffect(() => {
    if (projectDetailData?.responseValue && selectedProjectId) {
      const detail = projectDetailData.responseValue;
      setEditingProject({
        id: detail.id.toString(),
        name: detail.name,
        description: detail.description,
        status: detail.status === ProjectStatus.Active ? 'active' :
                detail.status === ProjectStatus.Completed ? 'completed' :
                detail.status === ProjectStatus.Paused ? 'paused' : 'draft',
        startDate: detail.startDate,
        endDate: detail.endDatePlanned,
        budget: detail.financialSummary.plannedCapital,
        totalExpenses: detail.financialSummary.totalExpenses,
        remainingBudget: detail.financialSummary.remainingBudget,
        assignedUsers: detail.teamMembers.map(m => m.id.toString()),
        createdAt: detail.createdAt,
        updatedAt: detail.updatedAt,
        createdBy: ''
      });
    }
  }, [projectDetailData, selectedProjectId]);

  // Transform API projects to UI format
  const projects: Project[] = apiProjects.map(p => ({
    id: p.id.toString(),
    name: p.name || '',
    description: p.description,
    status: p.status === ProjectStatus.Active ? 'active' :
            p.status === ProjectStatus.Completed ? 'completed' :
            p.status === ProjectStatus.Paused ? 'paused' : 'draft',
    startDate: p.startDate || '',
    endDate: p.endDatePlanned,
    budget: p.plannedCapital || 0,
    totalExpenses: p.totalExpenses || 0,
    remainingBudget: p.remainingBudget || 0,
    progressPercentage: p.progressPercentage,
    assignedUsers: p.members?.map(m => m.userId.toString()) || [],
    members: p.members,
    createdAt: p.createdAt || '',
    updatedAt: p.updatedAt || '',
    createdBy: ''
  }));

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
    setViewProjectId(projectId);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProjectId(parseInt(project.id));
    setIsFormOpen(true);
  };

  const handleDeleteProject = (projectId: string) => {
    deleteProject(parseInt(projectId), {
      onSuccess: () => {
        toast.success(t('projects.deleteSuccess'));
        refetchProjects();
        setSelectedProjects(prev => prev.filter(id => id !== projectId));
      },
      onError: (error) => {
        console.error('Error deleting project:', error);
        toast.error(t('projects.deleteFailed'));
      }
    });
  };

  const handleCreateProject = () => {
    setEditingProject(null);
    setSelectedProjectId(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: ProjectFormData) => {
    // This will be handled in FormComponent with API calls
    setIsFormOpen(false);
    setEditingProject(null);
    refetchProjects();
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProject(null);
    setSelectedProjectId(null);
  };

  const handleBulkDelete = () => {
    selectedProjects.forEach(projectId => {
      deleteProject(parseInt(projectId), {
        onSuccess: () => {
          refetchProjects();
        },
        onError: (error) => {
          console.error('Error deleting project:', error);
        }
      });
    });
    toast.success(t('projects.deleteSuccess'));
    setSelectedProjects([]);
  };

  // Use stats from API or calculate from filtered projects
  const totalProjects = statistics?.totalProjects || filteredProjects.length;
  const activeProjects = statistics?.activeProjects || filteredProjects.filter(p => p.status === 'active').length;
  const completedProjects = statistics?.completedProjects || filteredProjects.filter(p => p.status === 'completed').length;
  const pausedProjects = filteredProjects.filter(p => p.status === 'paused').length;
  const totalBudget = statistics?.totalBudget || filteredProjects.reduce((sum, p) => sum + p.budget, 0);
  const totalExpenses = statistics?.totalExpenses || filteredProjects.reduce((sum, p) => sum + p.totalExpenses, 0);
  const remainingBudget = statistics?.totalRemainingBudget ?? (totalBudget - totalExpenses);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
                placeholder={t('projects.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('projects.selectStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('projects.allStatuses')}</SelectItem>
                <SelectItem value="active">{t('common.active')}</SelectItem>
                <SelectItem value="completed">{t('common.completed')}</SelectItem>
                <SelectItem value="paused">{t('common.paused')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Add Project Button */}
          <Button onClick={handleCreateProject}>
            <Plus className="w-5 h-5 mr-2" />
            {t('projects.newProject')}
          </Button>
        </div>

        {/* Bulk Actions */}
        {selectedProjects.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">
                {selectedProjects.length} {t('projects.projectsSelected')}
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  {t('projects.delete')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedProjects([])}
                >
                  {t('projects.cancel')}
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
                <p className="text-sm text-gray-600">{t('projects.totalProjects')}</p>
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
                <p className="text-sm text-gray-600">{t('projects.activeProjects')}</p>
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
                <p className="text-sm text-gray-600">{t('projects.totalBudget')}</p>
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
                <p className="text-sm text-gray-600">{t('projects.completedProjects')}</p>
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
        title={editingProject ? t('projects.editProject') : t('projects.createProject')}
        isLoading={isLoadingDetail && !!selectedProjectId}
        initialData={editingProject ? {
          id: editingProject.id,
          name: editingProject.name,
          description: editingProject.description,
          status: editingProject.status,
          startDate: editingProject.startDate,
          endDate: editingProject.endDate,
          assignedUsers: editingProject.assignedUsers,
          targetBudget: editingProject.budget
        } as any : undefined}
      />

      {/* View Modal */}
      <ProjectViewModal
        isOpen={!!viewProjectId}
        onClose={() => {
          setViewProjectId(null);
        }}
        projectId={viewProjectId}
      />
    </>
  );
}
