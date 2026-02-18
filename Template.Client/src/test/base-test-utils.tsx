import { jest } from "@jest/globals";
import React from "react";
import type { AuditLog, PagedResult } from "@/models";
import type { ApiResponse } from "@/models/shared/api";
import { PERMISSION_KEYS } from "@/config/generated/permissionKeys.generated";

export interface SetupBaseTestOptions {
  useMockData?: boolean;
  mockFetch?: boolean;
  mockPermissionCache?: boolean;
  mockRouteUtils?: boolean;
}

export interface HookMockOptions {
  useAuth?:
    | boolean
    | {
        user?: any;
        isAuthenticated?: boolean;
        token?: string;
        isLoading?: boolean;
        error?: string | null;
        login?: jest.Mock;
        logout?: jest.Mock;
      }
    | (() => any);
  useRoles?:
    | boolean
    | {
        items?: any[];
        isLoading?: boolean;
        error?: string | null;
        fetchRoles?: jest.Mock;
        createRole?: jest.Mock;
        updateRole?: jest.Mock;
        deleteRole?: jest.Mock;
      }
    | (() => any);
  useUsers?:
    | boolean
    | {
        items?: any[];
        isLoading?: boolean;
        error?: string | null;
        fetchUsers?: jest.Mock;
        createUser?: jest.Mock;
        updateUser?: jest.Mock;
        deleteUser?: jest.Mock;
      }
    | (() => any);
  usePermissions?:
    | boolean
    | {
        items?: any[];
        isLoading?: boolean;
        error?: string | null;
        fetchPermissions?: jest.Mock;
      }
    | (() => any);
  useDashboard?:
    | boolean
    | {
        items?: any[];
        data?: any;
        isLoading?: boolean;
        error?: string | null;
        fetchDashboard?: jest.Mock;
        loadList?: jest.Mock;
      }
    | (() => any);
}

export interface ServiceMockOptions {
  userService?: boolean;
  roleService?: boolean;
  permissionService?: boolean;
  dashboardService?: boolean;
}

export interface SliceMockOptions {
  errorMessages?: Record<string, string>;
  navigationUrls?: Record<string, string>;
}

export interface SetupBaseTestReturn {
  mocks: ReturnType<typeof createCommonMocks>;
  utilsMocks: ReturnType<typeof createCommonMocks>;
  permissionCacheMocks: ReturnType<typeof getPermissionCacheMocks> | null;
  routeUtilsMocks: ReturnType<typeof getRouteUtilsMocks> | null;
  mockUtilsMocks: ReturnType<typeof getMockUtilsMocks>;
  mockDataMocks: ReturnType<typeof getMockDataMocks>;
  fetchHelpers: ReturnType<typeof setupFetchMock> | null;
  cleanup: () => void;
}

export const createCommonMocks = () => {
  return {
    env: {
      VITE_USE_MOCK_DATA: "true",
      VITE_API_URL: "http://localhost:3000",
      VITE_STORAGE_SECRET_KEY: "test-secret-key",
      VITE_APP_NAME: "test-app",
      VITE_ENVIRONMENT: "test",
      DEV: true,
      PROD: false,
    },

    SecureStorage: {
      getToken: jest.fn(() => "mock-jwt-token-1"),
      setToken: jest.fn(),
      setUser: jest.fn(),
      getUser: jest.fn(() => null),
      clear: jest.fn(),
      removeToken: jest.fn(),
      removeUser: jest.fn(),
      isTokenExpiringSoon: jest.fn(() => false),
      isAuthenticated: jest.fn(() => false),
      getTokenExpiration: jest.fn(() => null),
    },

    logger: {
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
      log: jest.fn(),
    },

    deriveEffectivePermissionKeys: jest.fn((keys, perms) => {
      const providedKeys = Array.isArray(keys) ? keys : [];
      const permissionObjectKeys = Array.isArray(perms)
        ? perms.map((p: any) => (typeof p === "string" ? p : p.key))
        : [];
      return Array.from(new Set([...providedKeys, ...permissionObjectKeys]));
    }),

    cn: jest.fn((...args: any[]) => args.filter(Boolean).join(" ")),

    parseRouteInfo: jest.fn(),
    getNavigationUrls: jest.fn(),
    getActiveTab: jest.fn(),
    isNavigationActive: jest.fn(),
    useEntityNavigation: jest.fn(),
    useRouteInfo: jest.fn(),
    useGenericNavigationFunctions: jest.fn(() => ({
      goToLogin: jest.fn(),
      goToRoles: jest.fn(),
      goToUsers: jest.fn(),
    })),

    handleEntityDelete: jest.fn(),
    handleSubmitForm: jest.fn(),
    handleEntitySave: jest.fn(),

    Portal: ({ children }: any) => children,
  };
};

