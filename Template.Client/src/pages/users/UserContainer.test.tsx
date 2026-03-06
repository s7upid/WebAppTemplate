// Use base test utilities to reduce duplication
import { getHookMocks, getServiceMocks } from "@/test/base-test-utils";

import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/hooks";
import UserContainer from "./UserContainer";
import authReducer from "../../store/slices/auth/authSlice";
import themeReducer from "../../store/slices/ui/themeSlice";
import { TEST_IDS } from "@/config/constants";

jest.mock("@/config", () => ({
  __esModule: true,
  APP_PATHS: { HOME: "/" },
  PERMISSION_KEYS: { USERS: { VIEW: "users.view" } },
  USERS_MODULE: { messages: { created: "User created successfully", updated: "User updated successfully" } },
  createUserManagementHeader: () => ({ title: "Users" }),
  createPendingUsersHeader: () => ({ title: "Pending Users" }),
}));

jest.mock("@/components/BasePage/BasePage", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="base-page">{children}</div>
  ),
}));
jest.mock("@/components", () => {
  const stubs = require("@/test/__mocks__/component-stubs").default;
  return {
    ...stubs,
    PermissionGuard: ({ children }: { children?: React.ReactNode }) => (
      <div data-testid={TEST_IDS.MOCK_PERMISSION_GUARD}>{children}</div>
    ),
  };
});

jest.mock("@/components/Guards/PermissionGuard", () => ({
  __esModule: true,
  default: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid={TEST_IDS.MOCK_PERMISSION_GUARD}>{children}</div>
  ),
}));

jest.mock("@/pages/dashboards/DashboardContainer", () => ({
  __esModule: true,
  default: () => <div data-testid="dashboard" />,
}));
jest.mock("@/pages", () => ({
  __esModule: true,
  UserGridPage: () => (
    <div data-testid={TEST_IDS.MOCK_USER_GRID_PAGE}>User Grid Page</div>
  ),
  UserDetailsPage: () => (
    <div data-testid={TEST_IDS.MOCK_USER_DETAILS_PAGE}>User Details Page</div>
  ),
  PendingUsersPage: () => (
    <div data-testid={TEST_IDS.MOCK_PENDING_USERS_PAGE}>Pending Users Page</div>
  ),
  UserManagementTabs: () => <div data-testid="user-management-tabs">Tabs</div>,
  UserFormModal: () => (
    <div data-testid={TEST_IDS.MOCK_USER_FORM_MODAL}>User Form Modal</div>
  ),
  UserCreateModal: () => (
    <div data-testid={TEST_IDS.MOCK_USER_CREATE_PAGE}>User Create Modal</div>
  ),
  UserRoleModal: () => (
    <div data-testid={TEST_IDS.MOCK_USER_ROLE_MODAL}>User Role Modal</div>
  ),
  UserPermissionModal: () => (
    <div data-testid={TEST_IDS.MOCK_USER_PERMISSION_MODAL}>
      User Permission Modal
    </div>
  ),
}));

jest.mock("@/hooks/queries/useUsersQuery", () => ({
  useUsersQuery: () => ({
    add: jest.fn(),
    edit: jest.fn(),
    paginationResult: {
      items: [],
      totalCount: 0,
      pageNumber: 1,
      pageSize: 10,
      totalPages: 1,
    },
    paginationHandlers: {
      refreshWithCurrentFilters: jest.fn(),
      refreshWithParams: jest.fn(),
    },
    isLoading: false,
  }),
}));

jest.mock("@/hooks", () => {
  const actual = jest.requireActual("@/hooks");
  const baseHookMocks = getHookMocks();
  return {
    ...actual,
    ...baseHookMocks,
    useUserManagementPermissions: () => ({
      canViewUsers: true,
      canCreateUsers: true,
      canEditUsers: true,
      canDeleteUsers: true,
      canEditUserRoles: true,
      canEditUserPermissions: true,
    }),
  };
});

jest.mock("@/services", () => ({
  ...getServiceMocks(),
  authService: {},
  dashboardApi: {},
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity },
    },
  });

const createStore = (): ReturnType<typeof configureStore> =>
  configureStore({
    reducer: {
      auth: authReducer,
      theme: themeReducer,
    },
    preloadedState: {
      auth: {
        isAuthenticated: true,
        isLoading: false,
        refreshToken: null,
        user: {
          id: "u1",
          email: "admin@example.com",
          firstName: "Admin",
          lastName: "User",
          role: { name: "admin", id: "1" },
          status: "active",
          permissionKeys: [],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          customPermissionsCount: 0,
          userStatus: 0,
          lastLogin: null,
          permissions: [],
          avatar: "",
        },
        token: "t",
        error: null,
      },
      theme: {
        theme: "light" as const,
        isDark: false,
      },
    } as unknown,
  });

const renderWithProviders = (route: string = "/") => {
  const store = createStore();
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          <ToastProvider>
            <UserContainer />
          </ToastProvider>
        </MemoryRouter>
      </Provider>
    </QueryClientProvider>
  );
};

describe("UserContainer", () => {
  it("renders main grid route", () => {
    renderWithProviders("/");
    expect(screen.getByTestId(TEST_IDS.MOCK_USER_GRID_PAGE)).toBeTruthy();
    expect(screen.getByTestId(TEST_IDS.MOCK_PERMISSION_GUARD)).toBeTruthy();
  });

  it("renders pending users route", () => {
    renderWithProviders("/pending");
    expect(screen.getByTestId(TEST_IDS.MOCK_PENDING_USERS_PAGE)).toBeTruthy();
  });

  it("renders user details route", () => {
    renderWithProviders("/123");
    expect(screen.getByTestId(TEST_IDS.MOCK_USER_DETAILS_PAGE)).toBeTruthy();
  });

  it("protects routes via PermissionGuard", () => {
    renderWithProviders("/");
    expect(
      screen.getByTestId(TEST_IDS.MOCK_PERMISSION_GUARD)
    ).toBeInTheDocument();
  });
});
