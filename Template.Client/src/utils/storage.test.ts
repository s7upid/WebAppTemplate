jest.mock("@/utils/env", () => ({
  env: {
    VITE_STORAGE_SECRET_KEY: "k",
    VITE_APP_NAME: "test-app",
  },
}));

jest.unmock("@/utils/storage");

import { SecureStorage } from "@/utils/storage";

describe("storage", () => {
  it("loads module", async () => {
    const mod = await import("./storage");
    expect(mod.SecureStorage).toBeDefined();
  });
});

const mockLocalStorage = window.localStorage as unknown as {
  getItem: jest.Mock<string | null, [string]>;
  setItem: jest.Mock<void, [string, string]>;
  removeItem: jest.Mock<void, [string]>;
  clear: jest.Mock<void, []>;
};

describe("SecureStorage", () => {
  beforeEach(() => {
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
    mockLocalStorage.removeItem.mockClear();
    mockLocalStorage.clear.mockClear();
  });

  it("sets items and handles set errors silently", () => {
    SecureStorage.setItem("test-key", "test-value");
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "test-app_test-key",
      expect.any(String)
    );

    (window.localStorage.setItem as jest.Mock).mockImplementation(() => {
      throw new Error("Storage error");
    });
    expect(() => SecureStorage.setItem("test-key", "test-value")).not.toThrow();
  });

  it("gets items, returns null for missing, and handles get errors", () => {
    const encryptedValue = "encrypted-test-value";
    mockLocalStorage.getItem.mockReturnValue(encryptedValue);
    const result = SecureStorage.getItem("test-key");
    expect(window.localStorage.getItem).toHaveBeenCalledWith(
      "test-app_test-key"
    );
    expect(result).toBeDefined();

    mockLocalStorage.getItem.mockReturnValue(null);
    expect(SecureStorage.getItem("non-existent-key")).toBeNull();

    mockLocalStorage.getItem.mockImplementation(() => {
      throw new Error("Storage error");
    });
    expect(SecureStorage.getItem("test-key")).toBeNull();
  });

  it("removes items and handles remove errors silently", () => {
    SecureStorage.removeItem("test-key");
    expect(window.localStorage.removeItem).toHaveBeenCalledWith(
      "test-app_test-key"
    );

    mockLocalStorage.removeItem.mockImplementation(() => {
      throw new Error("Storage error");
    });
    expect(() => SecureStorage.removeItem("test-key")).not.toThrow();
  });

  it("clears storage and handles clear errors silently", () => {
    SecureStorage.setItem("test-key-1", "value1");
    SecureStorage.setItem("test-key-2", "value2");
    expect(() => SecureStorage.clear()).not.toThrow();
    expect(SecureStorage.getItem("test-key-1")).toBeNull();
    expect(SecureStorage.getItem("test-key-2")).toBeNull();

    mockLocalStorage.clear.mockImplementation(() => {
      throw new Error("Storage error");
    });
    expect(() => SecureStorage.clear()).not.toThrow();
  });

  it("sets/gets token and sets/gets user including invalid JSON case", () => {
    const token = "test-token-123";
    SecureStorage.setToken(token);
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "test-app_authToken",
      expect.any(String)
    );

    mockLocalStorage.getItem.mockReturnValue("encrypted-token");
    SecureStorage.getToken();
    expect(window.localStorage.getItem).toHaveBeenCalledWith(
      "test-app_authToken"
    );

    const user = { id: 1, name: "John Doe", email: "john@example.com" } as any;
    SecureStorage.setUser(user as any);
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "test-app_user",
      expect.any(String)
    );

    mockLocalStorage.getItem.mockReturnValue("encrypted-user");
    SecureStorage.getUser();
    expect(window.localStorage.getItem).toHaveBeenCalledWith("test-app_user");

    mockLocalStorage.getItem.mockReturnValue("invalid-json");
    expect(SecureStorage.getUser()).toBeNull();
  });

  it("returns auth status based on token presence and expiry", () => {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const exp = Math.floor(Date.now() / 1000) + 60;
    const payload = btoa(JSON.stringify({ sub: "1", exp }));
    const token = `${header}.${payload}.signature`;
    mockLocalStorage.getItem.mockReturnValue(token);
    expect(SecureStorage.isAuthenticated()).toBe(true);

    mockLocalStorage.getItem.mockReturnValue(null);
    expect(SecureStorage.isAuthenticated()).toBe(false);
  });

  it("checks if token is expiring soon", () => {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));

    const expSoon = Math.floor(Date.now() / 1000) + 120;
    const payloadSoon = btoa(JSON.stringify({ sub: "1", exp: expSoon }));
    const tokenSoon = `${header}.${payloadSoon}.signature`;
    mockLocalStorage.getItem.mockReturnValue(tokenSoon);
    expect(SecureStorage.isTokenExpiringSoon()).toBe(true);

    const expLater = Math.floor(Date.now() / 1000) + 600;
    const payloadLater = btoa(JSON.stringify({ sub: "1", exp: expLater }));
    const tokenLater = `${header}.${payloadLater}.signature`;
    mockLocalStorage.getItem.mockReturnValue(tokenLater);
    expect(SecureStorage.isTokenExpiringSoon()).toBe(false);

    mockLocalStorage.getItem.mockReturnValue(null);
    expect(SecureStorage.isTokenExpiringSoon()).toBe(true);
  });

  it("gets token expiration time", () => {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const exp = Math.floor(Date.now() / 1000) + 3600;
    const payload = btoa(JSON.stringify({ sub: "1", exp }));
    const token = `${header}.${payload}.signature`;
    mockLocalStorage.getItem.mockReturnValue(token);

    const expiration = SecureStorage.getTokenExpiration();
    expect(expiration).toBeInstanceOf(Date);
    expect(expiration!.getTime()).toBeCloseTo(exp * 1000, -2);

    mockLocalStorage.getItem.mockReturnValue(null);
    expect(SecureStorage.getTokenExpiration()).toBeNull();
  });

  it("handles invalid token format gracefully", () => {
    mockLocalStorage.getItem.mockReturnValue("invalid-token");
    expect(SecureStorage.isAuthenticated()).toBe(false);
    expect(SecureStorage.isTokenExpiringSoon()).toBe(true);
    expect(SecureStorage.getTokenExpiration()).toBeNull();

    mockLocalStorage.getItem.mockReturnValue("invalid.base64!");
    expect(SecureStorage.isAuthenticated()).toBe(false);
    expect(SecureStorage.isTokenExpiringSoon()).toBe(true);
    expect(SecureStorage.getTokenExpiration()).toBeNull();

    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const invalidPayload = btoa("invalid-json");
    const invalidToken = `${header}.${invalidPayload}.signature`;
    mockLocalStorage.getItem.mockReturnValue(invalidToken);
    expect(SecureStorage.isAuthenticated()).toBe(false);
    expect(SecureStorage.isTokenExpiringSoon()).toBe(true);
    expect(SecureStorage.getTokenExpiration()).toBeNull();
  });
});
