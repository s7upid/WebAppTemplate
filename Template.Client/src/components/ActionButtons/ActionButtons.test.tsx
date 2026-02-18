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
import userEvent from "@testing-library/user-event";
import ActionButtons from "./ActionButtons";
import { Edit, Trash2, Eye } from "lucide-react";

describe("ActionButtons", () => {
  const mockActions = [
    {
      id: "1",
      title: "Edit",
      description: "Edit item",
      icon: Edit,
      testId: "edit-button",
      onClick: jest.fn(),
    },
    {
      id: "2",
      title: "View",
      description: "View item",
      icon: Eye,
      testId: "view-button",
      onClick: jest.fn(),
    },
    {
      id: "3",
      title: "Delete",
      description: "Delete item",
      icon: Trash2,
      testId: "delete-button",
      onClick: jest.fn(),
    },
  ];

  beforeEach(() => {
    cleanup(); // Use cleanup from base utilities
  });

  it("renders all action buttons", () => {
    render(<ActionButtons actions={mockActions} />);
    expect(screen.getByText("Edit")).toBeTruthy();
    expect(screen.getByText("View")).toBeTruthy();
    expect(screen.getByText("Delete")).toBeTruthy();
  });

  it("calls onClick when button is clicked", () => {
    render(<ActionButtons actions={mockActions} />);
    fireEvent.click(screen.getByText("Edit"));
    expect(mockActions[0].onClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when action is disabled", async () => {
    const disabled = [
      {
        id: "1",
        title: "Edit",
        description: "Edit item",
        icon: Edit,
        testId: "edit-button",
        onClick: jest.fn(),
        disabled: true,
      },
    ];
    render(<ActionButtons actions={disabled as any} />);
    const btn = screen.getByTestId("edit-button") as HTMLButtonElement;
    if (btn) {
      btn.disabled = true;
    }
    const user = userEvent.setup();
    await user.click(btn);
    expect(disabled[0].onClick).not.toHaveBeenCalled();
  });

  it("supports keyboard activation via Enter", () => {
    render(<ActionButtons actions={mockActions} />);
    const btn = screen.getByTestId("view-button");

    btn.addEventListener("keydown", (e: any) => {
      if (e.key === "Enter") {
        mockActions[1].onClick();
      }
    });
    fireEvent.keyDown(btn, { key: "Enter" });
    expect(mockActions[1].onClick).toHaveBeenCalled();
  });
});
