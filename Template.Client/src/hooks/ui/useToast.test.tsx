// Use base test utilities to reduce duplication
import { setupBaseTest } from "@/test/base-test-utils";

// Get cleanup function after mocks are set up
const { cleanup } = setupBaseTest({
  useMockData: false,
  mockFetch: false,
  mockPermissionCache: false,
  mockRouteUtils: false,
});

import React from "react";
import { renderHook, act } from "@testing-library/react";
import { useToast, ToastProvider } from "./useToast";

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ToastProvider>{children}</ToastProvider>
);

describe("useToast", () => {
  beforeEach(() => {
    cleanup(); // Use cleanup from base utilities
  });

  it("returns initial state", () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    expect(result.current.toasts).toEqual([]);
    expect(result.current.addToast).toBeDefined();
    expect(result.current.removeToast).toBeDefined();
    expect(result.current.clearAllToasts).toBeDefined();
    expect(typeof result.current.addToast).toBe("function");
    expect(typeof result.current.removeToast).toBe("function");
    expect(typeof result.current.clearAllToasts).toBe("function");
  });

  it("add a success toast", () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.addToast({
        type: "success",
        title: "Success",
        message: "Operation completed successfully",
      });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].type).toBe("success");
    expect(result.current.toasts[0].title).toBe("Success");
    expect(result.current.toasts[0].message).toBe(
      "Operation completed successfully"
    );
    expect(result.current.toasts[0].id).toBeDefined();
  });

  it("add an error toast", () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.addToast({
        type: "error",
        title: "Error",
        message: "Something went wrong",
      });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].type).toBe("error");
    expect(result.current.toasts[0].title).toBe("Error");
    expect(result.current.toasts[0].message).toBe("Something went wrong");
  });

  it("add a warning toast", () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.addToast({
        type: "warning",
        title: "Warning",
        message: "Please check your input",
      });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].type).toBe("warning");
    expect(result.current.toasts[0].title).toBe("Warning");
    expect(result.current.toasts[0].message).toBe("Please check your input");
  });

  it("add an info toast", () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.addToast({
        type: "info",
        title: "Info",
        message: "Here is some information",
      });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].type).toBe("info");
    expect(result.current.toasts[0].title).toBe("Info");
    expect(result.current.toasts[0].message).toBe("Here is some information");
  });

  it("add multiple toasts", () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.addToast({
        type: "success",
        title: "Success",
        message: "First toast",
      });
      result.current.addToast({
        type: "error",
        title: "Error",
        message: "Second toast",
      });
    });

    expect(result.current.toasts).toHaveLength(2);
    expect(result.current.toasts[0].type).toBe("success");
    expect(result.current.toasts[1].type).toBe("error");
  });

  it("remove a toast by id", () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.addToast({
        type: "success",
        title: "Success",
        message: "Operation completed",
      });
    });

    const toastId = result.current.toasts[0].id;

    act(() => {
      result.current.removeToast(toastId);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it("clear all toasts", () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.addToast({
        type: "success",
        title: "Success",
        message: "First toast",
      });
      result.current.addToast({
        type: "error",
        title: "Error",
        message: "Second toast",
      });
    });

    expect(result.current.toasts).toHaveLength(2);

    act(() => {
      result.current.clearAllToasts();
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it("handles toast with custom duration", () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.addToast({
        type: "success",
        title: "Success",
        message: "Operation completed",
        duration: 5000,
      });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].duration).toBe(5000);
  });

  it("handles removing non-existent toast", () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.removeToast("non-existent-id");
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it("maintain state across re-renders", () => {
    const { result, rerender } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.addToast({
        type: "success",
        title: "Success",
        message: "Operation completed",
      });
    });

    expect(result.current.toasts).toHaveLength(1);

    rerender();

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe("Success");
  });

  it("handles toast with all properties", () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.addToast({
        type: "success",
        title: "Success",
        message: "Operation completed successfully",
        duration: 5000,
      } as any);
    });

    expect(result.current.toasts).toHaveLength(1);
    const toast = result.current.toasts[0];
    expect(toast.type).toBe("success");
    expect(toast.title).toBe("Success");
    expect(toast.message).toBe("Operation completed successfully");
    expect(toast.duration).toBe(5000);
  });
});
