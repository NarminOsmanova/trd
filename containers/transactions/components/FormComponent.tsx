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
      customCategory: "",
      amount: 0,
      description: "",
      date: new Date().toISOString().split("T")[0],
      currency: "AZN",
      topupType: undefined,
      topupTarget: "",
      refundCompany: "",
      ...initialData,
    },
  });

  // Local UI mode for income: 'income' (no category) | 'own' (with category) | 'other' (company balance)
  const [incomeMode, setIncomeMode] = React.useState<"income" | "own" | "other">(
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

  const handleTopupTypeChange = (value: string) => {
    setValue("topupType", value as "project" | "company");
  };

  const handleTopupTargetChange = (value: string) => {
    setValue("topupTarget", value);
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
        {/* Transaction Type - full width for expense, 2 columns for others */}
        {watch("type") === "expense" ? (
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
                <SelectItem value="refund">Geri qaytarma</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>
        ) : (
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
                  <SelectItem value="refund">Geri qaytarma</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-600">{errors.type.message}</p>
              )}
            </div>

            {/* Dynamic second field based on transaction type */}
            {watch("type") === "income" && (
              <div className="space-y-2">
                <Label>Mədaxil növü</Label>
                <Select
                  onValueChange={(v) => setIncomeMode(v as "income" | "own" | "other")}
                  defaultValue={incomeMode}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Lahiyədən gələn gəlir</SelectItem>
                    <SelectItem value="own">Öz büdcəsindən</SelectItem>
                    <SelectItem value="other">Şirkət balans artımı</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {watch("type") === "topup" && (
              <div className="space-y-2">
                <Label>Hesab Mərkəzi</Label>
                <Select
                  onValueChange={handleTopupTypeChange}
                  defaultValue={watch("topupType")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Mərkəz seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="project">Layihə</SelectItem>
                    <SelectItem value="company">Şirkət</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {watch("type") === "refund" && (
              <div className="space-y-2">
                <Label>Şirkət *</Label>
                <Select
                  onValueChange={(value) => setValue("refundCompany", value)}
                  defaultValue={watch("refundCompany")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Şirkət seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockData.companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

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
          </div>
        )}

        {/* Dynamic second row - conditional fields */}
        {(watch("type") === "topup" && watch("topupType")) || 
         (watch("type") !== "transfer" && watch("type") !== "refund") ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Project/Company field for income/expense */}
            {(watch("type") === "expense" || watch("type") === "income") && (
              <div className="space-y-2">
                <Label>
                  {watch("type") === "income" && incomeMode === "other" ? "Şirkət *" : "Layihə *"}
                </Label>
                <Select
                  onValueChange={watch("type") === "income" && incomeMode === "other" ? 
                    (value) => setValue("source", "own") : handleProjectChange}
                  defaultValue={watch("type") === "income" && incomeMode === "other" ? 
                    watch("source") : watch("projectId")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      watch("type") === "income" && incomeMode === "other" ? 
                        "Şirkət seçin" : "Layihə seçin"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {watch("type") === "income" && incomeMode === "other" ? (
                      mockData.companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.title}
                        </SelectItem>
                      ))
                    ) : (
                      mockData.projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.projectId && (
                  <p className="text-sm text-red-600">{errors.projectId.message}</p>
                )}
              </div>
            )}

            {/* Second level selection for topup */}
            {watch("type") === "topup" && watch("topupType") && (
              <div className="space-y-2">
                <Label>
                  {watch("topupType") === "project" ? "Layihə" : "Şirkət"} *
                </Label>
                <Select
                  onValueChange={handleTopupTargetChange}
                  defaultValue={watch("topupTarget")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`${watch("topupType") === "project" ? "Layihə" : "Şirkət"} seçin`} />
                  </SelectTrigger>
                  <SelectContent>
                    {watch("topupType") === "project" ? (
                      mockData.projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))
                    ) : (
                      mockData.companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.title}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Category for income/expense (but not for transfer and refund) */}
            {watch("type") !== "transfer" && watch("type") !== "refund" && (
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

            {/* Custom description field when "other" category is selected */}
            {watch("category") === "other" && (
              <div className="space-y-2">
                <Label>Kateqoriya təsviri *</Label>
                <Input
                  {...register("customCategory")}
                  placeholder="Kateqoriyanı təsvir edin..."
                />
                {errors.customCategory && (
                  <p className="text-sm text-red-600">
                    {errors.customCategory.message}
                  </p>
                )}
              </div>
            )}
          </div>
        ) : null}

        {/* Amount and Currency row - always present */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* Currency */}
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
        </div>

        {/* Receipt upload - always present */}
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

        {/* Date and Description row - always present */}
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
