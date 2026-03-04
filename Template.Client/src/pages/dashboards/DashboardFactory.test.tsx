import { screen } from "@testing-library/react";
import DashboardFactory from "@/pages/dashboards/DashboardFactory";
import { TEST_IDS } from "@/config";
import { renderWithProviders } from "@/test/test-utils";
import { ROLE_NAMES } from "@/config/generated/permissionKeys.generated";

// Store for mock values - must be defined before jest.mock due to hoisting
let mockAuthValue: unknown = { user: null, isLoading: false };

jest.mock("@/hooks", () => ({
  useAuth: () => mockAuthValue,
  useDashboardQuery: () => ({
    recentLogs: [],
    isLoading: false,
    error: null,
    refetch: jest.fn(),
    refetchLogs: jest.fn(),
  }),
}));

jest.mock("@/components", () => {
  const stubs = require("@/test/__mocks__/component-stubs").default;
  return {
    ...stubs,
    LoadingSpinner: (props: { "data-testid"?: string }) => (
      <div data-testid={props["data-testid"] || TEST_IDS.LOADING_SPINNER}>
        loading
      </div>
    ),
  };
});

describe("DashboardFactory", () => {
  function renderWithAuth(value: unknown) {
    mockAuthValue = value;
    return renderWithProviders(<DashboardFactory />);
  }

  beforeEach(() => {
    mockAuthValue = { user: null, isLoading: false };
  });

  it("renders loading spinner when loading", () => {
    renderWithAuth({ user: null, isLoading: true });
    expect(screen.getByTestId(TEST_IDS.LOADING_SPINNER)).toBeInTheDocument();
  });

  it("renders access denied when no user", () => {
    renderWithAuth({ user: null, isLoading: false });
    expect(screen.getByTestId(TEST_IDS.NO_USER)).toBeInTheDocument();
  });

  it("renders operator dashboard by default", async () => {
    const { findByTestId } = renderWithAuth({
      user: { role: { name: ROLE_NAMES.OPERATOR } },
      isLoading: false,
    });
    await findByTestId(TEST_IDS.OPERATOR_DASHBOARD);
    expect(screen.getByTestId(TEST_IDS.OPERATOR_DASHBOARD)).toBeInTheDocument();
  });

  it("renders administrator dashboard for administrator role", async () => {
    const { findByTestId } = renderWithAuth({
      user: { role: { name: ROLE_NAMES.ADMINISTRATOR } },
      isLoading: false,
    });
    await findByTestId(TEST_IDS.ADMINISTRATOR_DASHBOARD);
    expect(
      screen.getByTestId(TEST_IDS.ADMINISTRATOR_DASHBOARD)
    ).toBeInTheDocument();
  });

  it("renders support dashboard for support role", async () => {
    const { findByTestId } = renderWithAuth({
      user: { role: { name: ROLE_NAMES.SUPPORT } },
      isLoading: false,
    });
    await findByTestId(TEST_IDS.SUPPORT_DASHBOARD);
    expect(screen.getByTestId(TEST_IDS.SUPPORT_DASHBOARD)).toBeInTheDocument();
  });

  it("renders regulator dashboard for regulator role", async () => {
    const { findByTestId } = renderWithAuth({
      user: { role: { name: ROLE_NAMES.REGULATOR } },
      isLoading: false,
    });
    await findByTestId(TEST_IDS.REGULATOR_DASHBOARD);
    expect(
      screen.getByTestId(TEST_IDS.REGULATOR_DASHBOARD)
    ).toBeInTheDocument();
  });
});
