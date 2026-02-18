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
import SearchInput from "../SearchInput/SearchInput";

describe("SearchInput", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    cleanup(); // Use cleanup from base utilities
  });

  it("renders with placeholder", () => {
    render(
      <SearchInput value="" onChange={mockOnChange} placeholder="Search..." />
    );
    expect(screen.getByPlaceholderText("Search...")).toBeTruthy();
  });

  it("handles value changes", () => {
    render(<SearchInput value="test" onChange={mockOnChange} />);

    const input = screen.getByDisplayValue("test");
    fireEvent.change(input, { target: { value: "new search" } });
    expect(mockOnChange).toHaveBeenCalledWith("new search");
  });

  it("disables input when disabled prop is true", () => {
    render(<SearchInput value="" onChange={mockOnChange} disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("calls onChange with empty string when cleared", () => {
    render(<SearchInput value="abc" onChange={mockOnChange} />);
    const input = screen.getByDisplayValue("abc");
    fireEvent.change(input, { target: { value: "" } });
    expect(mockOnChange).toHaveBeenCalledWith("");
  });

  it("renders with initial value", () => {
    render(<SearchInput value="initial" onChange={mockOnChange} />);
    expect(screen.getByDisplayValue("initial")).toBeTruthy();
  });

  it("renders with search icon", () => {
    render(<SearchInput value="" onChange={mockOnChange} />);

    const input = screen.getByRole("textbox");
    expect(input).toBeTruthy();

    const iconContainer = input.closest("div")?.querySelector("svg");
    expect(iconContainer).toBeTruthy();
  });

  it("accepts custom className", () => {
    const { container } = render(
      <SearchInput value="" onChange={mockOnChange} className="custom-search" />
    );
    expect(container.firstChild).toHaveClass("custom-search");
  });

  it("renders with testId", () => {
    render(
      <SearchInput value="" onChange={mockOnChange} testId="search-input" />
    );
    expect(screen.getByTestId("search-input")).toBeTruthy();
  });

  it("handles empty value", () => {
    render(<SearchInput value="" onChange={mockOnChange} />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("");
  });

  it("handles long values", () => {
    const longValue = "a".repeat(100);
    render(<SearchInput value={longValue} onChange={mockOnChange} />);
    const input = screen.getByDisplayValue(longValue);
    expect(input).toBeTruthy();
  });
});
