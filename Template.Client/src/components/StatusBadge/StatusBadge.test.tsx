import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import StatusBadge from "../StatusBadge/StatusBadge";

describe("StatusBadge", () => {
  it("renders active status", () => {
    render(<StatusBadge status="active" />);
    expect(screen.getByText("Active")).toBeTruthy();
    expect(screen.getByText("Active")).toHaveClass("active");
  });

  it("renders inactive status", () => {
    render(<StatusBadge status="inactive" />);
    expect(screen.getByText("Inactive")).toBeTruthy();
    expect(screen.getByText("Inactive")).toHaveClass("inactive");
  });

  it("renders pending status", () => {
    render(<StatusBadge status="pending" />);
    expect(screen.getByText("Pending")).toBeTruthy();
    expect(screen.getByText("Pending")).toHaveClass("pending");
  });

  it("renders suspended status", () => {
    render(<StatusBadge status="suspended" />);
    expect(screen.getByText("Suspended")).toBeTruthy();
    expect(screen.getByText("Suspended")).toHaveClass("suspended");
  });

  it("applies custom className", () => {
    render(<StatusBadge status="active" className="custom-badge" />);
    expect(screen.getByText("Active")).toHaveClass("custom-badge");
  });
});
