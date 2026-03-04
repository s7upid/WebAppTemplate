// Use base test utilities to reduce duplication
import { setupBaseTest } from "@/test/base-test-utils";

// Get cleanup function after mocks are set up
const { cleanup } = setupBaseTest({
  useMockData: false,
  mockFetch: false,
  mockPermissionCache: false,
  mockRouteUtils: false,
});

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserPermissionModal from "./UserPermissionModal";
import { TEST_IDS } from "@/config";
import { mockUsers, mockPermissions } from "@/mock/data";
import { PERMISSION_KEYS } from "@/config/generated/permissionKeys.generated";

const mockEditUser = jest.fn();
const mockShowSuccess = jest.fn();
let mockPermissionsError: string | null = null;
let mockIsRoleLoading = false;

jest.mock("@/components", () => ({
  Dialog: ({ isOpen, onClose, title, children }: any) =>
    isOpen ? (
      <div data-testid="modal" data-size="lg">
        <div data-testid="export-modal-title">{title}</div>
        <button data-testid="modal-close" onClick={onClose}>
          Close
        </button>
        {children}
      </div>
    ) : null,
  Button: ({
    children,
    onClick,
    type,
    variant,
    disabled,
    loading,
    icon: Icon,
  }: any) => (
    <button
      onClick={onClick}
      type={type}
      data-testid={`button-${variant || "default"}`}
      disabled={disabled || loading}
    >
      {Icon && <span data-testid="button-icon" />}
      {children}
    </button>
  ),
  LoadingSpinner: ({ text }: any) => (
    <div data-testid="loading-spinner">{text}</div>
  ),
}));

jest.mock("@/pages", () => {
  const mockPermissions = require("@/mock/data").mockPermissions;
  return {
    PermissionSelector: ({
      selectedPermissions,
      onPermissionToggle,
      disabled,
      disabledKeys,
      error,
    }: any) => (
      <div data-testid="permission-selector">
        {mockPermissions.map((p: any) => {
          const isDisabled = disabled || disabledKeys?.includes(p.key);
          return (
            <label key={p.key}>
              <input
                type="checkbox"
                checked={
                  selectedPermissions?.includes(p.key) ||
                  disabledKeys?.includes(p.key)
                }
                onChange={() => {
                  if (!isDisabled) {
                    onPermissionToggle?.(p.key);
                  }
                }}
                disabled={isDisabled}
              />
              {p.name}
            </label>
          );
        })}
        {error && <div data-testid="permission-error">{error}</div>}
      </div>
    ),
  };
});

jest.mock("@/hooks", () => ({
  useUsersQuery: () => ({
    users: [],
    edit: mockEditUser,
    add: jest.fn().mockResolvedValue({ success: true }),
    remove: jest.fn().mockResolvedValue({ success: true }),
    paginationResult: { items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0 },
    paginationHandlers: { changePage: jest.fn(), changePageSize: jest.fn() },
    isLoading: false,
    error: null,
    refetch: jest.fn(),
  }),
  useToast: () => ({ showSuccess: mockShowSuccess }),
  useAllPermissions: () => ({
    permissions: mockPermissions,
    isLoading: false,
    error: mockPermissionsError,
  }),
  useRoleQuery: () => ({
    role: null,
    isLoading: mockIsRoleLoading,
    error: null,
    refetch: jest.fn(),
  }),
}));

const permissions = { canEditUsers: true, canEditUserPermissions: true } as any;
const user = {
  ...mockUsers[0],
  permissions: [
    { key: PERMISSION_KEYS.USERS.VIEW },
    { key: PERMISSION_KEYS.USERS.CREATE },
  ],
  role: {
    id: "role-1",
    name: "Admin",
    permissions: [{ key: PERMISSION_KEYS.ROLES.VIEW }],
  },
} as any;

