export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  status?: number;
  fieldErrors?: Record<string, string>;
  raw?: unknown;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface AxiosErrorResponse {
  message: string;
  error?: string;
  details?: Record<string, unknown>;
}

export interface ApiErrorData {
  message?: string;
}

export interface ApiErrorResponse {
  data?: ApiErrorData;
}

export interface HttpErrorLike {
  response?: ApiErrorResponse;
}

export type PermissionKey = string;
