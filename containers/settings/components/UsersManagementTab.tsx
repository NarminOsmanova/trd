'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { User } from '@/types';
import { formatDate } from '@/lib/utils';
import { useUsers, useChangeUserStatus, useGenerateRegistrationLink } from '@/lib/hooks/useUsers';
import { UserStatus, UserType } from '@/containers/users/types/users-type';
import UserViewModal from './UserViewModal';
import { toast } from 'react-toastify';

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

  // Get users from API
  const { users, isLoading, refetchUsers } = useUsers({
    pageNumber: 1,
    pageSize: 100, // Get all users for settings
  });

  // Change user status mutation
  const { mutate: changeStatus } = useChangeUserStatus();

  // Generate registration link mutation
  const { mutate: generateLink, isPending: isGeneratingLink } = useGenerateRegistrationLink();

  const resetForm = () => {
    setEditing(null);
    setForm({ name: '', email: '', phone: '', position: '', role: 'user', isActive: true });
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

  // Toggle user status
  const handleToggleStatus = (userId: string, currentStatus: boolean) => {
    const numericUserId = parseInt(userId);
    const newStatus = currentStatus ? UserStatus.Inactive : UserStatus.Active;
    
    changeStatus({ userId: numericUserId, status: newStatus }, {
      onSuccess: () => {
        refetchUsers();
      },
    });
  };

  // Handle view user
  const handleViewUser = (userId: string) => {
    setSelectedUserId(userId);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setSelectedUserId(null);
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{t('title')}</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetchUsers()}
          >
            {t('refresh')}
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="py-3 px-4">{t('name')}</th>
                <th className="py-3 px-4">{t('email')}</th>
                <th className="py-3 px-4">{t('position')}</th>
                <th className="py-3 px-4">{t('role')}</th>
                <th className="py-3 px-4">{t('status')}</th>
                <th className="py-3 px-4">{t('date')}</th>
                <th className="py-3 px-4 text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    {t('noUsers')}
                  </td>
                </tr>
              ) : (
                users.map(u => (
                  <tr key={u.id} className="border-t hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-900">{u.name}</td>
                    <td className="py-3 px-4 text-gray-600">{u.email}</td>
                    <td className="py-3 px-4 text-gray-600">{u.position || '-'}</td>
                    <td className="py-3 px-4">
                      <Badge variant={u.role === 'admin' ? 'secondary' : 'default'}>
                        {u.role === 'admin' ? t('admin') : u.role === 'partner' ? t('partner') : t('employee')}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStatus(u.id, u.isActive || false)}
                        className="cursor-pointer"
                      >
                        <Badge variant={u.isActive ? 'success' : 'destructive'}>
                          {u.isActive ? t('active') : t('inactive')}
                        </Badge>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{formatDate(u.createdAt)}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewUser(u.id)}>
                          {t('view')}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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


