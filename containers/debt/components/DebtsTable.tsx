"use client";

import React from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  DollarSign,
  Receipt,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { ApiDebt, DebtStatus } from "../types/debt-type";
import { formatDate, getInitials } from "@/lib/utils";
import { getStatusColor, getStatusIcon, getStatusLabelKey, getCurrencySymbol } from "./debt-utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AlertDialogComponent from "@/components/AlertDiolog/AlertDiolog";

interface DebtsTableProps {
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

export default function DebtsTable({
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
}: DebtsTableProps) {
  const t = useTranslations("debt");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);

  const isOverdue = (dueDate: string) => {
    return (
      new Date(dueDate) < new Date() &&
      new Date(dueDate).toDateString() !== new Date().toDateString()
    );
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
            <Plus className="w-5 h-5 mr-2" />
            {t("newDebt")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Debts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("debtor")}</TableHead>
              <TableHead>{t("amount")}</TableHead>
              <TableHead>{t("dueDate")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead>{t("createdAt")}</TableHead>
              <TableHead className="text-right">{t("operations")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">{t("loading")}</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              debts.map((debt) => {
                const overdue = isOverdue(debt.dueDate);

                return (
                  <TableRow key={debt.id} className="hover:bg-gray-50">
                    {/* Debtor */}
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-xs font-medium text-gray-600">
                            {getInitials(debt.debtorName)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {debt.debtorName}
                          </p>
                          {debt.description && (
                            <p className="text-xs text-gray-500 truncate max-w-48">
                              {debt.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Amount */}
                    <TableCell>
                      <div className="text-sm font-semibold text-gray-900">
                        {debt.amount} {getCurrencySymbol(debt.currency)}
                      </div>
                    </TableCell>

                    {/* Due Date */}
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <div
                          className={`text-sm ${
                            overdue
                              ? "text-red-600 font-medium"
                              : "text-gray-900"
                          }`}
                        >
                          {formatDate(debt.dueDate)}
                        </div>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge
                        className={`${getStatusColor(
                          debt.status
                        )} flex items-center gap-1 border`}
                      >
                        {getStatusIcon(debt.status)}
                        {t(getStatusLabelKey(debt.status))}
                      </Badge>
                    </TableCell>

                    {/* Created At */}
                    <TableCell>
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          {formatDate(debt.createdDate)}
                        </div>
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewDebt(debt.id)}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50 cursor-pointer"
                          title={t("view")}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditDebt(debt)}
                          className="text-green-600 border-green-200 hover:bg-green-50 cursor-pointer"
                          title={t("edit")}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {debt.status === DebtStatus.Active && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onMarkAsPaid(debt.id)}
                            title={t("addPayment")}
                            className="text-purple-600 border-purple-200 hover:bg-purple-50 cursor-pointer"
                          >
                            <DollarSign className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewPayments?.(debt.id)}
                          title={t("viewPayments")}
                          className="text-purple-600 border-orange-200 hover:bg-orange-50 cursor-pointer"
                        >
                          <Receipt className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(debt.id)}
                          title={t("delete")}
                          className="text-red-600 border-red-200 hover:bg-red-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

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
