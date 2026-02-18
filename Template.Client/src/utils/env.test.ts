import { env } from "@/utils/env";

describe("env utility", () => {
  const expectedKeys = [
    "VITE_ENVIRONMENT",
    "VITE_USE_MOCK_DATA",
    "VITE_STORAGE_SECRET_KEY",
    "VITE_GOOGLE_CLIENT_ID",
    "VITE_API_URL",
    "VITE_APP_NAME",
  ] as const;

  it("exposes all expected VITE_* properties", () => {
    expectedKeys.forEach((key) => {
      expect(env).toHaveProperty(key);
    });
  });

  it("values are strings", () => {
    expectedKeys.forEach((key) => {
      const value = env[key];
      expect(typeof value).toBe("string");
    });
  });

  it("values are consistent across multiple reads", () => {
    const copy = { ...env };
    expectedKeys.forEach((key) => {
      expect(env[key]).toBe(copy[key]);
    });
  });

  it("provides test defaults when MODE=test", () => {
    expect(env.VITE_ENVIRONMENT).toBe("test");
    expect(env.VITE_STORAGE_SECRET_KEY).toBe("test-secret-key");
    expect(env.VITE_GOOGLE_CLIENT_ID).toBe("test-google-client-id");
    expect(env.VITE_APP_NAME).toBe("test-app");
  });

  it("VITE_API_URL has a valid format", () => {
    expect(env.VITE_API_URL).toMatch(/^https?:\/\//);
  });
});
