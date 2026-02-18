import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import EmptyState from "./EmptyState";
import { User, Settings } from "lucide-react";

describe("EmptyState", () => {
  it("renders with title", () => {
    render(<EmptyState title="No items found" />);

    expect(screen.getByText("No items found")).toBeTruthy();
  });

  it("renders with description", () => {
    render(
      <EmptyState
        title="No items found"
        description="There are no items to display"
      />
    );

    expect(screen.getByText("No items found")).toBeTruthy();
    expect(screen.getByText("There are no items to display")).toBeTruthy();
  });

  it("renders with icon", () => {
    render(<EmptyState title="No items found" icon={User} />);

    expect(screen.getByText("No items found")).toBeTruthy();
  });

  it("renders primary action button", () => {
    const handleClick = jest.fn();
    render(
      <EmptyState
        title="No items found"
        primaryAction={{ label: "Add Item", onClick: handleClick }}
      />
    );

    const button = screen.getByText("Add Item");
    expect(button).toBeTruthy();
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders without icon when icon prop is not provided", () => {
    render(<EmptyState title="No items found" />);

    expect(screen.getByText("No items found")).toBeTruthy();
  });

  it("renders without description when description prop is not provided", () => {
    render(<EmptyState title="No items found" />);

    expect(screen.getByText("No items found")).toBeTruthy();
  });

  it("accepts custom className", () => {
    const { container } = render(
      <EmptyState title="No items found" className="custom-class" />
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders with all props", () => {
    const handleClick = jest.fn();
    render(
      <EmptyState
        title="No items found"
        description="There are no items to display"
        icon={Settings}
        primaryAction={{ label: "Add Item", onClick: handleClick }}
        className="custom-class"
      />
    );

    expect(screen.getByText("No items found")).toBeTruthy();
    expect(screen.getByText("There are no items to display")).toBeTruthy();
    expect(screen.getByText("Add Item")).toBeTruthy();
  });
});
