import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authService } from "@/services/auth/authService";
import { SecureStorage } from "@/utils";
import { ERROR_MESSAGES } from "@/config";
import {
  UserResponse,
  LoginRequest,
  ForgotPasswordRequest,
  ChangePasswordRequest,
  ResetPasswordRequest,
  ConfirmEmailRequest,
  authStateInitialState,
} from "@/models";

export const loginUser = createAsyncThunk<
  { user: UserResponse; token: string },
  LoginRequest
>("auth/login", async (credentials: LoginRequest, { rejectWithValue }) => {
  try {
    const response = await authService.login(credentials);

    if (!response.success || !response.data) {
      const backendMessage = response.message?.toString?.() || "";
      return rejectWithValue({
        message: backendMessage || ERROR_MESSAGES.LOGIN_FAILED,
        status: response.status,
      });
    }

    const { user, token } = response.data;
    if (!user || !token) {
      return rejectWithValue({
        message: ERROR_MESSAGES.INVALID_RESPONSE_DATA,
      });
    }

    const adaptedUser = {
      ...user,
    } as UserResponse;

    SecureStorage.setToken(token);
    SecureStorage.setUser(adaptedUser);

    return { user: adaptedUser, token };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : ERROR_MESSAGES.LOGIN_FAILED;
    return rejectWithValue({ message: errorMessage });
  }
});

export const logoutUser = createAsyncThunk("auth/logout", async (_, {}) => {
  try {
    await authService.logout();
  } catch (error: unknown) {
  } finally {
    SecureStorage.clear();
  }
});

export const refreshToken = createAsyncThunk<
  { user: UserResponse; token: string },
  void
>("auth/refreshToken", async (_, { rejectWithValue }) => {
  try {
    const response = await authService.refreshToken();
    
    if (!response || !response.success || !response.data) {
      return rejectWithValue(
        response?.message || ERROR_MESSAGES.TOKEN_REFRESH_FAILED
      );
    }

    const { user, token } = response.data;
    if (!user || !token) {
      return rejectWithValue(ERROR_MESSAGES.INVALID_RESPONSE_DATA);
    }

    const adaptedUser = {
      ...user,
    } as UserResponse;

    SecureStorage.setToken(token);
    SecureStorage.setUser(adaptedUser);

    return { user: adaptedUser, token };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : ERROR_MESSAGES.TOKEN_REFRESH_FAILED;
    return rejectWithValue(errorMessage);
  }
});

export const forgotPassword = createAsyncThunk<string, ForgotPasswordRequest>(
  "auth/forgotPassword",
  async (request: ForgotPasswordRequest, { rejectWithValue }) => {
    try {
      const response = await authService.forgotPassword(request);

      if (!response.success) {
        return rejectWithValue(
          response.message || "Failed to send reset email"
        );
      }

      return response.message || "Reset email sent successfully";
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send reset email";
      return rejectWithValue(errorMessage);
    }
  }
);

export const changePassword = createAsyncThunk<string, ChangePasswordRequest>(
  "auth/changePassword",
  async (request: ChangePasswordRequest, { rejectWithValue }) => {
    try {
      const response = await authService.changePassword(request);

      if (!response.success) {
        return rejectWithValue(response.message || "Failed to change password");
      }

      return response.message || "Password changed successfully";
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to change password";
      return rejectWithValue(errorMessage);
    }
  }
);

export const getCurrentUser = createAsyncThunk<UserResponse, void>(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();

      if (!response.success || !response.data) {
        return rejectWithValue(response.message || "Failed to get user");
      }

      const adaptedUser = {
        ...response.data,
      } as UserResponse;
      return adaptedUser;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to get user";
      return rejectWithValue(errorMessage);
    }
  }
);

export const resetPassword = createAsyncThunk<null, ResetPasswordRequest>(
  "auth/resetPassword",
  async (request: ResetPasswordRequest, { rejectWithValue }) => {
    try {
      const response = await authService.resetPassword(request);

      if (!response.success) {
        const backendMessage = response.message?.toString?.() || "";
        return rejectWithValue(backendMessage || "Password reset failed");
      }

      return response.data || null;
    } catch (error) {
      return rejectWithValue("Password reset failed");
    }
  }
);

export const confirmEmail = createAsyncThunk<null, ConfirmEmailRequest>(
  "auth/confirmEmail",
  async (request: ConfirmEmailRequest, { rejectWithValue }) => {
    try {
      const response = await authService.confirmEmail(request);

      if (!response.success) {
        const backendMessage = response.message?.toString?.() || "";
        return rejectWithValue(backendMessage || "Email confirmation failed");
      }

      return response.data || null;
    } catch (error) {
      return rejectWithValue("Email confirmation failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: authStateInitialState,
  reducers: {
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
    setUser: (state, action: PayloadAction<UserResponse>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload ?? null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        if (typeof action.payload === "string") {
          state.error = action.payload;
        } else if (action.payload && typeof action.payload === "object" && "message" in action.payload) {
          state.error = (action.payload as { message: string }).message;
        } else {
          state.error = ERROR_MESSAGES.LOGIN_FAILED;
        }
      })

      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })

      .addCase(refreshToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error =
          (action.payload as string) || ERROR_MESSAGES.TOKEN_REFRESH_FAILED;
      })

      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Failed to send reset email";
      })

      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to change password";
      })

      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
        state.error =
          (action.payload as string) || "Failed to get current user";
      })

      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Password reset failed";
      })

      .addCase(confirmEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(confirmEmail.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(confirmEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Email confirmation failed";
      });
  },
});

export const { clearAuth, setUser, setToken, clearError } = authSlice.actions;
export default authSlice.reducer;
