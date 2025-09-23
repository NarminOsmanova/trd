import { 
  User, 
  Project, 
  Transaction, 
  Notification, 
  DashboardStats,
  TransactionCategory,
  Category
} from '@/types';

// Mock Users Data
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@trd.az',
    name: 'Admin Adminov',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    phone: '+994501234567',
    position: 'Baş Administrator',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'memmed@trd.az',
    name: 'Məmməd Məmmədov',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    phone: '+994501234568',
    position: 'Layihə Meneceri',
    isActive: true,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    email: 'ayse@trd.az',
    name: 'Ayşə Əliyeva',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    phone: '+994501234569',
    position: 'Maliyyə Mütəxəssisi',
    isActive: true,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  },
  {
    id: '4',
    email: 'elvin@trd.az',
    name: 'Elvin Həsənov',
    role: 'partner',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    phone: '+994501234570',
    position: 'Mühəndis',
    isActive: true,
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z'
  },
  {
    id: '5',
    email: 'leyla@trd.az',
    name: 'Leyla Rəhimova',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    phone: '+994501234571',
    position: 'Hesabdar',
    isActive: true,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z'
  }
];

// Mock Projects Data
export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Yeni Bina Tikintisi',
    description: 'Bakı şəhərində yeni yaşayış binasının tikintisi',
    status: 'active',
    startDate: '2024-01-15T00:00:00Z',
    endDate: '2024-12-31T00:00:00Z',
    budget: 250000,
    totalExpenses: 185000,
    remainingBudget: 65000,
    assignedUsers: ['2', '3', '4'],
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-02-15T10:30:00Z',
    createdBy: '1'
  },
  {
    id: '2',
    name: 'Ofis Renovasiyası',
    description: 'Köhnə ofis binasının təmir və yenilənməsi',
    status: 'active',
    startDate: '2024-02-01T00:00:00Z',
    endDate: '2024-06-30T00:00:00Z',
    budget: 120000,
    totalExpenses: 95000,
    remainingBudget: 25000,
    assignedUsers: ['3', '5'],
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-15T14:20:00Z',
    createdBy: '1'
  },
  {
    id: '3',
    name: 'Yol Tikintisi',
    description: 'Şəhərətrafı yolun tikintisi və asfaltlama',
    status: 'paused',
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-08-31T00:00:00Z',
    budget: 500000,
    totalExpenses: 320000,
    remainingBudget: 180000,
    assignedUsers: ['2', '4', '5'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-02-10T09:15:00Z',
    createdBy: '1'
  },
  {
    id: '4',
    name: 'Park Təmir İşləri',
    description: 'Şəhər parkının yenidənqurma və təmir işləri',
    status: 'completed',
    startDate: '2023-11-01T00:00:00Z',
    endDate: '2024-01-31T00:00:00Z',
    budget: 75000,
    totalExpenses: 72000,
    remainingBudget: 3000,
    assignedUsers: ['3', '4'],
    createdAt: '2023-11-01T00:00:00Z',
    updatedAt: '2024-01-31T17:45:00Z',
    createdBy: '1'
  }
];

// Helper function to generate random transactions
const generateTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const categories: TransactionCategory[] = ['material', 'salary', 'equipment', 'transport', 'utilities', 'rent', 'marketing', 'other'];
  
  // Generate income transactions (money added to projects)
  mockProjects.forEach(project => {
    project.assignedUsers.forEach(userId => {
      const incomeCount = Math.floor(Math.random() * 5) + 2; // 2-6 income transactions per user per project
      
      for (let i = 0; i < incomeCount; i++) {
        const date = new Date(project.startDate);
        date.setDate(date.getDate() + Math.floor(Math.random() * 60)); // Random date within 60 days of start
        
        transactions.push({
          id: `income_${project.id}_${userId}_${i}`,
          projectId: project.id,
          userId,
          type: 'income',
          amount: Math.floor(Math.random() * 50000) + 10000, // 10k-60k
          category: categories[Math.floor(Math.random() * categories.length)],
          description: `Vəsait əlavə edildi - ${categories[Math.floor(Math.random() * categories.length)]}`,
          date: date.toISOString(),
          createdAt: date.toISOString(),
          updatedAt: date.toISOString()
        });
      }
    });
  });
  
  // Generate expense transactions
  mockProjects.forEach(project => {
    project.assignedUsers.forEach(userId => {
      const expenseCount = Math.floor(Math.random() * 8) + 3; // 3-10 expense transactions per user per project
      
      for (let i = 0; i < expenseCount; i++) {
        const date = new Date(project.startDate);
        date.setDate(date.getDate() + Math.floor(Math.random() * 90)); // Random date within 90 days of start
        
        const category = categories[Math.floor(Math.random() * categories.length)];
        let amount = 0;
        let description = '';
        
        switch (category) {
          case 'material':
            amount = Math.floor(Math.random() * 15000) + 5000;
            description = 'Tikinti materialları alındı';
            break;
          case 'salary':
            amount = Math.floor(Math.random() * 8000) + 2000;
            description = 'İşçi maaşı ödəndi';
            break;
          case 'equipment':
            amount = Math.floor(Math.random() * 25000) + 10000;
            description = 'Texniki avadanlıq alındı';
            break;
          case 'transport':
            amount = Math.floor(Math.random() * 3000) + 500;
            description = 'Nəqliyyat xərci';
            break;
          case 'utilities':
            amount = Math.floor(Math.random() * 2000) + 300;
            description = 'Kommunal xidmətlər';
            break;
          case 'rent':
            amount = Math.floor(Math.random() * 5000) + 2000;
            description = 'Yer kirayəsi';
            break;
          case 'marketing':
            amount = Math.floor(Math.random() * 4000) + 1000;
            description = 'Marketinq xərci';
            break;
          default:
            amount = Math.floor(Math.random() * 5000) + 1000;
            description = 'Digər xərclər';
        }
        
        transactions.push({
          id: `expense_${project.id}_${userId}_${i}`,
          projectId: project.id,
          userId,
          type: 'expense',
          amount,
          category,
          description,
          date: date.toISOString(),
          createdAt: date.toISOString(),
          updatedAt: date.toISOString()
        });
      }
    });
  });
  
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Mock Transactions Data
export const mockTransactions = generateTransactions();

