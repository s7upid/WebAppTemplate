import "@testing-library/jest-dom";
import { describe, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renders with default props", () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole("status")).toBeTruthy();
    expect(screen.getByLabelText("Loading")).toBeTruthy();
  });

  it("renders with custom text", () => {
    render(<LoadingSpinner text="Please wait..." />);
    expect(screen.getByText("Please wait...")).toBeTruthy();
  });

  it("renders with different sizes", () => {
    const { rerender } = render(<LoadingSpinner size="sm" />);
    expect(screen.getByRole("status")).toBeTruthy();

    rerender(<LoadingSpinner size="md" />);
    expect(screen.getByRole("status")).toBeTruthy();

    rerender(<LoadingSpinner size="lg" />);
    expect(screen.getByRole("status")).toBeTruthy();
  });

  it("renders with custom className", () => {
    render(<LoadingSpinner className="custom-spinner" />);
    expect(screen.getByRole("status")).toHaveClass("custom-spinner");
  });

  it("renders without text when showMessage is false", () => {
    render(<LoadingSpinner text="Loading..." showMessage={false} />);
    expect(screen.getByRole("status")).toBeTruthy();
    expect(screen.queryByText("Loading...")).not.toBeTruthy();
  });

  it("renders with custom color", () => {
    render(<LoadingSpinner color="border-red-500" />);
    expect(screen.getByRole("status")).toBeTruthy();
  });

  it("renders with all props combined", () => {
    render(
      <LoadingSpinner
        size="lg"
        text="Processing..."
        className="custom-class"
        color="border-blue-500"
        showMessage={true}
      />
    );

    const container = screen.getByRole("status");
    expect(container).toHaveClass("custom-class");
    expect(screen.getByText("Processing...")).toBeTruthy();
  });

  it("have proper accessibility attributes", () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole("status");
    expect(spinner).toHaveAttribute("aria-label", "Loading");
  });

  it("have aria-hidden on spinner element", () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole("status");
    expect(spinner).toBeTruthy();
  });
});
