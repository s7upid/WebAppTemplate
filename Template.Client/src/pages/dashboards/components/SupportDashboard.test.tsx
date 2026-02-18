import { render, screen } from "@testing-library/react";
import SupportDashboard from "@/pages/dashboards/components/SupportDashboard";
import { TEST_IDS } from "@/config";

jest.mock("@/hooks", () => {
  const { getHookMocks } = require("@/test/base-test-utils");
  return getHookMocks({
    useAuth: { user: { firstName: "Admin" }, isAuthenticated: true },
  });
});

jest.mock("@/services", () => ({
  dashboardApiService: {
    getSupportStatsSafe: jest.fn().mockResolvedValue({}),
  },
}));

describe("SupportDashboard", () => {
  it("renders loading then content", async () => {
    const { findByTestId } = render(<SupportDashboard />);
    await findByTestId(TEST_IDS.SUPPORT_DASHBOARD);
    expect(screen.getByTestId(TEST_IDS.SUPPORT_DASHBOARD)).toBeInTheDocument();
    expect(screen.getByText(/Support Dashboard/)).toBeInTheDocument();
  });

  it("renders with empty recent activity", async () => {
    const { dashboardApiService } = jest.requireMock("@/services");
    dashboardApiService.getSupportStatsSafe.mockResolvedValue({
      recentActivity: [],
    });
    const { findByTestId } = render(<SupportDashboard />);
    await findByTestId(TEST_IDS.SUPPORT_DASHBOARD);
    expect(screen.getByTestId(TEST_IDS.SUPPORT_DASHBOARD)).toBeInTheDocument();
  });
});
