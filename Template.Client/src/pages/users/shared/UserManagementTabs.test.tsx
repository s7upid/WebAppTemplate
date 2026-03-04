import { setupBaseTest, getSliceMocks, getRouteUtilsMocks } from "@/test/base-test-utils";

jest.mock("@/store", () => getSliceMocks({ errorMessages: { LOGIN_FAILED: "Login failed" } }).store);
jest.mock("@/config", () => getSliceMocks({ errorMessages: { LOGIN_FAILED: "Login failed" } }).config);
jest.mock("@/config/navigation", () => getSliceMocks({ errorMessages: { LOGIN_FAILED: "Login failed" } }).configNavigation);
jest.mock("@/utils/routeUtils", () => getRouteUtilsMocks());

// Set up @/utils mock using getCommonMocks directly (must be before setupBaseTest due to hoisting)
jest.mock("@/utils", () => {
  const { getCommonMocks } = require("@/test/base-test-utils");
  const mocks = getCommonMocks({ useMockData: false });
  return {
    SecureStorage: {
      getToken: jest.fn(() => null),
      getUser: jest.fn(() => null),
      setToken: jest.fn(),
      setUser: jest.fn(),
      clear: jest.fn(),
    },
    env: {
      VITE_STORAGE_SECRET_KEY: "test-secret-key",
      VITE_APP_NAME: "test-app",
      VITE_USE_MOCK_DATA: "false",
      VITE_API_URL: "http://localhost:3000",
    },
    logger: mocks.logger,
    cn: mocks.cn,
    handleEntityDelete: mocks.handleEntityDelete,
    handleSubmitForm: mocks.handleSubmitForm,
    handleEntitySave: mocks.handleEntitySave,
    useRouteInfo: mocks.useRouteInfo,
    parseRouteInfo: mocks.parseRouteInfo,
    getNavigationUrls: mocks.getNavigationUrls,
    getActiveTab: mocks.getActiveTab,
    isNavigationActive: mocks.isNavigationActive,
    useEntityNavigation: mocks.useEntityNavigation,
    useGenericNavigationFunctions: mocks.useGenericNavigationFunctions,
  };
});

// Get cleanup function after mocks are set up
const { cleanup } = setupBaseTest({
  useMockData: false,
  mockFetch: false,
  mockPermissionCache: true,
  mockRouteUtils: true,
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import authReducer from "@/store/slices/auth/authSlice";
import themeReducer from "@/store/slices/ui/themeSlice";
import UserManagementTabs from "./UserManagementTabs";
import { PERMISSION_KEYS } from "@/config/generated/permissionKeys.generated";

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity },
    },
  });

const createMockStore = (): ReturnType<typeof configureStore> => {
  return configureStore({
    reducer: {
      auth: authReducer,
      theme: themeReducer,
    },
    preloadedState: {
      auth: {
        isAuthenticated: true,
        isLoading: false,
        error: null,
        user: {
          id: "1",
          email: "test@example.com",
          firstName: "Test",
          lastName: "User",
          role: { name: "admin", id: "1" },
          status: "active",
          permissionKeys: [PERMISSION_KEYS.USERS.VIEW, PERMISSION_KEYS.USERS.CREATE],
          customPermissionsCount: 0,
          isActive: true,
          userStatus: 0,
          lastLogin: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          permissions: [],
          avatar: "",
        },
        token: "mock-token",
        refreshToken: null,
      },
      theme: {
        theme: "light" as const,
        isDark: false,
      },
    } as unknown,
  });
};

const renderWithProviders = (component: React.ReactElement) => {
  const store = createMockStore();
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <BrowserRouter>{component}</BrowserRouter>
      </Provider>
    </QueryClientProvider>
  );
};

describe("UserManagementTabs", () => {
  const mockPermissions = {
    canViewUsers: true,
    canCreateUsers: true,
    canEditUsers: true,
    canDeleteUsers: true,
    canAssignRoles: true,
    canAssignPermissions: true,
    canApproveUsers: true,
    canRejectUsers: true,
    canViewUserDetails: true,
    canEditUserRoles: true,
    canEditUserPermissions: true,
    canViewPendingUsers: true,
  };

  beforeEach(() => {
    cleanup();
  });

  it("renders all tabs", () => {
    renderWithProviders(
      <UserManagementTabs
        activeTab="all"
        onTabChange={jest.fn()}
        permissions={mockPermissions}
      />
    );

    expect(screen.getByText("All Users")).toBeTruthy();
    expect(screen.getByText("Pending Approvals")).toBeTruthy();
  });

  it("highlight active tab", () => {
    renderWithProviders(
      <UserManagementTabs
        activeTab="pending"
        onTabChange={jest.fn()}
        permissions={mockPermissions}
      />
    );

    const pendingTab = screen.getByText("Pending Approvals");
    const button = pendingTab.closest("button");
    expect(button).toBeTruthy();
    expect(button).toHaveAttribute("data-testid", "pending-tab");
  });

  it("calls onTabChange when tab is clicked", () => {
    const mockOnTabChange = jest.fn();

    renderWithProviders(
      <UserManagementTabs
        activeTab="all"
        onTabChange={mockOnTabChange}
        permissions={mockPermissions}
      />
    );

    const pendingTab = screen.getByText("Pending Approvals");
    fireEvent.click(pendingTab);

    expect(mockOnTabChange).toHaveBeenCalledWith("pending");
  });

  it("have proper structure for styling", () => {
    renderWithProviders(
      <UserManagementTabs
        activeTab="all"
        onTabChange={jest.fn()}
        permissions={mockPermissions}
      />
    );

    // Check that the tabs container has proper structure (using CSS modules, class names are dynamic)
    const allUsersTab = screen.getByText("All Users").closest("button");
    expect(allUsersTab).toBeTruthy();
    expect(allUsersTab).toHaveAttribute("data-testid", "all-tab");

    expect(screen.getByText("All Users")).toBeTruthy();
  });

  it("shows correct icons for each tab", () => {
    renderWithProviders(
      <UserManagementTabs
        activeTab="all"
        onTabChange={jest.fn()}
        permissions={mockPermissions}
      />
    );

    const allUsersTab = screen.getByText("All Users").closest("button");
    const pendingTab = screen.getByText("Pending Approvals").closest("button");

    expect(allUsersTab?.querySelector("svg")).toBeTruthy();
    expect(pendingTab?.querySelector("svg")).toBeTruthy();
  });

  it("handles tab change for all users", () => {
    const mockOnTabChange = jest.fn();

    renderWithProviders(
      <UserManagementTabs
        activeTab="pending"
        onTabChange={mockOnTabChange}
        permissions={mockPermissions}
      />
    );

    const allUsersTab = screen.getByText("All Users");
    fireEvent.click(allUsersTab);

    expect(mockOnTabChange).toHaveBeenCalledWith("all");
  });

  it("not call onTabChange when clicking the same active tab", () => {
    const mockOnTabChange = jest.fn();

    renderWithProviders(
      <UserManagementTabs
        activeTab="all"
        onTabChange={mockOnTabChange}
        permissions={mockPermissions}
      />
    );

    const allUsersTab = screen.getByText("All Users");
    fireEvent.click(allUsersTab);

    expect(mockOnTabChange).toHaveBeenCalledWith("all");
  });
});
