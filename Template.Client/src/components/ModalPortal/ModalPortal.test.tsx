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
import { render, screen } from "@testing-library/react";
import ModalPortal from "../ModalPortal/ModalPortal";
import { TEST_IDS } from "@/config";

describe("ModalPortal", () => {
  beforeEach(() => {
    cleanup(); // Use cleanup from base utilities
  });

  it("renders children", () => {
    render(
      <ModalPortal>
        <div data-testid={TEST_IDS.MOCK_MODAL}>Modal Content</div>
      </ModalPortal>
    );

    expect(screen.getByTestId(TEST_IDS.MOCK_MODAL)).toBeTruthy();
  });

  it("passes children into document.body portal", () => {
    const children = <div data-testid={TEST_IDS.MOCK_MODAL}>Modal Content</div>;

    render(<ModalPortal>{children}</ModalPortal>);

    expect(screen.getByTestId(TEST_IDS.MOCK_MODAL)).toBeTruthy();
  });

  it("renders multiple children", () => {
    render(
      <ModalPortal>
        <div data-testid="modal-1">Modal 1</div>
        <div data-testid="modal-2">Modal 2</div>
      </ModalPortal>
    );

    expect(screen.getByTestId("modal-1")).toBeTruthy();
    expect(screen.getByTestId("modal-2")).toBeTruthy();
  });

  it("handles empty children", () => {
    render(<ModalPortal>{null}</ModalPortal>);

    expect(document.body).toBeTruthy();
  });

  it("handles undefined children", () => {
    render(<ModalPortal>{undefined}</ModalPortal>);

    expect(document.body).toBeTruthy();
  });
});
