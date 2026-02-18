import { SecureStorage } from "@/utils";
import { AUTH_PATHS } from "@/config/constants";
import { mockAuth } from "@/mock";
import {
  BaseService,
  normalizeApiResponse,
  setGlobalRefreshToken,
} from "../base";
import {
  ApiResponse,
  UserResponse,
  LoginRequest,
  AuthResponse,
  ForgotPasswordRequest,
  ChangePasswordRequest,
  ResetPasswordRequest,
  ConfirmEmailRequest,
} from "@/models";

class AuthService extends BaseService {
  constructor() {
    super("auth");
    setGlobalRefreshToken(() => this.refreshTokenDirect());
  }

  private adaptUser(user: any): UserResponse {
    return {
      ...user,
      role: user.role || undefined,
    } as UserResponse;
  }

  protected async refreshTokenDirect(): Promise<boolean> {
    try {
      const token = this.getToken();
      if (!token) {
        return false;
      }

      const response = await fetch(
        `${this.baseUrl}${AUTH_PATHS.REFRESH_TOKEN}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        return false;
      }

      const json = await response.json();
      const normalizedResponse = normalizeApiResponse<AuthResponse>(json);

      if (normalizedResponse.success && normalizedResponse.data) {
        const { user, token: newToken } = normalizedResponse.data;
        if (newToken) {
          const adaptedUser = this.adaptUser(user);
          SecureStorage.setToken(newToken);
          SecureStorage.setUser(adaptedUser);
          return true;
        }
      }

      return false;
    } catch {
      return false;
    }
  }

  async login(request: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    if (this.useMockData) return mockAuth.login(request);

    const response = await this.request<AuthResponse>(AUTH_PATHS.LOGIN, {
      method: "POST",
      body: JSON.stringify(request),
    });
    if (response.success && response.data) {
      const adaptedUser = this.adaptUser(response.data.user);
      return {
        ...response,
        data: {
          user: adaptedUser,
          token: response.data.token,
          expiresAt: response.data.expiresAt,
        },
      };
    }
    return response;
  }

  async logout(): Promise<ApiResponse<null>> {
    if (this.useMockData) return mockAuth.logout();

    this.getTokenOrThrow();
    return this.request<null>(AUTH_PATHS.LOGOUT, {
      method: "POST",
    });
  }

  async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    if (this.useMockData) return mockAuth.refreshToken();

    this.getTokenOrThrow();
    const response = await this.request<AuthResponse>(
      AUTH_PATHS.REFRESH_TOKEN,
      {
        method: "POST",
      }
    );
    if (response.success && response.data) {
      const adaptedUser = this.adaptUser(response.data.user);
      return {
        ...response,
        data: {
          user: adaptedUser,
          token: response.data.token,
          expiresAt: response.data.expiresAt,
        },
      };
    }
    return response;
  }

  async forgotPassword(
    request: ForgotPasswordRequest
  ): Promise<ApiResponse<null>> {
    if (this.useMockData) return mockAuth.forgotPassword(request);

    return this.request<null>(AUTH_PATHS.FORGOT_PASSWORD, {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  async changePassword(
    request: ChangePasswordRequest
  ): Promise<ApiResponse<null>> {
    if (this.useMockData) return mockAuth.changePassword(request);

    this.getTokenOrThrow();
    return this.request<null>(AUTH_PATHS.CHANGE_PASSWORD, {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  async resetPassword(
    request: ResetPasswordRequest
  ): Promise<ApiResponse<null>> {
    if (this.useMockData) return mockAuth.resetPassword(request);

    return this.request<null>(AUTH_PATHS.RESET_PASSWORD, {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  async confirmEmail(request: ConfirmEmailRequest): Promise<ApiResponse<null>> {
    if (this.useMockData) return mockAuth.confirmEmail(request);

    return this.request<null>(AUTH_PATHS.CONFIRM_EMAIL, {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  async getCurrentUser(): Promise<ApiResponse<UserResponse>> {
    if (this.useMockData) return mockAuth.getCurrentUser();

    this.getTokenOrThrow();
    const response = await this.request<UserResponse>(AUTH_PATHS.ME);
    if (response.success && response.data) {
      const user = response.data as UserResponse;
      const adaptedUser = this.adaptUser(user);
      return { ...response, data: adaptedUser };
    }
    return response;
  }
}

export const authService = new AuthService();
