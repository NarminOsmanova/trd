'use client';

import React from 'react';
import { 
  Edit, 
  Trash2, 
  MoreVertical, 
  Eye,
  Calendar,
  Users,
  DollarSign,
  FolderOpen
} from 'lucide-react';
import { Project } from '../types/projects-type';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel, getInitials } from '@/lib/utils';
import { mockData } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { usePagination } from '@/hooks/usePagination';
import PaginationWrapper from '@/components/ui/pagination-wrapper';

interface ProjectsTableProps {
  projects: Project[];
  selectedProjects: string[];
  onSelectProject: (id: string) => void;
  onSelectAll: () => void;
  onViewProject: (id: string) => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
}

export default function ProjectsTable({
  projects,
  selectedProjects,
  onSelectProject,
  onSelectAll,
  onViewProject,
  onEditProject,
  onDeleteProject
}: ProjectsTableProps) {
  
  // Add pagination
  const pagination = usePagination({ 
    data: projects, 
    itemsPerPage: 9 // 3x3 grid layout üçün
  });

  const getProjectUsers = (project: Project) => {
    return project.assignedUsers
      .map(userId => mockData.users.find(u => u.id === userId))
      .filter(user => user !== undefined);
  };

  if (projects.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Layihə tapılmadı
          </h3>
          <p className="text-gray-600">
            Axtarış meyarlarına uyğun layihə yoxdur
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {pagination.paginatedData.map((project) => {
        const assignedUsers = getProjectUsers(project);
        const progressPercentage = Math.round((project.totalExpenses / project.budget) * 100);
        
        return (
          <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            {/* Project Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3 flex-1">
                <Checkbox
                  checked={selectedProjects.includes(project.id)}
                  onCheckedChange={() => onSelectProject(project.id)}
                  aria-label={`Select project ${project.name}`}
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {project.description || 'Təsvir yoxdur'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <Badge variant={project.status === 'active' ? 'success' : project.status === 'completed' ? 'default' : 'warning'}>
                  {getStatusLabel(project.status)}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  title="Daha çox"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Project Stats */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Ümumi Büdcə:</span>
                <span className="font-medium text-gray-900">{formatCurrency(project.budget)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Xərclər:</span>
                <span className="font-medium text-red-600">{formatCurrency(project.totalExpenses)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Qalıq:</span>
                <span className="font-medium text-green-600">{formatCurrency(project.remainingBudget)}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>İstifadə edilib</span>
                <span>{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`bg-blue-600 h-2 rounded-full transition-all duration-300 ${
                    progressPercentage >= 90 ? 'w-full' :
                    progressPercentage >= 75 ? 'w-4/5' :
                    progressPercentage >= 50 ? 'w-3/5' :
                    progressPercentage >= 25 ? 'w-2/5' :
                    progressPercentage >= 10 ? 'w-1/5' :
                    'w-0'
                  }`}
                ></div>
              </div>
            </div>

            {/* Project Dates */}
            <div className="flex items-center text-xs text-gray-500 mb-4">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{formatDate(project.startDate)}</span>
              {project.endDate && (
                <>
                  <span className="mx-1">-</span>
                  <span>{formatDate(project.endDate)}</span>
                </>
              )}
            </div>

            {/* Assigned Users */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Users className="w-4 h-4 text-gray-400 mr-2" />
                <div className="flex -space-x-2">
                  {assignedUsers.slice(0, 3).map((user, index) => (
                    <div
                      key={user.id}
                      className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center border-2 border-white"
                      title={user.name}
                    >
                      <span className="text-xs font-medium text-gray-600">
                        {getInitials(user.name)}
                      </span>
                    </div>
                  ))}
                  {assignedUsers.length > 3 && (
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center border-2 border-white">
                      <span className="text-xs font-medium text-gray-600">
                        +{assignedUsers.length - 3}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <span className="text-xs text-gray-500">
                {assignedUsers.length} işçi
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewProject(project.id)}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Baxış
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditProject(project)}
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Redaktə
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteProject(project.id)}
                className="text-red-400 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        );
      })}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <PaginationWrapper pagination={pagination} />
          </div>
        </div>
      )}
    </div>
  );
}
