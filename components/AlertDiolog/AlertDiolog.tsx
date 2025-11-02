import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { AlertTriangle, Info, CheckCircle2, XCircle } from "lucide-react";

interface AlertDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    title: string;
    description: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: 'danger' | 'warning' | 'info' | 'success';
}

const AlertDialogComponent: React.FC<AlertDialogProps> = ({ 
    open, 
    setOpen, 
    title, 
    description, 
    onConfirm, 
    onCancel,
    variant = 'warning'
}) => {
    const t = useTranslations("AlertDialog");

    const getVariantConfig = () => {
        switch (variant) {
            case 'danger':
                return {
                    icon: XCircle,
                    iconBgColor: 'bg-red-100',
                    iconColor: 'text-red-600',
                    borderColor: 'border-red-200',
                    buttonColor: 'bg-red-600 hover:bg-red-700',
                };
            case 'warning':
                return {
                    icon: AlertTriangle,
                    iconBgColor: 'bg-amber-100',
                    iconColor: 'text-amber-600',
                    borderColor: 'border-amber-200',
                    buttonColor: 'bg-amber-600 hover:bg-amber-700',
                };
            case 'info':
                return {
                    icon: Info,
                    iconBgColor: 'bg-blue-100',
                    iconColor: 'text-blue-600',
                    borderColor: 'border-blue-200',
                    buttonColor: 'bg-blue-600 hover:bg-blue-700',
                };
            case 'success':
                return {
                    icon: CheckCircle2,
                    iconBgColor: 'bg-green-100',
                    iconColor: 'text-green-600',
                    borderColor: 'border-green-200',
                    buttonColor: 'bg-green-600 hover:bg-green-700',
                };
            default:
                return {
                    icon: AlertTriangle,
                    iconBgColor: 'bg-amber-100',
                    iconColor: 'text-amber-600',
                    borderColor: 'border-amber-200',
                    buttonColor: 'bg-amber-600 hover:bg-amber-700',
                };
        }
    };

    const config = getVariantConfig();
    const Icon = config.icon;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md">
                <div className={`border-l-4 ${config.borderColor} pl-4`}>
                    <DialogHeader>
                        <div className="flex items-start space-x-4">
                            <div className={`${config.iconBgColor} p-3 rounded-full flex-shrink-0`}>
                                <Icon className={`w-6 h-6 ${config.iconColor}`} />
                            </div>
                            <div className="flex-1 pt-1">
                                <DialogTitle className="text-xl font-semibold text-gray-900 mb-2">
                                    {title}
                                </DialogTitle>
                                <DialogDescription className="text-base text-gray-600 leading-relaxed">
                                    {description}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                </div>
                <DialogFooter className="mt-6 flex gap-3">
                    <Button 
                        variant="outline" 
                        onClick={onCancel}
                        className="flex-1 border-gray-300 hover:bg-gray-50"
                    >
                        {t("cancel")}
                    </Button>
                    <Button 
                        onClick={onConfirm}
                        className={`flex-1 ${config.buttonColor} text-white`}
                    >
                        {t("confirm")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default AlertDialogComponent;