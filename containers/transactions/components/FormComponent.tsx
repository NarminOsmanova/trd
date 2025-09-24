"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DialogComponent from "@/components/modals/DialogComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  transactionFormSchema,
  type TransactionFormData,
} from "../constants/validations";
import { mockData } from "@/lib/mock-data";

interface FormComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionFormData) => void;
  title: string;
  initialData?: Partial<TransactionFormData>;
}

export default function FormComponent({
  isOpen,
  onClose,
  onSubmit,
  title,
  initialData,
}: FormComponentProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      projectId: "",
      type: "expense",
      category: "",
      amount: 0,
      description: "",
      date: new Date().toISOString().split("T")[0],
      currency: "AZN",
      ...initialData,
    },
  });

  // Local UI mode for income: 'income' (no category) | 'own' (with category)
  const [incomeMode, setIncomeMode] = React.useState<"income" | "own">(
    "income"
  );

  const handleFormSubmit = async (data: TransactionFormData) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleTypeChange = (value: string) => {
    setValue("type", value as TransactionFormData["type"]);
  };

  const handleProjectChange = (value: string) => {
    setValue("projectId", value);
  };

  const handleCategoryChange = (value: string) => {
    setValue("category", value);
  };

  const handleCurrencyChange = (value: string) => {
    setValue("currency", value as TransactionFormData["currency"]);
  };

  const handleSourceChange = (value: string) => {
    setValue("source", value as NonNullable<TransactionFormData["source"]>);
  };

  const handleToUserChange = (value: string) => {
    setValue("toUserId", value);
  };

  return (
    <DialogComponent
      open={isOpen}
      setOpen={(open) => !open && handleClose()}
      title={title}
      size="lg"
      maxHeight="max-h-[90vh]"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Type */}
          <div className="space-y-2">
            <Label>Əməliyyat Növü *</Label>
            <Select
              onValueChange={handleTypeChange}
              defaultValue={watch("type")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Növ seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Mədaxil</SelectItem>
                <SelectItem value="expense">Məxaric</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
                <SelectItem value="topup">Hesab artımı</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>
          {/* Income mode selector when type is income */}
          {watch("type") === "income" && (
            <div className="space-y-2">
              <Label>Mədaxil növü</Label>
              <Select
                onValueChange={(v) => setIncomeMode(v as "income" | "own")}
                defaultValue={incomeMode}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Gəlir</SelectItem>
                  <SelectItem value="own">Öz büdcəsi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {/* Project */}
          <div className="space-y-2">
            <Label>Layihə *</Label>
            <Select
              onValueChange={handleProjectChange}
              defaultValue={watch("projectId")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Layihə seçin" />
              </SelectTrigger>
              <SelectContent>
                {mockData.projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.projectId && (
              <p className="text-sm text-red-600">{errors.projectId.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category (hidden for transfer) */}
          {watch("type") !== "transfer" &&
            (watch("type") !== "income" || incomeMode === "own") && (
              <div className="space-y-2">
                <Label>Kateqoriya *</Label>
                <Select
                  onValueChange={handleCategoryChange}
                  defaultValue={watch("category")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kateqoriya seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="material">Material</SelectItem>
                    <SelectItem value="salary">Maaş</SelectItem>
                    <SelectItem value="equipment">Avadanlıq</SelectItem>
                    <SelectItem value="transport">Nəqliyyat</SelectItem>
                    <SelectItem value="utilities">Kommunal</SelectItem>
                    <SelectItem value="rent">Kirayə</SelectItem>
                    <SelectItem value="marketing">Marketinq</SelectItem>
                    <SelectItem value="other">Digər</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-600">
                    {errors.category.message}
                  </p>
                )}
              </div>
            )}

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Məbləğ *</Label>
            <Input
              {...register("amount", { valueAsNumber: true })}
              type="number"
              id="amount"
              step="0.01"
              min="0"
              placeholder="0.00"
            />
            {errors.amount && (
              <p className="text-sm text-red-600">{errors.amount.message}</p>
            )}
          </div>
        </div>

        {/* Currency & Source/Manager (side-by-side) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Valyuta</Label>
            <Select
              onValueChange={handleCurrencyChange}
              defaultValue={watch("currency")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Valyuta seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AZN">AZN</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {watch("type") === "topup" && (
            <div className="space-y-2">
              <Label>Hardan</Label>
              <Select
                onValueChange={handleSourceChange}
                defaultValue={watch("source")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Mənbə seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Company</SelectItem>
                  <SelectItem value="own">Öz vəsaiti</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Transfer target manager (user) */}
        {watch("type") === "transfer" && (
          <div className="space-y-2">
            <Label>Hara (Menecer)</Label>
            <Select
              onValueChange={handleToUserChange}
              defaultValue={watch("toUserId")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Menecer seçin" />
              </SelectTrigger>
              <SelectContent>
                {mockData.users
                  .filter((u) => u.role === "user")
                  .map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Receipt upload (required) */}
        <div className="space-y-2">
          <Label htmlFor="receipt">Qəbz şəkli </Label>
          <Input
            type="file"
            id="receipt"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () =>
                setValue("receiptUrl", reader.result as string);
              reader.readAsDataURL(file);
            }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Tarix *</Label>
            <Input {...register("date")} type="date" id="date" />
            {errors.date && (
              <p className="text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Təsvir (AZ , RU, EN)</Label>
            <Textarea
              {...register("description")}
              id="description"
              rows={3}
              placeholder="Əməliyyat haqqında ətraflı məlumat..."
            />
            {errors.description && (
              <p className="text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleClose}>
            Ləğv Et
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saxlanılır..." : "Saxla"}
          </Button>
        </div>
      </form>
    </DialogComponent>
  );
}
