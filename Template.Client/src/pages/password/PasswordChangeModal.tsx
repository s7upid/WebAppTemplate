import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Dialog } from "@/components";
import { useAuth, useToast } from "@/hooks";
import { Lock, Eye, EyeOff, XCircle, Save } from "lucide-react";
import { ChangePasswordRequest } from "@/models";
import {
  passwordChangeSchema,
  PasswordChangeFormData,
} from "@/validations/schemas";

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { changePassword } = useAuth();
  const { showSuccess, showError } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: PasswordChangeFormData) => {
    setIsSubmitting(true);

    try {
      const request: ChangePasswordRequest = {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      };

      const result = await changePassword(request);
      // Redux async thunks use meta.requestStatus
      if (result?.meta?.requestStatus === "fulfilled") {
        showSuccess(
          "Password Changed",
          "Your password has been changed successfully!"
        );
        setTimeout(() => {
          onClose();
          reset();
        }, 2000);
      } else {
        const errorMessage =
          (result as any)?.payload || "Failed to change password";
        showError("Password Change Failed", errorMessage);
      }
    } catch (err) {
      showError(
        "Password Change Failed",
        "An error occurred while changing password"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title="Change Password"
      size="md"
    >
      <div className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            {...register("currentPassword")}
            type={showCurrentPassword ? "text" : "password"}
            label="Current Password"
            icon={Lock}
            placeholder="Enter your current password"
            error={errors.currentPassword?.message}
            required
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="password-toggle-btn"
          >
            {showCurrentPassword ? (
              <EyeOff className="picon-size" />
            ) : (
              <Eye className="picon-size" />
            )}
          </button>

          <div className="password-input">
            <Input
              {...register("newPassword")}
              type={showNewPassword ? "text" : "password"}
              label="New Password"
              icon={Lock}
              placeholder="Enter your new password"
              error={errors.newPassword?.message}
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="password-toggle-btn"
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="password-input">
            <Input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              label="Confirm New Password"
              icon={Lock}
              placeholder="Confirm your new password"
              error={errors.confirmPassword?.message}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="password-toggle-btn"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="password-requirements-container">
            <h4 className="input-label">Password Requirements:</h4>
            <ul className="password-requirements-list">
              <li>• At least 8 characters long</li>
              <li>• Contains at least one lowercase letter</li>
              <li>• Contains at least one uppercase letter</li>
              <li>• Contains at least one number</li>
            </ul>
          </div>

          <div className="modal-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isSubmitting}
              icon={XCircle}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
              disabled={!isDirty}
              icon={Save}
            >
              Change Password
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
};

export default PasswordChangeModal;