export const getCommonMocks = (options: { useMockData?: boolean } = {}) => {
  const mocks = createCommonMocks();
  if (options.useMockData !== undefined) {
    mocks.env.VITE_USE_MOCK_DATA = options.useMockData ? "true" : "false";
  }
  return mocks;
};

export const getPermissionCacheMocks = () => {
  return null;
};

export const getRouteUtilsMocks = () => {
  return {
    parseRouteInfo: jest.fn(),
    getNavigationUrls: jest.fn(),
    getActiveTab: jest.fn(),
    isNavigationActive: jest.fn(),
    useEntityNavigation: jest.fn(),
    useRouteInfo: jest.fn(),
    useGenericNavigationFunctions: jest.fn(() => ({
      goToLogin: jest.fn(),
      goToRoles: jest.fn(),
      goToUsers: jest.fn(),
    })),
  };
};

export const getMockUtilsMocks = () => {
  const actual = jest.requireActual("@/mock/utils") as Record<string, any>;
  return {
    ...actual,
    delay: jest.fn(() => Promise.resolve()),
  };
};

export const getSliceMocks = (config: SliceMockOptions = {}) => {
  const { errorMessages = {}, navigationUrls = { main: "/" } } = config;
  return {
    store: {
      store: {
        getState: jest.fn(() => ({})),
        dispatch: jest.fn(),
      },
    },
    config: {
      ERROR_MESSAGES: errorMessages,
      TEST_IDS: {},
    },
    configConstants: {
      ERROR_MESSAGES: errorMessages,
      TEST_IDS: {},
    },
    configNavigation: {
      getNavigationUrls: jest.fn(() => navigationUrls),
    },
  };
};

export const getMockDataMocks = () => {
  const actual = jest.requireActual("@/mock");
  return actual;
};

export const setupFetchMock = () => {
  const mockFetch = jest.fn<typeof fetch>();
  global.fetch = mockFetch as any;

  const mockSuccessfulResponse = (data: any, status: number = 200) => {
    const response = {
      ok: status >= 200 && status < 300,
      status,
      text: async () => JSON.stringify(data),
    };
    mockFetch.mockResolvedValueOnce(response as Response);
  };

  const mockFailedResponse = (message: string, status: number = 400) => {
    const response = {
      ok: false,
      status,
      text: async () => JSON.stringify({ message }),
    };
    mockFetch.mockResolvedValueOnce(response as Response);
  };

  return {
    mockFetch: mockFetch as jest.MockedFunction<typeof fetch>,
    mockSuccessfulResponse,
    mockFailedResponse,
  };
};

export const cleanupMocks = () => {
  jest.clearAllMocks();
};

export const resetSecureStorageMock = (
  mocks: ReturnType<typeof createCommonMocks>
) => {
  (mocks.SecureStorage.getToken as jest.Mock).mockReturnValue(
    "mock-jwt-token-1"
  );
  (mocks.SecureStorage.getUser as jest.Mock).mockReturnValue(null);
  (mocks.SecureStorage.isTokenExpiringSoon as jest.Mock).mockReturnValue(false);
  (mocks.SecureStorage.isAuthenticated as jest.Mock).mockReturnValue(false);
};

