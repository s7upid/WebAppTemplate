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

import { roleService } from "./roleService";
import { PERMISSION_KEYS } from "@/config/generated/permissionKeys.generated";

describe("RoleService", () => {
  beforeEach(() => {
    cleanup();
  });

  describe("getRoles", () => {
    it("gets roles (paged) with default query", async () => {
      const result = await roleService.getRoles({
        page: 1,
        pageSize: 10,
      } as any);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(Array.isArray((result.data as any).items)).toBe(true);
      expect((result.data as any).items.length).toBeGreaterThan(0);
    });

    it("gets roles with pagination", async () => {
      const query = {
        page: 1,
        pageSize: 10,
      } as any;

      const result = await roleService.getRoles(query);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect((result.data as any).pageNumber).toBe(1);
      expect((result.data as any).pageSize).toBe(10);
    });

    it("gets roles with search", async () => {
      const query = { searchTerm: "admin" } as any;
      const result = await roleService.getRoles(query);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it("gets roles with sorting", async () => {
      const query = { sortColumn: "name", ascending: true } as any;
      const result = await roleService.getRoles(query);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect((result.data as any).items.length).toBeGreaterThan(0);
    });

    it("combine search and sorting", async () => {
      const query = {
        searchTerm: "user",
        sortColumn: "name",
        ascending: true,
      } as any;
      const result = await roleService.getRoles(query);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe("getRoleById", () => {
    it("gets role by valid ID", async () => {
      const roleId = "1";

      const result = await roleService.getRoleById(roleId);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect((result.data as any).id).toBe(roleId);
    });
  });

  describe("createRole", () => {
    it("create role successfully", async () => {
      const roleData = {
        name: "Test Role",
        description: "A test role",
        permissionKeys: [PERMISSION_KEYS.USERS.VIEW],
      };

      const result = await roleService.createRole(roleData);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data.name).toBe(roleData.name);
    });
  });

  describe("updateRole", () => {
    it("update role successfully", async () => {
      const roleId = "1";
      const updateData = {
        name: "Updated Role",
        description: "Updated description",
        permissionKeys: undefined,
      };

      const result = await roleService.updateRole(roleId, updateData);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe("deleteRole", () => {
    it("delete role successfully when not system role", async () => {
      // Find a non-system role
      const rolesResult = await roleService.getRoles({ page: 1, pageSize: 100 } as any);
      const roles = (rolesResult.data as any).items;
      const nonSystemRole = roles.find((r: any) => !r.isSystem);
      
      if (!nonSystemRole) {
        // If no non-system role exists, create one first
        const createResult = await roleService.createRole({
          name: "Test Delete Role",
          description: "Role to be deleted",
          permissionKeys: [],
        });
        const roleId = (createResult.data as any).id;
        const result = await roleService.deleteRole(roleId);
        expect(result.success).toBe(true);
      } else {
        const result = await roleService.deleteRole(nonSystemRole.id);
        expect(result.success).toBe(true);
      }
    });
  });

  describe("updateRolePermissions", () => {
    it("update role permissions successfully", async () => {
      const roleId = "1";
      const permissions = [
        PERMISSION_KEYS.USERS.VIEW,
        PERMISSION_KEYS.USERS.EDIT,
      ];

      const result = await roleService.updateRolePermissions(
        roleId,
        permissions
      );

      expect(result.success).toBe(true);
    });

    it("fail with invalid role ID", () => {
      const roleId = "invalid-id";
      const permissions = [PERMISSION_KEYS.USERS.VIEW];

      return expect(
        roleService.updateRolePermissions(roleId, permissions)
      ).rejects.toThrow();
    });
  });
});
