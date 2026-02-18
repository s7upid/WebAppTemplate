// Use base test utilities to reduce duplication
import { getComponentMocks } from "@/test/base-test-utils";

import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { UserResponse, UserStatus } from "@/models";
import { TEST_IDS } from "@/config";
import UserRejectionModal from "./UserRejectionModal";
import { mockUsers } from "@/mock/data";

// Use base component mocks with factory function to avoid hoisting issues
jest.mock("@/components", () => {
  const componentMocks = getComponentMocks();
  // Extend Button mock to support icon prop
  return {
    ...componentMocks,
    Button: ({ children, onClick, disabled, loading, variant, icon, ...props }: any) => (
      <button
        data-testid={`button-${variant || "default"}`}
        onClick={onClick}
        disabled={disabled || loading}
        data-loading={loading}
        data-icon={icon ? "has-icon" : "no-icon"}
        {...props}
      >
        {children}
      </button>
    ),
  };
});

const baseMockUser = mockUsers.find((u) => u.userStatus === UserStatus.Pending) || mockUsers[4]; // Fallback to Alice Johnson (id: "5")
const mockUser: UserResponse = {
  ...baseMockUser,
  customPermissionsCount: 0,
  isActive: false,
  userStatus: baseMockUser.userStatus ?? UserStatus.Pending,
  role: undefined,
};

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
      theme: (state = { theme: "light", isDark: false }) => state,
    },
  });
};

const renderWithProviders = (component: React.ReactElement) => {
  const store = createMockStore();
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

describe("UserRejectionModal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    user: mockUser,
    onReject: jest.fn(),
    loading: false,
  };

  beforeEach(() => {
    cleanup();
  });

  it("renders modal when open", () => {
    renderWithProviders(<UserRejectionModal {...defaultProps} />);

    expect(screen.getByTestId(TEST_IDS.MODAL)).toBeTruthy();
    expect(screen.getByTestId(TEST_IDS.EXPORT_MODAL_TITLE)).toHaveTextContent(
      "Reject User Registration"
    );
  });

  it("not render when closed", () => {
    renderWithProviders(
      <UserRejectionModal {...defaultProps} isOpen={false} />
    );

    expect(screen.queryByTestId(TEST_IDS.MODAL)).not.toBeTruthy();
  });

  it("displays warning message", () => {
    renderWithProviders(<UserRejectionModal {...defaultProps} />);

    expect(
      screen.getByText("Are you sure you want to reject this registration?")
    ).toBeTruthy();
  });

  it("displays user information", () => {
    renderWithProviders(<UserRejectionModal {...defaultProps} />);

    expect(screen.getByText(/Alice/)).toBeTruthy();
    expect(screen.getByText(/Johnson/)).toBeTruthy();
    expect(screen.getByText("alice.johnson@example.com")).toBeTruthy();
    // Date format varies by locale, so check for the year and month/day pattern
    expect(screen.getByText(/2024/)).toBeTruthy();
    expect(screen.getByText(/Registration Date:/)).toBeTruthy();
  });

  it("displays description about rejection", () => {
    renderWithProviders(<UserRejectionModal {...defaultProps} />);

    expect(
      screen.getByText(
        "This action will permanently remove the user registration and send a rejection email to the user."
      )
    ).toBeTruthy();
  });

  it("calls onReject when reject button is clicked", () => {
    renderWithProviders(<UserRejectionModal {...defaultProps} />);

    const rejectButton = screen.getByTestId(TEST_IDS.BUTTON_DANGER);
    fireEvent.click(rejectButton);

    expect(defaultProps.onReject).toHaveBeenCalled();
  });

  it("calls onClose when cancel button is clicked", () => {
    renderWithProviders(<UserRejectionModal {...defaultProps} />);

    const cancelButton = screen.getByTestId(TEST_IDS.BUTTON_SECONDARY);
    fireEvent.click(cancelButton);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("disable buttons when loading", () => {
    renderWithProviders(
      <UserRejectionModal {...defaultProps} loading={true} />
    );

    const cancelButton = screen.getByTestId(TEST_IDS.BUTTON_SECONDARY);
    const rejectButton = screen.getByTestId(TEST_IDS.BUTTON_DANGER);

    expect(cancelButton).toBeDisabled();
    expect(rejectButton).toBeDisabled();
  });

  it("shows loading state on reject button", () => {
    renderWithProviders(
      <UserRejectionModal {...defaultProps} loading={true} />
    );

    const rejectButton = screen.getByTestId(TEST_IDS.BUTTON_DANGER);
    expect(rejectButton).toHaveAttribute("data-loading", "true");
  });

  it("not render when user is null", () => {
    expect(() => {
      renderWithProviders(
        <UserRejectionModal {...defaultProps} user={null as unknown as UserResponse} />
      );
    }).toThrow();
  });

  it("handles email with long text", () => {
    const userWithLongEmail = {
      ...mockUser,
      email: "verylongemailaddressthatexceedstypicallength@example.com",
    };

    renderWithProviders(
      <UserRejectionModal {...defaultProps} user={userWithLongEmail} />
    );

    const emailElement = screen.getByText(userWithLongEmail.email);
    expect(emailElement).toHaveClass("user-rejection-modal-email-break");
  });

  it("have proper CSS classes for styling", () => {
    renderWithProviders(<UserRejectionModal {...defaultProps} />);

    expect(
      screen.getByText("Are you sure you want to reject this registration?")
    ).toHaveClass("rejection-warning-title");
    expect(
      screen.getByText(
        "This action will permanently remove the user registration and send a rejection email to the user."
      )
    ).toHaveClass("rejection-warning-description");
  });
});
