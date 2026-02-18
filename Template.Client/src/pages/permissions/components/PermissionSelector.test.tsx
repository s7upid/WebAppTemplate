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
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PermissionSelector from "./PermissionSelector";
import { PERMISSION_KEYS } from "@/config/generated/permissionKeys.generated";

// Mock console.log to avoid noise in tests
const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

const mockPermissions = [
  {
    key: PERMISSION_KEYS.USERS.VIEW,
    name: "View Users",
    description: "Can view user list",
    category: "users",
  },
  {
    key: PERMISSION_KEYS.USERS.CREATE,
    name: "Create Users",
    description: "Can create new users",
    category: "users",
  },
  {
    key: PERMISSION_KEYS.USERS.EDIT,
    name: "Edit Users",
    description: "Can edit user details",
    category: "users",
  },
  {
    key: PERMISSION_KEYS.USERS.DELETE,
    name: "Delete Users",
    description: "Can delete users",
    category: "users",
  },
  {
    key: PERMISSION_KEYS.ROLES.VIEW,
    name: "View Roles",
    description: "Can view role list",
    category: "roles",
  },
  {
    key: PERMISSION_KEYS.ROLES.CREATE,
    name: "Create Roles",
    description: "Can create new roles",
    category: "roles",
  },
];

// Create a mock hook that can be controlled
let mockUseAllPermissions: ReturnType<typeof jest.fn>;

jest.mock("@/hooks", () => ({
  useAllPermissions: () => mockUseAllPermissions(),
}));

const createMockStore = () => {
  return configureStore({
    reducer: {
      auth: (
        state = {
          user: {
            id: "1",
            email: "test@example.com",
            firstName: "Test",
            lastName: "User",
            role: "admin",
            status: "active",
            permissions: [],
            isActive: true,
            createdAt: "2023-01-01T00:00:00Z",
            updatedAt: "2023-01-01T00:00:00Z",
            lastLogin: "2023-01-01T00:00:00Z",
          },
          isAuthenticated: true,
          token: "mock-token",
          isLoading: false,
          error: null,
        }
      ) => state,
    },
  });
};

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity },
    },
  });

const renderWithProvider = (component: React.ReactElement) => {
  const store = createMockStore();
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>{component}</Provider>
    </QueryClientProvider>
  );
};

