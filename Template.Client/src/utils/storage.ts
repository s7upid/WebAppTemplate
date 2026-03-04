import { env } from "./env";
import { AuthResponse, UserResponse } from "@/models/generated";

const SECRET_KEY = env.VITE_STORAGE_SECRET_KEY;
const STORAGE_PREFIX = env.VITE_APP_NAME;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function xorWithKey(input: Uint8Array, key: Uint8Array): Uint8Array {
  if (key.length === 0) return input;
  const output = new Uint8Array(input.length);
  for (let i = 0; i < input.length; i++) {
    output[i] = input[i] ^ key[i % key.length];
  }
  return output;
}

const encrypt = (data: string): string => {
  try {
    const dataBytes = encoder.encode(data);
    const keyBytes = encoder.encode(SECRET_KEY);
    const xored = xorWithKey(dataBytes, keyBytes);
    let binary = "";
    for (let i = 0; i < xored.length; i++) {
      binary += String.fromCharCode(xored[i]);
    }
    return btoa(binary);
  } catch {
    return data;
  }
};

const decrypt = (cipher: string): string => {
  try {
    const binary = atob(cipher);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const keyBytes = encoder.encode(SECRET_KEY);
    const decrypted = xorWithKey(bytes, keyBytes);
    return decoder.decode(decrypted);
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
    } catch {
      // Ignore storage errors
    }
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
    } catch {
      // Ignore storage errors
    }
  },

  clear: (): void => {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith(STORAGE_PREFIX))
        .forEach((k) => localStorage.removeItem(k));
    } catch {
      // Ignore storage errors
    }
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
