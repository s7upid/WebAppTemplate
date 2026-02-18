import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRolesQuery, useRoleQuery } from "./useRolesQuery";
import { roleService } from "@/services/entities/roleService";
import { RoleResponse } from "@/models";

// Mock the roleService
jest.mock("@/services/entities/roleService", () => ({
  roleService: {
    getRoles: jest.fn(),
    getRoleById: jest.fn(),
    createRole: jest.fn(),
    updateRole: jest.fn(),
    deleteRole: jest.fn(),
    updateRolePermissions: jest.fn(),
  },
}));

const mockRoleService = roleService as jest.Mocked<typeof roleService>;

const mockRole: RoleResponse = {
  id: "1",
  name: "Administrator",
  description: "Admin role",
  isSystem: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  permissions: [],
  users: [],
};

const mockPaginatedResponse = {
  success: true,
  data: {
    items: [mockRole],
    totalCount: 1,
    pageNumber: 1,
    pageSize: 10,
    totalPages: 1,
  },
  message: "",
};

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

const createWrapper = () => {
  const queryClient = createTestQueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useRolesQuery", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetching roles", () => {
    it("fetches roles on mount", async () => {
      mockRoleService.getRoles.mockResolvedValue(mockPaginatedResponse);

      const { result } = renderHook(() => useRolesQuery(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.roles).toHaveLength(1);
      expect(result.current.roles[0].name).toBe("Administrator");
      expect(mockRoleService.getRoles).toHaveBeenCalledWith({
        page: 1,
        pageSize: 10,
      });
    });

    it("handles fetch error", async () => {
      mockRoleService.getRoles.mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() => useRolesQuery(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Network error");
    });
  });

  describe("pagination", () => {
    it("changes page", async () => {
      mockRoleService.getRoles.mockResolvedValue(mockPaginatedResponse);

      const { result } = renderHook(() => useRolesQuery(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.paginationHandlers.changePage(2);
      });

      await waitFor(() => {
        expect(mockRoleService.getRoles).toHaveBeenCalledWith(
          expect.objectContaining({ page: 2 }),
        );
      });
    });

    it("changes page size", async () => {
      mockRoleService.getRoles.mockResolvedValue(mockPaginatedResponse);

      const { result } = renderHook(() => useRolesQuery(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.paginationHandlers.changePageSize(25);
      });

      await waitFor(() => {
        expect(mockRoleService.getRoles).toHaveBeenCalledWith(
          expect.objectContaining({ pageSize: 25, page: 1 }),
        );
      });
    });
  });

  describe("mutations", () => {
    it("creates role", async () => {
      mockRoleService.getRoles.mockResolvedValue(mockPaginatedResponse);
      mockRoleService.createRole.mockResolvedValue({
        success: true,
        data: mockRole,
        message: "",
      });

      const { result } = renderHook(() => useRolesQuery(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const createResult = await result.current.add({
        name: "New Role",
        description: "New role description",
        permissionKeys: [],
      });

      expect(createResult.success).toBe(true);
      expect(mockRoleService.createRole).toHaveBeenCalled();
    });

    it("updates role", async () => {
      mockRoleService.getRoles.mockResolvedValue(mockPaginatedResponse);
      mockRoleService.updateRole.mockResolvedValue({
        success: true,
        data: { ...mockRole, name: "Updated" },
        message: "",
      });

      const { result } = renderHook(() => useRolesQuery(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const updateResult = await result.current.edit({
        id: "1",
        data: {
          name: "Updated",
          description: "Updated description",
          permissionKeys: [],
        },
      });

      expect(updateResult.success).toBe(true);
      expect(mockRoleService.updateRole).toHaveBeenCalledWith("1", {
        name: "Updated",
        description: "Updated description",
        permissionKeys: [],
      });
    });

    it("deletes role", async () => {
      mockRoleService.getRoles.mockResolvedValue(mockPaginatedResponse);
      mockRoleService.deleteRole.mockResolvedValue({
        success: true,
        data: "",
        message: "",
      });

      const { result } = renderHook(() => useRolesQuery(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const deleteResult = await result.current.remove("1");

      expect(deleteResult.success).toBe(true);
      expect(mockRoleService.deleteRole).toHaveBeenCalledWith("1");
    });

    it("updates role permissions", async () => {
      mockRoleService.getRoles.mockResolvedValue(mockPaginatedResponse);
      mockRoleService.updateRolePermissions.mockResolvedValue({
        success: true,
        data: mockRole,
        message: "",
      });

      const { result } = renderHook(() => useRolesQuery(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const updateResult = await result.current.updatePermissions("1", [
        "perm-1",
        "perm-2",
      ]);

      expect(updateResult.success).toBe(true);
      expect(mockRoleService.updateRolePermissions).toHaveBeenCalledWith("1", [
        "perm-1",
        "perm-2",
      ]);
    });
  });
});

describe("useRoleQuery", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches single role by id", async () => {
    mockRoleService.getRoleById.mockResolvedValue({
      success: true,
      data: mockRole,
      message: "",
    });

    const { result } = renderHook(() => useRoleQuery("1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.role?.name).toBe("Administrator");
    expect(mockRoleService.getRoleById).toHaveBeenCalledWith("1");
  });

  it("does not fetch when id is undefined", async () => {
    const { result } = renderHook(() => useRoleQuery(undefined), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockRoleService.getRoleById).not.toHaveBeenCalled();
  });

  it("handles fetch error", async () => {
    mockRoleService.getRoleById.mockRejectedValue(new Error("Role not found"));

    const { result } = renderHook(() => useRoleQuery("999"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Role not found");
  });
});
