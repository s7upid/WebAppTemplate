import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input, LoadingSpinner, PageHeader } from "@/components";
import { useToast } from "@/hooks";
import { useGenericNavigationFunctions, SecureStorage } from "@/utils";
import { useAppDispatch } from "@/store";
import { confirmEmail, clearAuth } from "@/store/slices/auth/authSlice";
import {
  confirmEmailSchema,
  ConfirmEmailFormData,
} from "@/validations/schemas";
import { Mail, Lock, Eye, EyeOff, Key } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { APP_PATHS } from "@/config/constants";

const ConfirmEmailPage: React.FC = () => {
  const { showError, showSuccess } = useToast();
  const nav = useGenericNavigationFunctions();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ConfirmEmailFormData>({
    resolver: zodResolver(confirmEmailSchema),
    defaultValues: {
      email: "",
      token: "",
      password: "",
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

  const onSubmit = async (data: ConfirmEmailFormData) => {
    try {
      setIsSubmitting(true);
      const request = {
        email: data.email,
        token: data.token,
        password: data.password,
      };

      await dispatch(confirmEmail(request)).unwrap();
      showSuccess(
        "Account Setup Complete",
        "Your email has been confirmed and password has been set. Redirecting to login..."
      );

      SecureStorage.clear();
      dispatch(clearAuth());
      navigate(APP_PATHS.LOGIN, { replace: true });
    } catch (e: any) {
      showError("Setup Failed", e || "Unable to complete setup.");
      SecureStorage.clear();
      dispatch(clearAuth());
      navigate(APP_PATHS.LOGIN, { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="auth-form-container">
        <PageHeader
          title={`Setup Your Account`}
          description={`Confirm your email and set your password to complete account setup`}
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
              id="password"
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="Enter your password"
              icon={Lock}
              {...register("password")}
              error={errors.password?.message}
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
              label="Confirm Password"
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
            disabled={isSubmitting}
          >
            {isSubmitting ? <LoadingSpinner size="sm" /> : "Complete Setup"}
          </Button>
        </Form>

        <div className="form-footer">
          <p className="text-sm-secondary">
            Already have an account?{" "}
            <Button onClick={nav.goToLogin} variant="ghost">
              Sign in
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmailPage;
