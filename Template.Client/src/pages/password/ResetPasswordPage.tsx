import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input, PageHeader } from "solstice-ui";
import { useToast } from "@/hooks";
import { useGenericNavigationFunctions } from "@/utils";
import { ResetPasswordRequest } from "@/models";
import { useAppDispatch } from "@/store";
import {
  resetPasswordSchema,
  ResetPasswordFormData,
} from "@/validations/schemas";
import { Lock, Mail, Eye, EyeOff, Key } from "lucide-react";
import { resetPassword } from "@/store/slices/auth/authSlice";

function ResetPasswordPage() {
  const { showError, showSuccess } = useToast();
  const nav = useGenericNavigationFunctions();
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
      token: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get("email");
    const token = urlParams.get("token");

    if (email) {
      setValue("email", email);
    }
    if (token) {
      setValue("token", token);
    }
  }, [setValue]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setIsSubmitting(true);
      const request: ResetPasswordRequest = {
        email: data.email,
        token: data.token,
        newPassword: data.newPassword,
      };

      await dispatch(resetPassword(request)).unwrap();
      showSuccess(
        "Password Reset",
        "Your password has been reset successfully. You can now log in with your new password."
      );
      nav.goToLogin();
    } catch (e: unknown) {
      showError("Reset Password", e instanceof Error ? e.message : "Unable to process request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="auth-form-container">
        <PageHeader
          title={`Reset Password`}
          description={`Enter your email, reset token, and new password`}
        />

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Input
            id="email"
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            icon={Mail}
            readOnly
            disabled
            {...register("email")}
            error={errors.email?.message}
            required
          />

          <Input
            id="token"
            type="text"
            label="Confirmation Token"
            placeholder="Enter confirmation token from email"
            icon={Key}
            {...register("token")}
            readOnly
            disabled
            error={errors.token?.message}
            required
          />

          <div className="password-input">
            <Input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              label="New Password"
              placeholder="Enter your password"
              icon={Lock}
              {...register("newPassword")}
              error={errors.newPassword?.message}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle-btn"
              aria-label="Toggle password visibility"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="password-input">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              label="Confirm New Password"
              placeholder="Confirm your password"
              icon={Lock}
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="password-toggle-btn"
              aria-label="Toggle password visibility"
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <Button
            type="submit"
            className="form-button-full"
            loading={isSubmitting}
          >
            Reset Password
          </Button>
        </Form>

        <div className="form-footer">
          <p className="text-sm-secondary">
            Remember your password?{" "}
            <Button onClick={nav.goToLogin} variant="ghost">
              Sign in
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
