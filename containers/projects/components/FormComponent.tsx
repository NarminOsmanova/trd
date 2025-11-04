'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import DialogComponent from '@/components/modals/DialogComponent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { projectFormSchema, type ProjectFormData } from '../constants/validations';
import { useCreateProject, useUpdateProject } from '@/lib/hooks/useProject';
import { ProjectStatus } from '../types/projects-type';
import { toast } from 'sonner';
import { useAllUsers } from '@/lib/hooks/useUsers';

interface FormComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => void;
  title: string;
  initialData?: Partial<ProjectFormData>;
  isLoading?: boolean;
}

export default function FormComponent({
  isOpen,
  onClose,
  onSubmit,
  title,
  initialData,
  isLoading = false
}: FormComponentProps) {
  const t = useTranslations();
  const [selectedUsers, setSelectedUsers] = useState<string[]>(initialData?.assignedUsers || []);
  const [partnerPercentages, setPartnerPercentages] = useState<Record<string, number>>({});
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [partnerSearchTerm, setPartnerSearchTerm] = useState('');
  
  // API: Create and Update hooks
  const { mutate: createProject, isPending: isCreating } = useCreateProject();
  const { mutate: updateProject, isPending: isUpdating } = useUpdateProject();
  
  // API: Get all users
  const { users: allUsers, isLoading: isLoadingUsers } = useAllUsers();
  
  // Filter users by type and search
  const regularUsers = allUsers
    .filter((user: any) => user.role === 'user')
    .filter((user: any) => 
      user.name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(userSearchTerm.toLowerCase())
    );
  
  const partnerUsers = allUsers
    .filter((user: any) => user.role === 'partner')
    .filter((user: any) => 
      user.name?.toLowerCase().includes(partnerSearchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(partnerSearchTerm.toLowerCase())
    );
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      targetBudget: undefined,
      monthlyBudget: undefined,
      assignedUsers: [],
      ...initialData
    }
  });

  const isSubmitting = isCreating || isUpdating;

  // Update form when initialData changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setSelectedUsers(initialData.assignedUsers || []);
        // Reset form with new data
        reset({
          name: initialData.name || '',
          description: initialData.description || '',
          status: initialData.status || 'active',
          startDate: initialData.startDate || new Date().toISOString().split('T')[0],
          endDate: initialData.endDate || '',
          targetBudget: initialData.targetBudget,
          monthlyBudget: initialData.monthlyBudget,
          assignedUsers: initialData.assignedUsers || []
        });
      } else {
        // Clear form for new project
        setSelectedUsers([]);
        setPartnerPercentages({});
        reset({
          name: '',
          description: '',
          status: 'active',
          startDate: new Date().toISOString().split('T')[0],
          endDate: '',
          targetBudget: undefined,
          monthlyBudget: undefined,
          assignedUsers: []
        });
      }
    }
  }, [isOpen, initialData, reset]);

  const handleFormSubmit = async (data: ProjectFormData) => {
    try {
      // Convert status to ProjectStatus enum
      const statusEnum = data.status === 'active' ? ProjectStatus.Active :
                        data.status === 'completed' ? ProjectStatus.Completed :
                        data.status === 'paused' ? ProjectStatus.Paused :
                        ProjectStatus.Draft;

      // Prepare members array
      const members = selectedUsers.map(userId => ({
        userId: parseInt(userId)
      }));

      if (initialData && (initialData as any).id) {
        // Update existing project
        updateProject(
          {
            id: parseInt((initialData as any).id),
            name: data.name,
            description: data.description || '',
            startDate: data.startDate,
            endDatePlanned: data.endDate || data.startDate,
            plannedCapital: data.targetBudget || 0,
            status: statusEnum,
            members
          },
          {
            onSuccess: () => {
              toast.success(t('projects.updateSuccess'));
              reset();
              setSelectedUsers([]);
              onSubmit(data);
              onClose();
            },
            onError: (error) => {
              console.error('Error updating project:', error);
              toast.error(t('projects.updateFailed'));
            }
          }
        );
      } else {
        // Create new project
        createProject(
          {
            name: data.name,
            description: data.description || '',
            startDate: data.startDate,
            endDatePlanned: data.endDate || data.startDate,
            plannedCapital: data.targetBudget || 0,
            status: statusEnum,
            members
          },
          {
            onSuccess: () => {
              toast.success(t('projects.createSuccess'));
              reset();
              setSelectedUsers([]);
              onSubmit(data);
              onClose();
            },
            onError: (error) => {
              console.error('Error creating project:', error);
              toast.error(t('projects.createFailed'));
            }
          }
        );
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(t('projects.submitError'));
    }
  };

  const handleClose = () => {
    reset();
    setSelectedUsers([]);
    onClose();
  };

  const handleStatusChange = (value: string) => {
    setValue('status', value as 'active' | 'completed' | 'paused');
  };

  const toggleUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const updatePartnerPercentage = (userId: string, value: number) => {
    setPartnerPercentages(prev => ({
      ...prev,
      [userId]: value
    }));
  };

  return (
    <DialogComponent
      open={isOpen}
      setOpen={(open) => !open && handleClose()}
      title={title}
      size="lg"
      loading={isLoading}
      onClose={handleClose}
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            onClick={handleSubmit(handleFormSubmit)}
          >
            {isSubmitting ? t('projects.saving') : t('common.save')}
          </Button>
        </div>
      }
      showFooter={true}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="name">{t('projects.projectName')} *</Label>
            <Input
              {...register('name')}
              id="name"
              placeholder={t('projects.projectName')}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">{t('common.description')} </Label>
            <Textarea
              {...register('description')}
              id="description"
              rows={3}
              placeholder={t('common.description')}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Status and Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         
            <div className="space-y-2">
              <Label htmlFor="targetBudget">{t('projects.targetBudget')}</Label>
              <Input
                {...register('targetBudget')}
                type="number"
                inputMode="numeric"
                id="targetBudget"
                placeholder="100000"
              />
              {errors.targetBudget && (
                <p className="text-sm text-red-600">{errors.targetBudget.message as string}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">{t('projects.startDate')} *</Label>
              <Input
                {...register('startDate')}
                type="date"
                id="startDate"
              />
              {errors.startDate && (
                <p className="text-sm text-red-600">{errors.startDate.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">{t('projects.endDate')}</Label>
              <Input
                {...register('endDate')}
                type="date"
                id="endDate"
              />
              {errors.endDate && (
                <p className="text-sm text-red-600">{errors.endDate.message}</p>
              )}
            </div>


           
          </div>

          {/* Assigned Users & Partners */}
          <div className="space-y-2">
            <Label>{t('projects.assignedUsers')}</Label>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              {/* Search Input */}
              <div className="relative border-b border-gray-200 bg-gray-50">
                <Input
                  type="text"
                  placeholder={t('common.search')}
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="pl-8 h-9 text-sm border-0 bg-transparent focus:ring-0"
                />
                <svg
                  className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              {/* User List */}
              <div className="p-4 max-h-48 overflow-y-auto">
              {isLoadingUsers ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : regularUsers.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  {userSearchTerm ? t('common.noResultsFound') : t('projects.noUsers')}
                </p>
              ) : (
                <div className="space-y-2">
                  {regularUsers.map((user: any) => (
                    <label
                      key={user.id}
                      className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
                    >
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => toggleUser(user.id)}
                      />
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {user.name?.split(' ').map((n: any) => n[0]).join('').toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
              </div>
            </div>
            {errors.assignedUsers && (
              <p className="text-sm text-red-600">{errors.assignedUsers.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>{t('projects.partners')}</Label>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              {/* Search Input */}
              <div className="relative border-b border-gray-200 bg-gray-50">
                <Input
                  type="text"
                  placeholder={t('common.search')}
                  value={partnerSearchTerm}
                  onChange={(e) => setPartnerSearchTerm(e.target.value)}
                  className="pl-8 h-9 text-sm border-0 bg-transparent focus:ring-0"
                />
                <svg
                  className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              {/* Partner List */}
              <div className="p-4 max-h-60 overflow-y-auto">
              {isLoadingUsers ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : partnerUsers.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  {partnerSearchTerm ? t('common.noResultsFound') : t('projects.noPartners')}
                </p>
              ) : (
                <div className="space-y-4">
                  {partnerUsers.map((user: any) => (
                  <div key={user.id} className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => toggleUser(user.id)}
                      />
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {user.name?.split(' ').map((n: any) => n[0]).join('').toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </label>
                    
                    {/* Percentage input for selected partners */}
                    {selectedUsers.includes(user.id) && (
                      <div className="ml-8 space-y-3 bg-blue-50 p-3 rounded-lg">
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">Hissə faizi (%)</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={partnerPercentages[user.id] || 0}
                            onChange={(e) => updatePartnerPercentage(user.id, parseFloat(e.target.value) || 0)}
                            className="h-8 text-sm"
                            placeholder="0"
                          />
                        </div>
                        <div className="text-xs text-gray-500">
                          Hissə: {partnerPercentages[user.id] || 0}%
                        </div>
                      </div>
                    )}
                  </div>
                  ))}
                </div>
              )}
              </div>
            </div>
          </div>

        </form>
    </DialogComponent>
  );
}