describe("PermissionSelector", () => {
  const mockOnPermissionToggle = jest.fn();
  const mockOnBulkPermissionChange = jest.fn();

  beforeEach(() => {
    cleanup(); // Use cleanup from base utilities
    consoleSpy.mockClear();
    mockOnPermissionToggle.mockClear();
    mockOnBulkPermissionChange.mockClear();
    
    // Default mock implementation
    mockUseAllPermissions = jest.fn(() => ({
      permissions: mockPermissions,
      isLoading: false,
      error: null,
    }));
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  describe("Rendering", () => {
    it("renders with selected permissions", () => {
      const selectedPermissions = [PERMISSION_KEYS.USERS.VIEW, PERMISSION_KEYS.USERS.CREATE];

      renderWithProvider(
        <PermissionSelector
          selectedPermissions={selectedPermissions}
          onPermissionToggle={mockOnPermissionToggle}
        />
      );

      expect(screen.getByText("View Users")).toBeInTheDocument();
      expect(screen.getByText("Create Users")).toBeInTheDocument();
      expect(screen.getByText("Edit Users")).toBeInTheDocument();
    });

    it("marks selected permissions as checked", () => {
      const selectedPermissions = [PERMISSION_KEYS.USERS.VIEW, PERMISSION_KEYS.USERS.CREATE];

      renderWithProvider(
        <PermissionSelector
          selectedPermissions={selectedPermissions}
          onPermissionToggle={mockOnPermissionToggle}
        />
      );

      const viewCheckbox = screen.getByLabelText("View Users");
      const createCheckbox = screen.getByLabelText("Create Users");
      const editCheckbox = screen.getByLabelText("Edit Users");

      expect(viewCheckbox).toBeChecked();
      expect(createCheckbox).toBeChecked();
      expect(editCheckbox).not.toBeChecked();
    });

    it("renders empty state when no permissions are available", () => {
      mockUseAllPermissions = jest.fn(() => ({
        permissions: [],
        isLoading: false,
        error: null,
      }));

      renderWithProvider(
        <PermissionSelector
          selectedPermissions={[]}
          onPermissionToggle={mockOnPermissionToggle}
        />
      );

      expect(screen.getByText("No permissions available")).toBeInTheDocument();
    });

    it("renders grouped permissions by category", () => {
      renderWithProvider(
        <PermissionSelector
          selectedPermissions={[]}
          onPermissionToggle={mockOnPermissionToggle}
        />
      );

      expect(screen.getByText("Users")).toBeInTheDocument();
      expect(screen.getByText("Roles")).toBeInTheDocument();
    });
  });

  describe("Loading States", () => {
    it("shows loading spinner when loading and no data", () => {
      mockUseAllPermissions = jest.fn(() => ({
        permissions: [],
        isLoading: true,
        error: null,
      }));

      renderWithProvider(
        <PermissionSelector
          selectedPermissions={[]}
          onPermissionToggle={mockOnPermissionToggle}
        />
      );

      expect(screen.getByText("Loading permissions...")).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("displays error message when permissionsError exists and no data", () => {
      mockUseAllPermissions = jest.fn(() => ({
        permissions: [],
        isLoading: false,
        error: "Failed to load permissions",
      }));

      renderWithProvider(
        <PermissionSelector
          selectedPermissions={[]}
          onPermissionToggle={mockOnPermissionToggle}
        />
      );

      expect(screen.getByText("Error loading permissions")).toBeInTheDocument();
      expect(screen.getAllByText("Failed to load permissions").length).toBeGreaterThan(0);
    });

    it("displays error prop when provided", () => {
      renderWithProvider(
        <PermissionSelector
          selectedPermissions={[]}
          onPermissionToggle={mockOnPermissionToggle}
          error="Custom error message"
        />
      );

      expect(screen.getByText("Custom error message")).toBeInTheDocument();
    });

    it("prioritizes error prop over permissionsError", () => {
      mockUseAllPermissions = jest.fn(() => ({
        permissions: mockPermissions,
        isLoading: false,
        error: "Hook error",
      }));

      renderWithProvider(
        <PermissionSelector
          selectedPermissions={[]}
          onPermissionToggle={mockOnPermissionToggle}
          error="Prop error"
        />
      );

      expect(screen.getByText("Prop error")).toBeInTheDocument();
      expect(screen.queryByText("Hook error")).not.toBeInTheDocument();
    });
  });

  describe("Permission Toggle", () => {
    it("calls onPermissionToggle when permission is toggled", () => {
      const selectedPermissions = [PERMISSION_KEYS.USERS.VIEW];

      renderWithProvider(
        <PermissionSelector
          selectedPermissions={selectedPermissions}
          onPermissionToggle={mockOnPermissionToggle}
        />
      );

      const createCheckbox = screen.getByLabelText("Create Users");
      fireEvent.click(createCheckbox);

      expect(mockOnPermissionToggle).toHaveBeenCalledWith(PERMISSION_KEYS.USERS.CREATE);
    });

    it("calls onPermissionToggle when permission is unchecked", () => {
      const selectedPermissions = [PERMISSION_KEYS.USERS.VIEW, PERMISSION_KEYS.USERS.CREATE];

      renderWithProvider(
        <PermissionSelector
          selectedPermissions={selectedPermissions}
          onPermissionToggle={mockOnPermissionToggle}
        />
      );

      const viewCheckbox = screen.getByLabelText("View Users");
      fireEvent.click(viewCheckbox);

      expect(mockOnPermissionToggle).toHaveBeenCalledWith(PERMISSION_KEYS.USERS.VIEW);
    });

    it("does not call onPermissionToggle for disabled permissions", () => {
      const selectedPermissions = [PERMISSION_KEYS.USERS.VIEW];
      const disabledKeys = [PERMISSION_KEYS.USERS.CREATE];

      renderWithProvider(
        <PermissionSelector
          selectedPermissions={selectedPermissions}
          onPermissionToggle={mockOnPermissionToggle}
          disabledKeys={disabledKeys}
        />
      );

      const createCheckbox = screen.getByLabelText("Create Users");
      expect(createCheckbox).toBeDisabled();
      
      fireEvent.click(createCheckbox);
      expect(mockOnPermissionToggle).not.toHaveBeenCalled();
    });

    it("marks disabled keys as checked even if not in selectedPermissions", () => {
      const selectedPermissions: string[] = [];
      const disabledKeys = [PERMISSION_KEYS.USERS.VIEW];

      renderWithProvider(
        <PermissionSelector
          selectedPermissions={selectedPermissions}
          onPermissionToggle={mockOnPermissionToggle}
          disabledKeys={disabledKeys}
        />
      );

      const viewCheckbox = screen.getByLabelText("View Users");
      expect(viewCheckbox).toBeChecked();
      expect(viewCheckbox).toBeDisabled();
    });
  });

  describe("Bulk Operations", () => {
    it("calls onBulkPermissionChange when Select All is clicked", () => {
      renderWithProvider(
        <PermissionSelector
          selectedPermissions={[]}
          onPermissionToggle={mockOnPermissionToggle}
          onBulkPermissionChange={mockOnBulkPermissionChange}
        />
      );

      const selectAllButton = screen.getByText(/select all/i);
      fireEvent.click(selectAllButton);

      expect(mockOnBulkPermissionChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          PERMISSION_KEYS.USERS.VIEW,
          PERMISSION_KEYS.USERS.CREATE,
          PERMISSION_KEYS.USERS.EDIT,
          PERMISSION_KEYS.USERS.DELETE,
          PERMISSION_KEYS.ROLES.VIEW,
          PERMISSION_KEYS.ROLES.CREATE,
        ])
      );
    });

    it("excludes disabled keys from Select All", () => {
      const disabledKeys = [PERMISSION_KEYS.USERS.VIEW];

      renderWithProvider(
        <PermissionSelector
          selectedPermissions={[]}
          onPermissionToggle={mockOnPermissionToggle}
          onBulkPermissionChange={mockOnBulkPermissionChange}
          disabledKeys={disabledKeys}
        />
      );

      const selectAllButton = screen.getByText(/select all/i);
      fireEvent.click(selectAllButton);

      expect(mockOnBulkPermissionChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          PERMISSION_KEYS.USERS.CREATE,
          PERMISSION_KEYS.USERS.EDIT,
          PERMISSION_KEYS.USERS.DELETE,
          PERMISSION_KEYS.ROLES.VIEW,
          PERMISSION_KEYS.ROLES.CREATE,
        ])
      );
      expect(mockOnBulkPermissionChange).not.toHaveBeenCalledWith(
        expect.arrayContaining([PERMISSION_KEYS.USERS.VIEW])
      );
    });

    it("calls onBulkPermissionChange with empty array when Select None is clicked", () => {
      const selectedPermissions = [PERMISSION_KEYS.USERS.VIEW, PERMISSION_KEYS.USERS.CREATE];

      renderWithProvider(
        <PermissionSelector
          selectedPermissions={selectedPermissions}
          onPermissionToggle={mockOnPermissionToggle}
          onBulkPermissionChange={mockOnBulkPermissionChange}
        />
      );

      const selectNoneButton = screen.getByText(/select none/i);
      fireEvent.click(selectNoneButton);

      expect(mockOnBulkPermissionChange).toHaveBeenCalledWith([]);
    });

    it("uses onPermissionToggle for each permission when onBulkPermissionChange is not provided and Select All", () => {
      renderWithProvider(
        <PermissionSelector
          selectedPermissions={[]}
          onPermissionToggle={mockOnPermissionToggle}
        />
      );

      const selectAllButton = screen.getByText(/select all/i);
      fireEvent.click(selectAllButton);

      expect(mockOnPermissionToggle).toHaveBeenCalledTimes(6);
    });

    it("disables Select All button when all permissions are selected", () => {
      const allPermissionKeys = mockPermissions.map((p) => p.key);

      renderWithProvider(
        <PermissionSelector
          selectedPermissions={allPermissionKeys}
          onPermissionToggle={mockOnPermissionToggle}
        />
      );

      const selectAllButton = screen.getByText(/select all/i);
      expect(selectAllButton).toBeDisabled();
    });

    it("disables Select None button when no permissions are selected", () => {
      renderWithProvider(
        <PermissionSelector
          selectedPermissions={[]}
          onPermissionToggle={mockOnPermissionToggle}
        />
      );

      const selectNoneButton = screen.getByText(/select none/i);
      expect(selectNoneButton).toBeDisabled();
    });
  });

  describe("Disabled State", () => {
    it("disables all checkboxes when disabled prop is true", () => {
      renderWithProvider(
        <PermissionSelector
          selectedPermissions={[]}
          onPermissionToggle={mockOnPermissionToggle}
          disabled={true}
        />
      );

      const checkboxes = screen.getAllByRole("checkbox");
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toBeDisabled();
      });
    });

    it("disables bulk operation buttons when disabled", () => {
      renderWithProvider(
        <PermissionSelector
          selectedPermissions={[]}
          onPermissionToggle={mockOnPermissionToggle}
          disabled={true}
        />
      );

      const selectAllButton = screen.getByText(/select all/i);
      const selectNoneButton = screen.getByText(/select none/i);

      expect(selectAllButton).toBeDisabled();
      expect(selectNoneButton).toBeDisabled();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty permissions array gracefully", () => {
      mockUseAllPermissions = jest.fn(() => ({
        permissions: [],
        isLoading: false,
        error: null,
      }));

      renderWithProvider(
        <PermissionSelector
          selectedPermissions={[]}
          onPermissionToggle={mockOnPermissionToggle}
        />
      );

      expect(screen.getByText("No permissions available")).toBeInTheDocument();
    });

    it("handles permissions with empty category gracefully", () => {
      const permissionsWithoutCategory = [
        {
          key: PERMISSION_KEYS.USERS.VIEW,
          name: "View Users",
          description: "Can view user list",
          category: "",
        },
      ];

      mockUseAllPermissions = jest.fn(() => ({
        permissions: permissionsWithoutCategory,
        isLoading: false,
        error: null,
      }));

      renderWithProvider(
        <PermissionSelector
          selectedPermissions={[]}
          onPermissionToggle={mockOnPermissionToggle}
        />
      );

      expect(screen.getByText("View Users")).toBeInTheDocument();
    });
  });
});
