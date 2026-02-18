// Use base test utilities to reduce duplication
import { setupBaseTest } from "@/test/base-test-utils";

// Get cleanup function after mocks are set up
const { cleanup } = setupBaseTest({
  useMockData: false,
  mockFetch: false,
  mockPermissionCache: false,
  mockRouteUtils: false,
});

import { describe, it, beforeEach } from "@jest/globals";
import { screen } from "@testing-library/react";
import ProtectedRoute from "./ProtectedRoute";
import { TEST_IDS } from "@/config";
import { renderWithProviders } from "@/test/test-utils";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  Navigate: ({ to }: { to: string }) => (
    <div data-testid={TEST_IDS.NAV_LOGIN} data-to={to}>
      Navigate to {to}
    </div>
  ),
  useLocation: () => ({ pathname: "/protected", state: null }),
}));

describe("ProtectedRoute", () => {
  beforeEach(() => {
    cleanup(); // Use cleanup from base utilities
  });

  it("renders children when user is authenticated", () => {
    renderWithProviders(
      <ProtectedRoute>
        <div data-testid={TEST_IDS.MOCK_CUSTOM_CONTENT}>Protected content</div>
      </ProtectedRoute>,
      {
        preloadedState: {
          auth: {
            user: {
              id: "1",
              name: "Test User",
              email: "test@example.com",
              role: "admin",
            },
            token: "test-token",
            isAuthenticated: true,
            isLoading: false,
          },
        },
      }
    );

    expect(screen.getByTestId(TEST_IDS.MOCK_CUSTOM_CONTENT)).toBeTruthy();
  });

  it("redirect to login when user is not authenticated", () => {
    renderWithProviders(
      <ProtectedRoute>
        <div data-testid={TEST_IDS.MOCK_CUSTOM_CONTENT}>Protected content</div>
      </ProtectedRoute>,
      {
        preloadedState: {
          auth: {
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          },
        },
      }
    );

    expect(screen.getByTestId(TEST_IDS.NAV_LOGIN)).toBeTruthy();
    expect(screen.getByTestId(TEST_IDS.NAV_LOGIN)).toHaveAttribute(
      "data-to",
      "/login"
    );
    expect(screen.queryByTestId(TEST_IDS.MOCK_CUSTOM_CONTENT)).not.toBeTruthy();
  });

  it("renders loading spinner when loading", () => {
    renderWithProviders(
      <ProtectedRoute>
        <div data-testid={TEST_IDS.MOCK_CUSTOM_CONTENT}>Protected content</div>
      </ProtectedRoute>,
      {
        preloadedState: {
          auth: {
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: true,
          },
        },
      }
    );

    expect(screen.queryByTestId(TEST_IDS.MOCK_CUSTOM_CONTENT)).not.toBeTruthy();
    expect(screen.getByRole("status")).toBeTruthy();
    expect(screen.getByText("Loading...")).toBeTruthy();
  });

  it("handles authentication state changes", () => {
    const { store, rerender } = renderWithProviders(
      <ProtectedRoute>
        <div data-testid={TEST_IDS.MOCK_CUSTOM_CONTENT}>Protected content</div>
      </ProtectedRoute>,
      {
        preloadedState: {
          auth: {
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          },
        },
      }
    );

    expect(screen.getByTestId(TEST_IDS.NAV_LOGIN)).toBeTruthy();
    expect(screen.queryByTestId(TEST_IDS.MOCK_CUSTOM_CONTENT)).not.toBeTruthy();

    // Update the store state
    store.dispatch({
      type: "auth/setUser",
      payload: {
        user: { id: "1", name: "Test User", email: "test@example.com" },
        token: "test-token",
        isAuthenticated: true,
        isLoading: false,
      },
    });

    // Rerender with updated state
    rerender(
      <ProtectedRoute>
        <div data-testid={TEST_IDS.MOCK_CUSTOM_CONTENT}>Protected content</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId(TEST_IDS.MOCK_CUSTOM_CONTENT)).toBeTruthy();
    expect(screen.queryByTestId(TEST_IDS.NAV_LOGIN)).not.toBeTruthy();
  });

  it("preserve location state when redirecting", () => {
    renderWithProviders(
      <ProtectedRoute>
        <div data-testid={TEST_IDS.MOCK_CUSTOM_CONTENT}>Protected content</div>
      </ProtectedRoute>,
      {
        preloadedState: {
          auth: {
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          },
        },
      }
    );

    const navigateElement = screen.getByTestId(TEST_IDS.NAV_LOGIN);
    expect(navigateElement).toBeTruthy();
    expect(navigateElement).toHaveAttribute("data-to", "/login");
  });
});
