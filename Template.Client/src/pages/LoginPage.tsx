import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth, useToast, useErrorHandler } from "@/hooks";
import { useGenericNavigationFunctions } from "@/utils";
import { Button, Form, Input, PageHeader } from "solstice-ui";
import { loginSchema, LoginFormData } from "@/validations/schemas";
import { Lock, Mail, LogIn, Eye, EyeOff } from "lucide-react";
import {
  APP_PATHS,
  BUTTON_LABELS,
  ERROR_MESSAGES,
  TEST_IDS,
} from "@/config";
import { ApiResponse } from "@/models/shared/api";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(
    () => !!localStorage.getItem("rememberedEmail")
  );
  const { login, isAuthenticated, isLoading } = useAuth();
  const { showError } = useToast();
  const { handleError } = useErrorHandler();
  const nav = useGenericNavigationFunctions();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const from = APP_PATHS.HOME;

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = from;
    }
  }, [isAuthenticated, from]);

  useEffect(() => {
    const storedEmail = localStorage.getItem("rememberedEmail");
    if (storedEmail) {
      setTimeout(() => {
        setValue("email", storedEmail);
        const emailInput = document.getElementById("email") as HTMLInputElement;
        if (emailInput) {
          emailInput.value = storedEmail;
        }
      }, 0);
    }
  }, [setValue]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login({
        email: data.email,
        password: data.password,
      });
      if (result.type.endsWith("fulfilled")) {
        nav.goToHome();
      } else {
        const payload = result?.payload;

        if (payload && typeof payload === "object" && "message" in payload) {
          const errorInfo = payload as { message: string; status?: number };
          const errorResponse: ApiResponse<unknown> = {
            success: false,
            status: errorInfo.status,
            message: errorInfo.message || ERROR_MESSAGES.WRONG_USERNAME_PASSWORD,
            data: null,
            fieldErrors: {},
          };
          handleError(errorResponse, ERROR_MESSAGES.LOGIN_FAILED);
        } else {
          const message =
            typeof payload === "string" && payload.trim().length > 0
              ? payload
              : ERROR_MESSAGES.WRONG_USERNAME_PASSWORD;
          showError(ERROR_MESSAGES.LOGIN_FAILED, message);
        }
      }
    } catch {
      showError(ERROR_MESSAGES.LOGIN_FAILED, ERROR_MESSAGES.LOADING_FAILED);
    }
  };

  return (
    <div className="space-y-4" data-testid={TEST_IDS.LOGIN_PAGE}>
      <div
        className="auth-form-container"
        data-testid={TEST_IDS.LOGIN_FORM_CONTAINER}
      >
        <PageHeader
          title={`Sign in to your account`}
          description={`Welcome back`}
        />

        <Form
          onSubmit={handleSubmit(onSubmit)}
          data-testid={TEST_IDS.LOGIN_FORM}
        >
          <Input
            {...register("email")}
            type="email"
            label="Email address"
            icon={Mail}
            placeholder="Enter your email"
            error={errors.email?.message}
            required
            id="email"
            data-testid={TEST_IDS.EMAIL_INPUT}
            aria-label="Email address"
          />

          <Input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            label="Password"
            icon={Lock}
            placeholder="Enter your password"
            error={errors.password?.message}
            required
            id="password"
            data-testid={TEST_IDS.PASSWORD_INPUT}
            aria-label="Password"
            endAdornment={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 0 }}
                data-testid={TEST_IDS.PASSWORD_TOGGLE}
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} className="text-gray-400" /> : <Eye size={16} className="text-gray-400" />}
              </button>
            }
          />

          <label className="flex items-center gap-2" data-testid={TEST_IDS.REMEMBER_ME}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-blue-600"
              aria-label="Remember me"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {BUTTON_LABELS.REMEMBER_ME}
            </span>
          </label>

          <Button
            type="submit"
            loading={isLoading}
            className="form-button-full"
            icon={LogIn}
            data-testid={TEST_IDS.LOGIN_BUTTON}
            aria-label="Sign in to your account"
          >
            {BUTTON_LABELS.SIGN_IN}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => nav.goTo("/forgot-password")}
            data-testid={TEST_IDS.FORGOT_PASSWORD_LINK}
          >
            Forgot your password?
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default LoginPage;
