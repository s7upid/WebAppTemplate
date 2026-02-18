import { ApiResponse } from "@/models/shared/api";
import { ERROR_MESSAGES } from "@/config/constants";

export function isRateLimitError(response: ApiResponse<any>): boolean {
  return response.status === 429;
}

export function isTokenRevocationError(response: ApiResponse<any>): boolean {
  if (response.status !== 401) return false;
  const message = response.message?.toLowerCase() || "";
  return (
    message.includes("revoked") ||
    message.includes("token has been revoked") ||
    message.includes("user token has been revoked")
  );
}

export function getErrorMessage(response: ApiResponse<any>): string {
  if (!response || response.success) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  if (isRateLimitError(response)) {
    return (
      response.message ||
      "Rate limit exceeded. Please try again in a few minutes."
    );
  }

  if (isTokenRevocationError(response)) {
    return response.message || "Your session has expired. Please log in again.";
  }

  if (response.status === 401) {
    return (
      response.message ||
      "You are not authorized to perform this action. Please log in again."
    );
  }

  return (
    response.message ||
    response.raw?.message ||
    response.raw?.errorMessage ||
    ERROR_MESSAGES.NETWORK_ERROR
  );
}

export function getErrorToastType(
  response: ApiResponse<any>
): "error" | "warning" {
  if (isRateLimitError(response)) {
    return "warning";
  }
  return "error";
}

export function getErrorTitle(response: ApiResponse<any>): string {
  if (isRateLimitError(response)) {
    return "Rate Limit Exceeded";
  }
  if (isTokenRevocationError(response)) {
    return "Session Expired";
  }
  const status = response.status;
  if (status === 401) {
    return "Unauthorized";
  }
  if (status === 403) {
    return "Access Denied";
  }
  if (status === 404) {
    return "Not Found";
  }
  if (status && status >= 500) {
    return "Server Error";
  }
  return "Error";
}
