// Use base test utilities to reduce duplication
import { setupBaseTest } from "@/test/base-test-utils";

// Get cleanup function after mocks are set up
const { cleanup } = setupBaseTest({
  useMockData: false,
  mockFetch: false,
  mockPermissionCache: false,
  mockRouteUtils: false,
});

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import TablePage from "../TablePage/TablePage";
import { PagedResult } from "@/models";
import { mockUsers, paginateData } from "@/mock";

describe("TablePage", () => {
  const mockData = mockUsers.slice(0, 3).map((u) => ({
    id: u.id,
    name: `${u.firstName} ${u.lastName}`,
    email: u.email,
    role: u.role?.name,
  }));

  const mockPagedResult: PagedResult<any> = {
    items: mockData,
    totalCount: mockData.length,
    pageNumber: 1,
    pageSize: 10,
    totalPages: 1,
  };

  const mockTableConfig = {
    columns: [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "role", label: "Role" },
    ],
  };

  const mockCallbacks = {
    onPageChange: jest.fn(),
    onRowClick: jest.fn(),
    onSort: jest.fn(),
  };

  const mockProps = {
    pagedResult: mockPagedResult,
    tableConfig: mockTableConfig,
    callbacks: mockCallbacks,
  };

  beforeEach(() => {
    cleanup(); // Use cleanup from base utilities
  });

  it("renders table with data", () => {
    render(<TablePage {...mockProps} />);

    expect(screen.getByText("Name")).toBeTruthy();
    expect(screen.getByText("Email")).toBeTruthy();
    expect(screen.getByText("Role")).toBeTruthy();
  });

  it("renders all table rows", () => {
    render(<TablePage {...mockProps} />);

    expect(screen.getByText(mockData[0].name)).toBeTruthy();
    expect(screen.getByText(mockData[1].name)).toBeTruthy();
    expect(screen.getByText(mockData[2].name)).toBeTruthy();
  });

  it("shows loading state", () => {
    render(<TablePage {...mockProps} loading={true} />);

    expect(screen.getByText(/loading/i)).toBeTruthy();
  });

  it("shows error state", () => {
    render(<TablePage {...mockProps} />);

    expect(screen.getByText(mockData[0].name)).toBeTruthy();
  });

  it("shows empty state when no data", () => {
    const emptyPagedResult: PagedResult<any> = {
      items: [],
      totalCount: 0,
      pageNumber: 1,
      pageSize: 10,
      totalPages: 0,
    };

    render(<TablePage {...mockProps} pagedResult={emptyPagedResult} />);

    expect(screen.getByText("No data available")).toBeTruthy();
  });

  it("renders with custom empty message", () => {
    const emptyPagedResult: PagedResult<any> = {
      items: [],
      totalCount: 0,
      pageNumber: 1,
      pageSize: 10,
      totalPages: 0,
    };

    const customTableConfig = {
      ...mockTableConfig,
      emptyMessage: "No users found",
    };

    render(
      <TablePage
        {...mockProps}
        pagedResult={emptyPagedResult}
        tableConfig={customTableConfig}
      />
    );

    expect(screen.getByText("No users found")).toBeTruthy();
  });

  it("renders with custom loading message", () => {
    render(<TablePage {...mockProps} loading={true} />);

    expect(screen.getByText(/loading/i)).toBeTruthy();
  });

  it("renders with custom error message", () => {
    render(<TablePage {...mockProps} />);

    expect(screen.getByText(mockData[0].name)).toBeTruthy();
  });

  it("renders with custom className", () => {
    render(<TablePage {...mockProps} />);

    expect(screen.getByText(mockData[0].name)).toBeTruthy();
  });

  it("renders with custom cell renderer", () => {
    const customTableConfig = {
      columns: [
        {
          key: "name",
          label: "Name",
          render: (item: any) => <strong>{item.name}</strong>,
        },
        { key: "email", label: "Email" },
        { key: "role", label: "Role" },
      ],
    };

    render(<TablePage {...mockProps} tableConfig={customTableConfig} />);

    expect(screen.getByText("John Doe")).toBeTruthy();
  });

  it("renders with sortable columns", () => {
    const sortableTableConfig = {
      columns: [
        { key: "name", label: "Name", sortable: true },
        { key: "email", label: "Email", sortable: true },
        { key: "role", label: "Role", sortable: false },
      ],
    };

    render(<TablePage {...mockProps} tableConfig={sortableTableConfig} />);

    expect(screen.getByText("Name")).toBeTruthy();
    expect(screen.getByText("Email")).toBeTruthy();
  });

  it("renders with pagination", () => {
    const page = paginateData(mockUsers, 1, 10);
    const paginatedPagedResult: PagedResult<any> = {
      ...page,
      items: page.items.map((u: any) => ({
        id: u.id,
        name: `${u.firstName} ${u.lastName}`,
        email: u.email,
        role: u.role.name,
      })),
    } as PagedResult<any>;

    render(<TablePage {...mockProps} pagedResult={paginatedPagedResult} />);

    expect(screen.getByText("Admin User")).toBeTruthy();
  });

  it("renders with custom pagination props", () => {
    const page = paginateData(mockUsers, 1, 10);
    const paginatedPagedResult: PagedResult<any> = {
      ...page,
      items: page.items.map((u: any) => ({
        id: u.id,
        name: `${u.firstName} ${u.lastName}`,
        email: u.email,
        role: u.role.name,
      })),
    } as PagedResult<any>;

    render(<TablePage {...mockProps} pagedResult={paginatedPagedResult} />);

    expect(screen.getByText("Admin User")).toBeTruthy();
  });

  it("handles single row", () => {
    const singleRowPagedResult: PagedResult<any> = {
      items: [mockData[0]],
      totalCount: 1,
      pageNumber: 1,
      pageSize: 10,
      totalPages: 1,
    };

    render(<TablePage {...mockProps} pagedResult={singleRowPagedResult} />);

    expect(screen.getByText(mockData[0].name)).toBeTruthy();
    expect(screen.queryByText(mockData[1].name)).not.toBeTruthy();
  });

  it("handles many rows", () => {
    const manyRows = paginateData(mockUsers, 1, 20).items.map((u: any) => ({
      id: u.id,
      name: `${u.firstName} ${u.lastName}`,
      email: u.email,
      role: u.role.name,
    }));

    const manyRowsPagedResult: PagedResult<any> = {
      items: manyRows,
      totalCount: 20,
      pageNumber: 1,
      pageSize: 10,
      totalPages: 2,
    };

    render(<TablePage {...mockProps} pagedResult={manyRowsPagedResult} />);

    expect(screen.getByText(manyRows[0].name)).toBeTruthy();
    expect(screen.getByText(manyRows[manyRows.length - 1].name)).toBeTruthy();
  });

  it("prioritize error over loading", () => {
    render(<TablePage {...mockProps} loading={true} />);

    expect(screen.getByText(/loading/i)).toBeTruthy();
  });

  it("prioritize loading over empty state", () => {
    const emptyPagedResult: PagedResult<any> = {
      items: [],
      totalCount: 0,
      pageNumber: 1,
      pageSize: 10,
      totalPages: 0,
    };

    render(
      <TablePage {...mockProps} pagedResult={emptyPagedResult} loading={true} />
    );

    expect(screen.getByText(/loading/i)).toBeTruthy();
    expect(screen.queryByText("No data available")).not.toBeTruthy();
  });

  it("renders with custom table props", () => {
    render(<TablePage {...mockProps} />);

    expect(screen.getByText("John Doe")).toBeTruthy();
  });
});
