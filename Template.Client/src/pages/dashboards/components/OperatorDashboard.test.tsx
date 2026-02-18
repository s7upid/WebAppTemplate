// Use base test utilities to reduce duplication
import { render, screen } from "@testing-library/react";
import OperatorDashboard from "@/pages/dashboards/components/OperatorDashboard";
import { TEST_IDS } from "@/config";

jest.mock("@/hooks", () => {
  const { getHookMocks } = require("@/test/base-test-utils");
  return getHookMocks({
    useAuth: { user: { firstName: "Admin" }, isAuthenticated: true },
  });
});

jest.mock("@/services", () => ({
  dashboardApiService: {
    getOperatorStatsSafe: jest.fn().mockResolvedValue({}),
  },
}));

describe("OperatorDashboard", () => {
  it("renders loading then content", async () => {
    const { findByTestId } = render(<OperatorDashboard />);
    await findByTestId(TEST_IDS.OPERATOR_DASHBOARD);
    expect(screen.getByTestId(TEST_IDS.OPERATOR_DASHBOARD)).toBeInTheDocument();
    expect(screen.getByText(/Operator Dashboard/)).toBeInTheDocument();
  });

  it("renders correctly with empty stats", async () => {
    const { dashboardApiService } = jest.requireMock("@/services");
    dashboardApiService.getOperatorStatsSafe.mockResolvedValue({
      recentActivity: [],
    });
    const { findByTestId } = render(<OperatorDashboard />);
    await findByTestId(TEST_IDS.OPERATOR_DASHBOARD);
    expect(screen.getByTestId(TEST_IDS.OPERATOR_DASHBOARD)).toBeInTheDocument();
  });
});
