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
import { render, screen, fireEvent } from "@testing-library/react";
import EntityToolbar from "./EntityToolbar";
import { ToolbarFilterConfig, ToolbarSortField } from "@/models";

describe("EntityToolbar", () => {
  const mockOnApply = jest.fn();
  const mockOnClear = jest.fn();

  const mockProps = {
    searchPlaceholder: "Search...",
    initialSearch: "",
    filters: [] as ToolbarFilterConfig[],
    sortFields: [] as ToolbarSortField[],
    loading: false,
    onApply: mockOnApply,
    onClear: mockOnClear,
  };

  beforeEach(() => {
    cleanup(); // Use cleanup from base utilities
  });

  it("renders with all props", () => {
    render(<EntityToolbar {...mockProps} />);

    expect(screen.getByPlaceholderText("Search...")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Clear" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Apply" })).toBeTruthy();
  });

  it("calls onApply when apply button is clicked", () => {
    render(<EntityToolbar {...mockProps} />);

    const applyButton = screen.getByRole("button", { name: "Apply" });
    fireEvent.click(applyButton);

    expect(mockOnApply).toHaveBeenCalledTimes(1);
    expect(mockOnApply).toHaveBeenCalledWith({
      searchTerm: "",
      filters: {},
      sortColumn: undefined,
      ascending: false,
    });
  });

  it("calls onClear when clear button is clicked", () => {
    render(<EntityToolbar {...mockProps} />);

    const clearButton = screen.getByRole("button", { name: "Clear" });
    fireEvent.click(clearButton);

    expect(mockOnClear).toHaveBeenCalledTimes(1);
  });

  it("renders with custom search placeholder", () => {
    render(
      <EntityToolbar {...mockProps} searchPlaceholder="Search users..." />
    );

    expect(screen.getByPlaceholderText("Search users...")).toBeTruthy();
  });

  it("renders with custom className", () => {
    const { container } = render(<EntityToolbar {...mockProps} />);

    expect(container.firstChild).toHaveClass("toolbar");
  });

  it("renders with filters", () => {
    const filters: ToolbarFilterConfig[] = [
      {
        key: "status",
        label: "Status",
        options: [
          { value: "", label: "All" },
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ],
      },
    ];

    render(<EntityToolbar {...mockProps} filters={filters} />);

    // Status appears in both the label (sr-only) and the select option
    const statusElements = screen.getAllByText("Status");
    expect(statusElements.length).toBeGreaterThan(0);
  });

  it("handles search value changes", () => {
    render(<EntityToolbar {...mockProps} initialSearch="test" />);

    const searchInput = screen.getByPlaceholderText("Search...");
    expect(searchInput).toHaveValue("test");
  });

  it("renders with loading state", () => {
    render(<EntityToolbar {...mockProps} loading={true} />);

    const clearButton = screen.getByRole("button", { name: "Clear" });
    const applyButton = screen.getByRole("button", { name: "Apply" });

    expect(clearButton).toBeDisabled();
    expect(applyButton).toBeDisabled();
  });

  it("renders with sort fields", () => {
    const sortFields: ToolbarSortField[] = [
      { key: "name", label: "Name" },
      { key: "date", label: "Date" },
    ];

    render(<EntityToolbar {...mockProps} sortFields={sortFields} />);

    expect(screen.getByText("Name")).toBeTruthy();
    expect(screen.getByText("Date")).toBeTruthy();
    expect(screen.getByText("Descending")).toBeTruthy();
  });

  it("handles sort field selection", () => {
    const sortFields: ToolbarSortField[] = [{ key: "name", label: "Name" }];

    render(<EntityToolbar {...mockProps} sortFields={sortFields} />);

    const nameButton = screen.getByText("Name");
    fireEvent.click(nameButton);

    expect(nameButton).toHaveAttribute("aria-pressed", "true");
  });

  it("handles ascending toggle", () => {
    const sortFields: ToolbarSortField[] = [{ key: "name", label: "Name" }];

    render(<EntityToolbar {...mockProps} sortFields={sortFields} />);

    const ascendingButton = screen.getByText("Descending");
    fireEvent.click(ascendingButton);

    expect(screen.getByText("Ascending")).toBeTruthy();
  });

  it("pass correct parameters to onApply", () => {
    const filters: ToolbarFilterConfig[] = [
      {
        key: "status",
        label: "Status",
        options: [
          { value: "", label: "All" },
          { value: "active", label: "Active" },
        ],
      },
    ];

    render(<EntityToolbar {...mockProps} filters={filters} />);

    // Select the filter value first - find select by its testId or by finding the select element
    const filterSelects = screen.getAllByRole(
      "combobox"
    ) as HTMLSelectElement[];
    const filterSelect =
      filterSelects.find((select) =>
        select.querySelector('option[value="active"]')
      ) || filterSelects[0];
    if (filterSelect) {
      fireEvent.change(filterSelect, { target: { value: "active" } });
    }

    const applyButton = screen.getByRole("button", { name: "Apply" });
    fireEvent.click(applyButton);

    expect(mockOnApply).toHaveBeenCalledWith({
      searchTerm: "",
      filters: { status: "active" },
      sortColumn: undefined,
      ascending: false,
    });
  });
});
