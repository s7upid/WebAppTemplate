jest.mock("@/store", () => ({
  store: {
    getState: jest.fn(() => ({})),
    dispatch: jest.fn(),
  },
}));

jest.mock("@/config", () => ({
  ERROR_MESSAGES: {
    TOKEN_REFRESH_FAILED: "Token refresh failed",
    LOGIN_FAILED: "Login failed",
    INVALID_RESPONSE_DATA: "Invalid response data",
  },
  TEST_IDS: {},
}));

jest.mock("@/config/constants", () => ({
  ERROR_MESSAGES: {
    TOKEN_REFRESH_FAILED: "Token refresh failed",
    LOGIN_FAILED: "Login failed",
    INVALID_RESPONSE_DATA: "Invalid response data",
  },
  TEST_IDS: {},
}));

jest.mock("@/config/navigation", () => ({
  getNavigationUrls: jest.fn(() => ({ main: "/" })),
}));

jest.mock("@/services/auth/authService", () => ({
  authService: {
    login: jest.fn(),
    refreshToken: jest.fn(),
    logout: jest.fn(),
  },
}));

jest.mock("@/utils", () => ({
  SecureStorage: {
    getToken: jest.fn(() => null),
    getUser: jest.fn(() => null),
    setToken: jest.fn(),
    setUser: jest.fn(),
    removeToken: jest.fn(),
    removeUser: jest.fn(),
    clear: jest.fn(),
  },
  env: {
    DEV: true,
    PROD: false,
    VITE_ENVIRONMENT: "test",
    VITE_USE_MOCK_DATA: "false",
    VITE_STORAGE_SECRET_KEY: "test-secret-key",
    VITE_GOOGLE_CLIENT_ID: "test-google-client-id",
    VITE_API_URL: "http://localhost:3000",
    VITE_APP_NAME: "test-app",
  },
  permissionCache: {
    clear: jest.fn(),
    initialize: jest.fn(),
    hasPermission: jest.fn(() => true),
    hasAnyPermission: jest.fn(() => true),
    hasAllPermissions: jest.fn(() => true),
    getAllPermissions: jest.fn(() => []),
    getPermissionDetails: jest.fn(),
    getPermissionsByCategory: jest.fn(() => []),
    getPermissionsByResource: jest.fn(() => []),
    isInitialized: jest.fn(() => false),
    subscribe: jest.fn(() => jest.fn()),
    getVersion: jest.fn(() => 0),
  },
  deriveEffectivePermissionKeys: jest.fn((keys, perms) => {
    const providedKeys = Array.isArray(keys) ? keys : [];
    const permissionObjectKeys = Array.isArray(perms)
      ? perms.map((p: any) => (typeof p === "string" ? p : p.key))
      : [];
    return Array.from(new Set([...providedKeys, ...permissionObjectKeys]));
  }),
  logger: { error: jest.fn(), warn: jest.fn(), info: jest.fn() },
  cn: jest.fn((...args) => args.filter(Boolean).join(" ")),
  Portal: ({ children }: any) => children,
}));

import { configureStore } from "@reduxjs/toolkit";
import { refreshToken, loginUser } from "./authSlice";
import authReducer from "./authSlice";
import { ERROR_MESSAGES } from "@/config";
import { authService } from "@/services/auth/authService";
import { SecureStorage } from "@/utils";
import { PERMISSION_KEYS } from "@/config/generated/permissionKeys.generated";

