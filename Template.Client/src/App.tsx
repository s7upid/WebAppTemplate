import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { store } from "@/store";
import { queryClient } from "@/config/queryClient";
import { useAuth, useTheme, useToast, ToastProvider } from "@/hooks";
import { ErrorBoundary, Toast, LoadingSpinner } from "solstice-ui";
import { Layout } from "@/components";
import { APP_PATHS, NAVIGATION_CONFIG } from "@/config";
import {
  DASHBOARD_MODULE,
  DASHBOARD_MANAGEMENT_MODULE,
  AUDIT_MODULE,
} from "@/config/modules";
import {
  ProtectedRoute,
  DashboardContainer,
  ForgotPasswordPage,
  LoginPage,
  HomePage,
} from "@/pages";
import ResetPasswordPage from "@/pages/password/ResetPasswordPage";
import ConfirmEmailPage from "@/pages/auth/ConfirmEmailPage";
import AuditLogsPage from "@/pages/audit/AuditLogsPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { setNavigateToLogin, resetLoginNavigationFlag, setNetworkStatusHandler } from "@/services/base/baseService";
import { NavigationItem } from "@/models";
import { clearAuth } from "@/store/slices/auth/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { env } from "@/utils/env";

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    setNavigateToLogin(
      () => {
        navigate(APP_PATHS.LOGIN, { replace: true });
      },
      () => {
        dispatch(clearAuth());
      }
    );
  }, [navigate, dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      resetLoginNavigationFlag();
    }
  }, [isAuthenticated]);

  return (
    <Routes>
      <Route
        path={APP_PATHS.LOGIN}
        element={
          isAuthenticated ? (
            <Navigate to={APP_PATHS.HOME} replace />
          ) : (
            <LoginPage />
          )
        }
      />
      <Route
        path={APP_PATHS.FORGOT_PASSWORD}
        element={<ForgotPasswordPage />}
      />
      <Route
        path={APP_PATHS.RESET_PASSWORD}
        element={<ResetPasswordPage />}
      />
      <Route
        path={APP_PATHS.CONFIRM_EMAIL}
        element={<ConfirmEmailPage />}
      />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <ErrorBoundary>
                <Routes>
                  {[
                    ...NAVIGATION_CONFIG,
                    ...NAVIGATION_CONFIG.flatMap((i) => i.children || []),
                  ]
                    .filter((navItem: NavigationItem) => !!navItem.routePath)
                    .map((navItem: NavigationItem) => {
                      const Component = navItem.component;
                      const routePath = navItem.routePath || navItem.href;
                      return (
                        <Route
                          key={navItem.id}
                          path={routePath}
                          element={<Component />}
                        />
                      );
                    })}
                  <Route
                    path={DASHBOARD_MODULE.routes.root}
                    element={<DashboardContainer />}
                  />
                  <Route
                    path={DASHBOARD_MANAGEMENT_MODULE.routes.root}
                    element={<DashboardContainer />}
                  />
                  <Route path={APP_PATHS.HOME} element={<HomePage />} />
                  <Route
                    path={AUDIT_MODULE.routes.base}
                    element={<AuditLogsPage />}
                  />
                  <Route
                    path="*"
                    element={<Navigate to={APP_PATHS.HOME} replace />}
                  />
                </Routes>
              </ErrorBoundary>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function ThemeProvider({ children }: { children: ReactNode }) {
  useTheme();
  return <>{children}</>;
}

function AppWithTheme() {
  const { isLoading, token, isAuthenticated, refreshUser } = useAuth();
  const { toasts, removeToast } = useToast();
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);

  useEffect(() => {
    if (token && !isAuthenticated) {
      refreshUser();
    }
  }, [token, isAuthenticated, refreshUser]);

  useEffect(() => {
    setNetworkStatusHandler((online, errorMessage) => {
      if (!online) {
        setIsOffline(true);
        if (errorMessage) {
          setNetworkError(errorMessage);
        }
      } else {
        setIsOffline(false);
        setNetworkError(null);
      }
    });

    return () => {
      setNetworkStatusHandler(null);
    };
  }, []);

  const handleRetryConnection = useCallback(async () => {
    try {
      const healthBase = env.VITE_API_URL.replace(/\/$/, "");
      const res = await fetch(`${healthBase}/health`, { method: "GET" });
      if (res.ok) {
        setIsOffline(false);
        setNetworkError(null);
        queryClient.invalidateQueries();
      }
    } catch {
      if (!networkError) {
        setNetworkError(
          "Unable to reach backend API. Please ensure it is running on port 5249."
        );
      }
    }
  }, [networkError]);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setLoadingTimeout(true);
      }, 10000);

      return () => clearTimeout(timer);
    }
    queueMicrotask(() => setLoadingTimeout(false));
  }, [isLoading]);

  if (isLoading && !loadingTimeout) {
    return <LoadingSpinner text="Loading..." />;
  }

  if (loadingTimeout) {
    return (
      <div className="App">
        <Router>
          <AppRoutes />
        </Router>
        <Toast toasts={toasts} onRemove={removeToast} />
      </div>
    );
  }

  return (
    <div className="App">
      {isOffline && (
        <div className="fixed inset-x-0 top-0 z-50 flex flex-wrap items-center gap-x-3 gap-y-2 bg-slate-800 px-4 py-3 text-sm shadow-lg">
          <LoadingSpinner size="sm" className="shrink-0 text-slate-200" />
          <span className="font-medium text-white">
            No connection to backend. Retrying…
          </span>
          {networkError && (
            <span className="min-w-0 flex-1 break-words text-slate-100 text-sm max-w-full sm:max-w-[420px]" title={networkError}>
              {networkError}
            </span>
          )}
          <button
            type="button"
            onClick={handleRetryConnection}
            className="ml-auto shrink-0 rounded-md bg-white/15 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/40 transition-colors"
          >
            Retry now
          </button>
        </div>
      )}
      <Router>
        <AppRoutes />
      </Router>
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <ToastProvider>
            <AppWithTheme />
          </ToastProvider>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
