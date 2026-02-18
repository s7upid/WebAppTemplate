import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Dropdown from "./Dropdown";

const mockOptions = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

describe("Dropdown", () => {
  it("renders with options", () => {
    render(<Dropdown options={mockOptions} />);

    expect(screen.getByText("Option 1")).toBeTruthy();
    expect(screen.getByText("Option 2")).toBeTruthy();
    expect(screen.getByText("Option 3")).toBeTruthy();
  });

  it("renders with label", () => {
    render(<Dropdown options={mockOptions} label="Select an option" />);

    expect(screen.getByText("Select an option")).toBeTruthy();
  });

  it("handles value changes", () => {
    const handleChange = jest.fn();
    render(
      <Dropdown
        options={mockOptions}
        value="option1"
        onValueChange={handleChange}
      />
    );

    const select = screen.getByDisplayValue("Option 1");
    fireEvent.change(select, { target: { value: "option2" } });
    expect(handleChange).toHaveBeenCalledWith("option2");
  });

  it("shows error message when error prop is provided", () => {
    render(<Dropdown options={mockOptions} error="This field is required" />);

    expect(screen.getByText("This field is required")).toBeTruthy();
  });

  it("shows helper text when helperText prop is provided", () => {
    render(
      <Dropdown options={mockOptions} helperText="Please select an option" />
    );

    expect(screen.getByText("Please select an option")).toBeTruthy();
  });

  it("renders placeholder option when placeholderOption prop is provided", () => {
    render(
      <Dropdown options={mockOptions} placeholderOption="Choose an option" />
    );

    expect(screen.getByText("Choose an option")).toBeTruthy();
  });

  it("accepts custom testid", () => {
    render(<Dropdown options={mockOptions} testid="custom-dropdown" />);

    expect(screen.getByTestId("custom-dropdown")).toBeTruthy();
  });

  it("handles disabled state", () => {
    render(<Dropdown options={mockOptions} disabled />);

    const select = screen.getByRole("combobox");
    expect(select).toBeDisabled();
  });

  it("renders with default value", () => {
    render(<Dropdown options={mockOptions} value="option2" />);

    expect(screen.getByDisplayValue("Option 2")).toBeTruthy();
  });
});
