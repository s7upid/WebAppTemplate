import { env } from "./env";
import { AuthResponse, UserResponse } from "@/models/generated";
import CryptoJS from "crypto-js";

const SECRET_KEY = env.VITE_STORAGE_SECRET_KEY || "super-secret-key";
const STORAGE_PREFIX = env.VITE_APP_NAME;

const encrypt = (data: string): string => {
  try {
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
  } catch {
    return data;
  }
};

const decrypt = (cipher: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipher, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8) || cipher;
  } catch {
    return cipher;
  }
};

const keyName = (key: string) => `${STORAGE_PREFIX}_${key}`;

export const SecureStorage = {
  setItem: (key: string, value: string): void => {
    try {
      const encryptedValue = encrypt(value);
      localStorage.setItem(keyName(key), encryptedValue);
    } catch {}
  },

  getItem: (key: string): string | null => {
    try {
      const encryptedValue = localStorage.getItem(keyName(key));
      if (!encryptedValue) return null;
      return decrypt(encryptedValue);
    } catch {
      return null;
    }
  },

  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(keyName(key));
    } catch {}
  },

  clear: (): void => {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith(STORAGE_PREFIX))
        .forEach((k) => localStorage.removeItem(k));
    } catch {}
  },

  setAuth: (auth: AuthResponse): void => {
    if (auth?.token) SecureStorage.setItem("authToken", auth.token);
    if (auth?.user) SecureStorage.setItem("user", JSON.stringify(auth.user));
  },

  getAuth: (): { token: string | null; user: UserResponse | null } => {
    return {
      token: SecureStorage.getToken(),
      user: SecureStorage.getUser(),
    };
  },

  clearAuth: (): void => {
    SecureStorage.removeItem("authToken");
    SecureStorage.removeItem("user");
  },

  setToken: (token: string): void => SecureStorage.setItem("authToken", token),
  getToken: (): string | null => SecureStorage.getItem("authToken"),

  setUser: (user: UserResponse): void =>
    SecureStorage.setItem("user", JSON.stringify(user)),

  getUser: (): UserResponse | null => {
    const userStr = SecureStorage.getItem("user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    const token = SecureStorage.getToken();
    if (!token) return false;

    try {
      const [, payloadBase64] = token.split(".");
      const payloadJson = JSON.parse(atob(payloadBase64));
      const exp = payloadJson.exp * 1000;
      return Date.now() < exp;
    } catch {
      return false;
    }
  },

  isTokenExpiringSoon: (): boolean => {
    const token = SecureStorage.getToken();
    if (!token) return true;

    try {
      const [, payloadBase64] = token.split(".");
      const payloadJson = JSON.parse(atob(payloadBase64));
      const exp = payloadJson.exp * 1000;
      const now = Date.now();
      const fiveMinutesFromNow = now + 5 * 60 * 1000;
      const bufferTime = now + 2 * 60 * 1000;

      return exp <= Math.max(fiveMinutesFromNow, bufferTime);
    } catch {
      return true;
    }
  },

  getTokenExpiration: (): Date | null => {
    const token = SecureStorage.getToken();
    if (!token) return null;

    try {
      const [, payloadBase64] = token.split(".");
      const payloadJson = JSON.parse(atob(payloadBase64));
      const exp = payloadJson.exp * 1000;
      return new Date(exp);
    } catch {
      return null;
    }
  },
};