export const setupBaseTest = (
  options: SetupBaseTestOptions = {}
): SetupBaseTestReturn => {
  const {
    useMockData = true,
    mockFetch: shouldMockFetch = false,
    mockPermissionCache = true,
    mockRouteUtils = true,
  } = options;

  const mocks = createCommonMocks();

  if (useMockData !== undefined) {
    mocks.env.VITE_USE_MOCK_DATA = useMockData ? "true" : "false";
  }

  const utilsMocks = mocks;
  const permissionCacheMocks = mockPermissionCache
    ? getPermissionCacheMocks()
    : null;
  const routeUtilsMocks = mockRouteUtils ? getRouteUtilsMocks() : null;
  const mockUtilsMocks = getMockUtilsMocks();
  const mockDataMocks = getMockDataMocks();

  let fetchHelpers: ReturnType<typeof setupFetchMock> | null = null;
  if (shouldMockFetch) {
    fetchHelpers = setupFetchMock();
  }

  return {
    mocks: utilsMocks,
    utilsMocks,
    permissionCacheMocks,
    routeUtilsMocks,
    mockUtilsMocks,
    mockDataMocks,
    fetchHelpers,
    cleanup: () => {
      cleanupMocks();
      if (fetchHelpers) {
        fetchHelpers.mockFetch.mockClear();
      }
      resetSecureStorageMock(mocks);
    },
  };
};

export const createMockStore = (initialState: any = {}) => {
  const { configureStore } = require("@reduxjs/toolkit");
  return configureStore({
    reducer: {},
    preloadedState: initialState,
  });
};

export const createMockApiResponse = <T,>(
  data: T,
  success: boolean = true,
  message: string = "",
  status: number = 200
) => {
  return {
    success,
    data: success ? data : (null as T),
    message,
    status,
    fieldErrors: {},
    raw: data,
  };
};

export const createMockErrorResponse = (
  message: string,
  status: number = 400,
  fieldErrors: Record<string, string> = {}
) => {
  return {
    success: false,
    data: null,
    message,
    status,
    fieldErrors,
    raw: { message, status },
  };
};

export const getComponentMocks = () => {
  // Import React inside the function to ensure it's available when called from jest.mock factories
  const ReactLib = require("react");
  const { TEST_IDS } = require("@/config/constants");
  return {
    ModalPage: ({ isOpen, onClose, title, children, size }: any) =>
      isOpen
        ? ReactLib.createElement(
            "div",
            {
              "data-testid": TEST_IDS?.MODAL || "modal",
              ...(size ? { "data-size": size } : {}),
            },
            ReactLib.createElement(
              "div",
              { "data-testid": TEST_IDS?.EXPORT_MODAL_TITLE || "modal-title" },
              title
            ),
            ReactLib.createElement(
              "button",
              {
                "data-testid": TEST_IDS?.MODAL_CLOSE || "modal-close",
                onClick: onClose,
              },
              "Close"
            ),
            children
          )
        : null,
    Button: ({
      children,
      onClick,
      disabled,
      loading,
      variant,
      type,
      form,
    }: any) =>
      ReactLib.createElement(
        "button",
        {
          "data-testid": `button-${variant || "default"}`,
          onClick,
          disabled: disabled || loading,
          "data-loading": loading,
          type,
          form,
        },
        children
      ),
    Input: ({
      label,
      error,
      type,
      placeholder,
      value,
      onChange,
      icon,
      className,
      required,
      ...props
    }: any) =>
      ReactLib.createElement(
        "label",
        null,
        label,
        ReactLib.createElement("input", {
          type,
          placeholder,
          value,
          onChange,
          "data-testid": placeholder
            ? `input-${placeholder.toLowerCase().replace(/\s+/g, "-")}`
            : "input",
          required,
          ...props,
        }),
        icon && ReactLib.createElement("span", { "data-testid": "icon-size" }, "icon"),
        error &&
          ReactLib.createElement(
            "p",
            { "data-testid": TEST_IDS?.ERROR_MESSAGE || "error-message" },
            error
          )
      ),
    Dropdown: ({ options, value, onValueChange, label, ...rest }: any) =>
      ReactLib.createElement(
        "div",
        null,
        label && ReactLib.createElement("label", null, label),
        ReactLib.createElement(
          "select",
          {
            role: "combobox",
            value,
            onChange: (e: any) => onValueChange?.(e.target.value),
            ...rest,
          },
          options?.map((opt: any) =>
            ReactLib.createElement(
              "option",
              { key: opt.value, value: opt.value },
              opt.label
            )
          )
        )
      ),
    LoadingSpinner: ({ text }: any) =>
      ReactLib.createElement("div", { "data-testid": "spinner" }, text),
    ModalPortal: ({ children }: { children: any }) =>
      ReactLib.createElement("div", { "data-testid": "modal-portal" }, children),
  };
};

