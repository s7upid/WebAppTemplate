// Use base test utilities to reduce duplication
import { setupBaseTest } from "@/test/base-test-utils";

// Get cleanup function after mocks are set up
const { cleanup } = setupBaseTest({
  useMockData: false,
  mockFetch: false,
  mockPermissionCache: false,
  mockRouteUtils: false,
});

import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import PasswordChangeModal from "./PasswordChangeModal";
import { TEST_IDS } from "@/config";

jest.mock("@/services/authService", () => ({
  authService: {
    changePassword: jest.fn(),
  },
}));

const mockChangePassword = jest.fn();

jest.mock("@/store", () => ({
  store: {
    getState: () => ({
      auth: {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      },
    }),
    dispatch: jest.fn(),
  },
}));

jest.mock("@/hooks", () => {
  const actual = jest.requireActual("@/hooks");
  return {
    ...actual,
    useAuth: () => {
      const store = (window as any).__REDUX_STORE__;
      if (store) {
        const state = store.getState();
        return {
          user: state.auth?.user || null,
          token: state.auth?.token || null,
          isAuthenticated: state.auth?.isAuthenticated || false,
          isLoading: state.auth?.isLoading || false,
          login: jest.fn(),
          logout: jest.fn(),
          refreshToken: jest.fn(),
          forgotPassword: jest.fn(),
          setupPassword: jest.fn(),
          changePassword: mockChangePassword,
          getCurrentUser: jest.fn(),
          refreshUser: jest.fn(),
        };
      }

      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
        refreshToken: jest.fn(),
        forgotPassword: jest.fn(),
        setupPassword: jest.fn(),
        changePassword: mockChangePassword,
        getCurrentUser: jest.fn(),
        refreshUser: jest.fn(),
      };
    },
    useToast: () => ({
      showSuccess: jest.fn(),
      showError: jest.fn(),
    }),
  };
});

jest.mock("react-hook-form", () => {
  const actual = jest.requireActual("react-hook-form");
  return {
    ...actual,
    useForm: () => {
      const form = actual.useForm({
        resolver: jest
          .requireActual("@hookform/resolvers/zod")
          .zodResolver(
            jest.requireActual("@/validations/schemas").passwordChangeSchema
          ),
        defaultValues: {
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        },
      });
      return form;
    },
  };
});

// Use base component mocks - use factory function to avoid hoisting issues
jest.mock("@/components", () => {
  const { getComponentMocks } = require("@/test/base-test-utils");
  return getComponentMocks();
});

