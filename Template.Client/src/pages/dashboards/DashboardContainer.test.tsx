import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { TEST_IDS } from "@/config";

jest.mock("@/components/Guards/RoleGuard", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("@/components/DangerZone/DangerZone", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("@/components/Dropdown/Dropdown", () => ({
  __esModule: true,
  default: ({ label, options, value, onValueChange, ...props }: any) => (
    <div>
      {label && <label>{label}</label>}
      <select value={value} onChange={(e) => onValueChange?.(e.target.value)} {...props}>
        {options?.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  ),
}));

jest.mock("@/components/Guards/RoleGuard", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("@/pages/dashboards/DashboardFactory", () => ({
  __esModule: true,
  default: () => <div data-testid={TEST_IDS.DASHBOARD} />,
}));

jest.mock("@/pages/dashboards/components/AdministratorDashboard", () => ({
  __esModule: true,
  default: () => <div data-testid={TEST_IDS.ADMINISTRATOR_DASHBOARD} />,
}));

jest.mock("@/pages/dashboards/components/SupportDashboard", () => ({
  __esModule: true,
  default: () => <div data-testid={TEST_IDS.SUPPORT_DASHBOARD} />,
}));

jest.mock("@/pages/dashboards/components/RegulatorDashboard", () => ({
  __esModule: true,
  default: () => <div data-testid={TEST_IDS.REGULATOR_DASHBOARD} />,
}));

jest.mock("@/pages/dashboards/components/OperatorDashboard", () => ({
  __esModule: true,
  default: () => <div data-testid={TEST_IDS.OPERATOR_DASHBOARD} />,
}));

import DashboardContainer from "@/pages/dashboards/DashboardContainer";

describe("DashboardContainer", () => {
  it("renders factory at index", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/*" element={<DashboardContainer />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByTestId(TEST_IDS.DASHBOARD)).toBeInTheDocument();
  });

  it("routes to administrator dashboard", () => {
    render(
      <MemoryRouter initialEntries={["/administrator"]}>
        <Routes>
          <Route path="/*" element={<DashboardContainer />} />
        </Routes>
      </MemoryRouter>
    );
    expect(
      screen.getByTestId(TEST_IDS.ADMINISTRATOR_DASHBOARD)
    ).toBeInTheDocument();
  });

  it("routes to support dashboard", () => {
    render(
      <MemoryRouter initialEntries={["/support"]}>
        <Routes>
          <Route path="/*" element={<DashboardContainer />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByTestId(TEST_IDS.SUPPORT_DASHBOARD)).toBeInTheDocument();
  });

  it("routes to regulator dashboard", () => {
    render(
      <MemoryRouter initialEntries={["/regulator"]}>
        <Routes>
          <Route path="/*" element={<DashboardContainer />} />
        </Routes>
      </MemoryRouter>
    );
    expect(
      screen.getByTestId(TEST_IDS.REGULATOR_DASHBOARD)
    ).toBeInTheDocument();
  });

  it("routes to operator dashboard", () => {
    render(
      <MemoryRouter initialEntries={["/operator"]}>
        <Routes>
          <Route path="/*" element={<DashboardContainer />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByTestId(TEST_IDS.OPERATOR_DASHBOARD)).toBeInTheDocument();
  });
});