export const getServiceMocks = (options: ServiceMockOptions = {}) => {
  const {
    userService = false,
    roleService = false,
    permissionService = false,
    dashboardService = false,
  } = options;

  const mocks: any = {};

  if (userService) {
    mocks.userService = {
      getUsers: jest.fn(),
      getUserById: jest.fn(),
      createUser: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
    };
  }

  if (roleService) {
    mocks.roleService = {
      getRoles: jest.fn(),
      getRoleById: jest.fn(),
      createRole: jest.fn(),
      updateRole: jest.fn(),
      deleteRole: jest.fn(),
    };
  }

  if (permissionService) {
    mocks.permissionService = {
      getPermissions: jest.fn(),
      getPermissionById: jest.fn(),
    };
  }

  if (dashboardService) {
    mocks.dashboardService = {
      getRecentAuditLogs: jest
        .fn<() => Promise<ApiResponse<PagedResult<AuditLog>>>>()
        .mockResolvedValue({
          success: true,
          message: "",
          data: {
            items: [],
            totalCount: 0,
            pageNumber: 1,
            pageSize: 10,
            totalPages: 0,
          },
        }),
    };
    mocks.dashboardApiService = {
      getAdministratorStatsSafe: jest
        .fn<() => Promise<Record<string, unknown>>>()
        .mockResolvedValue({}),
    };
  }

  return mocks;
};

