import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  coverageProvider: "v8",
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
  testTimeout: 5000,
  silent: true,

  moduleNameMapper: {
    "^@/services/authService$": "<rootDir>/src/services/auth/authService.ts",
    "^@/hooks/useTheme$": "<rootDir>/src/hooks/ui/useTheme.ts",
    "^@/hooks/useAuth$": "<rootDir>/src/hooks/auth/useAuth.ts",
    "^@/hooks/useUsers$": "<rootDir>/src/hooks/entities/useUsers.ts",
    "^@/hooks/useToast$": "<rootDir>/src/hooks/ui/useToast.tsx",
    "^@/services/roleService$": "<rootDir>/src/services/entities/roleService.ts",
    "^@/services/userService$": "<rootDir>/src/services/entities/userService.ts",
    "^@/utils/env$": "<rootDir>/src/test/__mocks__/env.ts",
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@/services/api$": "<rootDir>/src/test/__mocks__/api.ts",
    "^@/utils/storage$": "<rootDir>/src/utils/storage.ts",
    "^@/utils/logger$": "<rootDir>/src/utils/logger.ts",
    "^@/services/dashboardDataApi$":
      "<rootDir>/src/test/__mocks__/dashboardDataApi.ts",
    "^@/services/dashboardApi$":
      "<rootDir>/src/test/__mocks__/dashboardDataApi.ts",
    "^@/services/permissionService$":
      "<rootDir>/src/services/entities/permissionService.ts",
    "^@/pages/HomePage$": "<rootDir>/src/test/__mocks__/HomePage.tsx",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^solstice-ui$": "<rootDir>/src/test/__mocks__/solstice-ui.tsx",
  },

  globals: {
    "import.meta": {
      env: {
        DEV: false,
        NODE_ENV: "test",
        VITE_ENVIRONMENT: "test",
        VITE_USE_MOCK_DATA: "false",
        VITE_STORAGE_SECRET_KEY: "test-secret-key",
        VITE_GOOGLE_CLIENT_ID: "test-google-client-id",
        VITE_API_URL: "http://localhost:3000",
        VITE_APP_NAME: "test-app",
      },
    },
  },

  transform: {
    "^.+\\.(t|j)sx?$": [
      "@swc/jest",
      {
        jsc: {
          target: "es2022",
          parser: { syntax: "typescript", tsx: true },
          transform: { react: { runtime: "automatic" } },
        },
        module: { type: "es6" },
      },
    ],
  },

  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    // Type definitions
    "!src/**/*.d.ts",
    "!src/vite-env.d.ts",
    // Test infrastructure
    "!src/test/**",
    // env.ts uses import.meta which Jest cannot parse
    "!src/utils/env.ts",
    // Entry points
    "!src/index.tsx",
    "!src/index.css",
    // Barrel files (re-exports only)
    "!src/**/index.ts",
    // Auto-generated types
    "!src/models/generated.ts",
    // App composition/routing (tested via E2E)
    "!src/App.tsx",
    // Static config/constants (no logic to test)
    "!src/config/constants.ts",
    "!src/config/navigation.ts",
    "!src/config/permissionKeys.ts",
    "!src/config/roleKeys.ts",
    // Mock data (test utilities)
    "!src/mock/**",
    // Validation schemas (type definitions)
    "!src/validations/schemas.ts",
  ],
  coverageDirectory: "coverage/jest",
  coverageReporters: ["text", "json", "html", "json-summary"],

  verbose: false,

  testMatch: [
    "**/__tests__/**/*.{ts,tsx}",
    "**/*.{test,spec}.{ts,tsx}",
  ],

  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/build/"],

  maxWorkers: "50%",
  cache: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};

export default config;
