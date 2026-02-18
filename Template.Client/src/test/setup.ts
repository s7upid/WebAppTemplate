import "@testing-library/jest-dom";
import { expect } from "@jest/globals";
import matchers from "@testing-library/jest-dom/matchers";
expect.extend(matchers);

const originalError = console.error;
const originalWarn = console.warn;
const originalLog = console.log;

beforeAll(() => {
  console.error = jest.fn();
  console.warn = jest.fn();
  console.log = jest.fn();
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
  console.log = originalLog;
});

declare const process: any;

if (!(globalThis as any).TextEncoder) {
  class MockTextEncoder {
    encode(_input: string) {
      return new Uint8Array();
    }
  }
  (globalThis as any).TextEncoder = MockTextEncoder as any;
}
if (!(globalThis as any).TextDecoder) {
  class MockTextDecoder {
    decode(_input?: Uint8Array) {
      return "";
    }
  }
  (globalThis as any).TextDecoder = MockTextDecoder as any;
}

process.env.NODE_ENV = "test";
process.env.VITE_USE_MOCK_DATA = "false";
process.env.VITE_STORAGE_SECRET_KEY = "test-secret-key";

(globalThis as any).fetch = jest.fn().mockImplementation((url: string) => {
  if (url.includes("/users")) {
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          success: true,
          data: {
            items: [
              {
                id: "1",
                firstName: "John",
                lastName: "Doe",
                email: "john@example.com",
                role: "admin",
              },
              {
                id: "2",
                firstName: "Jane",
                lastName: "Smith",
                email: "jane@example.com",
                role: "user",
              },
            ],
            totalCount: 2,
            pageNumber: 1,
            pageSize: 10,
            totalPages: 1,
          },
        }),
      text: () => Promise.resolve(""),
    } as Response);
  }

  if (url.includes("/roles")) {
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          success: true,
          data: {
            items: [
              { id: "1", name: "admin", description: "Administrator role" },
              { id: "2", name: "user", description: "User role" },
            ],
            totalCount: 2,
            pageNumber: 1,
            pageSize: 10,
            totalPages: 1,
          },
        }),
      text: () => Promise.resolve(""),
    } as Response);
  }

  return Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({ success: true, data: {} }),
    text: () => Promise.resolve(""),
  } as Response);
});

Object.defineProperty(globalThis, "import", {
  value: {
    meta: {
      env: {
        VITE_ENVIRONMENT: "test",
        VITE_USE_MOCK_DATA: "false",
        VITE_STORAGE_SECRET_KEY: "test-secret-key",
        VITE_GOOGLE_CLIENT_ID: "test-google-client-id",
        VITE_API_URL: "http://localhost:3000",
        VITE_APP_NAME: "test-app",
      },
    },
  },
  writable: true,
});

jest.mock("@/utils/env", () => ({
  env: {
    get DEV() {
      return (
        process.env.NODE_ENV === "development" ||
        process.env.NODE_ENV === "test"
      );
    },
    get PROD() {
      return process.env.NODE_ENV === "production";
    },
    VITE_ENVIRONMENT: "test",
    VITE_USE_MOCK_DATA: "false",
    VITE_STORAGE_SECRET_KEY: "test-secret-key",
    VITE_GOOGLE_CLIENT_ID: "test-google-client-id",
    VITE_API_URL: "http://localhost:3000",
    VITE_APP_NAME: "test-app",
  },
}));

(globalThis as any).env = {
  DEV:
    process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test",
  PROD: process.env.NODE_ENV === "production",
  VITE_ENVIRONMENT: "test",
  VITE_USE_MOCK_DATA: "false",
  VITE_STORAGE_SECRET_KEY: "test-secret-key",
  VITE_GOOGLE_CLIENT_ID: "test-google-client-id",
  VITE_API_URL: "http://localhost:3000/api",
  VITE_APP_NAME: "test-app",
};

jest.mock("@/utils/storage", () => ({
  SecureStorage: {
    getInstance: jest.fn(() => ({
      setItem: jest.fn(),
      getItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    })),
    setUser: jest.fn(),
    getUser: jest.fn(() => null),
    setToken: jest.fn(),
    getToken: jest.fn(() => null),
    removeUser: jest.fn(),
    removeToken: jest.fn(),
    clear: jest.fn(),
    isTokenExpiringSoon: jest.fn(() => false),
    setAuth: jest.fn(),
    getAuth: jest.fn(() => ({ token: null, user: null })),
    clearAuth: jest.fn(),
    isAuthenticated: jest.fn(() => false),
    getTokenExpiration: jest.fn(() => null),
  },
}));

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

(globalThis as any).IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

