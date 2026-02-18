import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import List from "../List/List";

describe("List", () => {
  const mockItems = [
    { id: 1, text: "First item" },
    { id: 2, text: "Second item" },
    { id: 3, text: "Third item" },
  ];

  const mockProps = {
    items: mockItems,
    renderItem: (item: any) => (
      <div key={item.id} data-testid={`list-item-${item.id}`}>
        {item.text}
      </div>
    ),
  };

  it("renders all list items", () => {
    render(<List {...mockProps} />);

    expect(screen.getByTestId("list-item-1")).toBeTruthy();
    expect(screen.getByTestId("list-item-2")).toBeTruthy();
    expect(screen.getByTestId("list-item-3")).toBeTruthy();
  });

  it("renders item content correctly", () => {
    render(<List {...mockProps} />);

    expect(screen.getByText("First item")).toBeTruthy();
    expect(screen.getByText("Second item")).toBeTruthy();
    expect(screen.getByText("Third item")).toBeTruthy();
  });

  it("renders with custom className", () => {
    const { container } = render(
      <List {...mockProps} listClassName="custom-list" />
    );

    expect(container.firstChild).toHaveClass("custom-list");
  });

  it("renders with testId", () => {
    render(<List {...mockProps} testId="custom-list" />);

    expect(screen.getByTestId("custom-list")).toBeTruthy();
  });

  it("handles empty items array", () => {
    render(<List {...mockProps} items={[]} />);

    expect(screen.queryByTestId("list-item-1")).not.toBeTruthy();
  });

  it("handles single item", () => {
    const singleItem = [mockItems[0]];
    render(<List {...mockProps} items={singleItem} />);

    expect(screen.getByTestId("list-item-1")).toBeTruthy();
    expect(screen.queryByTestId("list-item-2")).not.toBeTruthy();
  });

  it("handles many items", () => {
    const manyItems = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      text: `Item ${i + 1}`,
    }));

    render(<List {...mockProps} items={manyItems} />);

    expect(screen.getByTestId("list-item-1")).toBeTruthy();
    expect(screen.getByTestId("list-item-10")).toBeTruthy();
  });

  it("handles renderItem function that returns null", () => {
    const renderItemNull = () => null;

    render(<List {...mockProps} renderItem={renderItemNull} />);

    expect(screen.queryByTestId("list-item-1")).not.toBeTruthy();
  });

  it("handles renderItem function that returns different elements", () => {
    const renderItemCustom = (item: any) => (
      <li key={item.id} data-testid={`custom-${item.id}`}>
        <span>{item.text}</span>
      </li>
    );

    render(<List {...mockProps} renderItem={renderItemCustom} />);

    expect(screen.getByTestId("custom-1")).toBeTruthy();
    expect(screen.getByText("First item")).toBeTruthy();
  });

  it("handles items with complex data", () => {
    const complexItems = [
      { id: 1, name: "John", age: 30, email: "john@example.com" },
      { id: 2, name: "Jane", age: 25, email: "jane@example.com" },
    ];

    const renderComplexItem = (item: any) => (
      <div key={item.id} data-testid={`complex-${item.id}`}>
        <h3>{item.name}</h3>
        <p>Age: {item.age}</p>
        <p>Email: {item.email}</p>
      </div>
    );

    render(<List items={complexItems} renderItem={renderComplexItem} />);

    expect(screen.getByTestId("complex-1")).toBeTruthy();
    expect(screen.getByText("John")).toBeTruthy();
    expect(screen.getByText("Age: 30")).toBeTruthy();
    expect(screen.getByText("Email: john@example.com")).toBeTruthy();
  });

  it("handles items with no id", () => {
    const itemsWithoutId = [
      { text: "Item without ID 1" },
      { text: "Item without ID 2" },
    ];

    const renderItemWithoutId = (item: any) => (
      <div key={item.text} data-testid={`no-id-${item.text}`}>
        {item.text}
      </div>
    );

    render(
      <List items={itemsWithoutId as any} renderItem={renderItemWithoutId} />
    );

    expect(screen.getByTestId("no-id-Item without ID 1")).toBeTruthy();
    expect(screen.getByTestId("no-id-Item without ID 2")).toBeTruthy();
  });

  it("renders with different list types", () => {
    const { rerender } = render(<List {...mockProps} />);
    expect(screen.getByTestId("list-item-1")).toBeTruthy();

    rerender(<List {...mockProps} listClassName="different-class" />);
    expect(screen.getByTestId("list-item-1")).toBeTruthy();
  });
});
