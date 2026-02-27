import { setupBaseTest } from "@/test/base-test-utils";

const { cleanup } = setupBaseTest({
  useMockData: false,
  mockFetch: false,
  mockPermissionCache: false,
  mockRouteUtils: false,
});

import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { TEST_IDS } from "@/config/constants";

let mockRolesHook: any = {
  roles: [],
  add: jest.fn().mockResolvedValue({ success: true }),
  edit: jest.fn().mockResolvedValue({ success: true }),
  remove: jest.fn().mockResolvedValue({ success: true }),
  paginationResult: { items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0 },
  paginationHandlers: { 
    refreshWithCurrentFilters: jest.fn(),
    changePage: jest.fn(),
    changePageSize: jest.fn(),
    clearAll: jest.fn(),
    refreshWithParams: jest.fn(),
  },
  isLoading: false,
  error: null,
  refetch: jest.fn(),
};

jest.mock("@/hooks", () => {
  const actual = jest.requireActual("@/hooks");
  const { getHookMocks } = require("@/test/base-test-utils");
  const { useOnceWhen } = jest.requireActual("@/hooks/ui/useOnceWhen");
  return {
    ...actual,
    ...getHookMocks(),
    useRoleManagementPermissions: () => ({}),
    useToast: () => ({ showSuccess: jest.fn() }),
    useRolesQuery: () => mockRolesHook,
    useConfirmation: () => ({ dialogProps: {} }),
    useOnceWhen,
  };
});

jest.mock("@/components/BasePage/BasePage", () => ({
  __esModule: true,
  default: ({ children }: any) => <div>{children}</div>,
}));
jest.mock("@/components", () => {
  const React = require("react");
  const stubs = require("@/test/__mocks__/component-stubs").default;
  return {
    ...stubs,
    ModalPortal: ({ children }: any) => <div>{children}</div>,
    PermissionGuard: ({ children }: any) => (
      <div data-testid={TEST_IDS.MOCK_PERMISSION_GUARD}>{children}</div>
    ),
  };
});

jest.mock("@/components/Guards/PermissionGuard", () => ({
  __esModule: true,
  default: ({ children }: any) => (
    <div data-testid={TEST_IDS.MOCK_PERMISSION_GUARD}>{children}</div>
  ),
}));
jest.mock("@/config/navigation", () => ({
  getNavigationUrls: jest.fn(() => ({ main: "/" })),
}));

jest.mock("@/pages/roles/read/RoleGridPage", () => ({
  __esModule: true,
  default: ({ isLoading }: any) => (
    <div data-testid={TEST_IDS.ROLE_GRID_PAGE}>
      {isLoading ? "loading" : "ready"}
    </div>
  ),
}));

jest.mock("@/pages/roles/read/RoleDetailsPage", () => ({
  __esModule: true,
  default: () => <div data-testid={TEST_IDS.ROLE_DETAILS} />,
}));

jest.mock("@/pages/roles/modals/RoleFormModal", () => ({
  __esModule: true,
  default: () => <div data-testid={TEST_IDS.ROLE_FORM_MODAL} />,
}));

describe("RoleContainer", () => {
  beforeEach(() => {
    cleanup();
    mockRolesHook = {
      roles: [],
      add: jest.fn().mockResolvedValue({ success: true }),
      edit: jest.fn().mockResolvedValue({ success: true }),
      remove: jest.fn().mockResolvedValue({ success: true }),
      paginationResult: { items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0 },
      paginationHandlers: { 
        refreshWithCurrentFilters: jest.fn(),
        changePage: jest.fn(),
        changePageSize: jest.fn(),
        clearAll: jest.fn(),
        refreshWithParams: jest.fn(),
      },
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    };
  });

  it("renders grid page at index route", async () => {
    const { default: RoleContainerLocal } = await import(
      "@/pages/roles/RoleContainer"
    );
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/*" element={<RoleContainerLocal />} />
        </Routes>
      </MemoryRouter>
    );
    expect(
      screen.getByTestId(TEST_IDS.MOCK_PERMISSION_GUARD)
    ).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.ROLE_GRID_PAGE)).toBeInTheDocument();
  });

  it("renders details page for id route", async () => {
    const { default: RoleContainerLocal } = await import(
      "@/pages/roles/RoleContainer"
    );
    render(
      <MemoryRouter initialEntries={["/123"]}>
        <Routes>
          <Route path="/*" element={<RoleContainerLocal />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByTestId(TEST_IDS.ROLE_DETAILS)).toBeInTheDocument();
  });

  it("passes loading=true to grid when initial load in progress", async () => {
    mockRolesHook.isLoading = true;
    const { default: RoleContainerLocal } = await import(
      "@/pages/roles/RoleContainer"
    );
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/*" element={<RoleContainerLocal />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByTestId(TEST_IDS.ROLE_GRID_PAGE)).toHaveTextContent(
      "loading"
    );
  });
});
