import { mockAuth } from "@/mock";

jest.mock("@/mock/utils", () => ({
  delay: jest.fn().mockResolvedValue(undefined),
  extractUserIdFromToken: (token: string) => {
    if (!token) return null;
    const match = token.match(/mock-jwt-token-(\d+)/);
    return match ? match[1] : "1";
  },
  createSuccessResponse: (data: any) => ({
    success: true,
    data,
    message: "",
  }),
  generateMockToken: (userId: string) => `mock-jwt-token-${userId}`,
  createErrorResponse: (message: string) => ({
    success: false,
    data: null,
    message,
  }),
  paginateData: (data: any[], page: number, pageSize: number) => ({
    items: data.slice((page - 1) * pageSize, page * pageSize),
    totalCount: data.length,
    pageNumber: page,
    pageSize,
    totalPages: Math.ceil(data.length / pageSize),
  }),
  filterData: (data: any[]) => data,
}));

jest.mock("@/utils", () => ({
  env: {
    VITE_USE_MOCK_DATA: "true",
    VITE_API_URL: "http://localhost:3000",
    VITE_STORAGE_SECRET_KEY: "test-secret-key",
  },
  SecureStorage: {
    getToken: jest.fn(() => "mock-jwt-token-1"),
    setToken: jest.fn(),
    setUser: jest.fn(),
    getUser: jest.fn(() => null),
    clear: jest.fn(),
  },
  logger: { error: jest.fn(), warn: jest.fn(), info: jest.fn() },
}));

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("login with valid credentials using mockAuth directly", async () => {
      const credentials = {
        email: "admin@admin.com",
        password: "admin123",
      };

      const result = await mockAuth.login(credentials);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      if (result.data) {
        expect(result.data.user).toBeDefined();
        expect(result.data.token).toBeDefined();
      }
    });

    it("fail with invalid credentials using mockAuth directly", async () => {
      const credentials = {
        email: "invalid@example.com",
        password: "wrongpassword",
      };

      const result = await mockAuth.login(credentials);

      expect(result).toBeDefined();
      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });

    it("fail with empty credentials using mockAuth directly", async () => {
      const credentials = {
        email: "",
        password: "",
      };

      const result = await mockAuth.login(credentials);

      expect(result).toBeDefined();
      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });
  });

  describe("logout", () => {
    it("logout successfully using mockAuth directly", async () => {
      const result = await mockAuth.logout();

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });
  });

  describe("refreshToken", () => {
    it("refresh token returns result", async () => {
      const result = await mockAuth.refreshToken();
      expect(result).toBeDefined();
      expect(typeof result.success).toBe("boolean");
    });

    it("refresh token returns data when user found", async () => {
      const result = await mockAuth.refreshToken();
      expect(result).toBeDefined();
      if (result.success && result.data) {
        expect(result.data.user).toBeDefined();
        expect(result.data.token).toBeDefined();
        expect(result.data.expiresAt).toBeDefined();
        expect(result.data.expiresAt).toBeInstanceOf(Date);
      }
    });
  });

  describe("getCurrentUser", () => {
    it("getCurrentUser returns result", async () => {
      const result = await mockAuth.getCurrentUser();
      expect(result).toBeDefined();
      expect(typeof result.success).toBe("boolean");
    });
  });

  describe("setupPassword", () => {
    it("setup password successfully with valid token using mockAuth directly", async () => {
      const request = {
        token: "valid-setup-token",
        password: "newPassword123",
      };

      const result = await mockAuth.setupPassword(request);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it("fail with invalid token using mockAuth directly", async () => {
      const request = {
        token: "invalid-token",
        password: "newPassword123",
      };

      const result = await mockAuth.setupPassword(request);

      expect(result).toBeDefined();
      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });

    it("fail with weak password using mockAuth directly", async () => {
      const request = {
        token: "valid-setup-token",
        password: "123",
      };

      const result = await mockAuth.setupPassword(request);

      expect(result).toBeDefined();
      expect(result.success).toBe(false);
    });
  });

  describe("changePassword", () => {
    it("change password returns result", async () => {
      const passwordData = {
        currentPassword: "currentPassword123",
        newPassword: "newPassword123",
        confirmPassword: "newPassword123",
      };

      const result = await mockAuth.changePassword(passwordData);

      expect(result).toBeDefined();
      expect(typeof result.success).toBe("boolean");
    });

    it("change password fails with wrong current password", async () => {
      const passwordData = {
        currentPassword: "wrongPassword",
        newPassword: "newPassword123",
        confirmPassword: "newPassword123",
      };

      const result = await mockAuth.changePassword(passwordData);

      expect(result).toBeDefined();
      expect(result.success).toBe(false);
    });

    it("change password fails when passwords do not match", async () => {
      const passwordData = {
        currentPassword: "currentPassword123",
        newPassword: "newPassword123",
        confirmPassword: "differentPassword",
      };

      const result = await mockAuth.changePassword(passwordData);

      expect(result).toBeDefined();
      expect(result.success).toBe(false);
    });
  });

  describe("forgotPassword", () => {
    it("send reset email successfully with existing user email", async () => {
      const request = {
        email: "admin@admin.com",
      };

      const result = await mockAuth.forgotPassword(request);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it("fail with non-existing user email", async () => {
      const request = {
        email: "nonexistent@example.com",
      };

      const result = await mockAuth.forgotPassword(request);

      expect(result).toBeDefined();
      expect(result.success).toBe(false);
    });

    it("fail with invalid email format", async () => {
      const request = {
        email: "invalid-email",
      };

      const result = await mockAuth.forgotPassword(request);

      expect(result).toBeDefined();
      expect(result.success).toBe(false);
    });

    it("fail with empty email", async () => {
      const request = {
        email: "",
      };

      const result = await mockAuth.forgotPassword(request);

      expect(result).toBeDefined();
      expect(result.success).toBe(false);
    });
  });
});
