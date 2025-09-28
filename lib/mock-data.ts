import { 
  User, 
  Project, 
  Transaction, 
  Notification, 
  DashboardStats,
  TransactionCategory,
  Category
} from '@/types';
import { Debt } from '@/containers/debt/types/debt-type';

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

// Mock Debts Data
export const mockDebts: Debt[] = [
  {
    id: '1',
    amount: 5000,
    currency: 'AZN',
    debtor: 'Əli Məmmədov',
    description: 'Tikinti materialları üçün borc',
    dueDate: '2024-03-15T00:00:00Z',
    status: 'active',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    createdBy: '1',
    payments: [
      {
        id: 'p1',
        amount: 2000,
        paymentDate: '2024-02-01T00:00:00Z',
        description: 'İlk ödəniş',
        createdBy: '1'
      },
      {
        id: 'p2',
        amount: 1500,
        paymentDate: '2024-02-15T00:00:00Z',
        description: 'İkinci ödəniş',
        createdBy: '2'
      }
    ]
  },
  {
    id: '2',
    amount: 2500,
    currency: 'USD',
    debtor: 'Ayşə Əliyeva',
    description: 'Avadanlıq alışı üçün borc',
    dueDate: '2024-02-28T00:00:00Z',
    status: 'paid',
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-02-28T00:00:00Z',
    createdBy: '2',
    payments: [
      {
        id: 'p3',
        amount: 1000,
        paymentDate: '2024-02-10T00:00:00Z',
        description: 'Avadanlıq üçün ilk ödəniş',
        createdBy: '2'
      },
      {
        id: 'p4',
        amount: 1000,
        paymentDate: '2024-02-20T00:00:00Z',
        description: 'Avadanlıq üçün ikinci ödəniş',
        createdBy: '1'
      },
      {
        id: 'p5',
        amount: 500,
        paymentDate: '2024-02-25T00:00:00Z',
        description: 'Son ödəniş',
        createdBy: '2'
      }
    ]
  },
  {
    id: '3',
    amount: 15000,
    currency: 'AZN',
    debtor: 'Məmməd Həsənov',
    description: 'Nəqliyyat xidmətləri üçün borc',
    dueDate: '2024-01-31T00:00:00Z',
    status: 'overdue',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
    createdBy: '3',
    payments: [
      {
        id: 'p6',
        amount: 5000,
        paymentDate: '2024-01-20T00:00:00Z',
        description: 'Nəqliyyat üçün ilk ödəniş',
        createdBy: '3'
      }
    ]
  },
  {
    id: '4',
    amount: 8000,
    currency: 'EUR',
    debtor: 'Fatma Quliyeva',
    description: 'Marketinq kampaniyası üçün borc',
    dueDate: '2024-04-10T00:00:00Z',
    status: 'active',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
    createdBy: '1'
  }
];

// Project Account Balances (separate from budget)
export const projectAccountBalances: Record<string, number> = {
  '1': 0, // Yeni Bina Tikintisi - starts with 0
  '2': 0, // Ofis Renovasiyası - starts with 0  
  '3': 0, // Yol Tikintisi - starts with 0
  '4': 0  // Park Təmir İşləri - starts with 0
};

