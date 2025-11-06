'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { User } from '@/types';
import type { ApiUser } from '@/containers/users/types/users-type';
import { formatDate } from '@/lib/utils';
import { useUsers, useChangeUserStatus, useGenerateRegistrationLink } from '@/lib/hooks/useUsers';
import { UserStatus, UserType } from '@/containers/users/types/users-type';
import UserViewModal from './UserViewModal';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AlertDialogComponent from '@/components/AlertDiolog/AlertDiolog';
import { Eye, Trash2, RefreshCw, User as UserIcon, UserCheck, Clock, Ban, UserX } from 'lucide-react';

interface UsersManagementTabProps {
  onCreateOrUpdate?: (user: User) => void;
}

export default function UsersManagementTab({ onCreateOrUpdate }: UsersManagementTabProps) {
  const t = useTranslations('settings.users');
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState<Partial<User>>({
    phone: '',
    role: 'user',
  });
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Get users from API
  const { users, isLoading, refetchUsers, deleteUser } = useUsers({
    pageNumber: 1,
    pageSize: 100, // Get all users for settings
  });

  // Derive display-friendly users from raw ApiUser
  const viewUsers = (users as unknown as ApiUser[]).map((u) => {
    const firstSet = Array.isArray(u.sets) && u.sets.length > 0 ? u.sets[0] : (u as any).set;
    const name = `${firstSet?.firstName || ''} ${firstSet?.lastName || ''}`.trim() || u.email || 'N/A';
    const roleKey = u.role?.name === 'Admin' ? 'admin' : (u.type === 1 ? 'partner' : 'user');
    return {
      id: u.id.toString(),
      name,
      email: u.email || '',
      positionName: u.position?.name || '-',
      roleKey,
      isActive: u.status === 1,
      status: u.status,
      createdAt: (u as any).createdDate || (u as any).createdAt || null,
    };
  });

  // Change user status mutation
  const { mutate: changeStatus } = useChangeUserStatus();

  // Generate registration link mutation
  const { mutate: generateLink, isPending: isGeneratingLink } = useGenerateRegistrationLink();

  const resetForm = () => {
    setEditing(null);
    setForm({ name: '', email: '', phone: '', position: '', role: 'user', isActive: true });
  };

  const getUserStatus = (status?: number): UserStatus => {
    return status !== undefined ? status : UserStatus.Pending;
  };

  const getStatusLabel = (status: UserStatus): string => {
    switch (status) {
      case UserStatus.Active:
        return t('active');
      case UserStatus.Inactive:
        return t('inactive');
      case UserStatus.Blocked:
        return t('blocked');
      case UserStatus.Pending:
        return t('pending');
      default:
        return t('unknown');
    }
  };

  const handleChangeStatus = (userId: string, status: UserStatus) => {
    const numericUserId = parseInt(userId);
    changeStatus({ userId: numericUserId, status }, { onSuccess: () => refetchUsers() });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.phone || !form.role) return;

    try {
      if (editing) {
        // Update user - API call would go here
        console.log('Update user:', { ...editing, ...form });
        toast.info(t('updateInProgress'));
        onCreateOrUpdate?.({ ...editing, ...form } as User);
      } else {
        // Generate registration link for new user
        const userType = form.role === 'partner' ? UserType.Partner : UserType.User;
        
        generateLink(
          { 
            phone: form.phone || '', 
            userType 
          },
          {
            onSuccess: (response) => {
              if (response.data?.registrationLink) {
                // Copy link to clipboard
                navigator.clipboard.writeText(response.data.registrationLink);
                toast.success(t('linkGeneratedSuccess'));
                toast.info(t('linkCopiedToClipboard'));
                
                // Show link to user (optional)
                console.log('Registration Link:', response.data.registrationLink);
                console.log('Expires At:', response.data.expiresAt);
              }
              
              // Refetch users after creation
              refetchUsers();
              resetForm();
            },
            onError: (error: any) => {
              console.error('Error generating link:', error);
              toast.error(t('linkGenerationFailed'));
            },
          }
        );
      }
    } catch (error) {
      console.error('Error submitting user:', error);
      toast.error(t('errorOccurred'));
    }
  };

  // Handle view user
  const handleViewUser = (userId: string) => {
    setSelectedUserId(userId);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setSelectedUserId(null);
  };

  const handleDeleteClick = (userId: string) => {
    setDeleteId(parseInt(userId));
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteId !== null) {
      deleteUser(deleteId, {
        onSuccess: () => {
          toast.success(t('userDeleted') || 'İstifadəçi uğurla silindi');
          refetchUsers();
          setIsDeleteDialogOpen(false);
          setDeleteId(null);
        },
        onError: (error: any) => {
          console.error('Error deleting user:', error);
          const errorMessage = error?.response?.data?.message || 'İstifadəçi silinərkən xəta baş verdi';
          toast.error(errorMessage);
          setIsDeleteDialogOpen(false);
          setDeleteId(null);
        },
      });
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setDeleteId(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {editing ? t('updateTitle') : t('createTitle')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input 
            placeholder={t('phone')}
            value={form.phone || ''} 
            onChange={(e) => setForm({ ...form, phone: e.target.value })} 
          />
          <Select 
            value={(form.role as string) || 'user'} 
            onValueChange={(v) => setForm({ ...form, role: v as User['role'] })}
          >
            <SelectTrigger><SelectValue placeholder={t('role')} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="user">{t('employee')}</SelectItem>
              <SelectItem value="partner">{t('partner')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <Button type="submit" disabled={isGeneratingLink}>
            {isGeneratingLink ? t('generating') : (editing ? t('update') : t('add'))}
          </Button>
          {editing && (
            <Button type="button" variant="outline" onClick={resetForm} disabled={isGeneratingLink}>
              {t('cancel')}
            </Button>
          )}
        </div>
      </form>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{t('title')}</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetchUsers()}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {t('refresh')}
          </Button>
        </div>
        
        {viewUsers.length === 0 && !isLoading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('noUsers')}
            </h3>
            <p className="text-gray-600">
              {t('noUsersMessage')}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('name')}</TableHead>
                <TableHead>{t('email')}</TableHead>
                <TableHead>{t('position')}</TableHead>
                <TableHead>{t('role')}</TableHead>
                <TableHead>{t('status')}</TableHead>
                <TableHead>{t('date')}</TableHead>
                <TableHead className="text-right">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-3 text-gray-600">{t('loading') || 'Yüklənir...'}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                viewUsers.map(u => (
                  <TableRow key={u.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-900">{u.name}</TableCell>
                    <TableCell className="text-gray-600">{u.email}</TableCell>
                    <TableCell className="text-gray-600">{u.positionName}</TableCell>
                    <TableCell>
                      <Badge variant={u.roleKey === 'admin' ? 'secondary' : 'default'}>
                        {u.roleKey === 'admin' ? t('admin') : u.roleKey === 'partner' ? t('partner') : t('employee')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={getUserStatus(u.status as number).toString()}
                        onValueChange={(value) => handleChangeStatus(u.id, parseInt(value) as UserStatus)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <div className="flex items-center">
                            {getUserStatus(u.status as number) === UserStatus.Active ? (
                              <UserCheck className="w-4 h-4 mr-2 text-green-600" />
                            ) : getUserStatus(u.status as number) === UserStatus.Pending ? (
                              <Clock className="w-4 h-4 mr-2 text-gray-600" />
                            ) : getUserStatus(u.status as number) === UserStatus.Blocked ? (
                              <Ban className="w-4 h-4 mr-2 text-red-600" />
                            ) : (
                              <UserX className="w-4 h-4 mr-2 text-red-500" />
                            )}
                            <SelectValue />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={UserStatus.Active.toString()}>
                            {getStatusLabel(UserStatus.Active)}
                          </SelectItem>
                          <SelectItem value={UserStatus.Inactive.toString()}>
                            {getStatusLabel(UserStatus.Inactive)}
                          </SelectItem>
                          <SelectItem value={UserStatus.Blocked.toString()}>
                            {getStatusLabel(UserStatus.Blocked)}
                          </SelectItem>
                          <SelectItem value={UserStatus.Pending.toString()}>
                            {getStatusLabel(UserStatus.Pending)}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-gray-500">{formatDate(u.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewUser(u.id)}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          title={t('view')}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(u.id)}
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
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialogComponent
        open={isDeleteDialogOpen}
        setOpen={setIsDeleteDialogOpen}
        title={t('deleteConfirm') || 'İstifadəçini silmək'}
        description={t('deleteDescription') || 'Bu istifadəçini silmək istədiyinizdən əminsiniz?'}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        variant="danger"
      />

      {/* User View Modal */}
      {selectedUserId && (
        <UserViewModal
          userId={selectedUserId}
          isOpen={!!selectedUserId}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}


