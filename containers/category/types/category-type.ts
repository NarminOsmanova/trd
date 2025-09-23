export type CategoryType = 0 | 1; // 0: expense, 1: income

export interface CategoryItem {
  id: string;
  name: string;
  order: number;
  type: CategoryType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}


