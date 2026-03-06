import { ApiResponse } from "@/models/shared/api";
import { extractErrorMessage } from "@/utils/entityOperations";

export function normalizeApiResponse<T>(input: unknown): ApiResponse<T> {
  const inputObj = input as Record<string, unknown>;
  const status =
    typeof inputObj?.status === "number"
      ? inputObj.status
      : typeof inputObj?.statusCode === "number"
      ? inputObj.statusCode
      : 500;

  if (status >= 200 && status < 300) {
    return {
      success: true,
      data: input as T,
      message: "",
      fieldErrors: {},
      status,
      raw: input,
    };
  }

  const fieldErrors = extractFieldErrors(input);
  let message = extractErrorMessage(input);
  const connectionMessage =
    "Unable to connect. Please check that the backend server is running.";
  const isGenericNetworkError =
    status === 0 &&
    (!message || message === "Network error" || message === "Failed to fetch");
  const isGenericServerError =
    (status === 500 || status === 502 || status === 503) &&
    (!message ||
      /internal server error|connection refused|econnrefused|bad gateway|service unavailable/i.test(
        message
      ));
  if (isGenericNetworkError || isGenericServerError) {
    message = connectionMessage;
  }

  return {
    success: false,
    data: null as T,
    message,
    fieldErrors,
    status,
    raw: input,
  };
}

function extractFieldErrors(input: unknown): Record<string, string> {
  const inputObj = input as Record<string, unknown>;
  const errorsObj = inputObj?.errors || inputObj?.FieldErrors || inputObj?.fieldErrors;
  const fieldErrors: Record<string, string> = {};

  if (errorsObj && typeof errorsObj === "object" && !Array.isArray(errorsObj)) {
    for (const [key, value] of Object.entries(errorsObj as Record<string, unknown>)) {
      const arr = Array.isArray(value) ? value : [String(value ?? "")];
      if (arr.length > 0 && String(arr[0]).trim().length > 0) {
        const camel = key.charAt(0).toLowerCase() + key.slice(1);
        fieldErrors[camel] = String(arr[0]);
      }
    }
  }

  return fieldErrors;
}