(globalThis as any).ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

Object.defineProperty(window, "scrollTo", {
  value: jest.fn(),
  writable: true,
});

Object.defineProperty(HTMLFormElement.prototype, "requestSubmit", {
  value: jest.fn().mockImplementation(function (this: HTMLFormElement) {
    const event = new Event("submit", { bubbles: true, cancelable: true });
    this.dispatchEvent(event);
  }),
  writable: true,
});

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, "sessionStorage", {
  value: sessionStorageMock,
});

const { useOnceWhen } = jest.requireActual("@/hooks/ui/useOnceWhen");

jest.mock("@/hooks", () => {
  return {
    useAuth: () => {
      const store = (window as any).__REDUX_STORE__;
      if (store) {
        const state = store.getState();
        return {
          user: state.auth?.user || null,
          token: state.auth?.token || null,
          isAuthenticated: state.auth?.isAuthenticated || false,
          isLoading: state.auth?.isLoading || false,
          login: jest.fn(),
          logout: jest.fn(),
          refreshToken: jest.fn(),
          forgotPassword: jest.fn(),
          setupPassword: jest.fn(),
          changePassword: jest.fn(),
          getCurrentUser: jest.fn(),
          refreshUser: jest.fn(),
        };
      }

      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
        refreshToken: jest.fn(),
        forgotPassword: jest.fn(),
        setupPassword: jest.fn(),
        changePassword: jest.fn(),
        getCurrentUser: jest.fn(),
        refreshUser: jest.fn(),
      };
    },
    useConfirmation: jest.fn(),
    useModalBlur: jest.fn(),
    useOnceWhen,
    usePendingUsers: jest.fn(),
    usePermissionCache: jest.fn(),
    usePermissionCheck: () => ({
      hasPermission: jest.fn(() => true),
      hasAnyPermission: jest.fn(() => true),
      hasAllPermissions: jest.fn(() => true),
      canAccessPage: jest.fn(() => true),
      getUserPermissions: jest.fn(() => []),
      getPermissionsByCategory: jest.fn(() => []),
      getPermissionDetails: jest.fn(),
      getPermissionCategories: jest.fn(() => []),
      analyzeUserPermissions: jest.fn(() => null),
    }),
    useRoleCheck: () => ({
      hasRole: jest.fn(() => true),
      hasAnyRole: jest.fn(() => true),
      isAdministrator: jest.fn(() => false),
      isOperator: jest.fn(() => false),
      isSupport: jest.fn(() => false),
      isRegulator: jest.fn(() => false),
    }),
    usePermissionContext: jest.fn(),
    useUserManagementPermissions: jest.fn(),
    useRoleManagementPermissions: jest.fn(),
    usePermissions: jest.fn(() => ({
      items: [],
      isLoading: false,
      paginationResult: { items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0 },
      paginationHandlers: {
        refreshWithCurrentFilters: jest.fn(),
        refreshWithParams: jest.fn().mockResolvedValue(undefined),
      },
    })),
    useRoles: jest.fn(() => ({
      items: [],
      isLoading: false,
    })),
    useTheme: () => ({
      theme: "light",
      toggleTheme: jest.fn(),
    }),
    useUsers: jest.fn(),
    useToast: () => ({
      showError: jest.fn(),
      showSuccess: jest.fn(),
      showInfo: jest.fn(),
      showWarning: jest.fn(),
    }),
    ToastProvider: ({ children }: any) => children,
  };
});

(globalThis as any).google = {
  accounts: {
    id: {
      initialize: jest.fn(),
      prompt: jest.fn(),
      renderButton: jest.fn(),
      disableAutoSelect: jest.fn(),
      storeCredential: jest.fn(),
      cancel: jest.fn(),
      onGoogleLibraryLoad: jest.fn(),
      revoke: jest.fn(),
    },
  },
} as any;

jest.mock("@/services/authService", () => ({
  authService: {
    login: jest.fn().mockResolvedValue({
      success: true,
      data: {
        user: { id: "1", email: "test@example.com", name: "Test User" },
        token: "mock-token",
      },
    }),
    logout: jest.fn().mockResolvedValue({ success: true }),
    refreshToken: jest.fn().mockResolvedValue({
      success: true,
      data: { token: "new-token" },
    }),
    forgotPassword: jest.fn().mockResolvedValue({ success: true }),
    setupPassword: jest.fn().mockResolvedValue({ success: true }),
    changePassword: jest.fn().mockResolvedValue({ success: true }),
    getCurrentUser: jest.fn().mockResolvedValue({
      success: true,
      data: { id: "1", email: "test@example.com", name: "Test User" },
    }),
  },
}));
