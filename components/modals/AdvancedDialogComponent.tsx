"use client";

import React, { useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AdvancedDialogComponentProps {
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
  // Advanced features
  animation?: 'fade' | 'slide' | 'zoom' | 'none';
  backdrop?: 'blur' | 'dark' | 'transparent';
  position?: 'center' | 'top' | 'bottom';
  fullscreen?: boolean;
  draggable?: boolean;
  resizable?: boolean;
  // Custom header
  customHeader?: React.ReactNode;
  showHeader?: boolean;
  // Custom footer
  customFooter?: React.ReactNode;
  // Actions
  actions?: {
    primary?: {
      label: string;
      onClick: () => void;
      disabled?: boolean;
      loading?: boolean;
      variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    };
    secondary?: {
      label: string;
      onClick: () => void;
      disabled?: boolean;
      loading?: boolean;
      variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    };
  };
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
  full: 'max-w-[95vw] max-h-[95vh]',
};

const animationClasses = {
  fade: 'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
  slide: 'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
  zoom: 'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
  none: '',
};

const backdropClasses = {
  blur: 'backdrop-blur-sm',
  dark: 'bg-black/80',
  transparent: 'bg-transparent',
};

const positionClasses = {
  center: 'left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]',
  top: 'left-[50%] top-[10%] translate-x-[-50%] translate-y-0',
  bottom: 'left-[50%] bottom-[10%] translate-x-[-50%] translate-y-0',
};

const AdvancedDialogComponent: React.FC<AdvancedDialogComponentProps> = ({
  open,
  setOpen,
  title,
  children,
  size = 'xl',
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
  animation = 'zoom',
  backdrop = 'dark',
  position = 'center',
  fullscreen = false,
  draggable = false,
  resizable = false,
  customHeader,
  showHeader = true,
  customFooter,
  actions,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

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

  const handlePrimaryAction = () => {
    if (actions?.primary && !actions.primary.disabled && !actions.primary.loading) {
      actions.primary.onClick();
    }
  };

  const handleSecondaryAction = () => {
    if (actions?.secondary && !actions.secondary.disabled && !actions.secondary.loading) {
      actions.secondary.onClick();
    }
  };

  // Auto-focus management
  useEffect(() => {
    if (open && dialogRef.current) {
      const focusableElements = dialogRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      if (firstElement) {
        firstElement.focus();
      }
    }
  }, [open]);

  const dialogSize = fullscreen ? 'full' : size;
  const isFullscreen = fullscreen || size === 'full';

  return (
    <Dialog 
      open={open} 
      onOpenChange={handleOpenChange}
      modal={true}
    >
      <DialogContent
        ref={dialogRef}
        className={cn(
          "p-0 overflow-hidden bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700",
          sizeClasses[dialogSize],
          !isFullscreen && maxHeight,
          animationClasses[animation],
          positionClasses[position],
          backdropClasses[backdrop],
          loading && "pointer-events-none",
          draggable && "cursor-move",
          resizable && "resize",
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
          {/* Custom Header */}
          {customHeader && (
            <div className={cn(
              "px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-xl",
              headerClassName
            )}>
              {customHeader}
            </div>
          )}

          {/* Default Header */}
          {showHeader && !customHeader && (
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
                    <span className="sr-only">Bağla</span>
                  </Button>
                )}
              </div>
            </DialogHeader>
          )}

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
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <p className="text-gray-600 dark:text-gray-400">Yüklənir...</p>
                  </div>
                </div>
              ) : (
                children
              )}
            </div>
          </div>

          {/* Custom Footer */}
          {customFooter && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-b-xl">
              {customFooter}
            </div>
          )}

          {/* Default Footer with Actions */}
          {(showFooter || actions) && !customFooter && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-b-xl">
              <div className="flex items-center justify-end space-x-3">
                {actions?.secondary && (
                  <Button
                    variant={actions.secondary.variant || 'outline'}
                    onClick={handleSecondaryAction}
                    disabled={actions.secondary.disabled || loading}
                    className="min-w-[80px]"
                  >
                    {actions.secondary.loading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : null}
                    {actions.secondary.label}
                  </Button>
                )}
                
                {actions?.primary && (
                  <Button
                    variant={actions.primary.variant || 'default'}
                    onClick={handlePrimaryAction}
                    disabled={actions.primary.disabled || loading}
                    className="min-w-[80px]"
                  >
                    {actions.primary.loading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : null}
                    {actions.primary.label}
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Default Footer */}
          {showFooter && !actions && !customFooter && footer && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-b-xl">
              {footer}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedDialogComponent;
