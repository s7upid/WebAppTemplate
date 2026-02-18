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
import { useErrorHandler } from "./useErrorHandler";
import { useToast } from "./useToast";
import { ApiResponse } from "@/models/shared/api";
import { useGenericNavigationFunctions } from "@/utils";

// Mock dependencies
jest.mock("./useToast");
jest.mock("@/utils", () => ({
  useGenericNavigationFunctions: jest.fn(),
}));

// Don't mock error handling utilities - we want to test the actual implementations

describe("useErrorHandler", () => {
  const mockShowError = jest.fn();
  const mockShowWarning = jest.fn();
  const mockGoToLogin = jest.fn();

  beforeEach(() => {
    cleanup(); // Use cleanup from base utilities
    (useToast as jest.Mock).mockReturnValue({
      showError: mockShowError,
      showWarning: mockShowWarning,
    });
    (useGenericNavigationFunctions as jest.Mock).mockReturnValue({
      goToLogin: mockGoToLogin,
    });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should not handle error if response is successful", () => {
    const { result } = renderHook(() => useErrorHandler());
    const successResponse: ApiResponse<any> = {
      success: true,
      data: { test: "data" },
      message: "",
      fieldErrors: {},
    };

    act(() => {
      result.current.handleError(successResponse);
    });

    expect(mockShowError).not.toHaveBeenCalled();
    expect(mockShowWarning).not.toHaveBeenCalled();
  });

  it("should show warning toast for rate limit errors (429)", () => {
    const { result } = renderHook(() => useErrorHandler());
    const rateLimitResponse: ApiResponse<any> = {
      success: false,
      status: 429,
      message: "Rate limit exceeded. Maximum 5 requests per 15 minutes.",
      data: null,
      fieldErrors: {},
    };

    act(() => {
      result.current.handleError(rateLimitResponse);
    });

    expect(mockShowWarning).toHaveBeenCalledWith(
      "Rate Limit Exceeded",
      "Rate limit exceeded. Maximum 5 requests per 15 minutes.",
      8000
    );
    expect(mockShowError).not.toHaveBeenCalled();
  });

  it("should show error toast for non-rate-limit errors", () => {
    const { result } = renderHook(() => useErrorHandler());
    const errorResponse: ApiResponse<any> = {
      success: false,
      status: 400,
      message: "Bad request",
      data: null,
      fieldErrors: {},
    };

    act(() => {
      result.current.handleError(errorResponse);
    });

    expect(mockShowError).toHaveBeenCalledWith("Error", "Bad request");
    expect(mockShowWarning).not.toHaveBeenCalled();
  });

  it("should redirect to login for token revocation errors", () => {
    const { result } = renderHook(() => useErrorHandler());
    const revokedResponse: ApiResponse<any> = {
      success: false,
      status: 401,
      message: "User token has been revoked. Please log in again.",
      data: null,
      fieldErrors: {},
    };

    act(() => {
      result.current.handleError(revokedResponse);
    });

    expect(mockShowError).toHaveBeenCalled();
    expect(mockGoToLogin).not.toHaveBeenCalled(); // Not called immediately

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(mockGoToLogin).toHaveBeenCalled();
  });

  it("should use custom title when provided", () => {
    const { result } = renderHook(() => useErrorHandler());
    const errorResponse: ApiResponse<any> = {
      success: false,
      status: 400,
      message: "Custom error message",
      data: null,
      fieldErrors: {},
    };

    act(() => {
      result.current.handleError(errorResponse, "Custom Title");
    });

    expect(mockShowError).toHaveBeenCalledWith(
      "Custom Title",
      "Custom error message"
    );
  });

  it("should handle null or undefined response", () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.handleError(null as any);
    });

    expect(mockShowError).not.toHaveBeenCalled();
    expect(mockShowWarning).not.toHaveBeenCalled();
  });

  it("should handle response without status code", () => {
    const { result } = renderHook(() => useErrorHandler());
    const errorResponse: ApiResponse<any> = {
      success: false,
      message: "Error without status",
      data: null,
      fieldErrors: {},
    };

    act(() => {
      result.current.handleError(errorResponse);
    });

    expect(mockShowError).toHaveBeenCalled();
  });

  it("should handle multiple errors sequentially", () => {
    const { result } = renderHook(() => useErrorHandler());
    const error1: ApiResponse<any> = {
      success: false,
      status: 400,
      message: "First error",
      data: null,
      fieldErrors: {},
    };
    const error2: ApiResponse<any> = {
      success: false,
      status: 429,
      message: "Second error",
      data: null,
      fieldErrors: {},
    };

    act(() => {
      result.current.handleError(error1);
    });

    expect(mockShowError).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.handleError(error2);
    });

    expect(mockShowWarning).toHaveBeenCalledTimes(1);
    expect(mockShowError).toHaveBeenCalledTimes(1);
  });

  it("should handle token revocation with custom title", () => {
    const { result } = renderHook(() => useErrorHandler());
    const revokedResponse: ApiResponse<any> = {
      success: false,
      status: 401,
      message: "User token has been revoked. Please log in again.",
      data: null,
      fieldErrors: {},
    };

    act(() => {
      result.current.handleError(revokedResponse, "Session Expired");
    });

    expect(mockShowError).toHaveBeenCalledWith(
      "Session Expired",
      expect.any(String)
    );

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(mockGoToLogin).toHaveBeenCalled();
  });
});
