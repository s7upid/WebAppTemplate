// Use base test utilities to reduce duplication
import { setupBaseTest } from "@/test/base-test-utils";

// Get cleanup function after mocks are set up
const { cleanup } = setupBaseTest({
  useMockData: false,
  mockFetch: false,
  mockPermissionCache: false,
  mockRouteUtils: false,
});

import { renderHook, act } from "@testing-library/react";
import { useConfirmation } from "./useConfirmation";

describe("useConfirmation", () => {
  beforeEach(() => {
    cleanup(); // Use cleanup from base utilities
  });

  it("returns initial confirmation state", () => {
    const { result } = renderHook(() => useConfirmation());

    expect(result.current.isOpen).toBe(false);
    expect(result.current.title).toBe("");
    expect(result.current.message).toBe("");
    expect(result.current.onConfirm).toBeUndefined();
    expect(result.current.onCancel).toBeUndefined();
  });

  it("shows confirmation dialog", () => {
    const { result } = renderHook(() => useConfirmation());

    const mockOnConfirm = jest.fn();
    const mockOnCancel = jest.fn();

    act(() => {
      (result.current as any).showConfirmation({
        title: "Delete Item",
        message: "Are you sure you want to delete this item?",
        onConfirm: mockOnConfirm,
        onCancel: mockOnCancel,
      });
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.title).toBe("Delete Item");
    expect(result.current.message).toBe(
      "Are you sure you want to delete this item?"
    );
    expect(typeof (result.current as any).onConfirm).toBe("function");
    expect(typeof (result.current as any).onCancel).toBe("function");
  });

  it("hide confirmation dialog", () => {
    const { result } = renderHook(() => useConfirmation());

    const mockOnConfirm = jest.fn();
    const mockOnCancel = jest.fn();

    act(() => {
      (result.current as any).showConfirmation({
        title: "Delete Item",
        message: "Are you sure?",
        onConfirm: mockOnConfirm,
        onCancel: mockOnCancel,
      });
    });

    expect(result.current.isOpen).toBe(true);

    act(() => {
      (result.current as any).hideConfirmation();
    });

    expect(result.current.isOpen).toBe(false);
  });

  it("handles confirmation without onCancel callback", () => {
    const { result } = renderHook(() => useConfirmation());

    const mockOnConfirm = jest.fn();

    act(() => {
      (result.current as any).showConfirmation({
        title: "Delete Item",
        message: "Are you sure?",
        onConfirm: mockOnConfirm,
      });
    });

    act(() => {
      (result.current as any).dialogProps.onClose();
    });

    expect(result.current.isOpen).toBe(false);
  });

  it("handles multiple confirmations", () => {
    const { result } = renderHook(() => useConfirmation());

    const mockOnConfirm1 = jest.fn();
    const mockOnConfirm2 = jest.fn();

    act(() => {
      (result.current as any).showConfirmation({
        title: "First Confirmation",
        message: "First message",
        onConfirm: mockOnConfirm1,
      });
    });

    expect(result.current.title).toBe("First Confirmation");

    act(() => {
      (result.current as any).hideConfirmation();
    });

    act(() => {
      (result.current as any).showConfirmation({
        title: "Second Confirmation",
        message: "Second message",
        onConfirm: mockOnConfirm2,
      });
    });

    expect(result.current.title).toBe("Second Confirmation");
    expect(result.current.message).toBe("Second message");
  });

  it("handles confirmation with custom confirm text", () => {
    const { result } = renderHook(() => useConfirmation());

    act(() => {
      (result.current as any).showConfirmation({
        title: "Delete Item",
        message: "Are you sure?",
        confirmText: "Yes, Delete",
        cancelText: "Cancel",
        onConfirm: jest.fn(),
      });
    });

    expect((result.current as any).dialogProps.confirmText).toBe("Yes, Delete");
    expect((result.current as any).dialogProps.cancelText).toBe("Cancel");
  });

  it("handles confirmation with danger variant", () => {
    const { result } = renderHook(() => useConfirmation());

    act(() => {
      (result.current as any).showConfirmation({
        title: "Delete Item",
        message: "Are you sure?",
        variant: "danger",
        onConfirm: jest.fn(),
      });
    });

    expect((result.current as any).dialogProps.variant).toBe("danger");
  });

  it("handles confirmation with warning variant", () => {
    const { result } = renderHook(() => useConfirmation());

    act(() => {
      (result.current as any).showConfirmation({
        title: "Warning",
        message: "This action cannot be undone",
        variant: "warning",
        onConfirm: jest.fn(),
      });
    });

    expect((result.current as any).dialogProps.variant).toBe("warning");
  });

  it("handles confirmation with info variant", () => {
    const { result } = renderHook(() => useConfirmation());

    act(() => {
      (result.current as any).showConfirmation({
        title: "Information",
        message: "Please confirm this action",
        variant: "info",
        onConfirm: jest.fn(),
      });
    });

    expect((result.current as any).dialogProps.variant).toBe("info");
  });

  it("handles confirmation with success variant", () => {
    const { result } = renderHook(() => useConfirmation());

    act(() => {
      (result.current as any).showConfirmation({
        title: "Success",
        message: "Action completed successfully",
        variant: "success",
        onConfirm: jest.fn(),
      });
    });

    expect((result.current as any).dialogProps.variant).toBe("success");
  });
});
