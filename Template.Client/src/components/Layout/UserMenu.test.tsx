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
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import UserMenu from "./UserMenu";
import { TEST_IDS } from "@/config";
import authSlice from "@/store/slices/auth/authSlice";
import { mockUsers } from "@/mock";

const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      auth: authSlice,
    },
    preloadedState,
  });
};

const TestWrapper = ({
  children,
  store,
}: {
  children: React.ReactNode;
  store: any;
}) => (
  <Provider store={store}>
    <BrowserRouter>{children}</BrowserRouter>
  </Provider>
);

describe("UserMenu", () => {
  const mockOnEditProfile = jest.fn();
  const mockOnChangePassword = jest.fn();
  const mockOnLogout = jest.fn();

  beforeEach(() => {
    cleanup(); // Use cleanup from base utilities
  });

  it("renders user menu with user information", () => {
    const store = createTestStore({
      auth: {
        user: mockUsers[0],
        token: "test-token",
        isAuthenticated: true,
        isLoading: false,
      },
    });

    render(
      <TestWrapper store={store}>
        <UserMenu
          onEditProfile={mockOnEditProfile}
          onChangePassword={mockOnChangePassword}
          onLogout={mockOnLogout}
        />
      </TestWrapper>
    );

    expect(screen.getByTestId(TEST_IDS.USER_MENU)).toBeTruthy();
    expect(screen.getByTestId(TEST_IDS.USER_NAME)).toBeTruthy();
    expect(screen.getByTestId(TEST_IDS.USER_EMAIL)).toBeTruthy();
  });

  it("opens dropdown menu when clicked", () => {
    const store = createTestStore({
      auth: {
        user: mockUsers[0],
        token: "test-token",
        isAuthenticated: true,
        isLoading: false,
      },
    });

    render(
      <TestWrapper store={store}>
        <UserMenu
          onEditProfile={mockOnEditProfile}
          onChangePassword={mockOnChangePassword}
          onLogout={mockOnLogout}
        />
      </TestWrapper>
    );

    const menuButton = screen
      .getByTestId(TEST_IDS.USER_MENU)
      .querySelector("button");
    if (menuButton) {
      fireEvent.click(menuButton);
      expect(screen.getByText("Edit Profile")).toBeTruthy();
      expect(screen.getByText("Change Password")).toBeTruthy();
    }
  });

  it("calls onEditProfile when Edit Profile is clicked", () => {
    const store = createTestStore({
      auth: {
        user: mockUsers[0],
        token: "test-token",
        isAuthenticated: true,
        isLoading: false,
      },
    });

    render(
      <TestWrapper store={store}>
        <UserMenu
          onEditProfile={mockOnEditProfile}
          onChangePassword={mockOnChangePassword}
          onLogout={mockOnLogout}
        />
      </TestWrapper>
    );

    const menuButton = screen
      .getByTestId(TEST_IDS.USER_MENU)
      .querySelector("button");
    if (menuButton) {
      fireEvent.click(menuButton);
      const editButton = screen.getByText("Edit Profile");
      fireEvent.click(editButton);
      expect(mockOnEditProfile).toHaveBeenCalledTimes(1);
    }
  });

  it("calls onChangePassword when Change Password is clicked", () => {
    const store = createTestStore({
      auth: {
        user: mockUsers[0],
        token: "test-token",
        isAuthenticated: true,
        isLoading: false,
      },
    });

    render(
      <TestWrapper store={store}>
        <UserMenu
          onEditProfile={mockOnEditProfile}
          onChangePassword={mockOnChangePassword}
          onLogout={mockOnLogout}
        />
      </TestWrapper>
    );

    const menuButton = screen
      .getByTestId(TEST_IDS.USER_MENU)
      .querySelector("button");
    if (menuButton) {
      fireEvent.click(menuButton);
      const changePasswordButton = screen.getByText("Change Password");
      fireEvent.click(changePasswordButton);
      expect(mockOnChangePassword).toHaveBeenCalledTimes(1);
    }
  });

  it("calls onLogout when logout button is clicked", () => {
    const store = createTestStore({
      auth: {
        user: mockUsers[0],
        token: "test-token",
        isAuthenticated: true,
        isLoading: false,
      },
    });

    render(
      <TestWrapper store={store}>
        <UserMenu
          onEditProfile={mockOnEditProfile}
          onChangePassword={mockOnChangePassword}
          onLogout={mockOnLogout}
        />
      </TestWrapper>
    );

    const logoutButton = screen.getByTestId(TEST_IDS.LOGOUT_BUTTON);
    fireEvent.click(logoutButton);
    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });

  it("closes dropdown when clicking outside", () => {
    const store = createTestStore({
      auth: {
        user: mockUsers[0],
        token: "test-token",
        isAuthenticated: true,
        isLoading: false,
      },
    });

    render(
      <TestWrapper store={store}>
        <div>
          <UserMenu
            onEditProfile={mockOnEditProfile}
            onChangePassword={mockOnChangePassword}
            onLogout={mockOnLogout}
          />
          <div data-testid="outside">Outside</div>
        </div>
      </TestWrapper>
    );

    const menuButton = screen
      .getByTestId(TEST_IDS.USER_MENU)
      .querySelector("button");
    if (menuButton) {
      fireEvent.click(menuButton);
      expect(screen.getByText("Edit Profile")).toBeTruthy();

      const outside = screen.getByTestId("outside");
      fireEvent.mouseDown(outside);
      expect(screen.queryByText("Edit Profile")).not.toBeTruthy();
    }
  });
});