export const getHookMocks = (options: HookMockOptions = {}) => {
  const {
    useAuth = false,
    useRoles = false,
    useUsers = false,
    usePermissions = false,
    useDashboard = false,
  } = options;

  const mocks: Record<string, unknown> = {};
  const mockRolesData = require("@/mock/data").mockRoles || [];
  const mockUsersData = require("@/mock/data").mockUsers || [];
  const mockPermissionsData = require("@/mock/data").mockPermissions || [];

  // Legacy hooks (for backwards compatibility)
  if (useAuth) {
    const authConfig = typeof useAuth === "object" ? useAuth : {};
    mocks.useAuth =
      typeof useAuth === "function"
        ? useAuth
        : () => ({
            user: authConfig.user || { firstName: "Test", id: "1" },
            isAuthenticated: authConfig.isAuthenticated ?? true,
            token: authConfig.token || "test-token",
          });
  }

  if (useRoles) {
    const rolesConfig = typeof useRoles === "object" ? useRoles : {};
    mocks.useRoles =
      typeof useRoles === "function"
        ? useRoles
        : () => ({
            items: rolesConfig.items || mockRolesData,
            isLoading: rolesConfig.isLoading ?? false,
          });
  }

  if (useUsers) {
    const usersConfig = typeof useUsers === "object" ? useUsers : {};
    mocks.useUsers =
      typeof useUsers === "function"
        ? useUsers
        : () => ({
            items: usersConfig.items || mockUsersData,
            isLoading: usersConfig.isLoading ?? false,
          });
  }

  if (usePermissions) {
    const permissionsConfig =
      typeof usePermissions === "object" ? usePermissions : {};
    mocks.usePermissions =
      typeof usePermissions === "function"
        ? usePermissions
        : () => ({
            items: permissionsConfig.items || mockPermissionsData,
            isLoading: permissionsConfig.isLoading ?? false,
          });
  }

  if (useDashboard) {
    const dashboardConfig =
      typeof useDashboard === "object" ? useDashboard : {};
    mocks.useDashboard =
      typeof useDashboard === "function"
        ? useDashboard
        : () => ({
            items: dashboardConfig.items || [],
            isLoading: dashboardConfig.isLoading ?? false,
            loadList: jest.fn(),
          });
  }

  // TanStack Query hooks - always provide defaults
  mocks.useUsersQuery = () => ({
    users: mockUsersData,
    isLoading: false,
    error: null,
    paginationResult: {
      items: mockUsersData,
      totalCount: mockUsersData.length,
      pageNumber: 1,
      pageSize: 10,
      totalPages: 1,
    },
    paginationHandlers: {
      changePage: jest.fn(),
      changePageSize: jest.fn(),
      clearAll: jest.fn(),
      refreshWithCurrentFilters: jest.fn(),
      refreshWithParams: jest.fn(),
    },
    refetch: jest.fn(),
    add: jest.fn(() => Promise.resolve({ success: true })),
    edit: jest.fn(() => Promise.resolve({ success: true })),
    remove: jest.fn(() => Promise.resolve({ success: true })),
    approve: jest.fn(() => Promise.resolve({ success: true })),
    reject: jest.fn(() => Promise.resolve({ success: true })),
  });

  mocks.useRolesQuery = () => ({
    roles: mockRolesData,
    isLoading: false,
    error: null,
    paginationResult: {
      items: mockRolesData,
      totalCount: mockRolesData.length,
      pageNumber: 1,
      pageSize: 10,
      totalPages: 1,
    },
    paginationHandlers: {
      changePage: jest.fn(),
      changePageSize: jest.fn(),
      clearAll: jest.fn(),
      refreshWithCurrentFilters: jest.fn(),
      refreshWithParams: jest.fn(),
    },
    refetch: jest.fn(),
    add: jest.fn(() => Promise.resolve({ success: true })),
    edit: jest.fn(() => Promise.resolve({ success: true })),
    remove: jest.fn(() => Promise.resolve({ success: true })),
  });

  mocks.usePermissionsQuery = () => ({
    permissions: mockPermissionsData,
    isLoading: false,
    error: null,
    paginationResult: {
      items: mockPermissionsData,
      totalCount: mockPermissionsData.length,
      pageNumber: 1,
      pageSize: 100,
      totalPages: 1,
    },
    paginationHandlers: {
      changePage: jest.fn(),
      changePageSize: jest.fn(),
      clearAll: jest.fn(),
      refreshWithCurrentFilters: jest.fn(),
      refreshWithParams: jest.fn(),
    },
    refetch: jest.fn(),
  });

  mocks.useAllPermissions = () => ({
    permissions: mockPermissionsData,
    isLoading: false,
    error: null,
  });

  mocks.useDashboardQuery = () => ({
    recentLogs: [],
    isLoading: false,
    error: null,
    refetch: jest.fn(),
  });

  mocks.useAuditQuery = () => ({
    auditLogs: [],
    isLoading: false,
    error: null,
    paginationResult: {
      items: [],
      totalCount: 0,
      pageNumber: 1,
      pageSize: 10,
      totalPages: 0,
    },
    paginationHandlers: {
      changePage: jest.fn(),
      changePageSize: jest.fn(),
      clearAll: jest.fn(),
      refreshWithCurrentFilters: jest.fn(),
      refreshWithParams: jest.fn(),
    },
    refetch: jest.fn(),
  });

  return mocks;
};

