// Use base test utilities to reduce duplication
import { setupBaseTest } from "@/test/base-test-utils";

const { cleanup } = setupBaseTest({
  useMockData: false,
  mockFetch: false,
  mockPermissionCache: false,
  mockRouteUtils: false,
});

import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import HomePage from "./HomePage";
import { TEST_IDS } from "@/config";
import { ROLE_NAMES } from "@/config/generated/permissionKeys.generated";

const mockUseAuth = jest.fn();

jest.mock("@/hooks", () => {
  const { getHookMocks } = require("@/test/base-test-utils");
  return {
    ...getHookMocks({
      useAuth: { user: { firstName: "Admin" }, isAuthenticated: true },
    }),
    useAuth: () => mockUseAuth(),
  };
});

jest.mock("@/components/Guards/PermissionGuard", () => {
  return function MockPermissionGuard({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return <div data-testid={TEST_IDS.MOCK_PERMISSION_GUARD}>{children}</div>;
  };
});

jest.mock("@/pages/dashboards/RoleBasedDashboardRedirect", () => {
  return function MockRoleBasedDashboardRedirect() {
    return (
      <div data-testid={TEST_IDS.DASHBOARD}>Role Based Dashboard Redirect</div>
    );
  };
});

const createMockStore = () => {
  return configureStore({
    reducer: {
      auth: (state = { user: null, isLoading: false }) => state,
    },
  });
};

const renderWithProviders = (component: React.ReactElement) => {
  const store = createMockStore();
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

describe("HomePage", () => {
  beforeEach(() => {
    cleanup();
    mockUseAuth.mockReturnValue({
      user: { id: "1", role: ROLE_NAMES.ADMINISTRATOR },
      isLoading: false,
    });
  });

  it("renders HomePage with PermissionGuard and DashboardFactory", () => {

    renderWithProviders(<HomePage />);

    expect(screen.getByTestId(TEST_IDS.MOCK_PERMISSION_GUARD)).toBeTruthy();
    expect(screen.getByTestId(TEST_IDS.DASHBOARD)).toBeTruthy();
  });

  it("renders with different user roles", () => {
    mockUseAuth.mockReturnValue({
      user: { id: "2", role: ROLE_NAMES.SUPPORT },
      isLoading: false,
    });

    renderWithProviders(<HomePage />);

    expect(screen.getByTestId(TEST_IDS.MOCK_PERMISSION_GUARD)).toBeTruthy();
    expect(screen.getByTestId(TEST_IDS.DASHBOARD)).toBeTruthy();
  });

  it("renders with operator role as default", () => {
    mockUseAuth.mockReturnValue({
      user: { id: "3", role: ROLE_NAMES.OPERATOR },
      isLoading: false,
    });

    renderWithProviders(<HomePage />);

    expect(screen.getByTestId(TEST_IDS.MOCK_PERMISSION_GUARD)).toBeTruthy();
    expect(screen.getByTestId(TEST_IDS.DASHBOARD)).toBeTruthy();
  });

  it("renders with regulator role", () => {
    mockUseAuth.mockReturnValue({
      user: { id: "4", role: ROLE_NAMES.REGULATOR },
      isLoading: false,
    });

    renderWithProviders(<HomePage />);

    expect(screen.getByTestId(TEST_IDS.MOCK_PERMISSION_GUARD)).toBeTruthy();
    expect(screen.getByTestId(TEST_IDS.DASHBOARD)).toBeTruthy();
  });

  it("renders with unknown role (defaults to operator)", () => {
    mockUseAuth.mockReturnValue({
      user: { id: "5", role: "unknown" },
      isLoading: false,
    });

    renderWithProviders(<HomePage />);

    expect(screen.getByTestId(TEST_IDS.MOCK_PERMISSION_GUARD)).toBeTruthy();
    expect(screen.getByTestId(TEST_IDS.DASHBOARD)).toBeTruthy();
  });
});
