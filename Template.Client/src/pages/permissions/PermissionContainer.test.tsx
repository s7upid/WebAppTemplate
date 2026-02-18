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

let mockPermissionsQueryHook = {
  paginationResult: { items: [], totalCount: 0 },
  paginationHandlers: { refreshWithCurrentFilters: jest.fn() },
  error: null,
  isLoading: false,
};

jest.mock("@/hooks", () => {
  const { getHookMocks } = require("@/test/base-test-utils");
  const { useOnceWhen } = jest.requireActual("@/hooks/ui/useOnceWhen");
  return {
    ...getHookMocks(),
    usePermissionsQuery: () => mockPermissionsQueryHook,
    useOnceWhen,
  };
});

jest.mock("@/components/BasePage/BasePage", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock("@/components/Guards/PermissionGuard", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid={TEST_IDS.MOCK_PERMISSION_GUARD}>{children}</div>
  ),
}));
jest.mock("@/config/navigation", () => ({
  getNavigationUrls: jest.fn(() => ({ main: "/" })),
}));

jest.mock("@/pages/permissions/read/PermissionGridPage", () => ({
  __esModule: true,
  default: ({ isLoading, error }: { isLoading?: boolean; error?: string | null }) => (
    <div data-testid={TEST_IDS.PERMISSION_GRID_PAGE}>
      {error ? "error" : isLoading ? "loading" : "ready"}
    </div>
  ),
}));

describe("PermissionContainer", () => {
  beforeEach(() => {
    cleanup();
    // Reset mock state by mutating the object (don't reassign to preserve closure reference)
    mockPermissionsQueryHook = {
      paginationResult: { items: [], totalCount: 0 },
      paginationHandlers: { refreshWithCurrentFilters: jest.fn() },
      error: null,
      isLoading: false,
    };
  });

  const renderContainer = () => {
    // Use require to avoid module caching issues with dynamic imports
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const PermissionContainerLocal = require("@/pages/permissions/PermissionContainer").default;
    return render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/*" element={<PermissionContainerLocal />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it("renders grid page inside guard", () => {
    renderContainer();

    expect(
      screen.getByTestId(TEST_IDS.MOCK_PERMISSION_GUARD)
    ).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.PERMISSION_GRID_PAGE)).toHaveTextContent(
      "ready"
    );
  });

  it("passes loading to grid page when initial load in progress", () => {
    mockPermissionsQueryHook.isLoading = true;
    renderContainer();

    expect(screen.getByTestId(TEST_IDS.PERMISSION_GRID_PAGE)).toHaveTextContent(
      "loading"
    );
  });
});
