import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import DashboardCard from "../DashboardCard/DashboardCard";
import { Users } from "lucide-react";

describe("DashboardCard", () => {
  const mockProps = {
    title: "Total Users",
    icon: Users,
    testId: "dashboard-card-container",
  };

  it("renders with title, value, icon, and description", () => {
    render(
      <DashboardCard {...mockProps}>
        <div data-testid="dashboard-card-icon">Icon</div>
        <div>1,234</div>
        <div>+12%</div>
        <div>Users this month</div>
      </DashboardCard>
    );

    expect(screen.getByText("Total Users")).toBeTruthy();
    expect(screen.getByText("1,234")).toBeTruthy();
    expect(screen.getByText("+12%")).toBeTruthy();
    expect(screen.getByText("Users this month")).toBeTruthy();
  });

  it("renders without description if not provided", () => {
    render(
      <DashboardCard {...mockProps}>
        <div>1,234</div>
        <div>+12%</div>
      </DashboardCard>
    );

    expect(screen.getByText("Total Users")).toBeTruthy();
    expect(screen.getByText("1,234")).toBeTruthy();
    expect(screen.queryByText("Users this month")).not.toBeTruthy();
  });

  it("applies custom className", () => {
    render(
      <DashboardCard {...mockProps} className="custom-card">
        <div>1,234</div>
      </DashboardCard>
    );
    expect(screen.getByTestId("dashboard-card-container")).toHaveClass(
      "custom-card"
    );
  });

  it("renders with different values", () => {
    render(
      <DashboardCard {...mockProps}>
        <div>500</div>
      </DashboardCard>
    );
    expect(screen.getByText("500")).toBeTruthy();
  });

  it("renders with different titles", () => {
    render(
      <DashboardCard {...mockProps} title="Active Sessions">
        <div>1,234</div>
      </DashboardCard>
    );
    expect(screen.getByText("Active Sessions")).toBeTruthy();
  });
});
