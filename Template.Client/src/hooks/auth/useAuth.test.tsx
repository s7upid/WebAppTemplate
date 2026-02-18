// Use base test utilities to reduce duplication
import { setupBaseTest, getSliceMocks } from "@/test/base-test-utils";

// Use factory function to avoid hoisting issues
jest.mock("@/store", () => getSliceMocks().store);

const { cleanup } = setupBaseTest({
  useMockData: false,
  mockFetch: false,
  mockPermissionCache: false,
  mockRouteUtils: false,
});

import React from "react";
import { renderHook, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { useAuth } from "./useAuth";
import { PERMISSION_KEYS } from "@/config/generated/permissionKeys.generated";
import { ERROR_MESSAGES } from "@/config";
import { authService } from "@/services/auth/authService";

jest.mock("@/services/auth/authService", () => ({
  authService: {
    login: jest.fn(),
    logout: jest.fn(),
    refreshToken: jest.fn(),
    getCurrentUser: jest.fn(),
    forgotPassword: jest.fn(),
    setupPassword: jest.fn(),
    changePassword: jest.fn(),
  },
}));

const createMockStore = (isAuthenticated = false, user = null) => {
  return configureStore({
    reducer: {
      auth: (state = { isAuthenticated, user, token: null }) => state,
    },
  });
};

const wrapper = ({
  children,
  isAuthenticated = false,
  user = null,
}: {
  children: React.ReactNode;
  isAuthenticated?: boolean;
  user?: any;
}) => (
  <Provider store={createMockStore(isAuthenticated, user)}>{children}</Provider>
);

describe("useAuth", () => {
  beforeEach(() => {
    cleanup();
  });

  it("returns initial auth state", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });

  it("returns authenticated state", () => {
    const mockUser = { id: "1", email: "test@example.com", name: "Test User" };

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) =>
        wrapper({ children, isAuthenticated: true, user: mockUser }),
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
  });

  it("performs login and calls authService.login", async () => {
    const mockUser = { id: "1", email: "test@example.com", name: "Test User" };
    const mockToken = "mock-token";

    (authService.login as jest.Mock).mockResolvedValue({
      success: true,
      data: { user: mockUser, token: mockToken },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login({
        email: "test@example.com",
        password: "password",
      });
    });

    expect(authService.login).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password",
    });
  });

  it("returns rejected action when login fails", async () => {
    (authService.login as jest.Mock).mockRejectedValue(
      new Error(ERROR_MESSAGES.LOGIN_FAILED)
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      const actionResult = await result.current.login({
        email: "test@example.com",
        password: "password",
      });
      expect(actionResult.type).toContain("rejected");
    });
  });

  it("performs logout and calls authService.logout", async () => {
    (authService.logout as jest.Mock).mockResolvedValue({ success: true });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.logout();
    });

    expect(authService.logout).toHaveBeenCalled();
  });

  it("returns fulfilled action when logout error is swallowed", async () => {
    (authService.logout as jest.Mock).mockRejectedValue(
      new Error("Logout failed")
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      const actionResult = await result.current.logout();
      expect(actionResult.type).toContain("fulfilled");
    });
  });

  it("refreshes token and fetches current user", async () => {
    const mockToken = "new-token";

    (authService.refreshToken as jest.Mock).mockResolvedValue({
      success: true,
      data: { token: mockToken },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.refreshUser();
    });

    expect(authService.getCurrentUser).toHaveBeenCalled();
  });

  it("performs refresh token and calls authService.refreshToken", async () => {
    const mockUser = { id: "1", email: "test@example.com", name: "Test User" };
    const mockToken = "new-refresh-token";

    (authService.refreshToken as jest.Mock).mockResolvedValue({
      success: true,
      data: { user: mockUser, token: mockToken },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.refreshToken();
    });

    expect(authService.refreshToken).toHaveBeenCalled();
  });

  it("returns fulfilled action when refresh token succeeds", async () => {
    const mockUser = { id: "1", email: "test@example.com", name: "Test User" };
    const mockToken = "new-refresh-token";

    (authService.refreshToken as jest.Mock).mockResolvedValue({
      success: true,
      data: { user: mockUser, token: mockToken },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      const actionResult = await result.current.refreshToken();
      expect(actionResult.type).toContain("fulfilled");
    });
  });

  it("returns rejected action when refresh token fails", async () => {
    (authService.refreshToken as jest.Mock).mockRejectedValue(
      new Error("Refresh token failed")
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      const actionResult = await result.current.refreshToken();
      expect(actionResult.type).toContain("rejected");
    });
  });

  it("returns rejected action when refresh fails", async () => {
    (authService.getCurrentUser as jest.Mock).mockRejectedValue(
      new Error("Refresh failed")
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      const actionResult = await result.current.refreshUser();
      expect(actionResult.type).toContain("rejected");
    });
  });

  it("returns user data when authenticated", () => {
    const mockUser = {
      id: "1",
      email: "test@example.com",
      name: "Test User",
      permissions: [PERMISSION_KEYS.USERS.VIEW, PERMISSION_KEYS.USERS.EDIT],
    };

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) =>
        wrapper({ children, isAuthenticated: true, user: mockUser }),
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("returns user role when authenticated", () => {
    const mockUser = {
      id: "1",
      email: "test@example.com",
      name: "Test User",
      role: "admin",
    };

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) =>
        wrapper({ children, isAuthenticated: true, user: mockUser }),
    });

    expect(result.current.user?.role).toBe("admin");
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("returns empty permissions array when present but empty", () => {
    const mockUser = {
      id: "1",
      email: "test@example.com",
      name: "Test User",
      permissions: [],
    };

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) =>
        wrapper({ children, isAuthenticated: true, user: mockUser }),
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.permissions).toEqual([]);
  });

  it("returns user object without role when not provided", () => {
    const mockUser = {
      id: "1",
      email: "test@example.com",
      name: "Test User",
    };

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) =>
        wrapper({ children, isAuthenticated: true, user: mockUser }),
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("returns unauthenticated state when user not present", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it("exposes login function", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.login).toBeDefined();
    expect(typeof result.current.login).toBe("function");
  });
});
