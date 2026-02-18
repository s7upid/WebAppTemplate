// Use base test utilities to reduce duplication
import { setupBaseTest } from "@/test/base-test-utils";

// Get cleanup function after mocks are set up
const { cleanup } = setupBaseTest({
  useMockData: false,
  mockFetch: false,
  mockPermissionCache: false,
  mockRouteUtils: false,
});

import { renderHook } from "@testing-library/react";
import { useModalBlur } from "./useModalBlur";

describe("useModalBlur", () => {
  beforeEach(() => {
    cleanup(); // Use cleanup from base utilities
  });

  it("handles modal open state", () => {
    const { rerender } = renderHook(({ isOpen }) => useModalBlur(isOpen), {
      initialProps: { isOpen: false },
    });

    expect(document.body.style.overflow).toBe("unset");

    rerender({ isOpen: true });

    expect(document.body.style.overflow).toBe("hidden");
  });

  it("handles modal close state", () => {
    const { rerender } = renderHook(({ isOpen }) => useModalBlur(isOpen), {
      initialProps: { isOpen: true },
    });

    expect(document.body.style.overflow).toBe("hidden");

    rerender({ isOpen: false });

    expect(document.body.style.overflow).toBe("unset");
  });

  it("cleanup on unmount", () => {
    const { unmount } = renderHook(({ isOpen }) => useModalBlur(isOpen), {
      initialProps: { isOpen: false },
    });

    expect(document.body.style.overflow).toBe("unset");

    unmount();

    expect(document.body.style.overflow).toBe("unset");
  });

  it("handles multiple modal states", () => {
    const { rerender } = renderHook(({ isOpen }) => useModalBlur(isOpen), {
      initialProps: { isOpen: false },
    });

    rerender({ isOpen: true });
    expect(document.body.style.overflow).toBe("hidden");

    rerender({ isOpen: false });
    expect(document.body.style.overflow).toBe("unset");

    rerender({ isOpen: true });
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("handles rapid state changes", () => {
    const { rerender } = renderHook(({ isOpen }) => useModalBlur(isOpen), {
      initialProps: { isOpen: false },
    });

    rerender({ isOpen: true });
    rerender({ isOpen: false });
    rerender({ isOpen: true });

    expect(document.body.style.overflow).toBe("hidden");
  });

  it("handles initial true state", () => {
    renderHook(({ isOpen }) => useModalBlur(isOpen), {
      initialProps: { isOpen: true },
    });

    expect(document.body.style.overflow).toBe("hidden");
  });

  it("handles initial false state", () => {
    renderHook(({ isOpen }) => useModalBlur(isOpen), {
      initialProps: { isOpen: false },
    });

    expect(document.body.style.overflow).toBe("unset");
  });
});
