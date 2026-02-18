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

import { dashboardService } from "./dashboardService";

describe("DashboardService", () => {
  beforeEach(() => {
    cleanup();
  });
  it("returns recent audit logs successfully", async () => {
    const result = await dashboardService.getRecentAuditLogs();

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data.items).toBeDefined();
    expect(Array.isArray(result.data.items)).toBe(true);
  });

  it("handles API failure scenarios", async () => {
    const originalRequest = (dashboardService as any).request;
    (dashboardService as any).request = jest
      .fn()
      .mockRejectedValue(new Error("Network error"));
    
    const originalUseMockData = (dashboardService as any).useMockData;
    (dashboardService as any).useMockData = false;

    await expect(dashboardService.getRecentAuditLogs()).rejects.toThrow(
      "Network error"
    );

    // Restore
    (dashboardService as any).request = originalRequest;
    (dashboardService as any).useMockData = originalUseMockData;
  });
});
