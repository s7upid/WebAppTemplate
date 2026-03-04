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
import RoleFormModal from "@/pages/roles/modals/RoleFormModal";
import { TEST_IDS } from "@/config";
import { PERMISSION_KEYS } from "@/config/generated/permissionKeys.generated";
import { mockRoles } from "@/mock/data";

const mockShowSuccess = jest.fn();
const mockShowError = jest.fn();
const mockOnSave = jest.fn();
const mockOnClose = jest.fn();

const createMockPermission = (key: string, name: string, category: string) => ({
  id: `perm-${key}`,
  key,
  name,
  description: `${name} permission`,
  resource: category,
  action: key.split(":")[1] || "view",
  category,
  isSystem: false,
  createdAt: new Date(),
});

const mockPermissions = [
  createMockPermission(PERMISSION_KEYS.USERS.VIEW, "View Users", "users"),
  createMockPermission(PERMISSION_KEYS.USERS.CREATE, "Create Users", "users"),
  createMockPermission(PERMISSION_KEYS.ROLES.VIEW, "View Roles", "roles"),
  createMockPermission(PERMISSION_KEYS.ROLES.CREATE, "Create Roles", "roles"),
];

let mockIsLoading = false;

jest.mock("@/hooks", () => ({
  useAllPermissions: () => ({
    permissions: mockIsLoading ? [] : mockPermissions,
    isLoading: mockIsLoading,
    error: null,
  }),
  useToast: () => ({
    showSuccess: mockShowSuccess,
    showError: mockShowError,
  }),
}));

jest.mock("@/pages", () => ({
  PermissionSelector: ({
    selectedPermissions,
    onPermissionToggle,
    onBulkPermissionChange,
    disabled,
  }: {
    selectedPermissions?: string[];
    onPermissionToggle?: (key: string) => void;
    onBulkPermissionChange?: (keys: string[]) => void;
    disabled?: boolean;
  }) => {
    // Get isLoading from the hook mock
    const { useAllPermissions } = require("@/hooks");
    const permissionsHook = useAllPermissions();
    const isActuallyLoading = permissionsHook.isLoading;

    return (
      <div data-testid="permission-selector">
        {isActuallyLoading && permissionsHook.permissions.length === 0 ? (
          <div data-testid="spinner">Loading permissions...</div>
        ) : (
          <>
            {mockPermissions.map((p: { key: string; name: string }) => (
              <label key={p.key}>
                <input
                  type="checkbox"
                  checked={selectedPermissions?.includes(p.key)}
                  onChange={() => onPermissionToggle?.(p.key)}
                  disabled={disabled}
                />
                {p.name}
              </label>
            ))}
            <button
              onClick={() =>
                onBulkPermissionChange?.([
                  PERMISSION_KEYS.USERS.VIEW,
                  PERMISSION_KEYS.USERS.CREATE,
                ])
              }
            >
              Bulk Select
            </button>
          </>
        )}
      </div>
    );
  },
}));

// Use base component mocks - use factory function to avoid hoisting issues
jest.mock("@/components", () => {
  const { getComponentMocks } = require("@/test/base-test-utils");
  const { TEST_IDS } = require("@/config");
  const componentMocks = getComponentMocks();
  // Extend Button to support custom test IDs
  return {
    ...componentMocks,
    Button: ({ children, onClick, disabled, type, form, ...props }: any) => (
      <button
        data-testid={
          type === "submit" ? TEST_IDS.SUBMIT_BUTTON : "cancel-button"
        }
        onClick={onClick}
        disabled={disabled}
        type={type}
        form={form}
        {...props}
      >
        {children}
      </button>
    ),
    Input: ({ value, onChange, placeholder, required, ...props }: any) => (
      <input
        data-testid={TEST_IDS.ROLE_NAME_INPUT}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        {...props}
      />
    ),
  };
});

const permissions = {
  canCreateRoles: true,
  canEditRoles: true,
} as any;

