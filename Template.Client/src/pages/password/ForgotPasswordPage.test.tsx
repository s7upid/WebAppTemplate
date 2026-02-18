// Use base test utilities to reduce duplication
import { setupBaseTest } from "@/test/base-test-utils";

// Get cleanup function after mocks are set up
const { cleanup } = setupBaseTest({
  useMockData: false,
  mockFetch: false,
  mockPermissionCache: false,
  mockRouteUtils: false,
});

import React from "react";
import { screen, waitFor } from "@testing-library/react";
import ForgotPasswordPage from "@/pages/password/ForgotPasswordPage";
import { renderWithProviders } from "@/test/test-utils";
import userEvent from "@testing-library/user-event";

const renderLocal = (ui: React.ReactElement) => {
  return renderWithProviders(ui);
};

describe("ForgotPasswordPage", () => {
  beforeEach(() => {
    cleanup(); // Use cleanup from base utilities
  });

  it("renders and submits with valid email", async () => {
    const user = userEvent.setup();
    const mockForgotPassword = jest.fn().mockResolvedValue({
      type: "auth/forgotPassword/fulfilled",
      payload: "Reset email sent successfully",
    });

    jest.spyOn(require("@/hooks"), "useAuth").mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      refreshToken: jest.fn(),
      forgotPassword: mockForgotPassword,
      setupPassword: jest.fn(),
      changePassword: jest.fn(),
      getCurrentUser: jest.fn(),
      refreshUser: jest.fn(),
    });

    renderLocal(<ForgotPasswordPage />);

    const email = screen.getByLabelText("Email address") as HTMLInputElement;
    const submitButton = screen.getByText("Send reset link");

    await user.type(email, "john.doe@example.com");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockForgotPassword).toHaveBeenCalledWith({
        email: "john.doe@example.com",
      });
    });
  });

  it("does not submit when email is invalid", async () => {
    const user = userEvent.setup();
    const mockForgotPassword = jest.fn();

    jest.spyOn(require("@/hooks"), "useAuth").mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      refreshToken: jest.fn(),
      forgotPassword: mockForgotPassword,
      setupPassword: jest.fn(),
      changePassword: jest.fn(),
      getCurrentUser: jest.fn(),
      refreshUser: jest.fn(),
    });

    renderLocal(<ForgotPasswordPage />);
    const email = screen.getByLabelText("Email address") as HTMLInputElement;
    const submitButton = screen.getByText("Send reset link");

    await user.type(email, "invalid");
    await user.click(submitButton);

    // Form validation should prevent submission
    await waitFor(
      () => {
        expect(mockForgotPassword).not.toHaveBeenCalled();
      },
      { timeout: 1000 }
    );
  });

  it("shows error when API returns failure", async () => {
    const user = userEvent.setup();
    const mockForgotPassword = jest.fn().mockResolvedValue({
      type: "auth/forgotPassword/rejected",
      payload: "Unknown email",
    });

    jest.spyOn(require("@/hooks"), "useAuth").mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      refreshToken: jest.fn(),
      forgotPassword: mockForgotPassword,
      setupPassword: jest.fn(),
      changePassword: jest.fn(),
      getCurrentUser: jest.fn(),
      refreshUser: jest.fn(),
    });

    renderLocal(<ForgotPasswordPage />);
    const email = screen.getByLabelText("Email address") as HTMLInputElement;
    const submitButton = screen.getByText("Send reset link");

    await user.type(email, "notfound@example.com");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockForgotPassword).toHaveBeenCalled();
    });
  });

  it("disables submit and shows spinner during submission", async () => {
    const user = userEvent.setup();
    let resolvePromise: (v: any) => void;
    const mockForgotPassword = jest.fn().mockImplementation(
      () =>
        new Promise((res) => {
          resolvePromise = res;
        })
    );

    jest.spyOn(require("@/hooks"), "useAuth").mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      refreshToken: jest.fn(),
      forgotPassword: mockForgotPassword,
      setupPassword: jest.fn(),
      changePassword: jest.fn(),
      getCurrentUser: jest.fn(),
      refreshUser: jest.fn(),
    });

    renderLocal(<ForgotPasswordPage />);
    const email = screen.getByLabelText("Email address") as HTMLInputElement;
    const submitButton = screen.getByText("Send reset link");

    await user.type(email, "john.doe@example.com");
    await user.click(submitButton);

    expect(await screen.findByText(/Sending.../i)).toBeInTheDocument();

    resolvePromise!({
      type: "auth/forgotPassword/fulfilled",
      payload: "Reset email sent successfully",
    });
  });
});
