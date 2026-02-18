// Use base test utilities to reduce duplication
import { setupBaseTest } from "@/test/base-test-utils";

// Get cleanup function after mocks are set up
const { cleanup } = setupBaseTest({
  useMockData: false,
  mockFetch: false,
  mockPermissionCache: false,
  mockRouteUtils: false,
});

import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import RoleGuard from "./RoleGuard";
import { TEST_IDS } from "@/config";
import { renderWithProviders, mockAuthState, createTestStore } from "@/test/test-utils";

describe("RoleGuard", () => {
  beforeEach(() => {
    cleanup(); // Use cleanup from base utilities
  });

  it("renders children when user has required role", () => {
    const store = createTestStore({
      auth: {
        ...mockAuthState,
        refreshToken: null,
        error: null,
        user: {
          ...mockAuthState.user,
          role: {
            name: "admin",
            id: "1",
            description: "",
            isSystem: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            permissions: [],
            userRoles: [],
          },
        },
      },
      theme: { theme: "light" as const, isDark: false },
    });

    renderWithProviders(
      <RoleGuard role="admin">
        <div data-testid={TEST_IDS.MOCK_CUSTOM_CONTENT}>Protected content</div>
      </RoleGuard>,
      { store }
    );

    expect(screen.getByTestId(TEST_IDS.MOCK_CUSTOM_CONTENT)).toBeTruthy();
  });

  it("does not render children when user lacks required role", () => {
    const store = createTestStore({
      auth: {
        ...mockAuthState,
        refreshToken: null,
        error: null,
        user: {
          ...mockAuthState.user,
          role: {
            name: "user",
            id: "2",
            description: "",
            isSystem: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            permissions: [],
            userRoles: [],
          },
        },
      },
      theme: { theme: "light" as const, isDark: false },
    });

    renderWithProviders(
      <RoleGuard role="admin">
        <div data-testid={TEST_IDS.MOCK_CUSTOM_CONTENT}>Protected content</div>
      </RoleGuard>,
      { store }
    );

    expect(screen.queryByTestId(TEST_IDS.MOCK_CUSTOM_CONTENT)).not.toBeTruthy();
  });

  it("renders children when user has one of the required roles", () => {
    const store = createTestStore({
      auth: {
        ...mockAuthState,
        refreshToken: null,
        error: null,
        user: {
          ...mockAuthState.user,
          role: {
            name: "admin",
            id: "1",
            description: "",
            isSystem: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            permissions: [],
            userRoles: [],
          },
        },
      },
      theme: { theme: "light" as const, isDark: false },
    });

    renderWithProviders(
      <RoleGuard role={["admin", "moderator"]}>
        <div data-testid={TEST_IDS.MOCK_CUSTOM_CONTENT}>Protected content</div>
      </RoleGuard>,
      { store }
    );

    expect(screen.getByTestId(TEST_IDS.MOCK_CUSTOM_CONTENT)).toBeTruthy();
  });

  it("renders fallback when user lacks required role", () => {
    const store = createTestStore({
      auth: {
        ...mockAuthState,
        refreshToken: null,
        error: null,
        user: {
          ...mockAuthState.user,
          role: {
            name: "user",
            id: "2",
            description: "",
            isSystem: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            permissions: [],
            userRoles: [],
          },
        },
      },
      theme: { theme: "light" as const, isDark: false },
    });

    renderWithProviders(
      <RoleGuard
        role="admin"
        fallback={<div data-testid={TEST_IDS.ACCESS_DENIED}>Access denied</div>}
      >
        <div data-testid={TEST_IDS.MOCK_CUSTOM_CONTENT}>Protected content</div>
      </RoleGuard>,
      { store }
    );

    expect(screen.getByTestId(TEST_IDS.ACCESS_DENIED)).toBeTruthy();
    expect(screen.queryByTestId(TEST_IDS.MOCK_CUSTOM_CONTENT)).not.toBeTruthy();
  });

  it("renders null when user lacks role and no fallback provided", () => {
    const store = createTestStore({
      auth: {
        ...mockAuthState,
        refreshToken: null,
        error: null,
        user: {
          ...mockAuthState.user,
          role: {
            name: "user",
            id: "2",
            description: "",
            isSystem: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            permissions: [],
            userRoles: [],
          },
        },
      },
      theme: { theme: "light" as const, isDark: false },
    });

    renderWithProviders(
      <RoleGuard role="admin">
        <div data-testid={TEST_IDS.MOCK_CUSTOM_CONTENT}>Protected content</div>
      </RoleGuard>,
      { store }
    );

    expect(screen.queryByTestId(TEST_IDS.MOCK_CUSTOM_CONTENT)).not.toBeTruthy();
  });

  it("does not render children when user is not authenticated", () => {
    const store = createTestStore({
      auth: {
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      },
      theme: { theme: "light" as const, isDark: false },
    });

    renderWithProviders(
      <RoleGuard role="admin">
        <div data-testid={TEST_IDS.MOCK_CUSTOM_CONTENT}>Protected content</div>
      </RoleGuard>,
      { store }
    );

    expect(screen.queryByTestId(TEST_IDS.MOCK_CUSTOM_CONTENT)).not.toBeTruthy();
  });
});
