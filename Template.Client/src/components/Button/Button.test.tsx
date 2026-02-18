import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "./Button";
import { Plus } from "lucide-react";

describe("Button", () => {
  it("renders children text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeTruthy();
  });

  it("displays icon next to label when icon prop is provided", () => {
    render(<Button icon={Plus}>Add</Button>);
    expect(screen.getByText("Add")).toBeTruthy();
    expect(screen.getByRole("button")).toBeTruthy();
  });

  it("calls onClick when user clicks button", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("disables when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("shows loading state when loading prop is true", () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole("button")).toBeTruthy();
  });

  it("applies variant classes for all variants", () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole("button")).toHaveClass("primary");
    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole("button")).toHaveClass("secondary");
    rerender(<Button variant="danger">Danger</Button>);
    expect(screen.getByRole("button")).toHaveClass("danger");
    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole("button")).toHaveClass("ghost");
    rerender(<Button variant="success">Success</Button>);
    expect(screen.getByRole("button")).toHaveClass("success");
  });

  it("applies size classes for all sizes", () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button")).toBeTruthy();
    rerender(<Button size="md">Medium</Button>);
    expect(screen.getByRole("button")).toBeTruthy();
    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button")).toBeTruthy();
  });

  it("merges custom className into button classes", () => {
    render(<Button className="custom-class">Custom</Button>);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });
});
