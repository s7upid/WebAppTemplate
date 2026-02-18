import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import FilterSelect from "../FilterSelect/FilterSelect";

const mockOptions = [
  { value: "all", label: "All" },
  { value: "admin", label: "Admin" },
  { value: "user", label: "User" },
];

describe("FilterSelect", () => {
  it("renders with options", () => {
    render(<FilterSelect options={mockOptions} />);

    expect(screen.getByText("All")).toBeTruthy();
    expect(screen.getByText("Admin")).toBeTruthy();
    expect(screen.getByText("User")).toBeTruthy();
  });

  it("handles value changes", () => {
    const handleChange = jest.fn();
    render(
      <FilterSelect
        options={mockOptions}
        value="admin"
        onChange={handleChange}
      />
    );

    const select = screen.getByDisplayValue("Admin");
    fireEvent.change(select, { target: { value: "user" } });
    expect(handleChange).toHaveBeenCalledWith("user");
  });

  it("shows placeholder when no value selected", () => {
    render(<FilterSelect options={mockOptions} placeholder="Select role" />);
    expect(screen.getByText("Select role")).toBeTruthy();
  });

  it("be disabled when disabled prop is true", () => {
    render(<FilterSelect options={mockOptions} disabled />);
    expect(screen.getByRole("combobox")).toBeTruthy();
  });

  it("accepts custom className", () => {
    render(<FilterSelect options={mockOptions} className="custom-filter" />);
    expect(screen.getByRole("combobox")).toBeTruthy();
  });

  it("renders with default value", () => {
    render(<FilterSelect options={mockOptions} value="user" />);
    expect(screen.getByDisplayValue("User")).toBeTruthy();
  });

  it("handles empty options array", () => {
    render(<FilterSelect options={[]} />);
    expect(screen.getByRole("combobox")).toBeTruthy();
  });
});
