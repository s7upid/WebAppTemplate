import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useDashboardQuery } from "./useDashboardQuery";
import { dashboardService } from "@/services/entities/dashboardService";
import { AuditLog, AuditEventType } from "@/models";

// Mock the dashboardService
jest.mock("@/services/entities/dashboardService", () => ({
  dashboardService: {
    getRecentAuditLogs: jest.fn(),
  },
}));

const mockDashboardService = dashboardService as jest.Mocked<
  typeof dashboardService
>;

const mockAuditLog: AuditLog = {
  id: "1",
  eventType: AuditEventType.Login,
  description: "User logged in",
  userId: "user-1",
  user: undefined,
  userAgent: "Mozilla/5.0",
  timestamp: new Date(),
  success: true,
  errorMessage: undefined,
  preChangeValue: undefined,
  postChangeValue: undefined,
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

describe("useDashboardQuery", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches recent audit logs", async () => {
    mockDashboardService.getRecentAuditLogs.mockResolvedValue({
      success: true,
      data: {
        items: [mockAuditLog],
        totalCount: 1,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 1,
      },
      message: "",
    });

    const { result } = renderHook(() => useDashboardQuery(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.recentLogs).toHaveLength(1);
    expect(result.current.recentLogs[0].eventType).toBe(AuditEventType.Login);
    expect(mockDashboardService.getRecentAuditLogs).toHaveBeenCalled();
  });

  it("handles fetch error", async () => {
    mockDashboardService.getRecentAuditLogs.mockRejectedValue(
      new Error("Network error")
    );

    const { result } = renderHook(() => useDashboardQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Network error");
  });

  it("returns empty array when no data", async () => {
    mockDashboardService.getRecentAuditLogs.mockResolvedValue({
      success: true,
      data: {
        items: [],
        totalCount: 0,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 0,
      },
      message: "",
    });

    const { result } = renderHook(() => useDashboardQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.recentLogs).toEqual([]);
  });

  it("provides refetch function", async () => {
    mockDashboardService.getRecentAuditLogs.mockResolvedValue({
      success: true,
      data: { items: [mockAuditLog], totalCount: 1, pageNumber: 1, pageSize: 10, totalPages: 1 },
      message: "",
    });

    const { result } = renderHook(() => useDashboardQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(typeof result.current.refetch).toBe("function");
    expect(typeof result.current.refetchLogs).toBe("function");
  });
});
