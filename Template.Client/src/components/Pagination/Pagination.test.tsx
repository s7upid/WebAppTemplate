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
import { describe, it } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "../Pagination/Pagination";

describe("Pagination", () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 10,
    onPageChange: jest.fn(),
  };

  beforeEach(() => {
    cleanup(); // Use cleanup from base utilities
  });

  it("renders pagination with current page", () => {
    render(<Pagination {...defaultProps} />);

    expect(screen.getByText("1")).toBeTruthy();
    expect(screen.getByText("of 10 pages")).toBeTruthy();
  });

  it("shows page dropdown when clicked", () => {
    render(<Pagination {...defaultProps} />);

    const pageButton = screen.getByText("1");
    fireEvent.click(pageButton);

    expect(screen.getByText("2")).toBeTruthy();
    expect(screen.getByText("3")).toBeTruthy();
  });

  it("handles page change from dropdown", () => {
    const onPageChange = jest.fn();
    render(<Pagination {...defaultProps} onPageChange={onPageChange} />);

    const pageButton = screen.getByText("1");
    fireEvent.click(pageButton);

    fireEvent.click(screen.getByText("2"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("shows previous button when not on first page", () => {
    render(<Pagination {...defaultProps} currentPage={3} />);
    expect(screen.getByRole("button", { name: /previous page/i })).toBeTruthy();
  });

  it("shows next button when not on last page", () => {
    render(<Pagination {...defaultProps} currentPage={3} />);
    expect(screen.getByRole("button", { name: /next page/i })).toBeTruthy();
  });

  it("handles previous button click", () => {
    const onPageChange = jest.fn();
    render(
      <Pagination
        {...defaultProps}
        currentPage={3}
        onPageChange={onPageChange}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /previous page/i }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("handles next button click", () => {
    const onPageChange = jest.fn();
    render(
      <Pagination
        {...defaultProps}
        currentPage={3}
        onPageChange={onPageChange}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /next page/i }));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it("disable previous button on first page", () => {
    render(<Pagination {...defaultProps} currentPage={1} />);
    const prevButton = screen.getByRole("button", { name: /previous page/i });
    expect(prevButton).toBeDisabled();
  });

  it("disable next button on last page", () => {
    render(<Pagination {...defaultProps} currentPage={10} />);
    const nextButton = screen.getByRole("button", { name: /next page/i });
    expect(nextButton).toBeDisabled();
  });

  it("renders with custom className", () => {
    render(<Pagination {...defaultProps} className="custom-pagination" />);
    expect(screen.getByRole("navigation")).toHaveClass("custom-pagination");
  });

  it("handles single page", () => {
    render(<Pagination {...defaultProps} totalPages={1} />);
    expect(screen.getByText("1")).toBeTruthy();
    expect(screen.getByText("of 1 pages")).toBeTruthy();
  });

  it("handles zero pages", () => {
    render(<Pagination {...defaultProps} totalPages={0} />);
    expect(screen.queryByText("1")).not.toBeTruthy();
  });

  it("renders with custom page size options", () => {
    const pageSizeOptions = [10, 20, 50];
    render(
      <Pagination
        {...defaultProps}
        pageSizeOptions={pageSizeOptions}
        pageSize={20}
        onPageSizeChange={jest.fn()}
      />
    );

    expect(screen.getByDisplayValue("20")).toBeTruthy();
  });

  it("handles page size change", () => {
    const onPageSizeChange = jest.fn();
    const pageSizeOptions = [10, 20, 50];

    render(
      <Pagination
        {...defaultProps}
        pageSizeOptions={pageSizeOptions}
        pageSize={20}
        onPageSizeChange={onPageSizeChange}
      />
    );

    const select = screen.getByDisplayValue("20");
    fireEvent.change(select, { target: { value: "50" } });
    expect(onPageSizeChange).toHaveBeenCalledWith(50);
  });

  it("shows items per page label", () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByText("Items per page")).toBeTruthy();
  });

  it("shows correct total pages", () => {
    render(<Pagination {...defaultProps} totalPages={5} />);
    expect(screen.getByText("of 5 pages")).toBeTruthy();
  });
});