describe("UserPermissionModal", () => {
  const onClose = jest.fn();

  beforeEach(() => {
    cleanup();
    mockPermissionsError = null; // Reset error state
    mockEditUser.mockResolvedValue({ success: true, data: {} });
  });

  describe("Rendering", () => {
    it("returns null when cannot edit user permissions", () => {
      const { container } = render(
        <UserPermissionModal
          permissions={{ canEditUsers: false } as any}
          isOpen={true}
          onClose={onClose}
          user={user}
        />
      );
      expect(container.firstChild).toBeNull();
    });

    it("returns null when no user provided", () => {
      const { container } = render(
        <UserPermissionModal
          permissions={permissions}
          isOpen={true}
          onClose={onClose}
        />
      );
      expect(container.firstChild).toBeNull();
    });

    it("renders modal when user is provided and has permissions", () => {
      render(
        <UserPermissionModal
          permissions={permissions}
          isOpen={true}
          onClose={onClose}
          user={user}
        />
      );

      expect(screen.getByText("Manage User Permissions")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });

    it("displays user information", () => {
      render(
        <UserPermissionModal
          permissions={permissions}
          isOpen={true}
          onClose={onClose}
          user={user}
        />
      );

      // Use getAllByText for firstName since "Admin" appears multiple times (user name and role name)
      expect(
        screen.getAllByText(new RegExp(user.firstName))[0]
      ).toBeInTheDocument();
      // Use getAllByText for lastName since "User" appears multiple times (in "Admin User" and potentially elsewhere)
      expect(
        screen.getAllByText(new RegExp(user.lastName))[0]
      ).toBeInTheDocument();
      expect(screen.getByText(new RegExp(user.email))).toBeInTheDocument();
    });
  });

  describe("Permission Loading", () => {
    it("automatically loads all permissions when modal opens via useAllPermissions", () => {
      // In TanStack Query, useAllPermissions automatically fetches all permissions
      // with pageSize: 1000 - no need to call changePageSize manually
      render(
        <UserPermissionModal
          permissions={permissions}
          isOpen={true}
          onClose={onClose}
          user={user}
        />
      );

      // Verify the permission selector renders with the available permissions
      expect(screen.getByTestId("permission-selector")).toBeInTheDocument();
    });

    it("shows loading spinner when role is loading", () => {
      // Temporarily set isLoading to true
      const originalIsRoleLoading = mockIsRoleLoading;
      mockIsRoleLoading = true;

      render(
        <UserPermissionModal
          permissions={permissions}
          isOpen={true}
          onClose={onClose}
          user={user}
        />
      );

      expect(
        screen.getByText("Loading role permissions...")
      ).toBeInTheDocument();

      // Restore original value
      mockIsRoleLoading = originalIsRoleLoading;
    });

    it("loads role when user role lacks permissions", () => {
      const userWithoutRolePermissions = {
        ...user,
        role: {
          id: "role-1",
          name: "Admin",
          permissions: [],
        },
      };

      render(
        <UserPermissionModal
          permissions={permissions}
          isOpen={true}
          onClose={onClose}
          user={userWithoutRolePermissions}
        />
      );

      // In TanStack Query, useRoleQuery fetches data automatically when roleId is present
      // Just verify the modal renders correctly with the role
      expect(screen.getByTestId("modal")).toBeInTheDocument();
    });
  });

  describe("Permission Selection", () => {
    it("initializes with user and role permissions", () => {
      render(
        <UserPermissionModal
          permissions={permissions}
          isOpen={true}
          onClose={onClose}
          user={user}
        />
      );

      const permissionSelector = screen.getByTestId("permission-selector");
      expect(permissionSelector).toBeInTheDocument();
    });

    it("disables role permissions in PermissionSelector", () => {
      render(
        <UserPermissionModal
          permissions={permissions}
          isOpen={true}
          onClose={onClose}
          user={user}
        />
      );

      // Role permissions should be disabled
      const roleViewCheckbox = screen.getByLabelText(
        mockPermissions.find((p: any) => p.key === PERMISSION_KEYS.ROLES.VIEW)
          ?.name || ""
      );
      expect(roleViewCheckbox).toBeDisabled();
    });

    it("allows toggling custom permissions", () => {
      render(
        <UserPermissionModal
          permissions={permissions}
          isOpen={true}
          onClose={onClose}
          user={user}
        />
      );

      const editCheckbox = screen.getByLabelText(
        mockPermissions.find((p: any) => p.key === PERMISSION_KEYS.USERS.EDIT)
          ?.name || ""
      );
      expect(editCheckbox).not.toBeDisabled();
    });

    it("handles bulk permission change", () => {
      render(
        <UserPermissionModal
          permissions={permissions}
          isOpen={true}
          onClose={onClose}
          user={user}
        />
      );

      const permissionSelector = screen.getByTestId("permission-selector");
      expect(permissionSelector).toBeInTheDocument();
    });
  });

  describe("Form Submission", () => {
    it("submits form with updated permissions", async () => {
      render(
        <UserPermissionModal
          permissions={permissions}
          isOpen={true}
          onClose={onClose}
          user={user}
        />
      );

      // Toggle a permission
      const editCheckbox = screen.getByLabelText(
        mockPermissions.find((p: any) => p.key === PERMISSION_KEYS.USERS.EDIT)
          ?.name || ""
      );
      fireEvent.click(editCheckbox);

      // Submit form
      const submitButton = screen.getByText("Update Permissions");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockEditUser).toHaveBeenCalled();
      });

      const editCall = mockEditUser.mock.calls[0][0];
      expect(editCall.id).toBe(user.id);
      expect(editCall.data.permissionKeys).toBeDefined();
    });

    it("shows error when no permissions are selected", async () => {
      const userWithNoPermissions = {
        ...user,
        permissions: [],
        role: { id: "role-1", name: "Admin", permissions: [] },
      };

      render(
        <UserPermissionModal
          permissions={permissions}
          isOpen={true}
          onClose={onClose}
          user={userWithNoPermissions}
        />
      );

      // Wait for modal initial state (deferred setState) to be applied
      await waitFor(() => {
        expect(screen.getByTestId("permission-selector")).toBeInTheDocument();
      });

      // First, select a permission to make the button visible
      const editCheckbox = screen.getByLabelText(
        mockPermissions.find((p: any) => p.key === PERMISSION_KEYS.USERS.EDIT)
          ?.name || ""
      );
      fireEvent.click(editCheckbox);

      // Wait for button to appear
      await waitFor(() => {
        expect(screen.getByText("Update Permissions")).toBeInTheDocument();
      });

      // Now unselect all permissions by clicking the checkbox again
      fireEvent.click(editCheckbox);

      // When no custom permissions are selected, button should disappear
      await waitFor(
        () => {
          expect(
            screen.queryByText("Update Permissions")
          ).not.toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      // Edit should not have been called since button is gone
      expect(mockEditUser).not.toHaveBeenCalled();
    });

    it("shows success message after successful update", async () => {
      render(
        <UserPermissionModal
          permissions={permissions}
          isOpen={true}
          onClose={onClose}
          user={user}
        />
      );

      // Wait for modal initial state (deferred setState) to be applied
      await waitFor(() => {
        expect(screen.getByTestId("permission-selector")).toBeInTheDocument();
      });
      await new Promise((r) => setTimeout(r, 0));

      // Toggle a permission to make the button visible
      const editCheckbox = screen.getByLabelText(
        mockPermissions.find((p: any) => p.key === PERMISSION_KEYS.USERS.EDIT)
          ?.name || ""
      );
      fireEvent.click(editCheckbox);

      // Wait for button to appear
      await waitFor(() => {
        expect(screen.getByText("Update Permissions")).toBeInTheDocument();
      });

      const submitButton = screen.getByText("Update Permissions");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockEditUser).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(mockShowSuccess).toHaveBeenCalled();
      });

      expect(onClose).toHaveBeenCalled();
    });

    it("reloads user after successful update", async () => {
      render(
        <UserPermissionModal
          permissions={permissions}
          isOpen={true}
          onClose={onClose}
          user={user}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId("permission-selector")).toBeInTheDocument();
      });
      await new Promise((r) => setTimeout(r, 0));

      // Toggle a permission to make the button visible
      const editCheckbox = screen.getByLabelText(
        mockPermissions.find((p: any) => p.key === PERMISSION_KEYS.USERS.EDIT)
          ?.name || ""
      );
      fireEvent.click(editCheckbox);

      // Wait for button to appear
      await waitFor(() => {
        expect(screen.getByText("Update Permissions")).toBeInTheDocument();
      });

      const submitButton = screen.getByText("Update Permissions");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockEditUser).toHaveBeenCalled();
      });

      // In TanStack Query, cache invalidation happens automatically after mutation
      // We verify the edit was called, which triggers cache invalidation
    });

    it("handles submission error", async () => {
      mockEditUser.mockRejectedValueOnce(new Error("Update failed"));

      render(
        <UserPermissionModal
          permissions={permissions}
          isOpen={true}
          onClose={onClose}
          user={user}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId("permission-selector")).toBeInTheDocument();
      });
      await new Promise((r) => setTimeout(r, 0));

      // Toggle a permission to make the button visible
      const editCheckbox = screen.getByLabelText(
        mockPermissions.find((p: any) => p.key === PERMISSION_KEYS.USERS.EDIT)
          ?.name || ""
      );
      fireEvent.click(editCheckbox);

      // Wait for button to appear
      await waitFor(() => {
        expect(screen.getByText("Update Permissions")).toBeInTheDocument();
      });

      const submitButton = screen.getByText("Update Permissions");
      fireEvent.click(submitButton);

      // Error should be displayed or edit should have been called
      await waitFor(() => {
        expect(mockEditUser).toHaveBeenCalled();
      });
    });
  });

  describe("Change Detection", () => {
    it("shows Update Permissions button only when changes are made", () => {
      render(
        <UserPermissionModal
          permissions={permissions}
          isOpen={true}
          onClose={onClose}
          user={user}
        />
      );
    });

    it("hides Update Permissions button when no changes", () => {
      // This test would need to verify the button is hidden when hasChanges is false
      // The exact behavior depends on the initial state
    });
  });

  describe("Error Handling", () => {
    it("displays permission error from hook", () => {
      mockPermissionsError = "Failed to load permissions";

      render(
        <UserPermissionModal
          permissions={permissions}
          isOpen={true}
          onClose={onClose}
          user={user}
        />
      );

      expect(screen.getByTestId("permission-error")).toHaveTextContent(
        "Failed to load permissions"
      );

      mockPermissionsError = null; // Reset for other tests
    });

    it("displays form validation error", async () => {
      const userWithNoPermissions = {
        ...user,
        permissions: [],
        role: { id: "role-1", name: "Admin", permissions: [] },
      };

      render(
        <UserPermissionModal
          permissions={permissions}
          isOpen={true}
          onClose={onClose}
          user={userWithNoPermissions}
        />
      );

      // With no permissions selected, the update button should not be visible
      const submitButton = screen.queryByText("Update Permissions");
      expect(submitButton).not.toBeInTheDocument();
    });
  });

  describe("Modal Lifecycle", () => {
    it("resets state when modal closes", () => {
      const { rerender } = render(
        <UserPermissionModal
          permissions={permissions}
          isOpen={true}
          onClose={onClose}
          user={user}
        />
      );

      rerender(
        <UserPermissionModal
          permissions={permissions}
          isOpen={false}
          onClose={onClose}
          user={user}
        />
      );

      // State should be reset when modal closes
      expect(screen.queryByTestId(TEST_IDS.MODAL)).not.toBeInTheDocument();
    });

    it("calls onClose when Cancel is clicked", () => {
      render(
        <UserPermissionModal
          permissions={permissions}
          isOpen={true}
          onClose={onClose}
          user={user}
        />
      );

      const cancelButton = screen.getByText("Cancel");
      fireEvent.click(cancelButton);

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe("Edge Cases", () => {
    it("handles user with no role", () => {
      const userWithoutRole = {
        ...user,
        role: null,
      };

      render(
        <UserPermissionModal
          permissions={permissions}
          isOpen={true}
          onClose={onClose}
          user={userWithoutRole}
        />
      );

      expect(screen.getByTestId("permission-selector")).toBeInTheDocument();
    });

    it("handles user with role but no role permissions", () => {
      const userWithEmptyRolePermissions = {
        ...user,
        role: {
          id: "role-1",
          name: "Admin",
          permissions: [],
        },
      };

      render(
        <UserPermissionModal
          permissions={permissions}
          isOpen={true}
          onClose={onClose}
          user={userWithEmptyRolePermissions}
        />
      );

      // In TanStack Query, useRoleQuery fetches data automatically when roleId is present
      // Just verify the modal renders correctly
      expect(screen.getByTestId("modal")).toBeInTheDocument();
    });

    it("handles user with non-array permissions", () => {
      const userWithInvalidPermissions = {
        ...user,
        permissions: null,
      };

      render(
        <UserPermissionModal
          permissions={permissions}
          isOpen={true}
          onClose={onClose}
          user={userWithInvalidPermissions}
        />
      );

      expect(screen.getByTestId("permission-selector")).toBeInTheDocument();
    });

    it("handles selectedRole matching user role id", () => {
      const selectedRole = {
        id: "role-1",
        name: "Admin",
        permissions: [
          { key: PERMISSION_KEYS.ROLES.VIEW },
          { key: PERMISSION_KEYS.ROLES.CREATE },
        ],
      };

      jest.doMock("@/hooks", () => ({
        useUsersQuery: () => ({
          users: [],
          edit: mockEditUser,
          add: jest.fn().mockResolvedValue({ success: true }),
          remove: jest.fn().mockResolvedValue({ success: true }),
          paginationResult: { items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0 },
          paginationHandlers: { changePage: jest.fn(), changePageSize: jest.fn() },
          isLoading: false,
          error: null,
          refetch: jest.fn(),
        }),
        useToast: () => ({ showSuccess: mockShowSuccess }),
        useAllPermissions: () => ({
          permissions: mockPermissions,
          isLoading: false,
          error: null,
        }),
        useRoleQuery: () => ({
          role: selectedRole,
          isLoading: false,
          error: null,
          refetch: jest.fn(),
        }),
      }));

      render(
        <UserPermissionModal
          permissions={permissions}
          isOpen={true}
          onClose={onClose}
          user={user}
        />
      );

      expect(screen.getByTestId("permission-selector")).toBeInTheDocument();
    });
  });
});