// Helper function to generate realistic transactions with account balance logic
const generateTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  // const categories: TransactionCategory[] = ['material', 'salary', 'equipment', 'transport', 'utilities', 'rent', 'marketing', 'other'];
  
  // Create realistic transaction scenarios for each project
  const transactionScenarios = [
    // Project 1: Yeni Bina Tikintisi
    {
      projectId: '1',
      transactions: [
        { type: 'income', amount: 50000, description: 'İlkin vəsait', date: '2024-01-15', user: '2' },
        { type: 'expense', amount: 15000, description: 'Tikinti materialları alındı', date: '2024-01-20', user: '2', category: 'material' },
        { type: 'income', amount: 30000, description: 'Əlavə vəsait', date: '2024-02-01', user: '3' },
        { type: 'expense', amount: 8000, description: 'İşçi maaşı ödəndi', date: '2024-02-05', user: '3', category: 'salary' },
        { type: 'expense', amount: 12000, description: 'Texniki avadanlıq alındı', date: '2024-02-10', user: '4', category: 'equipment' },
        { type: 'income', amount: 40000, description: 'Maliyyə dəstəyi', date: '2024-02-15', user: '2' },
        { type: 'expense', amount: 5000, description: 'Nəqliyyat xərci', date: '2024-02-20', user: '3', category: 'transport' }
      ]
    },
    // Project 2: Ofis Renovasiyası  
    {
      projectId: '2',
      transactions: [
        { type: 'income', amount: 25000, description: 'İlkin vəsait', date: '2024-02-01', user: '3' },
        { type: 'expense', amount: 8000, description: 'Marketinq xərci', date: '2024-02-05', user: '3', category: 'marketing' },
        { type: 'expense', amount: 5000, description: 'Digər xərclər', date: '2024-02-08', user: '5', category: 'other' },
        { type: 'income', amount: 20000, description: 'Əlavə vəsait', date: '2024-02-10', user: '5' },
        { type: 'expense', amount: 12000, description: 'İşçi maaşı ödəndi', date: '2024-02-12', user: '3', category: 'salary' },
        { type: 'expense', amount: 15000, description: 'Tikinti materialları alındı', date: '2024-02-15', user: '5', category: 'material' }
      ]
    },
    // Project 3: Yol Tikintisi
    {
      projectId: '3',
      transactions: [
        { type: 'income', amount: 100000, description: 'İlkin vəsait', date: '2024-01-01', user: '2' },
        { type: 'expense', amount: 25000, description: 'Texniki avadanlıq alındı', date: '2024-01-05', user: '2', category: 'equipment' },
        { type: 'income', amount: 80000, description: 'Maliyyə dəstəyi', date: '2024-01-10', user: '4' },
        { type: 'expense', amount: 30000, description: 'Tikinti materialları alındı', date: '2024-01-15', user: '4', category: 'material' },
        { type: 'expense', amount: 15000, description: 'İşçi maaşı ödəndi', date: '2024-01-20', user: '5', category: 'salary' },
        { type: 'income', amount: 50000, description: 'Əlavə vəsait', date: '2024-02-01', user: '2' },
        { type: 'expense', amount: 20000, description: 'Kommunal xidmətlər', date: '2024-02-05', user: '5', category: 'utilities' }
      ]
    },
    // Project 4: Park Təmir İşləri
    {
      projectId: '4',
      transactions: [
        { type: 'income', amount: 20000, description: 'İlkin vəsait', date: '2023-11-01', user: '3' },
        { type: 'expense', amount: 8000, description: 'Tikinti materialları alındı', date: '2023-11-05', user: '3', category: 'material' },
        { type: 'income', amount: 15000, description: 'Əlavə vəsait', date: '2023-11-10', user: '4' },
        { type: 'expense', amount: 5000, description: 'İşçi maaşı ödəndi', date: '2023-11-15', user: '4', category: 'salary' },
        { type: 'expense', amount: 3000, description: 'Nəqliyyat xərci', date: '2023-11-20', user: '3', category: 'transport' },
        { type: 'income', amount: 10000, description: 'Son vəsait', date: '2023-12-01', user: '4' },
        { type: 'expense', amount: 12000, description: 'Texniki avadanlıq alındı', date: '2023-12-05', user: '4', category: 'equipment' }
      ]
    }
  ];

  // Generate transactions from scenarios
  transactionScenarios.forEach(scenario => {
    scenario.transactions.forEach((tx, index) => {
      const date = new Date(tx.date);
      transactions.push({
        id: `${tx.type}_${scenario.projectId}_${index}`,
        projectId: scenario.projectId,
        userId: tx.user,
        type: tx.type as 'income' | 'expense',
        amount: tx.amount,
        category: (tx.category || 'other') as TransactionCategory,
        description: tx.description,
        date: date.toISOString(),
        createdAt: date.toISOString(),
        updatedAt: date.toISOString()
      });
    });
  });

  // Add company-related transactions
  const companyTransactions = [
    // TRD LLC transactions
    { type: 'income', amount: 100000, description: 'TRD LLC-dən mədaxil', date: '2024-01-15', companyId: 'co1', user: '1' },
    { type: 'expense', amount: 25000, description: 'TRD LLC üçün xərc', date: '2024-01-20', companyId: 'co1', user: '2', category: 'equipment' },
    { type: 'income', amount: 75000, description: 'TRD LLC əlavə mədaxil', date: '2024-02-01', companyId: 'co1', user: '1' },
    { type: 'expense', amount: 15000, description: 'TRD LLC marketinq xərci', date: '2024-02-05', companyId: 'co1', user: '3', category: 'marketing' },
    
    // Qrup A transactions
    { type: 'income', amount: 80000, description: 'Qrup A-dan mədaxil', date: '2024-02-10', companyId: 'co2', user: '2' },
    { type: 'expense', amount: 20000, description: 'Qrup A üçün xərc', date: '2024-02-15', companyId: 'co2', user: '4', category: 'material' },
    { type: 'income', amount: 50000, description: 'Qrup A əlavə mədaxil', date: '2024-02-20', companyId: 'co2', user: '2' },
    { type: 'expense', amount: 12000, description: 'Qrup A nəqliyyat xərci', date: '2024-02-25', companyId: 'co2', user: '5', category: 'transport' }
  ];

  companyTransactions.forEach((tx, index) => {
    const date = new Date(tx.date);
    transactions.push({
      id: `company_${tx.type}_${tx.companyId}_${index}`,
      projectId: '1', // Assign company transactions to main project
      userId: tx.user,
      type: tx.type as 'income' | 'expense',
      amount: tx.amount,
      category: (tx.category || 'other') as TransactionCategory,
      description: tx.description,
      companyId: tx.companyId,
      date: date.toISOString(),
      createdAt: date.toISOString(),
      updatedAt: date.toISOString()
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

// Calculate project account balance (running balance from transactions)
export const getProjectAccountBalance = (projectId: string): number => {
  const projectTransactions = getTransactionsByProject(projectId);
  let balance = 0;
  
  // Sort transactions by date to calculate running balance
  const sortedTransactions = projectTransactions.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  sortedTransactions.forEach(transaction => {
    if (transaction.type === 'income') {
      balance += transaction.amount;
    } else if (transaction.type === 'expense') {
      balance -= transaction.amount;
    }
  });
  
  return balance;
};

// Get transactions with running balance for a project
export const getTransactionsWithBalance = (projectId: string): Array<Transaction & { runningBalance: number }> => {
  const projectTransactions = getTransactionsByProject(projectId);
  let runningBalance = 0;
  
  // Sort transactions by date to calculate running balance
  const sortedTransactions = projectTransactions.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  return sortedTransactions.map(transaction => {
    if (transaction.type === 'income') {
      runningBalance += transaction.amount;
    } else if (transaction.type === 'expense') {
      runningBalance -= transaction.amount;
    }
    
    return {
      ...transaction,
      runningBalance
    };
  }).reverse(); // Return in reverse order (newest first)
};

// Get company by ID
export const getCompanyById = (id: string) => {
  return mockData.companies.find(c => c.id === id);
};

// Get transactions by company
export const getTransactionsByCompany = (companyId: string): Transaction[] => {
  return mockTransactions.filter(t => t.companyId === companyId);
};

// Calculate company account balance
export const getCompanyAccountBalance = (companyId: string): number => {
  const companyTransactions = getTransactionsByCompany(companyId);
  let balance = 0;
  
  // Sort transactions by date to calculate running balance
  const sortedTransactions = companyTransactions.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  sortedTransactions.forEach(transaction => {
    if (transaction.type === 'income') {
      balance += transaction.amount;
    } else if (transaction.type === 'expense') {
      balance -= transaction.amount;
    }
  });
  
  return balance;
};

// Get transactions with running balance for a company
export const getCompanyTransactionsWithBalance = (companyId: string): Array<Transaction & { runningBalance: number }> => {
  const companyTransactions = getTransactionsByCompany(companyId);
  let runningBalance = 0;
  
  // Sort transactions by date to calculate running balance
  const sortedTransactions = companyTransactions.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  return sortedTransactions.map(transaction => {
    if (transaction.type === 'income') {
      runningBalance += transaction.amount;
    } else if (transaction.type === 'expense') {
      runningBalance -= transaction.amount;
    }
    
    return {
      ...transaction,
      runningBalance
    };
  }).reverse(); // Return in reverse order (newest first)
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
    { id: 'co1', title: 'TRD LLC', logoUrl: '', isActive: true, budgetLimit: 500000, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
    { id: 'co2', title: 'Qrup A', logoUrl: '', isActive: true, budgetLimit: 300000, createdAt: '2024-02-01T00:00:00Z', updatedAt: '2024-02-01T00:00:00Z' }
  ],
  debts: mockDebts
};
