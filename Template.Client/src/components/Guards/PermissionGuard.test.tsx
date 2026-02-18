// Use base test utilities to reduce duplication
import { setupBaseTest } from "@/test/base-test-utils";

// Set up mocks at top level (must use require() inside jest.mock() due to Jest hoisting)
jest.mock("@/store", () => {
  const { getSliceMocks } = require("@/test/base-test-utils");
  return getSliceMocks({ errorMessages: { LOGIN_FAILED: "Login failed" } })
    .store;
});
jest.mock("@/config", () => {
  const { getSliceMocks } = require("@/test/base-test-utils");
  return {
    ...getSliceMocks({ errorMessages: { LOGIN_FAILED: "Login failed" } })
      .config,
    TEST_IDS: {
      MOCK_CUSTOM_CONTENT: "mock-custom-content",
      ACCESS_DENIED: "access-denied",
    },
  };
});
jest.mock("@/config/navigation", () => {
  const { getSliceMocks } = require("@/test/base-test-utils");
  return getSliceMocks({ errorMessages: { LOGIN_FAILED: "Login failed" } })
    .configNavigation;
});

// Get cleanup function after mocks are set up
const { cleanup } = setupBaseTest({
  useMockData: false,
  mockFetch: false,
  mockPermissionCache: false,
  mockRouteUtils: false,
});

const mockHasPermission = jest.fn();
const mockHasAnyPermission = jest.fn();
const mockHasAllPermissions = jest.fn();

jest.mock("@/hooks", () => {
  const actual = jest.requireActual("@/hooks");
  return {
    ...actual,
    usePermissions: () => ({
      hasPermission: mockHasPermission,
      hasAnyPermission: mockHasAnyPermission,
      hasAllPermissions: mockHasAllPermissions,
      hasRole: jest.fn(() => true),
      permissions: [],
      role: "admin",
      user: null,
      isAdmin: false,
    }),
  };
});

import { describe, it, expect } from "@jest/globals";
import { screen } from "@testing-library/react";
import PermissionGuard from "./PermissionGuard";
import { TEST_IDS } from "@/config";
import { renderWithProviders } from "@/test/test-utils";

describe("PermissionGuard", () => {
  beforeEach(() => {
    cleanup();
    // Default: user has all permissions
    mockHasPermission.mockReturnValue(true);
    mockHasAnyPermission.mockReturnValue(true);
    mockHasAllPermissions.mockReturnValue(true);
  });

  it("renders children when user has permission", () => {
    mockHasPermission.mockReturnValue(true);
    renderWithProviders(
      <PermissionGuard permission="users:read">
        <div data-testid={TEST_IDS.MOCK_CUSTOM_CONTENT}>Protected content</div>
      </PermissionGuard>
    );

    expect(screen.getByTestId(TEST_IDS.MOCK_CUSTOM_CONTENT)).toBeTruthy();
  });

  it("does not render children when user lacks permission", () => {
    mockHasPermission.mockReturnValue(false);
    mockHasAnyPermission.mockReturnValue(false);
    renderWithProviders(
      <PermissionGuard permission="users:write">
        <div data-testid={TEST_IDS.MOCK_CUSTOM_CONTENT}>Protected content</div>
      </PermissionGuard>
    );

    expect(screen.queryByTestId(TEST_IDS.MOCK_CUSTOM_CONTENT)).not.toBeTruthy();
  });

  it("renders fallback when user lacks permission", () => {
    mockHasPermission.mockReturnValue(false);
    mockHasAnyPermission.mockReturnValue(false);
    renderWithProviders(
      <PermissionGuard
        permission="users:write"
        fallback={<div data-testid={TEST_IDS.ACCESS_DENIED}>Access denied</div>}
      >
        <div data-testid={TEST_IDS.MOCK_CUSTOM_CONTENT}>Protected content</div>
      </PermissionGuard>
    );

    expect(screen.getByTestId(TEST_IDS.ACCESS_DENIED)).toBeTruthy();
    expect(screen.queryByTestId(TEST_IDS.MOCK_CUSTOM_CONTENT)).not.toBeTruthy();
  });

  it("renders children when user has any of the required permissions", () => {
    mockHasAnyPermission.mockReturnValue(true);
    renderWithProviders(
      <PermissionGuard
        permissions={["users:read", "users:write"]}
        requireAll={false}
      >
        <div data-testid={TEST_IDS.MOCK_CUSTOM_CONTENT}>Protected content</div>
      </PermissionGuard>
    );

    expect(screen.getByTestId(TEST_IDS.MOCK_CUSTOM_CONTENT)).toBeTruthy();
  });

  it("does not render children when user lacks all required permissions", () => {
    mockHasAnyPermission.mockReturnValue(false);
    renderWithProviders(
      <PermissionGuard
        permissions={["users:read", "users:write"]}
        requireAll={false}
      >
        <div data-testid={TEST_IDS.MOCK_CUSTOM_CONTENT}>Protected content</div>
      </PermissionGuard>
    );

    expect(screen.queryByTestId(TEST_IDS.MOCK_CUSTOM_CONTENT)).not.toBeTruthy();
  });

  it("renders children when user has all required permissions", () => {
    mockHasAllPermissions.mockReturnValue(true);
    renderWithProviders(
      <PermissionGuard
        permissions={["users:read", "users:write"]}
        requireAll={true}
      >
        <div data-testid={TEST_IDS.MOCK_CUSTOM_CONTENT}>Protected content</div>
      </PermissionGuard>
    );

    expect(screen.getByTestId(TEST_IDS.MOCK_CUSTOM_CONTENT)).toBeTruthy();
  });

  it("does not render children when user lacks any required permission", () => {
    mockHasAllPermissions.mockReturnValue(false);
    renderWithProviders(
      <PermissionGuard
        permissions={["users:read", "users:write"]}
        requireAll={true}
      >
        <div data-testid={TEST_IDS.MOCK_CUSTOM_CONTENT}>Protected content</div>
      </PermissionGuard>
    );

    expect(screen.queryByTestId(TEST_IDS.MOCK_CUSTOM_CONTENT)).not.toBeTruthy();
  });

  it("renders children when no permission is required", () => {
    renderWithProviders(
      <PermissionGuard>
        <div data-testid={TEST_IDS.MOCK_CUSTOM_CONTENT}>Protected content</div>
      </PermissionGuard>
    );

    expect(screen.getByTestId(TEST_IDS.MOCK_CUSTOM_CONTENT)).toBeTruthy();
  });

  it("renders while in loading state", () => {
    renderWithProviders(
      <PermissionGuard permission="users:read">
        <div data-testid={TEST_IDS.MOCK_CUSTOM_CONTENT}>Protected content</div>
      </PermissionGuard>
    );

    expect(screen.getByTestId(TEST_IDS.MOCK_CUSTOM_CONTENT)).toBeTruthy();
  });
});
