import { useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";

import {
  LoginRequest,
  ForgotPasswordRequest,
  ChangePasswordRequest,
} from "@/models";
import {
  loginUser,
  logoutUser,
  getCurrentUser,
  refreshToken,
  forgotPassword,
  changePassword,
} from "@/store/slices/auth/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth
  );

  const login = useCallback(
    async (request: LoginRequest) => {
      const result = await dispatch(loginUser(request));
      return result;
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    const result = await dispatch(logoutUser());
    return result;
  }, [dispatch]);

  const refreshTokenAction = useCallback(async () => {
    const result = await dispatch(refreshToken());
    return result;
  }, [dispatch]);

  const forgotPasswordAction = useCallback(
    async (request: ForgotPasswordRequest) => {
      const result = await dispatch(forgotPassword(request));
      return result;
    },
    [dispatch]
  );

  const changePasswordAction = useCallback(
    async (request: ChangePasswordRequest) => {
      const result = await dispatch(changePassword(request));
      return result;
    },
    [dispatch]
  );

  const refreshUser = useCallback(async () => {
    const result = await dispatch(getCurrentUser());
    return result;
  }, [dispatch]);

  return useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      isLoading,
      login,
      logout,
      refreshUser,
      refreshToken: refreshTokenAction,
      forgotPassword: forgotPasswordAction,
      changePassword: changePasswordAction,
    }),
    [
      user,
      token,
      isAuthenticated,
      isLoading,
      login,
      logout,
      refreshUser,
      refreshTokenAction,
      forgotPasswordAction,
      changePasswordAction,
    ]
  );
};
