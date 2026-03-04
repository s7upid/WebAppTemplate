import { Dialog, type DialogFooterAction } from "solstice-ui";

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info" | "success";
  isLoading?: boolean;
}

const variantToButtonVariant: Record<
  NonNullable<ConfirmationDialogProps["variant"]>,
  DialogFooterAction["variant"]
> = {
  danger: "danger",
  warning: "outline",
  info: "primary",
  success: "success",
};

function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm",
  message = "",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}: ConfirmationDialogProps) {
  const footerActions: DialogFooterAction[] = [
    { label: cancelText, onClick: onClose, variant: "secondary" },
    {
      label: confirmText,
      onClick: onConfirm,
      variant: variantToButtonVariant[variant],
      loading: isLoading,
    },
  ];

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footerActions={footerActions}
    >
      {message}
    </Dialog>
  );
}

export default ConfirmationDialog;
