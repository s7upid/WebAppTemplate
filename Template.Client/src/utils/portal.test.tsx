// Use base test utilities to reduce duplication
import { setupBaseTest } from "@/test/base-test-utils";

// Get cleanup function after mocks are set up
const { cleanup } = setupBaseTest({
  useMockData: false,
  mockFetch: false,
  mockPermissionCache: false,
  mockRouteUtils: false,
});

import { describe, it, expect } from "@jest/globals";
import { render } from "@testing-library/react";

jest.mock("react-dom", () => ({
  ...jest.requireActual("react-dom"),
  createPortal: jest.fn(),
}));

import Portal from "./portal";
import { createPortal } from "react-dom";

const mockCreatePortal = createPortal as unknown as jest.Mock;

describe("Portal", () => {
  beforeEach(() => {
    cleanup(); // Use cleanup from base utilities
  });

  it("renders children using createPortal", () => {
    const children = <div>Test content</div>;
    const container = document.body;

    render(<Portal>{children}</Portal>);

    expect(mockCreatePortal).toHaveBeenCalledWith(children, container);
  });

  it("uses custom container when provided", () => {
    const children = <div>Test content</div>;
    const customContainer = document.createElement("div");

    render(<Portal container={customContainer}>{children}</Portal>);

    expect(mockCreatePortal).toHaveBeenCalledWith(children, customContainer);
  });

  it("does nothing when container is null", () => {
    const children = <div>Test content</div>;

    render(<Portal container={null}>{children}</Portal>);

    expect(mockCreatePortal).not.toHaveBeenCalled();
  });

  it("defaults to document.body when container is undefined", () => {
    const children = <div>Test content</div>;

    render(<Portal container={undefined}>{children}</Portal>);

    expect(mockCreatePortal).toHaveBeenCalledWith(children, document.body);
  });
});
