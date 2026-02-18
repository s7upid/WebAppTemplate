import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuditQuery } from "./useAuditQuery";
import { auditService } from "@/services/entities/auditService";
import { AuditLog, AuditEventType } from "@/models";

// Mock the auditService
jest.mock("@/services/entities/auditService", () => ({
  auditService: {
    getLogs: jest.fn(),
  },
}));

const mockAuditService = auditService as jest.Mocked<typeof auditService>;

const mockAuditLog: AuditLog = {
  id: "1",
  eventType: AuditEventType.Login,
  description: "User logged in",
  userId: "admin-1",
  user: undefined,
  userAgent: "Mozilla/5.0",
  timestamp: new Date(),
  success: true,
  errorMessage: undefined,
  preChangeValue: undefined,
  postChangeValue: undefined,
};

const mockPaginatedResponse = {
  success: true,
  data: {
    items: [mockAuditLog],
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
    },
  });

const createWrapper = () => {
  const queryClient = createTestQueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useAuditQuery", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetching audit logs", () => {
    it("fetches audit logs on mount", async () => {
      mockAuditService.getLogs.mockResolvedValue(mockPaginatedResponse);

      const { result } = renderHook(() => useAuditQuery(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.auditLogs).toHaveLength(1);
      expect(result.current.auditLogs[0].eventType).toBe(AuditEventType.Login);
      expect(mockAuditService.getLogs).toHaveBeenCalledWith({
        page: 1,
        pageSize: 10,
      });
    });

    it("handles fetch error", async () => {
      mockAuditService.getLogs.mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() => useAuditQuery(), {
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
      mockAuditService.getLogs.mockResolvedValue(mockPaginatedResponse);

      const { result } = renderHook(() => useAuditQuery(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.paginationHandlers.changePage(2);
      });

      await waitFor(() => {
        expect(mockAuditService.getLogs).toHaveBeenCalledWith(
          expect.objectContaining({ page: 2 })
        );
      });
    });

    it("changes page size", async () => {
      mockAuditService.getLogs.mockResolvedValue(mockPaginatedResponse);

      const { result } = renderHook(() => useAuditQuery(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.paginationHandlers.changePageSize(25);
      });

      await waitFor(() => {
        expect(mockAuditService.getLogs).toHaveBeenCalledWith(
          expect.objectContaining({ pageSize: 25, page: 1 })
        );
      });
    });

    it("clears filters", async () => {
      mockAuditService.getLogs.mockResolvedValue(mockPaginatedResponse);

      const { result } = renderHook(
        () => useAuditQuery({ page: 2, pageSize: 10, searchTerm: "test" }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.paginationHandlers.clearAll();
      });

      await waitFor(() => {
        expect(mockAuditService.getLogs).toHaveBeenLastCalledWith(
          expect.objectContaining({ page: 1 })
        );
      });
    });

    it("refreshes with params", async () => {
      mockAuditService.getLogs.mockResolvedValue(mockPaginatedResponse);

      const { result } = renderHook(() => useAuditQuery(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.paginationHandlers.refreshWithParams({
          searchTerm: "login",
          filters: { eventType: "Login" },
        });
      });

      await waitFor(() => {
        expect(mockAuditService.getLogs).toHaveBeenCalledWith(
          expect.objectContaining({
            page: 1,
            searchTerm: "login",
          })
        );
      });
    });
  });

  it("provides correct pagination result structure", async () => {
    mockAuditService.getLogs.mockResolvedValue(mockPaginatedResponse);

    const { result } = renderHook(() => useAuditQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.paginationResult).toEqual({
      items: [mockAuditLog],
      totalCount: 1,
      pageNumber: 1,
      pageSize: 10,
      totalPages: 1,
    });
  });
});
