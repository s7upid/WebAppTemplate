import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RoleGridPage from "@/pages/roles/read/RoleGridPage";
import { Role } from "@/models";
import { TEST_IDS } from "@/config";

jest.mock("lucide-react", () => new Proxy({}, { get: () => () => null }));
jest.mock("@/components", () => ({
  PaginatedGrid: ({ items, renderCard, testId }: any) => (
    <div data-testid={testId ? `${testId}-page` : "paginated-grid"}>
      {items.map((item: Role, i: number) => (
        <div key={(item as any).id ?? i}>{renderCard(item)}</div>
      ))}
    </div>
  ),
  Card: ({ children, title }: any) => (
    <div><span data-testid="role-name">{title}</span>{children}</div>
  ),
  EntityToolbar: ({ onApply, onClear }: any) => (
    <div>
      <button
        onClick={() => onApply({ searchTerm: "", filters: { type: "system" } })}
      >
        apply
      </button>
      <button onClick={() => onClear?.()}>clear</button>
    </div>
  ),
}));
jest.mock("@/config/navigation", () => ({
  getNavigationUrls: jest.fn(() => ({ main: "/" })),
}));

jest.mock("@/hooks", () => {
  const actual = jest.requireActual("@/hooks");
  return {
    ...actual,
    useGridFilters: (handlers: any) => ({
      actionLoading: false,
      applyFilters: (filters: any) => {
        handlers?.refreshWithParams?.(filters);
      },
      clearAll: () => {
        handlers?.clearAll?.();
      },
    }),
  };
});

jest.mock("@/utils", () => {
  const { getCommonMocks } = require("@/test/base-test-utils");
  const mocks = getCommonMocks({ useMockData: false });
  return {
    useGenericNavigationFunctions: () => ({ goToRoleDetail: jest.fn() }),
    env: { VITE_STORAGE_SECRET_KEY: "k", VITE_APP_NAME: "app" },
    SecureStorage: {
      getToken: jest.fn(() => null),
      getUser: jest.fn(() => null),
      setToken: jest.fn(),
      setUser: jest.fn(),
      clear: jest.fn(),
    },
    cn: mocks.cn,
    logger: mocks.logger,
    Portal: mocks.Portal,
    handleEntityDelete: mocks.handleEntityDelete,
    handleSubmitForm: mocks.handleSubmitForm,
    handleEntitySave: mocks.handleEntitySave,
    useRouteInfo: mocks.useRouteInfo,
    parseRouteInfo: mocks.parseRouteInfo,
    getNavigationUrls: mocks.getNavigationUrls,
    getActiveTab: mocks.getActiveTab,
    isNavigationActive: mocks.isNavigationActive,
    useEntityNavigation: mocks.useEntityNavigation,
  };
});

const makeRole = (over: Partial<Role> = {}) => ({
  id: "r1",
  name: "Admin",
  description: "desc",
  isSystem: false,
  userCount: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  permissions: [],
  users: [],
  ...over,
});

describe("RoleGridPage", () => {
  it("renders items and triggers filter handlers", () => {
    const paginationHandlers = {
      refreshWithParams: jest.fn(),
      clearAll: jest.fn(),
    };
    render(
      <MemoryRouter>
        <RoleGridPage
          paginationResult={{
            items: [makeRole()],
            totalCount: 1,
            pageNumber: 1,
            pageSize: 10,
            totalPages: 1,
          }}
          paginationHandlers={paginationHandlers}
          isLoading={false}
        />
      </MemoryRouter>
    );
    expect(
      screen.getByTestId(`${TEST_IDS.ROLE_PAGE}-page`)
    ).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.ROLE_NAME)).toBeInTheDocument();
    fireEvent.click(screen.getByText("apply"));
    expect(paginationHandlers.refreshWithParams).toHaveBeenCalled();
    fireEvent.click(screen.getByText("clear"));
    expect(paginationHandlers.clearAll).toHaveBeenCalled();
  });
});
