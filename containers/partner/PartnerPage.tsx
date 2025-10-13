'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  Plus,
  Search,
  TrendingUp,
  DollarSign,
  Percent,
  Calendar,
  BarChart3,
  PieChart,
  Target,
  Activity,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { mockData } from '@/lib/mock-data';
import { PartnerItem } from './types/partner-type';
import PartnerTable from './components/PartnerTable';
import FormComponent from './components/FormComponent';
import PartnerView from './components/PartnerView';
import { Badge } from '@/components/ui/badge';

export default function PartnerPage() {
  const t = useTranslations();
  const { user } = useAuth();
  const [partners] = useState<PartnerItem[]>(mockData.partners || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<PartnerItem | null>(null);
  const [viewingPartner, setViewingPartner] = useState<PartnerItem | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());

  // Get current user role and ID from auth context
  const currentUserRole = user?.role as 'admin' | 'partner' | 'user';
  const currentUserId = user?.id || '';

  const filteredPartners = partners.filter(partner => {
    // Search filter
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Role-based filter: partners only see themselves
    if (currentUserRole === 'partner') {
      return matchesSearch && partner.email === user?.email;
    }
    
    // Admins see all partners
    return matchesSearch;
  });

  const handleViewPartner = (partner: PartnerItem) => {
    setViewingPartner(partner);
    setIsViewOpen(true);
  };

  const handleEditPartner = (partner: PartnerItem) => {
    setEditingPartner(partner);
    setIsFormOpen(true);
  };

  const handleDeletePartner = (partnerId: string) => {
    console.log('Delete partner:', partnerId);
  };

  const handleCreatePartner = () => {
    setEditingPartner(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingPartner) {
        console.log('Update partner:', editingPartner.id, data);
      } else {
        console.log('Create partner:', data);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsFormOpen(false);
      setEditingPartner(null);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingPartner(null);
  };

  const handleCloseView = () => {
    setIsViewOpen(false);
    setViewingPartner(null);
  };

  // Calculate stats
  const totalPartners = partners.length;
  const activePartners = partners.filter(p => p.isActive).length;
  const totalInvested = partners.reduce((sum, p) => sum + p.totalInvested, 0);
  const totalEarned = partners.reduce((sum, p) => sum + p.totalEarned, 0);

  // Mock project statistics data
  const projectStats = {
    monthly: {
      totalExpenses: 45000, // 20000 + 15000 + 10000
      totalIncome: 65000,   // 30000 + 23000 + 12000
      netProfit: 20000,     // 65000 - 45000
      partnerShare: 20,     // Average partner share
      partnerExpenses: 9500, // 5000 + 3000 + 1500
      partnerIncome: 13900, // 7500 + 4600 + 1800
      partnerNetProfit: 4400 // 13900 - 9500
    },
    yearly: {
      totalExpenses: 540000, // 45000 * 12
      totalIncome: 780000,   // 65000 * 12
      netProfit: 240000,     // 780000 - 540000
      partnerShare: 20,
      partnerExpenses: 114000, // 9500 * 12
      partnerIncome: 166800, // 13900 * 12
      partnerNetProfit: 52800 // 166800 - 114000
    }
  };

  // Mock monthly breakdown data
  const monthlyBreakdown = [
    { month: 'Yanvar', expenses: 45000, income: 65000, partnerExpenses: 9000, partnerIncome: 13000 },
    { month: 'Fevral', expenses: 45000, income: 65000, partnerExpenses: 9000, partnerIncome: 13000 },
    { month: 'Mart', expenses: 45000, income: 65000, partnerExpenses: 9000, partnerIncome: 13000 },
    { month: 'Aprel', expenses: 45000, income: 65000, partnerExpenses: 9000, partnerIncome: 13000 },
    { month: 'May', expenses: 45000, income: 65000, partnerExpenses: 9000, partnerIncome: 13000 },
    { month: 'İyun', expenses: 45000, income: 65000, partnerExpenses: 9000, partnerIncome: 13000 }
  ];

  // Mock project breakdown data - Monthly figures (exact whole numbers)
  const projectBreakdown = [
    { 
      id: 'proj1',
      name: 'Yeni Bina Tikintisi', 
      totalExpenses: 20000, // Monthly expenses
      totalIncome: 30000,   // Monthly income
      partnerShare: 25,
      partnerExpenses: 5000, // 25% of 20000
      partnerIncome: 7500    // 25% of 30000
    },
    { 
      id: 'proj2',
      name: 'Ofis Renovasiyası', 
      totalExpenses: 15000, // Monthly expenses
      totalIncome: 23000,   // Monthly income
      partnerShare: 20,
      partnerExpenses: 3000, // 20% of 15000
      partnerIncome: 4600    // 20% of 23000
    },
    { 
      id: 'proj3',
      name: 'Mall Tikintisi', 
      totalExpenses: 10000, // Monthly expenses
      totalIncome: 12000,   // Monthly income
      partnerShare: 15,
      partnerExpenses: 1500, // 15% of 10000
      partnerIncome: 1800    // 15% of 12000
    }
  ];

  // Toggle project expansion
  const toggleProjectExpansion = (projectId: string) => {
    setExpandedProjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            {currentUserRole === 'admin' && (
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Partnyor adı ilə axtar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            )}
          </div>

        </div>

        {/* Statistics - Only show to admins */}
        {currentUserRole === 'admin' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ümumi Partnyorlar</p>
                  <p className="text-lg font-semibold text-gray-900">{totalPartners}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Aktiv Partnyorlar</p>
                  <p className="text-lg font-semibold text-green-600">{activePartners}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                  <DollarSign className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ümumi İnvestisiya</p>
                  <p className="text-lg font-semibold text-red-600">
                    {totalInvested.toLocaleString()} AZN
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <Percent className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ümumi Gəlir</p>
                  <p className="text-lg font-semibold text-purple-600">
                    {totalEarned.toLocaleString()} AZN
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Monthly & Yearly Statistics - Only show to partners */}
        {currentUserRole === 'partner' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Statistics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Aylıq Statistika
              </h3>
              <Badge className="bg-blue-100 text-blue-800">Bu Ay</Badge>
            </div>
            
            <div className="space-y-4">
              {/* Total Project Stats */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-600 mb-3">Layihə Ümumi Məlumatları</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Ümumi Xərc</p>
                    <p className="text-lg font-semibold text-red-600">
                      {projectStats.monthly.totalExpenses.toLocaleString()} AZN
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Ümumi Gəlir</p>
                    <p className="text-lg font-semibold text-green-600">
                      {projectStats.monthly.totalIncome.toLocaleString()} AZN
                    </p>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500">Xalis Mənfəət</p>
                  <p className="text-xl font-bold text-blue-600">
                    {projectStats.monthly.netProfit.toLocaleString()} AZN
                  </p>
                </div>
              </div>

              {/* Partner Share Stats */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-3 flex items-center">
                  <Percent className="w-4 h-4 mr-1" />
                  Sizin Hissəniz ({projectStats.monthly.partnerShare}%)
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-blue-600">Sizin Xərc Hissəniz</p>
                    <p className="text-lg font-semibold text-red-600">
                      {projectStats.monthly.partnerExpenses.toLocaleString()} AZN
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600">Sizin Gəlir Hissəniz</p>
                    <p className="text-lg font-semibold text-green-600">
                      {projectStats.monthly.partnerIncome.toLocaleString()} AZN
                    </p>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-blue-200">
                  <p className="text-xs text-blue-600">Sizin Xalis Mənfəətiniz</p>
                  <p className="text-xl font-bold text-blue-800">
                    {projectStats.monthly.partnerNetProfit.toLocaleString()} AZN
                  </p>
                </div>
              </div>

              {/* Project Names - Expandable */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Layihə Adları</h4>
                  <div className="space-y-2">
                    {projectBreakdown.map((project) => (
                      <div key={project.id} className="border border-gray-200 rounded-lg">
                        <button
                          onClick={() => toggleProjectExpansion(project.id)}
                          className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-gray-900">{project.name}</span>
                          {expandedProjects.has(project.id) ? (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                        
                        {expandedProjects.has(project.id) && (
                          <div className="border-t border-gray-200 p-4 bg-gray-50">
                            <div className="space-y-3">
                              {/* Project Total Stats */}
                              <div className="bg-white rounded p-3">
                                <h5 className="text-xs font-medium text-gray-600 mb-2">Layihə Ümumi Məlumatları</h5>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <p className="text-xs text-gray-500">Ümumi Xərc</p>
                                    <p className="text-sm font-semibold text-red-600">
                                      {project.totalExpenses.toLocaleString()} AZN
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Ümumi Gəlir</p>
                                    <p className="text-sm font-semibold text-green-600">
                                      {project.totalIncome.toLocaleString()} AZN
                                    </p>
                                  </div>
                                </div>
                                <div className="mt-2 pt-2 border-t border-gray-200">
                                  <p className="text-xs text-gray-500">Xalis Mənfəət</p>
                                  <p className="text-sm font-bold text-blue-600">
                                    {(project.totalIncome - project.totalExpenses).toLocaleString()} AZN
                                  </p>
                                </div>
                              </div>

                              {/* Partner Share for this project */}
                              <div className="bg-blue-50 rounded p-3">
                                <h5 className="text-xs font-medium text-blue-800 mb-2 flex items-center">
                                  <Percent className="w-3 h-3 mr-1" />
                                  Sizin Hissəniz ({project.partnerShare}%)
                                </h5>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <p className="text-xs text-blue-600">Sizin Xərc Hissəniz</p>
                                    <p className="text-sm font-semibold text-red-600">
                                      {project.partnerExpenses.toLocaleString()} AZN
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-blue-600">Sizin Gəlir Hissəniz</p>
                                    <p className="text-sm font-semibold text-green-600">
                                      {project.partnerIncome.toLocaleString()} AZN
                                    </p>
                                  </div>
                                </div>
                                <div className="mt-2 pt-2 border-t border-blue-200">
                                  <p className="text-xs text-blue-600">Sizin Xalis Mənfəətiniz</p>
                                  <p className="text-sm font-bold text-blue-800">
                                    {(project.partnerIncome - project.partnerExpenses).toLocaleString()} AZN
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Yearly Statistics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                İllik Statistika
              </h3>
              <Badge className="bg-green-100 text-green-800">2024</Badge>
            </div>
            
            <div className="space-y-4">
              {/* Total Project Stats */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-600 mb-3">Layihə Ümumi Məlumatları</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Ümumi Xərc</p>
                    <p className="text-lg font-semibold text-red-600">
                      {projectStats.yearly.totalExpenses.toLocaleString()} AZN
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Ümumi Gəlir</p>
                    <p className="text-lg font-semibold text-green-600">
                      {projectStats.yearly.totalIncome.toLocaleString()} AZN
                    </p>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500">Xalis Mənfəət</p>
                  <p className="text-xl font-bold text-blue-600">
                    {projectStats.yearly.netProfit.toLocaleString()} AZN
                  </p>
                </div>
              </div>

              {/* Partner Share Stats */}
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-green-800 mb-3 flex items-center">
                  <Percent className="w-4 h-4 mr-1" />
                  Sizin Hissəniz ({projectStats.yearly.partnerShare}%)
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-green-600">Sizin Xərc Hissəniz</p>
                    <p className="text-lg font-semibold text-red-600">
                      {projectStats.yearly.partnerExpenses.toLocaleString()} AZN
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-green-600">Sizin Gəlir Hissəniz</p>
                    <p className="text-lg font-semibold text-green-600">
                      {projectStats.yearly.partnerIncome.toLocaleString()} AZN
                    </p>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-green-200">
                  <p className="text-xs text-green-600">Sizin Xalis Mənfəətiniz</p>
                  <p className="text-xl font-bold text-green-800">
                    {projectStats.yearly.partnerNetProfit.toLocaleString()} AZN
                  </p>
                </div>
              </div>

              {/* Project Names - Expandable (Yearly) */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Layihə Adları (İllik)</h4>
                  <div className="space-y-2">
                    {projectBreakdown.map((project) => (
                      <div key={`yearly-${project.id}`} className="border border-gray-200 rounded-lg">
                        <button
                          onClick={() => toggleProjectExpansion(`yearly-${project.id}`)}
                          className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-gray-900">{project.name}</span>
                          {expandedProjects.has(`yearly-${project.id}`) ? (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                        
                        {expandedProjects.has(`yearly-${project.id}`) && (
                          <div className="border-t border-gray-200 p-4 bg-gray-50">
                            <div className="space-y-3">
                              {/* Project Total Stats (Yearly) */}
                              <div className="bg-white rounded p-3">
                                <h5 className="text-xs font-medium text-gray-600 mb-2">Layihə Ümumi Məlumatları (İllik)</h5>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <p className="text-xs text-gray-500">Ümumi Xərc</p>
                                    <p className="text-sm font-semibold text-red-600">
                                      {(project.totalExpenses * 12).toLocaleString()} AZN
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Ümumi Gəlir</p>
                                    <p className="text-sm font-semibold text-green-600">
                                      {(project.totalIncome * 12).toLocaleString()} AZN
                                    </p>
                                  </div>
                                </div>
                                <div className="mt-2 pt-2 border-t border-gray-200">
                                  <p className="text-xs text-gray-500">Xalis Mənfəət</p>
                                  <p className="text-sm font-bold text-blue-600">
                                    {((project.totalIncome - project.totalExpenses) * 12).toLocaleString()} AZN
                                  </p>
                                </div>
                              </div>

                              {/* Partner Share for this project (Yearly) */}
                              <div className="bg-green-50 rounded p-3">
                                <h5 className="text-xs font-medium text-green-800 mb-2 flex items-center">
                                  <Percent className="w-3 h-3 mr-1" />
                                  Sizin Hissəniz ({project.partnerShare}%) - İllik
                                </h5>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <p className="text-xs text-green-600">Sizin Xərc Hissəniz</p>
                                    <p className="text-sm font-semibold text-red-600">
                                      {(project.partnerExpenses * 12).toLocaleString()} AZN
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-green-600">Sizin Gəlir Hissəniz</p>
                                    <p className="text-sm font-semibold text-green-600">
                                      {(project.partnerIncome * 12).toLocaleString()} AZN
                                    </p>
                                  </div>
                                </div>
                                <div className="mt-2 pt-2 border-t border-green-200">
                                  <p className="text-xs text-green-600">Sizin Xalis Mənfəətiniz</p>
                                  <p className="text-sm font-bold text-green-800">
                                    {((project.partnerIncome - project.partnerExpenses) * 12).toLocaleString()} AZN
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Project Breakdown - Only show to partners */}
        {currentUserRole === 'partner' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Target className="w-5 h-5 mr-2 text-orange-600" />
            Layihə Üzrə Təfərrüatlı Hesabat
          </h3>
          
          <div className="space-y-4">
            {projectBreakdown.map((project, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{project.name}</h4>
                  <Badge className="bg-orange-100 text-orange-800">
                    {project.partnerShare}% Hissə
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Ümumi Xərc</p>
                    <p className="text-sm font-semibold text-red-600">
                      {project.totalExpenses.toLocaleString()} AZN
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Ümumi Gəlir</p>
                    <p className="text-sm font-semibold text-green-600">
                      {project.totalIncome.toLocaleString()} AZN
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Sizin Xərc Hissəniz</p>
                    <p className="text-sm font-semibold text-red-500">
                      {project.partnerExpenses.toLocaleString()} AZN
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Sizin Gəlir Hissəniz</p>
                    <p className="text-sm font-semibold text-green-500">
                      {project.partnerIncome.toLocaleString()} AZN
                    </p>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-200 text-center">
                  <p className="text-xs text-gray-500 mb-1">Sizin Xalis Mənfəətiniz</p>
                  <p className="text-lg font-bold text-blue-600">
                    {(project.partnerIncome - project.partnerExpenses).toLocaleString()} AZN
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}

        {/* Partners Table */}
        <PartnerTable
          partners={filteredPartners}
          onViewPartner={handleViewPartner}
          onEditPartner={handleEditPartner}
          onDeletePartner={handleDeletePartner}
          currentUserRole={currentUserRole as 'admin' | 'user' | 'partner'}
          currentUserId={currentUserId}
        />
      </div>

      {/* Form Modal */}
      <FormComponent
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        title={editingPartner ? 'Partnyoru Redaktə Et' : 'Yeni Partnyor Yarat'}
        initialData={editingPartner ? {
          name: editingPartner.name,
          email: editingPartner.email,
          phone: editingPartner.phone,
          sharePercentage: editingPartner.sharePercentage,
          isActive: editingPartner.isActive
        } : undefined}
      />

      {/* View Modal */}
      <PartnerView
        isOpen={isViewOpen}
        onClose={handleCloseView}
        partner={viewingPartner}
        onEdit={handleEditPartner}
        onDelete={handleDeletePartner}
      />
    </>
  );
}
