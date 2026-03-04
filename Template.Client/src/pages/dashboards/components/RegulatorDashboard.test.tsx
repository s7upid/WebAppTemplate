import { render, screen } from "@testing-library/react";
import RegulatorDashboard from "@/pages/dashboards/components/RegulatorDashboard";
import { TEST_IDS } from "@/config";

// Use base hook mocks
jest.mock("@/hooks", () => {
  const { getHookMocks } = require("@/test/base-test-utils");
  return getHookMocks({
    useAuth: { user: { firstName: "Admin" }, isAuthenticated: true },
  });
});

describe("RegulatorDashboard", () => {
  it("renders loading then content", async () => {
    const { findByTestId } = render(<RegulatorDashboard />);
    await findByTestId(TEST_IDS.REGULATOR_DASHBOARD);
    expect(
      screen.getByTestId(TEST_IDS.REGULATOR_DASHBOARD)
    ).toBeInTheDocument();
    expect(screen.getByText(/Regulator Dashboard/)).toBeInTheDocument();
  });
});
