import {
  ApiResponse,
  UserResponse,
  LoginRequest,
  AuthResponse,
  ConfirmEmailRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  UserStatus,
} from "@/models";
import { SecureStorage } from "@/utils";
import {
  mockUsers,
  mockPasswords,
  extractUserIdFromToken,
  createSuccessResponse,
} from "@/mock";

class MockAuth {
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    if (
      credentials.email === "admin@admin.com" &&
      credentials.password === "admin123"
    ) {
      const adminUser = mockUsers.find((u) => u.email === credentials.email);
      if (!adminUser)
        return {
          success: false,
          data: null as never,
          message: "Invalid email or password",
        };

      const token = `mock-jwt-token-${adminUser.id}`;
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const response: AuthResponse = {
        user: {
          id: adminUser.id,
          email: adminUser.email,
          firstName: adminUser.firstName,
          lastName: adminUser.lastName,
          customPermissionsCount: 0,
          isActive: adminUser.isActive,
          userStatus: adminUser.userStatus,
          lastLogin: adminUser.lastLogin,
          createdAt: adminUser.createdAt,
          updatedAt: adminUser.updatedAt,
          avatar: adminUser.avatar,
          permissionKeys: adminUser.permissionKeys,
          permissions: adminUser.permissions,
          role: adminUser.role,
        },
        token,
        expiresAt,
      };

      return {
        success: true,
        data: response,
        message: "Login successful",
      };
    }

    const user = mockUsers.find((u) => u.email === credentials.email);
    if (!user || mockPasswords[credentials.email!] !== credentials.password) {
      return {
        success: false,
        data: null as never,
        message: "Invalid email or password",
      };
    }