// Mock Categories Data
export const mockCategories: Category[] = [
  { id: 'cat_mat', name: 'Material', order: 1, type: 0, isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'cat_salary', name: 'Maaş', order: 2, type: 0, isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'cat_income', name: 'Satış Gəliri', order: 1, type: 1, isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }
];

// Mock Notifications Data
export const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    title: 'Yeni Xərc Əlavə Edildi',
    message: 'Məmməd Məmmədov "Yeni Bina Tikintisi" layihəsində 15,000 AZN xərc əlavə etdi.',
    type: 'info',
    isRead: false,
    createdAt: '2024-02-15T10:30:00Z'
  },
  {
    id: '2',
    userId: '1',
    title: 'Büdcə Xəbərdarlığı',
    message: '"Ofis Renovasiyası" layihəsinin qalıq büdcəsi 25,000 AZN-dir. Diqqətli olun!',
    type: 'warning',
    isRead: false,
    createdAt: '2024-02-15T09:15:00Z'
  },
  {
    id: '3',
    userId: '1',
    title: 'Layihə Tamamlandı',
    message: '"Park Təmir İşləri" layihəsi uğurla tamamlandı.',
    type: 'success',
    isRead: true,
    createdAt: '2024-01-31T17:45:00Z'
  },
  {
    id: '4',
    userId: '1',
    title: 'Yeni İstifadəçi',
    message: 'Leyla Rəhimova sistemə yeni menecer kimi əlavə edildi.',
    type: 'info',
    isRead: true,
    createdAt: '2024-01-05T12:00:00Z'
  }
];

// Calculate dashboard stats
export const getDashboardStats = (): DashboardStats => {
  const totalProjects = mockProjects.length;
  const activeProjects = mockProjects.filter(p => p.status === 'active').length;
  const totalUsers = mockUsers.filter(u => u.isActive).length;
  const totalBudget = mockProjects.reduce((sum, p) => sum + p.budget, 0);
  const totalExpenses = mockProjects.reduce((sum, p) => sum + p.totalExpenses, 0);
  const remainingBudget = totalBudget - totalExpenses;
  const recentTransactions = mockTransactions.slice(0, 10);
  
  const projectStats = mockProjects.map(project => ({
    projectId: project.id,
    projectName: project.name,
    budget: project.budget,
    expenses: project.totalExpenses,
    remaining: project.remainingBudget,
    transactionCount: mockTransactions.filter(t => t.projectId === project.id).length
  }));
  
  return {
    totalProjects,
    activeProjects,
    totalUsers,
    totalBudget,
    totalExpenses,
    remainingBudget,
    recentTransactions,
    projectStats
  };
};

// Helper functions for data manipulation
export const getProjectById = (id: string): Project | undefined => {
  return mockProjects.find(p => p.id === id);
};

export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(u => u.id === id);
};

export const getTransactionsByProject = (projectId: string): Transaction[] => {
  return mockTransactions.filter(t => t.projectId === projectId);
};

export const getTransactionsByUser = (userId: string): Transaction[] => {
  return mockTransactions.filter(t => t.userId === userId);
};

export const getUsersByProject = (projectId: string): User[] => {
  const project = getProjectById(projectId);
  if (!project) return [];
  
  return project.assignedUsers
    .map(userId => getUserById(userId))
    .filter((user): user is User => user !== undefined);
};

// Export all data
export const mockData = {
  users: mockUsers,
  projects: mockProjects,
  transactions: mockTransactions,
  notifications: mockNotifications,
  dashboardStats: getDashboardStats(),
  categories: mockCategories,
  companies: [
    { id: 'co1', title: 'TRD LLC', logoUrl: '', isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
    { id: 'co2', title: 'Qrup A', logoUrl: '', isActive: true, createdAt: '2024-02-01T00:00:00Z', updatedAt: '2024-02-01T00:00:00Z' }
  ]
};
