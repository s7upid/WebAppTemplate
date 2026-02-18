// Use base test utilities to reduce duplication
import { setupBaseTest } from "@/test/base-test-utils";

// Mock store before imports to avoid hoisting issues
jest.mock("@/store", () => {
  const { getSliceMocks } = require("@/test/base-test-utils");
  return getSliceMocks({ errorMessages: { LOGIN_FAILED: "Login failed" } })
    .store;
});

// Mock useErrorHandler before other imports
jest.mock("@/hooks/ui/useErrorHandler", () => ({
  useErrorHandler: jest.fn(() => ({
    handleError: jest.fn(),
  })),
}));

// Also mock it in @/hooks to ensure it's available
jest.mock("@/hooks", () => {
  const actual = jest.requireActual("@/hooks");
  const mockHandleError = jest.fn();
  return {
    ...actual,
    useErrorHandler: () => ({
      handleError: mockHandleError,
    }),
  };
});

jest.mock("react-hook-form", () => ({
  useForm: () => ({
    register: jest.fn(),
    handleSubmit: jest.fn((fn) => fn),
    formState: { errors: {} },
    setError: jest.fn(),
  }),
}));

// Get cleanup function after mocks are set up
const { cleanup } = setupBaseTest({
  useMockData: false,
  mockFetch: false,
  mockPermissionCache: false,
  mockRouteUtils: false,
});

import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import LoginPage from "./LoginPage";
import { TEST_IDS } from "@/config";
import { ToastProvider } from "@/hooks";

const createMockStore = () => {
  return configureStore({
    reducer: {
      auth: (
        state = {
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        }
      ) => state,
    },
  });
};

const renderWithRouter = (component: React.ReactElement) => {
  const store = createMockStore();
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <ToastProvider>{component}</ToastProvider>
      </BrowserRouter>
    </Provider>
  );
};

describe("LoginPage", () => {
  beforeEach(() => {
    cleanup();
  });

  it("renders login form with all required elements", () => {
    renderWithRouter(<LoginPage />);

    expect(screen.getByText("Sign in to your account")).toBeTruthy();
    expect(screen.getByText("Welcome back")).toBeTruthy();
    expect(screen.getByLabelText(/email/i)).toBeTruthy();
    expect(screen.getByTestId(TEST_IDS.PASSWORD_INPUT)).toBeTruthy();
    expect(screen.getByTestId(TEST_IDS.LOGIN_BUTTON)).toBeTruthy();
  });

  it("renders forgot password link", () => {
    renderWithRouter(<LoginPage />);

    expect(screen.getByTestId(TEST_IDS.FORGOT_PASSWORD_LINK)).toBeTruthy();
    expect(screen.getByText("Forgot your password?")).toBeTruthy();
  });

  it("renders remember me checkbox", () => {
    renderWithRouter(<LoginPage />);

    expect(screen.getByTestId(TEST_IDS.REMEMBER_ME)).toBeTruthy();
  });
});
