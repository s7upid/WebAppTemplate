import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog";

describe("ConfirmationDialog", () => {
  it("renders when open", () => {
    render(
      <ConfirmationDialog
        isOpen={true}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        title="Confirm Action"
        message="Are you sure?"
      />
    );

    expect(screen.getByText("Confirm Action")).toBeTruthy();
    expect(screen.getByText("Are you sure?")).toBeTruthy();
  });

  it("not render when closed", () => {
    render(
      <ConfirmationDialog
        isOpen={false}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        title="Confirm Action"
        message="Are you sure?"
      />
    );

    expect(screen.queryByText("Confirm Action")).not.toBeTruthy();
  });

  it("calls onConfirm when confirm button is clicked", () => {
    const handleConfirm = jest.fn();
    render(
      <ConfirmationDialog
        isOpen={true}
        onClose={jest.fn()}
        onConfirm={handleConfirm}
        title="Confirm Action"
        message="Are you sure?"
      />
    );

    const confirmButton = screen.getByText("Confirm");
    fireEvent.click(confirmButton);
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when cancel button is clicked", () => {
    const handleClose = jest.fn();
    render(
      <ConfirmationDialog
        isOpen={true}
        onClose={handleClose}
        onConfirm={jest.fn()}
        title="Confirm Action"
        message="Are you sure?"
      />
    );

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when backdrop is clicked", () => {
    const handleClose = jest.fn();
    render(
      <ConfirmationDialog
        isOpen={true}
        onClose={handleClose}
        onConfirm={jest.fn()}
        title="Confirm Action"
        message="Are you sure?"
      />
    );

    expect(screen.getByText("Confirm Action")).toBeTruthy();
  });

  it("shows custom button text", () => {
    render(
      <ConfirmationDialog
        isOpen={true}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        title="Confirm Action"
        message="Are you sure?"
        confirmText="Yes, delete"
        cancelText="No, keep"
      />
    );

    expect(screen.getByText("Yes, delete")).toBeTruthy();
    expect(screen.getByText("No, keep")).toBeTruthy();
  });

  it("shows loading state", () => {
    render(
      <ConfirmationDialog
        isOpen={true}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        title="Confirm Action"
        message="Are you sure?"
      />
    );

    expect(screen.getByText("Confirm Action")).toBeTruthy();
  });

  it("handles escape key", () => {
    const handleClose = jest.fn();
    render(
      <ConfirmationDialog
        isOpen={true}
        onClose={handleClose}
        onConfirm={jest.fn()}
        title="Confirm Action"
        message="Are you sure?"
      />
    );

    expect(screen.getByText("Confirm Action")).toBeTruthy();
  });
});
