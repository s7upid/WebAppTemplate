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

describe("OperatorDashboard", () => {
  it("renders loading then content", async () => {
    const { findByTestId } = render(<OperatorDashboard />);
    await findByTestId(TEST_IDS.OPERATOR_DASHBOARD);
    expect(screen.getByTestId(TEST_IDS.OPERATOR_DASHBOARD)).toBeInTheDocument();
    expect(screen.getByText(/Operator Dashboard/)).toBeInTheDocument();
  });
});
