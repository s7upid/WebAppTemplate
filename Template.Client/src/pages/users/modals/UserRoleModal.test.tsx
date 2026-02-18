// Use base test utilities to reduce duplication
import { setupBaseTest, getComponentMocks } from "@/test/base-test-utils";

// Get cleanup function after mocks are set up
const { cleanup } = setupBaseTest({
  useMockData: false,
  mockFetch: false,
  mockPermissionCache: false,
  mockRouteUtils: false,
});

import { render, screen, fireEvent } from "@testing-library/react";
import UserRoleModal from "./UserRoleModal";
import { mockUsers } from "@/mock/data";

jest.mock("@/pages", () => ({
  RolePermissionsSection: ({ role }: { role?: { name: string } }) => (
    <div data-testid="role-permissions-section">
      {role ? `Permissions for ${role.name}` : "Loading..."}
    </div>
  ),
}));

// Use base component mocks with factory function to avoid hoisting issues
jest.mock("@/components", () => getComponentMocks());

jest.mock("@/hooks", () => ({
  useRolesQuery: () => ({
    roles: [
      { id: "1", name: "admin" },
      { id: "2", name: "user" },
    ],
    isLoading: false,
    paginationHandlers: { refreshWithCurrentFilters: jest.fn() },
  }),
  useUsersQuery: () => ({ 
    edit: jest.fn().mockResolvedValue({ success: true }),
    refetch: jest.fn(),
  }),
  useToast: () => ({ showSuccess: jest.fn() }),
}));

const permissions = { canEditUsers: true, canEditUserRoles: true } as Record<string, boolean>;
const user = mockUsers[1];

describe("UserRoleModal", () => {
  const onClose = jest.fn();

  beforeEach(() => {
    cleanup();
  });

  it("renders and changes role", async () => {
    render(
      <UserRoleModal
        permissions={permissions as unknown as Parameters<typeof UserRoleModal>[0]["permissions"]}
        isOpen={true}
        onClose={onClose}
        user={user as Parameters<typeof UserRoleModal>[0]["user"]}
      />
    );

    const select = screen.getByRole("combobox") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "1" } });
    expect(select.value).toBe("1");
  });

  it("returns null when cannot edit roles", () => {
    const { container } = render(
      <UserRoleModal
        permissions={{ canEditUsers: false } as unknown as Parameters<typeof UserRoleModal>[0]["permissions"]}
        isOpen={true}
        onClose={onClose}
        user={user as Parameters<typeof UserRoleModal>[0]["user"]}
      />
    );
    expect(container.firstChild).toBeNull();
  });
});
