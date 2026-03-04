// Use base test utilities to reduce duplication
import { getRouteUtilsMocks } from "@/test/base-test-utils";

import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { TEST_IDS } from "@/config/constants";

let mockRolesHook: any = {
  // For useRoleQuery
  role: {
    id: "1",
    name: "Role",
    description: "",
    permissions: [],
    isSystem: false,
    userCount: 0,
    users: [],
  },
  // For useRolesQuery
  roles: [
    {
      id: "1",
      name: "Role",
      description: "",
      permissions: [],
      isSystem: false,
      userCount: 0,
    },
  ],
  remove: jest.fn().mockResolvedValue({ success: true }),
  isLoading: false,
  error: null,
  paginationResult: { items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0 },
  paginationHandlers: {
    changePage: jest.fn(),
    changePageSize: jest.fn(),
    clearAll: jest.fn(),
    refreshWithCurrentFilters: jest.fn(),
    refreshWithParams: jest.fn(),
  },
  refetch: jest.fn(),
};
let mockUsersHook: any = { 
  users: [], 
  isLoading: false,
  paginationResult: { items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0 },
};
let mockConfirmationHook: any = {
  dialogProps: {},
  showConfirmation: jest.fn().mockResolvedValue(false),
  hideConfirmation: jest.fn(),
};
let mockToastHook: any = { showSuccess: jest.fn(), showError: jest.fn() };

jest.mock("@/hooks", () => {
  const { getHookMocks } = require("@/test/base-test-utils");
  const actual = jest.requireActual("@/hooks");
  const { useOnceWhen } = jest.requireActual("@/hooks/ui/useOnceWhen");
  return {
    ...actual,
    ...getHookMocks(),
    useRolesQuery: () => mockRolesHook,
    useRoleQuery: () => mockRolesHook,
    useUsersQuery: () => mockUsersHook,
    useConfirmation: () => mockConfirmationHook,
    useToast: () => mockToastHook,
    useOnceWhen,
  };
});

jest.mock("@/components", () => ({
  ConfirmationDialog: () => <div />,
  LoadingSpinner: () => <div>Loading...</div>,
  EmptyState: ({ title, primaryAction }: { title?: string; primaryAction?: { label: string; onClick: () => void } }) => (
    <div>
      <span>{title}</span>
      {primaryAction && <button type="button" onClick={primaryAction.onClick}>{primaryAction.label}</button>}
    </div>
  ),
}));

jest.mock("@/pages/roles/components/RoleActions", () => ({
  __esModule: true,
  default: () => <div data-testid={TEST_IDS.ROLE_ACTIONS} />,
}));
jest.mock("@/pages/roles/components/RolePermissionsSection", () => ({
  __esModule: true,
  default: () => <div data-testid={TEST_IDS.ROLE_PERMISSIONS} />,
}));
jest.mock("@/pages/roles/components/RoleStatsSection", () => ({
  __esModule: true,
  default: () => <div data-testid={TEST_IDS.ROLE_STATS} />,
}));
jest.mock("@/pages/roles/components/RoleUsersSection", () => ({
  __esModule: true,
  default: () => <div data-testid={TEST_IDS.ROLE_USERS} />,
}));

// Use base route utils and config mocks with extensions
jest.mock("@/config/navigation", () => ({
  getNavigationUrls: jest.fn(() => ({ main: "/" })),
}));
jest.mock("@/utils/routeUtils", () => ({
  ...getRouteUtilsMocks(),
  useGenericNavigationFunctions: () => ({
    goToRoles: jest.fn(),
    goToUserDetail: jest.fn(),
  }),
}));
jest.mock("@/config", () => ({
  __esModule: true,
  ERROR_MESSAGES: { ROLE_NOT_FOUND: "Role not found", DELETE_FAILED: "" },
  BUTTON_LABELS: { BACK_TO_ROLES: "Back" },
  ROLES_MODULE: { messages: { created: "Role created successfully", updated: "Role updated successfully" } },
  createRoleDetailsHeader: () => ({ title: "Role" }),
  createRoleManagementHeader: () => ({ title: "Role Mgmt" }),
  TEST_IDS: {
    ROLE_ACTIONS: "role-actions",
    ROLE_PERMISSIONS: "role-permissions",
    ROLE_STATS: "role-stats",
    ROLE_USERS: "role-users",
  },
}));

describe("RoleDetailsPage", () => {
  beforeEach(() => {
    mockRolesHook = {
      // For useRoleQuery
      role: {
        id: "1",
        name: "Role",
        description: "",
        permissions: [],
        isSystem: false,
        userCount: 0,
        users: [],
      },
      // For useRolesQuery
      roles: [
        {
          id: "1",
          name: "Role",
          description: "",
          permissions: [],
          isSystem: false,
          userCount: 0,
        },
      ],
      remove: jest.fn().mockResolvedValue({ success: true }),
      isLoading: false,
      error: null,
      paginationResult: { items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0 },
      paginationHandlers: {
        changePage: jest.fn(),
        changePageSize: jest.fn(),
        clearAll: jest.fn(),
        refreshWithCurrentFilters: jest.fn(),
        refreshWithParams: jest.fn(),
      },
      refetch: jest.fn(),
    };
    mockUsersHook = { 
      users: [], 
      isLoading: false,
      paginationResult: { items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0 },
    };
    mockConfirmationHook = {
      dialogProps: {},
      showConfirmation: jest.fn().mockResolvedValue(false),
      hideConfirmation: jest.fn(),
    };
    mockToastHook = { showSuccess: jest.fn(), showError: jest.fn() };
  });

  it("renders sections when role is present", async () => {
    const { default: RoleDetailsPage } = await import(
      "@/pages/roles/read/RoleDetailsPage"
    );
    render(
      <MemoryRouter initialEntries={["/1"]}>
        <Routes>
          <Route
            path=":id"
            element={
              <RoleDetailsPage
                permissions={{} as any}
                setHeaderProps={() => {}}
                handleCreateRole={() => {}}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByTestId(TEST_IDS.ROLE_ACTIONS)).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.ROLE_PERMISSIONS)).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.ROLE_STATS)).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.ROLE_USERS)).toBeInTheDocument();
  });

  it("shows loading state when role not yet loaded", async () => {
    mockRolesHook.roles = [];
    mockRolesHook.role = null;
    mockRolesHook.isLoading = true;

    const { default: RoleDetailsPageLocal } = await import(
      "@/pages/roles/read/RoleDetailsPage"
    );
    render(
      <MemoryRouter initialEntries={["/42"]}>
        <Routes>
          <Route
            path=":id"
            element={
              <RoleDetailsPageLocal
                permissions={{} as any}
                setHeaderProps={() => {}}
                handleCreateRole={() => {}}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it("renders not found UI when load completed with error", async () => {
    mockRolesHook.roles = [];
    mockRolesHook.role = null;
    mockRolesHook.isLoading = false;
    mockRolesHook.error = "Role not found";

    const { default: RoleDetailsPageLocal } = await import(
      "@/pages/roles/read/RoleDetailsPage"
    );
    render(
      <MemoryRouter initialEntries={["/42"]}>
        <Routes>
          <Route
            path=":id"
            element={
              <RoleDetailsPageLocal
                permissions={{} as any}
                setHeaderProps={() => {}}
                handleCreateRole={() => {}}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/Role not found/i)).toBeInTheDocument();
  });
});
