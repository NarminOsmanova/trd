import { useState, useMemo } from 'react';

export interface UsePaginationProps {
  data: any[];
  itemsPerPage?: number;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginationActions {
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  setItemsPerPage: (itemsPerPage: number) => void;
}

export interface UsePaginationReturn extends PaginationState, PaginationActions {
  paginatedData: any[];
  itemsPerPage: number;
}

export function usePagination({ 
  data, 
  itemsPerPage: initialItemsPerPage = 10 
}: UsePaginationProps): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const paginationState: PaginationState = useMemo(() => {
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    
    return {
      currentPage,
      totalPages,
      totalItems,
      startIndex,
      endIndex,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1
    };
  }, [data.length, currentPage, itemsPerPage]);

  const paginatedData = useMemo(() => {
    return data.slice(paginationState.startIndex, paginationState.endIndex);
  }, [data, paginationState.startIndex, paginationState.endIndex]);

  const actions: PaginationActions = {
    goToPage: (page: number) => {
      const validPage = Math.max(1, Math.min(page, paginationState.totalPages));
      setCurrentPage(validPage);
    },
    
    nextPage: () => {
      if (paginationState.hasNextPage) {
        setCurrentPage(prev => prev + 1);
      }
    },
    
    previousPage: () => {
      if (paginationState.hasPreviousPage) {
        setCurrentPage(prev => prev - 1);
      }
    },
    
    goToFirstPage: () => {
      setCurrentPage(1);
    },
    
    goToLastPage: () => {
      setCurrentPage(paginationState.totalPages);
    },
    
    setItemsPerPage: (newItemsPerPage: number) => {
      setItemsPerPage(newItemsPerPage);
      setCurrentPage(1); // Reset to first page when changing items per page
    }
  };

  return {
    ...paginationState,
    ...actions,
    paginatedData,
    itemsPerPage
  };
}
