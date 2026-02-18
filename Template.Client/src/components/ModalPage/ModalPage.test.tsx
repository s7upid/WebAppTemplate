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
import ModalPage from "./ModalPage";
import { TEST_IDS } from "@/config";

describe("ModalPage", () => {
  const mockProps = {
    isOpen: true,
    onClose: jest.fn(),
    title: "Test Modal",
    children: <div data-testid={TEST_IDS.MOCK_MODAL}>Modal content</div>,
  };

  beforeEach(() => {
    cleanup(); // Use cleanup from base utilities
  });

  it("renders content when isOpen is true", () => {
    render(<ModalPage {...mockProps} />);
    expect(screen.getByText("Test Modal")).toBeTruthy();
  });

  it("invokes onClose when close button is clicked", () => {
    render(<ModalPage {...mockProps} />);
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("closes when clicking on overlay (outside content)", () => {
    render(<ModalPage {...mockProps} />);
    fireEvent.click(screen.getByRole("dialog"));
    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close when clicking inside content", () => {
    render(<ModalPage {...mockProps} />);

    fireEvent.click(screen.getByText("Test Modal"));
    expect(mockProps.onClose).not.toHaveBeenCalled();
  });
});
