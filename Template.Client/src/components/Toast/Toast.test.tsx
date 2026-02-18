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
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Toast from "../Toast/Toast";

describe("Toast", () => {
  const mockToasts = [
    {
      id: "1",
      type: "success" as const,
      title: "Success",
      message: "Operation completed successfully",
    },
    {
      id: "2",
      type: "error" as const,
      title: "Error",
      message: "Something went wrong",
    },
    {
      id: "3",
      type: "warning" as const,
      title: "Warning",
      message: "Please check your input",
    },
    {
      id: "4",
      type: "info" as const,
      title: "Info",
      message: "Here is some information",
    },
  ];

  const mockProps = {
    toasts: mockToasts,
    onRemove: jest.fn(),
  };

  beforeEach(() => {
    cleanup(); // Use cleanup from base utilities
  });

  it("renders all toasts", () => {
    render(<Toast {...mockProps} />);

    expect(screen.getByText("Success")).toBeTruthy();
    expect(screen.getByText("Operation completed successfully")).toBeTruthy();
    expect(screen.getByText("Error")).toBeTruthy();
    expect(screen.getByText("Something went wrong")).toBeTruthy();
  });

  it("calls onRemove when close button is clicked", async () => {
    render(<Toast {...mockProps} />);

    const closeButtons = screen.getAllByRole("button");
    fireEvent.click(closeButtons[0]);

    await waitFor(
      () => {
        expect(mockProps.onRemove).toHaveBeenCalledWith("1");
      },
      { timeout: 1000 }
    );
  });

  it("renders different toast types", () => {
    render(<Toast {...mockProps} />);

    expect(screen.getByText("Success")).toBeTruthy();
    expect(screen.getByText("Error")).toBeTruthy();
    expect(screen.getByText("Warning")).toBeTruthy();
    expect(screen.getByText("Info")).toBeTruthy();
  });

  it("renders with auto dismiss", () => {
    render(<Toast {...mockProps} autoDismiss={true} />);

    expect(screen.getByText("Success")).toBeTruthy();
  });

  it("renders with custom dismiss delay", () => {
    render(<Toast {...mockProps} dismissDelay={5000} />);

    expect(screen.getByText("Success")).toBeTruthy();
  });

  it("renders nothing when toasts array is empty", () => {
    render(<Toast {...mockProps} toasts={[]} />);

    expect(screen.queryByText("Success")).not.toBeTruthy();
  });

  it("renders single toast when one is provided", () => {
    const singleToast = [mockToasts[0]];
    render(<Toast {...mockProps} toasts={singleToast} />);

    expect(screen.getByText("Success")).toBeTruthy();
    expect(screen.queryByText("Error")).not.toBeTruthy();
  });

  it("renders toast with only title", () => {
    const titleOnlyToast = [
      {
        id: "1",
        type: "success" as const,
        title: "Success",
        message: "",
      },
    ];

    render(<Toast {...mockProps} toasts={titleOnlyToast} />);

    expect(screen.getByText("Success")).toBeTruthy();
  });

  it("renders toast with only message", () => {
    const messageOnlyToast = [
      {
        id: "1",
        type: "success" as const,
        title: "",
        message: "Operation completed",
      },
    ];

    render(<Toast {...mockProps} toasts={messageOnlyToast} />);

    expect(screen.getByText("Operation completed")).toBeTruthy();
  });
});
