import React from "react";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { store } from "@/store";
import { queryClient } from "@/config/queryClient";
import { useAuth, useTheme, useToast, ToastProvider } from "@/hooks";
import { ErrorBoundary, Layout, Toast, LoadingSpinner } from "@/components";
import { APP_PATHS, NAVIGATION_CONFIG } from "@/config";
import {
  DASHBOARD_MODULE,
  DASHBOARD_MANAGEMENT_MODULE,
  AUDIT_MODULE,
  COMPONENTS_MODULE,
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
import ComponentsReferencePage from "@/pages/components/ComponentsReferencePage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { setNavigateToLogin, resetLoginNavigationFlag } from "@/services/base/baseService";
import { NavigationItem } from "@/models";
import { clearAuth } from "@/store/slices/auth/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  React.useEffect(() => {
    setNavigateToLogin(
      () => {
        navigate(APP_PATHS.LOGIN, { replace: true });
      },
      () => {
        dispatch(clearAuth());
      }
    );
  }, [navigate, dispatch]);

  React.useEffect(() => {
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
                    path={COMPONENTS_MODULE.routes.base}
                    element={<ComponentsReferencePage />}
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
};

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useTheme();
  return <>{children}</>;
};

const AppWithTheme: React.FC = () => {
  const { isLoading, token, isAuthenticated, refreshUser } = useAuth();
  const { toasts, removeToast } = useToast();
  const [loadingTimeout, setLoadingTimeout] = React.useState(false);

  React.useEffect(() => {
    if (token && !isAuthenticated) {
      refreshUser();
    }
  }, [token, isAuthenticated, refreshUser]);

  React.useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setLoadingTimeout(true);
      }, 10000);

      return () => clearTimeout(timer);
    } else {
      setLoadingTimeout(false);
    }
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
      <Router>
        <AppRoutes />
      </Router>
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

const App: React.FC = () => {
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
};

export default App;
