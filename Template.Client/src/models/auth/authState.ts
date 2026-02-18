import { SecureStorage } from "@/utils/storage";
import { UserResponse } from "../generated";

export interface AuthState {
  user: UserResponse | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const token = SecureStorage.getToken();
const storedUser = SecureStorage.getUser();

export const authStateInitialState: AuthState & { error: string | null } = {
  user: storedUser || null,
  token: token,
  refreshToken: null,
  isAuthenticated: !!token,
  isLoading: false,
  error: null,
};
