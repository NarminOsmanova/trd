'use client';

import React, { useState, useMemo } from 'react';
import { 
  Shield, 
  ShieldCheck,
  UserCheck,
  UserX,
  RefreshCw,
  Filter,
  Grid3X3,
  List
} from 'lucide-react';
import { mockData } from '@/lib/mock-data';
import { User } from './types/users-type';
import UsersTable from './components/UsersTable';
import UsersCard from './components/UsersCard';
import UserViewModal from './components/UserViewModal';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockData.users);
  const [filters, setFilters] = useState<any>({
    searchTerm: '',
    role: undefined,
    status: undefined
  });
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter users based on current filters
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = !filters.searchTerm || 
        user.name?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      const matchesRole = !filters.role || user.role === filters.role;
      
      const matchesStatus = !filters.status || 
        (filters.status === 'active' && user.isActive) || 
        (filters.status === 'inactive' && !user.isActive);
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, filters]);

  // Calculate user statistics
  const userStats: any = useMemo(() => {
    return {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.isActive).length,
      inactiveUsers: users.filter(u => !u.isActive).length,
      adminUsers: users.filter(u => u.role === 'admin').length,
      regularUsers: users.filter(u => u.role === 'user').length,
      partnerUsers: users.filter(u => u.role === 'partner').length
    };
  }, [users]);

  const handleFiltersChange = (newFilters: any) => {
    setFilters((prev: any) => ({ ...prev, ...newFilters }));
  };

  const handleViewUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setIsModalOpen(true);
    }
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive: !u.isActive } : u));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
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

          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-start sm:justify-end">
            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1 flex-wrap">
              <button
                onClick={() => setViewMode('card')}
                className={`flex items-center px-2 md:px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                  viewMode === 'card'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Kart görünüşü"
              >
                <Grid3X3 className="w-4 h-4 mr-2" />
                <span className="hidden lg:inline">Kartlar</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center px-2 md:px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                  viewMode === 'table'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Cədvəl görünüşü"
              >
                <List className="w-4 h-4 mr-2" />
                <span className="hidden lg:inline">Cədvəl</span>
              </button>
            </div>
            
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center px-2 md:px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              <Filter className="w-4 h-4 mr-2" />
              <span className="hidden lg:inline">Filtrləri Təmizlə</span>
            </button>
          </div>
        </div>

        {/* Users View */}
        {viewMode === 'card' ? (
          <UsersCard
            users={filteredUsers}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onViewUser={handleViewUser}
            onToggleStatus={handleToggleStatus}
          />
        ) : (
          <UsersTable
            users={filteredUsers}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onViewUser={handleViewUser}
            onToggleStatus={handleToggleStatus}
          />
        )}

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                <p className="text-sm text-gray-600">Menecerlər</p>
                <p className="text-lg font-semibold text-gray-900">{userStats.regularUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Partnyorlar</p>
                <p className="text-lg font-semibold text-gray-900">{userStats.partnerUsers}</p>
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
                  <span className="text-sm font-medium text-gray-700">Menecerlər</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {userStats.regularUsers} ({((userStats.regularUsers / userStats.totalUsers) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ShieldCheck className="w-5 h-5 text-indigo-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Partnyorlar</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {userStats.partnerUsers} ({((userStats.partnerUsers / userStats.totalUsers) * 100).toFixed(1)}%)
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

      {/* User View Modal */}
      <UserViewModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        user={selectedUser}
      />
    </>
  );
}
