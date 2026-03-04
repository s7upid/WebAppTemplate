import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AuditLogsPage from "./AuditLogsPage";
import { TEST_IDS } from "@/config";
import { useAuditQuery } from "@/hooks";
import { createEmptyPagedResult } from "@/models";
import type { AuditLog } from "@/models/generated";

const mockPaginationHandlers = {
  refreshWithParams: jest.fn(),
  clearAll: jest.fn(),
  changePage: jest.fn(),
  changePageSize: jest.fn(),
  refreshWithCurrentFilters: jest.fn(),
};

const mockUseAuditQueryReturn = () => ({
  auditLogs: [] as AuditLog[],
  paginationResult: createEmptyPagedResult<AuditLog>(),
  paginationHandlers: mockPaginationHandlers,
  isLoading: false,
  error: null,
  refetch: jest.fn(),
});

jest.mock("lucide-react", () => new Proxy({}, { get: () => () => null }));

jest.mock("@/config/navigation", () => ({
  getNavigationUrls: jest.fn(() => ({ main: "/" })),
  getComponentForModule: jest.fn(),
  createNavigationChildren: jest.fn(() => []),
}));

jest.mock("@/hooks", () => ({
  useAuditQuery: jest.fn(() => ({
    auditLogs: [],
    paginationResult: createEmptyPagedResult<AuditLog>(),
    paginationHandlers: mockPaginationHandlers,
    isLoading: false,
    error: null,
    refetch: jest.fn(),
  })),
}));

jest.mock("./useAuditTableConfig", () => ({
  useAuditTableConfig: () => ({
    columns: [
      { key: "timestamp", label: "Time", sortable: true },
      { key: "eventType", label: "Event", sortable: false },
      { key: "description", label: "Description", sortable: false },
    ],
  }),
}));

jest.mock("@/components/Guards/RoleGuard", () => ({
  __esModule: true,
  default: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}));

jest.mock("@/components", () => {
  const Card = ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="audit-card">{children}</div>
  );
  const PageHeader = ({ title }: { title?: string }) => (
    <h1 data-testid="page-header">{title}</h1>
  );
  const EntityToolbar = () => (
    <div data-testid="entity-toolbar">Toolbar</div>
  );
  const LoadingSpinner = () => <div data-testid="loading-spinner">Loading...</div>;
  const Pagination = () => <div data-testid="pagination">Pagination</div>;
  const Dialog = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>;
  const Alert = ({ children, "data-testid": testId }: { children?: React.ReactNode; "data-testid"?: string }) => (
    <div data-testid={testId ?? "alert"} role="alert">{children}</div>
  );
  const EmptyState = ({ title, "data-testid": testId }: { title?: string; "data-testid"?: string }) => (
    <div data-testid={testId ?? "empty-state"}><span>{title}</span></div>
  );
  return {
    Card,
    PageHeader,
    EntityToolbar,
    LoadingSpinner,
    Pagination,
    Dialog,
    Alert,
    EmptyState,
  };
});

const mockUseAuditQuery = jest.mocked(useAuditQuery);

describe("AuditLogsPage", () => {
  beforeEach(() => {
    mockUseAuditQuery.mockReturnValue(mockUseAuditQueryReturn());
  });

  it("renders page header and toolbar", () => {
    render(
      <MemoryRouter>
        <AuditLogsPage />
      </MemoryRouter>
    );
    expect(screen.getByTestId("page-header")).toHaveTextContent("Audit Events");
    expect(screen.getByTestId("entity-toolbar")).toBeInTheDocument();
    expect(screen.getByTestId("audit-logs-page")).toBeInTheDocument();
  });

  it("shows loading state when isLoading is true", () => {
    mockUseAuditQuery.mockReturnValue({
      ...mockUseAuditQueryReturn(),
      isLoading: true,
    });
    render(
      <MemoryRouter>
        <AuditLogsPage />
      </MemoryRouter>
    );
    expect(screen.getByTestId(TEST_IDS.TABLE_LOADING)).toBeInTheDocument();
  });

  it("shows error when error is set", () => {
    mockUseAuditQuery.mockReturnValue({
      ...mockUseAuditQueryReturn(),
      error: "Network error",
    });
    render(
      <MemoryRouter>
        <AuditLogsPage />
      </MemoryRouter>
    );
    expect(screen.getByTestId("audit-logs-error")).toBeInTheDocument();
    expect(screen.getByText(/Network error/)).toBeInTheDocument();
  });

  it("shows empty message when no items", () => {
    mockUseAuditQuery.mockReturnValue({
      ...mockUseAuditQueryReturn(),
      paginationResult: createEmptyPagedResult<AuditLog>(10),
    });
    render(
      <MemoryRouter>
        <AuditLogsPage />
      </MemoryRouter>
    );
    expect(screen.getByTestId(TEST_IDS.TABLE_EMPTY)).toBeInTheDocument();
    expect(screen.getByText("No data available")).toBeInTheDocument();
  });
});