export const getErrorHandlingMocks = () => {
  type ErrorResponse = { success?: boolean; message?: string; status?: number };
  return {
    getErrorMessage: jest.fn((response: ErrorResponse) => {
      if (!response || response.success) return "Network error";
      return response.message || "Error";
    }),
    getErrorToastType: jest.fn((response: ErrorResponse) =>
      response?.status === 429 ? "warning" : "error"
    ),
    getErrorTitle: jest.fn((response: ErrorResponse) => {
      if (response?.status === 429) return "Rate Limit Exceeded";
      if (response?.status === 401) {
        const message = response?.message?.toLowerCase() || "";
        if (message.includes("revoked")) return "Session Expired";
        return "Unauthorized";
      }
      return "Error";
    }),
    isTokenRevocationError: jest.fn((response: ErrorResponse) => {
      if (response?.status !== 401) return false;
      const message = response?.message?.toLowerCase() || "";
      return (
        message.includes("revoked") ||
        message.includes("token has been revoked") ||
        message.includes("user token has been revoked")
      );
    }),
  };
};

export const setupSliceTest = (
  options: {
    errorMessages?: Record<string, string>;
    navigationUrls?: Record<string, string>;
    mockServices?: {
      userService?: boolean;
      roleService?: boolean;
      permissionService?: boolean;
    };
  } = {}
) => {
  const {
    errorMessages = {},
    navigationUrls = {},
    mockServices = {},
  } = options;

  const sliceMocks = getSliceMocks({ errorMessages, navigationUrls });
  const baseSetup = setupBaseTest({
    useMockData: false,
    mockFetch: false,
    mockPermissionCache: true,
    mockRouteUtils: true,
  });

  const serviceMocks = getServiceMocks(mockServices);

  return {
    ...baseSetup,
    sliceMocks,
    serviceMocks,
    setupMocks: () => {
      jest.mock("@/store", () => sliceMocks.store);
      jest.mock("@/config", () => sliceMocks.config);
      jest.mock("@/config/constants", () => sliceMocks.configConstants);
      jest.mock("@/config/navigation", () => sliceMocks.configNavigation);
      if (Object.keys(serviceMocks).length > 0) {
        jest.mock("@/services", () => serviceMocks);
      }
    },
  };
};

export const setupComponentTest = (
  options: {
    useMockData?: boolean;
    mockComponents?: boolean;
    mockHooks?: {
      useAuth?: boolean | any;
      useRoles?: boolean | any;
      useUsers?: boolean | any;
    };
    mockServices?: {
      userService?: boolean;
      roleService?: boolean;
    };
  } = {}
) => {
  const {
    useMockData = false,
    mockComponents = true,
    mockHooks = {},
    mockServices = {},
  } = options;

  const baseSetup = setupBaseTest({
    useMockData,
    mockFetch: false,
    mockPermissionCache: true,
    mockRouteUtils: true,
  });

  const componentMocks = mockComponents ? getComponentMocks() : null;
  const hookMocks =
    Object.keys(mockHooks).length > 0 ? getHookMocks(mockHooks) : null;
  const serviceMocks =
    Object.keys(mockServices).length > 0 ? getServiceMocks(mockServices) : null;

  return {
    ...baseSetup,
    componentMocks,
    hookMocks,
    serviceMocks,
  };
};

export const setupHookTest = (
  options: {
    useMockData?: boolean;
    mockHooks?: {
      useAuth?: boolean | any;
      useRoles?: boolean | any;
      useUsers?: boolean | any;
      usePermissions?: boolean | any;
    };
    mockServices?: {
      userService?: boolean;
      roleService?: boolean;
      permissionService?: boolean;
    };
  } = {}
) => {
  const { useMockData = false, mockHooks = {}, mockServices = {} } = options;

  const baseSetup = setupBaseTest({
    useMockData,
    mockFetch: false,
    mockPermissionCache: true,
    mockRouteUtils: true,
  });

  const hookMocks =
    Object.keys(mockHooks).length > 0 ? getHookMocks(mockHooks) : null;
  const serviceMocks =
    Object.keys(mockServices).length > 0 ? getServiceMocks(mockServices) : null;

  return {
    ...baseSetup,
    hookMocks,
    serviceMocks,
  };
};

