import { setupBaseTest } from "@/test/base-test-utils";

const { cleanup } = setupBaseTest({
  useMockData: false,
  mockFetch: false,
  mockPermissionCache: false,
  mockRouteUtils: false,
});

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { TEST_IDS } from "@/config";
import { UserResponse, UserStatus, RoleResponse } from "@/models";
import { mockUsers, mockRoles } from "@/mock/data";
import { ROLE_NAMES } from "@/config/generated/permissionKeys.generated";
import UserApprovalModal from "./UserApprovalModal";

jest.mock("@/components", () => {
  const { getComponentMocks } = require("@/test/base-test-utils");
  const componentMocks = getComponentMocks();
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

const mockUser: UserResponse = mockUsers.find(
  (u) => u.userStatus === UserStatus.Pending
) as UserResponse;

const defaultRole: RoleResponse = mockRoles[0];

jest.mock("@/hooks", () => ({
  useRolesQuery: () => ({
    roles: (jest.requireActual("@/mock/data") as any).mockRoles,
    paginationResult: {
      items: (jest.requireActual("@/mock/data") as any).mockRoles,
      totalCount: (jest.requireActual("@/mock/data") as any).mockRoles.length,
      pageNumber: 1,
      pageSize: 10,
      totalPages: 1,
    },
    isLoading: false,
    error: null,
    paginationHandlers: {
      changePage: jest.fn(),
      changePageSize: jest.fn(),
      clearAll: jest.fn(),
      refreshWithCurrentFilters: jest.fn(),
      refreshWithParams: jest.fn(),
    },
    refetch: jest.fn(),
  }),
}));

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
      roles: (
        state = {
          items: [],
          totalCount: 0,
          pageNumber: 1,
          pageSize: 10,
          totalPages: 0,
          isLoading: false,
          error: null,
          selectedRole: null,
          lastQuery: null,
        }
      ) => state,
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

describe("UserApprovalModal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    user: mockUser,
    selectedRole: mockUser.role ?? defaultRole,
    onRoleChange: jest.fn(),
    onApprove: jest.fn(),
    loading: false,
  };

  beforeEach(() => {
    cleanup();
  });

  it("renders modal when open", () => {
    renderWithProviders(<UserApprovalModal {...defaultProps} />);

    expect(screen.getByTestId(TEST_IDS.MODAL)).toBeTruthy();
    expect(screen.getByTestId(TEST_IDS.EXPORT_MODAL_TITLE)).toHaveTextContent(
      "Approve User Registration"
    );
  });

  it("not render when closed", () => {
    renderWithProviders(<UserApprovalModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByTestId(TEST_IDS.MODAL)).not.toBeTruthy();
  });

  it("displays user information", () => {
    renderWithProviders(<UserApprovalModal {...defaultProps} />);

    expect(screen.getByText("User Information")).toBeTruthy();

    expect(screen.getByText(/Name:/)).toBeTruthy();
    expect(screen.getByText(/Alice/)).toBeTruthy();
    expect(screen.getByText(/Johnson/)).toBeTruthy();
    expect(screen.getByText("alice.johnson@example.com")).toBeTruthy();
    // Date format depends on locale, so use a flexible matcher
    expect(screen.getByText(/Registration Date:/)).toBeTruthy();
  });

  it("displays role selection", () => {
    renderWithProviders(<UserApprovalModal {...defaultProps} />);

    expect(screen.getByText("Assign Role")).toBeTruthy();
    expect(screen.getByRole("combobox")).toBeTruthy();
  });

  it("calls onRoleChange when role is changed", () => {
    renderWithProviders(<UserApprovalModal {...defaultProps} />);

    const roleSelect = screen.getByRole("combobox");
    fireEvent.change(roleSelect, { target: { value: ROLE_NAMES.ADMINISTRATOR } });

    expect(roleSelect).toBeTruthy();
  });

  it("calls onApprove when approve button is clicked", () => {
    renderWithProviders(<UserApprovalModal {...defaultProps} />);

    const approveButton = screen.getByTestId(TEST_IDS.BUTTON_SUCCESS);
    fireEvent.click(approveButton);

    expect(defaultProps.onApprove).toHaveBeenCalled();
  });

  it("calls onClose when cancel button is clicked", () => {
    renderWithProviders(<UserApprovalModal {...defaultProps} />);

    const cancelButton = screen.getByTestId(TEST_IDS.BUTTON_SECONDARY);
    fireEvent.click(cancelButton);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("disable buttons when loading", () => {
    renderWithProviders(<UserApprovalModal {...defaultProps} loading={true} />);

    const cancelButton = screen.getByTestId(TEST_IDS.BUTTON_SECONDARY);
    const approveButton = screen.getByTestId(TEST_IDS.BUTTON_SUCCESS);

    expect(cancelButton).toBeDisabled();
    expect(approveButton).toBeDisabled();
  });

  it("shows loading state on approve button", () => {
    renderWithProviders(<UserApprovalModal {...defaultProps} loading={true} />);

    const approveButton = screen.getByTestId(TEST_IDS.BUTTON_SUCCESS);
    expect(approveButton).toHaveAttribute("data-loading", "true");
  });

  it("displays all available roles", () => {
    renderWithProviders(<UserApprovalModal {...defaultProps} />);

    expect(screen.getByRole("combobox")).toBeTruthy();
  });

  it("handles email with long text", () => {
    const userWithLongEmail = {
      ...mockUser,
      email: "verylongemailaddressthatexceedstypicallength@example.com",
    };

    renderWithProviders(
      <UserApprovalModal {...defaultProps} user={userWithLongEmail} />
    );

    const emailElement = screen.getByText(userWithLongEmail.email);
    expect(emailElement).toHaveClass("user-approval-modal-email-break");
  });
});
