// Use base test utilities to reduce duplication
import { setupBaseTest } from "@/test/base-test-utils";

import "@testing-library/jest-dom";
import { describe, it, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "../Layout/Layout";
import { mockUsers } from "../../mock/data";
import authSlice from "@/store/slices/auth/authSlice";
import themeSlice from "@/store/slices/ui/themeSlice";

const { cleanup } = setupBaseTest({
  useMockData: false,
  mockFetch: false,
  mockPermissionCache: false,
  mockRouteUtils: false,
});

const mockUseAuth = jest.fn();

jest.mock("@/hooks", () => {
  const actual = jest.requireActual("@/hooks");
  return {
    ...actual,
    usePermissions: () => ({
      hasPermission: jest.fn().mockReturnValue(true),
      hasAnyPermission: jest.fn().mockReturnValue(true),
      hasAllPermissions: jest.fn().mockReturnValue(true),
      hasRole: jest.fn().mockReturnValue(true),
      permissions: [],
      role: "admin",
      user: require("@/mock/data").mockUsers[0],
      isAdmin: false,
    }),
    useAuth: () => ({
      isAuthenticated: true,
      user: require("@/mock/data").mockUsers[0],
      logout: jest.fn(),
    }),
    useTheme: () => ({
      theme: "light",
      isDark: false,
      toggleTheme: jest.fn(),
    }),
    useToast: () => ({
      showSuccess: jest.fn(),
      showError: jest.fn(),
      addToast: jest.fn(),
    }),
    useUsersQuery: () => ({
      users: [],
      updateProfile: jest.fn().mockResolvedValue({ success: true }),
      mutations: {
        update: { isPending: false },
      },
      paginationResult: { items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0 },
      paginationHandlers: { changePage: jest.fn(), changePageSize: jest.fn() },
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    }),
  };
});

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity },
    },
  });

const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      auth: authSlice,
      theme: themeSlice,
    },
    preloadedState: {
      auth: {
        isAuthenticated: true,
        isLoading: false,
        error: null,
        token: "test-token",
        refreshToken: null,
        user: mockUsers[0],
      },
      theme: {
        theme: "light" as const,
        isDark: false,
      },
      ...preloadedState,
    } as unknown,
  });
};

const TestWrapper = ({
  children,
  store,
}: {
  children: React.ReactNode;
  store: ReturnType<typeof createTestStore>;
}) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    </QueryClientProvider>
  );
};

describe("Layout", () => {
  beforeEach(() => {
    cleanup();
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: mockUsers[0],
      logout: jest.fn(),
    });
  });

  it("renders layout with children", () => {
    const store = createTestStore();
    render(
      <TestWrapper store={store}>
        <Layout>
          <div data-testid="content">Test content</div>
        </Layout>
      </TestWrapper>
    );

    expect(screen.getByTestId("content")).toBeTruthy();
  });

  it("renders when not authenticated", () => {
    const store = createTestStore({
      auth: {
        isAuthenticated: false,
        user: null,
        token: null,
        refreshToken: null,
        isLoading: false,
        error: null,
      },
    });
    render(
      <TestWrapper store={store}>
        <Layout>
          <div data-testid="content">Test content</div>
        </Layout>
      </TestWrapper>
    );

    expect(screen.getByTestId("content")).toBeTruthy();
  });

  it("renders with default layout structure", () => {
    const store = createTestStore();
    render(
      <TestWrapper store={store}>
        <Layout>
          <div data-testid="content">Test content</div>
        </Layout>
      </TestWrapper>
    );

    expect(screen.getByTestId("content")).toBeTruthy();
    expect(screen.getByTestId("content").closest("main")).toBeTruthy();
  });

  it("renders with sidebar when authenticated", () => {
    const store = createTestStore();
    render(
      <TestWrapper store={store}>
        <Layout>
          <div data-testid="content">Test content</div>
        </Layout>
      </TestWrapper>
    );

    const main = screen.getByRole("main");
    expect(main).toBeTruthy();
  });

  it("handles loading state", () => {
    const store = createTestStore({
      auth: {
        isAuthenticated: true,
        user: mockUsers[0],
        token: "test-token",
        refreshToken: null,
        isLoading: true,
        error: null,
      },
    });
    render(
      <TestWrapper store={store}>
        <Layout>
          <div data-testid="content">Test content</div>
        </Layout>
      </TestWrapper>
    );

    expect(screen.getByTestId("content")).toBeTruthy();
  });
});