export const expectSortedArray = <T,>(
  items: T[],
  getField: (item: T) => string | number | Date | null | undefined,
  ascending: boolean = true
) => {
  for (let i = 0; i < items.length - 1; i++) {
    const current = getField(items[i]);
    const next = getField(items[i + 1]);

    if (
      current === null ||
      current === undefined ||
      next === null ||
      next === undefined
    ) {
      continue;
    }

    if (ascending) {
      expect(current <= next).toBe(true);
    } else {
      expect(current >= next).toBe(true);
    }
  }
};

export const expectPaginatedResponse = (
  result: any,
  expectedPageNumber?: number,
  expectedPageSize?: number
) => {
  expect(result).toBeDefined();
  expect(result.data).toBeDefined();
  expect(result.data).not.toBeNull();
  if (result.data) {
    expect(result.data.items).toBeDefined();
    if (expectedPageNumber !== undefined) {
      expect(result.data.pageNumber).toBe(expectedPageNumber);
    }
    if (expectedPageSize !== undefined) {
      expect(result.data.pageSize).toBe(expectedPageSize);
    }
  }
};

export const expectSuccessResponse = (result: any) => {
  expect(result).toBeDefined();
  expect(result.success).toBe(true);
  expect(result.data).toBeDefined();
};

export const expectErrorResponse = (result: any, expectedStatus?: number) => {
  expect(result).toBeDefined();
  expect(result.success).toBe(false);
  if (expectedStatus !== undefined) {
    expect(result.status).toBe(expectedStatus);
  }
  expect(result.message).toBeDefined();
};

export const createMockFetchResponse = (
  data: any,
  status: number = 200,
  ok: boolean = true
): Partial<Response> => ({
  ok,
  status,
  statusText: ok ? "OK" : "Error",
  text: async () => JSON.stringify(data),
  json: async () => data,
});

export const createMockAuthResponse = (
  overrides: Partial<{
    user: any;
    token: string;
    expiresAt: Date;
  }> = {}
) => ({
  success: true,
  data: {
    user: overrides.user || {
      id: "1",
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
      permissionKeys: [PERMISSION_KEYS.USERS.VIEW, PERMISSION_KEYS.USERS.EDIT],
      permissions: [],
    },
    token: overrides.token || "mock-jwt-token",
    expiresAt: overrides.expiresAt || new Date(Date.now() + 3600000),
  },
});

export const createMockUserManagementPermissions = (
  overrides: Partial<{
    canViewUsers: boolean;
    canCreateUsers: boolean;
    canEditUsers: boolean;
    canDeleteUsers: boolean;
    canAssignRoles: boolean;
    canAssignPermissions: boolean;
    canApproveUsers: boolean;
    canRejectUsers: boolean;
    canViewUserDetails: boolean;
    canEditUserRoles: boolean;
    canEditUserPermissions: boolean;
  }> = {}
) => ({
  canViewUsers: true,
  canCreateUsers: true,
  canEditUsers: true,
  canDeleteUsers: true,
  canAssignRoles: true,
  canAssignPermissions: true,
  canApproveUsers: true,
  canRejectUsers: true,
  canViewUserDetails: true,
  canEditUserRoles: true,
  canEditUserPermissions: true,
  ...overrides,
});

export const withTestWrapper = (
  children: React.ReactNode,
  options: {
    store?: any;
    router?: boolean;
    toastProvider?: boolean;
  } = {}
) => {
  const { store, router = true, toastProvider = true } = options;

  let wrapped = children;

  if (toastProvider) {
    const { ToastProvider } = require("@/hooks/ui/useToast");
    wrapped = React.createElement(ToastProvider, null, wrapped);
  }

  if (router) {
    const { BrowserRouter } = require("react-router-dom");
    wrapped = React.createElement(BrowserRouter, null, wrapped);
  }

  if (store) {
    const { Provider } = require("react-redux");
    wrapped = React.createElement(Provider, { store }, wrapped);
  }

  return wrapped;
};
