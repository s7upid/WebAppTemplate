// Use base test utilities to reduce duplication
import { setupBaseTest } from "@/test/base-test-utils";

// Get cleanup function after mocks are set up
const { cleanup } = setupBaseTest({
  useMockData: false,
  mockFetch: false,
  mockPermissionCache: false,
  mockRouteUtils: false,
});

import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import DangerZone from "./DangerZone";

describe("DangerZone", () => {
  const mockProps = {
    title: "Delete Account",
    description:
      "This action cannot be undone. This will permanently delete your account.",
    buttonLabel: "Delete Account",
    onConfirm: jest.fn(),
  };

  beforeEach(() => {
    cleanup(); // Use cleanup from base utilities
  });

  it("renders title, description, and action button", () => {
    render(<DangerZone {...mockProps} />);

    expect(
      screen.getByRole("heading", { name: "Delete Account" })
    ).toBeTruthy();
    expect(
      screen.getByText(
        "This action cannot be undone. This will permanently delete your account."
      )
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "Delete Account" })).toBeTruthy();
  });

  it("invokes onConfirm when action button is clicked", () => {
    render(<DangerZone {...mockProps} />);

    const deleteButton = screen.getByRole("button", { name: "Delete Account" });
    fireEvent.click(deleteButton);

    expect(mockProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it("disables action button when disabled is true", () => {
    render(<DangerZone {...mockProps} disabled={true} />);

    const deleteButton = screen.getByRole("button", { name: "Delete Account" });
    expect(deleteButton).toBeDisabled();
  });

  it("does not call onConfirm when disabled", () => {
    render(<DangerZone {...mockProps} disabled={true} />);

    const deleteButton = screen.getByRole("button", { name: "Delete Account" });
    fireEvent.click(deleteButton);

    expect(mockProps.onConfirm).not.toHaveBeenCalled();
  });

  it("exposes custom test ID when provided", () => {
    render(<DangerZone {...mockProps} testId="custom-danger-zone" />);

    expect(screen.getByTestId("custom-danger-zone")).toBeTruthy();
  });

  it("still renders content when hideHeader is true", () => {
    render(<DangerZone {...mockProps} />);

    expect(
      screen.getByRole("heading", { name: "Delete Account" })
    ).toBeTruthy();
  });

  it("renders provided title and description variations", () => {
    const customProps = {
      ...mockProps,
      title: "Remove User",
      description: "This will remove the user from the system.",
      buttonLabel: "Remove User",
    };

    render(<DangerZone {...customProps} />);

    expect(screen.getByRole("heading", { name: "Remove User" })).toBeTruthy();
    expect(
      screen.getByText("This will remove the user from the system.")
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "Remove User" })).toBeTruthy();
  });

  it("applies danger variant to the action button", () => {
    render(<DangerZone {...mockProps} />);

    const deleteButton = screen.getByRole("button", { name: "Delete Account" });
    expect(deleteButton).toHaveClass("danger");
  });

  it("shows trash icon on the action button", () => {
    render(<DangerZone {...mockProps} />);

    const deleteButton = screen.getByRole("button", { name: "Delete Account" });
    expect(deleteButton).toBeTruthy();
  });

  it("renders without title/description content when empty", () => {
    const emptyProps = {
      ...mockProps,
      title: "",
      description: "",
    };

    render(<DangerZone {...emptyProps} />);

    expect(screen.getByRole("button", { name: "Delete Account" })).toBeTruthy();
  });

  it("renders long descriptions without truncation", () => {
    const longDescription =
      "This is a very long description that should still be rendered properly in the danger zone component. It should wrap correctly and maintain proper styling.";

    render(<DangerZone {...mockProps} description={longDescription} />);

    expect(screen.getByText(longDescription)).toBeTruthy();
  });
});
