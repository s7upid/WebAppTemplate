// Use base test utilities to reduce duplication
import { setupBaseTest, getMockUtilsMocks, getMockDataMocks } from "@/test/base-test-utils";

// Set up mocks at top level (must call functions directly due to Jest hoisting)
jest.mock("@/mock/utils", () => getMockUtilsMocks());
jest.mock("@/mock", () => getMockDataMocks());
jest.mock("@/utils", () => ({
  env: {
    VITE_USE_MOCK_DATA: "true",
  },
}));

// Get cleanup function after mocks are set up
const { cleanup } = setupBaseTest({
  useMockData: true,
  mockFetch: false,
  mockPermissionCache: false,
  mockRouteUtils: false,
});

import { permissionService } from "./permissionService";

describe("PermissionService", () => {
  beforeEach(() => {
    cleanup();
  });

  describe("getPermissions", () => {
    it("returns permissions (paged) with default query", async () => {
      const result = await permissionService.getPermissions({
        page: 1,
        pageSize: 10,
      } as any);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(Array.isArray((result.data as any).items)).toBe(true);
      expect((result.data as any).items.length).toBeGreaterThan(0);
    });

    it("paginates permissions with provided page and size", async () => {
      const query = {
        page: 1,
        pageSize: 10,
      } as any;

      const result = await permissionService.getPermissions(query);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect((result.data as any).pageNumber).toBe(1);
      expect((result.data as any).pageSize).toBe(10);
    });

    it("filters permissions by search term", async () => {
      const query = { searchTerm: "user" } as any;
      const result = await permissionService.getPermissions(query);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });
});