describe("authSlice - refreshToken", () => {
  let store: ReturnType<typeof configureStore> & { dispatch: any };

  beforeEach(() => {
    jest.clearAllMocks();

    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });
  });

  it("handles refreshToken.pending", () => {
    const action = refreshToken.pending("", undefined);
    expect(action.type).toBe("auth/refreshToken/pending");
  });

  it("handles refreshToken.fulfilled", async () => {
    const mockUser = {
      id: "1",
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
      permissionKeys: [PERMISSION_KEYS.USERS.VIEW, PERMISSION_KEYS.USERS.EDIT],
      permissions: [],
    };
    const mockToken = "new-refresh-token";

    (authService.refreshToken as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        user: mockUser,
        token: mockToken,
      },
    });

    const result = await store.dispatch(refreshToken());

    expect(result.type).toBe("auth/refreshToken/fulfilled");
    expect((result as any).payload).toEqual({
      user: mockUser,
      token: mockToken,
    });
    expect(SecureStorage.setToken).toHaveBeenCalledWith(mockToken);
    expect(SecureStorage.setUser).toHaveBeenCalledWith(mockUser);
  });

  it("handles refreshToken.rejected with error", async () => {
    const errorMessage = ERROR_MESSAGES.TOKEN_REFRESH_FAILED;
    (authService.refreshToken as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const result = await store.dispatch(refreshToken());

    expect(result.type).toBe("auth/refreshToken/rejected");
    expect((result as any).payload).toBe(errorMessage);
  });

  it("handles refreshToken with bad status response", async () => {
    (authService.refreshToken as jest.Mock).mockResolvedValue({
      success: false,
      status: 401,
      message: "Unauthorized",
    });

    const result = await store.dispatch(refreshToken());

    expect(result.type).toBe("auth/refreshToken/rejected");
    expect((result as any).payload).toBe("Unauthorized");
  });

  it("handles refreshToken with missing data", async () => {
    (authService.refreshToken as jest.Mock).mockResolvedValue({
      success: true,
      data: null,
      message: undefined,
      status: 200,
    });

    const result = await store.dispatch(refreshToken());

    expect(result.type).toBe("auth/refreshToken/rejected");
    expect((result as any).payload).toBe(ERROR_MESSAGES.TOKEN_REFRESH_FAILED);
  });

  it("handles refreshToken with network error", async () => {
    (authService.refreshToken as jest.Mock).mockRejectedValue(new Error("Network error"));

    const result = await store.dispatch(refreshToken());

    expect(result.type).toBe("auth/refreshToken/rejected");
    expect((result as any).payload).toBe("Network error");
  });

  it("handles refreshToken with unknown error", async () => {
    (authService.refreshToken as jest.Mock).mockRejectedValue("Unknown error");

    const result = await store.dispatch(refreshToken());

    expect(result.type).toBe("auth/refreshToken/rejected");
    expect((result as any).payload).toBe(ERROR_MESSAGES.TOKEN_REFRESH_FAILED);
  });

  describe("loginUser edge cases", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("handles login with 429 rate limit error", async () => {
      (authService.login as jest.Mock).mockResolvedValue({
        success: false,
        status: 429,
        message: "Rate limit exceeded. Maximum 5 requests per 15 minutes.",
      });

      const result = await store.dispatch(
        loginUser({ email: "test@example.com", password: "password123" })
      );

      expect(result.type).toBe("auth/login/rejected");
      expect((result as any).payload).toEqual({
        message: "Rate limit exceeded. Maximum 5 requests per 15 minutes.",
        status: 429,
      });
    });

    it("handles login with token revocation error", async () => {
      (authService.login as jest.Mock).mockResolvedValue({
        success: false,
        status: 401,
        message: "User token has been revoked. Please log in again.",
      });

      const result = await store.dispatch(
        loginUser({ email: "test@example.com", password: "password123" })
      );

      expect(result.type).toBe("auth/login/rejected");
      expect((result as any).payload).toEqual({
        message: "User token has been revoked. Please log in again.",
        status: 401,
      });
    });

    it("handles login with field errors", async () => {
      (authService.login as jest.Mock).mockResolvedValue({
        success: false,
        status: 400,
        message: "Validation failed",
        fieldErrors: {
          email: "Invalid email format",
          password: "Password required",
        },
      });

      const result = await store.dispatch(
        loginUser({ email: "invalid", password: "" })
      );

      expect(result.type).toBe("auth/login/rejected");
    });

    it("handles login with network error", async () => {
      (authService.login as jest.Mock).mockRejectedValue(new Error("Network error"));

      const result = await store.dispatch(
        loginUser({ email: "test@example.com", password: "password123" })
      );

      expect(result.type).toBe("auth/login/rejected");
      expect((result as any).payload).toEqual({
        message: "Network error",
      });
    });

    it("handles login with empty response", async () => {
      (authService.login as jest.Mock).mockResolvedValue({
        success: false,
        message: "",
      });

      const result = await store.dispatch(
        loginUser({ email: "test@example.com", password: "password123" })
      );

      expect(result.type).toBe("auth/login/rejected");
    });

    it("handles successful login", async () => {
      const mockUser = {
        id: "1",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
      };
      const mockToken = "test-token";

      (authService.login as jest.Mock).mockResolvedValue({
        success: true,
        data: {
          user: mockUser,
          token: mockToken,
        },
      });

      const result = await store.dispatch(
        loginUser({ email: "test@example.com", password: "password123" })
      );

      expect(result.type).toBe("auth/login/fulfilled");
      expect((result as any).payload).toEqual({
        user: mockUser,
        token: mockToken,
      });
      expect(SecureStorage.setToken).toHaveBeenCalledWith(mockToken);
      expect(SecureStorage.setUser).toHaveBeenCalledWith(mockUser);
    });
  });
});
