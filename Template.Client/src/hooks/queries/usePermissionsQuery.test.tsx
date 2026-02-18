import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePermissionsQuery, useAllPermissions } from "./usePermissionsQuery";
import { permissionService } from "@/services/entities/permissionService";
import { PermissionResponse } from "@/models";

// Mock the permissionService
jest.mock("@/services/entities/permissionService", () => ({
  permissionService: {
    getPermissions: jest.fn(),
  },
}));

const mockPermissionService = permissionService as jest.Mocked<
  typeof permissionService
>;

const mockPermission: PermissionResponse = {
  id: "1",
  key: "users:view",
  name: "View Users",
  description: "Can view users",
  category: "Users",
  action: "view",
  resource: "users",
  isSystem: false,
  createdAt: new Date(),
};

const mockPaginatedResponse = {
  success: true,
  data: {
    items: [mockPermission],
    totalCount: 1,
    pageNumber: 1,
    pageSize: 100,
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
    },
  });

const createWrapper = () => {
  const queryClient = createTestQueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("usePermissionsQuery", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetching permissions", () => {
    it("fetches permissions on mount", async () => {
      mockPermissionService.getPermissions.mockResolvedValue(
        mockPaginatedResponse
      );

      const { result } = renderHook(() => usePermissionsQuery(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.permissions).toHaveLength(1);
      expect(result.current.permissions[0].key).toBe("users:view");
      expect(mockPermissionService.getPermissions).toHaveBeenCalledWith({
        page: 1,
        pageSize: 100,
      });
    });

    it("handles fetch error", async () => {
      mockPermissionService.getPermissions.mockRejectedValue(
        new Error("Network error")
      );

      const { result } = renderHook(() => usePermissionsQuery(), {
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
      mockPermissionService.getPermissions.mockResolvedValue(
        mockPaginatedResponse
      );

      const { result } = renderHook(() => usePermissionsQuery(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.paginationHandlers.changePage(2);
      });

      await waitFor(() => {
        expect(mockPermissionService.getPermissions).toHaveBeenCalledWith(
          expect.objectContaining({ page: 2 })
        );
      });
    });

    it("clears filters", async () => {
      mockPermissionService.getPermissions.mockResolvedValue(
        mockPaginatedResponse
      );

      const { result } = renderHook(
        () =>
          usePermissionsQuery({ page: 2, pageSize: 100, searchTerm: "test" }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.paginationHandlers.clearAll();
      });

      await waitFor(() => {
        expect(mockPermissionService.getPermissions).toHaveBeenLastCalledWith(
          expect.objectContaining({ page: 1 })
        );
      });
    });

    it("refreshes with params", async () => {
      mockPermissionService.getPermissions.mockResolvedValue(
        mockPaginatedResponse
      );

      const { result } = renderHook(() => usePermissionsQuery(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.paginationHandlers.refreshWithParams({
          searchTerm: "user",
          filters: { category: "Users" },
        });
      });

      await waitFor(() => {
        expect(mockPermissionService.getPermissions).toHaveBeenCalledWith(
          expect.objectContaining({
            page: 1,
            searchTerm: "user",
          })
        );
      });
    });
  });
});

describe("useAllPermissions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches all permissions with large page size", async () => {
    mockPermissionService.getPermissions.mockResolvedValue({
      ...mockPaginatedResponse,
      data: {
        ...mockPaginatedResponse.data,
        pageSize: 1000,
      },
    });

    const { result } = renderHook(() => useAllPermissions(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.permissions).toHaveLength(1);
    expect(mockPermissionService.getPermissions).toHaveBeenCalledWith({
      page: 1,
      pageSize: 1000,
    });
  });

  it("returns empty array when no data", async () => {
    mockPermissionService.getPermissions.mockResolvedValue({
      success: true,
      data: {
        items: [],
        totalCount: 0,
        pageNumber: 1,
        pageSize: 1000,
        totalPages: 0,
      },
      message: "",
    });

    const { result } = renderHook(() => useAllPermissions(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.permissions).toEqual([]);
  });

  it("handles fetch error", async () => {
    mockPermissionService.getPermissions.mockRejectedValue(
      new Error("Permission fetch failed")
    );

    const { result } = renderHook(() => useAllPermissions(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Permission fetch failed");
  });
});
