'use client';

import React, { useState, useMemo } from 'react';
import { 
  Shield, 
  ShieldCheck,
  UserCheck,
  UserX,
  RefreshCw,
  Filter
} from 'lucide-react';
import { mockData } from '@/lib/mock-data';
import { User, UserFilters, UserStats } from './types/users-type';
import UsersTable from './components/UsersTable';
import FormComponent from './components/FormComponent';

export default function UsersPage() {
  const [users] = useState<User[]>(mockData.users);
  const [filters, setFilters] = useState<UserFilters>({
    searchTerm: '',
    role: undefined,
    status: undefined
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Filter users based on current filters
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = !filters.searchTerm || 
        user.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      const matchesRole = !filters.role || user.role === filters.role;
      
      const matchesStatus = !filters.status || 
        (filters.status === 'active' && user.isActive) || 
        (filters.status === 'inactive' && !user.isActive);
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, filters]);

  // Calculate user statistics
  const userStats: UserStats = useMemo(() => {
    return {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.isActive).length,
      inactiveUsers: users.filter(u => !u.isActive).length,
      adminUsers: users.filter(u => u.role === 'admin').length,
      regularUsers: users.filter(u => u.role === 'user').length
    };
  }, [users]);

  const handleFiltersChange = (newFilters: Partial<UserFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleViewUser = (userId: string) => {
    console.log('View user:', userId);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    console.log('Delete user:', userId);
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingUser) {
        // Update existing user
        console.log('Update user:', editingUser.id, data);
      } else {
        // Create new user
        console.log('Create user:', data);
      }
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsFormOpen(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingUser(null);
  };

  const handleRefresh = () => {
    console.log('Refreshing user data');
  };

  const handleClearFilters = () => {
    setFilters({
      searchTerm: '',
      role: undefined,
      status: undefined
    });
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">İstifadəçilər</h2>
            </div>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="Yenilə"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Yenilə
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtrləri Təmizlə
            </button>
          </div>
        </div>

        {/* Users Table */}
        <UsersTable
          users={filteredUsers}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onViewUser={handleViewUser}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
          onCreateUser={handleCreateUser}
        />

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <Shield className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ümumi İstifadəçilər</p>
                <p className="text-lg font-semibold text-gray-900">{userStats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <Shield className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Adminlər</p>
                <p className="text-lg font-semibold text-gray-900">{userStats.adminUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <UserCheck className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Aktiv İstifadəçilər</p>
                <p className="text-lg font-semibold text-gray-900">{userStats.activeUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <ShieldCheck className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">İşçilər</p>
                <p className="text-lg font-semibold text-gray-900">{userStats.regularUsers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rol Bölgüsü</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Adminlər</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {userStats.adminUsers} ({((userStats.adminUsers / userStats.totalUsers) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ShieldCheck className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">İşçilər</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {userStats.regularUsers} ({((userStats.regularUsers / userStats.totalUsers) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Bölgüsü</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <UserCheck className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Aktiv</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {userStats.activeUsers} ({((userStats.activeUsers / userStats.totalUsers) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <UserX className="w-5 h-5 text-red-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Qeyri-aktiv</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {userStats.inactiveUsers} ({((userStats.inactiveUsers / userStats.totalUsers) * 100).toFixed(1)}%)
                </span>
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
        title={editingUser ? 'İstifadəçini Redaktə Et' : 'Yeni İstifadəçi Yarat'}
        initialData={editingUser ? {
          name: editingUser.name,
          email: editingUser.email,
          phone: editingUser.phone,
          role: editingUser.role,
          isActive: editingUser.isActive
        } : undefined}
      />
    </>
  );
}
