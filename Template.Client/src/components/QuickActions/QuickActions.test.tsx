import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import QuickActions from "./QuickActions";
import { Plus, Edit } from "lucide-react";

describe("QuickActions", () => {
  it("returns null when actions array is empty", () => {
    const { container } = render(
      <QuickActions actions={[]} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders default title and actions", () => {
    const onEdit = jest.fn();
    render(
      <QuickActions
        actions={[
          {
            id: "edit",
            title: "Edit",
            icon: Edit,
            testId: "edit-action",
            onClick: onEdit,
          },
        ]}
      />
    );
    expect(screen.getByTestId("quick-actions-card")).toBeInTheDocument();
    expect(screen.getByTestId("card-title")).toHaveTextContent("Quick Actions");
    expect(screen.getByTestId("edit-action")).toHaveTextContent("Edit");
    fireEvent.click(screen.getByTestId("edit-action"));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it("renders custom title and icon and description in button label", () => {
    const onAdd = jest.fn();
    render(
      <QuickActions
        title="Actions"
        icon={Plus}
        actions={[
          {
            id: "add",
            title: "Add",
            description: "Create new",
            icon: Plus,
            testId: "add-action",
            onClick: onAdd,
          },
        ]}
      />
    );
    expect(screen.getByTestId("card-title")).toHaveTextContent("Actions");
    expect(screen.getByTestId("add-action")).toHaveTextContent("Add — Create new");
    fireEvent.click(screen.getByTestId("add-action"));
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it("applies testId to the grid wrapper", () => {
    render(
      <QuickActions
        testId="detail-quick-actions"
        actions={[
          {
            id: "x",
            title: "X",
            icon: Edit,
            testId: "x-btn",
            onClick: () => {},
          },
        ]}
      />
    );
    expect(screen.getByTestId("detail-quick-actions")).toBeInTheDocument();
  });
});