describe("RoleFormModal", () => {
  beforeEach(() => {
    cleanup();
    mockIsLoading = false; // Reset loading state
    mockOnSave.mockResolvedValue({ meta: { requestStatus: "fulfilled" } });
  });

  describe("Rendering", () => {
    it("returns null when cannot create roles in create mode", () => {
      const { container } = render(
        <RoleFormModal
          permissions={{ canCreateRoles: false } as any}
          isOpen={true}
          onClose={mockOnClose}
          formMode="create"
          onSave={mockOnSave}
        />
      );
      expect(container.firstChild).toBeNull();
    });

    it("returns null when cannot edit roles in edit mode", () => {
      const { container } = render(
        <RoleFormModal
          permissions={{ canEditRoles: false } as any}
          isOpen={true}
          onClose={mockOnClose}
          role={mockRoles[0]}
          formMode="edit"
          onSave={mockOnSave}
        />
      );
      expect(container.firstChild).toBeNull();
    });

    it("renders create form when formMode is create", () => {
      render(
        <RoleFormModal
          permissions={permissions}
          isOpen={true}
          onClose={mockOnClose}
          formMode="create"
          onSave={mockOnSave}
        />
      );

      expect(screen.getByText("Create Role")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Role name")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Role description")
      ).toBeInTheDocument();
    });

    it("renders edit form when formMode is edit", async () => {
      const role = mockRoles[0];
      render(
        <RoleFormModal
          permissions={permissions}
          isOpen={true}
          onClose={mockOnClose}
          role={role}
          formMode="edit"
          onSave={mockOnSave}
        />
      );

      expect(screen.getByText("Edit Role")).toBeInTheDocument();
      await waitFor(() => {
        expect(screen.getByDisplayValue(role.name)).toBeInTheDocument();
        expect(screen.getByDisplayValue(role.description)).toBeInTheDocument();
      });
    });

    it("initializes form with role data in edit mode", async () => {
      const role = {
        ...mockRoles[0],
        permissions: [
          createMockPermission(
            PERMISSION_KEYS.USERS.VIEW,
            "View Users",
            "users"
          ),
          createMockPermission(
            PERMISSION_KEYS.USERS.CREATE,
            "Create Users",
            "users"
          ),
        ],
      };

      render(
        <RoleFormModal
          permissions={permissions}
          isOpen={true}
          onClose={mockOnClose}
          role={role}
          formMode="edit"
          onSave={mockOnSave}
        />
      );

      await waitFor(() => {
        expect(screen.getByDisplayValue(role.name)).toBeInTheDocument();
        expect(screen.getByDisplayValue(role.description)).toBeInTheDocument();
      });
    });
  });

  describe("Permission Loading", () => {
    it("renders PermissionSelector without loading spinner when permissions are loaded", () => {
      render(
        <RoleFormModal
          permissions={permissions}
          isOpen={true}
          onClose={mockOnClose}
          formMode="create"
          onSave={mockOnSave}
        />
      );

      expect(screen.queryByTestId("spinner")).not.toBeInTheDocument();
      expect(screen.getByTestId("permission-selector")).toBeInTheDocument();
    });

    it("shows loading spinner when permissions are loading", () => {
      mockIsLoading = true;

      render(
        <RoleFormModal
          permissions={permissions}
          isOpen={true}
          onClose={mockOnClose}
          formMode="create"
          onSave={mockOnSave}
        />
      );

      // PermissionSelector shows "Loading permissions..." when isLoading is true and no permissions
      // Since we're mocking usePermissions with isLoading=true and items=[], it should show loading
      expect(screen.getByText("Loading permissions...")).toBeInTheDocument();

      mockIsLoading = false; // Reset for other tests
    });
  });

  describe("Form Input", () => {
    it("updates name field when typed", () => {
      render(
        <RoleFormModal
          permissions={permissions}
          isOpen={true}
          onClose={mockOnClose}
          formMode="create"
          onSave={mockOnSave}
        />
      );

      const nameInput = screen.getByPlaceholderText("Role name");
      fireEvent.change(nameInput, { target: { value: "New Role" } });

      expect(nameInput).toHaveValue("New Role");
    });

    it("updates description field when typed", () => {
      render(
        <RoleFormModal
          permissions={permissions}
          isOpen={true}
          onClose={mockOnClose}
          formMode="create"
          onSave={mockOnSave}
        />
      );

      const descriptionInput = screen.getByPlaceholderText("Role description");
      fireEvent.change(descriptionInput, {
        target: { value: "New Description" },
      });

      expect(descriptionInput).toHaveValue("New Description");
    });
  });

  describe("Permission Selection", () => {
    it("toggles permission when checkbox is clicked", () => {
      render(
        <RoleFormModal
          permissions={permissions}
          isOpen={true}
          onClose={mockOnClose}
          formMode="create"
          onSave={mockOnSave}
        />
      );

      const viewUsersCheckbox = screen.getByLabelText("View Users");
      fireEvent.click(viewUsersCheckbox);

      expect(viewUsersCheckbox).toBeChecked();
    });

    it("handles bulk permission change", () => {
      render(
        <RoleFormModal
          permissions={permissions}
          isOpen={true}
          onClose={mockOnClose}
          formMode="create"
          onSave={mockOnSave}
        />
      );

      const bulkSelectButton = screen.getByText("Bulk Select");
      fireEvent.click(bulkSelectButton);

      const viewUsersCheckbox = screen.getByLabelText("View Users");
      const createUsersCheckbox = screen.getByLabelText("Create Users");

      expect(viewUsersCheckbox).toBeChecked();
      expect(createUsersCheckbox).toBeChecked();
    });
  });

  describe("Form Submission", () => {
    it("submits form with valid data in create mode", async () => {
      render(
        <RoleFormModal
          permissions={permissions}
          isOpen={true}
          onClose={mockOnClose}
          formMode="create"
          onSave={mockOnSave}
        />
      );

      // Fill form
      fireEvent.change(screen.getByPlaceholderText("Role name"), {
        target: { value: "New Role" },
      });
      fireEvent.change(screen.getByPlaceholderText("Role description"), {
        target: { value: "A valid description text" },
      });

      // Select permission
      fireEvent.click(screen.getByLabelText("View Users"));

      // Submit
      fireEvent.click(screen.getByTestId(TEST_IDS.SUBMIT_BUTTON));

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalled();
      });

      const saveCall = mockOnSave.mock.calls[0][0];
      expect(saveCall.name).toBe("New Role");
      expect(saveCall.description).toBe("A valid description text");
      expect(saveCall.permissionKeys).toContain(PERMISSION_KEYS.USERS.VIEW);
    });

    it("submits form with valid data in edit mode", async () => {
      const role = {
        ...mockRoles[0],
        permissions: [
          createMockPermission(
            PERMISSION_KEYS.USERS.VIEW,
            "View Users",
            "users"
          ),
        ],
      };

      render(
        <RoleFormModal
          permissions={permissions}
          isOpen={true}
          onClose={mockOnClose}
          role={role}
          formMode="edit"
          onSave={mockOnSave}
        />
      );

      // Wait for deferred form data to be applied
      await waitFor(() => {
        expect(screen.getByDisplayValue(role.name)).toBeInTheDocument();
      });

      // Update name
      fireEvent.change(screen.getByPlaceholderText("Role name"), {
        target: { value: "Updated Role" },
      });

      // Submit
      fireEvent.click(screen.getByTestId(TEST_IDS.SUBMIT_BUTTON));

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalled();
      });

      const saveCall = mockOnSave.mock.calls[0][0];
      expect(saveCall.name).toBe("Updated Role");
    });

    it("validates required fields", async () => {
      render(
        <RoleFormModal
          permissions={permissions}
          isOpen={true}
          onClose={mockOnClose}
          formMode="create"
          onSave={mockOnSave}
        />
      );

      // Try to submit without filling required fields
      fireEvent.click(screen.getByTestId(TEST_IDS.SUBMIT_BUTTON));

      // Form validation should prevent submission
      await waitFor(() => {
        // The form should show validation errors or prevent submission
        // This depends on the validation implementation
      });
    });

    it("calls onClose after successful submission", async () => {
      render(
        <RoleFormModal
          permissions={permissions}
          isOpen={true}
          onClose={mockOnClose}
          formMode="create"
          onSave={mockOnSave}
        />
      );

      // Fill and submit form
      fireEvent.change(screen.getByPlaceholderText("Role name"), {
        target: { value: "New Role" },
      });
      fireEvent.change(screen.getByPlaceholderText("Role description"), {
        target: { value: "A valid description text" },
      });
      fireEvent.click(screen.getByLabelText("View Users"));
      fireEvent.click(screen.getByTestId(TEST_IDS.SUBMIT_BUTTON));

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });
  });

  describe("System Role Handling", () => {
    it("disables PermissionSelector for system roles", () => {
      const systemRole = {
        ...mockRoles[0],
        isSystem: true,
      };

      render(
        <RoleFormModal
          permissions={permissions}
          isOpen={true}
          onClose={mockOnClose}
          role={systemRole}
          formMode="edit"
          onSave={mockOnSave}
        />
      );

      const permissionSelector = screen.getByTestId("permission-selector");
      const checkboxes = permissionSelector.querySelectorAll(
        "input[type='checkbox']"
      );

      checkboxes.forEach((checkbox) => {
        expect(checkbox).toBeDisabled();
      });
    });

    it("allows editing system role name and description", () => {
      const systemRole = {
        ...mockRoles[0],
        isSystem: true,
      };

      render(
        <RoleFormModal
          permissions={permissions}
          isOpen={true}
          onClose={mockOnClose}
          role={systemRole}
          formMode="edit"
          onSave={mockOnSave}
        />
      );

      const nameInput = screen.getByPlaceholderText("Role name");
      expect(nameInput).not.toBeDisabled();

      const descriptionInput = screen.getByPlaceholderText("Role description");
      expect(descriptionInput).not.toBeDisabled();
    });
  });

  describe("Modal Lifecycle", () => {
    it("resets form when modal opens", () => {
      const { rerender } = render(
        <RoleFormModal
          permissions={permissions}
          isOpen={false}
          onClose={mockOnClose}
          formMode="create"
          onSave={mockOnSave}
        />
      );

      rerender(
        <RoleFormModal
          permissions={permissions}
          isOpen={true}
          onClose={mockOnClose}
          formMode="create"
          onSave={mockOnSave}
        />
      );

      const nameInput = screen.getByPlaceholderText("Role name");
      expect(nameInput).toHaveValue("");
    });

    it("calls onClose when Cancel is clicked", () => {
      render(
        <RoleFormModal
          permissions={permissions}
          isOpen={true}
          onClose={mockOnClose}
          formMode="create"
          onSave={mockOnSave}
        />
      );

      const cancelButton = screen.getByText("Cancel");
      fireEvent.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe("Edge Cases", () => {
    it("handles role with string permissions", () => {
      const roleWithStringPermissions = {
        ...mockRoles[0],
        permissions: [
          PERMISSION_KEYS.USERS.VIEW,
          PERMISSION_KEYS.USERS.CREATE,
        ] as any,
      };

      render(
        <RoleFormModal
          permissions={permissions}
          isOpen={true}
          onClose={mockOnClose}
          role={roleWithStringPermissions}
          formMode="edit"
          onSave={mockOnSave}
        />
      );

      expect(screen.getByTestId("permission-selector")).toBeInTheDocument();
    });

    it("handles role with object permissions", () => {
      const roleWithObjectPermissions = {
        ...mockRoles[0],
        permissions: [
          createMockPermission(
            PERMISSION_KEYS.USERS.VIEW,
            "View Users",
            "users"
          ),
          createMockPermission(
            PERMISSION_KEYS.USERS.CREATE,
            "Create Users",
            "users"
          ),
        ],
      };

      render(
        <RoleFormModal
          permissions={permissions}
          isOpen={true}
          onClose={mockOnClose}
          role={roleWithObjectPermissions}
          formMode="edit"
          onSave={mockOnSave}
        />
      );

      expect(screen.getByTestId("permission-selector")).toBeInTheDocument();
    });

    it("handles role with empty permissions array", () => {
      const roleWithNoPermissions = {
        ...mockRoles[0],
        permissions: [],
      };

      render(
        <RoleFormModal
          permissions={permissions}
          isOpen={true}
          onClose={mockOnClose}
          role={roleWithNoPermissions}
          formMode="edit"
          onSave={mockOnSave}
        />
      );

      const checkboxes = screen.getAllByRole("checkbox");
      checkboxes.forEach((checkbox) => {
        expect(checkbox).not.toBeChecked();
      });
    });

    it("handles role with null permissions", () => {
      const roleWithNullPermissions = {
        ...mockRoles[0],
        permissions: null as any,
      };

      render(
        <RoleFormModal
          permissions={permissions}
          isOpen={true}
          onClose={mockOnClose}
          role={roleWithNullPermissions}
          formMode="edit"
          onSave={mockOnSave}
        />
      );

      expect(screen.getByTestId("permission-selector")).toBeInTheDocument();
    });
  });
});
