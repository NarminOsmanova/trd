"use client";

import React from "react";
import {
  Calendar,
  User,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Receipt,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { ApiDebt, DebtStatus } from "../types/debt-type";
import { formatDate, getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AlertDialogComponent from "@/components/AlertDiolog/AlertDiolog";
import { getStatusColor, getStatusCardColor, getStatusIcon, getStatusLabelKey, getCurrencySymbol } from "./debt-utils";

interface DebtCardsProps {
  debts: ApiDebt[];
  pagination: {
    pageNumber: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  } | null;
  filters: {
    search?: string;
    pageNumber?: number;
    pageSize?: number;
    status?: number;
  };
  onFiltersChange: (
    filters: Partial<{
      search?: string;
      pageNumber?: number;
      pageSize?: number;
      status?: number;
    }>
  ) => void;
  onViewDebt: (id: number) => void;
  onEditDebt: (debt: ApiDebt) => void;
  onDeleteDebt: (id: number) => void;
  onMarkAsPaid: (id: number) => void;
  onViewPayments?: (id: number) => void;
  onCreate: () => void;
  isLoading?: boolean;
}

export default function DebtCards({
  debts,
  pagination,
  filters,
  onFiltersChange,
  onViewDebt,
  onEditDebt,
  onDeleteDebt,
  onMarkAsPaid,
  onViewPayments,
  onCreate,
  isLoading,
}: DebtCardsProps) {
  const t = useTranslations("debt");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);

  const isOverdue = (dueDate: string) => {
    return (
      new Date(dueDate) < new Date() &&
      new Date(dueDate).toDateString() !== new Date().toDateString()
    );
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteId !== null) {
      onDeleteDebt(deleteId);
      setIsDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setDeleteId(null);
  };

  if (debts.length === 0 && !isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t("noDebtFound")}
          </h3>
          <p className="text-gray-600 mb-4">
            {filters.search ? t("noDebtFoundDesc") : t("noDebtYet")}
          </p>
          <Button onClick={onCreate}>
            <DollarSign className="w-5 h-5 mr-2" />
            {t("newDebt")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Debts Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">{t("loading")}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
          {debts.map((debt) => {
            const overdue = isOverdue(debt.dueDate);
            const daysUntilDue = getDaysUntilDue(debt.dueDate);

            return (
              <div
                key={debt.id}
                className={`bg-white rounded-xl shadow-sm border-2 p-3 md:p-4 lg:p-6 hover:shadow-md transition-all duration-200 ${getStatusCardColor(
                  debt.status
                )}`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3 md:mb-4">
                  <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0">
                    <div className="w-9 h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm md:text-base lg:text-lg">
                        {getInitials(debt.debtorName)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm md:text-base lg:text-lg font-semibold text-gray-900 truncate">
                        {debt.debtorName}
                      </h3>
                      {debt.description && (
                        <p className="text-xs md:text-sm text-gray-600 line-clamp-1 md:line-clamp-2 mt-0.5 md:mt-1">
                          {debt.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
                    <Badge
                      className={`${getStatusColor(
                        debt.status
                      )} flex items-center gap-1 border text-xs whitespace-nowrap px-1.5 py-0.5 md:px-2 md:py-1`}
                    >
                      {getStatusIcon(debt.status)}
                      <span className="hidden md:inline">
                        {t(getStatusLabelKey(debt.status))}
                      </span>
                    </Badge>
                  </div>
                </div>

                {/* Amount */}
                <div className="mb-2 md:mb-3 lg:mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs md:text-sm text-gray-600">
                      {t("amountLabel")}
                    </span>
                    <span className="text-base md:text-lg lg:text-xl font-bold text-gray-900">
                      {debt.amount} {getCurrencySymbol(debt.currency)}
                    </span>
                  </div>
                </div>

                {/* Due Date */}
                <div className="mb-2 md:mb-3 lg:mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 md:w-4 md:h-4 text-gray-400 mr-1 md:mr-2" />
                      <span className="text-xs md:text-sm text-gray-600">
                        {t("dueDateLabel")}
                      </span>
                    </div>
                    <div
                      className={`text-xs md:text-sm font-medium ${
                        overdue
                          ? "text-red-600"
                          : daysUntilDue <= 7
                          ? "text-orange-600"
                          : "text-gray-900"
                      }`}
                    >
                      {formatDate(debt.dueDate)}
                    </div>
                  </div>
                  {!overdue && debt.status === DebtStatus.Active && (
                    <div className="text-xs text-gray-500 mt-1 text-right">
                      {daysUntilDue > 0
                        ? `${daysUntilDue} ${t("daysRemaining")}`
                        : t("dueToday")}
                    </div>
                  )}
                </div>

                {/* Created Info */}
                <div className="mb-2 md:mb-3 lg:mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <User className="w-3 h-3 md:w-4 md:h-4 text-gray-400 mr-1 md:mr-2" />
                      <span className="text-xs md:text-sm text-gray-600">
                        {t("createdLabel")}
                      </span>
                    </div>
                    <span className="text-xs md:text-sm text-gray-900">
                      {formatDate(debt.createdDate)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2 md:pt-3 lg:pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-1 md:space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDebt(debt.id)}
                      className="cursor-pointer text-blue-600 border-blue-200 hover:bg-blue-50 text-xs px-1.5 py-1 md:px-2 md:py-1.5 lg:px-3 lg:py-2"
                      title={t("view")}
                    >
                      <Eye className="w-3 h-3 md:w-3.5 md:h-3.5" />
                      <span className="hidden lg:inline ml-1">{t("view")}</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditDebt(debt)}
                      className="cursor-pointer text-gray-600 border-gray-200 hover:bg-gray-50 text-xs px-1.5 py-1 md:px-2 md:py-1.5 lg:px-3 lg:py-2"
                      title={t("edit")}
                    >
                      <Edit className="w-3 h-3 md:w-3.5 md:h-3.5" />
                      <span className="hidden lg:inline ml-1">{t("edit")}</span>
                    </Button>
                  </div>
                  <div className="flex items-center space-x-1">
                    {debt.status === DebtStatus.Active && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onMarkAsPaid(debt.id)}
                        className="cursor-pointer text-green-600 border-green-200 hover:bg-green-50 p-1 md:p-1.5 lg:p-2"
                        title={t("addPayment")}
                      >
                        <DollarSign className="w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewPayments?.(debt.id)}
                      className="cursor-pointer text-purple-600 border-purple-200 hover:bg-purple-50 p-1 md:p-1.5 lg:p-2"
                      title={t("viewPayments")}
                    >
                      <Receipt className="w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(debt.id)}
                      className="cursor-pointer text-red-600 border-red-200 hover:bg-red-50 p-1 md:p-1.5 lg:p-2"
                      title={t("delete")}
                    >
                      <Trash2 className="w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                {pagination.totalCount > 0 && (
                  <span>
                    {(pagination.pageNumber - 1) * pagination.pageSize + 1}-
                    {Math.min(
                      pagination.pageNumber * pagination.pageSize,
                      pagination.totalCount
                    )}{" "}
                    / {pagination.totalCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onFiltersChange({ pageNumber: pagination.pageNumber - 1 })
                  }
                  disabled={!pagination.hasPreviousPage}
                >
                  {t("previousPage")}
                </Button>
                <span className="text-sm text-gray-600">
                  {t("page")} {pagination.pageNumber} / {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onFiltersChange({ pageNumber: pagination.pageNumber + 1 })
                  }
                  disabled={!pagination.hasNextPage}
                >
                  {t("nextPage")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialogComponent
        open={isDeleteDialogOpen}
        setOpen={setIsDeleteDialogOpen}
        title={t("deleteConfirm")}
        description={t("deleteDescription")}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        variant="danger"
      />
    </div>
  );
}
