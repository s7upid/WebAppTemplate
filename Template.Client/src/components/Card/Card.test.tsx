import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Card from "./Card";
import { User, Settings } from "lucide-react";

describe("Card", () => {
  it("renders with title and description", () => {
    render(
      <Card title="Test Card" description="This is a test card" icon={User} />
    );

    expect(screen.getByText("Test Card")).toBeTruthy();
    expect(screen.getByText("This is a test card")).toBeTruthy();
  });

  it("renders with icon", () => {
    render(
      <Card
        title="Test Card"
        description="This is a test card"
        icon={Settings}
      />
    );

    expect(screen.getByText("Test Card")).toBeTruthy();
    expect(screen.getByText("This is a test card")).toBeTruthy();
  });

  it("renders without icon", () => {
    render(
      <Card title="Test Card" description="This is a test card" icon={User} />
    );

    expect(screen.getByText("Test Card")).toBeTruthy();
    expect(screen.getByText("This is a test card")).toBeTruthy();
  });

  it("accepts custom className", () => {
    render(
      <Card
        title="Test Card"
        description="This is a test card"
        icon={User}
        className="custom-class"
      />
    );

    expect(screen.getByText("Test Card")).toBeTruthy();
    expect(screen.getByText("This is a test card")).toBeTruthy();
  });

  it("renders with children", () => {
    render(
      <Card title="Test Card" description="This is a test card" icon={User}>
        <div data-testid="card-content">Card content</div>
      </Card>
    );

    expect(screen.getByText("Test Card")).toBeTruthy();
    expect(screen.getByText("This is a test card")).toBeTruthy();
  });
});
