"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface DialogComponentProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  showCloseButton?: boolean;
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
  maxHeight?: string;
  onClose?: () => void;
  footer?: React.ReactNode;
  showFooter?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

const sizeClasses = {
  sm: 'max-w-[400px]',
  md: 'max-w-[600px]',
  lg: 'max-w-[800px]',
  xl: 'max-w-[1200px]',
  '2xl': 'max-w-[1400px]',
  '3xl': 'max-w-[1600px]',
  '4xl': 'max-w-[1800px]',
  '5xl': 'max-w-[2000px]',
  '6xl': 'max-w-[2400px]',
  '7xl': 'max-w-[2800px]',
  full: 'max-w-[96vw]'
};

const DialogComponent: React.FC<DialogComponentProps> = ({
  open,
  setOpen,
  title,
  children,
  size = 'full',
  className,
  headerClassName,
  contentClassName,
  showCloseButton = true,
  closeOnOutsideClick = true,
  closeOnEscape = true,
  maxHeight = 'max-h-[90vh]',
  onClose,
  footer,
  showFooter = false,
  loading = false,
  disabled = false,
}) => {
  const t = useTranslations();
  const handleOpenChange = (newOpen: boolean) => {
    if (disabled || loading) return;
    
    setOpen(newOpen);
    if (!newOpen && onClose) {
      onClose();
    }
  };

  const handleClose = () => {
    if (disabled || loading) return;
    setOpen(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={handleOpenChange}
      modal={true}
    >
      <DialogContent
        className={cn(
          "p-0 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700",
          sizeClasses[size],
          maxHeight,
          loading && "pointer-events-none",
          className
        )}
        onPointerDownOutside={(e) => {
          if (!closeOnOutsideClick || disabled || loading) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (!closeOnEscape || disabled || loading) {
            e.preventDefault();
          }
        }}
      >
        <div className="relative flex flex-col h-full">
          {/* Header */}
          <DialogHeader className={cn(
            "px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-xl",
            headerClassName
          )}>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                {title}
              </DialogTitle>
              
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  disabled={disabled || loading}
                  className="h-8 w-8 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">{t('common.close')}</span>
                </Button>
              )}
            </div>
          </DialogHeader>

          {/* Content */}
          <div className={cn(
            "flex-1 overflow-y-auto",
            "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600",
            "hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500",
            contentClassName
          )}>
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
                  </div>
                </div>
              ) : (
                children
              )}
            </div>
          </div>

          {/* Footer */}
          {(showFooter || footer) && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-b-xl">
              {footer}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogComponent;
