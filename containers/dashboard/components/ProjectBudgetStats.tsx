'use client';

import React from 'react';
import { ProjectBudgetStats as ProjectBudgetStatsType } from '../types/dashboard-type';
import { formatCurrency } from '@/lib/utils';

interface ProjectBudgetStatsProps {
  projects: ProjectBudgetStatsType[];
}

export default function ProjectBudgetStats({ projects }: ProjectBudgetStatsProps) {
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Layihə Büdcəsi
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Layihələr üzrə büdcə və xərc analizi
        </p>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Layihə məlumatı yoxdur</p>
            </div>
          ) : (
            projects.map((project) => {
              const usagePercentage = Math.min(100, (project.expenses / project.budget) * 100);
              
              return (
                <div key={project.projectId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{project.projectName}</h3>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span>Büdcə: {formatCurrency(project.budget)}</span>
                      <span>Xərclər: {formatCurrency(project.expenses)}</span>
                      <span className={`font-medium ${project.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        Qalıq: {formatCurrency(project.remaining)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          usagePercentage >= 90 ? 'bg-red-600' :
                          usagePercentage >= 75 ? 'bg-orange-600' :
                          usagePercentage >= 50 ? 'bg-yellow-600' :
                          'bg-blue-600'
                        } ${
                          usagePercentage >= 90 ? 'w-full' :
                          usagePercentage >= 75 ? 'w-4/5' :
                          usagePercentage >= 50 ? 'w-3/5' :
                          usagePercentage >= 25 ? 'w-2/5' :
                          usagePercentage >= 10 ? 'w-1/5' :
                          'w-0'
                        }`}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">
                      {Math.round(usagePercentage)}% istifadə edilib
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
