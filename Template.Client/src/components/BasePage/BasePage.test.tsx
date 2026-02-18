import "@testing-library/jest-dom";
import { describe, it, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import BasePage from "./BasePage";
import { TEST_IDS } from "@/config";
import { Plus } from "lucide-react";

describe("BasePage", () => {
  it("renders title and children", () => {
    render(
      <BasePage title="Test Page">
        <div data-testid="content">Test content</div>
      </BasePage>
    );

    expect(screen.getByText("Test Page")).toBeTruthy();
    expect(screen.getByTestId(TEST_IDS.PAGE_CONTENT)).toBeTruthy();
  });

  it("renders header details", () => {
    render(
      <BasePage title="Test Page" description="Desc" subtitle="Sub">
        <div />
      </BasePage>
    );

    expect(screen.getByText("Test Page")).toBeTruthy();
    expect(screen.getByText("Desc")).toBeTruthy();
    expect(screen.getByText("Sub")).toBeTruthy();
  });

  it("supports icon and className", () => {
    const { container } = render(
      <BasePage title="With Icon" icon={Plus} className="custom-class">
        <div />
      </BasePage>
    );
    expect(screen.getByText("With Icon")).toBeTruthy();
    expect(container.querySelector(".custom-class")).toBeTruthy();
  });

  it("shows error box when error provided", () => {
    render(
      <BasePage title="Err" error="Test error">
        <div />
      </BasePage>
    );
    expect(screen.getByText("Test error")).toBeTruthy();
  });
});
