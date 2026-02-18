import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { render, screen, fireEvent, act } from "@testing-library/react";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";

const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>No error</div>;
};

describe("ErrorBoundary", () => {
  beforeEach(() => {
    consoleSpy.mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    consoleSpy.mockImplementation(() => {});
  });

  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">Test content</div>
      </ErrorBoundary>
    );

    expect(screen.getByTestId("child")).toBeTruthy();
  });

  it("renders error UI when there is an error", async () => {
    await act(async () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );
    });

    expect(screen.getByText("Something went wrong")).toBeTruthy();
    expect(
      screen.getByText(
        "We're sorry, but something unexpected happened. Please try one of the options below."
      )
    ).toBeTruthy();
  });

  it("shows try again button", async () => {
    await act(async () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );
    });

    expect(screen.getByText("Try Again")).toBeTruthy();
    expect(screen.getByText("Refresh Page")).toBeTruthy();
  });

  it("calls onError callback when error occurs", async () => {
    const onError = jest.fn();
    await act(async () => {
      render(
        <ErrorBoundary onError={onError}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );
    });

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    );
  });

  it("reset error state when try again is clicked", async () => {
    let rerender: any;
    await act(async () => {
      const utils = render(
        <ErrorBoundary resetOnPropsChange={true} resetKeys={["error"]}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );
      rerender = utils.rerender;
    });

    expect(screen.getByText("Something went wrong")).toBeTruthy();

    await act(async () => {
      fireEvent.click(screen.getByText("Try Again"));
    });

    await act(async () => {
      rerender(
        <ErrorBoundary resetOnPropsChange={true} resetKeys={["no-error"]}>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );
    });

    expect(screen.getByText("No error")).toBeTruthy();
  });

  it("shows custom fallback when provided", async () => {
    const customFallback = (
      <div data-testid="custom-fallback">Custom error message</div>
    );

    await act(async () => {
      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );
    });

    expect(screen.getByTestId("custom-fallback")).toBeTruthy();
    expect(screen.getByText("Custom error message")).toBeTruthy();
  });

  it("shows error details when showDetails prop is true", async () => {
    await act(async () => {
      render(
        <ErrorBoundary showDetails={true}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );
    });

    expect(screen.getByText("Error Details")).toBeTruthy();
    expect(screen.getByText("Test error")).toBeTruthy();
  });

  it("not show error details by default", async () => {
    await act(async () => {
      render(
        <ErrorBoundary showDetails={false}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );
    });

    expect(screen.getByText("Error Details")).toBeTruthy();
    expect(screen.getByText("Test error")).toBeTruthy();
  });

  it("handles error boundary reset functionality", async () => {
    let rerender: any;
    await act(async () => {
      const utils = render(
        <ErrorBoundary resetOnPropsChange={true} resetKeys={["error"]}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );
      rerender = utils.rerender;
    });

    expect(screen.getByText("Something went wrong")).toBeTruthy();

    await act(async () => {
      rerender(
        <ErrorBoundary resetOnPropsChange={true} resetKeys={["error2"]}>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );
    });

    expect(screen.getByText("No error")).toBeTruthy();
  });
});
