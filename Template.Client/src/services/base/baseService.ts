import { env, SecureStorage } from "@/utils";
import { normalizeApiResponse } from "./normalizeApiResponse";
import { ApiResponse } from "@/models/shared/api";

let navigateToLogin: (() => void) | null = null;
let clearAuthState: (() => void) | null = null;
let globalRefreshToken: (() => Promise<boolean>) | null = null;

let networkStatusHandler: ((online: boolean, errorMessage?: string) => void) | null = null;

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;
let hasNavigatedToLogin = false;

export const setNavigateToLogin = (
  navigateFn: () => void,
  clearAuthFn?: () => void
) => {
  navigateToLogin = navigateFn;
  if (clearAuthFn) {
    clearAuthState = clearAuthFn;
  }
};

export const setNetworkStatusHandler = (
  handler: ((online: boolean, errorMessage?: string) => void) | null
) => {
  networkStatusHandler = handler;
};

export const resetLoginNavigationFlag = () => {
  hasNavigatedToLogin = false;
};

export const setGlobalRefreshToken = (refreshFn: () => Promise<boolean>) => {
  globalRefreshToken = refreshFn;
};

export abstract class BaseService {
  protected baseUrl: string;
  protected useMockData = env.VITE_USE_MOCK_DATA === "true";

  constructor(basePath: string) {
    this.baseUrl = `${env.VITE_API_URL}/${basePath}`;
  }

  protected async refreshTokenDirect(): Promise<boolean> {
    if (globalRefreshToken) {
      return await globalRefreshToken();
    }

    return false;
  }

  protected getToken(): string {
    return SecureStorage.getToken() || "";
  }

  protected getTokenOrThrow(): string {
    const token = this.getToken();
    if (!token) throw new Error("No auth token found");
    return token;
  }

  protected async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    return this.requestWithRetry<T>(endpoint, options, false);
  }

  private async requestWithRetry<T>(
    endpoint: string,
    options: RequestInit = {},
    isRetry: boolean = false
  ): Promise<ApiResponse<T>> {
    const token = this.getToken();

    let response: Response | undefined;
    try {
      response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
          ...options.headers,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Network error";
      if (networkStatusHandler) {
        networkStatusHandler(false, errorMessage);
      }
      return normalizeApiResponse<T>({
        message: errorMessage,
        status: 0,
      });
    }

    if (!response) {
      const message = "No response received";
      if (networkStatusHandler) {
        networkStatusHandler(false, message);
      }
      return normalizeApiResponse<T>({ message, status: 0 });
    }

    let responseText: string = "";
    let responseJson: Record<string, unknown> | string | null = null;
    try {
      responseText = await response.text();
      if (responseText) {
        try {
          responseJson = JSON.parse(responseText);
        } catch {
          responseJson = responseText;
        }
      } else {
        responseJson = response?.statusText || "No content";
      }
    } catch {
      responseJson = response?.statusText || "Failed to parse response";
    }

    if (response.status >= 200 && response.status < 300 && networkStatusHandler) {
      networkStatusHandler(true);
    }

    if (response.status === 401 && !isRetry && this.getToken()) {
      try {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = (async () => {
            try {
              return await this.refreshTokenDirect();
            } finally {
              isRefreshing = false;
            }
          })();
        }

        const refreshSuccess = await (refreshPromise as Promise<boolean>);
        if (refreshSuccess) {
          return this.requestWithRetry<T>(endpoint, options, true);
        }

        try {
          SecureStorage.clear();
        } catch {
          // Ignore clear errors
        }
        if (!hasNavigatedToLogin && navigateToLogin) {
          hasNavigatedToLogin = true;
          clearAuthState?.();
          navigateToLogin();
        }
        
        const errorMessage = 
          (typeof responseJson === "object" && responseJson?.message) ||
          (typeof responseJson === "object" && responseJson?.errorMessage) ||
          (typeof responseJson === "string" && responseJson) ||
          "Unauthorized";
        
        return normalizeApiResponse<T>({
          message: errorMessage,
          status: 401,
        });
      } catch {
        // Ignore refresh errors
      }
    }

    if (response.status === 429) {
      const rateLimitMessage = 
        (typeof responseJson === "object" && responseJson?.message) ||
        (typeof responseJson === "object" && responseJson?.errorMessage) ||
        (typeof responseJson === "string" && responseJson) ||
        "Rate limit exceeded. Please try again later.";
      
      return normalizeApiResponse<T>({
        message: rateLimitMessage,
        status: 429,
      });
    }

    if (response.status === 401) {
      try {
        SecureStorage.clear();
      } catch {
        // Ignore clear errors
      }
      if (!hasNavigatedToLogin && navigateToLogin) {
        hasNavigatedToLogin = true;
        clearAuthState?.();
        navigateToLogin();
      }
      
      const errorMessage = 
        (typeof responseJson === "object" && responseJson?.message) ||
        (typeof responseJson === "object" && responseJson?.errorMessage) ||
        (typeof responseJson === "string" && responseJson) ||
        "Unauthorized";
      
      return normalizeApiResponse<T>({
        message: errorMessage,
        status: 401,
      });
    }

    const result = normalizeApiResponse<T>({
      ...(typeof responseJson === "object" ? responseJson : { message: responseJson }),
      status: response.status,
    });
    if (
      !result.success &&
      (response.status === 500 || response.status === 502 || response.status === 503) &&
      networkStatusHandler
    ) {
      networkStatusHandler(false, result.message);
    }
    return result;
  }
}
