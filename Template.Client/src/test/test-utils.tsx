import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { mockUsers, mockRoles, mockPermissions } from "@/mock";
import authSlice from "@/store/slices/auth/authSlice";
import themeSlice from "@/store/slices/ui/themeSlice";
import { ToastProvider } from "@/hooks/ui/useToast";

// Note: SecureStorage mock is defined in setup.ts

// Create a new QueryClient for each test
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
    },
  });

export const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      auth: authSlice,
      theme: themeSlice,
    },
    preloadedState,
  });
};

interface TestWrapperProps {
  children: React.ReactNode;
  store?: ReturnType<typeof createTestStore>;
}

export function TestWrapper({
  children,
  store = createTestStore(),
}: TestWrapperProps) {
  const queryClient = createTestQueryClient();
  (window as unknown as Record<string, unknown>).__REDUX_STORE__ = store;

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <BrowserRouter>
          <ToastProvider>{children}</ToastProvider>
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  );
};

export const renderWithProviders = (
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    ...renderOptions
  }: {
    preloadedState?: Record<string, unknown>;
    store?: ReturnType<typeof createTestStore>;
  } & Omit<RenderOptions, "wrapper"> = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <TestWrapper store={store}>{children}</TestWrapper>
  );

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

export const mockUser = {
  ...mockUsers[0],
};

export const mockAuthState = {
  user: mockUser,
  token: "test-token",
  isAuthenticated: true,
  isLoading: false,
};

export const mockPermissionsState = {
  permissions: mockPermissions.map((p) => p.key),
  isLoading: false,
};

export const mockUsersState = {
  users: [mockUser],
  selectedUser: null,
  isLoading: false,
  error: null,
};

export const mockThemeState = {
  theme: "light",
  isDark: false,
};

export const mockRolesState = {
  roles: mockRoles,
  selectedRole: null,
  isLoading: false,
  error: null,
};

export * from "@testing-library/react";
export { renderWithProviders as render };
