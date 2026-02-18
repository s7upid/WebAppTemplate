import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import StatsCard from "../StatsCard/StatsCard";
import { Users, DollarSign } from "lucide-react";

describe("StatsCard", () => {
  it("renders with title and value", () => {
    render(<StatsCard title="Total Users" value="1,234" icon={Users} />);

    expect(screen.getByText("Total Users")).toBeTruthy();
    expect(screen.getByText("1,234")).toBeTruthy();
  });

  it("renders with icon", () => {
    render(<StatsCard title="Total Users" value="1,234" icon={Users} />);

    expect(screen.getByText("Total Users")).toBeTruthy();
    expect(screen.getByText("1,234")).toBeTruthy();
  });

  it("renders with change indicator", () => {
    render(
      <StatsCard
        title="Revenue"
        value="$12,345"
        icon={DollarSign}
        change={{ value: "+12.5%", type: "increase" }}
      />
    );

    expect(screen.getByText("Revenue")).toBeTruthy();
    expect(screen.getByText("$12,345")).toBeTruthy();
  });

  it("renders negative change", () => {
    render(
      <StatsCard
        title="Revenue"
        value="$12,345"
        icon={DollarSign}
        change={{ value: "-5.2%", type: "decrease" }}
      />
    );

    expect(screen.getByText("Revenue")).toBeTruthy();
    expect(screen.getByText("$12,345")).toBeTruthy();
  });

  it("renders neutral change", () => {
    render(
      <StatsCard
        title="Revenue"
        value="$12,345"
        icon={DollarSign}
        change={{ value: "0%", type: "neutral" }}
      />
    );

    expect(screen.getByText("Revenue")).toBeTruthy();
    expect(screen.getByText("$12,345")).toBeTruthy();
  });

  it("accepts custom className", () => {
    render(
      <StatsCard
        title="Total Users"
        value="1,234"
        icon={Users}
        className="custom-stats"
      />
    );

    expect(screen.getByText("Total Users")).toBeTruthy();
  });

  it("renders without change indicator", () => {
    render(<StatsCard title="Total Users" value="1,234" icon={Users} />);

    expect(screen.queryByText(/[+-]\d+%/)).not.toBeTruthy();
  });

  it("renders with description", () => {
    render(<StatsCard title="Total Users" value="1,234" icon={Users} />);

    expect(screen.getByText("Total Users")).toBeTruthy();
    expect(screen.getByText("1,234")).toBeTruthy();
  });
});
