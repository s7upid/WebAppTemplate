import { render, screen } from "@testing-library/react";
import SupportDashboard from "@/pages/dashboards/components/SupportDashboard";
import { TEST_IDS } from "@/config";

jest.mock("@/hooks", () => {
  const { getHookMocks } = require("@/test/base-test-utils");
  return getHookMocks({
    useAuth: { user: { firstName: "Admin" }, isAuthenticated: true },
  });
});

describe("SupportDashboard", () => {
  it("renders loading then content", async () => {
    const { findByTestId } = render(<SupportDashboard />);
    await findByTestId(TEST_IDS.SUPPORT_DASHBOARD);
    expect(screen.getByTestId(TEST_IDS.SUPPORT_DASHBOARD)).toBeInTheDocument();
    expect(screen.getByText(/Support Dashboard/)).toBeInTheDocument();
  });
});