describe("PasswordChangeModal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
  };

  beforeEach(() => {
    cleanup(); // Use cleanup from base utilities
    mockChangePassword.mockClear();
  });

  it("renders modal when open", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <PasswordChangeModal {...defaultProps} />
        </BrowserRouter>
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await waitFor(() => {
      expect(screen.getByTestId(TEST_IDS.MODAL)).toBeTruthy();
      expect(screen.getByTestId(TEST_IDS.EXPORT_MODAL_TITLE)).toHaveTextContent(
        "Change Password"
      );
    });
  });

  it("not render when closed", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <PasswordChangeModal {...defaultProps} isOpen={false} />
        </BrowserRouter>
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await waitFor(() => {
      expect(screen.queryByTestId(TEST_IDS.MODAL)).not.toBeTruthy();
    });
  });

  it("renders all form fields", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <PasswordChangeModal {...defaultProps} />
        </BrowserRouter>
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await waitFor(() => {
      expect(
        screen.getByTestId("input-enter-your-current-password")
      ).toBeTruthy();
      expect(screen.getByTestId("input-enter-your-new-password")).toBeTruthy();
      expect(
        screen.getByTestId("input-confirm-your-new-password")
      ).toBeTruthy();
    });
  });

  it("shows password toggle buttons", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <PasswordChangeModal {...defaultProps} />
        </BrowserRouter>
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await waitFor(() => {
      const passwordInputs = screen.getAllByTestId(/input-.*-password/);
      passwordInputs.forEach((input) => {
        const icon = input
          .closest("div")
          ?.querySelector('[data-testid="icon-size"]');
        expect(icon).toBeTruthy();
      });
    });
  });

  it("handles form submission successfully", async () => {
    mockChangePassword.mockResolvedValue({
      type: "auth/changePassword/fulfilled",
      payload: "Password changed successfully",
      meta: {
        requestStatus: "fulfilled",
        arg: {
          currentPassword: "oldPassword123",
          newPassword: "NewPassword123",
          confirmPassword: "NewPassword123",
        },
      },
    });

    await act(async () => {
      render(
        <BrowserRouter>
          <PasswordChangeModal {...defaultProps} />
        </BrowserRouter>
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const currentPasswordInput = screen.getByTestId(
      "input-enter-your-current-password"
    );
    const newPasswordInput = screen.getByTestId(
      "input-enter-your-new-password"
    );
    const confirmPasswordInput = screen.getByTestId(
      "input-confirm-your-new-password"
    );

    await act(async () => {
      fireEvent.change(currentPasswordInput, {
        target: { value: "oldPassword123" },
      });
      fireEvent.change(newPasswordInput, {
        target: { value: "NewPassword123" },
      });
      fireEvent.change(confirmPasswordInput, {
        target: { value: "NewPassword123" },
      });
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    const submitButton = screen.getByTestId(TEST_IDS.BUTTON_PRIMARY);
    await act(async () => {
      fireEvent.click(submitButton);
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    await waitFor(() => {
      expect(mockChangePassword).toHaveBeenCalledWith({
        currentPassword: "oldPassword123",
        newPassword: "NewPassword123",
        confirmPassword: "NewPassword123",
      });
    });
  });

  it("handles form submission error", async () => {
    mockChangePassword.mockResolvedValue({
      type: "auth/changePassword/rejected",
      payload: "Current password is incorrect",
      meta: {
        requestStatus: "rejected",
        arg: {
          currentPassword: "wrongPassword",
          newPassword: "NewPassword123",
          confirmPassword: "NewPassword123",
        },
      },
    });

    await act(async () => {
      render(
        <BrowserRouter>
          <PasswordChangeModal {...defaultProps} />
        </BrowserRouter>
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const currentPasswordInput = screen.getByTestId(
      "input-enter-your-current-password"
    );
    const newPasswordInput = screen.getByTestId(
      "input-enter-your-new-password"
    );
    const confirmPasswordInput = screen.getByTestId(
      "input-confirm-your-new-password"
    );

    await act(async () => {
      fireEvent.change(currentPasswordInput, {
        target: { value: "wrongPassword" },
      });
      fireEvent.change(newPasswordInput, {
        target: { value: "NewPassword123" },
      });
      fireEvent.change(confirmPasswordInput, {
        target: { value: "NewPassword123" },
      });
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    const submitButton = screen.getByTestId(TEST_IDS.BUTTON_PRIMARY);
    await act(async () => {
      fireEvent.click(submitButton);
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    await waitFor(() => {
      expect(mockChangePassword).toHaveBeenCalledWith({
        currentPassword: "wrongPassword",
        newPassword: "NewPassword123",
        confirmPassword: "NewPassword123",
      });
    });
  });

  it("handles API error", async () => {
    mockChangePassword.mockRejectedValue(new Error("Network error"));

    await act(async () => {
      render(
        <BrowserRouter>
          <PasswordChangeModal {...defaultProps} />
        </BrowserRouter>
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const currentPasswordInput = screen.getByTestId(
      "input-enter-your-current-password"
    );
    const newPasswordInput = screen.getByTestId(
      "input-enter-your-new-password"
    );
    const confirmPasswordInput = screen.getByTestId(
      "input-confirm-your-new-password"
    );

    await act(async () => {
      fireEvent.change(currentPasswordInput, {
        target: { value: "oldPassword123" },
      });
      fireEvent.change(newPasswordInput, {
        target: { value: "NewPassword123" },
      });
      fireEvent.change(confirmPasswordInput, {
        target: { value: "NewPassword123" },
      });
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    const submitButton = screen.getByTestId(TEST_IDS.BUTTON_PRIMARY);
    await act(async () => {
      fireEvent.click(submitButton);
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    await waitFor(() => {
      expect(mockChangePassword).toHaveBeenCalled();
    });
  });

  it("calls onClose when cancel button is clicked", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <PasswordChangeModal {...defaultProps} />
        </BrowserRouter>
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const cancelButton = screen.getByTestId(TEST_IDS.BUTTON_SECONDARY);
    act(() => {
      fireEvent.click(cancelButton);
    });

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("shows loading state during submission", async () => {
    let resolvePromise: (value: any) => void;
    mockChangePassword.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve;
        })
    );

    await act(async () => {
      render(
        <BrowserRouter>
          <PasswordChangeModal {...defaultProps} />
        </BrowserRouter>
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const currentPasswordInput = screen.getByTestId(
      "input-enter-your-current-password"
    );
    const newPasswordInput = screen.getByTestId(
      "input-enter-your-new-password"
    );
    const confirmPasswordInput = screen.getByTestId(
      "input-confirm-your-new-password"
    );

    await act(async () => {
      fireEvent.change(currentPasswordInput, {
        target: { value: "oldPassword123" },
      });
      fireEvent.change(newPasswordInput, {
        target: { value: "NewPassword123" },
      });
      fireEvent.change(confirmPasswordInput, {
        target: { value: "NewPassword123" },
      });
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    const submitButton = screen.getByTestId("button-primary");
    await act(async () => {
      fireEvent.click(submitButton);
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    await waitFor(() => {
      expect(submitButton).toHaveAttribute("data-loading", "true");
      expect(submitButton).toBeDisabled();
    });

    // Resolve the promise to complete the test
    await act(async () => {
      resolvePromise!({
        type: "auth/changePassword/fulfilled",
        payload: "Password changed successfully",
        meta: {
          requestStatus: "fulfilled",
          arg: {
            currentPassword: "oldPassword123",
            newPassword: "NewPassword123",
            confirmPassword: "NewPassword123",
          },
        },
      });
      await new Promise((resolve) => setTimeout(resolve, 100));
    });
  });

  it("validates password confirmation", async () => {
    mockChangePassword.mockClear();

    await act(async () => {
      render(
        <BrowserRouter>
          <PasswordChangeModal {...defaultProps} />
        </BrowserRouter>
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const currentPasswordInput = screen.getByTestId(
      "input-enter-your-current-password"
    );
    const newPasswordInput = screen.getByTestId(
      "input-enter-your-new-password"
    );
    const confirmPasswordInput = screen.getByTestId(
      "input-confirm-your-new-password"
    );

    await act(async () => {
      fireEvent.change(currentPasswordInput, {
        target: { value: "oldPassword123" },
      });
      fireEvent.change(newPasswordInput, {
        target: { value: "NewPassword123" },
      });
      fireEvent.change(confirmPasswordInput, {
        target: { value: "differentPassword" },
      });
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    const submitButton = screen.getByTestId("button-primary");
    await act(async () => {
      fireEvent.click(submitButton);
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    await waitFor(() => {
      expect(mockChangePassword).not.toHaveBeenCalled();
    });
  });
});
