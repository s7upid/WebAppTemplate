import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input, LoadingSpinner, PageHeader } from "@/components";
import { useAuth } from "@/hooks";
import { useToast } from "@/hooks";
import { useGenericNavigationFunctions } from "@/utils";
import { ForgotPasswordRequest } from "@/models";
import {
  forgotPasswordSchema,
  ForgotPasswordFormData,
} from "@/validations/schemas";

const ForgotPasswordPage: React.FC = () => {
  const { showError, showSuccess } = useToast();
  const nav = useGenericNavigationFunctions();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { forgotPassword } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async ({ email }: ForgotPasswordFormData) => {
    try {
      setIsSubmitting(true);
      const request: ForgotPasswordRequest = { email };
      const result = await forgotPassword(request);

      if (result.type.endsWith("fulfilled")) {
        showSuccess("Email Sent", "Check your inbox for reset instructions.");
        nav.goToLogin();
      } else {
        const payload = result?.payload;
        const message =
          typeof payload === "string" && payload.trim().length > 0
            ? payload
            : "Invalid email";
        showError("Forgot Password", message);
      }
    } catch (e) {
      showError("Forgot Password", "Unable to process request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="auth-form-container">
        <PageHeader
          title={`Forgot your password?`}
          description={`Enter your email to receive reset instructions.`}
        />

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register("email")}
            type="email"
            label="Email address"
            placeholder="Enter your email"
            error={errors.email?.message}
            required
            id="email"
            aria-label="Email address"
          />
          <Button
            type="submit"
            loading={isSubmitting}
            className="form-button-full"
          >
            Send reset link
          </Button>
          {isSubmitting && (
            <div className="flex-center-mt-4">
              <LoadingSpinner text="Sending..." />
            </div>
          )}
          <p className="text-sm-secondary">
            <Button
              type="button"
              variant="ghost"
              onClick={() => nav.goToLogin()}
            >
              Back to login
            </Button>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
