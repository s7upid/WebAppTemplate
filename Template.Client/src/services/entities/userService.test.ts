jest.mock("@/utils", () => ({
  env: {
    VITE_USE_MOCK_DATA: "true",
    VITE_API_URL: "http://localhost:3000",
    VITE_STORAGE_SECRET_KEY: "test-secret-key",
  },
  SecureStorage: {
    getToken: jest.fn(() => "mock-token"),
    setToken: jest.fn(),
    setUser: jest.fn(),
    getUser: jest.fn(() => null),
    clear: jest.fn(),
  },
  logger: { error: jest.fn(), warn: jest.fn(), info: jest.fn() },
}));

import { userService } from "./userService";

describe("UserService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getUsers with sorting", () => {
    it("returns users when called with basic query", async () => {
      const query = {
        sortColumn: "lastName",
        ascending: true,
      } as any;

      const result = await userService.getUsers(query);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      if (result.data) {
        expect(result.data.items).toBeDefined();
        expect(Array.isArray(result.data.items)).toBe(true);
      }
    });

    it("returns users sorted by name in ascending order", async () => {
      const query = {
        sortColumn: "lastName",
        ascending: true,
      } as any;

      const result = await userService.getUsers(query);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      if (result.data && result.data.items && result.data.items.length > 1) {
        for (let i = 0; i < result.data.items.length - 1; i++) {
          const currentName =
            `${result.data.items[i].firstName} ${result.data.items[i].lastName}`.toLowerCase();
          const nextName = `${result.data.items[i + 1].firstName} ${
            result.data.items[i + 1].lastName
          }`.toLowerCase();
          expect(currentName <= nextName).toBe(true);
        }
      }
    });

    it("returns users sorted by name in descending order", async () => {
      const query = {
        sortColumn: "lastName",
        ascending: false,
      } as any;

      const result = await userService.getUsers(query);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      if (result.data && result.data.items && result.data.items.length > 1) {
        for (let i = 0; i < result.data.items.length - 1; i++) {
          const currentName =
            `${result.data.items[i].firstName} ${result.data.items[i].lastName}`.toLowerCase();
          const nextName = `${result.data.items[i + 1].firstName} ${
            result.data.items[i + 1].lastName
          }`.toLowerCase();
          expect(currentName >= nextName).toBe(true);
        }
      }
    });

    it("returns users with pagination", async () => {
      const query = {
        page: 1,
        pageSize: 2,
        sortColumn: "lastName",
        ascending: true,
      } as any;

      const result = await userService.getUsers(query);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      if (result.data) {
        expect(result.data.items.length).toBeLessThanOrEqual(2);
        expect(result.data.pageNumber).toBe(1);
        expect(result.data.pageSize).toBe(2);
      }
    });

    it("returns users when searching", async () => {
      const query = {
        searchTerm: "john",
        sortColumn: "email",
        ascending: true,
      } as any;

      const result = await userService.getUsers(query);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      if (result.data && result.data.items) {
        result.data.items.forEach((user) => {
          const searchTerm = "john";
          const matchesSearch =
            user.firstName?.toLowerCase().includes(searchTerm) ||
            user.lastName?.toLowerCase().includes(searchTerm) ||
            user.email?.toLowerCase().includes(searchTerm) ||
            user.role?.name?.toLowerCase().includes(searchTerm);
          expect(matchesSearch).toBe(true);
        });
      }
    });

    it("returns unsorted data when no sortColumn is provided", async () => {
      const query = {} as any;

      const result = await userService.getUsers(query);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      if (result.data && result.data.items) {
        expect(result.data.items.length).toBeGreaterThan(0);
        expect(result.data.items[0].id).toBeDefined();
      }
    });
  });
});
