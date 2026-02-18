type AppEnv = Omit<ImportMetaEnv, "BASE_URL" | "DEV" | "PROD" | "SSR">;

const defaultEnv: AppEnv = {
  MODE: "development",
  VITE_API_URL: "http://localhost:3000/api",
  VITE_USE_MOCK_DATA: "false",
  VITE_GOOGLE_CLIENT_ID: "",
  VITE_ENVIRONMENT: "development",
  VITE_STORAGE_SECRET_KEY: "dev-secret-key",
  VITE_APP_NAME: "Template",
};

const testEnv: AppEnv = {
  MODE: "test",
  VITE_API_URL: "http://localhost:3000/api",
  VITE_USE_MOCK_DATA: "false",
  VITE_GOOGLE_CLIENT_ID: "test-google-client-id",
  VITE_ENVIRONMENT: "test",
  VITE_STORAGE_SECRET_KEY: "test-secret-key",
  VITE_APP_NAME: "test-app",
};

const isJest = typeof process !== "undefined" && process.env?.JEST_WORKER_ID !== undefined;

function getEnv(): AppEnv {
  if (isJest) return testEnv;

  try {
    const getImportMeta = new Function("return typeof import.meta !== 'undefined' ? import.meta.env : null");
    const viteEnv = getImportMeta();
    if (viteEnv) return { ...defaultEnv, ...viteEnv };
  } catch {
    // Fallback to defaults
  }

  return defaultEnv;
}

export const env: AppEnv = getEnv();
