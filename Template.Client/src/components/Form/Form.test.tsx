import "@testing-library/jest-dom";
import { describe, it } from "@jest/globals";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useForm } from "react-hook-form";
import Form from "../Form/Form";

const TestForm = ({ onSubmit, children, ...props }: any) => {
  const methods = useForm();

  return (
    <Form
      methods={methods}
      onSubmit={methods.handleSubmit(onSubmit)}
      {...props}
    >
      {children}
    </Form>
  );
};

describe("Form", () => {
  it("renders form with children", () => {
    const onSubmit = jest.fn();
    render(
      <TestForm onSubmit={onSubmit}>
        <input type="text" name="test" />
        <button type="submit">Submit</button>
      </TestForm>
    );

    expect(screen.getByRole("textbox")).toBeTruthy();
    expect(screen.getByRole("textbox")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Submit" })).toBeTruthy();
  });

  it("handles form submission", async () => {
    const onSubmit = jest.fn();
    render(
      <TestForm onSubmit={onSubmit}>
        <input type="text" name="test" defaultValue="test value" />
        <button type="submit">Submit</button>
      </TestForm>
    );

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
  });

  it("applies custom className", () => {
    const onSubmit = jest.fn();
    render(
      <TestForm onSubmit={onSubmit} className="custom-form">
        <div>Form content</div>
      </TestForm>
    );

    expect(screen.getByText("Form content").closest("form")).toHaveClass(
      "custom-form"
    );
  });

  it("renders with default spacing", () => {
    const onSubmit = jest.fn();
    render(
      <TestForm onSubmit={onSubmit}>
        <div>Form content</div>
      </TestForm>
    );
    expect(screen.getByText("Form content").closest("form")).toHaveClass(
      "spacing"
    );
  });

  it("handles form methods", () => {
    const onSubmit = jest.fn();
    const TestFormWithMethods = () => {
      const methods = useForm();

      return (
        <Form methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
          <input {...methods.register("test")} />
          <button type="submit">Submit</button>
        </Form>
      );
    };

    render(<TestFormWithMethods />);

    expect(screen.getByRole("textbox")).toBeTruthy();
    expect(screen.getByRole("textbox")).toBeTruthy();
  });

  it("renders with custom props", () => {
    const onSubmit = jest.fn();
    render(
      <TestForm
        onSubmit={onSubmit}
        data-testid="test-form"
        aria-label="Test form"
      >
        <div>Form content</div>
      </TestForm>
    );

    const form = screen.getByTestId("test-form");
    expect(form).toHaveAttribute("aria-label", "Test form");
  });
});