    const token = `mock-jwt-token-${user.id}-${Date.now()}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          customPermissionsCount: 0,
          isActive: user.isActive,
          userStatus: user.userStatus,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          avatar: user.avatar,
          permissionKeys: user.permissionKeys,
          permissions: user.permissions,
          role: user.role,
        },
        token,
        expiresAt,
      },
      message: "Login successful",
    };
  }

  async logout(): Promise<ApiResponse<null>> {
    return {
      success: true,
      data: null,
      message: "Logout successful",
    };
  }

  async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    const token = SecureStorage.getToken();
    const userId = extractUserIdFromToken(token);
    const user = mockUsers.find((u) => u.id === userId);

    if (!user) {
      return {
        success: false,
        data: null as never,
        message: "User not found",
      };
    }

    const newToken = `mock-jwt-token-${user.id}-${Date.now()}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const response: AuthResponse = {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        customPermissionsCount: 0,
        isActive: user.isActive,
        userStatus: user.userStatus,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        avatar: user.avatar,
        permissionKeys: user.permissionKeys,
        permissions: user.permissions,
        role: user.role,
      },
      token: newToken,
      expiresAt,
    };

    return {
      success: true,
      data: response,
      message: "Token refreshed successfully",
    };
  }

  async getCurrentUser(): Promise<ApiResponse<UserResponse>> {
    const token = SecureStorage.getToken();
    const userId = extractUserIdFromToken(token);
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) {
      return {
        success: false,
        data: null as never,
        message: "User not found",
      };
    }

    return createSuccessResponse(
      {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        customPermissionsCount: 0,
        isActive: user.isActive,
        userStatus: user.userStatus,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        avatar: user.avatar,
        permissionKeys: user.permissionKeys,
        permissions: user.permissions,
        role: user.role,
      },
      "User retrieved successfully"
    );
  }

  async setupPassword(request: {
    token: string;
    password: string;
  }): Promise<ApiResponse<{ user: UserResponse; authToken: string }>> {
    if (!request.token || !request.password || request.password.length < 8) {
      return {
        success: false,
        data: null as never,
        message: "Invalid or weak password or token",
      };
    }

    const pendingUser = mockUsers.find((u) => u.userStatus === UserStatus.Pending);
    if (!pendingUser)
      return {
        success: false,
        data: null as never,
        message: "Invalid or expired setup token",
      };

    pendingUser.userStatus = UserStatus.Active;
    pendingUser.lastLogin = new Date();
    const authToken = `mock-jwt-token-${pendingUser.id}-${Date.now()}`;
    SecureStorage.setToken(authToken);
    SecureStorage.setUser(pendingUser);

    return {
      success: true,
      data: {
        user: {
          id: pendingUser.id,
          email: pendingUser.email,
          firstName: pendingUser.firstName,
          lastName: pendingUser.lastName,
          customPermissionsCount: 0,
          isActive: pendingUser.isActive,
          userStatus: pendingUser.userStatus,
          lastLogin: pendingUser.lastLogin,
          createdAt: pendingUser.createdAt,
          updatedAt: pendingUser.updatedAt,
          avatar: pendingUser.avatar,
          permissionKeys: pendingUser.permissionKeys,
          permissions: pendingUser.permissions,
          role: pendingUser.role,
        },
        authToken,
      },
      message: "Password setup successful",
    };
  }

  async forgotPassword(
    data: ForgotPasswordRequest
  ): Promise<ApiResponse<null>> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
      return {
        success: false,
        data: null,
        message: "Invalid email format",
      };
    }

    const user = mockUsers.find((u) => u.email === data.email);
    if (!user) {
      return {
        success: false,
        data: null,
        message: "User not found",
      };
    }

    return {
      success: true,
      data: null,
      message: "Password reset email sent successfully",
    };
  }

  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<null>> {
    if (!data.email || !data.token || !data.newPassword) {
      return {
        success: false,
        data: null,
        message: "All fields are required",
      };
    }

    if (data.newPassword.length < 8) {
      return {
        success: false,
        data: null,
        message: "Password must be at least 8 characters long",
      };
    }

    const user = mockUsers.find((u) => u.email === data.email);
    if (!user) {
      return {
        success: false,
        data: null,
        message: "Invalid email or token",
      };
    }

    if (data.token !== "valid-reset-token") {
      return {
        success: false,
        data: null,
        message: "Invalid or expired reset token",
      };
    }

    mockPasswords[data.email] = data.newPassword;

    return {
      success: true,
      data: null,
      message: "Password reset successfully",
    };
  }

  async confirmEmail(data: ConfirmEmailRequest): Promise<ApiResponse<null>> {
    if (!data.email || !data.token) {
      return {
        success: false,
        data: null,
        message: "Email and token are required",
      };
    }

    const user = mockUsers.find((u) => u.email === data.email);
    if (!user) {
      return {
        success: false,
        data: null,
        message: "Invalid email or token",
      };
    }

    if (data.token !== "valid-confirmation-token") {
      return {
        success: false,
        data: null,
        message: "Invalid or expired confirmation token",
      };
    }

    return {
      success: true,
      data: null,
      message: "Email confirmed successfully",
    };
  }

  async changePassword(
    data: ChangePasswordRequest
  ): Promise<ApiResponse<null>> {
    const currentUserResponse = await this.getCurrentUser();
    if (!currentUserResponse.success || !currentUserResponse.data) {
      return {
        success: false,
        data: null,
        message: "User not authenticated",
      };
    }

    const currentUser = currentUserResponse.data;

    if (!data.currentPassword) {
      return {
        success: false,
        data: null,
        message: "Current password is required",
      };
    }

    const storedPassword = mockPasswords[currentUser.email!];
    if (storedPassword !== data.currentPassword) {
      return {
        success: false,
        data: null,
        message: "Current password is incorrect",
      };
    }

    if (!data.newPassword || data.newPassword.length < 8) {
      return {
        success: false,
        data: null,
        message: "New password must be at least 8 characters long",
      };
    }

    const anyData: any = data as any;
    if (
      typeof anyData.confirmPassword === "string" &&
      anyData.confirmPassword !== data.newPassword
    ) {
      return {
        success: false,
        data: null,
        message: "Passwords do not match",
      };
    }

    mockPasswords[currentUser.email!] = data.newPassword;

    return {
      success: true,
      data: null,
      message: "Password changed successfully",
    };
  }
}

export const mockAuth = new MockAuth();
