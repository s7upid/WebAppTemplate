import "@testing-library/jest-dom";
import { describe, it, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import PageHeader from "../PageHeader/PageHeader";
import { Plus, Search } from "lucide-react";

describe("PageHeader", () => {
  it("renders with title", () => {
    render(<PageHeader title="Test Page" />);
    expect(screen.getByText("Test Page")).toBeTruthy();
  });

  it("renders with subtitle", () => {
    render(<PageHeader title="Test Page" subtitle="Test subtitle" />);
    expect(screen.getByText("Test subtitle")).toBeTruthy();
  });

  it("renders with actions", () => {
    const actions = <button data-testid="action-button">Action</button>;
    render(<PageHeader title="Test Page" actions={actions} />);
    expect(screen.getByTestId("action-button")).toBeTruthy();
  });

  it("applies custom className", () => {
    const { container } = render(
      <PageHeader title="Test Page" className="custom-header" />
    );
    const el = container.firstChild as HTMLElement | null;
    expect(el && el.classList.contains("custom-header")).toBe(true);
  });

  it("renders with icon", () => {
    render(<PageHeader title="Test Page" icon={Plus} />);
    expect(screen.getByText("Test Page")).toBeTruthy();
  });

  it("renders with description", () => {
    render(
      <PageHeader
        title="Test Page"
        description="This is a test page description"
      />
    );
    expect(screen.getByText("This is a test page description")).toBeTruthy();
  });

  it("renders with all props", () => {
    const actions = <button>Action</button>;

    render(
      <PageHeader
        title="Test Page"
        subtitle="Test subtitle"
        description="Test description"
        icon={Search}
        actions={actions}
        className="custom-class"
      />
    );

    expect(screen.getByText("Test Page")).toBeTruthy();
    expect(screen.getByText("Test subtitle")).toBeTruthy();
    expect(screen.getByText("Test description")).toBeTruthy();
    expect(screen.getByText("Action")).toBeTruthy();
  });

  it("renders without optional elements", () => {
    render(<PageHeader title="Minimal Header" />);
    expect(screen.getByText("Minimal Header")).toBeTruthy();
    expect(screen.queryByText("Test subtitle")).toBeNull();
  });
});
