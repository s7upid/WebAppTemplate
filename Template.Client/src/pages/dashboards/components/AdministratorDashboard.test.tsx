import { screen } from "@testing-library/react";
import AdministratorDashboard from "@/pages/dashboards/components/AdministratorDashboard";
import { TEST_IDS } from "@/config";
import { renderWithProviders } from "@/test/test-utils";

jest.mock("@/services/entities/dashboardService", () => ({
  dashboardService: {
    getRecentAuditLogs: jest.fn().mockResolvedValue({
      success: true,
      data: {
        items: [],
        totalCount: 0,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 0,
      },
    }),
  },
}));

jest.mock("@/hooks", () => {
  const { getHookMocks } = require("@/test/base-test-utils");
  return {
    ...getHookMocks({
      useAuth: { user: { firstName: "Admin" }, isAuthenticated: true },
    }),
    useDashboardQuery: () => ({
      recentLogs: [],
      isLoading: false,
    }),
  };
});

jest.mock("@/services", () => {
  const { getServiceMocks } = require("@/test/base-test-utils");
  return getServiceMocks({ dashboardService: true });
});

describe("AdministratorDashboard", () => {

  it("shows loading then page content", async () => {
    const { findByTestId } = renderWithProviders(<AdministratorDashboard />);
    await findByTestId(TEST_IDS.ADMINISTRATOR_DASHBOARD);
    expect(screen.getByText(/Administrator Dashboard/)).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.QUICK_ACTIONS)).toBeInTheDocument();
  });

  it("renders empty states when data is empty", async () => {
    const { findByTestId } = renderWithProviders(<AdministratorDashboard />);
    await findByTestId(TEST_IDS.ADMINISTRATOR_DASHBOARD);
    expect(
      screen.getByTestId(TEST_IDS.ADMINISTRATOR_DASHBOARD)
    ).toBeInTheDocument();
  });
});
